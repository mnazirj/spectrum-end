import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, beforeSave, column, hasMany } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Address from './address.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Order from './order.js'
import Review from './review.js'

export default class User extends BaseModel {
  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'xts_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 80,
  })

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'firstName' })
  declare firstName: string
  @column({ columnName: 'lastName' })
  declare lastName: string

  @column()
  declare email: string

  @column()
  declare phone: string

  @column({ serializeAs: null })
  declare password: string

  @column({ serializeAs: null })
  declare super: Boolean

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime | null

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.use('scrypt').make(user.password)
    }
  }

  @hasMany(() => Address)
  declare address: HasMany<typeof Address>

  @hasMany(() => Order)
  declare order: HasMany<typeof Order>

  @hasMany(() => Review)
  declare review: HasMany<typeof Review>
}
