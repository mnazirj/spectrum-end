import { BrandService } from '#services/brand_service'
import { createNewBrand } from '#validators/dashboard'
import type { HttpContext } from '@adonisjs/core/http'

export default class BrandsController {
  //Return all brands
  async index({ response }: HttpContext): Promise<void> {
    return response.ok(await BrandService.getAllBrands())
  }

  //create new brand
  async create({ request, response }: HttpContext): Promise<void> {
    const data = await createNewBrand.validate(request.only(['title', 'arName']))
    const status = await BrandService.create(data)
    if (!status.success) return response.badRequest({ message: status.message })
    return response.created({ message: status.message })
  }

  //update brand
  async update({ request, response }: HttpContext): Promise<void> {
    const data = await createNewBrand.validate(request.only(['title', 'arName']))
    const brandId = request.params().id
    const status = await BrandService.update(brandId, data)
    if (!status.success) return response.badRequest({ message: status.message })

    return response.ok({ message: status.message })
  }

  //delete brand
  async destroy({ request, response }: HttpContext): Promise<void> {
    const recordId = request.params().id
    const status = await BrandService.destroy(recordId)
    if (!status.success) return response.badRequest({ message: status.message })
    return response.ok({ message: status.message })
  }
}
