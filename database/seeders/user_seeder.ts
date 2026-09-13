// database/seeders/user_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        fullName: 'admin',
        email: 'admin@fanmotor.com',
        password: 'fanmotorserver168',
        role: 'admin',
      },
      {
        fullName: 'user',
        email: 'user@fanmotor.com',
        password: 'user123',
        role: 'user',
      },
    ])
  }
}
