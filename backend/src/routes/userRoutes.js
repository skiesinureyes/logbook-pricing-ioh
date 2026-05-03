const express = require('express')
const router = express.Router()
const {
  getAllUsers,
  createUser,
  updateUser,
  updateUserStatus
} = require('../controllers/userController')
const { verifyToken } = require('../middlewares/authMiddleware')
const { authorizeRoles } = require('../middlewares/roleMiddleware')

router.get('/', verifyToken, authorizeRoles('Admin'), getAllUsers)
router.post('/', verifyToken, authorizeRoles('Admin'), createUser)
router.put('/:id', verifyToken, authorizeRoles('Admin'), updateUser)
router.patch('/:id/status', verifyToken, authorizeRoles('Admin'), updateUserStatus)

module.exports = router