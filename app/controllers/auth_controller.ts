// app/controllers/auth_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import vine from '@vinejs/vine'

// app/controllers/auth_controller.ts
const loginValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim(),
    password: vine.string(),
  })
)

export default class AuthController {
  async showLogin({ inertia }: HttpContext) {
    return inertia.render('login')
  }

  async login({ request, auth, response, session }: HttpContext) {
    const { fullName, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(fullName, password)
      await auth.use('web').login(user)
      return response.redirect('/')
    } catch {
      session.flash('error', 'Invalid full name or password')
      return response.redirect().back()
    }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}
