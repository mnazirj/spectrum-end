import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'item_sub_categories'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('slug').after('subCategoryId')

    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('slug')
    })
  }
}