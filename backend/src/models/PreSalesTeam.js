const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const PreSalesTeam = sequelize.define('PreSalesTeam', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'pre_sales_teams', timestamps: true })

module.exports = PreSalesTeam