import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { randomBytes } from 'crypto'
import PasswordReset from '#models/password_reset'
import { DateTime } from 'luxon'
import { createUserValidator, userLoginValidator } from '#validators/auth'

export default class AuthController {
  //Login
  async CheckUser({ request, response }: HttpContext): Promise<void> {
    const { email, password } = request.only(['email', 'password'])

    await userLoginValidator.validate({ email, password })
    if (!email || !password)
      return response.badRequest({ message: 'email and password are required !' })
    const user = await User.findBy({ email })
    if (user) {
      const isVaild = await hash.verify(user.password, password)
      if (isVaild) {
        const token = await User.accessTokens.create(user, [], { name: user.firstName })
        return response.status(200).json({
          access: token.value!.release(),
        })
      }
    }

    return response.status(400).json({
      message: 'Invalid credentials',
    })
  }
  //Register
  async NewAccount({ request, response }: HttpContext): Promise<void> {
    const user = await User.findBy('email', request.input('email'))
    if (user != null) {
      return response.status(400).json({
        message: 'Email Already in user !',
      })
    }
    const data = await createUserValidator.validate(request.body())
    console.log(data)
    await User.create(data)

    response.status(201).json({
      message: 'Successfully registered new account !',
    })
  }
  //Reset Password Link
  async forgetPassword({ request, response }: HttpContext): Promise<void> {
    const email = request.input('email')
    await User.findByOrFail('email', email)

    const token = randomBytes(32).toString('hex')

    await PasswordReset.updateOrCreate(
      { email },
      {
        token,
        expiresAt: DateTime.now().plus({ hours: 1 }),
      }
    )

    return response.ok({ message: '/reset-password?token=' + token })
  }
  //Save new Password
  async resetPassword({ request, response }: HttpContext): Promise<void> {
    const { email, token, newpassword } = request.only(['email', 'token', 'newpassword'])

    const resetRecord = await PasswordReset.query()
      .where('email', email)
      .andWhere('token', token)
      .first()

    if (!resetRecord || resetRecord.expiresAt < DateTime.now()) {
      return response.badRequest({ message: 'Token is invalid or expired' })
    }

    const user = await User.findByOrFail('email', email)
    user.password = newpassword

    await user.save()

    await resetRecord.delete()

    return response.ok({ message: 'Password updated !' })
  }

  async getUser({ auth, response }: HttpContext): Promise<void> {
    await auth.authenticate()

    return response.ok({ user: auth.user })
  }

  async logOut({ auth, response }: HttpContext) {
    await auth.authenticate()
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return response.status(200).json({
      message: 'Success',
    })
  }
}
