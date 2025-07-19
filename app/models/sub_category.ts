import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import SubCategoryItem from '#models/sub_category_item'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Category from '#models/category'
import Product from './product.js'
export default class SubCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column({ columnName: 'arName' })
  declare arName: string

  @column({ columnName: 'categoryId', serializeAs: null })
  declare categoryId: number

  @column()
  declare slug: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => SubCategoryItem)
  declare items: HasMany<typeof SubCategoryItem>

  @hasMany(() => Product)
  declare product: HasMany<typeof Product>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>
}
