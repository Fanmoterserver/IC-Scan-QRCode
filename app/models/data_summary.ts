// app/models/data_summary.ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class DataSummary extends BaseModel {
  static table = 'data_summaries'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare partPcb: string

  @column()
  declare shift: string

  @column()
  declare scanDate: string

  @column()
  declare totalScan: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}