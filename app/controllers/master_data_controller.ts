import type { HttpContext } from '@adonisjs/core/http'
import MasterData from '#models/master_data'
import vine from '@vinejs/vine'

const masterDataValidator = vine.compile(
  vine.object({
    partPcb: vine.string().trim().minLength(1),
    partIc: vine.string().trim().minLength(1),
  })
)

export default class MasterDataController {
  async index({ inertia }: HttpContext) {
    const items = await MasterData.query().orderBy('id', 'desc')
    return inertia.render('master_data', { items })
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(masterDataValidator)
    await MasterData.create(data)
    return response.redirect().back()
  }

  async destroy({ params, response }: HttpContext) {
    const item = await MasterData.findOrFail(params.id)
    await item.delete()
    return response.redirect().back()
  }
}