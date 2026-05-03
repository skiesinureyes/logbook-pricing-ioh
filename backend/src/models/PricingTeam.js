const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const PricingTeam = sequelize.define('PricingTeam', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'pricing_teams', timestamps: true })

module.exports = PricingTeam