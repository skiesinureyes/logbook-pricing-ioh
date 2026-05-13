const express = require('express')
const router = express.Router()
const {
  getAllBC,
  getPendingFollowUp,
  getBCById,
  createBC,
  updateBC,
  deleteBC,
  downloadFile,
  exportBC,
  getCustNames,
  getDashboardStats
} = require('../controllers/businessCaseController')
const { verifyToken } = require('../middlewares/authMiddleware')
const { authorizeRoles } = require('../middlewares/roleMiddleware')
const upload = require('../config/multer')

router.get('/', verifyToken, getAllBC)
router.get('/pending-follow-up', verifyToken, getPendingFollowUp)
router.get('/export', verifyToken, exportBC)
router.get('/dashboard/stats', verifyToken, getDashboardStats)
router.get('/cust-names', verifyToken, getCustNames)
router.get('/:id', verifyToken, getBCById)
router.get('/:id/file', verifyToken, downloadFile)
router.post('/', verifyToken, authorizeRoles('Admin', 'Staf'), upload.single('file'), createBC)
router.put('/:id', verifyToken, authorizeRoles('Admin', 'Staf'), upload.single('file'), updateBC)
router.delete('/:id', verifyToken, authorizeRoles('Admin'), deleteBC)

module.exports = router