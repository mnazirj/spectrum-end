import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Gateway extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare result: string

  @column()
  declare amount: number

  @column()
  declare storeId: string

  @column()
  declare ourRef: string

  @column()
  declare paymentMethod: string

  @column()
  declare customerPhone: string

  @column()
  declare customRef: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}