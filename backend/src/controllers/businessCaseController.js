const { Op } = require('sequelize')
const { sequelize } = require('../config/db')
const BusinessCase = require('../models/BusinessCase')
const TenderDetail = require('../models/TenderDetail')
const ServiceDetail = require('../models/ServiceDetail')
const SalesTeam = require('../models/SalesTeam')
const PricingTeam = require('../models/PricingTeam')
const PreSalesTeam = require('../models/PreSalesTeam')
const Service = require('../models/Service')
const SubService = require('../models/SubService')
const Department = require('../models/Department')
const Division = require('../models/Division')
const Group = require('../models/Group')
const path = require('path')
const fs = require('fs')
const ExcelJS = require('exceljs')

// Helper: generate bcCode
const generateBcCode = async (serviceId) => {
  const service = await Service.findByPk(serviceId)
  const serviceName = service ? service.name.toUpperCase() : 'UNKNOWN'
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  const count = await BusinessCase.count()
  const seq = String(count + 1).padStart(3, '0')
  return `${seq}-${month}-CPBC-${serviceName}-${year}`
}

// Helper: calculate auto fields
const calculateAutoFields = (data) => {
  const y1RevYearly = Number(data.y1RevYearly) || 0
  const totalCoS = Number(data.totalCoS) || 0
  const totalCapex = Number(data.totalCapex) || 0
  const contributionMargin = Number(data.contributionMargin) || 0
  const iohOverheadAllocation = Number(data.iohOverheadAllocation) || 0
  const totalNetRev = Number(data.totalNetRev) || 0

  const pprEligibility = (y1RevYearly > 1000000000 && totalCoS > 1000000000 && totalCapex > 1000000000)
    ? 'Eligible' : 'Not Eligible'

  const ebitda = contributionMargin + iohOverheadAllocation

  const ebitdaMargin = totalNetRev > 0 ? ebitda / totalNetRev : 0

  return { pprEligibility, ebitda, ebitdaMargin }
}

// GET all business cases
const getAllBC = async (req, res) => {
  try {
    const {
      search, sort = 'createdAt', order = 'DESC',
      status, bcType, lob, page = 1, limit = 20
    } = req.query

    const where = {}

    if (search) {
      where[Op.or] = [
        { bcTitle: { [Op.like]: `%${search}%` } },
        { bcCode: { [Op.like]: `%${search}%` } },
        { custName: { [Op.like]: `%${search}%` } }
      ]
    }
    if (status) where.projectStatus = status
    if (bcType) where.bcType = bcType
    if (lob) where.lineOfBusiness = lob

    const offset = (page - 1) * limit

    const { count, rows } = await BusinessCase.findAndCountAll({
      where,
      include: [
        { model: SalesTeam, through: { attributes: [] } },
        { model: PricingTeam, attributes: ['id', 'name'] },
        { model: PreSalesTeam, attributes: ['id', 'name'] }
      ],
      order: [[sort, order]],
      limit: Number(limit),
      offset: Number(offset)
    })

    return res.status(200).json({
      status: 'success',
      message: 'Data business case berhasil diambil',
      data: rows,
      meta: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

// GET pending follow up (due date > 14 hari dari sekarang)
const getPendingFollowUp = async (req, res) => {
  try {
    const twoWeeksFromNow = new Date()
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14)

    const bcs = await BusinessCase.findAll({
      where: {
        dueDate: { [Op.lte]: twoWeeksFromNow },
        projectStatus: { [Op.notIn]: ['Win', 'Lost', 'Drop Exp', 'Drop Sls', 'Cancel'] }
      },
      order: [['dueDate', 'ASC']]
    })

    return res.status(200).json({
      status: 'success',
      data: bcs
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

// GET detail business case
const getBCById = async (req, res) => {
  try {
    const bc = await BusinessCase.findByPk(req.params.id, {
      include: [
        { model: TenderDetail },
        {
          model: ServiceDetail,
          include: [{ model: Service, include: [{ model: SubService }] }]
        },
        {
          model: SalesTeam,
          through: { attributes: [] },
          include: [{
            model: Department,
            include: [{ model: Division, include: [{ model: Group }] }]
          }]
        },
        { model: PricingTeam },
        { model: PreSalesTeam }
      ]
    })

    if (!bc) {
      return res.status(404).json({ status: 'error', message: 'Business Case tidak ditemukan' })
    }

    return res.status(200).json({ status: 'success', data: bc })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

// POST create business case
const createBC = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const {
      bcTitle, bcType, cpbDate, projectType, activityType,
      projectStatus, esReqDate, cfDate, dueDate, sfalId,
      opportunityId, salesOrder, quote, custName, lineOfBusiness,
      custJoinDate, contractType, activationType, rfsDate, contractPeriod,
      otc, mrc, tcv, totalNetRev, portOnlyRev, y1RevCalendar, y1RevYearly,
      pprStatus, y1CoS, totalCoS, networkOpex, financingCost, otherOpexDirect,
      b2bDirectOverhead, contributionMargin, iohOverheadAllocation,
      netProfit, totalCapex, totalFcf, totalAccFcf, wacc, npv, irr, payback, marketingCost,
      pricingTeamId, preSalesTeamId, salesTeamIds,
      tenderDetail, serviceDetails
    } = req.body

    // Auto calculate
    const { pprEligibility, ebitda, ebitdaMargin } = calculateAutoFields({
      y1RevYearly, totalCoS, totalCapex, contributionMargin, iohOverheadAllocation, totalNetRev
    })

    // Get first service name for bcCode
    const firstServiceId = serviceDetails?.[0]?.serviceId
    const bcCode = firstServiceId ? await generateBcCode(firstServiceId) : null

    // File info
    let fileName = null, filePath = null, fileUploadedAt = null
    if (req.file) {
      fileName = req.file.originalname
      filePath = req.file.path
      fileUploadedAt = new Date()
    }

    const bc = await BusinessCase.create({
      bcCode, bcTitle, bcType, cpbDate, projectType, activityType,
      projectStatus, lastFollowUpDate: new Date(), esReqDate, cfDate, dueDate,
      sfalId, opportunityId, salesOrder, quote, custName, lineOfBusiness,
      custJoinDate, contractType, activationType, rfsDate, contractPeriod,
      otc, mrc, tcv, totalNetRev, portOnlyRev, y1RevCalendar, y1RevYearly,
      pprEligibility, pprStatus, y1CoS, totalCoS, networkOpex, financingCost,
      otherOpexDirect, b2bDirectOverhead, contributionMargin, iohOverheadAllocation,
      ebitda, ebitdaMargin, netProfit, totalCapex, totalFcf, totalAccFcf,
      wacc, npv, irr, payback, marketingCost,
      fileName, filePath, fileUploadedAt,
      userId: req.user.id, pricingTeamId, preSalesTeamId
    }, { transaction: t })

    // Sales teams
    if (salesTeamIds && salesTeamIds.length > 0) {
      await bc.setSalesTeams(salesTeamIds, { transaction: t })
    }

    // Tender detail
    if (projectType === 'Tender' && tenderDetail) {
      await TenderDetail.create({
        ...tenderDetail,
        businessCaseId: bc.id
      }, { transaction: t })
    }

    // Service details
    if (serviceDetails && serviceDetails.length > 0) {
      for (const sd of serviceDetails) {
        await ServiceDetail.create({
          ...sd,
          businessCaseId: bc.id
        }, { transaction: t })
      }
    }

    await t.commit()

    return res.status(201).json({
      status: 'success',
      message: 'Business Case berhasil ditambahkan',
      data: { id: bc.id, bcCode: bc.bcCode }
    })
  } catch (error) {
    await t.rollback()
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

// PUT update business case
const updateBC = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const bc = await BusinessCase.findByPk(req.params.id)
    if (!bc) {
      return res.status(404).json({ status: 'error', message: 'Business Case tidak ditemukan' })
    }

    const {
      bcTitle, bcType, cpbDate, projectType, activityType,
      projectStatus, esReqDate, cfDate, dueDate, sfalId,
      opportunityId, salesOrder, quote, custName, lineOfBusiness,
      custJoinDate, contractType, activationType, rfsDate, contractPeriod,
      otc, mrc, tcv, totalNetRev, portOnlyRev, y1RevCalendar, y1RevYearly,
      pprStatus, y1CoS, totalCoS, networkOpex, financingCost, otherOpexDirect,
      b2bDirectOverhead, contributionMargin, iohOverheadAllocation,
      netProfit, totalCapex, totalFcf, totalAccFcf, wacc, npv, irr, payback, marketingCost,
      pricingTeamId, preSalesTeamId, salesTeamIds,
      tenderDetail, serviceDetails
    } = req.body

    const { pprEligibility, ebitda, ebitdaMargin } = calculateAutoFields({
      y1RevYearly, totalCoS, totalCapex, contributionMargin, iohOverheadAllocation, totalNetRev
    })

    let fileName = bc.fileName, filePath = bc.filePath, fileUploadedAt = bc.fileUploadedAt
    if (req.file) {
      // Hapus file lama
      if (bc.filePath && fs.existsSync(bc.filePath)) {
        fs.unlinkSync(bc.filePath)
      }
      fileName = req.file.originalname
      filePath = req.file.path
      fileUploadedAt = new Date()
    }

    await bc.update({
      bcTitle, bcType, cpbDate, projectType, activityType,
      projectStatus, lastFollowUpDate: new Date(), esReqDate, cfDate, dueDate,
      sfalId, opportunityId, salesOrder, quote, custName, lineOfBusiness,
      custJoinDate, contractType, activationType, rfsDate, contractPeriod,
      otc, mrc, tcv, totalNetRev, portOnlyRev, y1RevCalendar, y1RevYearly,
      pprEligibility, pprStatus, y1CoS, totalCoS, networkOpex, financingCost,
      otherOpexDirect, b2bDirectOverhead, contributionMargin, iohOverheadAllocation,
      ebitda, ebitdaMargin, netProfit, totalCapex, totalFcf, totalAccFcf,
      wacc, npv, irr, payback, marketingCost,
      fileName, filePath, fileUploadedAt,
      pricingTeamId, preSalesTeamId
    }, { transaction: t })

    if (salesTeamIds) {
      await bc.setSalesTeams(salesTeamIds, { transaction: t })
    }

    // Update tender detail
    if (projectType === 'Tender' && tenderDetail) {
      await TenderDetail.destroy({ where: { businessCaseId: bc.id }, transaction: t })
      await TenderDetail.create({ ...tenderDetail, businessCaseId: bc.id }, { transaction: t })
    } else if (projectType === 'Non-Tender') {
      await TenderDetail.destroy({ where: { businessCaseId: bc.id }, transaction: t })
    }

    // Update service details
    if (serviceDetails && serviceDetails.length > 0) {
      await ServiceDetail.destroy({ where: { businessCaseId: bc.id }, transaction: t })
      for (const sd of serviceDetails) {
        await ServiceDetail.create({ ...sd, businessCaseId: bc.id }, { transaction: t })
      }
    }

    await t.commit()

    return res.status(200).json({
      status: 'success',
      message: 'Business Case berhasil diperbarui'
    })
  } catch (error) {
    await t.rollback()
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

// DELETE business case
const deleteBC = async (req, res) => {
  try {
    const bc = await BusinessCase.findByPk(req.params.id)
    if (!bc) {
      return res.status(404).json({ status: 'error', message: 'Business Case tidak ditemukan' })
    }

    // Hapus file jika ada
    if (bc.filePath && fs.existsSync(bc.filePath)) {
      fs.unlinkSync(bc.filePath)
    }

    await bc.destroy()

    return res.status(200).json({
      status: 'success',
      message: 'Business Case berhasil dihapus'
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

// GET download file
const downloadFile = async (req, res) => {
  try {
    const bc = await BusinessCase.findByPk(req.params.id)
    if (!bc || !bc.filePath) {
      return res.status(404).json({ status: 'error', message: 'File tidak ditemukan' })
    }

    if (!fs.existsSync(bc.filePath)) {
      return res.status(404).json({ status: 'error', message: 'File tidak ditemukan di server' })
    }

    return res.download(bc.filePath, bc.fileName)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

// GET export excel
const exportBC = async (req, res) => {
  try {
    const { status, bcType, lob, search } = req.query
    const where = {}

    if (search) {
      where[Op.or] = [
        { bcTitle: { [Op.like]: `%${search}%` } },
        { bcCode: { [Op.like]: `%${search}%` } },
        { custName: { [Op.like]: `%${search}%` } }
      ]
    }
    if (status) where.projectStatus = status
    if (bcType) where.bcType = bcType
    if (lob) where.lineOfBusiness = lob

    const bcs = await BusinessCase.findAll({
      where,
      include: [
        { model: SalesTeam, through: { attributes: [] } },
        { model: PricingTeam, attributes: ['name'] },
        { model: PreSalesTeam, attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    })

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Business Cases')

    sheet.columns = [
      { header: 'BC Code', key: 'bcCode', width: 25 },
      { header: 'BC Title', key: 'bcTitle', width: 30 },
      { header: 'BC Type', key: 'bcType', width: 15 },
      { header: 'Project Type', key: 'projectType', width: 15 },
      { header: 'Activity Type', key: 'activityType', width: 15 },
      { header: 'Project Status', key: 'projectStatus', width: 15 },
      { header: 'Customer Name', key: 'custName', width: 25 },
      { header: 'Line of Business', key: 'lineOfBusiness', width: 30 },
      { header: 'Contract Type', key: 'contractType', width: 15 },
      { header: 'Activation Type', key: 'activationType', width: 15 },
      { header: 'Contract Period', key: 'contractPeriod', width: 15 },
      { header: 'ES Req Date', key: 'esReqDate', width: 15 },
      { header: 'CF Date', key: 'cfDate', width: 15 },
      { header: 'RFS Date', key: 'rfsDate', width: 15 },
      { header: 'Due Date', key: 'dueDate', width: 15 },
      { header: 'OTC', key: 'otc', width: 20 },
      { header: 'MRC', key: 'mrc', width: 20 },
      { header: 'TCV', key: 'tcv', width: 20 },
      { header: 'Total Net Rev', key: 'totalNetRev', width: 20 },
      { header: 'Y1 Rev Yearly', key: 'y1RevYearly', width: 20 },
      { header: 'PPR Eligibility', key: 'pprEligibility', width: 15 },
      { header: 'PPR Status', key: 'pprStatus', width: 15 },
      { header: 'Total CoS', key: 'totalCoS', width: 20 },
      { header: 'EBITDA', key: 'ebitda', width: 20 },
      { header: 'EBITDA Margin', key: 'ebitdaMargin', width: 15 },
      { header: 'Net Profit', key: 'netProfit', width: 20 },
      { header: 'Total CAPEX', key: 'totalCapex', width: 20 },
      { header: 'NPV', key: 'npv', width: 20 },
      { header: 'IRR', key: 'irr', width: 15 },
      { header: 'Payback', key: 'payback', width: 15 },
      { header: 'Pricing Team', key: 'pricingTeam', width: 20 },
      { header: 'Pre Sales Team', key: 'preSalesTeam', width: 20 },
      { header: 'Sales Team', key: 'salesTeams', width: 30 },
      { header: 'File Name', key: 'fileName', width: 25 },
      { header: 'Last Follow Up', key: 'lastFollowUpDate', width: 20 },
    ]

    // Style header
    sheet.getRow(1).font = { bold: true }
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE91E8C' }
    }
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }

    bcs.forEach(bc => {
      sheet.addRow({
        bcCode: bc.bcCode,
        bcTitle: bc.bcTitle,
        bcType: bc.bcType,
        projectType: bc.projectType,
        activityType: bc.activityType,
        projectStatus: bc.projectStatus,
        custName: bc.custName,
        lineOfBusiness: bc.lineOfBusiness,
        contractType: bc.contractType,
        activationType: bc.activationType,
        contractPeriod: bc.contractPeriod,
        esReqDate: bc.esReqDate,
        cfDate: bc.cfDate,
        rfsDate: bc.rfsDate,
        dueDate: bc.dueDate,
        otc: bc.otc,
        mrc: bc.mrc,
        tcv: bc.tcv,
        totalNetRev: bc.totalNetRev,
        y1RevYearly: bc.y1RevYearly,
        pprEligibility: bc.pprEligibility,
        pprStatus: bc.pprStatus,
        totalCoS: bc.totalCoS,
        ebitda: bc.ebitda,
        ebitdaMargin: bc.ebitdaMargin,
        netProfit: bc.netProfit,
        totalCapex: bc.totalCapex,
        npv: bc.npv,
        irr: bc.irr,
        payback: bc.payback,
        pricingTeam: bc.PricingTeam?.name,
        preSalesTeam: bc.PreSalesTeam?.name,
        salesTeams: bc.SalesTeams?.map(s => s.name).join(', '),
        fileName: bc.fileName,
        lastFollowUpDate: bc.lastFollowUpDate
      })
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=business_cases_${Date.now()}.xlsx`)

    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

// GET unique cust names (untuk creatable dropdown)
const getCustNames = async (req, res) => {
  try {
    const { search } = req.query
    const where = search ? { custName: { [Op.like]: `%${search}%` } } : {}

    const results = await BusinessCase.findAll({
      where,
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('custName')), 'custName']],
      raw: true
    })

    return res.status(200).json({
      status: 'success',
      data: results.map(r => r.custName)
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

module.exports = {
  getAllBC,
  getPendingFollowUp,
  getBCById,
  createBC,
  updateBC,
  deleteBC,
  downloadFile,
  exportBC,
  getCustNames
}