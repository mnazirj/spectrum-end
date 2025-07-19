import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import SubCategory from '#models/sub_category'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Product from './product.js'

export default class ItemSubCategories extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare title: string

  @column({ columnName: 'arName' })
  declare arName: string

  @column({ columnName: 'subCategoryId', serializeAs: null })
  declare subCategoryId: number

  @column()
  declare slug: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => SubCategory)
  declare sub_categories: BelongsTo<typeof SubCategory>

  @hasMany(() => Product)
  declare product: HasMany<typeof Product>
}
