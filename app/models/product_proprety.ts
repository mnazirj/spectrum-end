import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Product from './product.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ProductProprety extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'productId', serializeAs: null })
  declare productId: number

  @column()
  declare type: string

  @column()
  declare value: string

  @column()
  declare price: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Product)
  declare itemsCategory: BelongsTo<typeof Product>
}
