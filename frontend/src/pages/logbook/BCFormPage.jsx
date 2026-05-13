import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import businessCaseService from '../../services/businessCaseService'
import masterDataService from '../../services/masterDataService'

// ── helpers ───────────────────────────────────────────────────────────────────
const formatIDR = (val) => {
  if (!val && val !== 0) return ''
  return Number(String(val).replace(/\D/g, '')).toLocaleString('id-ID')
}
const parseIDR = (val) => {
  if (!val) return ''
  return String(val).replace(/\D/g, '')
}
const sanitizeDate = (val) => {
  if (!val || val === '' || val === 'Invalid date') return null
  return val
}
const getLocalToday = () => {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  const local = new Date(now.getTime() - offset * 60000)
  return local.toISOString().split('T')[0]
}
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '-'
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}
const formatDisplayDateFromISO = (isoStr) => {
  if (!isoStr) return '-'
  const d = new Date(isoStr)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ── constants ──────────────────────────────────────────────────────────────────
const BC_TYPES = ['Non-BC', 'BC-CPB', 'BC']
const PROJECT_TYPES = ['Non-Tender', 'Tender']
const ACTIVITY_TYPES = ['BAU', 'Non BAU']
const PROJECT_STATUSES = ['On Progress', 'Win', 'Lost', 'Drop Exp', 'Drop Sls', 'Double', 'Cancel']
const CONTRACT_TYPES = ['Existing', 'New']
const ACTIVATION_TYPES = ['New', 'Additional', 'Renewal', 'Upgrade', 'Relocated', 'Downgrade', 'Reconfiguration']
const CONTRACT_PERIODS = ['1', '12', '24', '36', '48', '60', 'Other']
const LOCATIONS = ['Jawa-Bali', 'Kalimantan', 'Sulawesi', 'Sumatera']
const LINES_OF_BUSINESS = [
  'Agriculture, Forestry Management', 'Agriculture, Livestock and Fisheries',
  'Hunting/Wildlife Conservation', 'Business Services', 'Communication',
  'Technology', 'Education Services', 'Mining & Quarrying',
  'Mining, Oil & Gas Support Services', 'Oil & Gas', 'Public Utilities',
  'Banking', 'Non - Bank Financial', 'Government', 'Health Services',
  'Hotel', 'Restaurant', 'Broadcaster', 'Media', 'Non Profit Organization',
  'Building Service,Architect & Eng.', 'Construction',
  'Engineering, Procurement & Construction', 'Property Developer',
  'Real Estate', 'Distribution', 'Logistic', 'Manufacturing',
  'Trading and Retailer', 'Transport Service', 'Transportation'
]
const PPR_STATUSES = ['On Progress', 'Done']
const SERVICE_SEGMENTS = ['TelCo', 'TechCo']
const LOST_REASONS = ['Pricing', 'Undisclosed', 'Technical']

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: currentYear - 1999 }, (_, i) => String(currentYear - i))

const emptyService = {
  serviceSegment: '', serviceId: '', subServiceId: '',
  infraType: '', infraNotes: '',
  totalUnit: '', detailService: '',
  serviceLocation: '', locationA: '', locationB: '',
  totalBwPerMbps: '', pricePerMbps: '',
  open: true
}

const emptyForm = {
  bcTitle: '', bcType: '', projectType: '', activityType: '', projectStatus: '', followUpNotes: '',
  esReqDate: '', cfDate: '', cpbDate: '',
  sfaId: '', opportunityId: '', salesOrder: '', quote: '',
  custName: '', custJoinYear: '', lineOfBusiness: '',
  contractType: '', activationType: '', contractPeriod: '', rfsDate: '',
  salesTeamId: '', pricingTeamId: '', preSalesTeamId: '',
  pprStatus: '',
  otc: '', mrc: '',
  tcv: '', totalNetRev: '', portOnlyRev: '', y1RevCalendar: '', y1RevYearly: '',
  y1CoS: '', totalCoS: '',
  networkOpex: '', directOpex: '', otherOpexDirect: '', indirectOpex: '',
  financingCost: '', marketingCost: '', riskCost: '',
  b2bDirectOverhead: '', iohOverheadAllocation: '', contributionMargin: '',
  totalCapex: '',
  netProfit: '', totalFcf: '', totalAccFcf: '',
  wacc: '', npv: '', irr: '', payback: '',
  tenderWinnerName: '', tenderWinningPrice: '', tenderLostReason: '', tenderReason: '',
  serviceDetails: [{ ...emptyService }]
}

const AUTOSAVE_KEY = 'bc_form_autosave'

const BCFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(() => {
    if (!isEdit) {
      const saved = localStorage.getItem(AUTOSAVE_KEY)
      if (saved) { try { return JSON.parse(saved) } catch { return emptyForm } }
    }
    return emptyForm
  })

  const [file, setFile] = useState(null)
  const [existingFile, setExistingFile] = useState(null)
  const [existingLastFollowUp, setExistingLastFollowUp] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(isEdit)
  const [error, setError] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const [projectStatusTouched, setProjectStatusTouched] = useState(false)

  // Master data
  const [salesTeams, setSalesTeams] = useState([])
  const [pricingTeams, setPricingTeams] = useState([])
  const [preSalesTeams, setPreSalesTeams] = useState([])
  const [services, setServices] = useState([])
  const [subServices, setSubServices] = useState([])
  const [custNameOptions, setCustNameOptions] = useState([])
  const [custJoinYearMap, setCustJoinYearMap] = useState({})
  const [custLobMap, setCustLobMap] = useState({})
  const [custNameInput, setCustNameInput] = useState('')
  const [showCustDropdown, setShowCustDropdown] = useState(false)
  const [selectedSalesInfo, setSelectedSalesInfo] = useState(null)

  // Auto-calculated
  const [pprEligibility, setPprEligibility] = useState('')
  const [ebitda, setEbitda] = useState(0)
  const [ebitdaMargin, setEbitdaMargin] = useState(0)
  const [ebitdaMarginTier, setEbitdaMarginTier] = useState('')
  const [totalOpex, setTotalOpex] = useState(0)

  useEffect(() => { fetchMasterData(); if (isEdit) fetchBC() }, [])

  useEffect(() => { if (!isEdit && isDirty) localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(form)) }, [form, isDirty, isEdit])

  useEffect(() => { calculateAutoFields() }, [
    form.tcv, form.totalCoS, form.directOpex, form.otherOpexDirect,
    form.indirectOpex, form.totalNetRev, form.y1RevYearly, form.totalCapex
  ])

  useEffect(() => {
    if (form.salesTeamId) {
      const st = salesTeams.find(s => String(s.id) === String(form.salesTeamId))
      setSelectedSalesInfo(st || null)
    } else setSelectedSalesInfo(null)
  }, [form.salesTeamId, salesTeams])

  useEffect(() => {
    const handleBeforeUnload = (e) => { if (isDirty) { e.preventDefault(); e.returnValue = '' } }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const fetchMasterData = async () => {
    try {
      const [st, pt, pst, sv, ss] = await Promise.all([
        masterDataService.getSalesTeams(), masterDataService.getPricingTeams(),
        masterDataService.getPreSalesTeams(), masterDataService.getServices(),
        masterDataService.getSubServices(),
      ])
      setSalesTeams(st.data.data); setPricingTeams(pt.data.data)
      setPreSalesTeams(pst.data.data); setServices(sv.data.data); setSubServices(ss.data.data)

      const cn = await businessCaseService.getCustNames('')
      setCustNameOptions(cn.data.data || [])

      const bcRes = await businessCaseService.getAll({ limit: 1000 })
      const yearMap = {}, lobMap = {}
      bcRes.data.data.forEach(bc => {
        if (bc.custName && bc.custJoinYear) yearMap[bc.custName] = bc.custJoinYear
        if (bc.custName && bc.lineOfBusiness) lobMap[bc.custName] = bc.lineOfBusiness
      })
      setCustJoinYearMap(yearMap); setCustLobMap(lobMap)
    } catch (err) { console.error(err) }
  }

  const fetchBC = async () => {
    try {
      const res = await businessCaseService.getById(id)
      const bc = res.data.data
      setExistingLastFollowUp(bc.lastFollowUpDate)
      const mapped = {
        bcTitle: bc.bcTitle || '', bcType: bc.bcType || '',
        projectType: bc.projectType || '', activityType: bc.activityType || '',
        projectStatus: bc.projectStatus || '', followUpNotes: bc.followUpNotes || '', esReqDate: bc.esReqDate || '',
        cfDate: bc.cfDate || '', cpbDate: bc.cpbDate || '',
        sfaId: bc.sfalId || '', opportunityId: bc.opportunityId || '',
        salesOrder: bc.salesOrder || '', quote: bc.quote || '',
        custName: bc.custName || '', custJoinYear: bc.custJoinYear ? String(bc.custJoinYear) : '',
        lineOfBusiness: bc.lineOfBusiness || '',
        contractType: bc.contractType || '', activationType: bc.activationType || '',
        contractPeriod: bc.contractPeriod || '', rfsDate: bc.rfsDate || '',
        salesTeamId: String(bc.SalesTeams?.[0]?.id || ''),
        pricingTeamId: String(bc.pricingTeamId || ''),
        preSalesTeamId: String(bc.preSalesTeamId || ''),
        pprStatus: bc.pprStatus || '',
        otc: bc.otc || '', mrc: bc.mrc || '',
        tcv: bc.tcv || '', totalNetRev: bc.totalNetRev || '',
        portOnlyRev: bc.portOnlyRev || '', y1RevCalendar: bc.y1RevCalendar || '',
        y1RevYearly: bc.y1RevYearly || '', y1CoS: bc.y1CoS || '', totalCoS: bc.totalCoS || '',
        networkOpex: bc.networkOpex || '', directOpex: bc.directOpex || '',
        otherOpexDirect: bc.otherOpexDirect || '', indirectOpex: bc.indirectOpex || '',
        financingCost: bc.financingCost || '', marketingCost: bc.marketingCost || '',
        riskCost: bc.riskCost || '', b2bDirectOverhead: bc.b2bDirectOverhead || '',
        iohOverheadAllocation: bc.iohOverheadAllocation || '',
        contributionMargin: bc.contributionMargin || '',
        totalCapex: bc.totalCapex || '', netProfit: bc.netProfit || '',
        totalFcf: bc.totalFcf || '', totalAccFcf: bc.totalAccFcf || '',
        wacc: bc.wacc || '', npv: bc.npv || '', irr: bc.irr || '', payback: bc.payback || '',
        tenderWinnerName: bc.TenderDetail?.winnerName || '',
        tenderWinningPrice: bc.TenderDetail?.winningPrice || '',
        tenderLostReason: bc.TenderDetail?.lostReason || '',
        tenderReason: bc.TenderDetail?.reason || '',
        serviceDetails: bc.ServiceDetails?.length > 0
          ? bc.ServiceDetails.map(sd => ({
              serviceSegment: sd.serviceSegment || sd.Service?.serviceCategory || '',
              serviceId: String(sd.serviceId || ''),
              subServiceId: String(sd.subServiceId || ''),
              infraType: sd.infraType || '',
              infraNotes: sd.infraNotes || '',
              totalUnit: sd.totalUnit || '',
              detailService: sd.detailService || '',
              serviceLocation: sd.serviceLocation || '',
              locationA: sd.locationA || '',
              locationB: sd.locationB || '',
              totalBwPerMbps: sd.totalBwPerMbps || '',
              pricePerMbps: sd.pricePerMbps || '',
              open: true
            }))
          : [{ ...emptyService }]
      }
      setForm(mapped)
      setCustNameInput(bc.custName || '')
      if (bc.fileName) setExistingFile(bc.fileName)
    } catch (err) { console.error(err) }
    finally { setPageLoading(false) }
  }

  const calculateAutoFields = () => {
    const tcv = Number(parseIDR(form.tcv)) || 0
    const totalCoS = Number(parseIDR(form.totalCoS)) || 0
    const directOpex = Number(parseIDR(form.directOpex)) || 0
    const otherOpexDirect = Number(parseIDR(form.otherOpexDirect)) || 0
    const indirectOpex = Number(parseIDR(form.indirectOpex)) || 0
    const totalNetRev = Number(parseIDR(form.totalNetRev)) || 0
    const y1RevYearly = Number(parseIDR(form.y1RevYearly)) || 0
    const totalCapex = Number(parseIDR(form.totalCapex)) || 0

    // Total OPEX
    const opex = totalCoS + directOpex + otherOpexDirect + indirectOpex
    setTotalOpex(opex)

    // PPR Eligibility
    setPprEligibility(
      y1RevYearly > 1000000000 && totalCoS > 1000000000 && totalCapex > 1000000000
        ? 'Eligible' : 'Not Eligible'
    )

    // EBITDA = TCV - Total OPEX
    const eb = tcv - opex
    setEbitda(eb)

    // EBITDA Margin = EBITDA / Total Net Revenue
    const margin = tcv > 0 ? (eb / tcv) * 100 : 0
    setEbitdaMargin(margin)

    // EBITDA Margin Tier
    if (margin < 20) setEbitdaMarginTier('< 20%')
    else if (margin < 33) setEbitdaMarginTier('20 - 33%')
    else if (margin < 42.5) setEbitdaMarginTier('33 - 42.5%')
    else setEbitdaMarginTier('> 42.5%')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setIsDirty(true)
  }

  const handleProjectStatusChange = (e) => {
    setForm(prev => ({ ...prev, projectStatus: e.target.value, followUpNotes: '' }))
    setProjectStatusTouched(true)
    setIsDirty(true)
  }

  const handleCustNameInput = (e) => {
    const val = e.target.value
    setCustNameInput(val)
    setForm(prev => ({
      ...prev, custName: val,
      custJoinYear: custJoinYearMap[val] ? String(custJoinYearMap[val]) : prev.custJoinYear,
      lineOfBusiness: custLobMap[val] || prev.lineOfBusiness
    }))
    setShowCustDropdown(true)
    setIsDirty(true)
  }

  const handleCustNameSelect = (name) => {
    setForm(prev => ({
      ...prev, custName: name,
      custJoinYear: custJoinYearMap[name] ? String(custJoinYearMap[name]) : prev.custJoinYear,
      lineOfBusiness: custLobMap[name] || prev.lineOfBusiness
    }))
    setCustNameInput(name)
    setShowCustDropdown(false)
    setIsDirty(true)
  }

  const getServicesBySegment = (segment) => {
    if (!segment) return []
    return services.filter(s => s.serviceCategory === segment)
  }

  const getFilteredSubServices = (serviceId) => {
    if (!serviceId) return []
    return subServices.filter(ss => String(ss.serviceId) === String(serviceId))
  }

  const getSelectedSubServiceName = (subServiceId) => {
    return subServices.find(ss => String(ss.id) === String(subServiceId))?.name || ''
  }

  const handleServiceChange = (index, field, value) => {
    setForm(prev => {
      const updated = [...prev.serviceDetails]
      updated[index] = { ...updated[index], [field]: value }
      if (field === 'serviceSegment') {
        updated[index].serviceId = ''
        updated[index].subServiceId = ''
        updated[index].infraType = ''
        updated[index].infraNotes = ''
      }
      if (field === 'serviceId') {
        updated[index].subServiceId = ''
        updated[index].infraType = ''
        updated[index].infraNotes = ''
      }
      return { ...prev, serviceDetails: updated }
    })
    setIsDirty(true)
  }

  const addService = () => {
    setForm(prev => ({ ...prev, serviceDetails: [...prev.serviceDetails, { ...emptyService }] }))
    setIsDirty(true)
  }

  const removeService = (index) => {
    setForm(prev => ({ ...prev, serviceDetails: prev.serviceDetails.filter((_, i) => i !== index) }))
    setIsDirty(true)
  }

  const toggleService = (index) => {
    setForm(prev => {
      const updated = [...prev.serviceDetails]
      updated[index] = { ...updated[index], open: !updated[index].open }
      return { ...prev, serviceDetails: updated }
    })
  }

  const handleBack = () => {
    if (isDirty) {
      if (window.confirm('Anda yakin tidak ingin melanjutkan? Data yang belum disimpan akan hilang.')) {
        if (!isEdit) localStorage.removeItem(AUTOSAVE_KEY)
        navigate('/logbook')
      }
    } else navigate('/logbook')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const formData = new FormData()
      const strFields = [
        'bcTitle', 'bcType', 'projectType', 'activityType', 'projectStatus','followUpNotes',
        'esReqDate', 'cfDate', 'opportunityId', 'salesOrder', 'quote',
        'custName', 'lineOfBusiness', 'contractType', 'activationType',
        'contractPeriod', 'rfsDate', 'pricingTeamId', 'preSalesTeamId', 'pprStatus',
        'wacc', 'irr', 'payback'
      ]
      strFields.forEach(f => formData.append(f, form[f] || ''))
      formData.append('sfalId', form.sfaId || '')
      formData.append('cpbDate', sanitizeDate(form.cpbDate) || '')
      formData.append('custJoinYear', form.custJoinYear || '')
      formData.append('updateFollowUpDate', isEdit ? (projectStatusTouched ? 'true' : 'false') : 'true')

      const idrFields = [
        'otc', 'mrc', 'tcv', 'totalNetRev', 'portOnlyRev', 'y1RevCalendar', 'y1RevYearly',
        'y1CoS', 'totalCoS', 'networkOpex', 'directOpex', 'otherOpexDirect', 'indirectOpex',
        'financingCost', 'marketingCost', 'riskCost', 'b2bDirectOverhead',
        'iohOverheadAllocation', 'contributionMargin', 'totalCapex',
        'netProfit', 'totalFcf', 'totalAccFcf', 'npv'
      ]
      idrFields.forEach(f => formData.append(f, parseIDR(form[f]) || ''))

      if (form.salesTeamId) formData.append('salesTeamIds[]', form.salesTeamId)

      if (form.projectType === 'Tender') {
        formData.append('tenderDetail[winnerName]', form.tenderWinnerName)
        formData.append('tenderDetail[winningPrice]', parseIDR(form.tenderWinningPrice))
        formData.append('tenderDetail[lostReason]', form.tenderLostReason || '')
        formData.append('tenderDetail[reason]', form.tenderReason)
      }

      form.serviceDetails.forEach((sd, i) => {
        formData.append(`serviceDetails[${i}][serviceId]`, sd.serviceId)
        formData.append(`serviceDetails[${i}][subServiceId]`, sd.subServiceId || '')
        formData.append(`serviceDetails[${i}][serviceSegment]`, sd.serviceSegment || '')
        formData.append(`serviceDetails[${i}][totalUnit]`, sd.totalUnit || '')
        formData.append(`serviceDetails[${i}][detailService]`, sd.detailService || '')
        formData.append(`serviceDetails[${i}][serviceLocation]`, sd.serviceLocation || '')
        formData.append(`serviceDetails[${i}][locationA]`, sd.locationA || '')
        formData.append(`serviceDetails[${i}][locationB]`, sd.locationB || '')
        formData.append(`serviceDetails[${i}][totalBwPerMbps]`, sd.totalBwPerMbps || '')
        formData.append(`serviceDetails[${i}][pricePerMbps]`, parseIDR(sd.pricePerMbps) || '')
        formData.append(`serviceDetails[${i}][infraType]`, sd.infraType || '')
        formData.append(`serviceDetails[${i}][infraNotes]`, sd.infraNotes || '')
      })

      if (file) formData.append('file', file)

      if (isEdit) await businessCaseService.update(id, formData)
      else { await businessCaseService.create(formData); localStorage.removeItem(AUTOSAVE_KEY) }

      navigate('/logbook')
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan')
    } finally { setLoading(false) }
  }

  if (pageLoading) return <div style={styles.loading}>Memuat data...</div>

  const filteredCustNames = custNameOptions.filter(n => n.toLowerCase().includes(custNameInput.toLowerCase()))
  const hasFile = file || existingFile

  const lastFollowUpDisplay = isEdit
    ? (projectStatusTouched ? formatDisplayDate(getLocalToday()) + ' (akan diperbarui)' : formatDisplayDateFromISO(existingLastFollowUp))
    : formatDisplayDate(getLocalToday())

  const ebitdaTierColor = {
    '< 20%': '#e53935',
    '20 - 33%': '#e65100',
    '33 - 42.5%': '#f9a825',
    '> 42.5%': '#2e7d32'
  }[ebitdaMarginTier] || '#555'

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{isEdit ? 'Edit Business Case' : 'Tambah Business Case'}</h1>
          <p style={styles.subtitle}>{isEdit ? 'Edit data Business Case' : 'Isi formulir untuk menambahkan Business Case baru'}</p>
        </div>
        <button type='button' onClick={handleBack} style={styles.backButton}>← Kembali</button>
      </div>

      <form onSubmit={handleSubmit}>

        {/* ── SECTION 1: BC Details ── */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>BC Details</h2>

          {/* BC Title */}
          <div style={{ ...styles.formGroup, marginBottom: '16px' }}>
            <label style={styles.label}>BC Title *</label>
            <input name='bcTitle' value={form.bcTitle} onChange={handleChange} style={styles.input} placeholder='Masukkan judul Business Case' required />
          </div>

          {/* BC Type, Project Type, Activity Type */}
          <div style={{ ...styles.grid3, marginBottom: '16px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>BC Type *</label>
              <select name='bcType' value={form.bcType} onChange={handleChange} style={styles.input} required>
                <option value=''>-- Pilih --</option>
                {BC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Project Type *</label>
              <select name='projectType' value={form.projectType} onChange={handleChange} style={styles.input} required>
                <option value=''>-- Pilih --</option>
                {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Activity Type *</label>
              <select name='activityType' value={form.activityType} onChange={handleChange} style={styles.input} required>
                <option value=''>-- Pilih --</option>
                {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Project Status, Last Follow Up */}
          <div style={{ ...styles.grid2, marginBottom: '16px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Project Status *</label>
              <select
                name='projectStatus' value={form.projectStatus}
                onChange={handleProjectStatusChange}
                style={{ ...styles.input, borderColor: projectStatusTouched ? '#E91E8C' : '#e0e0e0' }}
                required
              >
                <option value=''>-- Pilih --</option>
                {PROJECT_STATUSES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Last Follow Up Date</label>
              <input
                value={lastFollowUpDisplay}
                style={{ ...styles.input, backgroundColor: '#f0f0f0', color: projectStatusTouched ? '#E91E8C' : '#666' }}
                readOnly
              />
            </div>
          </div>

          {/* Follow Up Notes */}
          {(projectStatusTouched || form.followUpNotes || isEdit) && (
            <div style={{ ...styles.formGroup, marginBottom: '16px' }}>
              <label style={styles.label}>
                Follow Up Notes *
                <span style={{ fontWeight: '400', color: '#888', marginLeft: '6px', fontSize: '12px' }}>
                  (wajib diisi saat memperbarui Project Status)
                </span>
              </label>
              <textarea
                name='followUpNotes'
                value={form.followUpNotes}
                onChange={handleChange}
                style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                placeholder='Tuliskan catatan tindak lanjut...'
                required={projectStatusTouched}
              />
            </div>
          )}

          {/* ES Req Date, CF Date, CPB Date (only if BC-CPB) */}
          <div style={{ ...styles.grid3, marginBottom: '16px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>ES Request Date *</label>
              <input name='esReqDate' type='date' value={form.esReqDate} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>CF Date *</label>
              <input name='cfDate' type='date' value={form.cfDate} onChange={handleChange} style={styles.input} required />
            </div>
            {form.bcType === 'BC-CPB' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>CPB Date</label>
                <input name='cpbDate' type='date' value={form.cpbDate} onChange={handleChange} style={styles.input} />
              </div>
            )}
          </div>

          {/* SFA ID, Opportunity ID, Sales Order, Quote */}
          <div style={{ ...styles.grid4, marginBottom: '16px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>SFA ID</label>
              <input name='sfaId' value={form.sfaId} onChange={handleChange} style={styles.input} placeholder='SFA ID' />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Opportunity ID</label>
              <input name='opportunityId' value={form.opportunityId} onChange={handleChange} style={styles.input} placeholder='Opportunity ID' />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Sales Order</label>
              <input name='salesOrder' value={form.salesOrder} onChange={handleChange} style={styles.input} placeholder='Sales Order' />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Quote</label>
              <input name='quote' value={form.quote} onChange={handleChange} style={styles.input} placeholder='Quote' />
            </div>
          </div>

          {/* Customer Name, Customer Join Year, Line of Business */}
          <div style={{ ...styles.grid3, marginBottom: '16px' }}>
            <div style={{ ...styles.formGroup, position: 'relative' }}>
              <label style={styles.label}>Customer Name *</label>
              <input
                value={custNameInput}
                onChange={handleCustNameInput}
                onFocus={() => setShowCustDropdown(true)}
                onBlur={() => setTimeout(() => setShowCustDropdown(false), 200)}
                style={styles.input}
                placeholder='Ketik atau pilih nama customer'
                required
              />
              {showCustDropdown && (
                <div style={styles.custDropdown}>
                  {filteredCustNames.length > 0
                    ? filteredCustNames.map(n => (
                        <div key={n} style={styles.custOption} onMouseDown={() => handleCustNameSelect(n)}>{n}</div>
                      ))
                    : custNameInput && (
                        <div style={styles.custNew} onMouseDown={() => handleCustNameSelect(custNameInput)}>
                          + Tambah "{custNameInput}"
                        </div>
                      )
                  }
                </div>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Customer Join Year *</label>
              <select name='custJoinYear' value={form.custJoinYear} onChange={handleChange} style={styles.input} required>
                <option value=''>-- Pilih Tahun --</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Line of Business *</label>
              <select name='lineOfBusiness' value={form.lineOfBusiness} onChange={handleChange} style={styles.input} required>
                <option value=''>-- Pilih --</option>
                {LINES_OF_BUSINESS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Contract Type, Activation Type, Contract Period, RFS Date */}
          <div style={styles.grid4}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Contract Type *</label>
              <select name='contractType' value={form.contractType} onChange={handleChange} style={styles.input} required>
                <option value=''>-- Pilih --</option>
                {CONTRACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Activation Type *</label>
              <select name='activationType' value={form.activationType} onChange={handleChange} style={styles.input} required>
                <option value=''>-- Pilih --</option>
                {ACTIVATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Contract Period *</label>
              <select name='contractPeriod' value={form.contractPeriod} onChange={handleChange} style={styles.input} required>
                <option value=''>-- Pilih --</option>
                {CONTRACT_PERIODS.map(t => <option key={t} value={t}>{t !== 'Other' ? `${t} months` : t}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>RFS Date *</label>
              <input name='rfsDate' type='date' value={form.rfsDate} onChange={handleChange} style={styles.input} required />
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Stakeholders ── */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Stakeholders Involved</h2>
          <div style={{ ...styles.grid3, marginBottom: selectedSalesInfo ? '16px' : '0' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Sales Name *</label>
              <select name='salesTeamId' value={form.salesTeamId} onChange={handleChange} style={styles.input} required>
                <option value=''>-- Pilih Sales --</option>
                {salesTeams.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Pre-Sales Team *</label>
              <select name='preSalesTeamId' value={form.preSalesTeamId} onChange={handleChange} style={styles.input} required>
                <option value=''>-- Pilih --</option>
                {preSalesTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Pricing Team *</label>
              <select name='pricingTeamId' value={form.pricingTeamId} onChange={handleChange} style={styles.input} required>
                <option value=''>-- Pilih --</option>
                {pricingTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          {selectedSalesInfo && (
            <div style={styles.autoInfoBox}>
              <div style={styles.autoInfoGrid}>
                <div style={styles.autoInfoItem}>
                  <span style={styles.autoInfoLabel}>Group</span>
                  <span style={styles.autoInfoValue}>{selectedSalesInfo.Department?.Division?.Group?.name || '-'}</span>
                </div>
                <div style={styles.autoInfoItem}>
                  <span style={styles.autoInfoLabel}>Division</span>
                  <span style={styles.autoInfoValue}>{selectedSalesInfo.Department?.Division?.name || '-'}</span>
                </div>
                <div style={styles.autoInfoItem}>
                  <span style={styles.autoInfoLabel}>Department</span>
                  <span style={styles.autoInfoValue}>{selectedSalesInfo.Department?.name || '-'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── SECTION 3: Service ── */}
        <div style={styles.section}>
          <div style={styles.sectionHeaderRow}>
            <h2 style={styles.sectionTitle}>Service</h2>
            <button type='button' onClick={addService} style={styles.addServiceBtn}>+ Tambah Service</button>
          </div>
          {form.serviceDetails.map((sd, index) => {
            const selectedService = services.find(s => String(s.id) === String(sd.serviceId))
            const isMIDI = selectedService?.name === 'MIDI'
            const subServiceName = getSelectedSubServiceName(sd.subServiceId)
            const isMPLS = subServiceName === 'MPLS' || selectedService?.name === 'MPLS'
            const filteredServices = getServicesBySegment(sd.serviceSegment)
            const filteredSubs = getFilteredSubServices(sd.serviceId)
            const showLocationAB = sd.subServiceId && isMPLS
            const showServiceLocation = sd.subServiceId && !isMPLS
            const showMidiFields = isMIDI && sd.subServiceId

            return (
              <div key={index} style={styles.serviceCard}>
                <div style={styles.serviceCardHeader} onClick={() => toggleService(index)}>
                  <span style={styles.serviceCardTitle}>
                    Service {index + 1}
                    {sd.serviceSegment && ` — ${sd.serviceSegment}`}
                    {selectedService && ` › ${selectedService.name}`}
                  </span>
                  <div style={styles.serviceCardActions}>
                    {form.serviceDetails.length > 1 && (
                      <button type='button' onClick={(e) => { e.stopPropagation(); removeService(index) }} style={styles.deleteServiceBtn}>
                        Hapus Service
                      </button>
                    )}
                    <span style={styles.toggleIcon}>{sd.open ? '▲' : '▼'}</span>
                  </div>
                </div>
                {sd.open && (
                  <div style={styles.serviceCardBody}>
                    {/* Row 1: Service Segment, Service Type, Sub-Service Type */}
                    <div style={{ ...styles.grid3, marginBottom: '16px' }}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Service Segment *</label>
                        <select
                          value={sd.serviceSegment}
                          onChange={(e) => handleServiceChange(index, 'serviceSegment', e.target.value)}
                          style={styles.input} required
                        >
                          <option value=''>-- Pilih Segment --</option>
                          {SERVICE_SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Service Type *</label>
                        <select
                          value={sd.serviceId}
                          onChange={(e) => handleServiceChange(index, 'serviceId', e.target.value)}
                          style={{ ...styles.input, backgroundColor: !sd.serviceSegment ? '#f0f0f0' : '#fafafa' }}
                          required disabled={!sd.serviceSegment}
                        >
                          <option value=''>-- Pilih Service --</option>
                          {filteredServices.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Sub-Service Type *</label>
                        <select
                          value={sd.subServiceId}
                          onChange={(e) => handleServiceChange(index, 'subServiceId', e.target.value)}
                          style={{ ...styles.input, backgroundColor: !sd.serviceId ? '#f0f0f0' : '#fafafa' }}
                          required disabled={!sd.serviceId}
                        >
                          <option value=''>-- Pilih Sub-Service --</option>
                          {filteredSubs.map(ss => <option key={ss.id} value={ss.id}>{ss.name}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Total Unit */}
                    <div style={{ ...styles.grid4, marginBottom: '16px' }}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Total Unit</label>
                        <input type='number' min='0' value={sd.totalUnit} onChange={(e) => handleServiceChange(index, 'totalUnit', e.target.value)} style={styles.input} placeholder='0' />
                      </div>
                    </div>

                    {/* Row 3: Detail Service */}
                    <div style={{ ...styles.formGroup, marginBottom: '16px' }}>
                      <label style={styles.label}>Detail Service</label>
                      <textarea value={sd.detailService} onChange={(e) => handleServiceChange(index, 'detailService', e.target.value)} style={{ ...styles.input, minHeight: '72px', resize: 'vertical' }} placeholder='Detail service...' />
                    </div>

                    {/* Service Location (non-MPLS) */}
                    {showServiceLocation && (
                      <div style={{ ...styles.grid4, marginBottom: '16px' }}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Service Location *</label>
                          <select value={sd.serviceLocation} onChange={(e) => handleServiceChange(index, 'serviceLocation', e.target.value)} style={styles.input} required>
                            <option value=''>-- Pilih --</option>
                            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Location A & B (MPLS only) */}
                    {showLocationAB && (
                      <div style={{ ...styles.grid2, marginBottom: '16px' }}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Location A *</label>
                          <select value={sd.locationA} onChange={(e) => handleServiceChange(index, 'locationA', e.target.value)} style={styles.input} required>
                            <option value=''>-- Pilih --</option>
                            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Location B</label>
                          <select value={sd.locationB} onChange={(e) => handleServiceChange(index, 'locationB', e.target.value)} style={styles.input}>
                            <option value=''>-- Pilih --</option>
                            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* MIDI fields: Total BW/MBPS, Price/MBPS */}
                    {showMidiFields && (
                      <div style={{ ...styles.grid2, marginBottom: '16px' }}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Total Bandwidth/MBPS</label>
                          <input type='number' min='0' value={sd.totalBwPerMbps} onChange={(e) => handleServiceChange(index, 'totalBwPerMbps', e.target.value)} style={styles.input} placeholder='0' />
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Price/MBPS</label>
                          <div style={styles.idrWrapper}>
                            <span style={styles.idrPrefix}>IDR</span>
                            <input value={formatIDR(sd.pricePerMbps)} onChange={(e) => handleServiceChange(index, 'pricePerMbps', parseIDR(e.target.value))} style={{ ...styles.input, paddingLeft: '52px' }} placeholder='0' />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── SECTION 4: Tender Detail ── */}
        {form.projectType === 'Tender' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Tender Details</h2>
            <div style={{ ...styles.grid2, marginBottom: '16px' }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Winner Name *</label>
                <input name='tenderWinnerName' value={form.tenderWinnerName} onChange={handleChange} style={styles.input} placeholder='Nama pemenang tender' required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Winning Price *</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form.tenderWinningPrice)} onChange={(e) => setForm(prev => ({ ...prev, tenderWinningPrice: parseIDR(e.target.value) }))} style={{ ...styles.input, paddingLeft: '52px' }} placeholder='0' required />
                </div>
              </div>
            </div>
            {form.projectStatus === 'Lost' && (
              <div style={{ ...styles.formGroup, marginBottom: '16px' }}>
                <label style={styles.label}>Lost Reason</label>
                <select name='tenderLostReason' value={form.tenderLostReason} onChange={handleChange} style={styles.input}>
                  <option value=''>-- Pilih --</option>
                  {LOST_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            )}
            <div style={styles.formGroup}>
              <label style={styles.label}>Reason *</label>
              <textarea name='tenderReason' value={form.tenderReason} onChange={handleChange} style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }} placeholder='Alasan...' required />
            </div>
          </div>
        )}

        {/* ── SECTION 5: Financial Projection ── */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Financial Projection</h2>

          {/* Auto-calculated summary */}
          <div style={styles.autoCalcBox}>
            <div style={styles.autoCalcItem}>
              <span style={styles.autoCalcLabel}>PPR Eligibility</span>
              <span style={{ ...styles.autoCalcValue, color: pprEligibility === 'Eligible' ? '#2e7d32' : '#e65100' }}>
                {pprEligibility || '-'}
              </span>
            </div>
            <div style={styles.autoCalcItem}>
              <span style={styles.autoCalcLabel}>EBITDA</span>
              <span style={styles.autoCalcValue}>IDR {Number(ebitda).toLocaleString('id-ID')}</span>
            </div>
            <div style={styles.autoCalcItem}>
              <span style={styles.autoCalcLabel}>EBITDA Margin</span>
              <span style={styles.autoCalcValue}>{ebitdaMargin.toFixed(2)}%</span>
            </div>
            <div style={styles.autoCalcItem}>
              <span style={styles.autoCalcLabel}>EBITDA Margin Tier</span>
              <span style={{ ...styles.autoCalcValue, color: ebitdaTierColor, fontSize: '14px' }}>
                {ebitdaMarginTier || '-'}
              </span>
            </div>
            <div style={styles.autoCalcItem}>
              <span style={styles.autoCalcLabel}>Total OPEX</span>
              <span style={styles.autoCalcValue}>IDR {Number(totalOpex).toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* PPR Status */}
          <div style={{ ...styles.formGroup, marginBottom: '20px' }}>
            <label style={styles.label}>PPR Status</label>
            <select name='pprStatus' value={form.pprStatus} onChange={handleChange} style={styles.input}>
              <option value=''>-- Pilih --</option>
              {PPR_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Charge */}
          <div style={styles.subsectionLabel}>Charge</div>
          <div style={{ ...styles.grid2, marginBottom: '20px' }}>
            {[{ name: 'otc', label: 'OTC (One-Time Charge)' }, { name: 'mrc', label: 'MRC (Monthly Recurring Charge)' }].map(f => (
              <div key={f.name} style={styles.formGroup}>
                <label style={styles.label}>{f.label}</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form[f.name])} onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))} style={{ ...styles.input, paddingLeft: '52px' }} placeholder='0' />
                </div>
              </div>
            ))}
          </div>

          {/* Cost */}
          <div style={styles.subsectionLabel}>Cost</div>
          <div style={{ ...styles.grid2, marginBottom: '16px' }}>
            {[{ name: 'totalCapex', label: 'Total CAPEX' }, { name: 'totalOpexDisplay', label: 'Total OPEX (auto)', readOnly: true }].map(f => (
              <div key={f.name} style={styles.formGroup}>
                <label style={styles.label}>{f.label}</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  {f.readOnly
                    ? <input value={Number(totalOpex).toLocaleString('id-ID')} style={{ ...styles.input, paddingLeft: '52px', backgroundColor: '#f0f0f0', color: '#666' }} readOnly />
                    : <input value={formatIDR(form[f.name])} onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))} style={{ ...styles.input, paddingLeft: '52px' }} placeholder='0' />
                  }
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...styles.grid2, marginBottom: '16px' }}>
            {[{ name: 'y1CoS', label: 'Y1 CoS (Cost of Sales)' }, { name: 'totalCoS', label: 'Total CoS (Cost of Sales)' }].map(f => (
              <div key={f.name} style={styles.formGroup}>
                <label style={styles.label}>{f.label}</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form[f.name])} onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))} style={{ ...styles.input, paddingLeft: '52px' }} placeholder='0' />
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...styles.grid4, marginBottom: '16px' }}>
            {[
              { name: 'networkOpex', label: 'Network OPEX' },
              { name: 'directOpex', label: 'Direct OPEX' },
              { name: 'otherOpexDirect', label: 'Other Direct OPEX' },
              { name: 'indirectOpex', label: 'Indirect OPEX' }
            ].map(f => (
              <div key={f.name} style={styles.formGroup}>
                <label style={styles.label}>{f.label}</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form[f.name])} onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))} style={{ ...styles.input, paddingLeft: '52px' }} placeholder='0' />
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...styles.grid3, marginBottom: '16px' }}>
            {[
              { name: 'financingCost', label: 'Financing Cost' },
              { name: 'marketingCost', label: 'Marketing Cost' },
              { name: 'riskCost', label: 'Risk Cost' }
            ].map(f => (
              <div key={f.name} style={styles.formGroup}>
                <label style={styles.label}>{f.label}</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form[f.name])} onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))} style={{ ...styles.input, paddingLeft: '52px' }} placeholder='0' />
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...styles.grid3, marginBottom: '20px' }}>
            {[
              { name: 'b2bDirectOverhead', label: 'B2B Direct Overhead' },
              { name: 'iohOverheadAllocation', label: 'IOH Overhead' },
              { name: 'contributionMargin', label: 'Contribution Margin' }
            ].map(f => (
              <div key={f.name} style={styles.formGroup}>
                <label style={styles.label}>{f.label}</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form[f.name])} onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))} style={{ ...styles.input, paddingLeft: '52px' }} placeholder='0' />
                </div>
              </div>
            ))}
          </div>

          {/* Revenue */}
          <div style={styles.subsectionLabel}>Revenue</div>
          <div style={{ ...styles.grid3, marginBottom: '16px' }}>
            {[
              { name: 'tcv', label: 'TCV (Total Contract Value)' },
              { name: 'totalNetRev', label: 'Total Net Revenue' },
              { name: 'portOnlyRev', label: 'Port Only Revenue' }
            ].map(f => (
              <div key={f.name} style={styles.formGroup}>
                <label style={styles.label}>{f.label}</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form[f.name])} onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))} style={{ ...styles.input, paddingLeft: '52px' }} placeholder='0' />
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...styles.grid2, marginBottom: '20px' }}>
            {[
              { name: 'y1RevCalendar', label: 'Y1 Revenue Calendar' },
              { name: 'y1RevYearly', label: 'Y1 Revenue Yearly' }
            ].map(f => (
              <div key={f.name} style={styles.formGroup}>
                <label style={styles.label}>{f.label}</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form[f.name])} onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))} style={{ ...styles.input, paddingLeft: '52px' }} placeholder='0' />
                </div>
              </div>
            ))}
          </div>

          {/* Financial Metrics */}
          <div style={styles.subsectionLabel}>Financial Metrics</div>
          <div style={{ ...styles.grid2, marginBottom: '16px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Net Profit</label>
              <div style={styles.idrWrapper}>
                <span style={styles.idrPrefix}>IDR</span>
                <input value={formatIDR(form.netProfit)} onChange={(e) => setForm(prev => ({ ...prev, netProfit: parseIDR(e.target.value) }))} style={{ ...styles.input, paddingLeft: '52px' }} placeholder='0' />
              </div>
            </div>
          </div>
          <div style={{ ...styles.grid2, marginBottom: '16px' }}>
            {[{ name: 'totalFcf', label: 'Total FCF (Free Cash Flow)' }, { name: 'totalAccFcf', label: 'Total Accumulated FCF' }].map(f => (
              <div key={f.name} style={styles.formGroup}>
                <label style={styles.label}>{f.label}</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form[f.name])} onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))} style={{ ...styles.input, paddingLeft: '52px' }} placeholder='0' />
                </div>
              </div>
            ))}
          </div>
          <div style={styles.grid4}>
            <div style={styles.formGroup}>
              <label style={styles.label}>WACC</label>
              <div style={styles.percentWrapper}>
                <input name='wacc' type='number' min='0' step='any' value={form.wacc} onChange={handleChange} style={{ ...styles.input, paddingRight: '36px' }} placeholder='0' />
                <span style={styles.percentSuffix}>%</span>
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>NPV</label>
              <div style={styles.idrWrapper}>
                <span style={styles.idrPrefix}>IDR</span>
                <input value={formatIDR(form.npv)} onChange={(e) => setForm(prev => ({ ...prev, npv: parseIDR(e.target.value) }))} style={{ ...styles.input, paddingLeft: '52px' }} placeholder='0' />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>IRR</label>
              <div style={styles.percentWrapper}>
                <input name='irr' type='number' min='0' step='any' value={form.irr} onChange={handleChange} style={{ ...styles.input, paddingRight: '36px' }} placeholder='0' />
                <span style={styles.percentSuffix}>%</span>
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Payback Period</label>
              <input name='payback' type='number' min='0' step='any' value={form.payback} onChange={handleChange} style={styles.input} placeholder='0' />
            </div>
          </div>
        </div>

        {/* ── SECTION 6: Upload BC ── */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Upload BC</h2>
          <input type='file' accept='.xlsx,.xls' onChange={(e) => { setFile(e.target.files[0]); setIsDirty(true) }} style={{ display: 'none' }} id='file-upload' />
          <label htmlFor='file-upload' style={{ ...styles.uploadBox, borderColor: hasFile ? '#4caf50' : '#e0e0e0', backgroundColor: hasFile ? '#f1f8e9' : '#fafafa' }}>
            <span style={styles.uploadIcon}>{hasFile ? '📄' : '📂'}</span>
            <span style={styles.uploadText}>{file ? file.name : existingFile ? existingFile : 'Klik untuk upload file Excel (.xlsx, .xls)'}</span>
            <span style={styles.uploadHint}>{hasFile ? 'Klik untuk mengganti file' : 'Maks. 10 MB'}</span>
          </label>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}
        <div style={styles.submitRow}>
          <button type='button' onClick={handleBack} style={styles.cancelBtn}>Batal</button>
          <button type='submit' style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Business Case'}
          </button>
        </div>
      </form>
    </div>
  )
}

const styles = {
  container: { padding: '32px', backgroundColor: '#f5f5f5', minHeight: '100vh', maxWidth: '1100px', margin: '0 auto' },
  loading: { padding: '64px', textAlign: 'center', color: '#888' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#3d3d3d', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#888' },
  backButton: { padding: '10px 20px', backgroundColor: '#fff', color: '#3d3d3d', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  section: { backgroundColor: '#fff', borderRadius: '12px', padding: '28px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#3d3d3d', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #fce4ec' },
  sectionHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #fce4ec' },
  subsectionLabel: { fontSize: '13px', fontWeight: '700', color: '#E91E8C', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid #fce4ec' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' },
  grid4: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#555' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '14px', color: '#3d3d3d', backgroundColor: '#fafafa', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' },
  idrWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  idrPrefix: { position: 'absolute', left: '14px', fontSize: '13px', fontWeight: '600', color: '#888', zIndex: 1, pointerEvents: 'none' },
  percentWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  percentSuffix: { position: 'absolute', right: '14px', fontSize: '13px', fontWeight: '600', color: '#888', zIndex: 1, pointerEvents: 'none' },
  custDropdown: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, maxHeight: '200px', overflowY: 'auto' },
  custOption: { padding: '10px 14px', fontSize: '14px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5' },
  custNew: { padding: '10px 14px', fontSize: '14px', cursor: 'pointer', color: '#E91E8C', fontWeight: '600' },
  autoInfoBox: { padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' },
  autoInfoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' },
  autoInfoItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  autoInfoLabel: { fontSize: '11px', fontWeight: '600', color: '#aaa', textTransform: 'uppercase' },
  autoInfoValue: { fontSize: '14px', fontWeight: '600', color: '#3d3d3d' },
  serviceCard: { border: '1px solid #e0e0e0', borderRadius: '10px', marginBottom: '12px', overflow: 'hidden' },
  serviceCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#fafafa', cursor: 'pointer' },
  serviceCardTitle: { fontSize: '14px', fontWeight: '600', color: '#3d3d3d' },
  serviceCardActions: { display: 'flex', alignItems: 'center', gap: '12px' },
  serviceCardBody: { padding: '20px' },
  addServiceBtn: { padding: '8px 16px', backgroundColor: '#fce4ec', color: '#E91E8C', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  deleteServiceBtn: { padding: '6px 12px', backgroundColor: '#fff5f5', color: '#e53935', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
  toggleIcon: { fontSize: '12px', color: '#888' },
  autoCalcBox: { display: 'flex', gap: '16px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  autoCalcItem: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '130px' },
  autoCalcLabel: { fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase' },
  autoCalcValue: { fontSize: '15px', fontWeight: '700', color: '#3d3d3d' },
  uploadBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: '2px dashed', borderRadius: '10px', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' },
  uploadIcon: { fontSize: '32px' },
  uploadText: { fontSize: '14px', color: '#555', fontWeight: '500' },
  uploadHint: { fontSize: '12px', color: '#aaa' },
  errorBox: { padding: '14px 16px', backgroundColor: '#ffebee', borderRadius: '8px', color: '#c62828', fontSize: '14px', marginBottom: '16px' },
  submitRow: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' },
  cancelBtn: { padding: '12px 24px', backgroundColor: '#fff', color: '#3d3d3d', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  submitBtn: { padding: '12px 32px', backgroundColor: '#E91E8C', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }
}

export default BCFormPage