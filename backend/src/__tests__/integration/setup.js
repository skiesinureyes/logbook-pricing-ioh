require('dotenv').config({ path: '.env.test' })
const { sequelize } = require('../../config/db')
const seedAdmin = require('../../utils/seedAdmin')
const seedMasterData = require('../../utils/seedMasterData')
require('../../models/index')

const setupDB = async () => {
  await sequelize.authenticate()
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
  await sequelize.sync({ force: true })
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
  await seedAdmin()
  await seedMasterData()
}

const teardownDB = async () => {
  await sequelize.close()
}

module.exports = { setupDB, teardownDB }
