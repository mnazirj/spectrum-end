import { PromoService } from '#services/promo_service'
import { createNewCodes } from '#validators/code'
import type { HttpContext } from '@adonisjs/core/http'

export default class PromosController {

    async index({ response }: HttpContext): Promise<void> {
        const codes = await PromoService.index()
        return response.ok(codes)
    }
    async create({ request, response }: HttpContext): Promise<void> {
        const payload = await createNewCodes.validate(request.body())
        const status = await PromoService.create(payload)
        if (!status.success) return response.badRequest({ message: status.message })
        return response.created({ message: status.message })
    }

    async checkCode({ auth, request, response }: HttpContext) {
        const user = await auth.authenticate()
        if (!user) return response.unauthorized({ message: 'You need an acconut' })
        const code = await request.input('code')
        const status = await PromoService.check(code)
        if (status.vaild) return response.ok(status.value)
        return response.badRequest({ message: 'Code expired!' })
    }

    async deleteCode({ request, response }: HttpContext) {
        const codeId = await request.params().id
        const status = await PromoService.destroy(codeId)
        if (status.success) return response.ok(status.message)
        return response.badRequest({ message: 'Something went wrong!' })
    }
}