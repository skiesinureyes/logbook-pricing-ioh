require('dotenv').config({ path: '.env.test' })
const request = require('supertest')
const app = require('../../app')
const { setupDB, teardownDB } = require('./setup')

let adminToken
let staffToken
let createdUserId

beforeAll(async () => {
  await setupDB()
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'admin123' })
  adminToken = res.body.data.token

  await request(app)
    .post('/api/users')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ username: 'staf01', firstName: 'Staf', lastName: 'Satu', password: 'staf123', role: 'Staf' })

  const staffRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'staf01', password: 'staf123' })
  staffToken = staffRes.body.data.token
}, 30000)

afterAll(async () => {
  await teardownDB()
})

describe('GET /api/users', () => {
  it('IT-07: should return 200 with list of users when Admin', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('IT-08: should return 403 when Staf tries to access', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${staffToken}`)
    expect(res.status).toBe(403)
  })

  it('IT-09: should return 401 when no token', async () => {
    const res = await request(app)
      .get('/api/users')
    expect(res.status).toBe(401)
  })
})

describe('POST /api/users', () => {
  it('IT-10: should return 201 when Admin creates new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'newuser01', firstName: 'New', lastName: 'User', password: 'newpass123', role: 'Staf' })
    expect(res.status).toBe(201)
    expect(res.body.data).toHaveProperty('id')
    expect(res.body.data.username).toBe('newuser01')
    createdUserId = res.body.data.id
  })

  it('IT-11: should return 409 when username already exists', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'admin', firstName: 'Dup', lastName: 'User', password: 'pass123', role: 'Staf' })
    expect(res.status).toBe(409)
    expect(res.body.message).toBe('Username sudah digunakan')
  })

  it('IT-12: should return 400 when required fields missing', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'incomplete' })
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Semua field wajib diisi')
  })

  it('IT-13: should return 403 when Staf tries to create user', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ username: 'newuser02', firstName: 'New', lastName: 'User', password: 'pass123', role: 'Staf' })
    expect(res.status).toBe(403)
  })
})

describe('PUT /api/users/:id', () => {
  it('IT-14: should return 200 when Admin updates user', async () => {
    const res = await request(app)
      .put(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ firstName: 'Updated', lastName: 'Name', role: 'Staf' })
    expect(res.status).toBe(200)
    expect(res.body.data.firstName).toBe('Updated')
  })

  it('IT-15: should return 404 when user not found', async () => {
    const res = await request(app)
      .put('/api/users/99999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ firstName: 'Ghost', lastName: 'User', role: 'Staf' })
    expect(res.status).toBe(404)
    expect(res.body.message).toBe('User tidak ditemukan')
  })
})

describe('PATCH /api/users/:id/status', () => {
  it('IT-16: should return 200 when Admin toggles user status', async () => {
    const res = await request(app)
      .patch(`/api/users/${createdUserId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false })
    expect(res.status).toBe(200)
    expect(res.body.data.isActive).toBe(false)
  })

  it('IT-17: should return 400 when Admin tries to deactivate own account', async () => {
    const meRes = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
    const adminUser = meRes.body.data.find(u => u.username === 'admin')

    const res = await request(app)
      .patch(`/api/users/${adminUser.id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isActive: false })
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Anda tidak dapat menonaktifkan akun Anda sendiri')
  })
})
