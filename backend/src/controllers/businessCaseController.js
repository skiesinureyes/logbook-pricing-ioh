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
const { subServiceCRUD } = require('./masterDataController')

// ── helpers ───────────────────────────────────────────────────────────────────
const sanitizeDate = (val) => {
  if (!val || val === '' || val === 'Invalid date') return null
  return val
}

const sanitizeInt = (val) => {
  if (!val && val !== 0) return null
  const n = parseInt(val)
  return isNaN(n) ? null : n
}

const sanitizeBigInt = (val) => {
  if (!val && val !== 0) return null
  const n = Number(String(val).replace(/\D/g, ''))
  return isNaN(n) || n === 0 ? null : n
}

const sanitizeFloat = (val) => {
  if (!val && val !== 0) return null
  const n = parseFloat(val)
  return isNaN(n) ? null : n
}

const sanitizeStr = (val) => {
  if (!val || val === '') return null
  return val
}

// Generate bcCode
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

// Auto-calculate fields
const calculateAutoFields = (data) => {
  const tcv = Number(data.tcv) || 0
  const totalCoS = Number(data.totalCoS) || 0
  const directOpex = Number(data.directOpex) || 0
  const otherOpexDirect = Number(data.otherOpexDirect) || 0
  const indirectOpex = Number(data.indirectOpex) || 0
  const totalNetRev = Number(data.totalNetRev) || 0
  const y1RevYearly = Number(data.y1RevYearly) || 0
  const totalCapex = Number(data.totalCapex) || 0

  const pprEligibility = (y1RevYearly > 1000000000 && totalCoS > 1000000000 && totalCapex > 1000000000)
    ? 'Eligible' : 'Not Eligible'

  const totalOpex = totalCoS + directOpex + otherOpexDirect + indirectOpex
  const ebitda = tcv - totalOpex
  let ebitdaMargin = null
  if (tcv > 0) {
    const margin = ebitda / tcv
    if (isFinite(margin)) ebitdaMargin = margin
  }

  return { pprEligibility, ebitda, ebitdaMargin, totalOpex }
}

// ── GET all business cases ────────────────────────────────────────────────────
const getAllBC = async (req, res) => {
  try {
    const { search, sort = 'createdAt', order = 'DESC', status, bcType, lob, page = 1, limit = 20 } = req.query
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

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const { count, rows } = await BusinessCase.findAndCountAll({
      where,
      distinct: true,
      include: [
        { model: SalesTeam, through: { attributes: [] }, required: false }, // ← required: false
        { model: PricingTeam, attributes: ['id', 'name'], required: false },
        { model: PreSalesTeam, attributes: ['id', 'name'], required: false },
        { model: ServiceDetail, required: false, include: [{ model: Service, required: false, include: [{ model: SubService, required: false }] }] }
      ],
      order: [[sort, order]],
      limit: parseInt(limit),
      offset
    })

    return res.status(200).json({
      status: 'success',
      message: 'Data business case berhasil diambil',
      data: rows,
      meta: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / limit) }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

// ── GET pending follow up ─────────────────────────────────────────────────────
const getPendingFollowUp = async (req, res) => {
  try {
    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

    const bcs = await BusinessCase.findAll({
      where: {
        lastFollowUpDate: { [Op.lte]: fourteenDaysAgo },
        projectStatus: { [Op.notIn]: ['Win', 'Lost', 'Drop Exp', 'Drop Sls', 'Cancel'] }
      },
      include: [
        { model: ServiceDetail, include: [{ model: Service, include: [{ model: SubService }] }] },
        { model: SalesTeam, through: { attributes: [] } },
        { model: PricingTeam },
        { model: PreSalesTeam }
      ],
      order: [['lastFollowUpDate', 'ASC']]
    })

    return res.status(200).json({ status: 'success', data: bcs })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

// ── GET detail BC ─────────────────────────────────────────────────────────────
const getBCById = async (req, res) => {
  try {
    const bc = await BusinessCase.findByPk(req.params.id, {
      include: [
        { model: TenderDetail },
        { model: ServiceDetail, include: [{ model: Service, include: [{ model: SubService }] }] },
        {
          model: SalesTeam,
          through: { attributes: [] },
          include: [{ model: Department, include: [{ model: Division, include: [{ model: Group }] }] }]
        },
        { model: PricingTeam },
        { model: PreSalesTeam }
      ]
    })
    if (!bc) return res.status(404).json({ status: 'error', message: 'Business Case tidak ditemukan' })
    return res.status(200).json({ status: 'success', data: bc })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

// ── POST create BC ────────────────────────────────────────────────────────────
const createBC = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const {
      bcTitle, bcType, cpbDate, projectType, activityType, projectStatus, followUpNotes,
      esReqDate, cfDate, dueDate, sfalId, opportunityId, salesOrder, quote,
      custName, custJoinYear, lineOfBusiness, contractType, activationType,
      rfsDate, contractPeriod, pricingTeamId, preSalesTeamId, salesTeamIds,
      pprStatus, otc, mrc, tcv, totalNetRev, portOnlyRev, y1RevCalendar,
      y1RevYearly, y1CoS, totalCoS, networkOpex, directOpex, otherOpexDirect,
      indirectOpex, financingCost, marketingCost, riskCost, b2bDirectOverhead,
      iohOverheadAllocation, contributionMargin, totalCapex, netProfit,
      totalFcf, totalAccFcf, wacc, npv, irr, payback,
      tenderDetail, serviceDetails
    } = req.body

    const { pprEligibility, ebitda, ebitdaMargin, totalOpex } = calculateAutoFields({
      y1RevYearly, totalCoS, totalCapex, contributionMargin,
      iohOverheadAllocation, totalNetRev, directOpex, otherOpexDirect, indirectOpex
    })

    const firstServiceId = serviceDetails?.[0]?.serviceId
    const bcCode = firstServiceId ? await generateBcCode(firstServiceId) : null

    let fileName = null, filePath = null, fileUploadedAt = null
    if (req.file) {
      fileName = req.file.originalname
      filePath = req.file.path
      fileUploadedAt = new Date()
    }

    const bc = await BusinessCase.create({
      bcCode, bcTitle, bcType,
      cpbDate: sanitizeDate(cpbDate),
      projectType, activityType, projectStatus,
      lastFollowUpDate: new Date(),
      followUpNotes: sanitizeStr(followUpNotes),
      esReqDate, cfDate,
      dueDate: sanitizeDate(dueDate),
      sfalId: sanitizeStr(sfalId),
      opportunityId: sanitizeStr(opportunityId),
      salesOrder: sanitizeStr(salesOrder),
      quote: sanitizeStr(quote),
      custName,
      custJoinYear: sanitizeInt(custJoinYear),
      lineOfBusiness, contractType, activationType, rfsDate, contractPeriod,
      otc: sanitizeBigInt(otc), mrc: sanitizeBigInt(mrc),
      tcv: sanitizeBigInt(tcv), totalNetRev: sanitizeBigInt(totalNetRev),
      portOnlyRev: sanitizeBigInt(portOnlyRev),
      y1RevCalendar: sanitizeBigInt(y1RevCalendar),
      y1RevYearly: sanitizeBigInt(y1RevYearly),
      pprEligibility, pprStatus: sanitizeStr(pprStatus),
      y1CoS: sanitizeBigInt(y1CoS), totalCoS: sanitizeBigInt(totalCoS),
      networkOpex: sanitizeBigInt(networkOpex),
      directOpex: sanitizeBigInt(directOpex),
      otherOpexDirect: sanitizeBigInt(otherOpexDirect),
      indirectOpex: sanitizeBigInt(indirectOpex),
      financingCost: sanitizeBigInt(financingCost),
      marketingCost: sanitizeBigInt(marketingCost),
      riskCost: sanitizeBigInt(riskCost),
      b2bDirectOverhead: sanitizeBigInt(b2bDirectOverhead),
      iohOverheadAllocation: sanitizeBigInt(iohOverheadAllocation),
      contributionMargin: sanitizeBigInt(contributionMargin),
      ebitda, ebitdaMargin, totalOpex,
      totalCapex: sanitizeBigInt(totalCapex),
      netProfit: sanitizeBigInt(netProfit),
      totalFcf: sanitizeBigInt(totalFcf),
      totalAccFcf: sanitizeBigInt(totalAccFcf),
      wacc: sanitizeFloat(wacc), npv: sanitizeBigInt(npv),
      irr: sanitizeFloat(irr), payback: sanitizeFloat(payback),
      fileName, filePath, fileUploadedAt,
      userId: req.user.id,
      pricingTeamId: sanitizeInt(pricingTeamId),
      preSalesTeamId: sanitizeInt(preSalesTeamId)
    }, { transaction: t })

    // Sales teams
    const salesIds = Array.isArray(salesTeamIds)
      ? salesTeamIds : salesTeamIds ? [salesTeamIds] : []
    if (salesIds.length > 0) await bc.setSalesTeams(salesIds, { transaction: t })

    // Tender detail
    if (projectType === 'Tender' && tenderDetail) {
      await TenderDetail.create({
        winnerName: tenderDetail.winnerName,
        winningPrice: sanitizeBigInt(tenderDetail.winningPrice) || 0,
        lostReason: sanitizeStr(tenderDetail.lostReason),
        reason: tenderDetail.reason || '',
        businessCaseId: bc.id
      }, { transaction: t })
    }

    console.log('serviceDetails received:', JSON.stringify(serviceDetails))

    // Service details
    if (serviceDetails && serviceDetails.length > 0) {
      for (const sd of serviceDetails) {
        await ServiceDetail.create({
          serviceSegment: sanitizeStr(sd.serviceSegment),
          totalUnit: sanitizeInt(sd.totalUnit),
          detailService: sanitizeStr(sd.detailService),
          serviceLocation: sanitizeStr(sd.serviceLocation),
          locationA: sanitizeStr(sd.locationA),
          locationB: sanitizeStr(sd.locationB),
          totalBwPerMbps: sanitizeInt(sd.totalBwPerMbps),
          pricePerMbps: sanitizeBigInt(sd.pricePerMbps),
          infraType: sanitizeStr(sd.infraType),
          infraNotes: sanitizeStr(sd.infraNotes),
          subServiceId: sanitizeInt(sd.subServiceId), // ← tambah ini
          businessCaseId: bc.id,
          serviceId: sanitizeInt(sd.serviceId)
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

// ── PUT update BC ─────────────────────────────────────────────────────────────
const updateBC = async (req, res) => {
  const t = await sequelize.transaction()
  try {
    const bc = await BusinessCase.findByPk(req.params.id)
    if (!bc) return res.status(404).json({ status: 'error', message: 'Business Case tidak ditemukan' })

    const {
      bcTitle, bcType, cpbDate, projectType, activityType, projectStatus, followUpNotes,
      esReqDate, cfDate, dueDate, sfalId, opportunityId, salesOrder, quote,
      custName, custJoinYear, lineOfBusiness, contractType, activationType,
      rfsDate, contractPeriod, pricingTeamId, preSalesTeamId, salesTeamIds,
      pprStatus, otc, mrc, tcv, totalNetRev, portOnlyRev, y1RevCalendar,
      y1RevYearly, y1CoS, totalCoS, networkOpex, directOpex, otherOpexDirect,
      indirectOpex, financingCost, marketingCost, riskCost, b2bDirectOverhead,
      iohOverheadAllocation, contributionMargin, totalCapex, netProfit,
      totalFcf, totalAccFcf, wacc, npv, irr, payback,
      tenderDetail, serviceDetails
    } = req.body

    const { pprEligibility, ebitda, ebitdaMargin, totalOpex } = calculateAutoFields({
      y1RevYearly, totalCoS, totalCapex, contributionMargin,
      iohOverheadAllocation, totalNetRev, directOpex, otherOpexDirect, indirectOpex
    })

    let fileName = bc.fileName, filePath = bc.filePath, fileUploadedAt = bc.fileUploadedAt
    if (req.file) {
      if (bc.filePath && fs.existsSync(bc.filePath)) fs.unlinkSync(bc.filePath)
      fileName = req.file.originalname
      filePath = req.file.path
      fileUploadedAt = new Date()
    }

    await bc.update({
      bcTitle, bcType,
      cpbDate: sanitizeDate(cpbDate),
      projectType, activityType, projectStatus,
      lastFollowUpDate: req.body.updateFollowUpDate === 'true' ? new Date() : bc.lastFollowUpDate,
      esReqDate, cfDate,
      dueDate: sanitizeDate(dueDate),
      sfalId: sanitizeStr(sfalId),
      opportunityId: sanitizeStr(opportunityId),
      salesOrder: sanitizeStr(salesOrder),
      quote: sanitizeStr(quote),
      custName,
      custJoinYear: sanitizeInt(custJoinYear),
      lineOfBusiness, contractType, activationType, rfsDate, contractPeriod,
      otc: sanitizeBigInt(otc), mrc: sanitizeBigInt(mrc),
      tcv: sanitizeBigInt(tcv), totalNetRev: sanitizeBigInt(totalNetRev),
      portOnlyRev: sanitizeBigInt(portOnlyRev),
      y1RevCalendar: sanitizeBigInt(y1RevCalendar),
      y1RevYearly: sanitizeBigInt(y1RevYearly),
      pprEligibility, pprStatus: sanitizeStr(pprStatus),
      y1CoS: sanitizeBigInt(y1CoS), totalCoS: sanitizeBigInt(totalCoS),
      networkOpex: sanitizeBigInt(networkOpex),
      directOpex: sanitizeBigInt(directOpex),
      otherOpexDirect: sanitizeBigInt(otherOpexDirect),
      indirectOpex: sanitizeBigInt(indirectOpex),
      financingCost: sanitizeBigInt(financingCost),
      marketingCost: sanitizeBigInt(marketingCost),
      riskCost: sanitizeBigInt(riskCost),
      b2bDirectOverhead: sanitizeBigInt(b2bDirectOverhead),
      iohOverheadAllocation: sanitizeBigInt(iohOverheadAllocation),
      contributionMargin: sanitizeBigInt(contributionMargin),
      ebitda, ebitdaMargin, totalOpex,
      totalCapex: sanitizeBigInt(totalCapex),
      netProfit: sanitizeBigInt(netProfit),
      totalFcf: sanitizeBigInt(totalFcf),
      totalAccFcf: sanitizeBigInt(totalAccFcf),
      wacc: sanitizeFloat(wacc), npv: sanitizeBigInt(npv),
      irr: sanitizeFloat(irr), payback: sanitizeFloat(payback),
      fileName, filePath, fileUploadedAt,
      pricingTeamId: sanitizeInt(pricingTeamId),
      preSalesTeamId: sanitizeInt(preSalesTeamId)
    }, { transaction: t })

    const salesIds = Array.isArray(salesTeamIds)
      ? salesTeamIds : salesTeamIds ? [salesTeamIds] : []
    if (salesIds.length > 0) await bc.setSalesTeams(salesIds, { transaction: t })

    if (projectType === 'Tender' && tenderDetail) {
      await TenderDetail.destroy({ where: { businessCaseId: bc.id }, transaction: t })
      await TenderDetail.create({
        winnerName: tenderDetail.winnerName,
        winningPrice: sanitizeBigInt(tenderDetail.winningPrice) || 0,
        lostReason: sanitizeStr(tenderDetail.lostReason),
        reason: tenderDetail.reason || '',
        businessCaseId: bc.id
      }, { transaction: t })
    } else if (projectType === 'Non-Tender') {
      await TenderDetail.destroy({ where: { businessCaseId: bc.id }, transaction: t })
    }

    if (serviceDetails && serviceDetails.length > 0) {
      await ServiceDetail.destroy({ where: { businessCaseId: bc.id }, transaction: t })
      for (const sd of serviceDetails) {
        await ServiceDetail.create({
          serviceSegment: sanitizeStr(sd.serviceSegment),
          totalUnit: sanitizeInt(sd.totalUnit),
          detailService: sanitizeStr(sd.detailService),
          serviceLocation: sanitizeStr(sd.serviceLocation),
          locationA: sanitizeStr(sd.locationA),
          locationB: sanitizeStr(sd.locationB),
          totalBwPerMbps: sanitizeInt(sd.totalBwPerMbps),
          pricePerMbps: sanitizeBigInt(sd.pricePerMbps),
          infraType: sanitizeStr(sd.infraType),
          infraNotes: sanitizeStr(sd.infraNotes),
          businessCaseId: bc.id,
          serviceId: sanitizeInt(sd.serviceId),
          subServiceId: sanitizeInt(sd.subServiceId) 
        }, { transaction: t })
      }
    }

    await t.commit()
    return res.status(200).json({ status: 'success', message: 'Business Case berhasil diperbarui' })
  } catch (error) {
    await t.rollback()
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

// ── DELETE BC ─────────────────────────────────────────────────────────────────
const deleteBC = async (req, res) => {
  try {
    const bc = await BusinessCase.findByPk(req.params.id)
    if (!bc) return res.status(404).json({ status: 'error', message: 'Business Case tidak ditemukan' })
    if (bc.filePath && fs.existsSync(bc.filePath)) fs.unlinkSync(bc.filePath)
    await bc.destroy()
    return res.status(200).json({ status: 'success', message: 'Business Case berhasil dihapus' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

// ── GET download file ─────────────────────────────────────────────────────────
const downloadFile = async (req, res) => {
  try {
    const bc = await BusinessCase.findByPk(req.params.id)
    if (!bc || !bc.filePath) return res.status(404).json({ status: 'error', message: 'File tidak ditemukan' })
    if (!fs.existsSync(bc.filePath)) return res.status(404).json({ status: 'error', message: 'File tidak ditemukan di server' })
    return res.download(bc.filePath, bc.fileName)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

// ── GET export excel ──────────────────────────────────────────────────────────
const exportBC = async (req, res) => {
  try {
    const { status, bcType, lob, search, ids } = req.query
    const where = {}
    if (ids) {
      where.id = { [Op.in]: ids.split(',').map(Number) }
    } else {
      if (search) {
        where[Op.or] = [
          { bcTitle: { [Op.like]: `%${search}%` } },
          { bcCode: { [Op.like]: `%${search}%` } },
          { custName: { [Op.like]: `%${search}%` } }
        ]
      }
    }
    if (status) where.projectStatus = status
    if (bcType) where.bcType = bcType
    if (lob) where.lineOfBusiness = lob

    const bcs = await BusinessCase.findAll({
      where,
      include: [
        { model: SalesTeam, through: { attributes: [] }, include: [{ model: Department, include: [{ model: Division, include: [{ model: Group }] }] }] },
        { model: PricingTeam, attributes: ['name'] },
        { model: PreSalesTeam, attributes: ['name'] },
        { model: ServiceDetail, include: [{ model: Service, include: [{ model: SubService }] }] },
        { model: TenderDetail }
      ],
      order: [['createdAt', 'DESC']]
    })

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Business Cases')

    sheet.columns = [
      { header: 'BC Code', key: 'bcCode', width: 28 },
      { header: 'BC Title', key: 'bcTitle', width: 35 },
      { header: 'BC Type', key: 'bcType', width: 12 },
      { header: 'Project Type', key: 'projectType', width: 14 },
      { header: 'Activity Type', key: 'activityType', width: 14 },
      { header: 'Project Status', key: 'projectStatus', width: 14 },
      { header: 'Last Follow Up Date', key: 'lastFollowUpDate', width: 20 },
      { header: 'Follow Up Notes', key: 'followUpNotes', width: 40 },
      { header: 'ES Req Date', key: 'esReqDate', width: 14 },
      { header: 'CF Date', key: 'cfDate', width: 14 },
      { header: 'CPB Date', key: 'cpbDate', width: 14 },
      { header: 'SFA ID', key: 'sfaId', width: 16 },
      { header: 'Opportunity ID', key: 'opportunityId', width: 18 },
      { header: 'Sales Order', key: 'salesOrder', width: 16 },
      { header: 'Quote', key: 'quote', width: 16 },
      { header: 'Customer Name', key: 'custName', width: 28 },
      { header: 'Customer Join Year', key: 'custJoinYear', width: 18 },
      { header: 'Line of Business', key: 'lineOfBusiness', width: 35 },
      { header: 'Contract Type', key: 'contractType', width: 14 },
      { header: 'Activation Type', key: 'activationType', width: 16 },
      { header: 'Contract Period', key: 'contractPeriod', width: 16 },
      { header: 'RFS Date', key: 'rfsDate', width: 14 },
      { header: 'Sales Name', key: 'salesTeams', width: 28 },
      { header: 'Group', key: 'group', width: 20 },
      { header: 'Division', key: 'division', width: 20 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Pre-Sales Team', key: 'preSalesTeam', width: 20 },
      { header: 'Pricing Team', key: 'pricingTeam', width: 20 },
      { header: 'Service Segment', key: 'serviceSegment', width: 16 },
      { header: 'Service Type', key: 'serviceNames', width: 20 },
      { header: 'Sub-Service Type', key: 'subServiceNames', width: 20 },
      { header: 'PPR Eligibility', key: 'pprEligibility', width: 14 },
      { header: 'PPR Status', key: 'pprStatus', width: 14 },
      { header: 'OTC', key: 'otc', width: 18 },
      { header: 'MRC', key: 'mrc', width: 18 },
      { header: 'TCV', key: 'tcv', width: 18 },
      { header: 'Total Net Revenue', key: 'totalNetRev', width: 20 },
      { header: 'Port Only Revenue', key: 'portOnlyRev', width: 20 },
      { header: 'Y1 Rev Calendar', key: 'y1RevCalendar', width: 18 },
      { header: 'Y1 Rev Yearly', key: 'y1RevYearly', width: 18 },
      { header: 'Y1 CoS', key: 'y1CoS', width: 18 },
      { header: 'Total CoS', key: 'totalCoS', width: 18 },
      { header: 'Network OPEX', key: 'networkOpex', width: 18 },
      { header: 'Direct OPEX', key: 'directOpex', width: 18 },
      { header: 'Other Direct OPEX', key: 'otherOpexDirect', width: 18 },
      { header: 'Indirect OPEX', key: 'indirectOpex', width: 18 },
      { header: 'Total OPEX', key: 'totalOpex', width: 18 },
      { header: 'Financing Cost', key: 'financingCost', width: 18 },
      { header: 'Marketing Cost', key: 'marketingCost', width: 18 },
      { header: 'Risk Cost', key: 'riskCost', width: 18 },
      { header: 'B2B Direct Overhead', key: 'b2bDirectOverhead', width: 20 },
      { header: 'IOH Overhead', key: 'iohOverheadAllocation', width: 20 },
      { header: 'Contribution Margin', key: 'contributionMargin', width: 20 },
      { header: 'EBITDA', key: 'ebitda', width: 18 },
      { header: 'EBITDA Margin (%)', key: 'ebitdaMargin', width: 18 },
      { header: 'Net Profit', key: 'netProfit', width: 18 },
      { header: 'Total CAPEX', key: 'totalCapex', width: 18 },
      { header: 'Total FCF', key: 'totalFcf', width: 18 },
      { header: 'Total Accumulated FCF', key: 'totalAccFcf', width: 22 },
      { header: 'WACC (%)', key: 'wacc', width: 12 },
      { header: 'NPV', key: 'npv', width: 18 },
      { header: 'IRR (%)', key: 'irr', width: 12 },
      { header: 'Payback (tahun)', key: 'payback', width: 16 },
      { header: 'Tender Winner', key: 'tenderWinner', width: 20 },
      { header: 'Winning Price', key: 'tenderWinningPrice', width: 18 },
      { header: 'Lost Reason', key: 'tenderLostReason', width: 16 },
      { header: 'Tender Reason', key: 'tenderReason', width: 30 },
      { header: 'File Name', key: 'fileName', width: 28 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 },
    ]

    const headerRow = sheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE91E8C' } }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    headerRow.height = 30

    sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: sheet.columns.length } }
    sheet.views = [{ state: 'frozen', ySplit: 1 }]

    bcs.forEach((bc, rowIdx) => {
      const serviceNames = bc.ServiceDetails?.map(sd => sd.Service?.name || '-').join(', ') || ''
      const subServiceNames = [...new Set(
        bc.ServiceDetails?.map(sd => {
          if (!sd.subServiceId) return '-'
          const allSubs = bc.ServiceDetails?.flatMap(s => s.Service?.SubServices || []) || []
          const found = allSubs.find(ss => String(ss.id) === String(sd.subServiceId))
          return found?.name || '-'
        }) || []
      )].join(', ') || ''
      const serviceSegments = [...new Set(bc.ServiceDetails?.map(sd => sd.serviceSegment || '-') || [])].join(', ') || ''
      const firstSales = bc.SalesTeams?.[0]

      const row = sheet.addRow({
        bcCode: bc.bcCode || '',
        bcTitle: bc.bcTitle || '',
        bcType: bc.bcType || '',
        projectType: bc.projectType || '',
        activityType: bc.activityType || '',
        projectStatus: bc.projectStatus || '',
        lastFollowUpDate: bc.lastFollowUpDate ? new Date(bc.lastFollowUpDate).toLocaleDateString('id-ID') : '',
        followUpNotes: bc.followUpNotes || '',
        esReqDate: bc.esReqDate || '',
        cfDate: bc.cfDate || '',
        cpbDate: bc.cpbDate || '',
        sfaId: bc.sfalId || '',
        opportunityId: bc.opportunityId || '',
        salesOrder: bc.salesOrder || '',
        quote: bc.quote || '',
        custName: bc.custName || '',
        custJoinYear: bc.custJoinYear || '',
        lineOfBusiness: bc.lineOfBusiness || '',
        contractType: bc.contractType || '',
        activationType: bc.activationType || '',
        contractPeriod: bc.contractPeriod || '',
        rfsDate: bc.rfsDate || '',
        salesTeams: bc.SalesTeams?.map(s => s.name).join(', ') || '',
        group: firstSales?.Department?.Division?.Group?.name || '',
        division: firstSales?.Department?.Division?.name || '',
        department: firstSales?.Department?.name || '',
        preSalesTeam: bc.PreSalesTeam?.name || '',
        pricingTeam: bc.PricingTeam?.name || '',
        serviceSegment: serviceSegments,
        serviceNames,
        subServiceNames,
        pprEligibility: bc.pprEligibility || '',
        pprStatus: bc.pprStatus || '',
        otc: bc.otc || '',
        mrc: bc.mrc || '',
        tcv: bc.tcv || '',
        totalNetRev: bc.totalNetRev || '',
        portOnlyRev: bc.portOnlyRev || '',
        y1RevCalendar: bc.y1RevCalendar || '',
        y1RevYearly: bc.y1RevYearly || '',
        y1CoS: bc.y1CoS || '',
        totalCoS: bc.totalCoS || '',
        networkOpex: bc.networkOpex || '',
        directOpex: bc.directOpex || '',
        otherOpexDirect: bc.otherOpexDirect || '',
        indirectOpex: bc.indirectOpex || '',
        totalOpex: bc.totalOpex || '',
        financingCost: bc.financingCost || '',
        marketingCost: bc.marketingCost || '',
        riskCost: bc.riskCost || '',
        b2bDirectOverhead: bc.b2bDirectOverhead || '',
        iohOverheadAllocation: bc.iohOverheadAllocation || '',
        contributionMargin: bc.contributionMargin || '',
        ebitda: bc.ebitda || '',
        ebitdaMargin: bc.ebitdaMargin != null ? (bc.ebitdaMargin * 100).toFixed(2) : '',
        netProfit: bc.netProfit || '',
        totalCapex: bc.totalCapex || '',
        totalFcf: bc.totalFcf || '',
        totalAccFcf: bc.totalAccFcf || '',
        wacc: bc.wacc || '',
        npv: bc.npv || '',
        irr: bc.irr || '',
        payback: bc.payback || '',
        tenderWinner: bc.TenderDetail?.winnerName || '',
        tenderWinningPrice: bc.TenderDetail?.winningPrice || '',
        tenderLostReason: bc.TenderDetail?.lostReason || '',
        tenderReason: bc.TenderDetail?.reason || '',
        fileName: bc.fileName || '',
        createdAt: new Date(bc.createdAt).toLocaleDateString('id-ID'),
        updatedAt: new Date(bc.updatedAt).toLocaleDateString('id-ID'),
      })

      if (rowIdx % 2 === 1) {
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9F9F9' } }
      }
      row.alignment = { vertical: 'middle' }
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

// ── GET cust names ────────────────────────────────────────────────────────────
const getCustNames = async (req, res) => {
  try {
    const { search } = req.query
    const where = search ? { custName: { [Op.like]: `%${search}%` } } : {}
    const results = await BusinessCase.findAll({
      where,
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('custName')), 'custName']],
      raw: true
    })
    return res.status(200).json({ status: 'success', data: results.map(r => r.custName) })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

// ── GET dashboard stats ───────────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate, bcType, serviceType } = req.query
    const where = {}
    if (startDate && endDate) where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] }
    else if (startDate) where.createdAt = { [Op.gte]: new Date(startDate) }
    else if (endDate) where.createdAt = { [Op.lte]: new Date(endDate) }
    if (bcType) where.bcType = bcType

    const bcs = await BusinessCase.findAll({
      where,
      include: [{ model: ServiceDetail, include: [{ model: Service }] }],
      order: [['createdAt', 'ASC']]
    })

    const filteredBcs = serviceType
      ? bcs.filter(bc => bc.ServiceDetails?.some(sd => sd.Service?.name === serviceType))
      : bcs

    // BC by Status
    const byStatus = {}
    filteredBcs.forEach(bc => { byStatus[bc.projectStatus] = (byStatus[bc.projectStatus] || 0) + 1 })
    const bcByStatus = Object.entries(byStatus).map(([status, count]) => ({ status, count }))

    // TCV by Service
    const tcvByService = {}
    filteredBcs.forEach(bc => {
      const svcs = [...new Set(bc.ServiceDetails?.map(sd => sd.Service?.name).filter(Boolean) || [])]
      svcs.forEach(svc => { tcvByService[svc] = (tcvByService[svc] || 0) + (Number(bc.tcv) || 0) })
    })
    const bcTcvByService = Object.entries(tcvByService).map(([service, totalTcv]) => ({
      service, totalTcv, totalTcvMillions: Math.round(totalTcv / 1000000)
    }))

    // BC by Service over time
    const allServiceNames = [...new Set(
      filteredBcs.flatMap(bc => bc.ServiceDetails?.map(sd => sd.Service?.name).filter(Boolean) || [])
    )]

    const timeGrouped = { daily: {}, weekly: {}, monthly: {} }
    filteredBcs.forEach(bc => {
      const date = new Date(bc.createdAt)
      const daily = date.toISOString().split('T')[0]
      const weekStart = new Date(date); weekStart.setDate(date.getDate() - date.getDay())
      const weekly = weekStart.toISOString().split('T')[0]
      const monthly = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      Object.entries({ daily, weekly, monthly }).forEach(([period, key]) => {
        if (!timeGrouped[period][key]) {
          timeGrouped[period][key] = { period: key, total: 0 }
          allServiceNames.forEach(svc => { timeGrouped[period][key][svc] = 0 })
        }
        timeGrouped[period][key].total += 1
        const svcs = [...new Set(bc.ServiceDetails?.map(sd => sd.Service?.name).filter(Boolean) || [])]
        svcs.forEach(svc => { if (timeGrouped[period][key][svc] !== undefined) timeGrouped[period][key][svc] += 1 })
      })
    })

    const bcByServiceTime = {
      daily: Object.values(timeGrouped.daily).sort((a, b) => a.period.localeCompare(b.period)),
      weekly: Object.values(timeGrouped.weekly).sort((a, b) => a.period.localeCompare(b.period)),
      monthly: Object.values(timeGrouped.monthly).sort((a, b) => a.period.localeCompare(b.period)),
    }

    return res.status(200).json({
      status: 'success',
      data: { bcByStatus, bcTcvByService, bcByServiceTime, allServiceNames, totalBC: filteredBcs.length }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' })
  }
}

module.exports = {
  getAllBC, getPendingFollowUp, getBCById,
  createBC, updateBC, deleteBC,
  downloadFile, exportBC, getCustNames, getDashboardStats
}