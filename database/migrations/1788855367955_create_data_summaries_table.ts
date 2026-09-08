import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'data_summaries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('part_pcb').notNullable()
      table.string('shift', 1).notNullable()
      table.string('scan_date', 10).notNullable() // 'YYYY-MM-DD'
      table.integer('total_scan').notNullable().defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.unique(['part_pcb', 'shift', 'scan_date'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}