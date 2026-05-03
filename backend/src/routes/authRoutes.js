const express = require('express')
const router = express.Router()
const { login, logout } = require('../controllers/authController')
const { verifyToken } = require('../middlewares/authMiddleware')

router.post('/login', login)
router.post('/logout', verifyToken, logout)

module.exports = router