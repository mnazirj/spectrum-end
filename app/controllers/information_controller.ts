import type { HttpContext } from '@adonisjs/core/http'

import Category from '#models/category'
import { BrandService } from '#services/brand_service'
import { AccountService } from '#services/account_service'
import { ProductService } from '#services/product_service'

export default class InformationController {
  async homePageInfo({ response }: HttpContext): Promise<void> {
    const categories = await Category.query().select('id', 'title', 'arName', 'slug')
      .preload('sub_category', (subCategoryQuery) =>
        subCategoryQuery.select('id', 'title', 'arName', 'slug')
          .preload('items', (q) => q.select('title', 'arName', 'slug'))
      )

    const serialized = categories.map((category) => {
      return {
        label: category.title,
        arLabel: category.arName,
        slug: category.slug,
        items: category.sub_category?.map((sub: any) => ({
          label: sub.title,
          arLabel: sub.arName,
          slug: sub.slug,
          items: sub.items.length ? sub.items?.map((item: any) => item) : null,
        })),
      }
    })
    const brandsList = await BrandService.getAllBrands()
    const brands = {
      label: 'Brands',
      arLabel: 'العلامات التجارية',
      slug: 'brands',
      items: brandsList.map(brand => ({
        label: brand.title,
        arLabel: brand.arName,
        slug: brand.slug,
        items: null
      }))
    };
    serialized.push(brands);
    return response.status(200).json({
      menu: serialized,

    })
  }

  async fetchNewProduct({ response }: HttpContext): Promise<void> {
    const data = await ProductService.getNewBestProduct()
    return response.ok(data)
  }

  async getAccountDetails({ auth, response }: HttpContext): Promise<void> {
    const user = await auth.authenticate()
    await user.load('address')
    return response.ok(user)
  }

  async updateAcconut({ auth, request, response }: HttpContext): Promise<void> {
    const user = await auth.authenticate()
    const payload = request.body()
    const status = await AccountService.update(payload, user)
    if (!status.success) return response.badRequest({ message: status.message })
    return response.ok({ message: status.message })
  }

  async newAddress({ auth, request, response }: HttpContext): Promise<void> {
    const user = await auth.authenticate()
    const payload = request.body()
    const status = await AccountService.createAddress(user, payload)
    if (!status.success) return response.badRequest({ message: status.message })
    return response.created({ message: status.message })
  }

  async destroy({ auth, request, response }: HttpContext): Promise<void> {
    const user = await auth.authenticate()
    const addressId = request.params().id
    const status = await AccountService.deleteAddress(user.id, addressId)
    if (!status.success) return response.badRequest({ message: status.message })
    return response.ok({ message: status.message })

  }

  async test({ request, response }: HttpContext) {
    const type = request.params().type
    const slug = request.params().slug
    const products = await ProductService.getProductByType(type, slug)
    return response.ok(products)
  }
}
