import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gateways'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('result')
      table.string('amount')
      table.string('store_id')
      table.string('our_ref')
      table.string('payment_method')
      table.string('customer_phone')
      table.string('custom_ref')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}