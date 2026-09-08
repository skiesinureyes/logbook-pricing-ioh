// // require('dotenv').config({ path: '.env.test' })
// // const request = require('supertest')
// // const app = require('../../app')
// // const { setupDB } = require('./setup')

// // let adminToken
// // let staffToken
// // let avpToken
// // let createdBCId

// // const validBC = {
// //   bcTitle: 'Test Business Case Integration',
// //   bcType: 'BC',
// //   projectType: 'Non-Tender',
// //   activityType: 'BAU',
// //   projectStatus: 'On Progress',
// //   esReqDate: '2025-01-01',
// //   cfDate: '2025-02-01',
// //   rfsDate: '2025-03-01',
// //   custName: 'PT Test Customer',
// //   custJoinYear: '2020',
// //   lineOfBusiness: 'Technology',
// //   contractType: 'New',
// //   activationType: 'New',
// //   contractPeriod: '12',
// //   pricingTeamId: '1',
// //   preSalesTeamId: '1',
// //   'salesTeamIds[]': '1',
// //   'serviceDetails[0][serviceId]': '1',
// //   'serviceDetails[0][subServiceId]': '1',
// //   'serviceDetails[0][serviceSegment]': 'TelCo',
// //   'serviceDetails[0][serviceLocation]': 'Jawa-Bali'
// // }

// // beforeAll(async () => {
// //   await setupDB()
// //   const adminRes = await request(app)
// //     .post('/api/auth/login')
// //     .send({ username: 'admin', password: 'admin123' })
// //   adminToken = adminRes.body.data.token

// //   await request(app)
// //     .post('/api/users')
// //     .set('Authorization', `Bearer ${adminToken}`)
// //     .send({ username: 'staf01', firstName: 'Staf', lastName: 'Satu', password: 'staf123', role: 'Staf' })
// //   const staffRes = await request(app)
// //     .post('/api/auth/login')
// //     .send({ username: 'staf01', password: 'staf123' })
// //   staffToken = staffRes.body.data.token

// //   await request(app)
// //     .post('/api/users')
// //     .set('Authorization', `Bearer ${adminToken}`)
// //     .send({ username: 'avp01', firstName: 'AVP', lastName: 'Satu', password: 'avp123', role: 'AVP & VP' })
// //   const avpRes = await request(app)
// //     .post('/api/auth/login')
// //     .send({ username: 'avp01', password: 'avp123' })
// //   avpToken = avpRes.body.data.token
// // }, 30000)

// // // FR-06: Tabel Business Case
// // describe('GET /api/business-cases', () => {
// //   it('IT-18: should return 200 with list of BC when authenticated', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(200)
// //     expect(res.body).toHaveProperty('data')
// //     expect(res.body).toHaveProperty('meta')
// //   })

// //   it('IT-19: should return 401 when no token', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases')
// //     expect(res.status).toBe(401)
// //   })
// // })

// // // FR-05: Tabel Tindak Lanjut Tertunda
// // describe('GET /api/business-cases/pending-follow-up', () => {
// //   it('IT-20: should return 200 with pending follow-up list', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases/pending-follow-up')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(200)
// //     expect(res.body).toHaveProperty('data')
// //     expect(Array.isArray(res.body.data)).toBe(true)
// //   })

// //   it('IT-21: should return 401 when no token', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases/pending-follow-up')
// //     expect(res.status).toBe(401)
// //   })
// // })

// // // FR-04: Dashboard Stats
// // describe('GET /api/business-cases/dashboard/stats', () => {
// //   it('IT-22: should return 200 with dashboard stats when authenticated', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases/dashboard/stats')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(200)
// //     expect(res.body.data).toHaveProperty('bcByStatus')
// //     expect(res.body.data).toHaveProperty('bcTcvByService')
// //     expect(res.body.data).toHaveProperty('totalBC')
// //   })

// //   it('IT-23: should return 200 with filtered dashboard stats', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases/dashboard/stats?bcType=BC')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(200)
// //     expect(res.body.data).toHaveProperty('totalBC')
// //   })

// //   it('IT-24: should return 401 when no token', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases/dashboard/stats')
// //     expect(res.status).toBe(401)
// //   })
// // })

// // // FR-07: Aksi Entri Tabel - POST
// // describe('POST /api/business-cases', () => {
// //   it('IT-25: should return 201 when Admin creates BC', async () => {
// //     const res = await request(app)
// //       .post('/api/business-cases')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //       .field(validBC)
// //     expect(res.status).toBe(201)
// //     expect(res.body.data).toHaveProperty('id')
// //     expect(res.body.data).toHaveProperty('bcCode')
// //     createdBCId = res.body.data.id
// //   })

// //   it('IT-26: should return 201 when Staf creates BC', async () => {
// //     const res = await request(app)
// //       .post('/api/business-cases')
// //       .set('Authorization', `Bearer ${staffToken}`)
// //       .field({ ...validBC, bcTitle: 'BC by Staf' })
// //     expect(res.status).toBe(201)
// //     expect(res.body.data).toHaveProperty('bcCode')
// //   })

// //   it('IT-27: should return 403 when AVP & VP tries to create BC', async () => {
// //     const res = await request(app)
// //       .post('/api/business-cases')
// //       .set('Authorization', `Bearer ${avpToken}`)
// //       .field(validBC)
// //     expect(res.status).toBe(403)
// //   })

// //   it('IT-28: should return 401 when no token', async () => {
// //     const res = await request(app)
// //       .post('/api/business-cases')
// //       .field(validBC)
// //     expect(res.status).toBe(401)
// //   })
// // })

// // // FR-07: Aksi Entri Tabel - GET Detail
// // describe('GET /api/business-cases/:id', () => {
// //   it('IT-29: should return 200 with BC detail', async () => {
// //     const res = await request(app)
// //       .get(`/api/business-cases/${createdBCId}`)
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(200)
// //     expect(res.body.data).toHaveProperty('bcTitle', 'Test Business Case Integration')
// //   })

// //   it('IT-30: should return 200 when AVP & VP views BC detail', async () => {
// //     const res = await request(app)
// //       .get(`/api/business-cases/${createdBCId}`)
// //       .set('Authorization', `Bearer ${avpToken}`)
// //     expect(res.status).toBe(200)
// //   })

// //   it('IT-31: should return 404 when BC not found', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases/99999')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(404)
// //     expect(res.body.message).toBe('Business Case tidak ditemukan')
// //   })
// // })

// // // FR-08: Pencarian, Pengurutan, Penyaringan
// // describe('GET /api/business-cases - search, sort, filter', () => {
// //   it('IT-32: should return 200 with search results by bcTitle', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases?search=Test Business Case')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(200)
// //     expect(res.body.data.length).toBeGreaterThan(0)
// //   })

// //   it('IT-33: should return 200 with search results by custName', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases?search=PT Test Customer')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(200)
// //     expect(res.body.data.length).toBeGreaterThan(0)
// //   })

// //   it('IT-34: should return 200 with empty results for non-existent search', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases?search=XXXXXXXXXNOTFOUND')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(200)
// //     expect(res.body.data.length).toBe(0)
// //   })

// //   it('IT-35: should return 200 sorted by bcTitle ASC', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases?sort=bcTitle&order=ASC')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(200)
// //     expect(res.body).toHaveProperty('data')
// //   })

// //   it('IT-36: should return 200 sorted by createdAt DESC', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases?sort=createdAt&order=DESC')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(200)
// //     expect(res.body).toHaveProperty('data')
// //   })

// //   it('IT-37: should return 200 with pagination', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases?page=1&limit=5')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(200)
// //     expect(res.body.meta).toHaveProperty('page', 1)
// //     expect(res.body.meta).toHaveProperty('limit', 5)
// //   })
// // })

// // // FR-07: Aksi Entri Tabel - PUT
// // describe('PUT /api/business-cases/:id', () => {
// //   it('IT-38: should return 200 when Admin updates BC', async () => {
// //     const res = await request(app)
// //       .put(`/api/business-cases/${createdBCId}`)
// //       .set('Authorization', `Bearer ${adminToken}`)
// //       .field({ ...validBC, bcTitle: 'Updated Business Case', updateFollowUpDate: 'false' })
// //     expect(res.status).toBe(200)
// //     expect(res.body.message).toBe('Business Case berhasil diperbarui')
// //   })

// //   it('IT-39: should return 200 when Staf updates BC', async () => {
// //     const res = await request(app)
// //       .put(`/api/business-cases/${createdBCId}`)
// //       .set('Authorization', `Bearer ${staffToken}`)
// //       .field({ ...validBC, bcTitle: 'Updated by Staf', updateFollowUpDate: 'false' })
// //     expect(res.status).toBe(200)
// //   })

// //   it('IT-40: should return 403 when AVP & VP tries to update BC', async () => {
// //     const res = await request(app)
// //       .put(`/api/business-cases/${createdBCId}`)
// //       .set('Authorization', `Bearer ${avpToken}`)
// //       .field(validBC)
// //     expect(res.status).toBe(403)
// //   })

// //   it('IT-41: should return 404 when BC not found', async () => {
// //     const res = await request(app)
// //       .put('/api/business-cases/99999')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //       .field(validBC)
// //     expect(res.status).toBe(404)
// //     expect(res.body.message).toBe('Business Case tidak ditemukan')
// //   })
// // })

// // // FR-07: Aksi Entri Tabel - DELETE
// // describe('DELETE /api/business-cases/:id', () => {
// //   it('IT-42: should return 403 when AVP & VP tries to delete BC', async () => {
// //     const res = await request(app)
// //       .delete(`/api/business-cases/${createdBCId}`)
// //       .set('Authorization', `Bearer ${avpToken}`)
// //     expect(res.status).toBe(403)
// //   })

// //   it('IT-43: should return 200 when Admin deletes BC', async () => {
// //     const res = await request(app)
// //       .delete(`/api/business-cases/${createdBCId}`)
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(200)
// //     expect(res.body.message).toBe('Business Case berhasil dihapus')
// //   })

// //   it('IT-44: should return 404 when BC not found', async () => {
// //     const res = await request(app)
// //       .delete('/api/business-cases/99999')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(404)
// //     expect(res.body.message).toBe('Business Case tidak ditemukan')
// //   })
// // })

// // // FR-09: Ekspor Data ke Microsoft Excel
// // describe('GET /api/business-cases/export', () => {
// //   it('IT-45: should return 200 and xlsx file', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases/export')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(200)
// //     expect(res.headers['content-type']).toContain('spreadsheetml')
// //   })

// //   it('IT-46: should return 200 with filtered export by search', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases/export?search=Test')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(200)
// //     expect(res.headers['content-type']).toContain('spreadsheetml')
// //   })

// //   it('IT-47: should return 401 when no token', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases/export')
// //     expect(res.status).toBe(401)
// //   })
// // })

// // // FR-08: Daftar Nama Pelanggan
// // describe('GET /api/business-cases/cust-names', () => {
// //   it('IT-92: should return 200 with array of customer names when authenticated', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases/cust-names')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(200)
// //     expect(Array.isArray(res.body.data)).toBe(true)
// //   })

// //   it('IT-94: should return 401 when no token', async () => {
// //     const res = await request(app)
// //       .get('/api/business-cases/cust-names')
// //     expect(res.status).toBe(401)
// //   })
// // })

// // // FR-07: Unduh Berkas Lampiran BC
// // describe('GET /api/business-cases/:id/file', () => {
// //   let bcWithFileId
// //   let bcWithoutFileId

// //   beforeAll(async () => {
// //     const withFileRes = await request(app)
// //       .post('/api/business-cases')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //       .field({ ...validBC, bcTitle: 'BC dengan Lampiran' })
// //       .attach('file', Buffer.from('dummy file content'), 'lampiran-bc.pdf')
// //     if (withFileRes.status !== 201) {
// //       console.log('DEBUG withFileRes:', withFileRes.status, JSON.stringify(withFileRes.body))
// //     }
// //     bcWithFileId = withFileRes.body.data.id

// //     const withoutFileRes = await request(app)
// //       .post('/api/business-cases')
// //       .set('Authorization', `Bearer ${adminToken}`)
// //       .field({ ...validBC, bcTitle: 'BC tanpa Lampiran' })
// //     bcWithoutFileId = withoutFileRes.body.data.id
// //   })

// //   it('IT-95: should return 200 and download file when BC has attached file', async () => {
// //     const res = await request(app)
// //       .get(`/api/business-cases/${bcWithFileId}/file`)
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(200)
// //     expect(res.headers['content-type']).toContain('octet-stream')
// //   })

// //   it('IT-96: should return 401 when no token', async () => {
// //     const res = await request(app)
// //       .get(`/api/business-cases/${bcWithFileId}/file`)
// //     expect(res.status).toBe(401)
// //   })

// //   it('IT-98: should return 404 when BC has no attached file', async () => {
// //     const res = await request(app)
// //       .get(`/api/business-cases/${bcWithoutFileId}/file`)
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(404)
// //     expect(res.body.message).toBe('File tidak ditemukan')
// //   })

// //   it('IT-99: should return 404 when file record exists but physical file is missing on server', async () => {
// //     const fs = require('fs')
// //     const BusinessCase = require('../../models/BusinessCase')
// //     const bc = await BusinessCase.findByPk(bcWithFileId)
// //     if (bc.filePath && fs.existsSync(bc.filePath)) fs.unlinkSync(bc.filePath)

// //     const res = await request(app)
// //       .get(`/api/business-cases/${bcWithFileId}/file`)
// //       .set('Authorization', `Bearer ${adminToken}`)
// //     expect(res.status).toBe(404)
// //     expect(res.body.message).toBe('File tidak ditemukan di server')
// //   })
// // })

// // // require('dotenv').config({ path: '.env.test' })
// // // const request = require('supertest')
// // // const app = require('../../app')
// // // const { setupDB } = require('./setup')

// // // let adminToken
// // // let staffToken
// // // let avpToken
// // // let createdBCId

// // // const validBC = {
// // //   bcTitle: 'Test Business Case Integration',
// // //   bcType: 'BC',
// // //   projectType: 'Non-Tender',
// // //   activityType: 'BAU',
// // //   projectStatus: 'On Progress',
// // //   esReqDate: '2025-01-01',
// // //   cfDate: '2025-02-01',
// // //   rfsDate: '2025-03-01',
// // //   custName: 'PT Test Customer',
// // //   custJoinYear: '2020',
// // //   lineOfBusiness: 'Technology',
// // //   contractType: 'New',
// // //   activationType: 'New',
// // //   contractPeriod: '12',
// // //   pricingTeamId: '1',
// // //   preSalesTeamId: '1',
// // //   'salesTeamIds[]': '1',
// // //   'serviceDetails[0][serviceId]': '1',
// // //   'serviceDetails[0][subServiceId]': '1',
// // //   'serviceDetails[0][serviceSegment]': 'TelCo',
// // //   'serviceDetails[0][serviceLocation]': 'Jawa-Bali'
// // // }

// // // beforeAll(async () => {
// // //   await setupDB()
// // //   const adminRes = await request(app)
// // //     .post('/api/auth/login')
// // //     .send({ username: 'admin', password: 'admin123' })
// // //   adminToken = adminRes.body.data.token

// // //   await request(app)
// // //     .post('/api/users')
// // //     .set('Authorization', `Bearer ${adminToken}`)
// // //     .send({ username: 'staf01', firstName: 'Staf', lastName: 'Satu', password: 'staf123', role: 'Staf' })
// // //   const staffRes = await request(app)
// // //     .post('/api/auth/login')
// // //     .send({ username: 'staf01', password: 'staf123' })
// // //   staffToken = staffRes.body.data.token

// // //   await request(app)
// // //     .post('/api/users')
// // //     .set('Authorization', `Bearer ${adminToken}`)
// // //     .send({ username: 'avp01', firstName: 'AVP', lastName: 'Satu', password: 'avp123', role: 'AVP & VP' })
// // //   const avpRes = await request(app)
// // //     .post('/api/auth/login')
// // //     .send({ username: 'avp01', password: 'avp123' })
// // //   avpToken = avpRes.body.data.token
// // // }, 30000)

// // // // FR-06: Tabel Business Case
// // // describe('GET /api/business-cases', () => {
// // //   it('IT-18: should return 200 with list of BC when authenticated', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body).toHaveProperty('data')
// // //     expect(res.body).toHaveProperty('meta')
// // //   })

// // //   it('IT-19: should return 401 when no token', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases')
// // //     expect(res.status).toBe(401)
// // //   })
// // // })

// // // // FR-05: Tabel Tindak Lanjut Tertunda
// // // describe('GET /api/business-cases/pending-follow-up', () => {
// // //   it('IT-20: should return 200 with pending follow-up list', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/pending-follow-up')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body).toHaveProperty('data')
// // //     expect(Array.isArray(res.body.data)).toBe(true)
// // //   })

// // //   it('IT-21: should return 401 when no token', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/pending-follow-up')
// // //     expect(res.status).toBe(401)
// // //   })
// // // })

// // // // FR-04: Dashboard Stats
// // // describe('GET /api/business-cases/dashboard/stats', () => {
// // //   it('IT-22: should return 200 with dashboard stats when authenticated', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/dashboard/stats')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.data).toHaveProperty('bcByStatus')
// // //     expect(res.body.data).toHaveProperty('bcTcvByService')
// // //     expect(res.body.data).toHaveProperty('totalBC')
// // //   })

// // //   it('IT-23: should return 200 with filtered dashboard stats', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/dashboard/stats?bcType=BC')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.data).toHaveProperty('totalBC')
// // //   })

// // //   it('IT-24: should return 401 when no token', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/dashboard/stats')
// // //     expect(res.status).toBe(401)
// // //   })
// // // })

// // // // FR-07: Aksi Entri Tabel - POST
// // // describe('POST /api/business-cases', () => {
// // //   it('IT-25: should return 201 when Admin creates BC', async () => {
// // //     const res = await request(app)
// // //       .post('/api/business-cases')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //       .field(validBC)
// // //     expect(res.status).toBe(201)
// // //     expect(res.body.data).toHaveProperty('id')
// // //     expect(res.body.data).toHaveProperty('bcCode')
// // //     createdBCId = res.body.data.id
// // //   })

// // //   it('IT-26: should return 201 when Staf creates BC', async () => {
// // //     const res = await request(app)
// // //       .post('/api/business-cases')
// // //       .set('Authorization', `Bearer ${staffToken}`)
// // //       .field({ ...validBC, bcTitle: 'BC by Staf' })
// // //     expect(res.status).toBe(201)
// // //     expect(res.body.data).toHaveProperty('bcCode')
// // //   })

// // //   it('IT-27: should return 403 when AVP & VP tries to create BC', async () => {
// // //     const res = await request(app)
// // //       .post('/api/business-cases')
// // //       .set('Authorization', `Bearer ${avpToken}`)
// // //       .field(validBC)
// // //     expect(res.status).toBe(403)
// // //   })

// // //   it('IT-28: should return 401 when no token', async () => {
// // //     const res = await request(app)
// // //       .post('/api/business-cases')
// // //       .field(validBC)
// // //     expect(res.status).toBe(401)
// // //   })
// // // })

// // // // FR-07: Aksi Entri Tabel - GET Detail
// // // describe('GET /api/business-cases/:id', () => {
// // //   it('IT-29: should return 200 with BC detail', async () => {
// // //     const res = await request(app)
// // //       .get(`/api/business-cases/${createdBCId}`)
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.data).toHaveProperty('bcTitle', 'Test Business Case Integration')
// // //   })

// // //   it('IT-30: should return 200 when AVP & VP views BC detail', async () => {
// // //     const res = await request(app)
// // //       .get(`/api/business-cases/${createdBCId}`)
// // //       .set('Authorization', `Bearer ${avpToken}`)
// // //     expect(res.status).toBe(200)
// // //   })

// // //   it('IT-31: should return 404 when BC not found', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/99999')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(404)
// // //     expect(res.body.message).toBe('Business Case tidak ditemukan')
// // //   })
// // // })

// // // // FR-08: Pencarian, Pengurutan, Penyaringan
// // // describe('GET /api/business-cases - search, sort, filter', () => {
// // //   it('IT-32: should return 200 with search results by bcTitle', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases?search=Test Business Case')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.data.length).toBeGreaterThan(0)
// // //   })

// // //   it('IT-33: should return 200 with search results by custName', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases?search=PT Test Customer')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.data.length).toBeGreaterThan(0)
// // //   })

// // //   it('IT-34: should return 200 with empty results for non-existent search', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases?search=XXXXXXXXXNOTFOUND')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.data.length).toBe(0)
// // //   })

// // //   it('IT-35: should return 200 sorted by bcTitle ASC', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases?sort=bcTitle&order=ASC')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body).toHaveProperty('data')
// // //   })

// // //   it('IT-36: should return 200 sorted by createdAt DESC', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases?sort=createdAt&order=DESC')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body).toHaveProperty('data')
// // //   })

// // //   it('IT-37: should return 200 with pagination', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases?page=1&limit=5')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.meta).toHaveProperty('page', 1)
// // //     expect(res.body.meta).toHaveProperty('limit', 5)
// // //   })
// // // })

// // // // FR-07: Aksi Entri Tabel - PUT
// // // describe('PUT /api/business-cases/:id', () => {
// // //   it('IT-38: should return 200 when Admin updates BC', async () => {
// // //     const res = await request(app)
// // //       .put(`/api/business-cases/${createdBCId}`)
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //       .field({ ...validBC, bcTitle: 'Updated Business Case', updateFollowUpDate: 'false' })
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.message).toBe('Business Case berhasil diperbarui')
// // //   })

// // //   it('IT-39: should return 200 when Staf updates BC', async () => {
// // //     const res = await request(app)
// // //       .put(`/api/business-cases/${createdBCId}`)
// // //       .set('Authorization', `Bearer ${staffToken}`)
// // //       .field({ ...validBC, bcTitle: 'Updated by Staf', updateFollowUpDate: 'false' })
// // //     expect(res.status).toBe(200)
// // //   })

// // //   it('IT-40: should return 403 when AVP & VP tries to update BC', async () => {
// // //     const res = await request(app)
// // //       .put(`/api/business-cases/${createdBCId}`)
// // //       .set('Authorization', `Bearer ${avpToken}`)
// // //       .field(validBC)
// // //     expect(res.status).toBe(403)
// // //   })

// // //   it('IT-41: should return 404 when BC not found', async () => {
// // //     const res = await request(app)
// // //       .put('/api/business-cases/99999')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //       .field(validBC)
// // //     expect(res.status).toBe(404)
// // //     expect(res.body.message).toBe('Business Case tidak ditemukan')
// // //   })
// // // })

// // // // FR-07: Aksi Entri Tabel - DELETE
// // // describe('DELETE /api/business-cases/:id', () => {
// // //   it('IT-42: should return 403 when AVP & VP tries to delete BC', async () => {
// // //     const res = await request(app)
// // //       .delete(`/api/business-cases/${createdBCId}`)
// // //       .set('Authorization', `Bearer ${avpToken}`)
// // //     expect(res.status).toBe(403)
// // //   })

// // //   it('IT-43: should return 200 when Admin deletes BC', async () => {
// // //     const res = await request(app)
// // //       .delete(`/api/business-cases/${createdBCId}`)
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.message).toBe('Business Case berhasil dihapus')
// // //   })

// // //   it('IT-44: should return 404 when BC not found', async () => {
// // //     const res = await request(app)
// // //       .delete('/api/business-cases/99999')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(404)
// // //     expect(res.body.message).toBe('Business Case tidak ditemukan')
// // //   })
// // // })

// // // // FR-09: Ekspor Data ke Microsoft Excel
// // // describe('GET /api/business-cases/export', () => {
// // //   it('IT-45: should return 200 and xlsx file', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/export')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.headers['content-type']).toContain('spreadsheetml')
// // //   })

// // //   it('IT-46: should return 200 with filtered export by search', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/export?search=Test')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.headers['content-type']).toContain('spreadsheetml')
// // //   })

// // //   it('IT-47: should return 401 when no token', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/export')
// // //     expect(res.status).toBe(401)
// // //   })
// // // })

// // // // FR-08: Daftar Nama Pelanggan
// // // describe('GET /api/business-cases/cust-names', () => {
// // //   it('IT-92: should return 200 with array of customer names when authenticated', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/cust-names')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(Array.isArray(res.body.data)).toBe(true)
// // //   })

// // //   it('IT-94: should return 401 when no token', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/cust-names')
// // //     expect(res.status).toBe(401)
// // //   })
// // // })

// // // // FR-07: Unduh Berkas Lampiran BC
// // // describe('GET /api/business-cases/:id/file', () => {
// // //   let bcWithFileId
// // //   let bcWithoutFileId

// // //   beforeAll(async () => {
// // //     const withFileRes = await request(app)
// // //       .post('/api/business-cases')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //       .field({ ...validBC, bcTitle: 'BC dengan Lampiran' })
// // //       .attach('file', Buffer.from('dummy file content'), 'lampiran-bc.pdf')
// // //     bcWithFileId = withFileRes.body.data.id

// // //     const withoutFileRes = await request(app)
// // //       .post('/api/business-cases')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //       .field({ ...validBC, bcTitle: 'BC tanpa Lampiran' })
// // //     bcWithoutFileId = withoutFileRes.body.data.id
// // //   })

// // //   it('IT-95: should return 200 and download file when BC has attached file', async () => {
// // //     const res = await request(app)
// // //       .get(`/api/business-cases/${bcWithFileId}/file`)
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.headers['content-type']).toContain('octet-stream')
// // //   })

// // //   it('IT-96: should return 401 when no token', async () => {
// // //     const res = await request(app)
// // //       .get(`/api/business-cases/${bcWithFileId}/file`)
// // //     expect(res.status).toBe(401)
// // //   })

// // //   it('IT-98: should return 404 when BC has no attached file', async () => {
// // //     const res = await request(app)
// // //       .get(`/api/business-cases/${bcWithoutFileId}/file`)
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(404)
// // //     expect(res.body.message).toBe('File tidak ditemukan')
// // //   })

// // //   it('IT-99: should return 404 when file record exists but physical file is missing on server', async () => {
// // //     const fs = require('fs')
// // //     const BusinessCase = require('../../models/BusinessCase')
// // //     const bc = await BusinessCase.findByPk(bcWithFileId)
// // //     if (bc.filePath && fs.existsSync(bc.filePath)) fs.unlinkSync(bc.filePath)

// // //     const res = await request(app)
// // //       .get(`/api/business-cases/${bcWithFileId}/file`)
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(404)
// // //     expect(res.body.message).toBe('File tidak ditemukan di server')
// // //   })
// // // })

// // // require('dotenv').config({ path: '.env.test' })
// // // const request = require('supertest')
// // // const app = require('../../app')
// // // const { setupDB } = require('./setup')

// // // let adminToken
// // // let staffToken
// // // let avpToken
// // // let createdBCId

// // // const validBC = {
// // //   bcTitle: 'Test Business Case Integration',
// // //   bcType: 'BC',
// // //   projectType: 'Non-Tender',
// // //   activityType: 'BAU',
// // //   projectStatus: 'On Progress',
// // //   esReqDate: '2025-01-01',
// // //   cfDate: '2025-02-01',
// // //   rfsDate: '2025-03-01',
// // //   custName: 'PT Test Customer',
// // //   custJoinYear: '2020',
// // //   lineOfBusiness: 'Technology',
// // //   contractType: 'New',
// // //   activationType: 'New',
// // //   contractPeriod: '12',
// // //   pricingTeamId: '1',
// // //   preSalesTeamId: '1',
// // //   'salesTeamIds[]': '1',
// // //   'serviceDetails[0][serviceId]': '1',
// // //   'serviceDetails[0][subServiceId]': '1',
// // //   'serviceDetails[0][serviceSegment]': 'TelCo',
// // //   'serviceDetails[0][serviceLocation]': 'Jawa-Bali'
// // // }

// // // beforeAll(async () => {
// // //   await setupDB()
// // //   const adminRes = await request(app)
// // //     .post('/api/auth/login')
// // //     .send({ username: 'admin', password: 'admin123' })
// // //   adminToken = adminRes.body.data.token

// // //   await request(app)
// // //     .post('/api/users')
// // //     .set('Authorization', `Bearer ${adminToken}`)
// // //     .send({ username: 'staf01', firstName: 'Staf', lastName: 'Satu', password: 'staf123', role: 'Staf' })
// // //   const staffRes = await request(app)
// // //     .post('/api/auth/login')
// // //     .send({ username: 'staf01', password: 'staf123' })
// // //   staffToken = staffRes.body.data.token

// // //   await request(app)
// // //     .post('/api/users')
// // //     .set('Authorization', `Bearer ${adminToken}`)
// // //     .send({ username: 'avp01', firstName: 'AVP', lastName: 'Satu', password: 'avp123', role: 'AVP & VP' })
// // //   const avpRes = await request(app)
// // //     .post('/api/auth/login')
// // //     .send({ username: 'avp01', password: 'avp123' })
// // //   avpToken = avpRes.body.data.token
// // // }, 30000)

// // // // FR-06: Tabel Business Case
// // // describe('GET /api/business-cases', () => {
// // //   it('IT-18: should return 200 with list of BC when authenticated', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body).toHaveProperty('data')
// // //     expect(res.body).toHaveProperty('meta')
// // //   })

// // //   it('IT-19: should return 401 when no token', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases')
// // //     expect(res.status).toBe(401)
// // //   })
// // // })

// // // // FR-05: Tabel Tindak Lanjut Tertunda
// // // describe('GET /api/business-cases/pending-follow-up', () => {
// // //   it('IT-20: should return 200 with pending follow-up list', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/pending-follow-up')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body).toHaveProperty('data')
// // //     expect(Array.isArray(res.body.data)).toBe(true)
// // //   })

// // //   it('IT-21: should return 401 when no token', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/pending-follow-up')
// // //     expect(res.status).toBe(401)
// // //   })
// // // })

// // // // FR-04: Dashboard Stats
// // // describe('GET /api/business-cases/dashboard/stats', () => {
// // //   it('IT-22: should return 200 with dashboard stats when authenticated', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/dashboard/stats')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.data).toHaveProperty('bcByStatus')
// // //     expect(res.body.data).toHaveProperty('bcTcvByService')
// // //     expect(res.body.data).toHaveProperty('totalBC')
// // //   })

// // //   it('IT-23: should return 200 with filtered dashboard stats', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/dashboard/stats?bcType=BC')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.data).toHaveProperty('totalBC')
// // //   })

// // //   it('IT-24: should return 401 when no token', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/dashboard/stats')
// // //     expect(res.status).toBe(401)
// // //   })
// // // })

// // // // FR-07: Aksi Entri Tabel - POST
// // // describe('POST /api/business-cases', () => {
// // //   it('IT-25: should return 201 when Admin creates BC', async () => {
// // //     const res = await request(app)
// // //       .post('/api/business-cases')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //       .field(validBC)
// // //     expect(res.status).toBe(201)
// // //     expect(res.body.data).toHaveProperty('id')
// // //     expect(res.body.data).toHaveProperty('bcCode')
// // //     createdBCId = res.body.data.id
// // //   })

// // //   it('IT-26: should return 201 when Staf creates BC', async () => {
// // //     const res = await request(app)
// // //       .post('/api/business-cases')
// // //       .set('Authorization', `Bearer ${staffToken}`)
// // //       .field({ ...validBC, bcTitle: 'BC by Staf' })
// // //     expect(res.status).toBe(201)
// // //     expect(res.body.data).toHaveProperty('bcCode')
// // //   })

// // //   it('IT-27: should return 403 when AVP & VP tries to create BC', async () => {
// // //     const res = await request(app)
// // //       .post('/api/business-cases')
// // //       .set('Authorization', `Bearer ${avpToken}`)
// // //       .field(validBC)
// // //     expect(res.status).toBe(403)
// // //   })

// // //   it('IT-28: should return 401 when no token', async () => {
// // //     const res = await request(app)
// // //       .post('/api/business-cases')
// // //       .field(validBC)
// // //     expect(res.status).toBe(401)
// // //   })
// // // })

// // // // FR-07: Aksi Entri Tabel - GET Detail
// // // describe('GET /api/business-cases/:id', () => {
// // //   it('IT-29: should return 200 with BC detail', async () => {
// // //     const res = await request(app)
// // //       .get(`/api/business-cases/${createdBCId}`)
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.data).toHaveProperty('bcTitle', 'Test Business Case Integration')
// // //   })

// // //   it('IT-30: should return 200 when AVP & VP views BC detail', async () => {
// // //     const res = await request(app)
// // //       .get(`/api/business-cases/${createdBCId}`)
// // //       .set('Authorization', `Bearer ${avpToken}`)
// // //     expect(res.status).toBe(200)
// // //   })

// // //   it('IT-31: should return 404 when BC not found', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/99999')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(404)
// // //     expect(res.body.message).toBe('Business Case tidak ditemukan')
// // //   })
// // // })

// // // // FR-08: Pencarian, Pengurutan, Penyaringan
// // // describe('GET /api/business-cases - search, sort, filter', () => {
// // //   it('IT-32: should return 200 with search results by bcTitle', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases?search=Test Business Case')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.data.length).toBeGreaterThan(0)
// // //   })

// // //   it('IT-33: should return 200 with search results by custName', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases?search=PT Test Customer')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.data.length).toBeGreaterThan(0)
// // //   })

// // //   it('IT-34: should return 200 with empty results for non-existent search', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases?search=XXXXXXXXXNOTFOUND')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.data.length).toBe(0)
// // //   })

// // //   it('IT-35: should return 200 sorted by bcTitle ASC', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases?sort=bcTitle&order=ASC')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body).toHaveProperty('data')
// // //   })

// // //   it('IT-36: should return 200 sorted by createdAt DESC', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases?sort=createdAt&order=DESC')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body).toHaveProperty('data')
// // //   })

// // //   it('IT-37: should return 200 with pagination', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases?page=1&limit=5')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.meta).toHaveProperty('page', 1)
// // //     expect(res.body.meta).toHaveProperty('limit', 5)
// // //   })
// // // })

// // // // FR-07: Aksi Entri Tabel - PUT
// // // describe('PUT /api/business-cases/:id', () => {
// // //   it('IT-38: should return 200 when Admin updates BC', async () => {
// // //     const res = await request(app)
// // //       .put(`/api/business-cases/${createdBCId}`)
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //       .field({ ...validBC, bcTitle: 'Updated Business Case', updateFollowUpDate: 'false' })
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.message).toBe('Business Case berhasil diperbarui')
// // //   })

// // //   it('IT-39: should return 200 when Staf updates BC', async () => {
// // //     const res = await request(app)
// // //       .put(`/api/business-cases/${createdBCId}`)
// // //       .set('Authorization', `Bearer ${staffToken}`)
// // //       .field({ ...validBC, bcTitle: 'Updated by Staf', updateFollowUpDate: 'false' })
// // //     expect(res.status).toBe(200)
// // //   })

// // //   it('IT-40: should return 403 when AVP & VP tries to update BC', async () => {
// // //     const res = await request(app)
// // //       .put(`/api/business-cases/${createdBCId}`)
// // //       .set('Authorization', `Bearer ${avpToken}`)
// // //       .field(validBC)
// // //     expect(res.status).toBe(403)
// // //   })

// // //   it('IT-41: should return 404 when BC not found', async () => {
// // //     const res = await request(app)
// // //       .put('/api/business-cases/99999')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //       .field(validBC)
// // //     expect(res.status).toBe(404)
// // //     expect(res.body.message).toBe('Business Case tidak ditemukan')
// // //   })
// // // })

// // // // FR-07: Aksi Entri Tabel - DELETE
// // // describe('DELETE /api/business-cases/:id', () => {
// // //   it('IT-42: should return 403 when AVP & VP tries to delete BC', async () => {
// // //     const res = await request(app)
// // //       .delete(`/api/business-cases/${createdBCId}`)
// // //       .set('Authorization', `Bearer ${avpToken}`)
// // //     expect(res.status).toBe(403)
// // //   })

// // //   it('IT-43: should return 200 when Admin deletes BC', async () => {
// // //     const res = await request(app)
// // //       .delete(`/api/business-cases/${createdBCId}`)
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.body.message).toBe('Business Case berhasil dihapus')
// // //   })

// // //   it('IT-44: should return 404 when BC not found', async () => {
// // //     const res = await request(app)
// // //       .delete('/api/business-cases/99999')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(404)
// // //     expect(res.body.message).toBe('Business Case tidak ditemukan')
// // //   })
// // // })

// // // // FR-09: Ekspor Data ke Microsoft Excel
// // // describe('GET /api/business-cases/export', () => {
// // //   it('IT-45: should return 200 and xlsx file', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/export')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.headers['content-type']).toContain('spreadsheetml')
// // //   })

// // //   it('IT-46: should return 200 with filtered export by search', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/export?search=Test')
// // //       .set('Authorization', `Bearer ${adminToken}`)
// // //     expect(res.status).toBe(200)
// // //     expect(res.headers['content-type']).toContain('spreadsheetml')
// // //   })

// // //   it('IT-47: should return 401 when no token', async () => {
// // //     const res = await request(app)
// // //       .get('/api/business-cases/export')
// // //     expect(res.status).toBe(401)
// // //   })
// // // })

// require('dotenv').config({ path: '.env.test' })
// const request = require('supertest')
// const app = require('../../app')
// const { setupDB } = require('./setup')

// let adminToken
// let staffToken
// let avpToken
// let createdBCId

// const validBC = {
//   bcTitle: 'Test Business Case Integration',
//   bcType: 'BC',
//   projectType: 'Non-Tender',
//   activityType: 'BAU',
//   projectStatus: 'On Progress',
//   esReqDate: '2025-01-01',
//   cfDate: '2025-02-01',
//   rfsDate: '2025-03-01',
//   custName: 'PT Test Customer',
//   custJoinYear: '2020',
//   lineOfBusiness: 'Technology',
//   contractType: 'New',
//   activationType: 'New',
//   contractPeriod: '12',
//   pricingTeamId: '1',
//   preSalesTeamId: '1',
//   'salesTeamIds[]': '1',
//   'serviceDetails[0][serviceId]': '1',
//   'serviceDetails[0][subServiceId]': '1',
//   'serviceDetails[0][serviceSegment]': 'TelCo',
//   'serviceDetails[0][serviceLocation]': 'Jawa-Bali'
// }

// beforeAll(async () => {
//   await setupDB()
//   const adminRes = await request(app)
//     .post('/api/auth/login')
//     .send({ username: 'admin', password: 'admin123' })
//   adminToken = adminRes.body.data.token

//   await request(app)
//     .post('/api/users')
//     .set('Authorization', `Bearer ${adminToken}`)
//     .send({ username: 'staf01', firstName: 'Staf', lastName: 'Satu', password: 'staf123', role: 'Staf' })
//   const staffRes = await request(app)
//     .post('/api/auth/login')
//     .send({ username: 'staf01', password: 'staf123' })
//   staffToken = staffRes.body.data.token

//   await request(app)
//     .post('/api/users')
//     .set('Authorization', `Bearer ${adminToken}`)
//     .send({ username: 'avp01', firstName: 'AVP', lastName: 'Satu', password: 'avp123', role: 'AVP & VP' })
//   const avpRes = await request(app)
//     .post('/api/auth/login')
//     .send({ username: 'avp01', password: 'avp123' })
//   avpToken = avpRes.body.data.token
// }, 30000)

// // FR-06: Tabel Business Case
// describe('GET /api/business-cases', () => {
//   it('IT-18: should return 200 with list of BC when authenticated', async () => {
//     const res = await request(app)
//       .get('/api/business-cases')
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(200)
//     expect(res.body).toHaveProperty('data')
//     expect(res.body).toHaveProperty('meta')
//   })

//   it('IT-19: should return 401 when no token', async () => {
//     const res = await request(app)
//       .get('/api/business-cases')
//     expect(res.status).toBe(401)
//   })
// })

// // FR-05: Tabel Tindak Lanjut Tertunda
// describe('GET /api/business-cases/pending-follow-up', () => {
//   it('IT-20: should return 200 with pending follow-up list', async () => {
//     const res = await request(app)
//       .get('/api/business-cases/pending-follow-up')
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(200)
//     expect(res.body).toHaveProperty('data')
//     expect(Array.isArray(res.body.data)).toBe(true)
//   })

//   it('IT-21: should return 401 when no token', async () => {
//     const res = await request(app)
//       .get('/api/business-cases/pending-follow-up')
//     expect(res.status).toBe(401)
//   })
// })

// // FR-04: Dashboard Stats
// describe('GET /api/business-cases/dashboard/stats', () => {
//   it('IT-22: should return 200 with dashboard stats when authenticated', async () => {
//     const res = await request(app)
//       .get('/api/business-cases/dashboard/stats')
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(200)
//     expect(res.body.data).toHaveProperty('bcByStatus')
//     expect(res.body.data).toHaveProperty('bcTcvByService')
//     expect(res.body.data).toHaveProperty('totalBC')
//   })

//   it('IT-23: should return 200 with filtered dashboard stats', async () => {
//     const res = await request(app)
//       .get('/api/business-cases/dashboard/stats?bcType=BC')
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(200)
//     expect(res.body.data).toHaveProperty('totalBC')
//   })

//   it('IT-24: should return 401 when no token', async () => {
//     const res = await request(app)
//       .get('/api/business-cases/dashboard/stats')
//     expect(res.status).toBe(401)
//   })
// })

// // FR-07: Aksi Entri Tabel - POST
// describe('POST /api/business-cases', () => {
//   it('IT-25: should return 201 when Admin creates BC', async () => {
//     const res = await request(app)
//       .post('/api/business-cases')
//       .set('Authorization', `Bearer ${adminToken}`)
//       .field(validBC)
//     expect(res.status).toBe(201)
//     expect(res.body.data).toHaveProperty('id')
//     expect(res.body.data).toHaveProperty('bcCode')
//     createdBCId = res.body.data.id
//   })

//   it('IT-26: should return 201 when Staf creates BC', async () => {
//     const res = await request(app)
//       .post('/api/business-cases')
//       .set('Authorization', `Bearer ${staffToken}`)
//       .field({ ...validBC, bcTitle: 'BC by Staf' })
//     expect(res.status).toBe(201)
//     expect(res.body.data).toHaveProperty('bcCode')
//   })

//   it('IT-27: should return 403 when AVP & VP tries to create BC', async () => {
//     const res = await request(app)
//       .post('/api/business-cases')
//       .set('Authorization', `Bearer ${avpToken}`)
//       .field(validBC)
//     expect(res.status).toBe(403)
//   })

//   it('IT-28: should return 401 when no token', async () => {
//     const res = await request(app)
//       .post('/api/business-cases')
//       .field(validBC)
//     expect(res.status).toBe(401)
//   })
// })

// // FR-07: Aksi Entri Tabel - GET Detail
// describe('GET /api/business-cases/:id', () => {
//   it('IT-29: should return 200 with BC detail', async () => {
//     const res = await request(app)
//       .get(`/api/business-cases/${createdBCId}`)
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(200)
//     expect(res.body.data).toHaveProperty('bcTitle', 'Test Business Case Integration')
//   })

//   it('IT-30: should return 200 when AVP & VP views BC detail', async () => {
//     const res = await request(app)
//       .get(`/api/business-cases/${createdBCId}`)
//       .set('Authorization', `Bearer ${avpToken}`)
//     expect(res.status).toBe(200)
//   })

//   it('IT-31: should return 404 when BC not found', async () => {
//     const res = await request(app)
//       .get('/api/business-cases/99999')
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(404)
//     expect(res.body.message).toBe('Business Case tidak ditemukan')
//   })
// })

// // FR-08: Pencarian, Pengurutan, Penyaringan
// describe('GET /api/business-cases - search, sort, filter', () => {
//   it('IT-32: should return 200 with search results by bcTitle', async () => {
//     const res = await request(app)
//       .get('/api/business-cases?search=Test Business Case')
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(200)
//     expect(res.body.data.length).toBeGreaterThan(0)
//   })

//   it('IT-33: should return 200 with search results by custName', async () => {
//     const res = await request(app)
//       .get('/api/business-cases?search=PT Test Customer')
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(200)
//     expect(res.body.data.length).toBeGreaterThan(0)
//   })

//   it('IT-34: should return 200 with empty results for non-existent search', async () => {
//     const res = await request(app)
//       .get('/api/business-cases?search=XXXXXXXXXNOTFOUND')
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(200)
//     expect(res.body.data.length).toBe(0)
//   })

//   it('IT-35: should return 200 sorted by bcTitle ASC', async () => {
//     const res = await request(app)
//       .get('/api/business-cases?sort=bcTitle&order=ASC')
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(200)
//     expect(res.body).toHaveProperty('data')
//   })

//   it('IT-36: should return 200 sorted by createdAt DESC', async () => {
//     const res = await request(app)
//       .get('/api/business-cases?sort=createdAt&order=DESC')
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(200)
//     expect(res.body).toHaveProperty('data')
//   })

//   it('IT-37: should return 200 with pagination', async () => {
//     const res = await request(app)
//       .get('/api/business-cases?page=1&limit=5')
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(200)
//     expect(res.body.meta).toHaveProperty('page', 1)
//     expect(res.body.meta).toHaveProperty('limit', 5)
//   })
// })

// // FR-07: Aksi Entri Tabel - PUT
// describe('PUT /api/business-cases/:id', () => {
//   it('IT-38: should return 200 when Admin updates BC', async () => {
//     const res = await request(app)
//       .put(`/api/business-cases/${createdBCId}`)
//       .set('Authorization', `Bearer ${adminToken}`)
//       .field({ ...validBC, bcTitle: 'Updated Business Case', updateFollowUpDate: 'false' })
//     expect(res.status).toBe(200)
//     expect(res.body.message).toBe('Business Case berhasil diperbarui')
//   })

//   it('IT-39: should return 200 when Staf updates BC', async () => {
//     const res = await request(app)
//       .put(`/api/business-cases/${createdBCId}`)
//       .set('Authorization', `Bearer ${staffToken}`)
//       .field({ ...validBC, bcTitle: 'Updated by Staf', updateFollowUpDate: 'false' })
//     expect(res.status).toBe(200)
//   })

//   it('IT-40: should return 403 when AVP & VP tries to update BC', async () => {
//     const res = await request(app)
//       .put(`/api/business-cases/${createdBCId}`)
//       .set('Authorization', `Bearer ${avpToken}`)
//       .field(validBC)
//     expect(res.status).toBe(403)
//   })

//   it('IT-41: should return 404 when BC not found', async () => {
//     const res = await request(app)
//       .put('/api/business-cases/99999')
//       .set('Authorization', `Bearer ${adminToken}`)
//       .field(validBC)
//     expect(res.status).toBe(404)
//     expect(res.body.message).toBe('Business Case tidak ditemukan')
//   })
// })

// // FR-07: Aksi Entri Tabel - DELETE
// describe('DELETE /api/business-cases/:id', () => {
//   it('IT-42: should return 403 when AVP & VP tries to delete BC', async () => {
//     const res = await request(app)
//       .delete(`/api/business-cases/${createdBCId}`)
//       .set('Authorization', `Bearer ${avpToken}`)
//     expect(res.status).toBe(403)
//   })

//   it('IT-43: should return 200 when Admin deletes BC', async () => {
//     const res = await request(app)
//       .delete(`/api/business-cases/${createdBCId}`)
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(200)
//     expect(res.body.message).toBe('Business Case berhasil dihapus')
//   })

//   it('IT-44: should return 404 when BC not found', async () => {
//     const res = await request(app)
//       .delete('/api/business-cases/99999')
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(404)
//     expect(res.body.message).toBe('Business Case tidak ditemukan')
//   })
// })

// // FR-09: Ekspor Data ke Microsoft Excel
// describe('GET /api/business-cases/export', () => {
//   it('IT-45: should return 200 and xlsx file', async () => {
//     const res = await request(app)
//       .get('/api/business-cases/export')
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(200)
//     expect(res.headers['content-type']).toContain('spreadsheetml')
//   })

//   it('IT-46: should return 200 with filtered export by search', async () => {
//     const res = await request(app)
//       .get('/api/business-cases/export?search=Test')
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(200)
//     expect(res.headers['content-type']).toContain('spreadsheetml')
//   })

//   it('IT-47: should return 401 when no token', async () => {
//     const res = await request(app)
//       .get('/api/business-cases/export')
//     expect(res.status).toBe(401)
//   })
// })

// // FR-08: Daftar Nama Pelanggan
// describe('GET /api/business-cases/cust-names', () => {
//   it('IT-92: should return 200 with array of customer names when authenticated', async () => {
//     const res = await request(app)
//       .get('/api/business-cases/cust-names')
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(200)
//     expect(Array.isArray(res.body.data)).toBe(true)
//   })

//   it('IT-94: should return 401 when no token', async () => {
//     const res = await request(app)
//       .get('/api/business-cases/cust-names')
//     expect(res.status).toBe(401)
//   })
// })

// // FR-07: Unduh Berkas Lampiran BC
// describe('GET /api/business-cases/:id/file', () => {
//   let bcWithFileId
//   let bcWithoutFileId

//   beforeAll(async () => {
//     const withFileRes = await request(app)
//       .post('/api/business-cases')
//       .set('Authorization', `Bearer ${adminToken}`)
//       .field({ ...validBC, bcTitle: 'BC dengan Lampiran' })
//       .attach('file', Buffer.from('dummy file content'), {
//         filename: 'lampiran-bc.xlsx',
//         contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//       })
//     if (withFileRes.status !== 201) {
//       console.log('DEBUG withFileRes:', withFileRes.status, JSON.stringify(withFileRes.body))
//     }
//     bcWithFileId = withFileRes.body.data.id

//     const withoutFileRes = await request(app)
//       .post('/api/business-cases')
//       .set('Authorization', `Bearer ${adminToken}`)
//       .field({ ...validBC, bcTitle: 'BC tanpa Lampiran' })
//     bcWithoutFileId = withoutFileRes.body.data.id
//   })

//   it('IT-95: should return 200 and download file when BC has attached file', async () => {
//     const res = await request(app)
//       .get(`/api/business-cases/${bcWithFileId}/file`)
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(200)
//     expect(res.headers['content-type']).toContain('octet-stream')
//   })

//   it('IT-96: should return 401 when no token', async () => {
//     const res = await request(app)
//       .get(`/api/business-cases/${bcWithFileId}/file`)
//     expect(res.status).toBe(401)
//   })

//   it('IT-98: should return 404 when BC has no attached file', async () => {
//     const res = await request(app)
//       .get(`/api/business-cases/${bcWithoutFileId}/file`)
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(404)
//     expect(res.body.message).toBe('File tidak ditemukan')
//   })

//   it('IT-99: should return 404 when file record exists but physical file is missing on server', async () => {
//     const fs = require('fs')
//     const BusinessCase = require('../../models/BusinessCase')
//     const bc = await BusinessCase.findByPk(bcWithFileId)
//     if (bc.filePath && fs.existsSync(bc.filePath)) fs.unlinkSync(bc.filePath)

//     const res = await request(app)
//       .get(`/api/business-cases/${bcWithFileId}/file`)
//       .set('Authorization', `Bearer ${adminToken}`)
//     expect(res.status).toBe(404)
//     expect(res.body.message).toBe('File tidak ditemukan di server')
//   })
// })

require('dotenv').config({ path: '.env.test' })
const request = require('supertest')
const app = require('../../app')
const { setupDB } = require('./setup')

let adminToken
let staffToken
let avpToken
let createdBCId

const validBC = {
  bcTitle: 'Test Business Case Integration',
  bcType: 'BC',
  projectType: 'Non-Tender',
  activityType: 'BAU',
  projectStatus: 'On Progress',
  esReqDate: '2025-01-01',
  cfDate: '2025-02-01',
  rfsDate: '2025-03-01',
  custName: 'PT Test Customer',
  custJoinYear: '2020',
  lineOfBusiness: 'Technology',
  contractType: 'New',
  activationType: 'New',
  contractPeriod: '12',
  pricingTeamId: '1',
  preSalesTeamId: '1',
  'salesTeamIds[]': '1',
  'serviceDetails[0][serviceId]': '1',
  'serviceDetails[0][subServiceId]': '1',
  'serviceDetails[0][serviceSegment]': 'TelCo',
  'serviceDetails[0][serviceLocation]': 'Jawa-Bali'
}

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

  await request(app)
    .post('/api/users')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ username: 'avp01', firstName: 'AVP', lastName: 'Satu', password: 'avp123', role: 'AVP & VP' })
  const avpRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'avp01', password: 'avp123' })
  avpToken = avpRes.body.data.token
}, 30000)

// FR-06: Tabel Business Case
describe('GET /api/business-cases', () => {
  it('IT-18: should return 200 with list of BC when authenticated', async () => {
    const res = await request(app)
      .get('/api/business-cases')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body).toHaveProperty('meta')
  })

  it('IT-19: should return 401 when no token', async () => {
    const res = await request(app)
      .get('/api/business-cases')
    expect(res.status).toBe(401)
  })
})

// FR-05: Tabel Tindak Lanjut Tertunda
describe('GET /api/business-cases/pending-follow-up', () => {
  it('IT-20: should return 200 with pending follow-up list', async () => {
    const res = await request(app)
      .get('/api/business-cases/pending-follow-up')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('IT-21: should return 401 when no token', async () => {
    const res = await request(app)
      .get('/api/business-cases/pending-follow-up')
    expect(res.status).toBe(401)
  })
})

// FR-04: Dashboard Stats
describe('GET /api/business-cases/dashboard/stats', () => {
  it('IT-22: should return 200 with dashboard stats when authenticated', async () => {
    const res = await request(app)
      .get('/api/business-cases/dashboard/stats')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('bcByStatus')
    expect(res.body.data).toHaveProperty('bcTcvByService')
    expect(res.body.data).toHaveProperty('totalBC')
  })

  it('IT-23: should return 200 with filtered dashboard stats', async () => {
    const res = await request(app)
      .get('/api/business-cases/dashboard/stats?bcType=BC')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('totalBC')
  })

  it('IT-24: should return 401 when no token', async () => {
    const res = await request(app)
      .get('/api/business-cases/dashboard/stats')
    expect(res.status).toBe(401)
  })
})

// FR-07: Aksi Entri Tabel - POST
describe('POST /api/business-cases', () => {
  it('IT-25: should return 201 when Admin creates BC', async () => {
    const res = await request(app)
      .post('/api/business-cases')
      .set('Authorization', `Bearer ${adminToken}`)
      .field(validBC)
    expect(res.status).toBe(201)
    expect(res.body.data).toHaveProperty('id')
    expect(res.body.data).toHaveProperty('bcCode')
    createdBCId = res.body.data.id
  })

  it('IT-26: should return 201 when Staf creates BC', async () => {
    const res = await request(app)
      .post('/api/business-cases')
      .set('Authorization', `Bearer ${staffToken}`)
      .field({ ...validBC, bcTitle: 'BC by Staf' })
    expect(res.status).toBe(201)
    expect(res.body.data).toHaveProperty('bcCode')
  })

  it('IT-27: should return 403 when AVP & VP tries to create BC', async () => {
    const res = await request(app)
      .post('/api/business-cases')
      .set('Authorization', `Bearer ${avpToken}`)
      .field(validBC)
    expect(res.status).toBe(403)
  })

  it('IT-28: should return 401 when no token', async () => {
    const res = await request(app)
      .post('/api/business-cases')
      .field(validBC)
    expect(res.status).toBe(401)
  })
})

// FR-07: Aksi Entri Tabel - GET Detail
describe('GET /api/business-cases/:id', () => {
  it('IT-29: should return 200 with BC detail', async () => {
    const res = await request(app)
      .get(`/api/business-cases/${createdBCId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('bcTitle', 'Test Business Case Integration')
  })

  it('IT-30: should return 200 when AVP & VP views BC detail', async () => {
    const res = await request(app)
      .get(`/api/business-cases/${createdBCId}`)
      .set('Authorization', `Bearer ${avpToken}`)
    expect(res.status).toBe(200)
  })

  it('IT-31: should return 404 when BC not found', async () => {
    const res = await request(app)
      .get('/api/business-cases/99999')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Business Case tidak ditemukan')
  })
})

// FR-08: Pencarian, Pengurutan, Penyaringan
describe('GET /api/business-cases - search, sort, filter', () => {
  it('IT-32: should return 200 with search results by bcTitle', async () => {
    const res = await request(app)
      .get('/api/business-cases?search=Test Business Case')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.data.length).toBeGreaterThan(0)
  })

  it('IT-33: should return 200 with search results by custName', async () => {
    const res = await request(app)
      .get('/api/business-cases?search=PT Test Customer')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.data.length).toBeGreaterThan(0)
  })

  it('IT-34: should return 200 with empty results for non-existent search', async () => {
    const res = await request(app)
      .get('/api/business-cases?search=XXXXXXXXXNOTFOUND')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.data.length).toBe(0)
  })

  it('IT-35: should return 200 sorted by bcTitle ASC', async () => {
    const res = await request(app)
      .get('/api/business-cases?sort=bcTitle&order=ASC')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
  })

  it('IT-36: should return 200 sorted by createdAt DESC', async () => {
    const res = await request(app)
      .get('/api/business-cases?sort=createdAt&order=DESC')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
  })

  it('IT-37: should return 200 with pagination', async () => {
    const res = await request(app)
      .get('/api/business-cases?page=1&limit=5')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.meta).toHaveProperty('page', 1)
    expect(res.body.meta).toHaveProperty('limit', 5)
  })
})

// FR-07: Aksi Entri Tabel - PUT
describe('PUT /api/business-cases/:id', () => {
  it('IT-38: should return 200 when Admin updates BC', async () => {
    const res = await request(app)
      .put(`/api/business-cases/${createdBCId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .field({ ...validBC, bcTitle: 'Updated Business Case', updateFollowUpDate: 'false' })
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Business Case berhasil diperbarui')
  })

  it('IT-39: should return 200 when Staf updates BC', async () => {
    const res = await request(app)
      .put(`/api/business-cases/${createdBCId}`)
      .set('Authorization', `Bearer ${staffToken}`)
      .field({ ...validBC, bcTitle: 'Updated by Staf', updateFollowUpDate: 'false' })
    expect(res.status).toBe(200)
  })

  it('IT-40: should return 403 when AVP & VP tries to update BC', async () => {
    const res = await request(app)
      .put(`/api/business-cases/${createdBCId}`)
      .set('Authorization', `Bearer ${avpToken}`)
      .field(validBC)
    expect(res.status).toBe(403)
  })

  it('IT-41: should return 404 when BC not found', async () => {
    const res = await request(app)
      .put('/api/business-cases/99999')
      .set('Authorization', `Bearer ${adminToken}`)
      .field(validBC)
    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Business Case tidak ditemukan')
  })
})

// FR-07: Aksi Entri Tabel - DELETE
describe('DELETE /api/business-cases/:id', () => {
  it('IT-42: should return 403 when AVP & VP tries to delete BC', async () => {
    const res = await request(app)
      .delete(`/api/business-cases/${createdBCId}`)
      .set('Authorization', `Bearer ${avpToken}`)
    expect(res.status).toBe(403)
  })

  it('IT-43: should return 200 when Admin deletes BC', async () => {
    const res = await request(app)
      .delete(`/api/business-cases/${createdBCId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Business Case berhasil dihapus')
  })

  it('IT-44: should return 404 when BC not found', async () => {
    const res = await request(app)
      .delete('/api/business-cases/99999')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Business Case tidak ditemukan')
  })
})

// FR-09: Ekspor Data ke Microsoft Excel
describe('GET /api/business-cases/export', () => {
  it('IT-45: should return 200 and xlsx file', async () => {
    const res = await request(app)
      .get('/api/business-cases/export')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('spreadsheetml')
  })

  it('IT-46: should return 200 with filtered export by search', async () => {
    const res = await request(app)
      .get('/api/business-cases/export?search=Test')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('spreadsheetml')
  })

  it('IT-47: should return 401 when no token', async () => {
    const res = await request(app)
      .get('/api/business-cases/export')
    expect(res.status).toBe(401)
  })
})

// FR-08: Daftar Nama Pelanggan
describe('GET /api/business-cases/cust-names', () => {
  it('IT-92: should return 200 with array of customer names when authenticated', async () => {
    const res = await request(app)
      .get('/api/business-cases/cust-names')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('IT-94: should return 401 when no token', async () => {
    const res = await request(app)
      .get('/api/business-cases/cust-names')
    expect(res.status).toBe(401)
  })
})

// FR-07: Unduh Berkas Lampiran BC
describe('GET /api/business-cases/:id/file', () => {
  let bcWithFileId
  let bcWithoutFileId

  beforeAll(async () => {
    const withFileRes = await request(app)
      .post('/api/business-cases')
      .set('Authorization', `Bearer ${adminToken}`)
      .field({ ...validBC, bcTitle: 'BC dengan Lampiran' })
      .attach('file', Buffer.from('dummy file content'), {
        filename: 'lampiran-bc.xlsx',
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    if (withFileRes.status !== 201) {
      console.log('DEBUG withFileRes:', withFileRes.status, JSON.stringify(withFileRes.body))
    }
    bcWithFileId = withFileRes.body.data.id

    const withoutFileRes = await request(app)
      .post('/api/business-cases')
      .set('Authorization', `Bearer ${adminToken}`)
      .field({ ...validBC, bcTitle: 'BC tanpa Lampiran' })
    bcWithoutFileId = withoutFileRes.body.data.id
  })

  it('IT-95: should return 200 and download file when BC has attached file', async () => {
    const res = await request(app)
      .get(`/api/business-cases/${bcWithFileId}/file`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('spreadsheetml')
  })

  it('IT-96: should return 401 when no token', async () => {
    const res = await request(app)
      .get(`/api/business-cases/${bcWithFileId}/file`)
    expect(res.status).toBe(401)
  })

  it('IT-98: should return 404 when BC has no attached file', async () => {
    const res = await request(app)
      .get(`/api/business-cases/${bcWithoutFileId}/file`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(404)
    expect(res.body.message).toBe('File tidak ditemukan')
  })

  it('IT-99: should return 404 when file record exists but physical file is missing on server', async () => {
    const fs = require('fs')
    const BusinessCase = require('../../models/BusinessCase')
    const bc = await BusinessCase.findByPk(bcWithFileId)
    if (bc.filePath && fs.existsSync(bc.filePath)) fs.unlinkSync(bc.filePath)

    const res = await request(app)
      .get(`/api/business-cases/${bcWithFileId}/file`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(404)
    expect(res.body.message).toBe('File tidak ditemukan di server')
  })
})