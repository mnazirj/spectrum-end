import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('country').notNullable()
      table.string('phone').notNullable()
      table.string('address').notNullable()
      table.string('additional_address').nullable()
      table.string('city').notNullable()
      table.string('area').notNullable()
      table.boolean('primary').notNullable().defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}