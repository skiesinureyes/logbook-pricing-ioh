const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const SubService = sequelize.define('SubService', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'sub_services', timestamps: true })

module.exports = SubService