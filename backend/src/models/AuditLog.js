const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  action: {
    type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE'),
    allowNull: false
  },
  entityId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID dari Business Case yang dikenai aksi'
  },
  bcCode: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'BC Code saat aksi dilakukan (snapshot)'
  },
  bcTitle: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'BC Title saat aksi dilakukan (snapshot)'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Deskripsi singkat aksi yang dilakukan'
  }
}, {
  tableName: 'audit_logs',
  timestamps: true,
  updatedAt: false // audit log hanya butuh createdAt
})

module.exports = AuditLog