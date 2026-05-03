const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const ServiceDetail = sequelize.define('ServiceDetail', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  totalUnit: { type: DataTypes.INTEGER, allowNull: true },
  detailService: { type: DataTypes.STRING, allowNull: true },
  locationA: {
    type: DataTypes.ENUM('Jawa-Bali', 'Kalimantan', 'Sulawesi', 'Sumatera'),
    allowNull: false
  },
  locationB: {
    type: DataTypes.ENUM('Jawa-Bali', 'Kalimantan', 'Sulawesi', 'Sumatera'),
    allowNull: true
  },
  totalBwPerMbps: { type: DataTypes.INTEGER, allowNull: true },
  pricePerMbps: { type: DataTypes.BIGINT, allowNull: true },
  businessCaseId: { type: DataTypes.INTEGER, allowNull: false },
  serviceId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'service_details', timestamps: true })

module.exports = ServiceDetail