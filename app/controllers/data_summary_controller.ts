// app/controllers/data_summary_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import DataSummary from '#models/data_summary'
import ScanRecord from '#models/scan_record'

export default class DataSummaryController {
  async index({ inertia }: HttpContext) {
    const summaries = await DataSummary.query().orderBy('scanDate', 'desc')

    return inertia.render('data_summary', {
      summaries: summaries.map((s) => ({
        id: s.id,
        partPcb: s.partPcb,
        shift: s.shift,
        scanDate: s.scanDate,
        totalScan: s.totalScan,
      })),
    })
  }

  async details({ request, response }: HttpContext) {
    const partPcb = request.input('partPcb')
    const shift = request.input('shift')
    const date = request.input('date') // 'yyyy-MM-dd'

    const startLocal = DateTime.fromFormat(date, 'yyyy-MM-dd', { zone: 'Asia/Phnom_Penh' }).startOf('day')
    const endLocal = startLocal.endOf('day')

    const records = await ScanRecord.query()
      .where('partPcb', partPcb)
      .where('shift', shift)
      .whereBetween('createdAt', [startLocal.toUTC().toSQL()!, endLocal.toUTC().toSQL()!])
      .orderBy('id', 'desc')

    return response.json(
      records.map((r) => ({
        id: r.id,
        partPcb: r.partPcb,
        partIc: r.partIc,
        productionName: r.productionName,
        dc: r.dc,
        createdAt: r.createdAt.setZone('Asia/Phnom_Penh').toFormat('dd/MM/yyyy hh:mm a'),
      }))
    )
  }
}