const express = require('express')
const router = express.Router()
const { getAuditLogs } = require('../controllers/auditLogController')
const { verifyToken } = require('../middlewares/authMiddleware')
const { authorizeRoles } = require('../middlewares/roleMiddleware')

// Hanya Admin yang bisa lihat audit log (sesuai UC-13)
router.get('/', verifyToken, authorizeRoles('Admin'), getAuditLogs)

module.exports = router