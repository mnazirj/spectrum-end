import { ProductService } from '#services/product_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  //Return all Products
  async index({ response }: HttpContext): Promise<void> {
    return response.ok(await ProductService.getAllProducts())
  }

  async getProductBySlug({ request, response }: HttpContext): Promise<void> {
    const slug = decodeURIComponent(request.params().slug)
    const product = await ProductService.findBySlug(slug)
    if (!product) return response.notFound({ message: 'Could not find product!' })
    return response.ok(product)
  }

  async create({ request, response }: HttpContext): Promise<void> {
    try {
      const payload = request.only([
        'name', 'arName', 'description', 'arDescription',
        'ingredients', 'arIngredients', 'tips', 'arTips',
        'notes', 'arNotes', 'quantity', 'price', 'discount',
        'brandId', 'categoryId', 'subCategoryId', 'itemsId', 'gender'
      ])
      const images = request.files('image', {
        extnames: ['jpg', 'png', 'jpeg'],
      }) || []
      const propreties = request.input('propreties')
        ? JSON.parse(JSON.stringify(request.input('propreties')))
        : []
      await ProductService.create(payload, images, propreties)
      return response.created({ message: 'Successfully created new Product' })
    }
    catch (error) {
      return response.status(400).json({
        message: error.message || 'Something went wrong',
      })
    }
  }

  async update({ request, response }: HttpContext): Promise<void> {

    const productId = Number(request.param('id'))

    const payload = request.only([
      'name', 'arName', 'description', 'arDescription',
      'ingredients', 'arIngredients', 'tips', 'arTips',
      'notes', 'arNotes', 'quantity', 'price', 'discount',
      'brandId', 'categoryId', 'subCategoryId', 'itemsId', 'gender'
    ])
    const images = request.files('image', {
      extnames: ['jpg', 'png', 'jpeg'],
    }) || []

    const propreties = request.input('propreties')
      ? JSON.parse(JSON.stringify(request.input('propreties')))
      : []

    const deletedImages = request.input('deletedImages')
      ? request.input('deletedImages')
      : []

    const deletedPropreties = request.input('deletedPropreties')
      ? request.input('deletedPropreties')
      : []

    const hasProprety = request.input('hasProprety') == 'false' ? false : true

    const status = await ProductService.update(productId, payload, images, deletedImages, propreties, deletedPropreties, hasProprety)
    if (status == false) {
      return response.badRequest({ message: 'Failed to update product' })
    }
    return response.ok({ message: `Successfully modified product` })


  }


  //delete product
  async destroy({ request, response }: HttpContext): Promise<void> {
    const recordId = request.params().id
    const status = await ProductService.destroy(recordId)
    if (!status) return response.badRequest({ message: 'Could not find record with given id' })
    return response.ok({ message: 'Successfully deleted Product' })
  }
}
