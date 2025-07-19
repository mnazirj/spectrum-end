import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Brand from './brand.js'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Category from './category.js'
import SubCategory from './sub_category.js'
import ItemSubCategories from './sub_category_item.js'
import ProductImage from './product_image.js'
import ProductProprety from './product_proprety.js'
import Order from './order.js'
import Review from './review.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column({ columnName: 'arName' })
  declare arName: string

  @column()
  declare description: string

  @column({ columnName: 'arDescription' })
  declare arDescription: string

  @column()
  declare ingredients: string

  @column({ columnName: 'arIngredients' })
  declare arIngredients: string

  @column()
  declare tips: string

  @column({ columnName: 'arTips' })
  declare arTips: string

  @column()
  declare notes: string

  @column({ columnName: 'arNotes' })
  declare arNotes: string

  @column()
  declare quantity: number

  @column()
  declare price: number

  @column()
  declare discount: number
  @column()
  declare gender: string

  @column()
  declare slug: string

  @column()
  declare sellCount: number

  @column()
  declare exclusive: boolean

  @column({ columnName: 'brandId', serializeAs: null })
  declare brandId: number

  @column({ columnName: 'categoryId', serializeAs: null })
  declare categoryId: number

  @column({ columnName: 'subCategoryId', serializeAs: null })
  declare subCategoryId: number

  @column({ columnName: 'itemsId', serializeAs: null })
  declare itemSubCategoriesId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Brand)
  declare brand: BelongsTo<typeof Brand>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => SubCategory)
  declare subCategory: BelongsTo<typeof SubCategory>

  @belongsTo(() => ItemSubCategories)
  declare itemsCategory: BelongsTo<typeof ItemSubCategories>

  @hasMany(() => ProductImage)
  declare images: HasMany<typeof ProductImage>

  @hasMany(() => ProductProprety)
  declare propreties: HasMany<typeof ProductProprety>

  @manyToMany(() => Order, {
    pivotTable: 'order_items',
    pivotColumns: ['quantity'],

  })
  declare orders: ManyToMany<typeof Order>

  @hasMany(() => Review)
  declare review: HasMany<typeof Review>
}
