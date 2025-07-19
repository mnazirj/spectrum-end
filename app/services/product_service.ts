import Product from "#models/product"
import ProductImage from "#models/product_image"
import ProductProprety from "#models/product_proprety"
import { createNewProduct, createNewProductPropreties, updateProduct } from "#validators/dashboard"
import { MultipartFile } from "@adonisjs/core/bodyparser"
import app from "@adonisjs/core/services/app"
import { productPayload, propretiesPayload } from "@/types/index.js"

import drive from '@adonisjs/drive/services/main'
import db from "@adonisjs/lucid/services/db"
import { TransactionClientContract } from "@adonisjs/lucid/types/database"
import Category from "#models/category"
import SubCategory from "#models/sub_category"
import ItemSubCategories from "#models/sub_category_item"
import { DateTime } from "luxon"
import Brand from "#models/brand"


export class ProductService {
  static allowedImageTypes = ['jpeg', 'png', 'jpg', 'avif']
  static async getAllProducts(): Promise<{
    availability: boolean;
    hasProprety: boolean;
  }[]> {
    const products = await Product.query()
      .preload('brand', (q) => q.select(['id', 'title', 'arName']))
      .preload('category', (q) => q.select(['id', 'title', 'arName', 'description', 'arDescription']))
      .preload('subCategory', (q) => q.select(['id', 'title', 'arName']))
      .preload('itemsCategory', (q) => q.select(['id', 'title', 'arName']))
      .preload('propreties', (q) => q.select(['id', 'type', 'value', 'price']))
      .preload('images', (q) => q.select(['id', 'image']))
      .preload('review')
    const serialized = products.map((product) => {
      return {
        ...product.toJSON(),
        availability: product.quantity > 0,
        hasProprety: product.propreties.length > 0 ? true : false,
      }
    })
    return serialized
  }

  static async findBySlug(slug: string): Promise<{} | false> {
    const product = await Product.query().where('slug', slug)
      .preload('brand', (q) => q.select('title', 'arName', 'slug'))
      .preload('propreties', (q) => q.select('type', 'value', 'price'))
      .preload('review', (q) => q.preload('user', (q) => q.select('firstName', 'lastName')))
      .preload('images', (q) => q.select('image')).first()
    if (!product) return false
    const simillarProduct = await Product.query()
      .where('brandId', product.brandId).where('slug', '!=', product.slug).limit(10)
      .preload('brand', (q) => q.select('title', 'arName', 'slug'))
      .preload('propreties', (q) => q.select('type', 'value', 'price')).preload('images', (q) => q.select('image')).preload('review')

    var totalStart = 0
    for (var rate of product.review) {
      totalStart += rate.stars
    }

    return {
      product,
      stars: await this.#calculateRating(product),
      simillarProduct: await Promise.all(
        simillarProduct.map(async (p) => {
          return {
            name: p.name,
            arName: p.arName,
            stars: await this.#calculateRating(p),
            rate: 0,
            sizes: p.propreties.length > 0 ? p.propreties.map((prop) => prop.value) : 0,
            price: p.propreties.length > 0 ? p.propreties[0].price : p.price,
            image: p.images[0]?.image,
            tags: p.exclusive ? ["Exclusive"] : null,
            slug: p.slug,
            review: p.review
          }
        })
      )
    }
  }

  static async create(payload: productPayload, images: MultipartFile[] = [], propreties: propretiesPayload[] = []) {
    // Validate product payload
    const data = await createNewProduct.validate(payload)
    const trx = await db.transaction()
    try {
      // Create product
      const product = await Product.create({ ...data, slug: data.name.replaceAll(' ', '_').toLocaleLowerCase() }, { client: trx })


      // Handle properties
      if (propreties.length) {
        await createNewProductPropreties.validate(propreties)
        for (const prop of propreties) {
          await ProductProprety.create({
            productId: product.id,
            type: prop.type,
            value: prop.value,
            price: prop.price,
          }, { client: trx })
        }
      }

      // Handle images
      if (images.length) {
        const status = await this.#uploadImages(images, product.id, trx)
        if (status.code === 400) {
          throw new Error(status.message)
        }
      }
      trx.commit()
      return product
    }
    catch {
      trx.rollback()
      return false
    }
  }

  static async update(productId: number, payload: productPayload, images: MultipartFile[], deletedImages: number[], propreties: propretiesPayload[], deletedPropreties: number[], hasProprety: boolean) {
    // Validate product payload
    const data = await updateProduct.validate(payload)
    const trx = await db.transaction()
    try {
      const product = await Product.findOrFail(productId, { client: trx })
      if (!product) throw new Error('Could not find record with given id')

      product.merge({ ...data, slug: data.name?.replaceAll(' ', '_').toLocaleLowerCase() })

      await product.save()
      // Handle images
      if (images.length) {
        const status = await this.#uploadImages(images, productId, trx)
        if (status.code === 400) throw new Error(status.message)
      }
      if (deletedImages.length) {
        await this.#deleteImage(deletedImages, trx)
      }
      // Handle properties
      if (propreties.length) {
        await createNewProductPropreties.validate(propreties)

        for (const prop of propreties) {
          await ProductProprety.updateOrCreate(
            { id: prop.id ?? 0 },
            {
              productId,
              type: prop.type,
              value: prop.value,
              price: prop.price,
            },
            { client: trx }
          )
        }
      }
      if (!hasProprety) {
        await this.#clearAllProps(productId, trx)
      }
      else if (deletedPropreties.length) {
        await this.#deletePropsByIds(deletedPropreties, trx)
      }
      trx.commit()
      return product
    }
    catch {
      trx.rollback()
      return false
    }
  }

  static async destroy(productId: number): Promise<boolean> {
    try {
      const product = await Product.find(productId)
      if (!product) return false;
      await product.delete()
      return true
    }
    catch {
      return false;
    }
  }

  static async #uploadImages(images: MultipartFile[], productId: number, trx: TransactionClientContract) {

    for (const image of images) {
      if (!image.extname || !this.allowedImageTypes.includes(image.extname)) {
        continue
      }
      const fileName = `${Date.now()}_product.${image.extname}`
      await ProductImage.create({
        productId: productId,
        image: fileName,
      }, { client: trx })
      await image.move(app.makePath('storage/products/images'), { name: fileName })
    }

    return { code: 200, message: 'Images uploaded' }
  }

  static async #deleteImage(ids: number[], trx: TransactionClientContract) {
    for (const item of ids) {
      const img = await ProductImage.findOrFail(item, { client: trx })
      // if (!img) continue;
      const disk = await drive.use()
      await disk.delete(img.image)
      await img.delete()
    }
  }

  static async #deletePropsByIds(ids: number[], trx: TransactionClientContract) {
    await ProductProprety.query({ client: trx }).whereIn('id', ids).delete()
  }

  static async #formatOutput(payload: Product[]) {
    return await Promise.all(
      payload.map(async (p) => {
        const jsonProduct = p.toJSON()
        return {
          ...jsonProduct,
          image: jsonProduct.images?.[0].image || null,
          stars: await this.#calculateRating(p),
        }
      })
    )
  }


  static async #clearAllProps(productId: number, trx: TransactionClientContract) {
    await ProductProprety.query({ client: trx }).where('productId', productId).delete()
  }

  static async #calculateRating(product: Product) {
    var totalStart = 0
    for (var rate of product.review) {
      totalStart += rate.stars
    }
    return totalStart / product.review.length
  }


  static async getProductByType(type: string, slug: string) {
    var products = null;
    if (type == 'category') {
      const record = await Category.findBy('slug', slug)
      if (!record) return
      products = await Product.query().where('categoryId', record!.id)
        .preload('brand').preload('images').preload('propreties').preload('review').preload('category')
    }
    else if (type == 'sub') {
      const record = await SubCategory.findBy('slug', slug)
      if (!record) return
      products = await Product.query().where('subCategoryId', record!.id)
        .preload('brand').preload('images').preload('propreties').preload('review')
    }
    else if (type == 'items') {
      const record = await ItemSubCategories.findBy('slug', slug)
      if (!record) return
      products = await Product.query().where('itemsId', record!.id)
        .preload('brand').preload('images').preload('propreties').preload('review')
    }
    else if (type == 'brand') {
      const record = await Brand.findBy('slug', slug)
      if (!record) return
      products = await Product.query().where('brandId', record!.id)
        .preload('images').preload('propreties').preload('review')
    }


    if (products == null) return;

    const prices = products.map((p) => {
      if (p.propreties.length > 0) return p.propreties[0].price
      else return p.price
    })
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    const productsWithRating = products.map((p) => {
      const total = p.review.reduce((sum, r) => sum + (r?.stars ?? 0), 0)
      const average = p.review.length ? total / p.review.length : 0

      return {
        ...p.toJSON(),     // copy all columns & preloaded relations
        stars: average // <- new field lives next to them
      }
    })
    return {
      products: productsWithRating, minPrice, maxPrice
    }
  }

  static async getNewBestProduct() {
    const weekAgoDate = DateTime.now().minus({ days: 7 }).toISO()

    const newProducts = await Product.query().where('created_at', '>=', weekAgoDate)
      .preload('brand')
      .preload('images')
      .preload('review')
      .preload('propreties')

    const topProducts = await Product.query()
      .orderBy('sell_count', 'desc')
      .limit(10)
      .preload('brand')
      .preload('images')
      .preload('review')
      .preload('propreties')

    const brands = await Brand.query().select('title', 'slug').limit(6)

    return {
      new: await this.#formatOutput(newProducts),
      top: await this.#formatOutput(topProducts),
      brands
    }
  }
}