// app/models/scan_record.ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ScanRecord extends BaseModel {
  static table = 'scan_records'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare partPcb: string

  @column()
  declare partIc: string

  @column()
  declare productionName: string

  @column()
  declare dc: string

  @column()
  declare shift: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}