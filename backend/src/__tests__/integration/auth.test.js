require('dotenv').config({ path: '.env.test' })
const request = require('supertest')
const app = require('../../app')
const { setupDB, teardownDB } = require('./setup')

beforeAll(async () => {
  await setupDB()
}, 30000)

afterAll(async () => {
  await teardownDB()
})

describe('POST /api/auth/login', () => {
  it('IT-01: should return 200 and token with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' })
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('token')
    expect(res.body.data).toHaveProperty('user')
    expect(res.body.data.user.role).toBe('Admin')
  })

  it('IT-02: should return 400 when username and password are empty', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({})
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Username and password need to be filled in.')
  })

  it('IT-03: should return 401 when username is not found', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'usernotexist', password: 'admin123' })
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Username not found. Please check your username and try again')
  })

  it('IT-04: should return 401 when password is incorrect', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrongpassword' })
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Password is incorrect. Please check your credentials and try again.')
  })
})

describe('POST /api/auth/logout', () => {
  it('IT-05: should return 200 when logout with valid token', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' })
    const token = loginRes.body.data.token

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Logout successful!')
  })

  it('IT-06: should return 401 when logout without token', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
    expect(res.status).toBe(401)
  })
})
