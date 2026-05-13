const Group = require('../models/Group')
const Division = require('../models/Division')
const Department = require('../models/Department')
const SalesTeam = require('../models/SalesTeam')
const PricingTeam = require('../models/PricingTeam')
const PreSalesTeam = require('../models/PreSalesTeam')
const SubService = require('../models/SubService')
const Service = require('../models/Service')

const createCRUD = (Model, include = []) => ({
  getAll: async (req, res) => {
    try {
      const data = await Model.findAll({ include, order: [['createdAt', 'ASC']] })
      return res.status(200).json({ status: 'success', data })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
    }
  },
  create: async (req, res) => {
    try {
      const item = await Model.create(req.body)
      return res.status(201).json({ status: 'success', message: 'Data berhasil ditambahkan', data: item })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
    }
  },
  update: async (req, res) => {
    try {
      const item = await Model.findByPk(req.params.id)
      if (!item) return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' })
      await item.update(req.body)
      return res.status(200).json({ status: 'success', message: 'Data berhasil diperbarui', data: item })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
    }
  },
  destroy: async (req, res) => {
    try {
      const item = await Model.findByPk(req.params.id)
      if (!item) return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' })
      await item.destroy()
      return res.status(200).json({ status: 'success', message: 'Data berhasil dihapus' })
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
          status: 'error',
          message: 'Data tidak dapat dihapus karena masih digunakan oleh data lain'
        })
      }
      console.error(error)
      return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
    }
  }
})

const groupCRUD = createCRUD(Group)
const divisionCRUD = createCRUD(Division, [{ model: Group, attributes: ['id', 'name'] }])
const departmentCRUD = createCRUD(Department, [{ model: Division, attributes: ['id', 'name'], include: [{ model: Group, attributes: ['id', 'name'] }] }])
const salesTeamCRUD = createCRUD(SalesTeam, [{ model: Department, attributes: ['id', 'name'], include: [{ model: Division, attributes: ['id', 'name'], include: [{ model: Group, attributes: ['id', 'name'] }] }] }])
const pricingTeamCRUD = createCRUD(PricingTeam)
const preSalesTeamCRUD = createCRUD(PreSalesTeam)
const subServiceCRUD = createCRUD(SubService)
const serviceCRUD = createCRUD(Service, [{ model: SubService, attributes: ['id', 'name'] }])

module.exports = {
  groupCRUD,
  divisionCRUD,
  departmentCRUD,
  salesTeamCRUD,
  pricingTeamCRUD,
  preSalesTeamCRUD,
  subServiceCRUD,
  serviceCRUD
}
