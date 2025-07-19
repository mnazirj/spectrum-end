import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Product from './product.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Brand extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column({ columnName: 'arName' })
  declare arName: string

  @column()
  declare slug: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Product, {
    foreignKey: 'brandId',
  })
  declare product: HasMany<typeof Product>
}
