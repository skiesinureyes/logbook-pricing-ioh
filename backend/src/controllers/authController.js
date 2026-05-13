const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const login = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Username and password need to be filled in.'
      })
    }

    const user = await User.findOne({ where: { username } })

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Username not found. Please check your username and try again'
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'Your account is deactivated. Please contact administrator.'
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Password is incorrect. Please check your credentials and try again.'
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
      message: 'Login successful!',
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
      message: 'An error occurred on the server'
    })
  }
}

const logout = (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Logout successful!'
  })
}

module.exports = { login, logout }