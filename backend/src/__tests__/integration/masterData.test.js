require('dotenv').config({ path: '.env.test' })
const request = require('supertest')
const app = require('../../app')
const { setupDB } = require('./setup')

let adminToken
let staffToken
let createdGroupId
let createdDivisionId
let createdDepartmentId
let createdSalesTeamId
let createdPricingTeamId
let createdPreSalesTeamId
let createdServiceId
let createdSubServiceId

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

// GROUP
describe('Group CRUD', () => {
  it('IT-50: GET /api/master/groups - should return 200', async () => {
    const res = await request(app).get('/api/master/groups').set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('IT-51: POST /api/master/groups - Admin should create group', async () => {
    const res = await request(app).post('/api/master/groups').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Test Group' })
    expect(res.status).toBe(201)
    createdGroupId = res.body.data.id
  })

  it('IT-52: POST /api/master/groups - Staf should return 403', async () => {
    const res = await request(app).post('/api/master/groups').set('Authorization', `Bearer ${staffToken}`).send({ name: 'Unauthorized' })
    expect(res.status).toBe(403)
  })

  it('IT-53: PUT /api/master/groups/:id - Admin should update group', async () => {
    const res = await request(app).put(`/api/master/groups/${createdGroupId}`).set('Authorization', `Bearer ${adminToken}`).send({ name: 'Updated Group' })
    expect(res.status).toBe(200)
    expect(res.body.data.name).toBe('Updated Group')
  })

  it('IT-54: PUT /api/master/groups/:id - should return 404 when not found', async () => {
    const res = await request(app).put('/api/master/groups/99999').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Ghost' })
    expect(res.status).toBe(404)
  })
})

// DIVISION
describe('Division CRUD', () => {
  it('IT-55: GET /api/master/divisions - should return 200', async () => {
    const res = await request(app).get('/api/master/divisions').set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })

  it('IT-56: POST /api/master/divisions - Admin should create division', async () => {
    const res = await request(app).post('/api/master/divisions').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Test Division', groupId: createdGroupId })
    expect(res.status).toBe(201)
    createdDivisionId = res.body.data.id
  })

  it('IT-57: PUT /api/master/divisions/:id - Admin should update division', async () => {
    const res = await request(app).put(`/api/master/divisions/${createdDivisionId}`).set('Authorization', `Bearer ${adminToken}`).send({ name: 'Updated Division', groupId: createdGroupId })
    expect(res.status).toBe(200)
    expect(res.body.data.name).toBe('Updated Division')
  })

  it('IT-58: PUT /api/master/divisions/:id - should return 404 when not found', async () => {
    const res = await request(app).put('/api/master/divisions/99999').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Ghost' })
    expect(res.status).toBe(404)
  })
})

// DEPARTMENT
describe('Department CRUD', () => {
  it('IT-59: GET /api/master/departments - should return 200', async () => {
    const res = await request(app).get('/api/master/departments').set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })

  it('IT-60: POST /api/master/departments - Admin should create department', async () => {
    const res = await request(app).post('/api/master/departments').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Test Department', divisionId: createdDivisionId })
    expect(res.status).toBe(201)
    createdDepartmentId = res.body.data.id
  })

  it('IT-61: PUT /api/master/departments/:id - Admin should update department', async () => {
    const res = await request(app).put(`/api/master/departments/${createdDepartmentId}`).set('Authorization', `Bearer ${adminToken}`).send({ name: 'Updated Department', divisionId: createdDivisionId })
    expect(res.status).toBe(200)
  })

  it('IT-62: PUT /api/master/departments/:id - should return 404 when not found', async () => {
    const res = await request(app).put('/api/master/departments/99999').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Ghost' })
    expect(res.status).toBe(404)
  })
})

// SALES TEAM
describe('SalesTeam CRUD', () => {
  it('IT-63: GET /api/master/sales-teams - should return 200', async () => {
    const res = await request(app).get('/api/master/sales-teams').set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })

  it('IT-64: POST /api/master/sales-teams - Admin should create sales team', async () => {
    const res = await request(app).post('/api/master/sales-teams').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Test Sales Team', departmentId: createdDepartmentId })
    expect(res.status).toBe(201)
    createdSalesTeamId = res.body.data.id
  })

  it('IT-65: PUT /api/master/sales-teams/:id - Admin should update sales team', async () => {
    const res = await request(app).put(`/api/master/sales-teams/${createdSalesTeamId}`).set('Authorization', `Bearer ${adminToken}`).send({ name: 'Updated Sales Team', departmentId: createdDepartmentId })
    expect(res.status).toBe(200)
  })

  it('IT-66: PUT /api/master/sales-teams/:id - should return 404 when not found', async () => {
    const res = await request(app).put('/api/master/sales-teams/99999').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Ghost' })
    expect(res.status).toBe(404)
  })
})

// PRICING TEAM
describe('PricingTeam CRUD', () => {
  it('IT-67: GET /api/master/pricing-teams - should return 200', async () => {
    const res = await request(app).get('/api/master/pricing-teams').set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })

  it('IT-68: POST /api/master/pricing-teams - Admin should create pricing team', async () => {
    const res = await request(app).post('/api/master/pricing-teams').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Test Pricing Team' })
    expect(res.status).toBe(201)
    createdPricingTeamId = res.body.data.id
  })

  it('IT-69: PUT /api/master/pricing-teams/:id - Admin should update pricing team', async () => {
    const res = await request(app).put(`/api/master/pricing-teams/${createdPricingTeamId}`).set('Authorization', `Bearer ${adminToken}`).send({ name: 'Updated Pricing Team' })
    expect(res.status).toBe(200)
  })

  it('IT-70: DELETE /api/master/pricing-teams/:id - Admin should delete pricing team', async () => {
    const res = await request(app).delete(`/api/master/pricing-teams/${createdPricingTeamId}`).set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })
})

// PRE SALES TEAM
describe('PreSalesTeam CRUD', () => {
  it('IT-71: GET /api/master/pre-sales-teams - should return 200', async () => {
    const res = await request(app).get('/api/master/pre-sales-teams').set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })

  it('IT-72: POST /api/master/pre-sales-teams - Admin should create pre-sales team', async () => {
    const res = await request(app).post('/api/master/pre-sales-teams').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Test Pre-Sales Team' })
    expect(res.status).toBe(201)
    createdPreSalesTeamId = res.body.data.id
  })

  it('IT-73: PUT /api/master/pre-sales-teams/:id - Admin should update pre-sales team', async () => {
    const res = await request(app).put(`/api/master/pre-sales-teams/${createdPreSalesTeamId}`).set('Authorization', `Bearer ${adminToken}`).send({ name: 'Updated Pre-Sales Team' })
    expect(res.status).toBe(200)
  })

  it('IT-74: DELETE /api/master/pre-sales-teams/:id - Admin should delete pre-sales team', async () => {
    const res = await request(app).delete(`/api/master/pre-sales-teams/${createdPreSalesTeamId}`).set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })
})

// SERVICE
describe('Service CRUD', () => {
  it('IT-75: GET /api/master/services - should return 200', async () => {
    const res = await request(app).get('/api/master/services').set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })

  it('IT-76: POST /api/master/services - Admin should create service', async () => {
    const res = await request(app).post('/api/master/services').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Test Service', serviceCategory: 'TelCo' })
    expect(res.status).toBe(201)
    createdServiceId = res.body.data.id
  })

  it('IT-77: PUT /api/master/services/:id - Admin should update service', async () => {
    const res = await request(app).put(`/api/master/services/${createdServiceId}`).set('Authorization', `Bearer ${adminToken}`).send({ name: 'Updated Service', serviceCategory: 'TechCo' })
    expect(res.status).toBe(200)
  })

  it('IT-78: PUT /api/master/services/:id - should return 404 when not found', async () => {
    const res = await request(app).put('/api/master/services/99999').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Ghost' })
    expect(res.status).toBe(404)
  })
})

// SUB SERVICE
describe('SubService CRUD', () => {
  it('IT-79: GET /api/master/sub-services - should return 200', async () => {
    const res = await request(app).get('/api/master/sub-services').set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })

  it('IT-80: POST /api/master/sub-services - Admin should create sub-service', async () => {
    const res = await request(app).post('/api/master/sub-services').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Test Sub-Service', serviceId: createdServiceId })
    expect(res.status).toBe(201)
    createdSubServiceId = res.body.data.id
  })

  it('IT-81: PUT /api/master/sub-services/:id - Admin should update sub-service', async () => {
    const res = await request(app).put(`/api/master/sub-services/${createdSubServiceId}`).set('Authorization', `Bearer ${adminToken}`).send({ name: 'Updated Sub-Service', serviceId: createdServiceId })
    expect(res.status).toBe(200)
  })

  it('IT-82: DELETE /api/master/sub-services/:id - Admin should delete sub-service', async () => {
    const res = await request(app).delete(`/api/master/sub-services/${createdSubServiceId}`).set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })

  it('IT-83: DELETE /api/master/services/:id - Admin should delete service', async () => {
    const res = await request(app).delete(`/api/master/services/${createdServiceId}`).set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })
})

// DELETE hierarchy (harus urut: salesTeam → department → division → group)
describe('Delete hierarchy master data', () => {
  it('IT-84: DELETE sales team', async () => {
    const res = await request(app).delete(`/api/master/sales-teams/${createdSalesTeamId}`).set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })

  it('IT-85: DELETE department', async () => {
    const res = await request(app).delete(`/api/master/departments/${createdDepartmentId}`).set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })

  it('IT-86: DELETE division', async () => {
    const res = await request(app).delete(`/api/master/divisions/${createdDivisionId}`).set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })

  it('IT-87: DELETE group', async () => {
    const res = await request(app).delete(`/api/master/groups/${createdGroupId}`).set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })
})
