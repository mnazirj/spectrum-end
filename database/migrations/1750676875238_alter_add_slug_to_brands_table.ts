import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'brands'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('slug').after('arName').unique()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('slug')
    })
  }
}