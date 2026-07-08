require('dotenv').config({ path: '.env.test' })
const request = require('supertest')
const app = require('./src/app')
require('./src/models/index')
const { sequelize } = require('./src/config/db')

const run = async () => {
  await sequelize.authenticate()

  // 401 tanpa token
  const res401 = await request(app).get('/api/users')
  console.log('401 Body:', JSON.stringify(res401.body, null, 2))

  // 401 login salah
  const res401login = await request(app)
    .post('/api/auth/login')
    .send({ username: 'usernotexist', password: 'admin123' })
  console.log('401 Login Body:', JSON.stringify(res401login.body, null, 2))

  // 404
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'admin123' })
  const token = adminRes.body.data.token
  const res404 = await request(app)
    .get('/api/business-cases/99999')
    .set('Authorization', `Bearer ${token}`)
  console.log('404 Body:', JSON.stringify(res404.body, null, 2))

  await sequelize.close()
  process.exit(0)
}

run().catch(console.error)
