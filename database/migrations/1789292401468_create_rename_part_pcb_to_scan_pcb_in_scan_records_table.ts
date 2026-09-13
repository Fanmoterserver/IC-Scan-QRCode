import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'scan_records'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('part_pcb', 'scan_pcb')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('scan_pcb', 'part_pcb')
    })
  }
}
