// app/controllers/scan_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import MasterData from '#models/master_data'
import ScanRecord from '#models/scan_record'
import DataSummary from '#models/data_summary'
import vine from '@vinejs/vine'

const scanValidator = vine.compile(
  vine.object({
    partPcb: vine.string().trim().minLength(1),
    scanPcb: vine.string().trim().minLength(1),
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

    return inertia.render('scan_qrcode', {
      masterData,
      records: records.map((r) => ({
        id: r.id,
        scanPcb: r.scanPcb,
        partIc: r.partIc,
        productionName: r.productionName,
        dc: r.dc,
        shift: r.shift,
        createdAt: r.createdAt.setZone('Asia/Phnom_Penh').toFormat('dd/MM/yyyy hh:mm a'),
      })),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(scanValidator)

    // Validate against Master Data using the SELECTED Part PCB, not the raw scan
    const match = await MasterData.query()
      .where('partPcb', data.partPcb)
      .where('partIc', data.partIc)
      .first()

    if (!match) {
      session.flash('error', 'Part IC does not match the selected Part PCB in master data.')
      return response.redirect().back()
    }

    // Save the scan record with the FULL raw scanned string in scan_pcb
    await ScanRecord.create({
      scanPcb: data.scanPcb,
      partIc: data.partIc,
      productionName: data.productionName,
      dc: data.dc,
      shift: data.shift,
    })

    // Maintain the summary table, grouped by the selected Part PCB
    const scanDate = DateTime.now().setZone('Asia/Phnom_Penh').toFormat('yyyy-MM-dd')

    const existing = await DataSummary.query()
      .where('partPcb', data.partPcb)
      .where('shift', data.shift)
      .where('scanDate', scanDate)
      .first()

    if (existing) {
      await DataSummary.query().where('id', existing.id).increment('totalScan', 1)
    } else {
      await DataSummary.create({
        partPcb: data.partPcb,
        shift: data.shift,
        scanDate,
        totalScan: 1,
      })
    }

    return response.redirect().back()
  }

  async destroy({ params, response, session }: HttpContext) {
    const record = await ScanRecord.findOrFail(params.id)

    // Extract the short PCB code from the stored raw scan string,
    // since DataSummary is grouped by the short code (partPcb), not the full scan
    const shortPcbCode = record.scanPcb.split(',')[0]?.trim() ?? record.scanPcb

    const scanDate = record.createdAt.setZone('Asia/Phnom_Penh').toFormat('yyyy-MM-dd')

    const summary = await DataSummary.query()
      .where('partPcb', shortPcbCode)
      .where('shift', record.shift)
      .where('scanDate', scanDate)
      .first()

    await record.delete()
    session.flash('success', 'Deleted Successfully')

    if (summary) {
      if (summary.totalScan <= 1) {
        await summary.delete()
      } else {
        await DataSummary.query().where('id', summary.id).decrement('totalScan', 1)
      }
    }

    return response.redirect().back()
  }
}
