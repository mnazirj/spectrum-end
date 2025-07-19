import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import SubCategory from '#models/sub_category'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Product from './product.js'
export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column({ columnName: 'arName' })
  declare arName: string
  @column()
  declare description: string

  @column({ columnName: 'arDescription' })
  declare arDescription: string

  @column()
  declare slug: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => SubCategory, {
    foreignKey: 'categoryId',
  })
  declare sub_category: HasMany<typeof SubCategory>

  @hasMany(() => Product, {
    foreignKey: 'categoryId',
  })
  declare product: HasMany<typeof Product>
}
