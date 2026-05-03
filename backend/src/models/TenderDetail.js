const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const TenderDetail = sequelize.define('TenderDetail', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  winnerName: { type: DataTypes.STRING, allowNull: false },
  winningPrice: { type: DataTypes.BIGINT, allowNull: false },
  reason: { type: DataTypes.TEXT, allowNull: false },
  businessCaseId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'tender_details', timestamps: true })

module.exports = TenderDetail