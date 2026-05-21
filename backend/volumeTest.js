/**
 * Volume Testing Script - IsiLogbook
 * NFR-03: Skalabilitas (Scalability)
 * 
 * Script ini menginsert 500 data Business Case dummy ke database,
 * lalu mengukur response time query untuk memastikan sistem tetap
 * stabil saat menangani volume data besar.
 */

require('dotenv').config()
const { sequelize } = require('./src/config/db')
const BusinessCase = require('./src/models/BusinessCase')
const ServiceDetail = require('./src/models/ServiceDetail')
const TenderDetail = require('./src/models/TenderDetail')
const PricingTeam = require('./src/models/PricingTeam')
const PreSalesTeam = require('./src/models/PreSalesTeam')
const User = require('./src/models/User')
const Service = require('./src/models/Service')

require('./src/models/index')

const STATUSES = ['On Progress', 'Win', 'Lost', 'Drop Exp', 'Drop Sls', 'Double', 'Cancel']
const BC_TYPES = ['Non-BC', 'BC-CPB', 'BC']
const PROJECT_TYPES = ['Non-Tender', 'Tender']
const ACTIVITY_TYPES = ['BAU', 'Non BAU']
const CONTRACT_TYPES = ['Existing', 'New']
const ACTIVATION_TYPES = ['New', 'Additional', 'Renewal', 'Upgrade', 'Relocated', 'Downgrade', 'Reconfiguration']
const CONTRACT_PERIODS = ['1', '12', '24', '36', '48', '60']
const LINES_OF_BUSINESS = ['Oil & Gas', 'Banking', 'Technology', 'Government', 'Manufacturing', 'Logistic']
const CUSTOMERS = [
  'PT Pertamina', 'PT Bank Mandiri', 'PT Telkom', 'PT PLN', 'PT Astra',
  'PT BRI', 'PT BNI', 'PT Unilever', 'PT Indofood', 'PT Gojek',
  'PT Tokopedia', 'PT Shopee', 'PT XL Axiata', 'PT Smartfren', 'PT PGEO'
]

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randomBigInt = () => randomInt(100000000, 10000000000)
const randomDate = (start, end) => {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return d.toISOString().split('T')[0]
}

const runVolumeTest = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connected\n')

    // Ambil data referensi
    const user = await User.findOne({ where: { username: 'admin' } })
    const pricingTeams = await PricingTeam.findAll({ raw: true })
    const preSalesTeams = await PreSalesTeam.findAll({ raw: true })
    const services = await Service.findAll({ raw: true })

    if (!user || pricingTeams.length === 0 || services.length === 0) {
      console.error('❌ Data referensi tidak ditemukan. Pastikan seed sudah dijalankan.')
      process.exit(1)
    }

    const VOLUME = 10000
    console.log(`📦 Memulai insert ${VOLUME} data Business Case dummy...\n`)

    // ── INSERT PHASE ──────────────────────────────────────────────────────────
    const insertStart = Date.now()

    const bcs = []
    for (let i = 1; i <= VOLUME; i++) {
      const tcv = randomBigInt()
      const totalCoS = randomBigInt()
      const directOpex = randomBigInt()
      const totalOpex = totalCoS + directOpex
      const ebitda = tcv - totalOpex
      const ebitdaMargin = tcv > 0 ? ebitda / tcv : null

      bcs.push({
        bcCode: `VOL-${String(i).padStart(4, '0')}-TEST-2026`,
        bcTitle: `[VOLUME TEST] Business Case Dummy #${i}`,
        bcType: randomFrom(BC_TYPES),
        projectType: randomFrom(PROJECT_TYPES),
        activityType: randomFrom(ACTIVITY_TYPES),
        projectStatus: randomFrom(STATUSES),
        lastFollowUpDate: new Date(),
        followUpNotes: `Catatan follow up dummy untuk BC #${i}`,
        esReqDate: randomDate(new Date('2025-01-01'), new Date('2026-01-01')),
        cfDate: randomDate(new Date('2025-06-01'), new Date('2026-06-01')),
        rfsDate: randomDate(new Date('2026-01-01'), new Date('2027-01-01')),
        custName: randomFrom(CUSTOMERS),
        custJoinYear: randomInt(2015, 2025),
        lineOfBusiness: randomFrom(LINES_OF_BUSINESS),
        contractType: randomFrom(CONTRACT_TYPES),
        activationType: randomFrom(ACTIVATION_TYPES),
        contractPeriod: randomFrom(CONTRACT_PERIODS),
        tcv,
        totalNetRev: randomBigInt(),
        totalCoS,
        directOpex,
        totalOpex,
        ebitda,
        ebitdaMargin,
        totalCapex: randomBigInt(),
        pprEligibility: 'Not Eligible',
        userId: user.id,
        pricingTeamId: randomFrom(pricingTeams).id,
        preSalesTeamId: randomFrom(preSalesTeams).id
      })
    }

    // Insert dalam batch 50 agar tidak overload
    const BATCH_SIZE = 50
    for (let i = 0; i < bcs.length; i += BATCH_SIZE) {
      const batch = bcs.slice(i, i + BATCH_SIZE)
      await BusinessCase.bulkCreate(batch)
      process.stdout.write(`\r  ⏳ Inserted ${Math.min(i + BATCH_SIZE, VOLUME)}/${VOLUME} records...`)
    }

    const insertEnd = Date.now()
    const insertDuration = insertEnd - insertStart
    console.log(`\n\n✅ Insert selesai dalam ${insertDuration}ms (${(insertDuration / 1000).toFixed(2)}s)\n`)

    // ── QUERY PERFORMANCE PHASE ───────────────────────────────────────────────
    console.log('📊 Mengukur performa query dengan volume data besar...\n')
    const totalBC = await BusinessCase.count()
    console.log(`   Total data di DB sekarang: ${totalBC} Business Case\n`)

    const results = []

    // Test 1: GET all dengan pagination
    let t1 = Date.now()
    const { count: count1, rows: rows1 } = await BusinessCase.findAndCountAll({
      limit: 10, offset: 0, order: [['createdAt', 'DESC']]
    })
    let d1 = Date.now() - t1
    results.push({ query: 'GET all BC (page 1, limit 10)', duration: d1, rows: rows1.length, total: count1 })

    // Test 2: GET all limit 1000
    let t2 = Date.now()
    const rows2 = await BusinessCase.findAll({ limit: 1000 })
    let d2 = Date.now() - t2
    results.push({ query: 'GET all BC (limit 1000)', duration: d2, rows: rows2.length })

    // Test 3: Search by custName
    const { Op } = require('sequelize')
    let t3 = Date.now()
    const rows3 = await BusinessCase.findAll({
      where: { custName: { [Op.like]: '%Pertamina%' } },
      limit: 20
    })
    let d3 = Date.now() - t3
    results.push({ query: 'Search BC by custName (LIKE)', duration: d3, rows: rows3.length })

    // Test 4: Filter by status
    let t4 = Date.now()
    const rows4 = await BusinessCase.findAll({
      where: { projectStatus: 'On Progress' },
      limit: 20
    })
    let d4 = Date.now() - t4
    results.push({ query: 'Filter BC by projectStatus', duration: d4, rows: rows4.length })

    // Test 5: Count by status
    let t5 = Date.now()
    const count5 = await BusinessCase.count({ where: { projectStatus: 'Win' } })
    let d5 = Date.now() - t5
    results.push({ query: 'COUNT BC by status (Win)', duration: d5, rows: count5 })

    // ── HASIL ─────────────────────────────────────────────────────────────────
    console.log('═══════════════════════════════════════════════════════════════')
    console.log('  HASIL VOLUME TESTING - NFR-03 SKALABILITAS')
    console.log('═══════════════════════════════════════════════════════════════')
    console.log(`  Total data: ${totalBC} Business Case`)
    console.log(`  Target response time: < 5000 ms\n`)

    let allPassed = true
    results.forEach((r, i) => {
      const passed = r.duration < 5000
      if (!passed) allPassed = false
      console.log(`  [${i + 1}] ${r.query}`)
      console.log(`      → ${r.duration} ms | Rows: ${r.rows} | ${passed ? '✅ PASSED' : '❌ FAILED'}`)
      console.log()
    })

    console.log('═══════════════════════════════════════════════════════════════')
    console.log(`  KESIMPULAN: NFR-03 ${allPassed ? '✅ PASSED' : '❌ FAILED'}`)
    console.log('═══════════════════════════════════════════════════════════════\n')

    // ── CLEANUP ───────────────────────────────────────────────────────────────
    console.log('🧹 Membersihkan data volume test dari database...')
    const deleted = await BusinessCase.destroy({
      where: { bcTitle: { [Op.like]: '%[VOLUME TEST]%' } }
    })
    console.log(`✅ ${deleted} data volume test berhasil dihapus\n`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Volume test error:', error.message)
    process.exit(1)
  }
}

runVolumeTest()