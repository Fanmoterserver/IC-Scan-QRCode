// app/controllers/scan_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import MasterData from '#models/master_data'
import ScanRecord from '#models/scan_record'
import vine from '@vinejs/vine'

const scanValidator = vine.compile(
  vine.object({
    partPcb: vine.string().trim().minLength(1),
    partIc: vine.string().trim().minLength(1),
    productionName: vine.string().trim().fixedLength(14),
    dc: vine.string().trim().fixedLength(4),
    shift: vine.enum(['A', 'B']),
  })
)

export default class ScanController {
  async index({ inertia }: HttpContext) {
    const masterData = await MasterData.query().orderBy('partPcb', 'asc')
    const records = await ScanRecord.query().orderBy('id', 'desc').limit(50)
    return inertia.render('scan_qrcode', { masterData, records })
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(scanValidator)

    const match = await MasterData.query()
      .where('partPcb', data.partPcb)
      .where('partIc', data.partIc)
      .first()

    if (!match) {
      session.flash('error', 'Part IC does not match the selected Part PCB in master data.')
      return response.redirect().back()
    }

    await ScanRecord.create(data)
    return response.redirect().back()
  }
}