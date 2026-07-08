require('dotenv').config({ path: '.env.test' })
const request = require('supertest')
const app = require('./src/app')
require('./src/models/index')
const { sequelize } = require('./src/config/db')

const run = async () => {
  await sequelize.authenticate()
  
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'admin123' })
  const adminToken = adminRes.body.data.token

  await request(app)
    .post('/api/users')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ username: 'staf01', firstName: 'Staf', lastName: 'Satu', password: 'staf123', role: 'Staf' })

  const staffRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'staf01', password: 'staf123' })
  const staffToken = staffRes.body.data.token

  const res = await request(app)
    .get('/api/users')
    .set('Authorization', `Bearer ${staffToken}`)

  console.log('Status:', res.status)
  console.log('Body:', JSON.stringify(res.body, null, 2))
  await sequelize.close()
  process.exit(0)
}

run().catch(console.error)
