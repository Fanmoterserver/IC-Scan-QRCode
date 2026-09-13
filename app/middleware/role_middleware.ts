import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, allowedRoles: string[]) {
    const user = ctx.auth.user!
    if (user.role === 'admin' || allowedRoles.includes(user.role)) {
      return next()
    }
    ctx.session.flash('error', 'You do not have access to that action.')
    return ctx.response.redirect('/scan-qrcode')
  }
}
