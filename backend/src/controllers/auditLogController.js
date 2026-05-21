const { Op } = require('sequelize')
const AuditLog = require('../models/AuditLog')
const User = require('../models/User')

// ── GET all audit logs (Admin only) ──────────────────────────────────────────
const getAuditLogs = async (req, res) => {
  try {
    const {
      action,
      userId,
      search,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query

    const where = {}

    if (action) where.action = action
    if (userId) where.userId = userId

    if (search) {
      where[Op.or] = [
        { bcCode: { [Op.like]: `%${search}%` } },
        { bcTitle: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ]
    }

    if (startDate && endDate) {
      where.createdAt = { [Op.between]: [new Date(startDate), new Date(`${endDate}T23:59:59`)] }
    } else if (startDate) {
      where.createdAt = { [Op.gte]: new Date(startDate) }
    } else if (endDate) {
      where.createdAt = { [Op.lte]: new Date(`${endDate}T23:59:59`) }
    }

    const offset = (parseInt(page) - 1) * parseInt(limit)

    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'firstName', 'lastName', 'role']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    })

    return res.status(200).json({
      status: 'success',
      message: 'Data audit log berhasil diambil',
      data: rows,
      meta: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

module.exports = { getAuditLogs }