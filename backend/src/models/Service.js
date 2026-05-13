const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Service = sequelize.define('Service', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  serviceCategory: {
    type: DataTypes.ENUM('TelCo', 'TechCo'),
    allowNull: true
  },
  infraType: { type: DataTypes.ENUM('Onnet', 'Offnet'), allowNull: true },
  infraNotes: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'services',
  timestamps: true
})

module.exports = Service