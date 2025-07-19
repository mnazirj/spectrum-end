import type { HttpContext } from '@adonisjs/core/http'

export default class IsAdminMiddleware {
  async handle({ auth, response }: HttpContext, next: () => Promise<void>) {
    const user = await auth.authenticate()
    const hasAccess = user.super == true

    if (!hasAccess) {
      return response.unauthorized({ message: 'Access Deny!' })
    }

    await next()
  }
}
