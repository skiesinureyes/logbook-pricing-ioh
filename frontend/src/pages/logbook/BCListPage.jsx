// import { useState, useEffect, useRef } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../../store/AuthContext'
// import businessCaseService from '../../services/businessCaseService'

// const formatDate = (date) => {
//   if (!date) return '-'
//   return new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
// }

// const STATUS_COLORS = {
//   'On Progress': { bg: '#e3f2fd', color: '#1565c0' },
//   'Win': { bg: '#e8f5e9', color: '#2e7d32' },
//   'Lost': { bg: '#ffebee', color: '#c62828' },
//   'Drop Exp': { bg: '#fff3e0', color: '#e65100' },
//   'Drop Sls': { bg: '#fff3e0', color: '#e65100' },
//   'Double': { bg: '#f3e5f5', color: '#6a1b9a' },
//   'Cancel': { bg: '#fafafa', color: '#757575' }
// }

// const IconEye = () => (
//   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
//   </svg>
// )
// const IconEdit = () => (
//   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
//     <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
//   </svg>
// )
// const IconTrash = () => (
//   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="3 6 5 6 21 6"/>
//     <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
//     <path d="M10 11v6"/><path d="M14 11v6"/>
//     <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
//   </svg>
// )
// const IconExcel = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
//     <polyline points="14 2 14 8 20 8"/>
//     <line x1="8" y1="13" x2="16" y2="13"/>
//     <line x1="8" y1="17" x2="16" y2="17"/>
//     <line x1="8" y1="9" x2="10" y2="9"/>
//   </svg>
// )
// const IconFilter = () => (
//   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//     <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
//   </svg>
// )
// const IconX = () => (
//   <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//     <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
//   </svg>
// )

// const COLUMNS = [
//   { key: 'bcCode', label: 'BC Code', width: 170 },
//   { key: 'bcTitle', label: 'BC Title', width: 230 },
//   { key: 'projectStatus', label: 'Status', width: 130 },
//   { key: 'lastFollowUpDate', label: 'Last Follow Up', width: 140 },
//   { key: 'bcType', label: 'BC Type', width: 110 },
//   { key: 'projectType', label: 'Project Type', width: 120 },
//   { key: 'activityType', label: 'Activity Type', width: 120 },
//   { key: 'cfDate', label: 'CF Date', width: 120 },
//   { key: 'esReqDate', label: 'ES Req Date', width: 120 },
//   { key: 'cpbDate', label: 'CPB Date', width: 120 },
//   { key: 'rfsDate', label: 'RFS Date', width: 120 },
//   { key: 'custName', label: 'Customer Name', width: 200 },
//   { key: 'lineOfBusiness', label: 'Line of Business', width: 220 },
//   { key: 'contractType', label: 'Contract Type', width: 130 },
//   { key: 'activationType', label: 'Activation Type', width: 140 },
//   { key: 'contractPeriod', label: 'Contract Period', width: 130 },
//   { key: 'sfalId', label: 'SFA ID', width: 130 },
//   { key: 'opportunityId', label: 'Opportunity ID', width: 150 },
//   { key: 'salesOrder', label: 'Sales Order', width: 140 },
//   { key: 'quote', label: 'Quote', width: 130 },
//   { key: 'serviceNames', label: 'Service', width: 160 },
//   { key: 'subServiceNames', label: 'Sub-Service', width: 160 },
//   { key: 'salesTeams', label: 'Sales Name', width: 160 },
//   { key: 'pricingTeam', label: 'Pricing Team', width: 150 },
//   { key: 'preSalesTeam', label: 'Pre-Sales Team', width: 150 },
//   { key: 'pprEligibility', label: 'PPR Eligibility', width: 130 },
//   { key: 'pprStatus', label: 'PPR Status', width: 120 },
//   { key: 'otc', label: 'OTC', width: 160 },
//   { key: 'mrc', label: 'MRC', width: 160 },
//   { key: 'tcv', label: 'TCV', width: 160 },
//   { key: 'totalNetRev', label: 'Total Net Rev', width: 160 },
//   { key: 'y1RevYearly', label: 'Y1 Rev Yearly', width: 160 },
//   { key: 'totalCoS', label: 'Total CoS', width: 160 },
//   { key: 'totalCapex', label: 'Total CAPEX', width: 160 },
//   { key: 'ebitda', label: 'EBITDA', width: 160 },
//   { key: 'ebitdaMargin', label: 'EBITDA Margin', width: 130 },
//   { key: 'npv', label: 'NPV', width: 160 },
//   { key: 'irr', label: 'IRR (%)', width: 100 },
//   { key: 'payback', label: 'Payback', width: 110 },
//   { key: 'wacc', label: 'WACC (%)', width: 100 },
// ]

// const getCellValue = (bc, key) => {
//   switch (key) {
//     case 'lastFollowUpDate': return formatDate(bc.lastFollowUpDate)
//     case 'cfDate': return formatDate(bc.cfDate)
//     case 'rfsDate': return formatDate(bc.rfsDate)
//     case 'esReqDate': return formatDate(bc.esReqDate)
//     case 'cpbDate': return formatDate(bc.cpbDate)
//     case 'serviceNames':
//       return bc.ServiceDetails?.map(sd => sd.Service?.name || '-').join(', ') || '-'
//     case 'subServiceNames': {
//       const u = [...new Set(bc.ServiceDetails?.map(sd => sd.Service?.SubService?.name || '-') || [])]
//       return u.join(', ') || '-'
//     }
//     case 'salesTeams': return bc.SalesTeams?.map(s => s.name).join(', ') || '-'
//     case 'pricingTeam': return bc.PricingTeam?.name || '-'
//     case 'preSalesTeam': return bc.PreSalesTeam?.name || '-'
//     case 'otc': case 'mrc': case 'tcv': case 'totalNetRev': case 'y1RevYearly':
//     case 'totalCoS': case 'totalCapex': case 'ebitda': case 'npv':
//       return bc[key] ? `IDR ${Number(bc[key]).toLocaleString('id-ID')}` : '-'
//     case 'ebitdaMargin':
//       return bc[key] != null ? `${(bc[key] * 100).toFixed(1)}%` : '-'
//     case 'contractPeriod':
//       return bc[key] ? (bc[key] !== 'Other' ? `${bc[key]} months` : 'Other') : '-'
//     default: return bc[key] || '-'
//   }
// }

// const FilterModal = ({ column, allValues, activeValues, onApply, onClose, position }) => {
//   const [search, setSearch] = useState('')
//   const [selected, setSelected] = useState(new Set(activeValues))
//   const filtered = allValues.filter(v => String(v).toLowerCase().includes(search.toLowerCase()))
//   const toggle = (val) => setSelected(prev => { const n = new Set(prev); n.has(val) ? n.delete(val) : n.add(val); return n })
//   const toggleAll = () => setSelected(prev => prev.size === filtered.length ? new Set() : new Set(filtered))

//   return (
//     <>
//       <div style={styles.filterOverlay} onClick={onClose} />
//       <div style={{ ...styles.filterModal, top: position.top, left: position.left }}>
//         <div style={styles.filterModalHeader}>
//           <span style={styles.filterModalTitle}>Filter: {column.label}</span>
//           <button onClick={onClose} style={styles.filterCloseBtn}><IconX /></button>
//         </div>
//         <div style={styles.filterSearch}>
//           <input autoFocus placeholder='Cari nilai...' value={search} onChange={e => setSearch(e.target.value)} style={styles.filterSearchInput} />
//         </div>
//         <div style={styles.filterList}>
//           <label style={styles.filterItem}>
//             <input type='checkbox' checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} style={{ marginRight: '8px' }} />
//             <span style={{ fontWeight: '600', color: '#555', fontSize: '13px' }}>Pilih Semua</span>
//           </label>
//           {filtered.map(val => (
//             <label key={val} style={styles.filterItem}>
//               <input type='checkbox' checked={selected.has(val)} onChange={() => toggle(val)} style={{ marginRight: '8px' }} />
//               <span style={{ fontSize: '13px', color: '#3d3d3d' }}>{val || '(kosong)'}</span>
//             </label>
//           ))}
//           {filtered.length === 0 && <p style={{ fontSize: '13px', color: '#aaa', textAlign: 'center', padding: '16px 0' }}>Tidak ada nilai</p>}
//         </div>
//         <div style={styles.filterFooter}>
//           <button onClick={onClose} style={styles.filterCancelBtn}>Batal</button>
//           <button onClick={() => onApply(column.key, [...selected])} style={styles.filterApplyBtn}>Filter</button>
//         </div>
//       </div>
//     </>
//   )
// }

// const BCTable = ({ data, canEdit, navigate, onDelete, columns, allData, activeFilters, onFilterApply, onFilterOpen, filterBtnRefs, openFilter, filterPos, sort, order, onSort }) => {
//   const filteredData = data.filter(bc =>
//     Object.entries(activeFilters).every(([colKey, values]) => values.includes(getCellValue(bc, colKey)))
//   )

//   const renderActionButtons = (bc) => (
//     <div style={styles.actionButtons}>
//       <button onClick={() => navigate(`/logbook/${bc.id}`)} style={styles.actionBtn} title='Lihat Detail'><IconEye /></button>
//       {canEdit && (
//         <>
//           <button onClick={() => navigate(`/logbook/${bc.id}/edit`)} style={{ ...styles.actionBtn, color: '#1565c0' }} title='Edit'><IconEdit /></button>
//           <button onClick={() => onDelete(bc.id)} style={{ ...styles.actionBtn, color: '#e53935' }} title='Hapus'><IconTrash /></button>
//         </>
//       )}
//     </div>
//   )

//   const renderCell = (bc, col) => {
//     const val = getCellValue(bc, col.key)
//     if (col.key === 'projectStatus') return (
//       <span style={{ ...styles.badge, backgroundColor: STATUS_COLORS[bc.projectStatus]?.bg || '#f5f5f5', color: STATUS_COLORS[bc.projectStatus]?.color || '#555' }}>
//         {bc.projectStatus}
//       </span>
//     )
//     if (col.key === 'pprEligibility') return (
//       <span style={{ ...styles.badge, backgroundColor: bc.pprEligibility === 'Eligible' ? '#e8f5e9' : '#fff3e0', color: bc.pprEligibility === 'Eligible' ? '#2e7d32' : '#e65100' }}>
//         {val}
//       </span>
//     )
//     if (col.key === 'bcCode') return <span style={styles.bcCode}>{val}</span>
//     if (col.key === 'bcTitle') return <div style={{ maxWidth: col.width - 24, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</div>
//     return val
//   }

//   const sortIcon = (colKey) => {
//     if (sort !== colKey) return <span style={{ color: '#ddd', marginLeft: '3px' }}>↕</span>
//     return <span style={{ color: '#E91E8C', marginLeft: '3px' }}>{order === 'ASC' ? '↑' : '↓'}</span>
//   }

//   return (
//     <div style={styles.tableScroll}>
//       <table style={styles.table}>
//         <thead>
//           <tr style={styles.tableHead}>
//             <th style={{ ...styles.thFixed, width: canEdit ? 110 : 70 }}>Action</th>
//             {columns.map(col => {
//               const isFiltered = activeFilters[col.key]?.length > 0
//               return (
//                 <th key={col.key} style={{ ...styles.th, width: col.width, minWidth: col.width }}>
//                   <div style={styles.thInner}>
//                     <span style={{ cursor: 'pointer', flex: 1, userSelect: 'none' }} onClick={() => onSort(col.key)}>
//                       {col.label}{sortIcon(col.key)}
//                     </span>
//                     <button
//                       ref={el => filterBtnRefs.current[col.key] = el}
//                       onClick={() => onFilterOpen(col.key)}
//                       style={{ ...styles.filterIconBtn, color: isFiltered ? '#E91E8C' : '#ccc', backgroundColor: isFiltered ? '#fce4ec' : 'transparent' }}
//                     >
//                       <IconFilter />
//                     </button>
//                   </div>
//                 </th>
//               )
//             })}
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.length === 0
//             ? (
//               <tr>
//                 <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '32px', color: '#aaa', fontSize: '14px' }}>
//                   Tidak ada data
//                 </td>
//               </tr>
//             )
//             : filteredData.map((bc, rowIdx) => (
//               <tr key={bc.id} style={{ ...styles.tableRow, backgroundColor: rowIdx % 2 === 1 ? '#fafafa' : '#fff' }}>
//                 <td style={{ ...styles.tdFixed, width: canEdit ? 110 : 70, backgroundColor: rowIdx % 2 === 1 ? '#fafafa' : '#fff' }}>
//                   {renderActionButtons(bc)}
//                 </td>
//                 {columns.map(col => (
//                   <td key={col.key} style={styles.td}>{renderCell(bc, col)}</td>
//                 ))}
//               </tr>
//             ))
//           }
//         </tbody>
//       </table>
//     </div>
//   )
// }

// const BCListPage = () => {
//   const { user } = useAuth()
//   const navigate = useNavigate()

//   const [bcs, setBcs] = useState([])
//   const [pendingBcs, setPendingBcs] = useState([])
//   const [allBcs, setAllBcs] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [search, setSearch] = useState('')
//   const [sort, setSort] = useState('createdAt')
//   const [order, setOrder] = useState('DESC')
//   const [page, setPage] = useState(1)
//   const [limit, setLimit] = useState(10)
//   const [meta, setMeta] = useState({})
//   const [exportLoading, setExportLoading] = useState(false)
//   const [activeFilters, setActiveFilters] = useState({})
//   const [openFilter, setOpenFilter] = useState(null)
//   const [filterPos, setFilterPos] = useState({ top: 0, left: 0 })
//   const filterBtnRefs = useRef({})

//   const canEdit = ['Admin', 'Staf'].includes(user?.role)

//   const fetchBCs = async () => {
//     setLoading(true)
//     try {
//       const params = { page, limit, sort, order }
//       if (search) params.search = search
//       const [bcRes, pendingRes, allRes] = await Promise.all([
//         businessCaseService.getAll(params),
//         businessCaseService.getPendingFollowUp(),
//         businessCaseService.getAll({ limit: 1000 })
//       ])
//       setBcs(bcRes.data.data)
//       setMeta(bcRes.data.meta)
//       setPendingBcs(pendingRes.data.data)
//       setAllBcs(allRes.data.data)
//     } catch (err) { console.error(err) }
//     finally { setLoading(false) }
//   }

//   useEffect(() => { fetchBCs() }, [page, limit, sort, order])

//   const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchBCs() }

//   const handleSort = (colKey) => {
//     if (sort === colKey) setOrder(o => o === 'ASC' ? 'DESC' : 'ASC')
//     else { setSort(colKey); setOrder('ASC') }
//     setPage(1)
//   }

//   const handleDelete = async (id) => {
//     if (!window.confirm('Yakin ingin menghapus Business Case ini?')) return
//     try { await businessCaseService.delete(id); fetchBCs() }
//     catch (err) { alert(err.response?.data?.message || 'Terjadi kesalahan') }
//   }

//   const handleExport = async () => {
//     setExportLoading(true)
//     try {
//       // Kalau ada filter aktif, export data yang sudah difilter client-side
//       const dataToExport = activeFilterKeys.length > 0
//         ? allBcs.filter(bc => Object.entries(activeFilters).every(([colKey, values]) => values.includes(getCellValue(bc, colKey))))
//         : null

//       if (dataToExport) {
//         // Export dari data yang sudah difilter — kirim IDs ke backend
//         const params = { ids: dataToExport.map(bc => bc.id).join(',') }
//         if (search) params.search = search
//         const res = await businessCaseService.exportExcel(params)
//         const url = window.URL.createObjectURL(new Blob([res.data]))
//         const link = document.createElement('a')
//         link.href = url
//         link.setAttribute('download', `business_cases_${Date.now()}.xlsx`)
//         document.body.appendChild(link)
//         link.click()
//         link.remove()
//       } else {
//         const params = {}
//         if (search) params.search = search
//         const res = await businessCaseService.exportExcel(params)
//         const url = window.URL.createObjectURL(new Blob([res.data]))
//         const link = document.createElement('a')
//         link.href = url
//         link.setAttribute('download', `business_cases_${Date.now()}.xlsx`)
//         document.body.appendChild(link)
//         link.click()
//         link.remove()
//       }
//     } catch { alert('Gagal mengekspor data') }
//     finally { setExportLoading(false) }
//   }

//   const getColumnValues = (colKey) => {
//     const source = activeFilterKeys.length > 0
//       ? bcs.filter(bc => Object.entries(activeFilters)
//           .filter(([k]) => k !== colKey) // exclude filter kolom ini sendiri
//           .every(([k, v]) => v.includes(getCellValue(bc, k))))
//       : bcs
//     return [...new Set(source.map(bc => getCellValue(bc, colKey)).filter(Boolean))].sort()
//   }

//   const handleFilterOpen = (colKey) => {
//     const btn = filterBtnRefs.current[colKey]
//     if (btn) {
//       const rect = btn.getBoundingClientRect()
//       const modalHeight = 320 // estimasi tinggi modal
//       const spaceBelow = window.innerHeight - rect.bottom
//       const top = spaceBelow < modalHeight
//         ? rect.top - modalHeight - 4  // muncul di atas tombol
//         : rect.bottom + 4             // muncul di bawah tombol
//       setFilterPos({
//         top: Math.max(8, top),
//         left: Math.min(rect.left, window.innerWidth - 280)
//       })
//     }
//     setOpenFilter(openFilter === colKey ? null : colKey)
//   }

//   const handleFilterApply = (colKey, values) => {
//     setActiveFilters(prev => {
//       const next = { ...prev }
//       if (values.length === 0) delete next[colKey]
//       else next[colKey] = values
//       return next
//     })
//     setOpenFilter(null)
//     setPage(1)
//   }

//   const clearFilter = (colKey) => setActiveFilters(prev => { const n = { ...prev }; delete n[colKey]; return n })
//   const clearAllFilters = () => setActiveFilters({})
//   const activeFilterKeys = Object.keys(activeFilters)
//   const filteredCount = activeFilterKeys.length > 0
//   ? bcs.filter(bc => Object.entries(activeFilters).every(([colKey, values]) => values.includes(getCellValue(bc, colKey)))).length
//   : meta.total || 0

//   // Pending columns
//   const PENDING_COLUMNS = [
//     { key: 'bcCode', label: 'BC Code', width: 170 },
//     { key: 'bcTitle', label: 'BC Title', width: 230 },
//     { key: 'custName', label: 'Customer Name', width: 200 },
//     { key: 'serviceNames', label: 'Service', width: 160 },
//     { key: 'cfDate', label: 'CF Date', width: 120 },
//     { key: 'lastFollowUpDate', label: 'Last Follow Up', width: 140 },
//   ]

//   return (
//     <div style={styles.pageWrapper}>
//       {/* Page Header */}
//       <div style={styles.pageHeader}>
//         <div>
//           <h1 style={styles.title}>Logbook Business Case</h1>
//         </div>
//       </div>

//       {/* ── Subsection 1: Tindak Lanjut Tertunda ── */}
//       <div style={styles.card}>
//         <div style={styles.subsectionHeader}>
//           <div style={styles.subsectionTitleRow}>
//             <div style={styles.subsectionDot('#e65100')} />
//             <h2 style={styles.subsectionTitle}>Need to Follow Up</h2>
//             {pendingBcs.length > 0 && (
//               <span style={styles.pendingCountBadge}>{pendingBcs.length}</span>
//             )}
//           </div>
//           <p style={styles.subsectionDesc}>
//             {pendingBcs.length > 0
//               ? `${pendingBcs.length} Business Case haven't yet been followed up in the last 14 days`
//               : 'All Business Cases have been updated within the last 14 days'}
//           </p>
//         </div>

//         {pendingBcs.length === 0 ? (
//           <div style={styles.emptyPending}>
//             <p style={styles.emptyPendingText}>No Business Cases need to be followed up.</p>
//           </div>
//         ) : (
//           <div style={{ overflowX: 'auto' }}>
//             <table style={{ borderCollapse: 'collapse', width: '100%' }}>
//               <thead>
//                 <tr style={styles.tableHead}>
//                   <th style={styles.thFixed}>Action</th>
//                   <th style={styles.th}>BC Code</th>
//                   <th style={styles.th}>BC Title</th>
//                   <th style={styles.th}>Customer Name</th>
//                   <th style={styles.th}>Service</th>
//                   <th style={styles.th}>CF Date</th>
//                   <th style={styles.th}>Last Follow Up</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pendingBcs.map((bc, rowIdx) => (
//                   <tr key={bc.id} style={{ ...styles.tableRow, backgroundColor: rowIdx % 2 === 1 ? '#fafafa' : '#fff' }}>
//                     <td style={{ ...styles.tdFixed, backgroundColor: rowIdx % 2 === 1 ? '#fafafa' : '#fff' }}>
//                       <div style={styles.actionButtons}>
//                         <button onClick={() => navigate(`/logbook/${bc.id}`)} style={styles.actionBtn} title='Lihat Detail'><IconEye /></button>
//                         {canEdit && (
//                           <>
//                             <button onClick={() => navigate(`/logbook/${bc.id}/edit`)} style={{ ...styles.actionBtn, color: '#1565c0' }} title='Edit'><IconEdit /></button>
//                             <button onClick={() => handleDelete(bc.id)} style={{ ...styles.actionBtn, color: '#e53935' }} title='Hapus'><IconTrash /></button>
//                           </>
//                         )}
//                       </div>
//                     </td>
//                     <td style={styles.td}><span style={styles.bcCode}>{bc.bcCode || '-'}</span></td>
//                     <td style={styles.td}>{bc.bcTitle}</td>
//                     <td style={styles.td}>{bc.custName}</td>
//                     <td style={styles.td}>{bc.ServiceDetails?.map(sd => sd.Service?.name || '-').join(', ') || '-'}</td>
//                     <td style={styles.td}>{formatDate(bc.cfDate)}</td>
//                     <td style={{ ...styles.td, color: '#e65100', fontWeight: '1000' }}>{formatDate(bc.lastFollowUpDate)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* ── Subsection 2: All Business Cases ── */}
//       <div style={styles.card}>
//         <div style={styles.subsectionHeader}>
//           <div style={styles.subsectionTitleRow}>
//             <div style={styles.subsectionDot('#E91E8C')} />
//             <h2 style={styles.subsectionTitle}>All Business Cases</h2>
//             {meta.total > 0 && <span style={styles.totalCountBadge}>{meta.total}</span>}
//           </div>
//         </div>

//         {/* Controls */}
//         <div style={styles.controlsRow}>
//           <form onSubmit={handleSearch} style={styles.searchForm}>
//             <input
//               type='text'
//               placeholder='Search for BC Code, BC Title, or Customer Name...'
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               style={styles.searchInput}
//             />
//             <button type='submit' style={styles.searchButton}>Search</button>
//           </form>
//           <div style={styles.rightControls}>
//             <div style={styles.limitWrapper}>
//               <span style={styles.limitLabel}>Show</span>
//               <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1) }} style={styles.limitSelect}>
//                 {[10, 20, 30, 40, 50].map(n => <option key={n} value={n}>{n}</option>)}
//               </select>
//               <span style={styles.limitLabel}>per page</span>
//             </div>
//             <button onClick={handleExport} style={styles.exportButton} disabled={exportLoading}>
//               <IconExcel />
//               <span>{exportLoading ? 'Exporting...' : 'Export Excel'}</span>
//             </button>
//             {canEdit && (
//               <button onClick={() => navigate('/logbook/add')} style={styles.addButton}>+ Add New BC</button>
//             )}
//           </div>
//         </div>

//         {/* Filter chips */}
//         {activeFilterKeys.length > 0 && (
//           <div style={styles.chipRow}>
//             {activeFilterKeys.map(colKey => {
//               const col = COLUMNS.find(c => c.key === colKey)
//               return (
//                 <div key={colKey} style={styles.chip}>
//                   <span style={styles.chipText}>Filter: {col?.label} ({activeFilters[colKey].length})</span>
//                   <button onClick={() => clearFilter(colKey)} style={styles.chipClose}><IconX /></button>
//                 </div>
//               )
//             })}
//             <button onClick={clearAllFilters} style={styles.clearAllBtn}>Clear All Filter</button>
//           </div>
//         )}

//         {loading ? (
//           <p style={styles.loadingText}>Memuat data...</p>
//         ) : (
//           <>
//             <BCTable
//               data={bcs}
//               canEdit={canEdit}
//               navigate={navigate}
//               onDelete={handleDelete}
//               columns={COLUMNS}
//               allData={allBcs}
//               activeFilters={activeFilters}
//               onFilterApply={handleFilterApply}
//               onFilterOpen={handleFilterOpen}
//               filterBtnRefs={filterBtnRefs}
//               openFilter={openFilter}
//               filterPos={filterPos}
//               sort={sort}
//               order={order}
//               onSort={handleSort}
//             />

//             {/* Pagination */}
//             <div style={styles.pagination}>
//               <span style={styles.paginationInfo}>
//                 Showing {activeFilterKeys.length > 0 ? filteredCount : Math.min(limit, bcs.length)} from {filteredCount} data
//               </span>
//               <div style={styles.paginationButtons}>
//                 <button onClick={() => setPage(1)} disabled={page === 1} style={{ ...styles.pageButton, opacity: page === 1 ? 0.4 : 1 }}>«</button>
//                 <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ ...styles.pageButton, opacity: page === 1 ? 0.4 : 1 }}>‹ Prev</button>
//                 <span style={styles.pageInfo}>Page {page} / {meta.totalPages || 1}</span>
//                 <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page >= meta.totalPages} style={{ ...styles.pageButton, opacity: page >= meta.totalPages ? 0.4 : 1 }}>Next ›</button>
//                 <button onClick={() => setPage(meta.totalPages)} disabled={page >= meta.totalPages} style={{ ...styles.pageButton, opacity: page >= meta.totalPages ? 0.4 : 1 }}>»</button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Filter Modal */}
//       {openFilter && (
//         <FilterModal
//           column={COLUMNS.find(c => c.key === openFilter)}
//           allValues={getColumnValues(openFilter)}
//           activeValues={activeFilters[openFilter] || []}
//           onApply={handleFilterApply}
//           onClose={() => setOpenFilter(null)}
//           position={filterPos}
//         />
//       )}
//     </div>
//   )
// }

// const styles = {
//   pageWrapper: { padding: '32px', backgroundColor: '#f5f5f5', minHeight: '100vh' },
//   pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
//   title: { fontSize: '22px', fontWeight: '700', color: '#3d3d3d', marginBottom: '4px' },
//   subtitle: { fontSize: '14px', color: '#888' },

//   card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px', overflow: 'hidden' },

//   subsectionHeader: { marginBottom: '16px' },
//   subsectionTitleRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' },
//   subsectionDot: (color) => ({ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }),
//   subsectionTitle: { fontSize: '16px', fontWeight: '700', color: '#3d3d3d' },
//   subsectionDesc: { fontSize: '13px', color: '#888', marginLeft: '20px' },
//   pendingCountBadge: { padding: '2px 8px', backgroundColor: '#fff3e0', color: '#e65100', borderRadius: '12px', fontSize: '12px', fontWeight: '700' },
//   totalCountBadge: { padding: '2px 8px', backgroundColor: '#f3e5f5', color: '#6a1b9a', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },

//   emptyPending: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', gap: '8px' },
//   emptyPendingIcon: { fontSize: '32px' },
//   emptyPendingText: { fontSize: '14px', color: '#888' },

//   controlsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '12px', flexWrap: 'wrap' },
//   searchForm: { display: 'flex', gap: '8px', flex: 1 },
//   searchInput: { flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '14px', outline: 'none' },
//   searchButton: { padding: '10px 20px', backgroundColor: '#3d3d3d', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '1000', cursor: 'pointer', whiteSpace: 'nowrap' },
//   rightControls: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
//   limitWrapper: { display: 'flex', alignItems: 'center', gap: '8px' },
//   limitLabel: { fontSize: '13px', color: '#666', whiteSpace: 'nowrap' },
//   limitSelect: { padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '13px', outline: 'none', backgroundColor: '#fff' },
//   exportButton: { display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', backgroundColor: '#32BCAD', color: '#fff', border: '1.5px #32BCAD', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '1000', whiteSpace: 'nowrap' },
//   addButton: { padding: '10px 20px', backgroundColor: '#E91E8C', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '1000', cursor: 'pointer', whiteSpace: 'nowrap' },

//   chipRow: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px', alignItems: 'center' },
//   chip: { display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', backgroundColor: '#fce4ec', borderRadius: '20px', border: '1px solid #f48fb1' },
//   chipText: { fontSize: '12px', fontWeight: '600', color: '#c2185b' },
//   chipClose: { background: 'none', border: 'none', cursor: 'pointer', color: '#c2185b', display: 'flex', alignItems: 'center', padding: '0' },
//   clearAllBtn: { fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: '0' },

//   tableScroll: { overflowX: 'auto' },
//   table: { borderCollapse: 'collapse', tableLayout: 'fixed' },
//   tableHead: { backgroundColor: '#fafafa' },
//   thFixed: { padding: '10px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap', position: 'sticky', left: 0, zIndex: 3, backgroundColor: '#fafafa', boxShadow: '2px 0 4px rgba(0,0,0,0.06)' },
//   th: { padding: '10px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap', backgroundColor: '#fafafa' },
//   thInner: { display: 'flex', alignItems: 'center', gap: '4px' },
//   filterIconBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: '4px', display: 'flex', alignItems: 'center', flexShrink: 0 },
//   tableRow: { borderBottom: '1px solid #f0f0f0' },
//   tdFixed: { padding: '10px 12px', fontSize: '13px', color: '#3d3d3d', whiteSpace: 'nowrap', verticalAlign: 'middle', position: 'sticky', left: 0, zIndex: 1, boxShadow: '2px 0 4px rgba(0,0,0,0.06)' },
//   td: { padding: '10px 12px', fontSize: '13px', color: '#3d3d3d', whiteSpace: 'nowrap', verticalAlign: 'middle' },
//   bcCode: { fontFamily: 'monospace', fontSize: '11px', backgroundColor: '#f5f5f5', padding: '2px 7px', borderRadius: '4px' },
//   badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' },
//   actionButtons: { display: 'flex', gap: '4px', alignItems: 'center' },
//   actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', color: '#555' },

//   pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f0f0f0' },
//   paginationInfo: { fontSize: '13px', color: '#888' },
//   paginationButtons: { display: 'flex', alignItems: 'center', gap: '8px' },
//   pageButton: { padding: '6px 12px', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
//   pageInfo: { fontSize: '13px', color: '#555', padding: '0 4px' },
//   loadingText: { color: '#888', textAlign: 'center', padding: '32px' },

//   filterOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 },
//   filterModal: { position: 'fixed', zIndex: 999, backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', width: '260px', overflow: 'hidden' },
//   filterModalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid #f0f0f0' },
//   filterModalTitle: { fontSize: '13px', fontWeight: '700', color: '#3d3d3d' },
//   filterCloseBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' },
//   filterSearch: { padding: '10px 12px', borderBottom: '1px solid #f0f0f0' },
//   filterSearchInput: { width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1.5px solid #e0e0e0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
//   filterList: { maxHeight: '220px', overflowY: 'auto', padding: '6px 0' },
//   filterItem: { display: 'flex', alignItems: 'center', padding: '7px 14px', cursor: 'pointer', userSelect: 'none' },
//   filterFooter: { display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '10px 12px', borderTop: '1px solid #f0f0f0' },
//   filterCancelBtn: { padding: '7px 14px', backgroundColor: '#f5f5f5', color: '#555', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
//   filterApplyBtn: { padding: '7px 14px', backgroundColor: '#E91E8C', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
// }

// export default BCListPage

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import businessCaseService from '../../services/businessCaseService'

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const STATUS_COLORS = {
  'On Progress': { bg: '#e3f2fd', color: '#1565c0' },
  'Win': { bg: '#e8f5e9', color: '#2e7d32' },
  'Lost': { bg: '#ffebee', color: '#c62828' },
  'Drop Exp': { bg: '#fff3e0', color: '#e65100' },
  'Drop Sls': { bg: '#fff3e0', color: '#e65100' },
  'Double': { bg: '#f3e5f5', color: '#6a1b9a' },
  'Cancel': { bg: '#fafafa', color: '#757575' }
}

const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)
const IconExcel = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="16" y2="17"/>
    <line x1="8" y1="9" x2="10" y2="9"/>
  </svg>
)
const IconFilter = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)
const IconX = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const COLUMNS = [
  { key: 'bcCode', label: 'BC Code', width: 170 },
  { key: 'bcTitle', label: 'BC Title', width: 230 },
  { key: 'projectStatus', label: 'Status', width: 130 },
  { key: 'lastFollowUpDate', label: 'Last Follow Up', width: 140 },
  { key: 'bcType', label: 'BC Type', width: 110 },
  { key: 'projectType', label: 'Project Type', width: 120 },
  { key: 'activityType', label: 'Activity Type', width: 120 },
  { key: 'cfDate', label: 'CF Date', width: 120 },
  { key: 'esReqDate', label: 'ES Req Date', width: 120 },
  { key: 'cpbDate', label: 'CPB Date', width: 120 },
  { key: 'rfsDate', label: 'RFS Date', width: 120 },
  { key: 'custName', label: 'Customer Name', width: 200 },
  { key: 'lineOfBusiness', label: 'Line of Business', width: 220 },
  { key: 'contractType', label: 'Contract Type', width: 130 },
  { key: 'activationType', label: 'Activation Type', width: 140 },
  { key: 'contractPeriod', label: 'Contract Period', width: 130 },
  { key: 'sfalId', label: 'SFA ID', width: 130 },
  { key: 'opportunityId', label: 'Opportunity ID', width: 150 },
  { key: 'salesOrder', label: 'Sales Order', width: 140 },
  { key: 'quote', label: 'Quote', width: 130 },
  { key: 'serviceNames', label: 'Service', width: 160 },
  { key: 'subServiceNames', label: 'Sub-Service', width: 160 },
  { key: 'salesTeams', label: 'Sales Name', width: 160 },
  { key: 'pricingTeam', label: 'Pricing Team', width: 150 },
  { key: 'preSalesTeam', label: 'Pre-Sales Team', width: 150 },
  { key: 'pprEligibility', label: 'PPR Eligibility', width: 130 },
  { key: 'pprStatus', label: 'PPR Status', width: 120 },
  { key: 'otc', label: 'OTC', width: 160 },
  { key: 'mrc', label: 'MRC', width: 160 },
  { key: 'tcv', label: 'TCV', width: 160 },
  { key: 'totalNetRev', label: 'Total Net Rev', width: 160 },
  { key: 'y1RevYearly', label: 'Y1 Rev Yearly', width: 160 },
  { key: 'totalCoS', label: 'Total CoS', width: 160 },
  { key: 'totalCapex', label: 'Total CAPEX', width: 160 },
  { key: 'ebitda', label: 'EBITDA', width: 160 },
  { key: 'ebitdaMargin', label: 'EBITDA Margin', width: 130 },
  { key: 'npv', label: 'NPV', width: 160 },
  { key: 'irr', label: 'IRR (%)', width: 100 },
  { key: 'payback', label: 'Payback', width: 110 },
  { key: 'wacc', label: 'WACC (%)', width: 100 },
]

const getCellValue = (bc, key) => {
  switch (key) {
    case 'lastFollowUpDate': return formatDate(bc.lastFollowUpDate)
    case 'cfDate': return formatDate(bc.cfDate)
    case 'rfsDate': return formatDate(bc.rfsDate)
    case 'esReqDate': return formatDate(bc.esReqDate)
    case 'cpbDate': return formatDate(bc.cpbDate)
    case 'serviceNames':
      return bc.ServiceDetails?.map(sd => sd.Service?.name || '-').join(', ') || '-'
    case 'subServiceNames': {
      const u = [...new Set(bc.ServiceDetails?.map(sd => sd.Service?.SubService?.name || '-') || [])]
      return u.join(', ') || '-'
    }
    case 'salesTeams': return bc.SalesTeams?.map(s => s.name).join(', ') || '-'
    case 'pricingTeam': return bc.PricingTeam?.name || '-'
    case 'preSalesTeam': return bc.PreSalesTeam?.name || '-'
    case 'otc': case 'mrc': case 'tcv': case 'totalNetRev': case 'y1RevYearly':
    case 'totalCoS': case 'totalCapex': case 'ebitda': case 'npv':
      return bc[key] ? `IDR ${Number(bc[key]).toLocaleString('id-ID')}` : '-'
    case 'ebitdaMargin':
      return bc[key] != null ? `${(bc[key] * 100).toFixed(1)}%` : '-'
    case 'contractPeriod':
      return bc[key] ? (bc[key] !== 'Other' ? `${bc[key]} months` : 'Other') : '-'
    default: return bc[key] || '-'
  }
}

const FilterModal = ({ column, allValues, activeValues, onApply, onClose, position }) => {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(new Set(activeValues))
  const filtered = allValues.filter(v => String(v).toLowerCase().includes(search.toLowerCase()))
  const toggle = (val) => setSelected(prev => { const n = new Set(prev); n.has(val) ? n.delete(val) : n.add(val); return n })
  const toggleAll = () => setSelected(prev => prev.size === filtered.length ? new Set() : new Set(filtered))

  return (
    <>
      <div style={styles.filterOverlay} onClick={onClose} />
      <div style={{ ...styles.filterModal, top: position.top, left: position.left }}>
        <div style={styles.filterModalHeader}>
          <span style={styles.filterModalTitle}>Filter: {column.label}</span>
          <button onClick={onClose} style={styles.filterCloseBtn}><IconX /></button>
        </div>
        <div style={styles.filterSearch}>
          <input autoFocus placeholder='Cari nilai...' value={search} onChange={e => setSearch(e.target.value)} style={styles.filterSearchInput} />
        </div>
        <div style={styles.filterList}>
          <label style={styles.filterItem}>
            <input type='checkbox' checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} style={{ marginRight: '8px' }} />
            <span style={{ fontWeight: '600', color: '#555', fontSize: '13px' }}>Pilih Semua</span>
          </label>
          {filtered.map(val => (
            <label key={val} style={styles.filterItem}>
              <input type='checkbox' checked={selected.has(val)} onChange={() => toggle(val)} style={{ marginRight: '8px' }} />
              <span style={{ fontSize: '13px', color: '#3d3d3d' }}>{val || '(kosong)'}</span>
            </label>
          ))}
          {filtered.length === 0 && <p style={{ fontSize: '13px', color: '#aaa', textAlign: 'center', padding: '16px 0' }}>Tidak ada nilai</p>}
        </div>
        <div style={styles.filterFooter}>
          <button onClick={onClose} style={styles.filterCancelBtn}>Batal</button>
          <button onClick={() => onApply(column.key, [...selected])} style={styles.filterApplyBtn}>Filter</button>
        </div>
      </div>
    </>
  )
}

const BCTable = ({ data, canEdit, navigate, onDelete, columns, activeFilters, onFilterOpen, filterBtnRefs, sort, order, onSort }) => {
  const filteredData = data.filter(bc =>
    Object.entries(activeFilters).every(([colKey, values]) => values.includes(getCellValue(bc, colKey)))
  )

  const renderActionButtons = (bc) => (
    <div style={styles.actionButtons}>
      <button onClick={() => navigate(`/logbook/${bc.id}`)} style={styles.actionBtn} title='Lihat Detail'><IconEye /></button>
      {canEdit && (
        <>
          <button onClick={() => navigate(`/logbook/${bc.id}/edit`)} style={{ ...styles.actionBtn, color: '#1565c0' }} title='Edit'><IconEdit /></button>
          <button onClick={() => onDelete(bc.id)} style={{ ...styles.actionBtn, color: '#e53935' }} title='Hapus'><IconTrash /></button>
        </>
      )}
    </div>
  )

  const renderCell = (bc, col) => {
    const val = getCellValue(bc, col.key)
    if (col.key === 'projectStatus') return (
      <span style={{ ...styles.badge, backgroundColor: STATUS_COLORS[bc.projectStatus]?.bg || '#f5f5f5', color: STATUS_COLORS[bc.projectStatus]?.color || '#555' }}>
        {bc.projectStatus}
      </span>
    )
    if (col.key === 'pprEligibility') return (
      <span style={{ ...styles.badge, backgroundColor: bc.pprEligibility === 'Eligible' ? '#e8f5e9' : '#fff3e0', color: bc.pprEligibility === 'Eligible' ? '#2e7d32' : '#e65100' }}>
        {val}
      </span>
    )
    if (col.key === 'bcCode') return <span style={styles.bcCode}>{val}</span>
    if (col.key === 'bcTitle') return <div style={{ maxWidth: col.width - 24, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</div>
    return val
  }

  const sortIcon = (colKey) => {
    if (sort !== colKey) return <span style={{ color: '#ddd', marginLeft: '3px' }}>↕</span>
    return <span style={{ color: '#E91E8C', marginLeft: '3px' }}>{order === 'ASC' ? '↑' : '↓'}</span>
  }

  return (
    <div style={styles.tableScroll}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHead}>
            <th style={{ ...styles.thFixed, width: canEdit ? 110 : 70 }}>Action</th>
            {columns.map(col => {
              const isFiltered = activeFilters[col.key]?.length > 0
              return (
                <th key={col.key} style={{ ...styles.th, width: col.width, minWidth: col.width }}>
                  <div style={styles.thInner}>
                    <span style={{ cursor: 'pointer', flex: 1, userSelect: 'none' }} onClick={() => onSort(col.key)}>
                      {col.label}{sortIcon(col.key)}
                    </span>
                    <button
                      ref={el => filterBtnRefs.current[col.key] = el}
                      onClick={() => onFilterOpen(col.key)}
                      style={{ ...styles.filterIconBtn, color: isFiltered ? '#E91E8C' : '#ccc', backgroundColor: isFiltered ? '#fce4ec' : 'transparent' }}
                    >
                      <IconFilter />
                    </button>
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0
            ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '32px', color: '#aaa', fontSize: '14px' }}>
                  Tidak ada data
                </td>
              </tr>
            )
            : filteredData.map((bc, rowIdx) => (
              <tr key={bc.id} style={{ ...styles.tableRow, backgroundColor: rowIdx % 2 === 1 ? '#fafafa' : '#fff' }}>
                <td style={{ ...styles.tdFixed, width: canEdit ? 110 : 70, backgroundColor: rowIdx % 2 === 1 ? '#fafafa' : '#fff' }}>
                  {renderActionButtons(bc)}
                </td>
                {columns.map(col => (
                  <td key={col.key} style={styles.td}>{renderCell(bc, col)}</td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

const BCListPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [bcs, setBcs] = useState([])
  const [pendingBcs, setPendingBcs] = useState([])
  const [allBcs, setAllBcs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('createdAt')
  const [order, setOrder] = useState('DESC')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [meta, setMeta] = useState({})
  const [exportLoading, setExportLoading] = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [openFilter, setOpenFilter] = useState(null)
  const [filterPos, setFilterPos] = useState({ top: 0, left: 0 })
  const filterBtnRefs = useRef({})

  const canEdit = ['Admin', 'Staf'].includes(user?.role)

  const fetchBCs = async () => {
    setLoading(true)
    try {
      const params = { page, limit, sort, order }
      if (search) params.search = search
      const [bcRes, pendingRes, allRes] = await Promise.all([
        businessCaseService.getAll(params),
        businessCaseService.getPendingFollowUp(),
        businessCaseService.getAll({ limit: 1000 })
      ])
      setBcs(bcRes.data.data)
      setMeta(bcRes.data.meta)
      setPendingBcs(pendingRes.data.data)
      setAllBcs(allRes.data.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBCs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, sort, order])

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchBCs() }

  const handleSort = (colKey) => {
    if (sort === colKey) setOrder(o => o === 'ASC' ? 'DESC' : 'ASC')
    else { setSort(colKey); setOrder('ASC') }
    setPage(1)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus Business Case ini?')) return
    try { await businessCaseService.delete(id); fetchBCs() }
    catch (err) { alert(err.response?.data?.message || 'Terjadi kesalahan') }
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      // Kalau ada filter aktif, export data yang sudah difilter client-side
      const dataToExport = activeFilterKeys.length > 0
        ? allBcs.filter(bc => Object.entries(activeFilters).every(([colKey, values]) => values.includes(getCellValue(bc, colKey))))
        : null

      if (dataToExport) {
        // Export dari data yang sudah difilter — kirim IDs ke backend
        const params = { ids: dataToExport.map(bc => bc.id).join(',') }
        if (search) params.search = search
        const res = await businessCaseService.exportExcel(params)
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `business_cases_${Date.now()}.xlsx`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      } else {
        const params = {}
        if (search) params.search = search
        const res = await businessCaseService.exportExcel(params)
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `business_cases_${Date.now()}.xlsx`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
    } catch { alert('Gagal mengekspor data') }
    finally { setExportLoading(false) }
  }

  const getColumnValues = (colKey) => {
    const source = activeFilterKeys.length > 0
      ? bcs.filter(bc => Object.entries(activeFilters)
          .filter(([k]) => k !== colKey) // exclude filter kolom ini sendiri
          .every(([k, v]) => v.includes(getCellValue(bc, k))))
      : bcs
    return [...new Set(source.map(bc => getCellValue(bc, colKey)).filter(Boolean))].sort()
  }

  const handleFilterOpen = (colKey) => {
    const btn = filterBtnRefs.current[colKey]
    if (btn) {
      const rect = btn.getBoundingClientRect()
      const modalHeight = 320 // estimasi tinggi modal
      const spaceBelow = window.innerHeight - rect.bottom
      const top = spaceBelow < modalHeight
        ? rect.top - modalHeight - 4  // muncul di atas tombol
        : rect.bottom + 4             // muncul di bawah tombol
      setFilterPos({
        top: Math.max(8, top),
        left: Math.min(rect.left, window.innerWidth - 280)
      })
    }
    setOpenFilter(openFilter === colKey ? null : colKey)
  }

  const handleFilterApply = (colKey, values) => {
    setActiveFilters(prev => {
      const next = { ...prev }
      if (values.length === 0) delete next[colKey]
      else next[colKey] = values
      return next
    })
    setOpenFilter(null)
    setPage(1)
  }

  const clearFilter = (colKey) => setActiveFilters(prev => { const n = { ...prev }; delete n[colKey]; return n })
  const clearAllFilters = () => setActiveFilters({})
  const activeFilterKeys = Object.keys(activeFilters)
  const filteredCount = activeFilterKeys.length > 0
  ? bcs.filter(bc => Object.entries(activeFilters).every(([colKey, values]) => values.includes(getCellValue(bc, colKey)))).length
  : meta.total || 0

  // Pending columns
  const PENDING_COLUMNS = [
    { key: 'bcCode', label: 'BC Code', width: 170 },
    { key: 'bcTitle', label: 'BC Title', width: 230 },
    { key: 'custName', label: 'Customer Name', width: 200 },
    { key: 'serviceNames', label: 'Service', width: 160 },
    { key: 'cfDate', label: 'CF Date', width: 120 },
    { key: 'lastFollowUpDate', label: 'Last Follow Up', width: 140 },
  ]

  return (
    <div style={styles.pageWrapper}>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Logbook Business Case</h1>
        </div>
      </div>

      {/* ── Subsection 1: Tindak Lanjut Tertunda ── */}
      <div style={styles.card}>
        <div style={styles.subsectionHeader}>
          <div style={styles.subsectionTitleRow}>
            <div style={styles.subsectionDot('#e65100')} />
            <h2 style={styles.subsectionTitle}>Need to Follow Up</h2>
            {pendingBcs.length > 0 && (
              <span style={styles.pendingCountBadge}>{pendingBcs.length}</span>
            )}
          </div>
          <p style={styles.subsectionDesc}>
            {pendingBcs.length > 0
              ? `${pendingBcs.length} Business Case haven't yet been followed up in the last 14 days`
              : 'All Business Cases have been updated within the last 14 days'}
          </p>
        </div>

        {pendingBcs.length === 0 ? (
          <div style={styles.emptyPending}>
            <p style={styles.emptyPendingText}>No Business Cases need to be followed up.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.thFixed}>Action</th>
                  <th style={styles.th}>BC Code</th>
                  <th style={styles.th}>BC Title</th>
                  <th style={styles.th}>Customer Name</th>
                  <th style={styles.th}>Service</th>
                  <th style={styles.th}>CF Date</th>
                  <th style={styles.th}>Last Follow Up</th>
                </tr>
              </thead>
              <tbody>
                {pendingBcs.map((bc, rowIdx) => (
                  <tr key={bc.id} style={{ ...styles.tableRow, backgroundColor: rowIdx % 2 === 1 ? '#fafafa' : '#fff' }}>
                    <td style={{ ...styles.tdFixed, backgroundColor: rowIdx % 2 === 1 ? '#fafafa' : '#fff' }}>
                      <div style={styles.actionButtons}>
                        <button onClick={() => navigate(`/logbook/${bc.id}`)} style={styles.actionBtn} title='Lihat Detail'><IconEye /></button>
                        {canEdit && (
                          <>
                            <button onClick={() => navigate(`/logbook/${bc.id}/edit`)} style={{ ...styles.actionBtn, color: '#1565c0' }} title='Edit'><IconEdit /></button>
                            <button onClick={() => handleDelete(bc.id)} style={{ ...styles.actionBtn, color: '#e53935' }} title='Hapus'><IconTrash /></button>
                          </>
                        )}
                      </div>
                    </td>
                    <td style={styles.td}><span style={styles.bcCode}>{bc.bcCode || '-'}</span></td>
                    <td style={styles.td}>{bc.bcTitle}</td>
                    <td style={styles.td}>{bc.custName}</td>
                    <td style={styles.td}>{bc.ServiceDetails?.map(sd => sd.Service?.name || '-').join(', ') || '-'}</td>
                    <td style={styles.td}>{formatDate(bc.cfDate)}</td>
                    <td style={{ ...styles.td, color: '#e65100', fontWeight: '1000' }}>{formatDate(bc.lastFollowUpDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Subsection 2: All Business Cases ── */}
      <div style={styles.card}>
        <div style={styles.subsectionHeader}>
          <div style={styles.subsectionTitleRow}>
            <div style={styles.subsectionDot('#E91E8C')} />
            <h2 style={styles.subsectionTitle}>All Business Cases</h2>
            {meta.total > 0 && <span style={styles.totalCountBadge}>{meta.total}</span>}
          </div>
        </div>

        {/* Controls */}
        <div style={styles.controlsRow}>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              type='text'
              placeholder='Search for BC Code, BC Title, or Customer Name...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            <button type='submit' style={styles.searchButton}>Search</button>
          </form>
          <div style={styles.rightControls}>
            <div style={styles.limitWrapper}>
              <span style={styles.limitLabel}>Show</span>
              <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1) }} style={styles.limitSelect}>
                {[10, 20, 30, 40, 50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span style={styles.limitLabel}>per page</span>
            </div>
            <button onClick={handleExport} style={styles.exportButton} disabled={exportLoading}>
              <IconExcel />
              <span>{exportLoading ? 'Exporting...' : 'Export Excel'}</span>
            </button>
            {canEdit && (
              <button onClick={() => navigate('/logbook/add')} style={styles.addButton}>+ Add New BC</button>
            )}
          </div>
        </div>

        {/* Filter chips */}
        {activeFilterKeys.length > 0 && (
          <div style={styles.chipRow}>
            {activeFilterKeys.map(colKey => {
              const col = COLUMNS.find(c => c.key === colKey)
              return (
                <div key={colKey} style={styles.chip}>
                  <span style={styles.chipText}>Filter: {col?.label} ({activeFilters[colKey].length})</span>
                  <button onClick={() => clearFilter(colKey)} style={styles.chipClose}><IconX /></button>
                </div>
              )
            })}
            <button onClick={clearAllFilters} style={styles.clearAllBtn}>Clear All Filter</button>
          </div>
        )}

        {loading ? (
          <p style={styles.loadingText}>Memuat data...</p>
        ) : (
          <>
            <BCTable
              data={bcs}
              canEdit={canEdit}
              navigate={navigate}
              onDelete={handleDelete}
              columns={COLUMNS}
              allData={allBcs}
              activeFilters={activeFilters}
              onFilterApply={handleFilterApply}
              onFilterOpen={handleFilterOpen}
              filterBtnRefs={filterBtnRefs}
              openFilter={openFilter}
              filterPos={filterPos}
              sort={sort}
              order={order}
              onSort={handleSort}
            />

            {/* Pagination */}
            <div style={styles.pagination}>
              <span style={styles.paginationInfo}>
                Showing {activeFilterKeys.length > 0 ? filteredCount : Math.min(limit, bcs.length)} from {filteredCount} data
              </span>
              <div style={styles.paginationButtons}>
                <button onClick={() => setPage(1)} disabled={page === 1} style={{ ...styles.pageButton, opacity: page === 1 ? 0.4 : 1 }}>«</button>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ ...styles.pageButton, opacity: page === 1 ? 0.4 : 1 }}>‹ Prev</button>
                <span style={styles.pageInfo}>Page {page} / {meta.totalPages || 1}</span>
                <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page >= meta.totalPages} style={{ ...styles.pageButton, opacity: page >= meta.totalPages ? 0.4 : 1 }}>Next ›</button>
                <button onClick={() => setPage(meta.totalPages)} disabled={page >= meta.totalPages} style={{ ...styles.pageButton, opacity: page >= meta.totalPages ? 0.4 : 1 }}>»</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filter Modal */}
      {openFilter && (
        <FilterModal
          column={COLUMNS.find(c => c.key === openFilter)}
          allValues={getColumnValues(openFilter)}
          activeValues={activeFilters[openFilter] || []}
          onApply={handleFilterApply}
          onClose={() => setOpenFilter(null)}
          position={filterPos}
        />
      )}
    </div>
  )
}

const styles = {
  pageWrapper: { padding: '32px', backgroundColor: '#f5f5f5', minHeight: '100vh' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#3d3d3d', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#888' },

  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px', overflow: 'hidden' },

  subsectionHeader: { marginBottom: '16px' },
  subsectionTitleRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' },
  subsectionDot: (color) => ({ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }),
  subsectionTitle: { fontSize: '16px', fontWeight: '700', color: '#3d3d3d' },
  subsectionDesc: { fontSize: '13px', color: '#888', marginLeft: '20px' },
  pendingCountBadge: { padding: '2px 8px', backgroundColor: '#fff3e0', color: '#e65100', borderRadius: '12px', fontSize: '12px', fontWeight: '700' },
  totalCountBadge: { padding: '2px 8px', backgroundColor: '#f3e5f5', color: '#6a1b9a', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },

  emptyPending: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', gap: '8px' },
  emptyPendingIcon: { fontSize: '32px' },
  emptyPendingText: { fontSize: '14px', color: '#888' },

  controlsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '12px', flexWrap: 'wrap' },
  searchForm: { display: 'flex', gap: '8px', flex: 1 },
  searchInput: { flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '14px', outline: 'none' },
  searchButton: { padding: '10px 20px', backgroundColor: '#3d3d3d', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '1000', cursor: 'pointer', whiteSpace: 'nowrap' },
  rightControls: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  limitWrapper: { display: 'flex', alignItems: 'center', gap: '8px' },
  limitLabel: { fontSize: '13px', color: '#666', whiteSpace: 'nowrap' },
  limitSelect: { padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '13px', outline: 'none', backgroundColor: '#fff' },
  exportButton: { display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', backgroundColor: '#32BCAD', color: '#fff', border: '1.5px #32BCAD', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '1000', whiteSpace: 'nowrap' },
  addButton: { padding: '10px 20px', backgroundColor: '#E91E8C', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '1000', cursor: 'pointer', whiteSpace: 'nowrap' },

  chipRow: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px', alignItems: 'center' },
  chip: { display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', backgroundColor: '#fce4ec', borderRadius: '20px', border: '1px solid #f48fb1' },
  chipText: { fontSize: '12px', fontWeight: '600', color: '#c2185b' },
  chipClose: { background: 'none', border: 'none', cursor: 'pointer', color: '#c2185b', display: 'flex', alignItems: 'center', padding: '0' },
  clearAllBtn: { fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: '0' },

  tableScroll: { overflowX: 'auto' },
  table: { borderCollapse: 'collapse', tableLayout: 'fixed' },
  tableHead: { backgroundColor: '#fafafa' },
  thFixed: { padding: '10px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap', position: 'sticky', left: 0, zIndex: 3, backgroundColor: '#fafafa', boxShadow: '2px 0 4px rgba(0,0,0,0.06)' },
  th: { padding: '10px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap', backgroundColor: '#fafafa' },
  thInner: { display: 'flex', alignItems: 'center', gap: '4px' },
  filterIconBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: '4px', display: 'flex', alignItems: 'center', flexShrink: 0 },
  tableRow: { borderBottom: '1px solid #f0f0f0' },
  tdFixed: { padding: '10px 12px', fontSize: '13px', color: '#3d3d3d', whiteSpace: 'nowrap', verticalAlign: 'middle', position: 'sticky', left: 0, zIndex: 1, boxShadow: '2px 0 4px rgba(0,0,0,0.06)' },
  td: { padding: '10px 12px', fontSize: '13px', color: '#3d3d3d', whiteSpace: 'nowrap', verticalAlign: 'middle' },
  bcCode: { fontFamily: 'monospace', fontSize: '11px', backgroundColor: '#f5f5f5', padding: '2px 7px', borderRadius: '4px' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' },
  actionButtons: { display: 'flex', gap: '4px', alignItems: 'center' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', color: '#555' },

  pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f0f0f0' },
  paginationInfo: { fontSize: '13px', color: '#888' },
  paginationButtons: { display: 'flex', alignItems: 'center', gap: '8px' },
  pageButton: { padding: '6px 12px', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
  pageInfo: { fontSize: '13px', color: '#555', padding: '0 4px' },
  loadingText: { color: '#888', textAlign: 'center', padding: '32px' },

  filterOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 },
  filterModal: { position: 'fixed', zIndex: 999, backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', width: '260px', overflow: 'hidden' },
  filterModalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid #f0f0f0' },
  filterModalTitle: { fontSize: '13px', fontWeight: '700', color: '#3d3d3d' },
  filterCloseBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' },
  filterSearch: { padding: '10px 12px', borderBottom: '1px solid #f0f0f0' },
  filterSearchInput: { width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1.5px solid #e0e0e0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  filterList: { maxHeight: '220px', overflowY: 'auto', padding: '6px 0' },
  filterItem: { display: 'flex', alignItems: 'center', padding: '7px 14px', cursor: 'pointer', userSelect: 'none' },
  filterFooter: { display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '10px 12px', borderTop: '1px solid #f0f0f0' },
  filterCancelBtn: { padding: '7px 14px', backgroundColor: '#f5f5f5', color: '#555', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
  filterApplyBtn: { padding: '7px 14px', backgroundColor: '#E91E8C', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
}

export default BCListPage