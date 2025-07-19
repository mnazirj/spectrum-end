import { ReviewService } from '#services/review_service'
import { createNewReview } from '#validators/reivew'
import type { HttpContext } from '@adonisjs/core/http'

export default class ReivewsController {

    async createReview({ auth, request, response }: HttpContext): Promise<void> {
        const user = await auth.authenticate()
        if (!user) return response.unauthorized({ message: 'You need to have an account to review' })
        const payload = await createNewReview.validate(request.body())
        const slug = decodeURIComponent(request.params().slug)
        const status = await ReviewService.create(payload, user.id, slug)
        if (!status.success) return response.badRequest({ message: status.message })
        return response.created({ message: status.message })
    }
}