import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').unique()
      table.string('arName').unique()
      table.text('description')
      table.text('arDescription')
      table.text('ingredients')
      table.text('arIngredients')
      table.text('tips')
      table.text('arTips')
      table.text('notes')
      table.text('arNotes')
      table.bigInteger('quantity')
      table.double('price')
      table.double('discount').defaultTo(0)
      table.integer('brandId').unsigned().references('brands.id').onDelete('CASCADE')
      table.integer('categoryId').unsigned().references('categories.id').onDelete('CASCADE')
      table.integer('subCategoryId').unsigned().references('sub_categories.id').onDelete('CASCADE')
      table.integer('itemsId').unsigned().references('item_sub_categories.id').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
