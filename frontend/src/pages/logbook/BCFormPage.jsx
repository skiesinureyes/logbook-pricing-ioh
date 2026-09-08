// import { useState, useEffect } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import businessCaseService from '../../services/businessCaseService'
// import masterDataService from '../../services/masterDataService'

// // ── helpers ───────────────────────────────────────────────────────────────────
// const formatIDR = (val) => {
//   if (!val && val !== 0) return ''
//   return Number(String(val).replace(/\D/g, '')).toLocaleString('id-ID')
// }
// const parseIDR = (val) => {
//   if (!val) return ''
//   return String(val).replace(/\D/g, '')
// }
// const sanitizeDate = (val) => {
//   if (!val || val === '' || val === 'Invalid date') return null
//   return val
// }
// const getLocalToday = () => {
//   const now = new Date()
//   const offset = now.getTimezoneOffset()
//   const local = new Date(now.getTime() - offset * 60000)
//   return local.toISOString().split('T')[0]
// }
// const formatDisplayDate = (dateStr) => {
//   if (!dateStr) return '-'
//   const [y, m, d] = dateStr.split('-')
//   return `${d}/${m}/${y}`
// }
// const formatDisplayDateFromISO = (isoStr) => {
//   if (!isoStr) return '-'
//   const d = new Date(isoStr)
//   return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
// }

// // ── constants ──────────────────────────────────────────────────────────────────
// const BC_TYPES = ['Non-BC', 'BC-CPB', 'BC']
// const PROJECT_TYPES = ['Non-Tender', 'Tender']
// const ACTIVITY_TYPES = ['BAU', 'Non BAU']
// const PROJECT_STATUSES = ['On Progress', 'Win', 'Lost', 'Drop Exp', 'Drop Sls', 'Double', 'Cancel']
// const CONTRACT_TYPES = ['Existing', 'New']
// const ACTIVATION_TYPES = ['New', 'Additional', 'Renewal', 'Upgrade', 'Relocated', 'Downgrade', 'Reconfiguration']
// const CONTRACT_PERIODS = ['1', '12', '24', '36', '48', '60', 'Other']
// const LOCATIONS = ['Jawa-Bali', 'Kalimantan', 'Sulawesi', 'Sumatera']
// const LINES_OF_BUSINESS = [
//   'Agriculture, Forestry Management', 'Agriculture, Livestock and Fisheries',
//   'Hunting/Wildlife Conservation', 'Business Services', 'Communication',
//   'Technology', 'Education Services', 'Mining & Quarrying',
//   'Mining, Oil & Gas Support Services', 'Oil & Gas', 'Public Utilities',
//   'Banking', 'Non - Bank Financial', 'Government', 'Health Services',
//   'Hotel', 'Restaurant', 'Broadcaster', 'Media', 'Non Profit Organization',
//   'Building Service,Architect & Eng.', 'Construction',
//   'Engineering, Procurement & Construction', 'Property Developer',
//   'Real Estate', 'Distribution', 'Logistic', 'Manufacturing',
//   'Trading and Retailer', 'Transport Service', 'Transportation'
// ]
// const PPR_STATUSES = ['On Progress', 'Done']
// const SERVICE_SEGMENTS = ['TelCo', 'TechCo']
// const LOST_REASONS = ['Pricing', 'Undisclosed', 'Technical']

// const currentYear = new Date().getFullYear()
// const YEARS = Array.from({ length: currentYear - 1999 }, (_, i) => String(currentYear - i))

// const emptyService = {
//   serviceSegment: '', serviceId: '', subServiceId: '',
//   infraType: '', infraNotes: '',
//   totalUnit: '', detailService: '',
//   serviceLocation: '', locationA: '', locationB: '',
//   totalBwPerMbps: '', pricePerMbps: '',
//   open: true
// }

// const emptyForm = {
//   bcTitle: '', bcType: '', projectType: '', activityType: '', projectStatus: '', followUpNotes: '',
//   esReqDate: '', cfDate: '', cpbDate: '',
//   sfaId: '', opportunityId: '', salesOrder: '', quote: '',
//   custName: '', custJoinYear: '', lineOfBusiness: '',
//   contractType: '', activationType: '', contractPeriod: '', rfsDate: '',
//   salesTeamId: '', pricingTeamId: '', preSalesTeamId: '',
//   pprStatus: '',
//   otc: '', mrc: '',
//   tcv: '', totalNetRev: '', portOnlyRev: '', y1RevCalendar: '', y1RevYearly: '',
//   y1CoS: '', totalCoS: '',
//   networkOpex: '', directOpex: '', otherOpexDirect: '', indirectOpex: '',
//   financingCost: '', marketingCost: '', riskCost: '',
//   b2bDirectOverhead: '', iohOverheadAllocation: '', contributionMargin: '',
//   totalCapex: '',
//   netProfit: '', totalFcf: '', totalAccFcf: '',
//   wacc: '', npv: '', irr: '', payback: '',
//   tenderWinnerName: '', tenderWinningPrice: '', tenderLostReason: '', tenderReason: '',
//   serviceDetails: [{ ...emptyService }]
// }

// const AUTOSAVE_KEY = 'bc_form_autosave'

// // ── Validation ────────────────────────────────────────────────────────────────
// const validateForm = (form, projectStatusTouched) => {
//   const errors = {}

//   // Section 1: BC Details
//   if (!form.bcTitle?.trim()) errors.bcTitle = 'Judul BC wajib diisi'
//   if (!form.bcType) errors.bcType = 'BC Type wajib dipilih'
//   if (!form.projectType) errors.projectType = 'Project Type wajib dipilih'
//   if (!form.activityType) errors.activityType = 'Activity Type wajib dipilih'
//   if (!form.projectStatus) errors.projectStatus = 'Project Status wajib dipilih'
//   if (projectStatusTouched && !form.followUpNotes?.trim()) errors.followUpNotes = 'Follow Up Notes wajib diisi saat memperbarui Project Status'
//   if (!form.esReqDate) errors.esReqDate = 'ES Request Date wajib diisi'
//   if (!form.cfDate) errors.cfDate = 'CF Date wajib diisi'
//   if (form.bcType === 'BC-CPB' && !form.cpbDate) errors.cpbDate = 'CPB Date wajib diisi untuk BC Type BC-CPB'

//   // Validasi logika tanggal
//   if (form.esReqDate && form.cfDate && form.cfDate < form.esReqDate) {
//     errors.cfDate = 'CF Date tidak boleh sebelum ES Request Date'
//   }
//   if (form.cfDate && form.rfsDate && form.rfsDate < form.cfDate) {
//     errors.rfsDate = 'RFS Date tidak boleh sebelum CF Date'
//   }

//   if (!form.custName?.trim()) errors.custName = 'Customer Name wajib diisi'
//   if (!form.custJoinYear) errors.custJoinYear = 'Customer Join Year wajib dipilih'
//   if (!form.lineOfBusiness) errors.lineOfBusiness = 'Line of Business wajib dipilih'
//   if (!form.contractType) errors.contractType = 'Contract Type wajib dipilih'
//   if (!form.activationType) errors.activationType = 'Activation Type wajib dipilih'
//   if (!form.contractPeriod) errors.contractPeriod = 'Contract Period wajib dipilih'
//   if (!form.rfsDate) errors.rfsDate = errors.rfsDate || 'RFS Date wajib diisi'

//   // Section 2: Stakeholders
//   if (!form.salesTeamId) errors.salesTeamId = 'Sales Name wajib dipilih'
//   if (!form.preSalesTeamId) errors.preSalesTeamId = 'Pre-Sales Team wajib dipilih'
//   if (!form.pricingTeamId) errors.pricingTeamId = 'Pricing Team wajib dipilih'

//   // Section 3: Service Details
//   if (!form.serviceDetails || form.serviceDetails.length === 0) {
//     errors.serviceDetails = 'Minimal satu service harus ditambahkan'
//   } else {
//     const serviceErrors = []
//     form.serviceDetails.forEach((sd, i) => {
//       const sdErr = {}
//       if (!sd.serviceSegment) sdErr.serviceSegment = 'Service Segment wajib dipilih'
//       if (!sd.serviceId) sdErr.serviceId = 'Service Type wajib dipilih'
//       if (!sd.subServiceId) sdErr.subServiceId = 'Sub-Service Type wajib dipilih'

//       // Validasi lokasi
//       if (sd.subServiceId) {
//         const isMPLS = sd.infraType === 'MPLS' // fallback, bisa disesuaikan
//         if (!isMPLS && !sd.serviceLocation) sdErr.serviceLocation = 'Service Location wajib dipilih'
//         if (isMPLS && !sd.locationA) sdErr.locationA = 'Location A wajib dipilih'
//       }

//       if (Object.keys(sdErr).length > 0) serviceErrors[i] = sdErr
//     })
//     if (serviceErrors.length > 0) errors.serviceErrors = serviceErrors
//   }

//   // Section 4: Tender Details
//   if (form.projectType === 'Tender') {
//     if (!form.tenderWinnerName?.trim()) errors.tenderWinnerName = 'Winner Name wajib diisi'
//     if (!form.tenderWinningPrice || Number(form.tenderWinningPrice) <= 0) errors.tenderWinningPrice = 'Winning Price wajib diisi dan lebih dari 0'
//     if (!form.tenderReason?.trim()) errors.tenderReason = 'Reason wajib diisi'
//   }

//   // Section 5: Financial — validasi tidak boleh negatif
//   const financialFields = [
//     { key: 'otc', label: 'OTC' }, { key: 'mrc', label: 'MRC' },
//     { key: 'tcv', label: 'TCV' }, { key: 'totalNetRev', label: 'Total Net Revenue' },
//     { key: 'portOnlyRev', label: 'Port Only Revenue' },
//     { key: 'y1RevCalendar', label: 'Y1 Revenue Calendar' }, { key: 'y1RevYearly', label: 'Y1 Revenue Yearly' },
//     { key: 'y1CoS', label: 'Y1 CoS' }, { key: 'totalCoS', label: 'Total CoS' },
//     { key: 'networkOpex', label: 'Network OPEX' }, { key: 'directOpex', label: 'Direct OPEX' },
//     { key: 'otherOpexDirect', label: 'Other Direct OPEX' }, { key: 'indirectOpex', label: 'Indirect OPEX' },
//     { key: 'financingCost', label: 'Financing Cost' }, { key: 'marketingCost', label: 'Marketing Cost' },
//     { key: 'riskCost', label: 'Risk Cost' }, { key: 'b2bDirectOverhead', label: 'B2B Direct Overhead' },
//     { key: 'iohOverheadAllocation', label: 'IOH Overhead' }, { key: 'contributionMargin', label: 'Contribution Margin' },
//     { key: 'totalCapex', label: 'Total CAPEX' }, { key: 'netProfit', label: 'Net Profit' },
//     { key: 'totalFcf', label: 'Total FCF' }, { key: 'totalAccFcf', label: 'Total Accumulated FCF' },
//     { key: 'npv', label: 'NPV' }
//   ]
//   financialFields.forEach(({ key, label }) => {
//     const raw = parseIDR(form[key])
//     if (raw && Number(raw) < 0) errors[key] = `${label} tidak boleh bernilai negatif`
//   })

//   const percentFields = [
//     { key: 'wacc', label: 'WACC' }, { key: 'irr', label: 'IRR' },
//     { key: 'payback', label: 'Payback Period' }
//   ]
//   percentFields.forEach(({ key, label }) => {
//     if (form[key] !== '' && form[key] !== null && form[key] !== undefined) {
//       if (Number(form[key]) < 0) errors[key] = `${label} tidak boleh bernilai negatif`
//     }
//   })

//   return errors
// }

// // ── Error Field Helper ────────────────────────────────────────────────────────
// const ErrorMsg = ({ msg }) => msg
//   ? <span style={{ fontSize: '12px', color: '#e53935', marginTop: '4px' }}>{msg}</span>
//   : null

// const inputStyle = (hasError, extra = {}) => ({
//   padding: '10px 14px',
//   borderRadius: '8px',
//   border: `1.5px solid ${hasError ? '#e53935' : '#e0e0e0'}`,
//   fontSize: '14px',
//   color: '#3d3d3d',
//   backgroundColor: hasError ? '#fff5f5' : '#fafafa',
//   outline: 'none',
//   width: '100%',
//   boxSizing: 'border-box',
//   fontFamily: 'inherit',
//   ...extra
// })

// const BCFormPage = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const isEdit = Boolean(id)

//   const [form, setForm] = useState(() => {
//     if (!isEdit) {
//       const saved = localStorage.getItem(AUTOSAVE_KEY)
//       if (saved) { try { return JSON.parse(saved) } catch { return emptyForm } }
//     }
//     return emptyForm
//   })

//   const [file, setFile] = useState(null)
//   const [existingFile, setExistingFile] = useState(null)
//   const [existingLastFollowUp, setExistingLastFollowUp] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [pageLoading, setPageLoading] = useState(isEdit)
//   const [errors, setErrors] = useState({})
//   const [submitAttempted, setSubmitAttempted] = useState(false)
//   const [isDirty, setIsDirty] = useState(false)
//   const [projectStatusTouched, setProjectStatusTouched] = useState(false)

//   // Master data
//   const [salesTeams, setSalesTeams] = useState([])
//   const [pricingTeams, setPricingTeams] = useState([])
//   const [preSalesTeams, setPreSalesTeams] = useState([])
//   const [services, setServices] = useState([])
//   const [subServices, setSubServices] = useState([])
//   const [custNameOptions, setCustNameOptions] = useState([])
//   const [custJoinYearMap, setCustJoinYearMap] = useState({})
//   const [custLobMap, setCustLobMap] = useState({})
//   const [custNameInput, setCustNameInput] = useState('')
//   const [showCustDropdown, setShowCustDropdown] = useState(false)
//   const [selectedSalesInfo, setSelectedSalesInfo] = useState(null)

//   // Auto-calculated
//   const [pprEligibility, setPprEligibility] = useState('')
//   const [ebitda, setEbitda] = useState(0)
//   const [ebitdaMargin, setEbitdaMargin] = useState(0)
//   const [ebitdaMarginTier, setEbitdaMarginTier] = useState('')
//   const [totalOpex, setTotalOpex] = useState(0)

//   useEffect(() => { fetchMasterData(); if (isEdit) fetchBC() }, [])
//   useEffect(() => { if (!isEdit && isDirty) localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(form)) }, [form, isDirty, isEdit])
//   useEffect(() => { calculateAutoFields() }, [
//     form.tcv, form.totalCoS, form.directOpex, form.otherOpexDirect,
//     form.indirectOpex, form.totalNetRev, form.y1RevYearly, form.totalCapex
//   ])
//   useEffect(() => {
//     if (form.salesTeamId) {
//       const st = salesTeams.find(s => String(s.id) === String(form.salesTeamId))
//       setSelectedSalesInfo(st || null)
//     } else setSelectedSalesInfo(null)
//   }, [form.salesTeamId, salesTeams])
//   useEffect(() => {
//     const handleBeforeUnload = (e) => { if (isDirty) { e.preventDefault(); e.returnValue = '' } }
//     window.addEventListener('beforeunload', handleBeforeUnload)
//     return () => window.removeEventListener('beforeunload', handleBeforeUnload)
//   }, [isDirty])

//   // Re-validate on change jika sudah pernah submit
//   useEffect(() => {
//     if (submitAttempted) {
//       const errs = validateForm(form, projectStatusTouched)
//       setErrors(errs)
//     }
//   }, [form, projectStatusTouched, submitAttempted])

//   const fetchMasterData = async () => {
//     try {
//       const [st, pt, pst, sv, ss] = await Promise.all([
//         masterDataService.getSalesTeams(), masterDataService.getPricingTeams(),
//         masterDataService.getPreSalesTeams(), masterDataService.getServices(),
//         masterDataService.getSubServices(),
//       ])
//       setSalesTeams(st.data.data); setPricingTeams(pt.data.data)
//       setPreSalesTeams(pst.data.data); setServices(sv.data.data); setSubServices(ss.data.data)

//       const cn = await businessCaseService.getCustNames('')
//       setCustNameOptions(cn.data.data || [])

//       const bcRes = await businessCaseService.getAll({ limit: 1000 })
//       const yearMap = {}, lobMap = {}
//       bcRes.data.data.forEach(bc => {
//         if (bc.custName && bc.custJoinYear) yearMap[bc.custName] = bc.custJoinYear
//         if (bc.custName && bc.lineOfBusiness) lobMap[bc.custName] = bc.lineOfBusiness
//       })
//       setCustJoinYearMap(yearMap); setCustLobMap(lobMap)
//     } catch (err) { console.error(err) }
//   }

//   const fetchBC = async () => {
//     try {
//       const res = await businessCaseService.getById(id)
//       const bc = res.data.data
//       setExistingLastFollowUp(bc.lastFollowUpDate)
//       const mapped = {
//         bcTitle: bc.bcTitle || '', bcType: bc.bcType || '',
//         projectType: bc.projectType || '', activityType: bc.activityType || '',
//         projectStatus: bc.projectStatus || '', followUpNotes: bc.followUpNotes || '',
//         esReqDate: bc.esReqDate || '', cfDate: bc.cfDate || '', cpbDate: bc.cpbDate || '',
//         sfaId: bc.sfalId || '', opportunityId: bc.opportunityId || '',
//         salesOrder: bc.salesOrder || '', quote: bc.quote || '',
//         custName: bc.custName || '', custJoinYear: bc.custJoinYear ? String(bc.custJoinYear) : '',
//         lineOfBusiness: bc.lineOfBusiness || '',
//         contractType: bc.contractType || '', activationType: bc.activationType || '',
//         contractPeriod: bc.contractPeriod || '', rfsDate: bc.rfsDate || '',
//         salesTeamId: String(bc.SalesTeams?.[0]?.id || ''),
//         pricingTeamId: String(bc.pricingTeamId || ''),
//         preSalesTeamId: String(bc.preSalesTeamId || ''),
//         pprStatus: bc.pprStatus || '',
//         otc: bc.otc || '', mrc: bc.mrc || '',
//         tcv: bc.tcv || '', totalNetRev: bc.totalNetRev || '',
//         portOnlyRev: bc.portOnlyRev || '', y1RevCalendar: bc.y1RevCalendar || '',
//         y1RevYearly: bc.y1RevYearly || '', y1CoS: bc.y1CoS || '', totalCoS: bc.totalCoS || '',
//         networkOpex: bc.networkOpex || '', directOpex: bc.directOpex || '',
//         otherOpexDirect: bc.otherOpexDirect || '', indirectOpex: bc.indirectOpex || '',
//         financingCost: bc.financingCost || '', marketingCost: bc.marketingCost || '',
//         riskCost: bc.riskCost || '', b2bDirectOverhead: bc.b2bDirectOverhead || '',
//         iohOverheadAllocation: bc.iohOverheadAllocation || '',
//         contributionMargin: bc.contributionMargin || '',
//         totalCapex: bc.totalCapex || '', netProfit: bc.netProfit || '',
//         totalFcf: bc.totalFcf || '', totalAccFcf: bc.totalAccFcf || '',
//         wacc: bc.wacc || '', npv: bc.npv || '', irr: bc.irr || '', payback: bc.payback || '',
//         tenderWinnerName: bc.TenderDetail?.winnerName || '',
//         tenderWinningPrice: bc.TenderDetail?.winningPrice || '',
//         tenderLostReason: bc.TenderDetail?.lostReason || '',
//         tenderReason: bc.TenderDetail?.reason || '',
//         serviceDetails: bc.ServiceDetails?.length > 0
//           ? bc.ServiceDetails.map(sd => ({
//               serviceSegment: sd.serviceSegment || sd.Service?.serviceCategory || '',
//               serviceId: String(sd.serviceId || ''),
//               subServiceId: String(sd.subServiceId || ''),
//               infraType: sd.infraType || '',
//               infraNotes: sd.infraNotes || '',
//               totalUnit: sd.totalUnit || '',
//               detailService: sd.detailService || '',
//               serviceLocation: sd.serviceLocation || '',
//               locationA: sd.locationA || '',
//               locationB: sd.locationB || '',
//               totalBwPerMbps: sd.totalBwPerMbps || '',
//               pricePerMbps: sd.pricePerMbps || '',
//               open: true
//             }))
//           : [{ ...emptyService }]
//       }
//       setForm(mapped)
//       setCustNameInput(bc.custName || '')
//       if (bc.fileName) setExistingFile(bc.fileName)
//     } catch (err) { console.error(err) }
//     finally { setPageLoading(false) }
//   }

//   const calculateAutoFields = () => {
//     const tcv = Number(parseIDR(form.tcv)) || 0
//     const totalCoS = Number(parseIDR(form.totalCoS)) || 0
//     const directOpex = Number(parseIDR(form.directOpex)) || 0
//     const otherOpexDirect = Number(parseIDR(form.otherOpexDirect)) || 0
//     const indirectOpex = Number(parseIDR(form.indirectOpex)) || 0
//     const y1RevYearly = Number(parseIDR(form.y1RevYearly)) || 0
//     const totalCapex = Number(parseIDR(form.totalCapex)) || 0

//     const opex = totalCoS + directOpex + otherOpexDirect + indirectOpex
//     setTotalOpex(opex)
//     setPprEligibility(
//       y1RevYearly > 1000000000 && totalCoS > 1000000000 && totalCapex > 1000000000
//         ? 'Eligible' : 'Not Eligible'
//     )
//     const eb = tcv - opex
//     setEbitda(eb)
//     const margin = tcv > 0 ? (eb / tcv) * 100 : 0
//     setEbitdaMargin(margin)
//     if (margin < 20) setEbitdaMarginTier('< 20%')
//     else if (margin < 33) setEbitdaMarginTier('20 - 33%')
//     else if (margin < 42.5) setEbitdaMarginTier('33 - 42.5%')
//     else setEbitdaMarginTier('> 42.5%')
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setForm(prev => ({ ...prev, [name]: value }))
//     setIsDirty(true)
//   }

//   const handleProjectStatusChange = (e) => {
//     setForm(prev => ({ ...prev, projectStatus: e.target.value, followUpNotes: '' }))
//     setProjectStatusTouched(true)
//     setIsDirty(true)
//   }

//   const handleCustNameInput = (e) => {
//     const val = e.target.value
//     setCustNameInput(val)
//     setForm(prev => ({
//       ...prev, custName: val,
//       custJoinYear: custJoinYearMap[val] ? String(custJoinYearMap[val]) : prev.custJoinYear,
//       lineOfBusiness: custLobMap[val] || prev.lineOfBusiness
//     }))
//     setShowCustDropdown(true)
//     setIsDirty(true)
//   }

//   const handleCustNameSelect = (name) => {
//     setForm(prev => ({
//       ...prev, custName: name,
//       custJoinYear: custJoinYearMap[name] ? String(custJoinYearMap[name]) : prev.custJoinYear,
//       lineOfBusiness: custLobMap[name] || prev.lineOfBusiness
//     }))
//     setCustNameInput(name)
//     setShowCustDropdown(false)
//     setIsDirty(true)
//   }

//   const getServicesBySegment = (segment) => {
//     if (!segment) return []
//     return services.filter(s => s.serviceCategory === segment)
//   }

//   const getFilteredSubServices = (serviceId) => {
//     if (!serviceId) return []
//     return subServices.filter(ss => String(ss.serviceId) === String(serviceId))
//   }

//   const getSelectedSubServiceName = (subServiceId) => {
//     return subServices.find(ss => String(ss.id) === String(subServiceId))?.name || ''
//   }

//   const handleServiceChange = (index, field, value) => {
//     setForm(prev => {
//       const updated = [...prev.serviceDetails]
//       updated[index] = { ...updated[index], [field]: value }
//       if (field === 'serviceSegment') {
//         updated[index].serviceId = ''
//         updated[index].subServiceId = ''
//         updated[index].infraType = ''
//         updated[index].infraNotes = ''
//       }
//       if (field === 'serviceId') {
//         updated[index].subServiceId = ''
//         updated[index].infraType = ''
//         updated[index].infraNotes = ''
//       }
//       return { ...prev, serviceDetails: updated }
//     })
//     setIsDirty(true)
//   }

//   const addService = () => {
//     setForm(prev => ({ ...prev, serviceDetails: [...prev.serviceDetails, { ...emptyService }] }))
//     setIsDirty(true)
//   }

//   const removeService = (index) => {
//     setForm(prev => ({ ...prev, serviceDetails: prev.serviceDetails.filter((_, i) => i !== index) }))
//     setIsDirty(true)
//   }

//   const toggleService = (index) => {
//     setForm(prev => {
//       const updated = [...prev.serviceDetails]
//       updated[index] = { ...updated[index], open: !updated[index].open }
//       return { ...prev, serviceDetails: updated }
//     })
//   }

//   const handleBack = () => {
//     if (isDirty) {
//       if (window.confirm('Anda yakin tidak ingin melanjutkan? Data yang belum disimpan akan hilang.')) {
//         if (!isEdit) localStorage.removeItem(AUTOSAVE_KEY)
//         navigate('/logbook')
//       }
//     } else navigate('/logbook')
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setSubmitAttempted(true)

//     const errs = validateForm(form, projectStatusTouched)
//     setErrors(errs)

//     const hasErrors = Object.keys(errs).length > 0
//     if (hasErrors) {
//       // Scroll ke error pertama
//       const firstErrEl = document.querySelector('[data-error="true"]')
//       if (firstErrEl) firstErrEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
//       return
//     }

//     setLoading(true)
//     try {
//       const formData = new FormData()
//       const strFields = [
//         'bcTitle', 'bcType', 'projectType', 'activityType', 'projectStatus', 'followUpNotes',
//         'esReqDate', 'cfDate', 'opportunityId', 'salesOrder', 'quote',
//         'custName', 'lineOfBusiness', 'contractType', 'activationType',
//         'contractPeriod', 'rfsDate', 'pricingTeamId', 'preSalesTeamId', 'pprStatus',
//         'wacc', 'irr', 'payback'
//       ]
//       strFields.forEach(f => formData.append(f, form[f] || ''))
//       formData.append('sfalId', form.sfaId || '')
//       formData.append('cpbDate', sanitizeDate(form.cpbDate) || '')
//       formData.append('custJoinYear', form.custJoinYear || '')
//       formData.append('updateFollowUpDate', isEdit ? (projectStatusTouched ? 'true' : 'false') : 'true')

//       const idrFields = [
//         'otc', 'mrc', 'tcv', 'totalNetRev', 'portOnlyRev', 'y1RevCalendar', 'y1RevYearly',
//         'y1CoS', 'totalCoS', 'networkOpex', 'directOpex', 'otherOpexDirect', 'indirectOpex',
//         'financingCost', 'marketingCost', 'riskCost', 'b2bDirectOverhead',
//         'iohOverheadAllocation', 'contributionMargin', 'totalCapex',
//         'netProfit', 'totalFcf', 'totalAccFcf', 'npv'
//       ]
//       idrFields.forEach(f => formData.append(f, parseIDR(form[f]) || ''))

//       if (form.salesTeamId) formData.append('salesTeamIds[]', form.salesTeamId)

//       if (form.projectType === 'Tender') {
//         formData.append('tenderDetail[winnerName]', form.tenderWinnerName)
//         formData.append('tenderDetail[winningPrice]', parseIDR(form.tenderWinningPrice))
//         formData.append('tenderDetail[lostReason]', form.tenderLostReason || '')
//         formData.append('tenderDetail[reason]', form.tenderReason)
//       }

//       form.serviceDetails.forEach((sd, i) => {
//         formData.append(`serviceDetails[${i}][serviceId]`, sd.serviceId)
//         formData.append(`serviceDetails[${i}][subServiceId]`, sd.subServiceId || '')
//         formData.append(`serviceDetails[${i}][serviceSegment]`, sd.serviceSegment || '')
//         formData.append(`serviceDetails[${i}][totalUnit]`, sd.totalUnit || '')
//         formData.append(`serviceDetails[${i}][detailService]`, sd.detailService || '')
//         formData.append(`serviceDetails[${i}][serviceLocation]`, sd.serviceLocation || '')
//         formData.append(`serviceDetails[${i}][locationA]`, sd.locationA || '')
//         formData.append(`serviceDetails[${i}][locationB]`, sd.locationB || '')
//         formData.append(`serviceDetails[${i}][totalBwPerMbps]`, sd.totalBwPerMbps || '')
//         formData.append(`serviceDetails[${i}][pricePerMbps]`, parseIDR(sd.pricePerMbps) || '')
//         formData.append(`serviceDetails[${i}][infraType]`, sd.infraType || '')
//         formData.append(`serviceDetails[${i}][infraNotes]`, sd.infraNotes || '')
//       })

//       if (file) formData.append('file', file)

//       if (isEdit) await businessCaseService.update(id, formData)
//       else { await businessCaseService.create(formData); localStorage.removeItem(AUTOSAVE_KEY) }

//       navigate('/logbook')
//     } catch (err) {
//       setErrors({ _server: err.response?.data?.message || 'Terjadi kesalahan saat menyimpan' })
//     } finally { setLoading(false) }
//   }

//   if (pageLoading) return <div style={styles.loading}>Memuat data...</div>

//   const filteredCustNames = custNameOptions.filter(n => n.toLowerCase().includes(custNameInput.toLowerCase()))
//   const hasFile = file || existingFile
//   const lastFollowUpDisplay = isEdit
//     ? (projectStatusTouched ? formatDisplayDate(getLocalToday()) + ' (akan diperbarui)' : formatDisplayDateFromISO(existingLastFollowUp))
//     : formatDisplayDate(getLocalToday())
//   const ebitdaTierColor = {
//     '< 20%': '#e53935', '20 - 33%': '#e65100',
//     '33 - 42.5%': '#f9a825', '> 42.5%': '#2e7d32'
//   }[ebitdaMarginTier] || '#555'

//   const totalErrors = Object.keys(errors).length
//   const hasServiceErrors = errors.serviceErrors?.some(Boolean)

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <div>
//           <h1 style={styles.title}>{isEdit ? 'Edit Business Case' : 'Tambah Business Case'}</h1>
//           <p style={styles.subtitle}>{isEdit ? 'Edit data Business Case' : 'Isi formulir untuk menambahkan Business Case baru'}</p>
//         </div>
//         <button type='button' onClick={handleBack} style={styles.backButton}>← Kembali</button>
//       </div>

//       {/* Error summary banner */}
//       {submitAttempted && totalErrors > 0 && (
//         <div style={styles.errorBanner}>
//           <strong>⚠ Terdapat {totalErrors} kesalahan pada formulir.</strong> Periksa field yang ditandai merah sebelum menyimpan.
//         </div>
//       )}

//       <form onSubmit={handleSubmit} noValidate>

//         {/* ── SECTION 1: BC Details ── */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>BC Details</h2>

//           {/* BC Title */}
//           <div style={{ ...styles.formGroup, marginBottom: '16px' }} data-error={!!errors.bcTitle}>
//             <label style={styles.label}>BC Title *</label>
//             <input name='bcTitle' value={form.bcTitle} onChange={handleChange}
//               style={inputStyle(!!errors.bcTitle)} placeholder='Masukkan judul Business Case' />
//             <ErrorMsg msg={errors.bcTitle} />
//           </div>

//           {/* BC Type, Project Type, Activity Type */}
//           <div style={{ ...styles.grid3, marginBottom: '16px' }}>
//             <div style={styles.formGroup} data-error={!!errors.bcType}>
//               <label style={styles.label}>BC Type *</label>
//               <select name='bcType' value={form.bcType} onChange={handleChange} style={inputStyle(!!errors.bcType)}>
//                 <option value=''>-- Pilih --</option>
//                 {BC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
//               </select>
//               <ErrorMsg msg={errors.bcType} />
//             </div>
//             <div style={styles.formGroup} data-error={!!errors.projectType}>
//               <label style={styles.label}>Project Type *</label>
//               <select name='projectType' value={form.projectType} onChange={handleChange} style={inputStyle(!!errors.projectType)}>
//                 <option value=''>-- Pilih --</option>
//                 {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
//               </select>
//               <ErrorMsg msg={errors.projectType} />
//             </div>
//             <div style={styles.formGroup} data-error={!!errors.activityType}>
//               <label style={styles.label}>Activity Type *</label>
//               <select name='activityType' value={form.activityType} onChange={handleChange} style={inputStyle(!!errors.activityType)}>
//                 <option value=''>-- Pilih --</option>
//                 {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
//               </select>
//               <ErrorMsg msg={errors.activityType} />
//             </div>
//           </div>

//           {/* Project Status, Last Follow Up */}
//           <div style={{ ...styles.grid2, marginBottom: '16px' }}>
//             <div style={styles.formGroup} data-error={!!errors.projectStatus}>
//               <label style={styles.label}>Project Status *</label>
//               <select name='projectStatus' value={form.projectStatus}
//                 onChange={handleProjectStatusChange}
//                 style={inputStyle(!!errors.projectStatus, { borderColor: projectStatusTouched && !errors.projectStatus ? '#E91E8C' : undefined })}>
//                 <option value=''>-- Pilih --</option>
//                 {PROJECT_STATUSES.map(t => <option key={t} value={t}>{t}</option>)}
//               </select>
//               <ErrorMsg msg={errors.projectStatus} />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Last Follow Up Date</label>
//               <input value={lastFollowUpDisplay}
//                 style={inputStyle(false, { backgroundColor: '#f0f0f0', color: projectStatusTouched ? '#E91E8C' : '#666' })}
//                 readOnly />
//             </div>
//           </div>

//           {/* Follow Up Notes */}
//           {(projectStatusTouched || form.followUpNotes || isEdit) && (
//             <div style={{ ...styles.formGroup, marginBottom: '16px' }} data-error={!!errors.followUpNotes}>
//               <label style={styles.label}>
//                 Follow Up Notes *
//                 <span style={{ fontWeight: '400', color: '#888', marginLeft: '6px', fontSize: '12px' }}>
//                   (wajib diisi saat memperbarui Project Status)
//                 </span>
//               </label>
//               <textarea name='followUpNotes' value={form.followUpNotes} onChange={handleChange}
//                 style={inputStyle(!!errors.followUpNotes, { minHeight: '80px', resize: 'vertical' })}
//                 placeholder='Tuliskan catatan tindak lanjut...' />
//               <ErrorMsg msg={errors.followUpNotes} />
//             </div>
//           )}

//           {/* ES Req Date, CF Date, CPB Date */}
//           <div style={{ ...styles.grid3, marginBottom: '16px' }}>
//             <div style={styles.formGroup} data-error={!!errors.esReqDate}>
//               <label style={styles.label}>ES Request Date *</label>
//               <input name='esReqDate' type='date' value={form.esReqDate} onChange={handleChange} style={inputStyle(!!errors.esReqDate)} />
//               <ErrorMsg msg={errors.esReqDate} />
//             </div>
//             <div style={styles.formGroup} data-error={!!errors.cfDate}>
//               <label style={styles.label}>CF Date *</label>
//               <input name='cfDate' type='date' value={form.cfDate} onChange={handleChange} style={inputStyle(!!errors.cfDate)} />
//               <ErrorMsg msg={errors.cfDate} />
//             </div>
//             {form.bcType === 'BC-CPB' && (
//               <div style={styles.formGroup} data-error={!!errors.cpbDate}>
//                 <label style={styles.label}>CPB Date *</label>
//                 <input name='cpbDate' type='date' value={form.cpbDate} onChange={handleChange} style={inputStyle(!!errors.cpbDate)} />
//                 <ErrorMsg msg={errors.cpbDate} />
//               </div>
//             )}
//           </div>

//           {/* SFA ID, Opportunity ID, Sales Order, Quote */}
//           <div style={{ ...styles.grid4, marginBottom: '16px' }}>
//             {[
//               { name: 'sfaId', label: 'SFA ID', placeholder: 'SFA ID' },
//               { name: 'opportunityId', label: 'Opportunity ID', placeholder: 'Opportunity ID' },
//               { name: 'salesOrder', label: 'Sales Order', placeholder: 'Sales Order' },
//               { name: 'quote', label: 'Quote', placeholder: 'Quote' }
//             ].map(f => (
//               <div key={f.name} style={styles.formGroup}>
//                 <label style={styles.label}>{f.label}</label>
//                 <input name={f.name} value={form[f.name]} onChange={handleChange} style={inputStyle(false)} placeholder={f.placeholder} />
//               </div>
//             ))}
//           </div>

//           {/* Customer Name, Customer Join Year, Line of Business */}
//           <div style={{ ...styles.grid3, marginBottom: '16px' }}>
//             <div style={{ ...styles.formGroup, position: 'relative' }} data-error={!!errors.custName}>
//               <label style={styles.label}>Customer Name *</label>
//               <input value={custNameInput} onChange={handleCustNameInput}
//                 onFocus={() => setShowCustDropdown(true)}
//                 onBlur={() => setTimeout(() => setShowCustDropdown(false), 200)}
//                 style={inputStyle(!!errors.custName)} placeholder='Ketik atau pilih nama customer' />
//               <ErrorMsg msg={errors.custName} />
//               {showCustDropdown && (
//                 <div style={styles.custDropdown}>
//                   {filteredCustNames.length > 0
//                     ? filteredCustNames.map(n => (
//                         <div key={n} style={styles.custOption} onMouseDown={() => handleCustNameSelect(n)}>{n}</div>
//                       ))
//                     : custNameInput && (
//                         <div style={styles.custNew} onMouseDown={() => handleCustNameSelect(custNameInput)}>
//                           + Tambah "{custNameInput}"
//                         </div>
//                       )
//                   }
//                 </div>
//               )}
//             </div>
//             <div style={styles.formGroup} data-error={!!errors.custJoinYear}>
//               <label style={styles.label}>Customer Join Year *</label>
//               <select name='custJoinYear' value={form.custJoinYear} onChange={handleChange} style={inputStyle(!!errors.custJoinYear)}>
//                 <option value=''>-- Pilih Tahun --</option>
//                 {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
//               </select>
//               <ErrorMsg msg={errors.custJoinYear} />
//             </div>
//             <div style={styles.formGroup} data-error={!!errors.lineOfBusiness}>
//               <label style={styles.label}>Line of Business *</label>
//               <select name='lineOfBusiness' value={form.lineOfBusiness} onChange={handleChange} style={inputStyle(!!errors.lineOfBusiness)}>
//                 <option value=''>-- Pilih --</option>
//                 {LINES_OF_BUSINESS.map(l => <option key={l} value={l}>{l}</option>)}
//               </select>
//               <ErrorMsg msg={errors.lineOfBusiness} />
//             </div>
//           </div>

//           {/* Contract Type, Activation Type, Contract Period, RFS Date */}
//           <div style={styles.grid4}>
//             <div style={styles.formGroup} data-error={!!errors.contractType}>
//               <label style={styles.label}>Contract Type *</label>
//               <select name='contractType' value={form.contractType} onChange={handleChange} style={inputStyle(!!errors.contractType)}>
//                 <option value=''>-- Pilih --</option>
//                 {CONTRACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
//               </select>
//               <ErrorMsg msg={errors.contractType} />
//             </div>
//             <div style={styles.formGroup} data-error={!!errors.activationType}>
//               <label style={styles.label}>Activation Type *</label>
//               <select name='activationType' value={form.activationType} onChange={handleChange} style={inputStyle(!!errors.activationType)}>
//                 <option value=''>-- Pilih --</option>
//                 {ACTIVATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
//               </select>
//               <ErrorMsg msg={errors.activationType} />
//             </div>
//             <div style={styles.formGroup} data-error={!!errors.contractPeriod}>
//               <label style={styles.label}>Contract Period *</label>
//               <select name='contractPeriod' value={form.contractPeriod} onChange={handleChange} style={inputStyle(!!errors.contractPeriod)}>
//                 <option value=''>-- Pilih --</option>
//                 {CONTRACT_PERIODS.map(t => <option key={t} value={t}>{t !== 'Other' ? `${t} months` : t}</option>)}
//               </select>
//               <ErrorMsg msg={errors.contractPeriod} />
//             </div>
//             <div style={styles.formGroup} data-error={!!errors.rfsDate}>
//               <label style={styles.label}>RFS Date *</label>
//               <input name='rfsDate' type='date' value={form.rfsDate} onChange={handleChange} style={inputStyle(!!errors.rfsDate)} />
//               <ErrorMsg msg={errors.rfsDate} />
//             </div>
//           </div>
//         </div>

//         {/* ── SECTION 2: Stakeholders ── */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>Stakeholders Involved</h2>
//           <div style={{ ...styles.grid3, marginBottom: selectedSalesInfo ? '16px' : '0' }}>
//             <div style={styles.formGroup} data-error={!!errors.salesTeamId}>
//               <label style={styles.label}>Sales Name *</label>
//               <select name='salesTeamId' value={form.salesTeamId} onChange={handleChange} style={inputStyle(!!errors.salesTeamId)}>
//                 <option value=''>-- Pilih Sales --</option>
//                 {salesTeams.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
//               </select>
//               <ErrorMsg msg={errors.salesTeamId} />
//             </div>
//             <div style={styles.formGroup} data-error={!!errors.preSalesTeamId}>
//               <label style={styles.label}>Pre-Sales Team *</label>
//               <select name='preSalesTeamId' value={form.preSalesTeamId} onChange={handleChange} style={inputStyle(!!errors.preSalesTeamId)}>
//                 <option value=''>-- Pilih --</option>
//                 {preSalesTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//               </select>
//               <ErrorMsg msg={errors.preSalesTeamId} />
//             </div>
//             <div style={styles.formGroup} data-error={!!errors.pricingTeamId}>
//               <label style={styles.label}>Pricing Team *</label>
//               <select name='pricingTeamId' value={form.pricingTeamId} onChange={handleChange} style={inputStyle(!!errors.pricingTeamId)}>
//                 <option value=''>-- Pilih --</option>
//                 {pricingTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//               </select>
//               <ErrorMsg msg={errors.pricingTeamId} />
//             </div>
//           </div>
//           {selectedSalesInfo && (
//             <div style={styles.autoInfoBox}>
//               <div style={styles.autoInfoGrid}>
//                 <div style={styles.autoInfoItem}>
//                   <span style={styles.autoInfoLabel}>Group</span>
//                   <span style={styles.autoInfoValue}>{selectedSalesInfo.Department?.Division?.Group?.name || '-'}</span>
//                 </div>
//                 <div style={styles.autoInfoItem}>
//                   <span style={styles.autoInfoLabel}>Division</span>
//                   <span style={styles.autoInfoValue}>{selectedSalesInfo.Department?.Division?.name || '-'}</span>
//                 </div>
//                 <div style={styles.autoInfoItem}>
//                   <span style={styles.autoInfoLabel}>Department</span>
//                   <span style={styles.autoInfoValue}>{selectedSalesInfo.Department?.name || '-'}</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── SECTION 3: Service ── */}
//         <div style={styles.section}>
//           <div style={styles.sectionHeaderRow}>
//             <h2 style={styles.sectionTitle}>Service</h2>
//             <button type='button' onClick={addService} style={styles.addServiceBtn}>+ Tambah Service</button>
//           </div>
//           {errors.serviceDetails && <div style={styles.serviceGlobalError}>{errors.serviceDetails}</div>}
//           {form.serviceDetails.map((sd, index) => {
//             const selectedService = services.find(s => String(s.id) === String(sd.serviceId))
//             const isMIDI = selectedService?.name === 'MIDI'
//             const subServiceName = getSelectedSubServiceName(sd.subServiceId)
//             const isMPLS = subServiceName === 'MPLS' || selectedService?.name === 'MPLS'
//             const filteredServices = getServicesBySegment(sd.serviceSegment)
//             const filteredSubs = getFilteredSubServices(sd.serviceId)
//             const showLocationAB = sd.subServiceId && isMPLS
//             const showServiceLocation = sd.subServiceId && !isMPLS
//             const showMidiFields = isMIDI && sd.subServiceId
//             const sdErr = errors.serviceErrors?.[index] || {}

//             return (
//               <div key={index} style={{ ...styles.serviceCard, borderColor: Object.keys(sdErr).length > 0 ? '#e53935' : '#e0e0e0' }}>
//                 <div style={styles.serviceCardHeader} onClick={() => toggleService(index)}>
//                   <span style={styles.serviceCardTitle}>
//                     Service {index + 1}
//                     {sd.serviceSegment && ` — ${sd.serviceSegment}`}
//                     {selectedService && ` › ${selectedService.name}`}
//                     {Object.keys(sdErr).length > 0 && <span style={{ color: '#e53935', marginLeft: '8px', fontSize: '12px' }}>⚠ Ada field yang belum diisi</span>}
//                   </span>
//                   <div style={styles.serviceCardActions}>
//                     {form.serviceDetails.length > 1 && (
//                       <button type='button' onClick={(e) => { e.stopPropagation(); removeService(index) }} style={styles.deleteServiceBtn}>
//                         Hapus Service
//                       </button>
//                     )}
//                     <span style={styles.toggleIcon}>{sd.open ? '▲' : '▼'}</span>
//                   </div>
//                 </div>
//                 {sd.open && (
//                   <div style={styles.serviceCardBody}>
//                     <div style={{ ...styles.grid3, marginBottom: '16px' }}>
//                       <div style={styles.formGroup} data-error={!!sdErr.serviceSegment}>
//                         <label style={styles.label}>Service Segment *</label>
//                         <select value={sd.serviceSegment}
//                           onChange={(e) => handleServiceChange(index, 'serviceSegment', e.target.value)}
//                           style={inputStyle(!!sdErr.serviceSegment)}>
//                           <option value=''>-- Pilih Segment --</option>
//                           {SERVICE_SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
//                         </select>
//                         <ErrorMsg msg={sdErr.serviceSegment} />
//                       </div>
//                       <div style={styles.formGroup} data-error={!!sdErr.serviceId}>
//                         <label style={styles.label}>Service Type *</label>
//                         <select value={sd.serviceId}
//                           onChange={(e) => handleServiceChange(index, 'serviceId', e.target.value)}
//                           style={inputStyle(!!sdErr.serviceId, { backgroundColor: !sd.serviceSegment ? '#f0f0f0' : undefined })}
//                           disabled={!sd.serviceSegment}>
//                           <option value=''>-- Pilih Service --</option>
//                           {filteredServices.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//                         </select>
//                         <ErrorMsg msg={sdErr.serviceId} />
//                       </div>
//                       <div style={styles.formGroup} data-error={!!sdErr.subServiceId}>
//                         <label style={styles.label}>Sub-Service Type *</label>
//                         <select value={sd.subServiceId}
//                           onChange={(e) => handleServiceChange(index, 'subServiceId', e.target.value)}
//                           style={inputStyle(!!sdErr.subServiceId, { backgroundColor: !sd.serviceId ? '#f0f0f0' : undefined })}
//                           disabled={!sd.serviceId}>
//                           <option value=''>-- Pilih Sub-Service --</option>
//                           {filteredSubs.map(ss => <option key={ss.id} value={ss.id}>{ss.name}</option>)}
//                         </select>
//                         <ErrorMsg msg={sdErr.subServiceId} />
//                       </div>
//                     </div>

//                     <div style={{ ...styles.grid4, marginBottom: '16px' }}>
//                       <div style={styles.formGroup}>
//                         <label style={styles.label}>Total Unit</label>
//                         <input type='number' min='0' value={sd.totalUnit}
//                           onChange={(e) => handleServiceChange(index, 'totalUnit', e.target.value)}
//                           style={inputStyle(false)} placeholder='0' />
//                       </div>
//                     </div>

//                     <div style={{ ...styles.formGroup, marginBottom: '16px' }}>
//                       <label style={styles.label}>Detail Service</label>
//                       <textarea value={sd.detailService}
//                         onChange={(e) => handleServiceChange(index, 'detailService', e.target.value)}
//                         style={inputStyle(false, { minHeight: '72px', resize: 'vertical' })}
//                         placeholder='Detail service...' />
//                     </div>

//                     {showServiceLocation && (
//                       <div style={{ ...styles.grid4, marginBottom: '16px' }}>
//                         <div style={styles.formGroup} data-error={!!sdErr.serviceLocation}>
//                           <label style={styles.label}>Service Location *</label>
//                           <select value={sd.serviceLocation}
//                             onChange={(e) => handleServiceChange(index, 'serviceLocation', e.target.value)}
//                             style={inputStyle(!!sdErr.serviceLocation)}>
//                             <option value=''>-- Pilih --</option>
//                             {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
//                           </select>
//                           <ErrorMsg msg={sdErr.serviceLocation} />
//                         </div>
//                       </div>
//                     )}

//                     {showLocationAB && (
//                       <div style={{ ...styles.grid2, marginBottom: '16px' }}>
//                         <div style={styles.formGroup} data-error={!!sdErr.locationA}>
//                           <label style={styles.label}>Location A *</label>
//                           <select value={sd.locationA}
//                             onChange={(e) => handleServiceChange(index, 'locationA', e.target.value)}
//                             style={inputStyle(!!sdErr.locationA)}>
//                             <option value=''>-- Pilih --</option>
//                             {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
//                           </select>
//                           <ErrorMsg msg={sdErr.locationA} />
//                         </div>
//                         <div style={styles.formGroup}>
//                           <label style={styles.label}>Location B</label>
//                           <select value={sd.locationB}
//                             onChange={(e) => handleServiceChange(index, 'locationB', e.target.value)}
//                             style={inputStyle(false)}>
//                             <option value=''>-- Pilih --</option>
//                             {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
//                           </select>
//                         </div>
//                       </div>
//                     )}

//                     {showMidiFields && (
//                       <div style={{ ...styles.grid2, marginBottom: '16px' }}>
//                         <div style={styles.formGroup}>
//                           <label style={styles.label}>Total Bandwidth/MBPS</label>
//                           <input type='number' min='0' value={sd.totalBwPerMbps}
//                             onChange={(e) => handleServiceChange(index, 'totalBwPerMbps', e.target.value)}
//                             style={inputStyle(false)} placeholder='0' />
//                         </div>
//                         <div style={styles.formGroup}>
//                           <label style={styles.label}>Price/MBPS</label>
//                           <div style={styles.idrWrapper}>
//                             <span style={styles.idrPrefix}>IDR</span>
//                             <input value={formatIDR(sd.pricePerMbps)}
//                               onChange={(e) => handleServiceChange(index, 'pricePerMbps', parseIDR(e.target.value))}
//                               style={inputStyle(false, { paddingLeft: '52px' })} placeholder='0' />
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )
//           })}
//         </div>

//         {/* ── SECTION 4: Tender Detail ── */}
//         {form.projectType === 'Tender' && (
//           <div style={styles.section}>
//             <h2 style={styles.sectionTitle}>Tender Details</h2>
//             <div style={{ ...styles.grid2, marginBottom: '16px' }}>
//               <div style={styles.formGroup} data-error={!!errors.tenderWinnerName}>
//                 <label style={styles.label}>Winner Name *</label>
//                 <input name='tenderWinnerName' value={form.tenderWinnerName} onChange={handleChange}
//                   style={inputStyle(!!errors.tenderWinnerName)} placeholder='Nama pemenang tender' />
//                 <ErrorMsg msg={errors.tenderWinnerName} />
//               </div>
//               <div style={styles.formGroup} data-error={!!errors.tenderWinningPrice}>
//                 <label style={styles.label}>Winning Price *</label>
//                 <div style={styles.idrWrapper}>
//                   <span style={styles.idrPrefix}>IDR</span>
//                   <input value={formatIDR(form.tenderWinningPrice)}
//                     onChange={(e) => setForm(prev => ({ ...prev, tenderWinningPrice: parseIDR(e.target.value) }))}
//                     style={inputStyle(!!errors.tenderWinningPrice, { paddingLeft: '52px' })} placeholder='0' />
//                 </div>
//                 <ErrorMsg msg={errors.tenderWinningPrice} />
//               </div>
//             </div>
//             {form.projectStatus === 'Lost' && (
//               <div style={{ ...styles.formGroup, marginBottom: '16px' }}>
//                 <label style={styles.label}>Lost Reason</label>
//                 <select name='tenderLostReason' value={form.tenderLostReason} onChange={handleChange} style={inputStyle(false)}>
//                   <option value=''>-- Pilih --</option>
//                   {LOST_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
//                 </select>
//               </div>
//             )}
//             <div style={styles.formGroup} data-error={!!errors.tenderReason}>
//               <label style={styles.label}>Reason *</label>
//               <textarea name='tenderReason' value={form.tenderReason} onChange={handleChange}
//                 style={inputStyle(!!errors.tenderReason, { minHeight: '80px', resize: 'vertical' })}
//                 placeholder='Alasan...' />
//               <ErrorMsg msg={errors.tenderReason} />
//             </div>
//           </div>
//         )}

//         {/* ── SECTION 5: Financial Projection ── */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>Financial Projection</h2>

//           <div style={styles.autoCalcBox}>
//             <div style={styles.autoCalcItem}>
//               <span style={styles.autoCalcLabel}>PPR Eligibility</span>
//               <span style={{ ...styles.autoCalcValue, color: pprEligibility === 'Eligible' ? '#2e7d32' : '#e65100' }}>{pprEligibility || '-'}</span>
//             </div>
//             <div style={styles.autoCalcItem}>
//               <span style={styles.autoCalcLabel}>EBITDA</span>
//               <span style={styles.autoCalcValue}>IDR {Number(ebitda).toLocaleString('id-ID')}</span>
//             </div>
//             <div style={styles.autoCalcItem}>
//               <span style={styles.autoCalcLabel}>EBITDA Margin</span>
//               <span style={styles.autoCalcValue}>{ebitdaMargin.toFixed(2)}%</span>
//             </div>
//             <div style={styles.autoCalcItem}>
//               <span style={styles.autoCalcLabel}>EBITDA Margin Tier</span>
//               <span style={{ ...styles.autoCalcValue, color: ebitdaTierColor, fontSize: '14px' }}>{ebitdaMarginTier || '-'}</span>
//             </div>
//             <div style={styles.autoCalcItem}>
//               <span style={styles.autoCalcLabel}>Total OPEX</span>
//               <span style={styles.autoCalcValue}>IDR {Number(totalOpex).toLocaleString('id-ID')}</span>
//             </div>
//           </div>

//           <div style={{ ...styles.formGroup, marginBottom: '20px' }}>
//             <label style={styles.label}>PPR Status</label>
//             <select name='pprStatus' value={form.pprStatus} onChange={handleChange} style={inputStyle(false)}>
//               <option value=''>-- Pilih --</option>
//               {PPR_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
//             </select>
//           </div>

//           {/* Charge */}
//           <div style={styles.subsectionLabel}>Charge</div>
//           <div style={{ ...styles.grid2, marginBottom: '20px' }}>
//             {[{ name: 'otc', label: 'OTC (One-Time Charge)' }, { name: 'mrc', label: 'MRC (Monthly Recurring Charge)' }].map(f => (
//               <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
//                 <label style={styles.label}>{f.label}</label>
//                 <div style={styles.idrWrapper}>
//                   <span style={styles.idrPrefix}>IDR</span>
//                   <input value={formatIDR(form[f.name])}
//                     onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
//                     style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
//                 </div>
//                 <ErrorMsg msg={errors[f.name]} />
//               </div>
//             ))}
//           </div>

//           {/* Cost */}
//           <div style={styles.subsectionLabel}>Cost</div>
//           <div style={{ ...styles.grid2, marginBottom: '16px' }}>
//             <div style={styles.formGroup} data-error={!!errors.totalCapex}>
//               <label style={styles.label}>Total CAPEX</label>
//               <div style={styles.idrWrapper}>
//                 <span style={styles.idrPrefix}>IDR</span>
//                 <input value={formatIDR(form.totalCapex)}
//                   onChange={(e) => setForm(prev => ({ ...prev, totalCapex: parseIDR(e.target.value) }))}
//                   style={inputStyle(!!errors.totalCapex, { paddingLeft: '52px' })} placeholder='0' />
//               </div>
//               <ErrorMsg msg={errors.totalCapex} />
//             </div>
//             <div style={styles.formGroup}>
//               <label style={styles.label}>Total OPEX (auto)</label>
//               <div style={styles.idrWrapper}>
//                 <span style={styles.idrPrefix}>IDR</span>
//                 <input value={Number(totalOpex).toLocaleString('id-ID')}
//                   style={inputStyle(false, { paddingLeft: '52px', backgroundColor: '#f0f0f0', color: '#666' })} readOnly />
//               </div>
//             </div>
//           </div>
//           <div style={{ ...styles.grid2, marginBottom: '16px' }}>
//             {[{ name: 'y1CoS', label: 'Y1 CoS (Cost of Sales)' }, { name: 'totalCoS', label: 'Total CoS (Cost of Sales)' }].map(f => (
//               <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
//                 <label style={styles.label}>{f.label}</label>
//                 <div style={styles.idrWrapper}>
//                   <span style={styles.idrPrefix}>IDR</span>
//                   <input value={formatIDR(form[f.name])}
//                     onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
//                     style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
//                 </div>
//                 <ErrorMsg msg={errors[f.name]} />
//               </div>
//             ))}
//           </div>
//           <div style={{ ...styles.grid4, marginBottom: '16px' }}>
//             {[
//               { name: 'networkOpex', label: 'Network OPEX' }, { name: 'directOpex', label: 'Direct OPEX' },
//               { name: 'otherOpexDirect', label: 'Other Direct OPEX' }, { name: 'indirectOpex', label: 'Indirect OPEX' }
//             ].map(f => (
//               <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
//                 <label style={styles.label}>{f.label}</label>
//                 <div style={styles.idrWrapper}>
//                   <span style={styles.idrPrefix}>IDR</span>
//                   <input value={formatIDR(form[f.name])}
//                     onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
//                     style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
//                 </div>
//                 <ErrorMsg msg={errors[f.name]} />
//               </div>
//             ))}
//           </div>
//           <div style={{ ...styles.grid3, marginBottom: '16px' }}>
//             {[
//               { name: 'financingCost', label: 'Financing Cost' }, { name: 'marketingCost', label: 'Marketing Cost' },
//               { name: 'riskCost', label: 'Risk Cost' }
//             ].map(f => (
//               <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
//                 <label style={styles.label}>{f.label}</label>
//                 <div style={styles.idrWrapper}>
//                   <span style={styles.idrPrefix}>IDR</span>
//                   <input value={formatIDR(form[f.name])}
//                     onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
//                     style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
//                 </div>
//                 <ErrorMsg msg={errors[f.name]} />
//               </div>
//             ))}
//           </div>
//           <div style={{ ...styles.grid3, marginBottom: '20px' }}>
//             {[
//               { name: 'b2bDirectOverhead', label: 'B2B Direct Overhead' },
//               { name: 'iohOverheadAllocation', label: 'IOH Overhead' },
//               { name: 'contributionMargin', label: 'Contribution Margin' }
//             ].map(f => (
//               <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
//                 <label style={styles.label}>{f.label}</label>
//                 <div style={styles.idrWrapper}>
//                   <span style={styles.idrPrefix}>IDR</span>
//                   <input value={formatIDR(form[f.name])}
//                     onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
//                     style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
//                 </div>
//                 <ErrorMsg msg={errors[f.name]} />
//               </div>
//             ))}
//           </div>

//           {/* Revenue */}
//           <div style={styles.subsectionLabel}>Revenue</div>
//           <div style={{ ...styles.grid3, marginBottom: '16px' }}>
//             {[
//               { name: 'tcv', label: 'TCV (Total Contract Value)' },
//               { name: 'totalNetRev', label: 'Total Net Revenue' },
//               { name: 'portOnlyRev', label: 'Port Only Revenue' }
//             ].map(f => (
//               <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
//                 <label style={styles.label}>{f.label}</label>
//                 <div style={styles.idrWrapper}>
//                   <span style={styles.idrPrefix}>IDR</span>
//                   <input value={formatIDR(form[f.name])}
//                     onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
//                     style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
//                 </div>
//                 <ErrorMsg msg={errors[f.name]} />
//               </div>
//             ))}
//           </div>
//           <div style={{ ...styles.grid2, marginBottom: '20px' }}>
//             {[
//               { name: 'y1RevCalendar', label: 'Y1 Revenue Calendar' },
//               { name: 'y1RevYearly', label: 'Y1 Revenue Yearly' }
//             ].map(f => (
//               <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
//                 <label style={styles.label}>{f.label}</label>
//                 <div style={styles.idrWrapper}>
//                   <span style={styles.idrPrefix}>IDR</span>
//                   <input value={formatIDR(form[f.name])}
//                     onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
//                     style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
//                 </div>
//                 <ErrorMsg msg={errors[f.name]} />
//               </div>
//             ))}
//           </div>

//           {/* Financial Metrics */}
//           <div style={styles.subsectionLabel}>Financial Metrics</div>
//           <div style={{ ...styles.grid2, marginBottom: '16px' }}>
//             <div style={styles.formGroup} data-error={!!errors.netProfit}>
//               <label style={styles.label}>Net Profit</label>
//               <div style={styles.idrWrapper}>
//                 <span style={styles.idrPrefix}>IDR</span>
//                 <input value={formatIDR(form.netProfit)}
//                   onChange={(e) => setForm(prev => ({ ...prev, netProfit: parseIDR(e.target.value) }))}
//                   style={inputStyle(!!errors.netProfit, { paddingLeft: '52px' })} placeholder='0' />
//               </div>
//               <ErrorMsg msg={errors.netProfit} />
//             </div>
//           </div>
//           <div style={{ ...styles.grid2, marginBottom: '16px' }}>
//             {[{ name: 'totalFcf', label: 'Total FCF (Free Cash Flow)' }, { name: 'totalAccFcf', label: 'Total Accumulated FCF' }].map(f => (
//               <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
//                 <label style={styles.label}>{f.label}</label>
//                 <div style={styles.idrWrapper}>
//                   <span style={styles.idrPrefix}>IDR</span>
//                   <input value={formatIDR(form[f.name])}
//                     onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
//                     style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
//                 </div>
//                 <ErrorMsg msg={errors[f.name]} />
//               </div>
//             ))}
//           </div>
//           <div style={styles.grid4}>
//             {[
//               { name: 'wacc', label: 'WACC', suffix: '%', type: 'percent' },
//               { name: 'npv', label: 'NPV', type: 'idr' },
//               { name: 'irr', label: 'IRR', suffix: '%', type: 'percent' },
//               { name: 'payback', label: 'Payback Period', type: 'number' }
//             ].map(f => (
//               <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
//                 <label style={styles.label}>{f.label}</label>
//                 {f.type === 'idr' ? (
//                   <div style={styles.idrWrapper}>
//                     <span style={styles.idrPrefix}>IDR</span>
//                     <input value={formatIDR(form[f.name])}
//                       onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
//                       style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
//                   </div>
//                 ) : f.type === 'percent' ? (
//                   <div style={styles.percentWrapper}>
//                     <input name={f.name} type='number' min='0' step='any' value={form[f.name]} onChange={handleChange}
//                       style={inputStyle(!!errors[f.name], { paddingRight: '36px' })} placeholder='0' />
//                     <span style={styles.percentSuffix}>%</span>
//                   </div>
//                 ) : (
//                   <input name={f.name} type='number' min='0' step='any' value={form[f.name]} onChange={handleChange}
//                     style={inputStyle(!!errors[f.name])} placeholder='0' />
//                 )}
//                 <ErrorMsg msg={errors[f.name]} />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ── SECTION 6: Upload BC ── */}
//         <div style={styles.section}>
//           <h2 style={styles.sectionTitle}>Upload BC</h2>
//           <input type='file' accept='.xlsx,.xls' onChange={(e) => { setFile(e.target.files[0]); setIsDirty(true) }}
//             style={{ display: 'none' }} id='file-upload' />
//           <label htmlFor='file-upload' style={{ ...styles.uploadBox, borderColor: hasFile ? '#4caf50' : '#e0e0e0', backgroundColor: hasFile ? '#f1f8e9' : '#fafafa' }}>
//             <span style={styles.uploadIcon}>{hasFile ? '📄' : '📂'}</span>
//             <span style={styles.uploadText}>{file ? file.name : existingFile ? existingFile : 'Klik untuk upload file Excel (.xlsx, .xls)'}</span>
//             <span style={styles.uploadHint}>{hasFile ? 'Klik untuk mengganti file' : 'Maks. 10 MB'}</span>
//           </label>
//         </div>

//         {errors._server && <div style={styles.errorBanner}>{errors._server}</div>}

//         <div style={styles.submitRow}>
//           <button type='button' onClick={handleBack} style={styles.cancelBtn}>Batal</button>
//           <button type='submit' style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
//             {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Business Case'}
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

// const styles = {
//   container: { padding: '32px', backgroundColor: '#f5f5f5', minHeight: '100vh', maxWidth: '1100px', margin: '0 auto' },
//   loading: { padding: '64px', textAlign: 'center', color: '#888' },
//   header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
//   title: { fontSize: '22px', fontWeight: '700', color: '#3d3d3d', marginBottom: '4px' },
//   subtitle: { fontSize: '14px', color: '#888' },
//   backButton: { padding: '10px 20px', backgroundColor: '#fff', color: '#3d3d3d', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
//   errorBanner: { padding: '14px 16px', backgroundColor: '#ffebee', borderRadius: '8px', color: '#c62828', fontSize: '14px', marginBottom: '16px', border: '1px solid #ef9a9a' },
//   section: { backgroundColor: '#fff', borderRadius: '12px', padding: '28px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
//   sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#3d3d3d', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #fce4ec' },
//   sectionHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #fce4ec' },
//   subsectionLabel: { fontSize: '13px', fontWeight: '700', color: '#E91E8C', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid #fce4ec' },
//   grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
//   grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' },
//   grid4: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' },
//   formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
//   label: { fontSize: '13px', fontWeight: '600', color: '#555' },
//   idrWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
//   idrPrefix: { position: 'absolute', left: '14px', fontSize: '13px', fontWeight: '600', color: '#888', zIndex: 1, pointerEvents: 'none' },
//   percentWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
//   percentSuffix: { position: 'absolute', right: '14px', fontSize: '13px', fontWeight: '600', color: '#888', zIndex: 1, pointerEvents: 'none' },
//   custDropdown: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, maxHeight: '200px', overflowY: 'auto' },
//   custOption: { padding: '10px 14px', fontSize: '14px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5' },
//   custNew: { padding: '10px 14px', fontSize: '14px', cursor: 'pointer', color: '#E91E8C', fontWeight: '600' },
//   autoInfoBox: { padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' },
//   autoInfoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' },
//   autoInfoItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
//   autoInfoLabel: { fontSize: '11px', fontWeight: '600', color: '#aaa', textTransform: 'uppercase' },
//   autoInfoValue: { fontSize: '14px', fontWeight: '600', color: '#3d3d3d' },
//   serviceCard: { border: '1.5px solid', borderRadius: '10px', marginBottom: '12px', overflow: 'hidden' },
//   serviceCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#fafafa', cursor: 'pointer' },
//   serviceCardTitle: { fontSize: '14px', fontWeight: '600', color: '#3d3d3d' },
//   serviceCardActions: { display: 'flex', alignItems: 'center', gap: '12px' },
//   serviceCardBody: { padding: '20px' },
//   addServiceBtn: { padding: '8px 16px', backgroundColor: '#fce4ec', color: '#E91E8C', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
//   deleteServiceBtn: { padding: '6px 12px', backgroundColor: '#fff5f5', color: '#e53935', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
//   toggleIcon: { fontSize: '12px', color: '#888' },
//   serviceGlobalError: { padding: '10px 14px', backgroundColor: '#ffebee', borderRadius: '8px', color: '#c62828', fontSize: '13px', marginBottom: '12px' },
//   autoCalcBox: { display: 'flex', gap: '16px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '20px', flexWrap: 'wrap' },
//   autoCalcItem: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '130px' },
//   autoCalcLabel: { fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase' },
//   autoCalcValue: { fontSize: '15px', fontWeight: '700', color: '#3d3d3d' },
//   uploadBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: '2px dashed', borderRadius: '10px', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' },
//   uploadIcon: { fontSize: '32px' },
//   uploadText: { fontSize: '14px', color: '#555', fontWeight: '500' },
//   uploadHint: { fontSize: '12px', color: '#aaa' },
//   submitRow: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' },
//   cancelBtn: { padding: '12px 24px', backgroundColor: '#fff', color: '#3d3d3d', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
//   submitBtn: { padding: '12px 32px', backgroundColor: '#E91E8C', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }
// }

// export default BCFormPage

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

// ── Validation ────────────────────────────────────────────────────────────────
const validateForm = (form, projectStatusTouched) => {
  const errors = {}

  // Section 1: BC Details
  if (!form.bcTitle?.trim()) errors.bcTitle = 'Judul BC wajib diisi'
  if (!form.bcType) errors.bcType = 'BC Type wajib dipilih'
  if (!form.projectType) errors.projectType = 'Project Type wajib dipilih'
  if (!form.activityType) errors.activityType = 'Activity Type wajib dipilih'
  if (!form.projectStatus) errors.projectStatus = 'Project Status wajib dipilih'
  if (projectStatusTouched && !form.followUpNotes?.trim()) errors.followUpNotes = 'Follow Up Notes wajib diisi saat memperbarui Project Status'
  if (!form.esReqDate) errors.esReqDate = 'ES Request Date wajib diisi'
  if (!form.cfDate) errors.cfDate = 'CF Date wajib diisi'
  if (form.bcType === 'BC-CPB' && !form.cpbDate) errors.cpbDate = 'CPB Date wajib diisi untuk BC Type BC-CPB'

  // Validasi logika tanggal
  if (form.esReqDate && form.cfDate && form.cfDate < form.esReqDate) {
    errors.cfDate = 'CF Date tidak boleh sebelum ES Request Date'
  }
  if (form.cfDate && form.rfsDate && form.rfsDate < form.cfDate) {
    errors.rfsDate = 'RFS Date tidak boleh sebelum CF Date'
  }

  if (!form.custName?.trim()) errors.custName = 'Customer Name wajib diisi'
  if (!form.custJoinYear) errors.custJoinYear = 'Customer Join Year wajib dipilih'
  if (!form.lineOfBusiness) errors.lineOfBusiness = 'Line of Business wajib dipilih'
  if (!form.contractType) errors.contractType = 'Contract Type wajib dipilih'
  if (!form.activationType) errors.activationType = 'Activation Type wajib dipilih'
  if (!form.contractPeriod) errors.contractPeriod = 'Contract Period wajib dipilih'
  if (!form.rfsDate) errors.rfsDate = errors.rfsDate || 'RFS Date wajib diisi'

  // Section 2: Stakeholders
  if (!form.salesTeamId) errors.salesTeamId = 'Sales Name wajib dipilih'
  if (!form.preSalesTeamId) errors.preSalesTeamId = 'Pre-Sales Team wajib dipilih'
  if (!form.pricingTeamId) errors.pricingTeamId = 'Pricing Team wajib dipilih'

  // Section 3: Service Details
  if (!form.serviceDetails || form.serviceDetails.length === 0) {
    errors.serviceDetails = 'Minimal satu service harus ditambahkan'
  } else {
    const serviceErrors = []
    form.serviceDetails.forEach((sd, i) => {
      const sdErr = {}
      if (!sd.serviceSegment) sdErr.serviceSegment = 'Service Segment wajib dipilih'
      if (!sd.serviceId) sdErr.serviceId = 'Service Type wajib dipilih'
      if (!sd.subServiceId) sdErr.subServiceId = 'Sub-Service Type wajib dipilih'

      // Validasi lokasi
      if (sd.subServiceId) {
        const isMPLS = sd.infraType === 'MPLS' // fallback, bisa disesuaikan
        if (!isMPLS && !sd.serviceLocation) sdErr.serviceLocation = 'Service Location wajib dipilih'
        if (isMPLS && !sd.locationA) sdErr.locationA = 'Location A wajib dipilih'
      }

      if (Object.keys(sdErr).length > 0) serviceErrors[i] = sdErr
    })
    if (serviceErrors.length > 0) errors.serviceErrors = serviceErrors
  }

  // Section 4: Tender Details
  if (form.projectType === 'Tender') {
    if (!form.tenderWinnerName?.trim()) errors.tenderWinnerName = 'Winner Name wajib diisi'
    if (!form.tenderWinningPrice || Number(form.tenderWinningPrice) <= 0) errors.tenderWinningPrice = 'Winning Price wajib diisi dan lebih dari 0'
    if (!form.tenderReason?.trim()) errors.tenderReason = 'Reason wajib diisi'
  }

  // Section 5: Financial — validasi tidak boleh negatif
  const financialFields = [
    { key: 'otc', label: 'OTC' }, { key: 'mrc', label: 'MRC' },
    { key: 'tcv', label: 'TCV' }, { key: 'totalNetRev', label: 'Total Net Revenue' },
    { key: 'portOnlyRev', label: 'Port Only Revenue' },
    { key: 'y1RevCalendar', label: 'Y1 Revenue Calendar' }, { key: 'y1RevYearly', label: 'Y1 Revenue Yearly' },
    { key: 'y1CoS', label: 'Y1 CoS' }, { key: 'totalCoS', label: 'Total CoS' },
    { key: 'networkOpex', label: 'Network OPEX' }, { key: 'directOpex', label: 'Direct OPEX' },
    { key: 'otherOpexDirect', label: 'Other Direct OPEX' }, { key: 'indirectOpex', label: 'Indirect OPEX' },
    { key: 'financingCost', label: 'Financing Cost' }, { key: 'marketingCost', label: 'Marketing Cost' },
    { key: 'riskCost', label: 'Risk Cost' }, { key: 'b2bDirectOverhead', label: 'B2B Direct Overhead' },
    { key: 'iohOverheadAllocation', label: 'IOH Overhead' }, { key: 'contributionMargin', label: 'Contribution Margin' },
    { key: 'totalCapex', label: 'Total CAPEX' }, { key: 'netProfit', label: 'Net Profit' },
    { key: 'totalFcf', label: 'Total FCF' }, { key: 'totalAccFcf', label: 'Total Accumulated FCF' },
    { key: 'npv', label: 'NPV' }
  ]
  financialFields.forEach(({ key, label }) => {
    const raw = parseIDR(form[key])
    if (raw && Number(raw) < 0) errors[key] = `${label} tidak boleh bernilai negatif`
  })

  const percentFields = [
    { key: 'wacc', label: 'WACC' }, { key: 'irr', label: 'IRR' },
    { key: 'payback', label: 'Payback Period' }
  ]
  percentFields.forEach(({ key, label }) => {
    if (form[key] !== '' && form[key] !== null && form[key] !== undefined) {
      if (Number(form[key]) < 0) errors[key] = `${label} tidak boleh bernilai negatif`
    }
  })

  return errors
}

// ── Error Field Helper ────────────────────────────────────────────────────────
const ErrorMsg = ({ msg }) => msg
  ? <span style={{ fontSize: '12px', color: '#e53935', marginTop: '4px' }}>{msg}</span>
  : null

const inputStyle = (hasError, extra = {}) => ({
  padding: '10px 14px',
  borderRadius: '8px',
  border: `1.5px solid ${hasError ? '#e53935' : '#e0e0e0'}`,
  fontSize: '14px',
  color: '#3d3d3d',
  backgroundColor: hasError ? '#fff5f5' : '#fafafa',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  ...extra
})

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
  const [errors, setErrors] = useState({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
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
        projectStatus: bc.projectStatus || '', followUpNotes: bc.followUpNotes || '',
        esReqDate: bc.esReqDate || '', cfDate: bc.cfDate || '', cpbDate: bc.cpbDate || '',
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
    const y1RevYearly = Number(parseIDR(form.y1RevYearly)) || 0
    const totalCapex = Number(parseIDR(form.totalCapex)) || 0

    const opex = totalCoS + directOpex + otherOpexDirect + indirectOpex
    setTotalOpex(opex)
    setPprEligibility(
      y1RevYearly > 1000000000 && totalCoS > 1000000000 && totalCapex > 1000000000
        ? 'Eligible' : 'Not Eligible'
    )
    const eb = tcv - opex
    setEbitda(eb)
    const margin = tcv > 0 ? (eb / tcv) * 100 : 0
    setEbitdaMargin(margin)
    if (margin < 20) setEbitdaMarginTier('< 20%')
    else if (margin < 33) setEbitdaMarginTier('20 - 33%')
    else if (margin < 42.5) setEbitdaMarginTier('33 - 42.5%')
    else setEbitdaMarginTier('> 42.5%')
  }


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMasterData()
     
    if (isEdit) fetchBC()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => { if (!isEdit && isDirty) localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(form)) }, [form, isDirty, isEdit])
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    calculateAutoFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form.tcv, form.totalCoS, form.directOpex, form.otherOpexDirect,
    form.indirectOpex, form.totalNetRev, form.y1RevYearly, form.totalCapex
  ])
  useEffect(() => {
    if (form.salesTeamId) {
      const st = salesTeams.find(s => String(s.id) === String(form.salesTeamId))
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedSalesInfo(st || null)
    } else {
       
      setSelectedSalesInfo(null)
    }
  }, [form.salesTeamId, salesTeams])
  useEffect(() => {
    const handleBeforeUnload = (e) => { if (isDirty) { e.preventDefault(); e.returnValue = '' } }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  // Re-validate on change jika sudah pernah submit
  useEffect(() => {
    if (submitAttempted) {
      const errs = validateForm(form, projectStatusTouched)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrors(errs)
    }
  }, [form, projectStatusTouched, submitAttempted])

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
    setSubmitAttempted(true)

    const errs = validateForm(form, projectStatusTouched)
    setErrors(errs)

    const hasErrors = Object.keys(errs).length > 0
    if (hasErrors) {
      // Scroll ke error pertama
      const firstErrEl = document.querySelector('[data-error="true"]')
      if (firstErrEl) firstErrEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      const strFields = [
        'bcTitle', 'bcType', 'projectType', 'activityType', 'projectStatus', 'followUpNotes',
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
      setErrors({ _server: err.response?.data?.message || 'Terjadi kesalahan saat menyimpan' })
    } finally { setLoading(false) }
  }

  if (pageLoading) return <div style={styles.loading}>Memuat data...</div>

  const filteredCustNames = custNameOptions.filter(n => n.toLowerCase().includes(custNameInput.toLowerCase()))
  const hasFile = file || existingFile
  const lastFollowUpDisplay = isEdit
    ? (projectStatusTouched ? formatDisplayDate(getLocalToday()) + ' (akan diperbarui)' : formatDisplayDateFromISO(existingLastFollowUp))
    : formatDisplayDate(getLocalToday())
  const ebitdaTierColor = {
    '< 20%': '#e53935', '20 - 33%': '#e65100',
    '33 - 42.5%': '#f9a825', '> 42.5%': '#2e7d32'
  }[ebitdaMarginTier] || '#555'

  const totalErrors = Object.keys(errors).length

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{isEdit ? 'Edit Business Case' : 'Tambah Business Case'}</h1>
          <p style={styles.subtitle}>{isEdit ? 'Edit data Business Case' : 'Isi formulir untuk menambahkan Business Case baru'}</p>
        </div>
        <button type='button' onClick={handleBack} style={styles.backButton}>← Kembali</button>
      </div>

      {/* Error summary banner */}
      {submitAttempted && totalErrors > 0 && (
        <div style={styles.errorBanner}>
          <strong>⚠ Terdapat {totalErrors} kesalahan pada formulir.</strong> Periksa field yang ditandai merah sebelum menyimpan.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>

        {/* ── SECTION 1: BC Details ── */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>BC Details</h2>

          {/* BC Title */}
          <div style={{ ...styles.formGroup, marginBottom: '16px' }} data-error={!!errors.bcTitle}>
            <label style={styles.label}>BC Title *</label>
            <input name='bcTitle' value={form.bcTitle} onChange={handleChange}
              style={inputStyle(!!errors.bcTitle)} placeholder='Masukkan judul Business Case' />
            <ErrorMsg msg={errors.bcTitle} />
          </div>

          {/* BC Type, Project Type, Activity Type */}
          <div style={{ ...styles.grid3, marginBottom: '16px' }}>
            <div style={styles.formGroup} data-error={!!errors.bcType}>
              <label style={styles.label}>BC Type *</label>
              <select name='bcType' value={form.bcType} onChange={handleChange} style={inputStyle(!!errors.bcType)}>
                <option value=''>-- Pilih --</option>
                {BC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ErrorMsg msg={errors.bcType} />
            </div>
            <div style={styles.formGroup} data-error={!!errors.projectType}>
              <label style={styles.label}>Project Type *</label>
              <select name='projectType' value={form.projectType} onChange={handleChange} style={inputStyle(!!errors.projectType)}>
                <option value=''>-- Pilih --</option>
                {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ErrorMsg msg={errors.projectType} />
            </div>
            <div style={styles.formGroup} data-error={!!errors.activityType}>
              <label style={styles.label}>Activity Type *</label>
              <select name='activityType' value={form.activityType} onChange={handleChange} style={inputStyle(!!errors.activityType)}>
                <option value=''>-- Pilih --</option>
                {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ErrorMsg msg={errors.activityType} />
            </div>
          </div>

          {/* Project Status, Last Follow Up */}
          <div style={{ ...styles.grid2, marginBottom: '16px' }}>
            <div style={styles.formGroup} data-error={!!errors.projectStatus}>
              <label style={styles.label}>Project Status *</label>
              <select name='projectStatus' value={form.projectStatus}
                onChange={handleProjectStatusChange}
                style={inputStyle(!!errors.projectStatus, { borderColor: projectStatusTouched && !errors.projectStatus ? '#E91E8C' : undefined })}>
                <option value=''>-- Pilih --</option>
                {PROJECT_STATUSES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ErrorMsg msg={errors.projectStatus} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Last Follow Up Date</label>
              <input value={lastFollowUpDisplay}
                style={inputStyle(false, { backgroundColor: '#f0f0f0', color: projectStatusTouched ? '#E91E8C' : '#666' })}
                readOnly />
            </div>
          </div>

          {/* Follow Up Notes */}
          {(projectStatusTouched || form.followUpNotes || isEdit) && (
            <div style={{ ...styles.formGroup, marginBottom: '16px' }} data-error={!!errors.followUpNotes}>
              <label style={styles.label}>
                Follow Up Notes *
                <span style={{ fontWeight: '400', color: '#888', marginLeft: '6px', fontSize: '12px' }}>
                  (wajib diisi saat memperbarui Project Status)
                </span>
              </label>
              <textarea name='followUpNotes' value={form.followUpNotes} onChange={handleChange}
                style={inputStyle(!!errors.followUpNotes, { minHeight: '80px', resize: 'vertical' })}
                placeholder='Tuliskan catatan tindak lanjut...' />
              <ErrorMsg msg={errors.followUpNotes} />
            </div>
          )}

          {/* ES Req Date, CF Date, CPB Date */}
          <div style={{ ...styles.grid3, marginBottom: '16px' }}>
            <div style={styles.formGroup} data-error={!!errors.esReqDate}>
              <label style={styles.label}>ES Request Date *</label>
              <input name='esReqDate' type='date' value={form.esReqDate} onChange={handleChange} style={inputStyle(!!errors.esReqDate)} />
              <ErrorMsg msg={errors.esReqDate} />
            </div>
            <div style={styles.formGroup} data-error={!!errors.cfDate}>
              <label style={styles.label}>CF Date *</label>
              <input name='cfDate' type='date' value={form.cfDate} onChange={handleChange} style={inputStyle(!!errors.cfDate)} />
              <ErrorMsg msg={errors.cfDate} />
            </div>
            {form.bcType === 'BC-CPB' && (
              <div style={styles.formGroup} data-error={!!errors.cpbDate}>
                <label style={styles.label}>CPB Date *</label>
                <input name='cpbDate' type='date' value={form.cpbDate} onChange={handleChange} style={inputStyle(!!errors.cpbDate)} />
                <ErrorMsg msg={errors.cpbDate} />
              </div>
            )}
          </div>

          {/* SFA ID, Opportunity ID, Sales Order, Quote */}
          <div style={{ ...styles.grid4, marginBottom: '16px' }}>
            {[
              { name: 'sfaId', label: 'SFA ID', placeholder: 'SFA ID' },
              { name: 'opportunityId', label: 'Opportunity ID', placeholder: 'Opportunity ID' },
              { name: 'salesOrder', label: 'Sales Order', placeholder: 'Sales Order' },
              { name: 'quote', label: 'Quote', placeholder: 'Quote' }
            ].map(f => (
              <div key={f.name} style={styles.formGroup}>
                <label style={styles.label}>{f.label}</label>
                <input name={f.name} value={form[f.name]} onChange={handleChange} style={inputStyle(false)} placeholder={f.placeholder} />
              </div>
            ))}
          </div>

          {/* Customer Name, Customer Join Year, Line of Business */}
          <div style={{ ...styles.grid3, marginBottom: '16px' }}>
            <div style={{ ...styles.formGroup, position: 'relative' }} data-error={!!errors.custName}>
              <label style={styles.label}>Customer Name *</label>
              <input value={custNameInput} onChange={handleCustNameInput}
                onFocus={() => setShowCustDropdown(true)}
                onBlur={() => setTimeout(() => setShowCustDropdown(false), 200)}
                style={inputStyle(!!errors.custName)} placeholder='Ketik atau pilih nama customer' />
              <ErrorMsg msg={errors.custName} />
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
            <div style={styles.formGroup} data-error={!!errors.custJoinYear}>
              <label style={styles.label}>Customer Join Year *</label>
              <select name='custJoinYear' value={form.custJoinYear} onChange={handleChange} style={inputStyle(!!errors.custJoinYear)}>
                <option value=''>-- Pilih Tahun --</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <ErrorMsg msg={errors.custJoinYear} />
            </div>
            <div style={styles.formGroup} data-error={!!errors.lineOfBusiness}>
              <label style={styles.label}>Line of Business *</label>
              <select name='lineOfBusiness' value={form.lineOfBusiness} onChange={handleChange} style={inputStyle(!!errors.lineOfBusiness)}>
                <option value=''>-- Pilih --</option>
                {LINES_OF_BUSINESS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <ErrorMsg msg={errors.lineOfBusiness} />
            </div>
          </div>

          {/* Contract Type, Activation Type, Contract Period, RFS Date */}
          <div style={styles.grid4}>
            <div style={styles.formGroup} data-error={!!errors.contractType}>
              <label style={styles.label}>Contract Type *</label>
              <select name='contractType' value={form.contractType} onChange={handleChange} style={inputStyle(!!errors.contractType)}>
                <option value=''>-- Pilih --</option>
                {CONTRACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ErrorMsg msg={errors.contractType} />
            </div>
            <div style={styles.formGroup} data-error={!!errors.activationType}>
              <label style={styles.label}>Activation Type *</label>
              <select name='activationType' value={form.activationType} onChange={handleChange} style={inputStyle(!!errors.activationType)}>
                <option value=''>-- Pilih --</option>
                {ACTIVATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ErrorMsg msg={errors.activationType} />
            </div>
            <div style={styles.formGroup} data-error={!!errors.contractPeriod}>
              <label style={styles.label}>Contract Period *</label>
              <select name='contractPeriod' value={form.contractPeriod} onChange={handleChange} style={inputStyle(!!errors.contractPeriod)}>
                <option value=''>-- Pilih --</option>
                {CONTRACT_PERIODS.map(t => <option key={t} value={t}>{t !== 'Other' ? `${t} months` : t}</option>)}
              </select>
              <ErrorMsg msg={errors.contractPeriod} />
            </div>
            <div style={styles.formGroup} data-error={!!errors.rfsDate}>
              <label style={styles.label}>RFS Date *</label>
              <input name='rfsDate' type='date' value={form.rfsDate} onChange={handleChange} style={inputStyle(!!errors.rfsDate)} />
              <ErrorMsg msg={errors.rfsDate} />
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Stakeholders ── */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Stakeholders Involved</h2>
          <div style={{ ...styles.grid3, marginBottom: selectedSalesInfo ? '16px' : '0' }}>
            <div style={styles.formGroup} data-error={!!errors.salesTeamId}>
              <label style={styles.label}>Sales Name *</label>
              <select name='salesTeamId' value={form.salesTeamId} onChange={handleChange} style={inputStyle(!!errors.salesTeamId)}>
                <option value=''>-- Pilih Sales --</option>
                {salesTeams.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
              </select>
              <ErrorMsg msg={errors.salesTeamId} />
            </div>
            <div style={styles.formGroup} data-error={!!errors.preSalesTeamId}>
              <label style={styles.label}>Pre-Sales Team *</label>
              <select name='preSalesTeamId' value={form.preSalesTeamId} onChange={handleChange} style={inputStyle(!!errors.preSalesTeamId)}>
                <option value=''>-- Pilih --</option>
                {preSalesTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <ErrorMsg msg={errors.preSalesTeamId} />
            </div>
            <div style={styles.formGroup} data-error={!!errors.pricingTeamId}>
              <label style={styles.label}>Pricing Team *</label>
              <select name='pricingTeamId' value={form.pricingTeamId} onChange={handleChange} style={inputStyle(!!errors.pricingTeamId)}>
                <option value=''>-- Pilih --</option>
                {pricingTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <ErrorMsg msg={errors.pricingTeamId} />
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
          {errors.serviceDetails && <div style={styles.serviceGlobalError}>{errors.serviceDetails}</div>}
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
            const sdErr = errors.serviceErrors?.[index] || {}

            return (
              <div key={index} style={{ ...styles.serviceCard, borderColor: Object.keys(sdErr).length > 0 ? '#e53935' : '#e0e0e0' }}>
                <div style={styles.serviceCardHeader} onClick={() => toggleService(index)}>
                  <span style={styles.serviceCardTitle}>
                    Service {index + 1}
                    {sd.serviceSegment && ` — ${sd.serviceSegment}`}
                    {selectedService && ` › ${selectedService.name}`}
                    {Object.keys(sdErr).length > 0 && <span style={{ color: '#e53935', marginLeft: '8px', fontSize: '12px' }}>⚠ Ada field yang belum diisi</span>}
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
                    <div style={{ ...styles.grid3, marginBottom: '16px' }}>
                      <div style={styles.formGroup} data-error={!!sdErr.serviceSegment}>
                        <label style={styles.label}>Service Segment *</label>
                        <select value={sd.serviceSegment}
                          onChange={(e) => handleServiceChange(index, 'serviceSegment', e.target.value)}
                          style={inputStyle(!!sdErr.serviceSegment)}>
                          <option value=''>-- Pilih Segment --</option>
                          {SERVICE_SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ErrorMsg msg={sdErr.serviceSegment} />
                      </div>
                      <div style={styles.formGroup} data-error={!!sdErr.serviceId}>
                        <label style={styles.label}>Service Type *</label>
                        <select value={sd.serviceId}
                          onChange={(e) => handleServiceChange(index, 'serviceId', e.target.value)}
                          style={inputStyle(!!sdErr.serviceId, { backgroundColor: !sd.serviceSegment ? '#f0f0f0' : undefined })}
                          disabled={!sd.serviceSegment}>
                          <option value=''>-- Pilih Service --</option>
                          {filteredServices.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <ErrorMsg msg={sdErr.serviceId} />
                      </div>
                      <div style={styles.formGroup} data-error={!!sdErr.subServiceId}>
                        <label style={styles.label}>Sub-Service Type *</label>
                        <select value={sd.subServiceId}
                          onChange={(e) => handleServiceChange(index, 'subServiceId', e.target.value)}
                          style={inputStyle(!!sdErr.subServiceId, { backgroundColor: !sd.serviceId ? '#f0f0f0' : undefined })}
                          disabled={!sd.serviceId}>
                          <option value=''>-- Pilih Sub-Service --</option>
                          {filteredSubs.map(ss => <option key={ss.id} value={ss.id}>{ss.name}</option>)}
                        </select>
                        <ErrorMsg msg={sdErr.subServiceId} />
                      </div>
                    </div>

                    <div style={{ ...styles.grid4, marginBottom: '16px' }}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Total Unit</label>
                        <input type='number' min='0' value={sd.totalUnit}
                          onChange={(e) => handleServiceChange(index, 'totalUnit', e.target.value)}
                          style={inputStyle(false)} placeholder='0' />
                      </div>
                    </div>

                    <div style={{ ...styles.formGroup, marginBottom: '16px' }}>
                      <label style={styles.label}>Detail Service</label>
                      <textarea value={sd.detailService}
                        onChange={(e) => handleServiceChange(index, 'detailService', e.target.value)}
                        style={inputStyle(false, { minHeight: '72px', resize: 'vertical' })}
                        placeholder='Detail service...' />
                    </div>

                    {showServiceLocation && (
                      <div style={{ ...styles.grid4, marginBottom: '16px' }}>
                        <div style={styles.formGroup} data-error={!!sdErr.serviceLocation}>
                          <label style={styles.label}>Service Location *</label>
                          <select value={sd.serviceLocation}
                            onChange={(e) => handleServiceChange(index, 'serviceLocation', e.target.value)}
                            style={inputStyle(!!sdErr.serviceLocation)}>
                            <option value=''>-- Pilih --</option>
                            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                          <ErrorMsg msg={sdErr.serviceLocation} />
                        </div>
                      </div>
                    )}

                    {showLocationAB && (
                      <div style={{ ...styles.grid2, marginBottom: '16px' }}>
                        <div style={styles.formGroup} data-error={!!sdErr.locationA}>
                          <label style={styles.label}>Location A *</label>
                          <select value={sd.locationA}
                            onChange={(e) => handleServiceChange(index, 'locationA', e.target.value)}
                            style={inputStyle(!!sdErr.locationA)}>
                            <option value=''>-- Pilih --</option>
                            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                          <ErrorMsg msg={sdErr.locationA} />
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Location B</label>
                          <select value={sd.locationB}
                            onChange={(e) => handleServiceChange(index, 'locationB', e.target.value)}
                            style={inputStyle(false)}>
                            <option value=''>-- Pilih --</option>
                            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>
                      </div>
                    )}

                    {showMidiFields && (
                      <div style={{ ...styles.grid2, marginBottom: '16px' }}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Total Bandwidth/MBPS</label>
                          <input type='number' min='0' value={sd.totalBwPerMbps}
                            onChange={(e) => handleServiceChange(index, 'totalBwPerMbps', e.target.value)}
                            style={inputStyle(false)} placeholder='0' />
                        </div>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Price/MBPS</label>
                          <div style={styles.idrWrapper}>
                            <span style={styles.idrPrefix}>IDR</span>
                            <input value={formatIDR(sd.pricePerMbps)}
                              onChange={(e) => handleServiceChange(index, 'pricePerMbps', parseIDR(e.target.value))}
                              style={inputStyle(false, { paddingLeft: '52px' })} placeholder='0' />
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
              <div style={styles.formGroup} data-error={!!errors.tenderWinnerName}>
                <label style={styles.label}>Winner Name *</label>
                <input name='tenderWinnerName' value={form.tenderWinnerName} onChange={handleChange}
                  style={inputStyle(!!errors.tenderWinnerName)} placeholder='Nama pemenang tender' />
                <ErrorMsg msg={errors.tenderWinnerName} />
              </div>
              <div style={styles.formGroup} data-error={!!errors.tenderWinningPrice}>
                <label style={styles.label}>Winning Price *</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form.tenderWinningPrice)}
                    onChange={(e) => setForm(prev => ({ ...prev, tenderWinningPrice: parseIDR(e.target.value) }))}
                    style={inputStyle(!!errors.tenderWinningPrice, { paddingLeft: '52px' })} placeholder='0' />
                </div>
                <ErrorMsg msg={errors.tenderWinningPrice} />
              </div>
            </div>
            {form.projectStatus === 'Lost' && (
              <div style={{ ...styles.formGroup, marginBottom: '16px' }}>
                <label style={styles.label}>Lost Reason</label>
                <select name='tenderLostReason' value={form.tenderLostReason} onChange={handleChange} style={inputStyle(false)}>
                  <option value=''>-- Pilih --</option>
                  {LOST_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            )}
            <div style={styles.formGroup} data-error={!!errors.tenderReason}>
              <label style={styles.label}>Reason *</label>
              <textarea name='tenderReason' value={form.tenderReason} onChange={handleChange}
                style={inputStyle(!!errors.tenderReason, { minHeight: '80px', resize: 'vertical' })}
                placeholder='Alasan...' />
              <ErrorMsg msg={errors.tenderReason} />
            </div>
          </div>
        )}

        {/* ── SECTION 5: Financial Projection ── */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Financial Projection</h2>

          <div style={styles.autoCalcBox}>
            <div style={styles.autoCalcItem}>
              <span style={styles.autoCalcLabel}>PPR Eligibility</span>
              <span style={{ ...styles.autoCalcValue, color: pprEligibility === 'Eligible' ? '#2e7d32' : '#e65100' }}>{pprEligibility || '-'}</span>
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
              <span style={{ ...styles.autoCalcValue, color: ebitdaTierColor, fontSize: '14px' }}>{ebitdaMarginTier || '-'}</span>
            </div>
            <div style={styles.autoCalcItem}>
              <span style={styles.autoCalcLabel}>Total OPEX</span>
              <span style={styles.autoCalcValue}>IDR {Number(totalOpex).toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div style={{ ...styles.formGroup, marginBottom: '20px' }}>
            <label style={styles.label}>PPR Status</label>
            <select name='pprStatus' value={form.pprStatus} onChange={handleChange} style={inputStyle(false)}>
              <option value=''>-- Pilih --</option>
              {PPR_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Charge */}
          <div style={styles.subsectionLabel}>Charge</div>
          <div style={{ ...styles.grid2, marginBottom: '20px' }}>
            {[{ name: 'otc', label: 'OTC (One-Time Charge)' }, { name: 'mrc', label: 'MRC (Monthly Recurring Charge)' }].map(f => (
              <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
                <label style={styles.label}>{f.label}</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form[f.name])}
                    onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
                    style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
                </div>
                <ErrorMsg msg={errors[f.name]} />
              </div>
            ))}
          </div>

          {/* Cost */}
          <div style={styles.subsectionLabel}>Cost</div>
          <div style={{ ...styles.grid2, marginBottom: '16px' }}>
            <div style={styles.formGroup} data-error={!!errors.totalCapex}>
              <label style={styles.label}>Total CAPEX</label>
              <div style={styles.idrWrapper}>
                <span style={styles.idrPrefix}>IDR</span>
                <input value={formatIDR(form.totalCapex)}
                  onChange={(e) => setForm(prev => ({ ...prev, totalCapex: parseIDR(e.target.value) }))}
                  style={inputStyle(!!errors.totalCapex, { paddingLeft: '52px' })} placeholder='0' />
              </div>
              <ErrorMsg msg={errors.totalCapex} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Total OPEX (auto)</label>
              <div style={styles.idrWrapper}>
                <span style={styles.idrPrefix}>IDR</span>
                <input value={Number(totalOpex).toLocaleString('id-ID')}
                  style={inputStyle(false, { paddingLeft: '52px', backgroundColor: '#f0f0f0', color: '#666' })} readOnly />
              </div>
            </div>
          </div>
          <div style={{ ...styles.grid2, marginBottom: '16px' }}>
            {[{ name: 'y1CoS', label: 'Y1 CoS (Cost of Sales)' }, { name: 'totalCoS', label: 'Total CoS (Cost of Sales)' }].map(f => (
              <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
                <label style={styles.label}>{f.label}</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form[f.name])}
                    onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
                    style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
                </div>
                <ErrorMsg msg={errors[f.name]} />
              </div>
            ))}
          </div>
          <div style={{ ...styles.grid4, marginBottom: '16px' }}>
            {[
              { name: 'networkOpex', label: 'Network OPEX' }, { name: 'directOpex', label: 'Direct OPEX' },
              { name: 'otherOpexDirect', label: 'Other Direct OPEX' }, { name: 'indirectOpex', label: 'Indirect OPEX' }
            ].map(f => (
              <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
                <label style={styles.label}>{f.label}</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form[f.name])}
                    onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
                    style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
                </div>
                <ErrorMsg msg={errors[f.name]} />
              </div>
            ))}
          </div>
          <div style={{ ...styles.grid3, marginBottom: '16px' }}>
            {[
              { name: 'financingCost', label: 'Financing Cost' }, { name: 'marketingCost', label: 'Marketing Cost' },
              { name: 'riskCost', label: 'Risk Cost' }
            ].map(f => (
              <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
                <label style={styles.label}>{f.label}</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form[f.name])}
                    onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
                    style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
                </div>
                <ErrorMsg msg={errors[f.name]} />
              </div>
            ))}
          </div>
          <div style={{ ...styles.grid3, marginBottom: '20px' }}>
            {[
              { name: 'b2bDirectOverhead', label: 'B2B Direct Overhead' },
              { name: 'iohOverheadAllocation', label: 'IOH Overhead' },
              { name: 'contributionMargin', label: 'Contribution Margin' }
            ].map(f => (
              <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
                <label style={styles.label}>{f.label}</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form[f.name])}
                    onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
                    style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
                </div>
                <ErrorMsg msg={errors[f.name]} />
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
              <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
                <label style={styles.label}>{f.label}</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form[f.name])}
                    onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
                    style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
                </div>
                <ErrorMsg msg={errors[f.name]} />
              </div>
            ))}
          </div>
          <div style={{ ...styles.grid2, marginBottom: '20px' }}>
            {[
              { name: 'y1RevCalendar', label: 'Y1 Revenue Calendar' },
              { name: 'y1RevYearly', label: 'Y1 Revenue Yearly' }
            ].map(f => (
              <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
                <label style={styles.label}>{f.label}</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form[f.name])}
                    onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
                    style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
                </div>
                <ErrorMsg msg={errors[f.name]} />
              </div>
            ))}
          </div>

          {/* Financial Metrics */}
          <div style={styles.subsectionLabel}>Financial Metrics</div>
          <div style={{ ...styles.grid2, marginBottom: '16px' }}>
            <div style={styles.formGroup} data-error={!!errors.netProfit}>
              <label style={styles.label}>Net Profit</label>
              <div style={styles.idrWrapper}>
                <span style={styles.idrPrefix}>IDR</span>
                <input value={formatIDR(form.netProfit)}
                  onChange={(e) => setForm(prev => ({ ...prev, netProfit: parseIDR(e.target.value) }))}
                  style={inputStyle(!!errors.netProfit, { paddingLeft: '52px' })} placeholder='0' />
              </div>
              <ErrorMsg msg={errors.netProfit} />
            </div>
          </div>
          <div style={{ ...styles.grid2, marginBottom: '16px' }}>
            {[{ name: 'totalFcf', label: 'Total FCF (Free Cash Flow)' }, { name: 'totalAccFcf', label: 'Total Accumulated FCF' }].map(f => (
              <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
                <label style={styles.label}>{f.label}</label>
                <div style={styles.idrWrapper}>
                  <span style={styles.idrPrefix}>IDR</span>
                  <input value={formatIDR(form[f.name])}
                    onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
                    style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
                </div>
                <ErrorMsg msg={errors[f.name]} />
              </div>
            ))}
          </div>
          <div style={styles.grid4}>
            {[
              { name: 'wacc', label: 'WACC', suffix: '%', type: 'percent' },
              { name: 'npv', label: 'NPV', type: 'idr' },
              { name: 'irr', label: 'IRR', suffix: '%', type: 'percent' },
              { name: 'payback', label: 'Payback Period', type: 'number' }
            ].map(f => (
              <div key={f.name} style={styles.formGroup} data-error={!!errors[f.name]}>
                <label style={styles.label}>{f.label}</label>
                {f.type === 'idr' ? (
                  <div style={styles.idrWrapper}>
                    <span style={styles.idrPrefix}>IDR</span>
                    <input value={formatIDR(form[f.name])}
                      onChange={(e) => setForm(prev => ({ ...prev, [f.name]: parseIDR(e.target.value) }))}
                      style={inputStyle(!!errors[f.name], { paddingLeft: '52px' })} placeholder='0' />
                  </div>
                ) : f.type === 'percent' ? (
                  <div style={styles.percentWrapper}>
                    <input name={f.name} type='number' min='0' step='any' value={form[f.name]} onChange={handleChange}
                      style={inputStyle(!!errors[f.name], { paddingRight: '36px' })} placeholder='0' />
                    <span style={styles.percentSuffix}>%</span>
                  </div>
                ) : (
                  <input name={f.name} type='number' min='0' step='any' value={form[f.name]} onChange={handleChange}
                    style={inputStyle(!!errors[f.name])} placeholder='0' />
                )}
                <ErrorMsg msg={errors[f.name]} />
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 6: Upload BC ── */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Upload BC</h2>
          <input type='file' accept='.xlsx,.xls' onChange={(e) => { setFile(e.target.files[0]); setIsDirty(true) }}
            style={{ display: 'none' }} id='file-upload' />
          <label htmlFor='file-upload' style={{ ...styles.uploadBox, borderColor: hasFile ? '#4caf50' : '#e0e0e0', backgroundColor: hasFile ? '#f1f8e9' : '#fafafa' }}>
            <span style={styles.uploadIcon}>{hasFile ? '📄' : '📂'}</span>
            <span style={styles.uploadText}>{file ? file.name : existingFile ? existingFile : 'Klik untuk upload file Excel (.xlsx, .xls)'}</span>
            <span style={styles.uploadHint}>{hasFile ? 'Klik untuk mengganti file' : 'Maks. 10 MB'}</span>
          </label>
        </div>

        {errors._server && <div style={styles.errorBanner}>{errors._server}</div>}

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
  errorBanner: { padding: '14px 16px', backgroundColor: '#ffebee', borderRadius: '8px', color: '#c62828', fontSize: '14px', marginBottom: '16px', border: '1px solid #ef9a9a' },
  section: { backgroundColor: '#fff', borderRadius: '12px', padding: '28px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#3d3d3d', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #fce4ec' },
  sectionHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #fce4ec' },
  subsectionLabel: { fontSize: '13px', fontWeight: '700', color: '#E91E8C', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', paddingBottom: '6px', borderBottom: '1px solid #fce4ec' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' },
  grid4: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#555' },
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
  serviceCard: { border: '1.5px solid', borderRadius: '10px', marginBottom: '12px', overflow: 'hidden' },
  serviceCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#fafafa', cursor: 'pointer' },
  serviceCardTitle: { fontSize: '14px', fontWeight: '600', color: '#3d3d3d' },
  serviceCardActions: { display: 'flex', alignItems: 'center', gap: '12px' },
  serviceCardBody: { padding: '20px' },
  addServiceBtn: { padding: '8px 16px', backgroundColor: '#fce4ec', color: '#E91E8C', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  deleteServiceBtn: { padding: '6px 12px', backgroundColor: '#fff5f5', color: '#e53935', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
  toggleIcon: { fontSize: '12px', color: '#888' },
  serviceGlobalError: { padding: '10px 14px', backgroundColor: '#ffebee', borderRadius: '8px', color: '#c62828', fontSize: '13px', marginBottom: '12px' },
  autoCalcBox: { display: 'flex', gap: '16px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  autoCalcItem: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '130px' },
  autoCalcLabel: { fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase' },
  autoCalcValue: { fontSize: '15px', fontWeight: '700', color: '#3d3d3d' },
  uploadBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: '2px dashed', borderRadius: '10px', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' },
  uploadIcon: { fontSize: '32px' },
  uploadText: { fontSize: '14px', color: '#555', fontWeight: '500' },
  uploadHint: { fontSize: '12px', color: '#aaa' },
  submitRow: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' },
  cancelBtn: { padding: '12px 24px', backgroundColor: '#fff', color: '#3d3d3d', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  submitBtn: { padding: '12px 32px', backgroundColor: '#E91E8C', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }
}

export default BCFormPage