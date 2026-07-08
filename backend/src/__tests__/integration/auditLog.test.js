require('dotenv').config({ path: '.env.test' })
const request = require('supertest')
const app = require('../../app')
const { setupDB } = require('./setup')

let adminToken
let staffToken

beforeAll(async () => {
  await setupDB()
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'admin123' })
  adminToken = adminRes.body.data.token

  await request(app)
    .post('/api/users')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ username: 'staf01', firstName: 'Staf', lastName: 'Satu', password: 'staf123', role: 'Staf' })
  const staffRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'staf01', password: 'staf123' })
  staffToken = staffRes.body.data.token
}, 30000)

describe('GET /api/audit-logs', () => {
  it('IT-88: should return 200 with audit logs when Admin', async () => {
    const res = await request(app)
      .get('/api/audit-logs')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body).toHaveProperty('meta')
  })

  it('IT-89: should return 403 when Staf tries to access audit logs', async () => {
    const res = await request(app)
      .get('/api/audit-logs')
      .set('Authorization', `Bearer ${staffToken}`)
    expect(res.status).toBe(403)
  })

  it('IT-90: should return 401 when no token', async () => {
    const res = await request(app)
      .get('/api/audit-logs')
    expect(res.status).toBe(401)
  })

  it('IT-91: should return 200 with filtered logs by action CREATE', async () => {
    const res = await request(app)
      .get('/api/audit-logs?action=CREATE')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.data.every(log => log.action === 'CREATE')).toBe(true)
  })

  it('IT-92: should return 200 with paginated logs', async () => {
    const res = await request(app)
      .get('/api/audit-logs?page=1&limit=5')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.meta).toHaveProperty('page', 1)
    expect(res.body.meta).toHaveProperty('limit', 5)
  })
})
