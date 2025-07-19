import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PromoCode extends BaseModel {
  static table = 'promocodes'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare value: number

  @column()
  declare capacity: number

  @column()
  declare expiredAt: Date

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}