import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class MasterData extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare partPcb: string

  @column()
  declare partIc: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}