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
    await User.sync({ force: false })
    await Group.sync({ force: false })
    await Division.sync({ force: false })
    await Department.sync({ force: false })
    await SalesTeam.sync({ force: false })
    await PricingTeam.sync({ force: false })
    await PreSalesTeam.sync({ force: false })
    await SubService.sync({ force: false })
    await Service.sync({ force: false })
    await BusinessCase.sync({ force: false })
    await TenderDetail.sync({ force: false })
    await ServiceDetail.sync({ force: false })

    // Sync junction table
    await sequelize.sync({ force: false })

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