const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Division = sequelize.define('Division', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  groupId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'divisions', timestamps: true })

module.exports = Division