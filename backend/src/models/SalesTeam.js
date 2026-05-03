const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const SalesTeam = sequelize.define('SalesTeam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'sales_teams',
  timestamps: true
})

module.exports = SalesTeam