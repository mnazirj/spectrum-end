import { CategoryService } from '#services/category_service'
import { createNewCatrgory, updateCategory } from '#validators/dashboard'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  //Return all categories
  async index({ response }: HttpContext): Promise<void> {
    return response.ok(await CategoryService.getAllCategories())
  }

  //Create new catrgory from dashboard
  async create({ request, response }: HttpContext): Promise<void> {
    const paylaod = await createNewCatrgory.validate(request.body())

    const status = await CategoryService.create(paylaod)
    if (!status.success) return response.badRequest({ message: status.message })
    return response.created({ message: status.message })
  }

  //update category information
  async update({ request, response }: HttpContext): Promise<void> {
    const payload = await updateCategory.validate(request.body())
    const categoryId = request.params().id
    const status = await CategoryService.update(categoryId, payload);
    if (!status.success) return response.badRequest({ message: status.message })
    return response.ok({ message: status.message })
  }

  //delete category
  async destroy({ request, response }: HttpContext): Promise<void> {
    const recordId = request.params().id
    const status = await CategoryService.destroy(recordId)
    if (!status.success) return response.badRequest({ message: status.message })
    return response.ok({ message: status.message })
  }
}
