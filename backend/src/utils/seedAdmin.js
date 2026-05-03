const bcrypt = require('bcryptjs')
const User = require('../models/User')

const seedAdmin = async () => {
  try {
    const existing = await User.findOne({ where: { username: 'admin' } })
    if (existing) return

    const hashedPassword = await bcrypt.hash('admin123', 10)

    await User.create({
      username: 'admin',
      firstName: 'Super',
      lastName: 'Admin',
      password: hashedPassword,
      role: 'Admin',
      isActive: true
    })

    console.log('✅ Admin user seeded: username=admin, password=admin123')
  } catch (error) {
    console.error('❌ Seed admin failed:', error)
  }
}

module.exports = seedAdmin