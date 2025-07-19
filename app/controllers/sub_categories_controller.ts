import { SubCategoryService } from '#services/sub_category_service'
import { createNewSubCatrgory, updateSubCategory } from '#validators/dashboard'
import type { HttpContext } from '@adonisjs/core/http'

export default class SubCategoriesController {
  //Return all sub categories
  async index({ response }: HttpContext): Promise<void> {
    return response.ok(await SubCategoryService.getAllSubCategories())
  }

  //Create new sub catrgory from dashboard
  async create({ request, response }: HttpContext): Promise<void> {
    const payload = await createNewSubCatrgory.validate(request.body())

    const status = await SubCategoryService.create(payload)
    if (!status.success) return response.badRequest({ message: status.message })

    return response.created({ message: status.message })
  }

  //update category information
  async update({ request, response }: HttpContext): Promise<void> {
    const payload = await updateSubCategory.validate(request.body())
    const subCategoryId = request.params().id
    const status = await SubCategoryService.update(subCategoryId, payload)
    if (!status.success) return response.badRequest({ message: status.message })
    return response.ok({ message: status.message })
  }

  //delete sub category
  async destroy({ request, response }: HttpContext): Promise<void> {
    const recordId = request.params().id
    const status = await SubCategoryService.destroy(recordId)
    if (!status.success) return response.badRequest({ message: status.message })

    return response.ok({ message: status.message })
  }
}
