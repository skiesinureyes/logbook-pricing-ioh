require('dotenv').config()
const app = require('./src/app')
const { sequelize } = require('./src/config/db')
const seedAdmin = require('./src/utils/seedAdmin')
const seedMasterData = require('./src/utils/seedMasterData')

const {
  User,
  Group,
  Division,
  Department,
  SalesTeam,
  PricingTeam,
  PreSalesTeam,
  SubService,
  Service,
  BusinessCase,
  TenderDetail,
  ServiceDetail
} = require('./src/models/index')

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connected')

    // Sync dalam urutan yang benar — parent dulu, child belakangan
    await User.sync({ alter: true })
    await Group.sync({ alter: true })
    await Division.sync({ alter: true })
    await Department.sync({ alter: true })
    await SalesTeam.sync({ alter: true })
    await PricingTeam.sync({ alter: true })
    await PreSalesTeam.sync({ alter: true })
    await SubService.sync({ alter: true })
    await Service.sync({ alter: true })
    await BusinessCase.sync({ alter: true })
    await TenderDetail.sync({ alter: true })
    await ServiceDetail.sync({ alter: true })

    // Sync junction table
    await sequelize.sync({ alter: true })

    console.log('✅ Models synced')

    await seedAdmin()
    await seedMasterData()
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()