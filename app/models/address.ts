import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare userId: number
  @column()
  declare firstName: string
  @column()
  declare lastName: string

  @column()
  declare country: string
  @column()
  declare phone: string
  @column()
  declare address: string
  @column()
  declare additionalAddress: string
  @column()
  declare city: string
  @column()
  declare area: string
  @column()
  declare primary: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}