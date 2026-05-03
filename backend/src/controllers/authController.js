const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const login = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Username dan password wajib diisi'
      })
    }

    const user = await User.findOne({ where: { username } })

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Username atau password salah'
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'Akun Anda telah dinonaktifkan'
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Username atau password salah'
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    return res.status(200).json({
      status: 'success',
      message: 'Login berhasil',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server'
    })
  }
}

const logout = (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Logout berhasil'
  })
}

module.exports = { login, logout }