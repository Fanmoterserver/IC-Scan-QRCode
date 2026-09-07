// database/migrations/..._create_scan_records_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'scan_records'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('part_pcb').notNullable()
      table.string('part_ic').notNullable()
      table.string('production_name').notNullable()
      table.string('dc').notNullable()
      table.string('shift', 1).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}