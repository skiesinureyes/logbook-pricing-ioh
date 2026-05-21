const AuditLog = require('../models/AuditLog')

/**
 * Catat aktivitas pengguna ke tabel audit_logs
 * @param {Object} params
 * @param {'CREATE'|'UPDATE'|'DELETE'} params.action - Jenis aksi
 * @param {number} params.entityId - ID Business Case
 * @param {string|null} params.bcCode - BC Code
 * @param {string|null} params.bcTitle - BC Title
 * @param {number} params.userId - ID user yang melakukan aksi
 * @param {string|null} params.description - Deskripsi tambahan
 * @param {Object|null} params.transaction - Sequelize transaction (opsional)
 */
const logAudit = async ({ action, entityId, bcCode, bcTitle, userId, description = null, transaction = null }) => {
  try {
    const options = transaction ? { transaction } : {}
    await AuditLog.create({
      action,
      entityId,
      bcCode: bcCode || null,
      bcTitle: bcTitle || null,
      userId,
      description
    }, options)
  } catch (err) {
    // Jangan sampai gagal audit log menghentikan operasi utama
    console.error('[AuditLog] Gagal mencatat audit log:', err.message)
  }
}

module.exports = { logAudit }