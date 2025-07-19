import { SubItemService } from '#services/sub_item_service'
import { createNewSubCatrgoryItem, updateSubCategoryItem } from '#validators/dashboard'
import type { HttpContext } from '@adonisjs/core/http'

export default class SubCategoryItemsController {
  //Return all items categories
  async index({ response }: HttpContext): Promise<void> {
    return response.ok(await SubItemService.getAllSubItems())
  }
  //Create new sub catrgory from dashboard
  async create({ request, response }: HttpContext): Promise<void> {
    const payload = await createNewSubCatrgoryItem.validate(request.body())
    const status = await SubItemService.create(payload)
    if (!status.success) return response.badRequest({ message: status.message })
    return response.created({ message: status.message })
  }

  //update item information
  async update({ request, response }: HttpContext): Promise<void> {
    const payload = await updateSubCategoryItem.validate(request.body())
    const recordId = request.params().id
    const status = await SubItemService.update(recordId, payload)
    if (!status.success) return response.badRequest({ message: status.message })
    return response.ok({ message: status.message })
  }

  //delete items
  async destroy({ request, response }: HttpContext): Promise<void> {
    const recordId = request.params().id
    const status = await SubItemService.destroy(recordId)
    if (!status.success) return response.badRequest({ message: status.message })
    return response.ok({ message: status.message })
  }
}
