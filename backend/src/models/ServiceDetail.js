const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const ServiceDetail = sequelize.define('ServiceDetail', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  serviceSegment: { type: DataTypes.STRING, allowNull: true },
  totalUnit: { type: DataTypes.INTEGER, allowNull: true },
  detailService: { type: DataTypes.TEXT, allowNull: true },
  serviceLocation: {
    type: DataTypes.ENUM('Jawa-Bali', 'Kalimantan', 'Sulawesi', 'Sumatera'),
    allowNull: true
  },
  locationA: {
    type: DataTypes.ENUM('Jawa-Bali', 'Kalimantan', 'Sulawesi', 'Sumatera'),
    allowNull: true
  },
  locationB: {
    type: DataTypes.ENUM('Jawa-Bali', 'Kalimantan', 'Sulawesi', 'Sumatera'),
    allowNull: true
  },
  totalBwPerMbps: { type: DataTypes.INTEGER, allowNull: true },
  pricePerMbps: { type: DataTypes.BIGINT, allowNull: true },
  infraType: { type: DataTypes.STRING, allowNull: true },
  infraNotes: { type: DataTypes.STRING, allowNull: true },
  businessCaseId: { type: DataTypes.INTEGER, allowNull: false },
  serviceId: { type: DataTypes.INTEGER, allowNull: false },
  subServiceId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
  tableName: 'service_details',
  timestamps: true
})

module.exports = ServiceDetail