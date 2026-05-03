const bcrypt = require('bcryptjs')
const User = require('../models/User')

// GET semua user
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    })
    return res.status(200).json({
      status: 'success',
      message: 'Data user berhasil diambil',
      data: users
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server'
    })
  }
}

// POST tambah user baru
const createUser = async (req, res) => {
  try {
    const { username, firstName, lastName, password, role } = req.body

    if (!username || !firstName || !lastName || !password || !role) {
      return res.status(400).json({
        status: 'error',
        message: 'Semua field wajib diisi'
      })
    }

    const existing = await User.findOne({ where: { username } })
    if (existing) {
      return res.status(409).json({
        status: 'error',
        message: 'Username sudah digunakan'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username,
      firstName,
      lastName,
      password: hashedPassword,
      role,
      isActive: true
    })

    return res.status(201).json({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive
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

// PUT update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { firstName, lastName, role, password } = req.body

    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User tidak ditemukan'
      })
    }

    const updateData = { firstName, lastName, role }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    await user.update(updateData)

    return res.status(200).json({
      status: 'success',
      message: 'User berhasil diperbarui',
      data: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive
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

// PATCH toggle status aktif/nonaktif
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { isActive } = req.body

    // Cegah admin nonaktifkan dirinya sendiri
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        status: 'error',
        message: 'Anda tidak dapat menonaktifkan akun Anda sendiri'
      })
    }

    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User tidak ditemukan'
      })
    }

    await user.update({ isActive })

    return res.status(200).json({
      status: 'success',
      message: `User berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
      data: {
        id: user.id,
        username: user.username,
        isActive: user.isActive
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

module.exports = { getAllUsers, createUser, updateUser, updateUserStatus }