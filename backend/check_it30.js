require('dotenv').config({ path: '.env.test' })
const request = require('supertest')
const app = require('./src/app')
require('./src/models/index')
const { sequelize } = require('./src/config/db')

const run = async () => {
  await sequelize.authenticate()
  
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'admin123' })
  const token = loginRes.body.data.token

  const res = await request(app)
    .post('/api/business-cases')
    .set('Authorization', `Bearer ${token}`)
    .field({
      bcTitle: 'No Service BC',
      bcType: 'BC',
      projectType: 'Non-Tender',
      activityType: 'BAU',
      projectStatus: 'On Progress',
      esReqDate: '2025-01-01',
      cfDate: '2025-02-01',
      rfsDate: '2025-03-01',
      custName: 'PT Test',
      custJoinYear: '2020',
      lineOfBusiness: 'Technology',
      contractType: 'New',
      activationType: 'New',
      contractPeriod: '12',
      pricingTeamId: '1',
      preSalesTeamId: '1'
    })

  console.log('Status:', res.status)
  console.log('Body:', JSON.stringify(res.body, null, 2))
  await sequelize.close()
  process.exit(0)
}

run().catch(console.error)
