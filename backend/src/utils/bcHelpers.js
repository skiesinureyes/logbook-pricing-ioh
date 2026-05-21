// ── Sanitize Helpers ─────────────────────────────────────────────────────────

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

// ── Auto-calculate Fields ─────────────────────────────────────────────────────

const calculateAutoFields = (data) => {
  const tcv = Number(data.tcv) || 0
  const totalCoS = Number(data.totalCoS) || 0
  const directOpex = Number(data.directOpex) || 0
  const otherOpexDirect = Number(data.otherOpexDirect) || 0
  const indirectOpex = Number(data.indirectOpex) || 0
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

// ── Audit Trail Helpers ───────────────────────────────────────────────────────

const FIELD_LABELS = {
  bcTitle: 'Judul BC', bcType: 'Tipe BC', cpbDate: 'CPB Date',
  projectType: 'Tipe Proyek', activityType: 'Tipe Aktivitas',
  projectStatus: 'Status Proyek', followUpNotes: 'Catatan Follow Up',
  esReqDate: 'ES Req Date', cfDate: 'CF Date', dueDate: 'Due Date',
  custName: 'Nama Customer', custJoinYear: 'Tahun Bergabung',
  lineOfBusiness: 'Line of Business', contractType: 'Tipe Kontrak',
  activationType: 'Tipe Aktivasi', rfsDate: 'RFS Date',
  contractPeriod: 'Periode Kontrak',
  pricingTeamId: 'Pricing Team', preSalesTeamId: 'Pre-Sales Team',
  pprStatus: 'PPR Status',
  otc: 'OTC', mrc: 'MRC', tcv: 'TCV',
  totalNetRev: 'Total Net Revenue',
  totalCapex: 'Total CAPEX',
  wacc: 'WACC', npv: 'NPV', irr: 'IRR', payback: 'Payback',
  fileName: 'File BC'
}

const generateChangeSummary = (oldData, newData) => {
  const changes = []
  const normalize = (v) => (v === null || v === undefined || v === '') ? null : String(v)

  for (const [field, label] of Object.entries(FIELD_LABELS)) {
    const oldStr = normalize(oldData[field])
    const newStr = normalize(newData[field])
    if (oldStr === newStr) continue
    changes.push(`${label}: "${oldStr ?? 'kosong'}" → "${newStr ?? 'kosong'}"`)
  }

  return changes.length > 0 ? changes.join(' | ') : null
}

const summarizeServiceDetails = (serviceDetails) => {
  if (!serviceDetails || serviceDetails.length === 0) return 'kosong'
  return serviceDetails.map((sd, i) => {
    const parts = []
    if (sd.serviceId) parts.push(`Service ID: ${sd.serviceId}`)
    if (sd.subServiceId) parts.push(`Sub-Service ID: ${sd.subServiceId}`)
    if (sd.serviceSegment) parts.push(`Segment: ${sd.serviceSegment}`)
    if (sd.totalUnit) parts.push(`Unit: ${sd.totalUnit}`)
    if (sd.detailService) parts.push(`Detail: ${sd.detailService}`)
    return `[${i + 1}] ${parts.join(', ')}`
  }).join(' | ')
}

module.exports = {
  sanitizeDate,
  sanitizeInt,
  sanitizeBigInt,
  sanitizeFloat,
  sanitizeStr,
  calculateAutoFields,
  generateChangeSummary,
  summarizeServiceDetails,
  FIELD_LABELS
}