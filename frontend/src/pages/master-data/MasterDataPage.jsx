// import { useState, useEffect } from 'react'
// import masterDataService from '../../services/masterDataService'

// const TABS = [
//   { key: 'salesHierarchy', label: 'Sales Hierarchy' },
//   { key: 'service', label: 'Service' },
//   { key: 'teams', label: 'Teams' },
// ]

// const MasterDataPage = () => {
//   const [activeTab, setActiveTab] = useState('salesHierarchy')

//   // Data states
//   const [groups, setGroups] = useState([])
//   const [divisions, setDivisions] = useState([])
//   const [departments, setDepartments] = useState([])
//   const [salesTeams, setSalesTeams] = useState([])
//   const [subServices, setSubServices] = useState([])
//   const [services, setServices] = useState([])
//   const [pricingTeams, setPricingTeams] = useState([])
//   const [preSalesTeams, setPreSalesTeams] = useState([])
//   const [loading, setLoading] = useState(true)

//   // Modal state
//   const [showModal, setShowModal] = useState(false)
//   const [modalConfig, setModalConfig] = useState(null)
//   const [editItem, setEditItem] = useState(null)
//   const [form, setForm] = useState({})
//   const [error, setError] = useState('')
//   const [submitLoading, setSubmitLoading] = useState(false)

//   // For service tab: selected service for sub-service context
//   const [selectedServiceForSub, setSelectedServiceForSub] = useState(null)

//   const fetchAll = async () => {
//     setLoading(true)
//     try {
//       const [g, div, dep, st, ss, sv, pt, pst] = await Promise.all([
//         masterDataService.getGroups(),
//         masterDataService.getDivisions(),
//         masterDataService.getDepartments(),
//         masterDataService.getSalesTeams(),
//         masterDataService.getSubServices(),
//         masterDataService.getServices(),
//         masterDataService.getPricingTeams(),
//         masterDataService.getPreSalesTeams(),
//       ])
//       setGroups(g.data.data)
//       setDivisions(div.data.data)
//       setDepartments(dep.data.data)
//       setSalesTeams(st.data.data)
//       setSubServices(ss.data.data)
//       setServices(sv.data.data)
//       setPricingTeams(pt.data.data)
//       setPreSalesTeams(pst.data.data)
//     } catch (err) { console.error(err) }
//     finally { setLoading(false) }
//   }

//   useEffect(() => { fetchAll() }, [])

//   const openModal = (config, item = null) => {
//     setModalConfig(config)
//     setEditItem(item)
//     if (item) {
//       const f = {}
//       config.fields.forEach(field => { f[field.key] = item[field.key] ?? '' })
//       setForm(f)
//     } else {
//       const f = {}
//       config.fields.forEach(field => { f[field.key] = field.defaultValue ?? '' })
//       setForm(f)
//     }
//     setError('')
//     setShowModal(true)
//   }

//   const closeModal = () => {
//     setShowModal(false)
//     setModalConfig(null)
//     setEditItem(null)
//     setForm({})
//     setError('')
//   }

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     setSubmitLoading(true)
//     try {
//       if (editItem) await modalConfig.updateFn(editItem.id, form)
//       else await modalConfig.createFn(form)
//       await fetchAll()
//       closeModal()
//     } catch (err) {
//       setError(err.response?.data?.message || 'Terjadi kesalahan')
//     } finally { setSubmitLoading(false) }
//   }

//   const handleDelete = async (deleteFn, id) => {
//     if (!window.confirm('Yakin ingin menghapus data ini?')) return
//     try { await deleteFn(id); await fetchAll() }
//     catch (err) { alert(err.response?.data?.message || 'Terjadi kesalahan') }
//   }

//   // ── Modal configs ─────────────────────────────────────────────────────────

//   // SALES HIERARCHY
//   const groupConfig = {
//     title: 'Group',
//     fields: [{ key: 'name', label: 'Nama Group', required: true }],
//     createFn: masterDataService.createGroup,
//     updateFn: masterDataService.updateGroup
//   }

//   const divisionConfig = {
//     title: 'Division',
//     fields: [
//       { key: 'name', label: 'Nama Division', required: true },
//       {
//         key: 'groupId', label: 'Group', required: true, type: 'dropdown',
//         options: groups.map(g => ({ value: g.id, label: g.name }))
//       }
//     ],
//     createFn: masterDataService.createDivision,
//     updateFn: masterDataService.updateDivision
//   }

//   const departmentConfig = {
//     title: 'Department',
//     fields: [
//       { key: 'name', label: 'Nama Department', required: true },
//       {
//         key: 'divisionId', label: 'Division', required: true, type: 'dropdown',
//         options: divisions.map(d => ({ value: d.id, label: `${d.name} — ${d.Group?.name || '-'}` }))
//       }
//     ],
//     createFn: masterDataService.createDepartment,
//     updateFn: masterDataService.updateDepartment
//   }

//   const salesTeamConfig = {
//     title: 'Sales Name',
//     fields: [
//       { key: 'name', label: 'Nama Sales', required: true },
//       {
//         key: 'departmentId', label: 'Department', required: true, type: 'dropdown',
//         options: departments.map(d => ({ value: d.id, label: `${d.name} — ${d.Division?.name || '-'}` }))
//       }
//     ],
//     createFn: masterDataService.createSalesTeam,
//     updateFn: masterDataService.updateSalesTeam
//   }

//   // SERVICE
//   const serviceConfig = {
//     title: 'Service',
//     fields: [
//       { key: 'name', label: 'Nama Service', required: true },
//       {
//         key: 'serviceCategory', label: 'Service Segment', required: true, type: 'dropdown',
//         options: [{ value: 'TelCo', label: 'TelCo' }, { value: 'TechCo', label: 'TechCo' }]
//       }
//     ],
//     createFn: masterDataService.createService,
//     updateFn: masterDataService.updateService
//   }

//   const getSubServiceConfig = (parentService) => ({
//     title: `Sub-Service (${parentService?.name})`,
//     fields: [
//       { key: 'name', label: 'Nama Sub-Service', required: true },
//       { key: 'serviceId', label: '', type: 'hidden', defaultValue: parentService?.id }
//     ],
//     createFn: (data) => masterDataService.createSubService({ ...data, serviceId: parentService?.id }),
//     updateFn: masterDataService.updateSubService
//   })

//   // TEAMS
//   const pricingTeamConfig = {
//     title: 'Pricing Team',
//     fields: [{ key: 'name', label: 'Nama Pricing Team', required: true }],
//     createFn: masterDataService.createPricingTeam,
//     updateFn: masterDataService.updatePricingTeam
//   }

//   const preSalesTeamConfig = {
//     title: 'Pre-Sales Team',
//     fields: [{ key: 'name', label: 'Nama Pre-Sales Team', required: true }],
//     createFn: masterDataService.createPreSalesTeam,
//     updateFn: masterDataService.updatePreSalesTeam
//   }

//   // ── Render helpers ────────────────────────────────────────────────────────

//   const renderTable = (title, data, columns, config, deleteFn, addDisabled = false, addDisabledReason = '') => (
//     <div style={styles.section}>
//       <div style={styles.sectionHeader}>
//         <h3 style={styles.sectionTitle}>{title}</h3>
//         <div style={styles.sectionHeaderRight}>
//           {addDisabled && addDisabledReason && (
//             <span style={styles.disabledHint}>{addDisabledReason}</span>
//           )}
//           <button
//             onClick={() => !addDisabled && openModal(config)}
//             style={{ ...styles.addButton, opacity: addDisabled ? 0.4 : 1, cursor: addDisabled ? 'not-allowed' : 'pointer' }}
//             disabled={addDisabled}
//           >
//             + Tambah {config.title}
//           </button>
//         </div>
//       </div>
//       {data.length === 0 ? (
//         <p style={styles.emptyText}>Belum ada data.</p>
//       ) : (
//         <table style={styles.table}>
//           <thead>
//             <tr style={styles.tableHead}>
//               <th style={styles.th}>No</th>
//               {columns.map(col => <th key={col.key} style={styles.th}>{col.label}</th>)}
//               <th style={styles.th}>Aksi</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item, index) => (
//               <tr key={item.id} style={styles.tableRow}>
//                 <td style={styles.td}>{index + 1}</td>
//                 {columns.map(col => (
//                   <td key={col.key} style={styles.td}>{col.render ? col.render(item) : item[col.key] || '-'}</td>
//                 ))}
//                 <td style={styles.td}>
//                   <div style={styles.actionButtons}>
//                     <button onClick={() => openModal(config, item)} style={styles.editButton}>Edit</button>
//                     <button onClick={() => handleDelete(deleteFn, item.id)} style={styles.deleteButton}>Hapus</button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   )

//   // Sub-service table for a specific service
//   const renderSubServiceTable = (parentService) => {
//     const subs = subServices.filter(ss => String(ss.serviceId) === String(parentService.id))
//     const config = getSubServiceConfig(parentService)
//     return (
//       <div style={styles.subSection} key={parentService.id}>
//         <div style={styles.subSectionHeader}>
//           <div style={styles.subSectionTitleRow}>
//             <span style={styles.subSectionDot}></span>
//             <span style={styles.subSectionTitle}>Sub-Service dari: <strong>{parentService.name}</strong></span>
//             <span style={styles.segmentBadge(parentService.serviceCategory)}>{parentService.serviceCategory || '-'}</span>
//           </div>
//           <button onClick={() => openModal(config)} style={styles.addSubBtn}>+ Tambah Sub-Service</button>
//         </div>
//         {subs.length === 0 ? (
//           <p style={styles.emptyTextSmall}>Belum ada sub-service untuk {parentService.name}.</p>
//         ) : (
//           <table style={styles.table}>
//             <thead>
//               <tr style={styles.tableHead}>
//                 <th style={styles.th}>No</th>
//                 <th style={styles.th}>Nama Sub-Service</th>
//                 <th style={styles.th}>Aksi</th>
//               </tr>
//             </thead>
//             <tbody>
//               {subs.map((ss, i) => (
//                 <tr key={ss.id} style={styles.tableRow}>
//                   <td style={styles.td}>{i + 1}</td>
//                   <td style={styles.td}>{ss.name}</td>
//                   <td style={styles.td}>
//                     <div style={styles.actionButtons}>
//                       <button onClick={() => openModal(config, ss)} style={styles.editButton}>Edit</button>
//                       <button onClick={() => handleDelete(masterDataService.deleteSubService, ss.id)} style={styles.deleteButton}>Hapus</button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     )
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <div>
//           <h1 style={styles.title}>Master Data Management</h1>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div style={styles.tabsWrapper}>
//         {TABS.map(tab => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveTab(tab.key)}
//             style={{
//               ...styles.tab,
//               backgroundColor: activeTab === tab.key ? '#E91E8C' : '#fff',
//               color: activeTab === tab.key ? '#fff' : '#555',
//               fontWeight: activeTab === tab.key ? '600' : '400'
//             }}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <p style={styles.loadingText}>Memuat data...</p>
//       ) : (
//         <div style={styles.content}>

//           {/* ── TAB: Sales Hierarchy ── */}
//           {activeTab === 'salesHierarchy' && (
//             <>
//               {renderTable('Group', groups,
//                 [{ key: 'name', label: 'Nama Group' }],
//                 groupConfig, masterDataService.deleteGroup
//               )}

//               {renderTable('Division', divisions,
//                 [
//                   { key: 'name', label: 'Nama Division' },
//                   { key: 'group', label: 'Group', render: (item) => item.Group?.name || '-' }
//                 ],
//                 divisionConfig, masterDataService.deleteDivision,
//                 groups.length === 0, 'Tambah Group terlebih dahulu'
//               )}

//               {renderTable('Department', departments,
//                 [
//                   { key: 'name', label: 'Nama Department' },
//                   { key: 'division', label: 'Division', render: (item) => item.Division?.name || '-' },
//                   { key: 'group', label: 'Group', render: (item) => item.Division?.Group?.name || '-' }
//                 ],
//                 departmentConfig, masterDataService.deleteDepartment,
//                 divisions.length === 0, 'Tambah Division terlebih dahulu'
//               )}

//               {renderTable('Sales Name', salesTeams,
//                 [
//                   { key: 'name', label: 'Nama Sales' },
//                   { key: 'department', label: 'Department', render: (item) => item.Department?.name || '-' },
//                   { key: 'division', label: 'Division', render: (item) => item.Department?.Division?.name || '-' },
//                   { key: 'group', label: 'Group', render: (item) => item.Department?.Division?.Group?.name || '-' }
//                 ],
//                 salesTeamConfig, masterDataService.deleteSalesTeam,
//                 departments.length === 0, 'Tambah Department terlebih dahulu'
//               )}
//             </>
//           )}

//           {/* ── TAB: Service ── */}
//           {activeTab === 'service' && (
//             <>
//               {/* Service table */}
//               {renderTable('Service', services,
//                 [
//                   { key: 'name', label: 'Nama Service' },
//                   {
//                     key: 'serviceCategory', label: 'Segment',
//                     render: (item) => (
//                       <span style={styles.segmentBadge(item.serviceCategory)}>
//                         {item.serviceCategory || '-'}
//                       </span>
//                     )
//                   }
//                 ],
//                 serviceConfig, masterDataService.deleteService
//               )}

//               {/* Sub-service per service */}
//               <div style={styles.section}>
//                 <h3 style={styles.sectionTitle}>Sub-Service</h3>
//                 <p style={styles.subServiceHint}>Click Service below to manage its Sub-Services</p>

//                 {services.length === 0 ? (
//                   <p style={styles.emptyText}>Tambah Service terlebih dahulu.</p>
//                 ) : (
//                   <>
//                     {/* Service selector */}
//                     <div style={styles.serviceSelector}>
//                       {services.map(svc => (
//                         <button
//                           key={svc.id}
//                           onClick={() => setSelectedServiceForSub(
//                             selectedServiceForSub?.id === svc.id ? null : svc
//                           )}
//                           style={{
//                             ...styles.serviceSelectorBtn,
//                             backgroundColor: selectedServiceForSub?.id === svc.id ? '#E91E8C' : '#f5f5f5',
//                             color: selectedServiceForSub?.id === svc.id ? '#fff' : '#3d3d3d',
//                             borderColor: selectedServiceForSub?.id === svc.id ? '#E91E8C' : '#e0e0e0'
//                           }}
//                         >
//                           {svc.name}
//                           <span style={{
//                             ...styles.serviceSelectorBadge,
//                             backgroundColor: selectedServiceForSub?.id === svc.id ? 'rgba(255,255,255,0.25)' : '#e0e0e0',
//                             color: selectedServiceForSub?.id === svc.id ? '#fff' : '#666'
//                           }}>
//                             {subServices.filter(ss => String(ss.serviceId) === String(svc.id)).length}
//                           </span>
//                         </button>
//                       ))}
//                     </div>

//                     {/* Selected service sub-table */}
//                     {selectedServiceForSub && renderSubServiceTable(selectedServiceForSub)}
//                     {!selectedServiceForSub && (
//                       <p style={{ ...styles.emptyText, color: '#aaa', fontStyle: 'italic' }}>
//                         Click one of the Services above to view and manage its Sub-Services.
//                       </p>
//                     )}
//                   </>
//                 )}
//               </div>
//             </>
//           )}

//           {/* ── TAB: Teams ── */}
//           {activeTab === 'teams' && (
//             <>
//               {renderTable('Pricing Team', pricingTeams,
//                 [{ key: 'name', label: 'Nama Pricing Team' }],
//                 pricingTeamConfig, masterDataService.deletePricingTeam
//               )}
//               {renderTable('Pre-Sales Team', preSalesTeams,
//                 [{ key: 'name', label: 'Nama Pre-Sales Team' }],
//                 preSalesTeamConfig, masterDataService.deletePreSalesTeam
//               )}
//             </>
//           )}
//         </div>
//       )}

//       {/* ── Modal ── */}
//       {showModal && modalConfig && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modal}>
//             <div style={styles.modalHeader}>
//               <h2 style={styles.modalTitle}>
//                 {editItem ? `Edit ${modalConfig.title}` : `Tambah ${modalConfig.title}`}
//               </h2>
//               <button onClick={closeModal} style={styles.closeButton}>✕</button>
//             </div>
//             <form onSubmit={handleSubmit} style={styles.form}>
//               {modalConfig.fields.filter(f => f.type !== 'hidden').map(field => (
//                 <div key={field.key} style={styles.formGroup}>
//                   <label style={styles.label}>{field.label}{field.required && ' *'}</label>
//                   {field.type === 'dropdown' ? (
//                     <select
//                       name={field.key}
//                       value={form[field.key] || ''}
//                       onChange={handleChange}
//                       style={styles.input}
//                       required={field.required}
//                     >
//                       <option value=''>-- Pilih {field.label} --</option>
//                       {field.options.map(opt => (
//                         <option key={opt.value} value={opt.value}>{opt.label}</option>
//                       ))}
//                     </select>
//                   ) : (
//                     <input
//                       name={field.key}
//                       type='text'
//                       value={form[field.key] || ''}
//                       onChange={handleChange}
//                       style={styles.input}
//                       placeholder={`Masukkan ${field.label.toLowerCase()}`}
//                       required={field.required}
//                     />
//                   )}
//                 </div>
//               ))}
//               {error && <p style={styles.error}>{error}</p>}
//               <div style={styles.modalFooter}>
//                 <button type='button' onClick={closeModal} style={styles.cancelButton}>Batal</button>
//                 <button
//                   type='submit'
//                   style={{ ...styles.submitButton, opacity: submitLoading ? 0.7 : 1 }}
//                   disabled={submitLoading}
//                 >
//                   {submitLoading ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Tambah'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// const styles = {
//   container: { padding: '32px', backgroundColor: '#f5f5f5', minHeight: '100vh' },
//   header: { marginBottom: '24px' },
//   title: { fontSize: '22px', fontWeight: '700', color: '#3d3d3d', marginBottom: '4px' },
//   subtitle: { fontSize: '14px', color: '#888' },
//   tabsWrapper: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
//   tab: { padding: '8px 20px', border: '1px solid #e0e0e0', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' },
//   loadingText: { color: '#888', textAlign: 'center', padding: '32px' },
//   content: { display: 'flex', flexDirection: 'column', gap: '20px' },

//   depInfo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #90caf9', marginBottom: '4px' },
//   depInfoIcon: { fontSize: '16px', flexShrink: 0 },
//   depInfoText: { fontSize: '13px', color: '#1565c0' },

//   section: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
//   sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
//   sectionHeaderRight: { display: 'flex', alignItems: 'center', gap: '10px' },
//   sectionTitle: { fontSize: '15px', fontWeight: '700', color: '#3d3d3d' },
//   disabledHint: { fontSize: '12px', color: '#e65100', fontStyle: 'italic' },
//   addButton: { padding: '8px 16px', backgroundColor: '#E91E8C', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },

//   emptyText: { color: '#aaa', textAlign: 'center', padding: '20px', fontSize: '14px' },
//   emptyTextSmall: { color: '#aaa', fontSize: '13px', padding: '12px 0', fontStyle: 'italic' },

//   table: { width: '100%', borderCollapse: 'collapse' },
//   tableHead: { backgroundColor: '#fafafa' },
//   th: { padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', borderBottom: '1px solid #f0f0f0' },
//   tableRow: { borderBottom: '1px solid #f9f9f9' },
//   td: { padding: '12px 14px', fontSize: '13px', color: '#3d3d3d' },
//   actionButtons: { display: 'flex', gap: '8px' },
//   editButton: { padding: '5px 12px', backgroundColor: '#f5f5f5', color: '#3d3d3d', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
//   deleteButton: { padding: '5px 12px', backgroundColor: '#fff5f5', color: '#e53935', border: '1px solid #ffcdd2', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },

//   // Service tab
//   subServiceHint: { fontSize: '13px', color: '#888', marginBottom: '12px' },
//   serviceSelector: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' },
//   serviceSelectorBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', border: '1.5px solid', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.15s' },
//   serviceSelectorBadge: { padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' },

//   subSection: { marginTop: '16px', border: '1px solid #f0f0f0', borderRadius: '10px', padding: '16px', backgroundColor: '#fafafa' },
//   subSectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
//   subSectionTitleRow: { display: 'flex', alignItems: 'center', gap: '8px' },
//   subSectionDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E91E8C', flexShrink: 0 },
//   subSectionTitle: { fontSize: '13px', color: '#3d3d3d' },
//   segmentBadge: (cat) => ({
//     padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
//     backgroundColor: cat === 'TelCo' ? '#e3f2fd' : cat === 'TechCo' ? '#f3e5f5' : '#f5f5f5',
//     color: cat === 'TelCo' ? '#1565c0' : cat === 'TechCo' ? '#6a1b9a' : '#888'
//   }),
//   addSubBtn: { padding: '6px 12px', backgroundColor: '#fce4ec', color: '#E91E8C', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },

//   // Modal
//   modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
//   modal: { backgroundColor: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
//   modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
//   modalTitle: { fontSize: '18px', fontWeight: '700', color: '#3d3d3d' },
//   closeButton: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#888' },
//   form: { display: 'flex', flexDirection: 'column', gap: '16px' },
//   formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
//   label: { fontSize: '13px', fontWeight: '600', color: '#555' },
//   input: { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '14px', color: '#3d3d3d', backgroundColor: '#fafafa', outline: 'none', width: '100%', boxSizing: 'border-box' },
//   error: { fontSize: '13px', color: '#e53935', textAlign: 'center' },
//   modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' },
//   cancelButton: { padding: '10px 20px', backgroundColor: '#f5f5f5', color: '#3d3d3d', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
//   submitButton: { padding: '10px 20px', backgroundColor: '#E91E8C', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }
// }

// export default MasterDataPage

import { useState, useEffect } from 'react'
import masterDataService from '../../services/masterDataService'

const TABS = [
  { key: 'salesHierarchy', label: 'Sales Hierarchy' },
  { key: 'service', label: 'Service' },
  { key: 'teams', label: 'Teams' },
]

const MasterDataPage = () => {
  const [activeTab, setActiveTab] = useState('salesHierarchy')

  // Data states
  const [groups, setGroups] = useState([])
  const [divisions, setDivisions] = useState([])
  const [departments, setDepartments] = useState([])
  const [salesTeams, setSalesTeams] = useState([])
  const [subServices, setSubServices] = useState([])
  const [services, setServices] = useState([])
  const [pricingTeams, setPricingTeams] = useState([])
  const [preSalesTeams, setPreSalesTeams] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [modalConfig, setModalConfig] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({})
  const [error, setError] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  // For service tab: selected service for sub-service context
  const [selectedServiceForSub, setSelectedServiceForSub] = useState(null)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [g, div, dep, st, ss, sv, pt, pst] = await Promise.all([
        masterDataService.getGroups(),
        masterDataService.getDivisions(),
        masterDataService.getDepartments(),
        masterDataService.getSalesTeams(),
        masterDataService.getSubServices(),
        masterDataService.getServices(),
        masterDataService.getPricingTeams(),
        masterDataService.getPreSalesTeams(),
      ])
      setGroups(g.data.data)
      setDivisions(div.data.data)
      setDepartments(dep.data.data)
      setSalesTeams(st.data.data)
      setSubServices(ss.data.data)
      setServices(sv.data.data)
      setPricingTeams(pt.data.data)
      setPreSalesTeams(pst.data.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll()
     
  }, [])

  const openModal = (config, item = null) => {
    setModalConfig(config)
    setEditItem(item)
    if (item) {
      const f = {}
      config.fields.forEach(field => { f[field.key] = item[field.key] ?? '' })
      setForm(f)
    } else {
      const f = {}
      config.fields.forEach(field => { f[field.key] = field.defaultValue ?? '' })
      setForm(f)
    }
    setError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalConfig(null)
    setEditItem(null)
    setForm({})
    setError('')
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitLoading(true)
    try {
      if (editItem) await modalConfig.updateFn(editItem.id, form)
      else await modalConfig.createFn(form)
      await fetchAll()
      closeModal()
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan')
    } finally { setSubmitLoading(false) }
  }

  const handleDelete = async (deleteFn, id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return
    try { await deleteFn(id); await fetchAll() }
    catch (err) { alert(err.response?.data?.message || 'Terjadi kesalahan') }
  }

  // ── Modal configs ─────────────────────────────────────────────────────────

  // SALES HIERARCHY
  const groupConfig = {
    title: 'Group',
    fields: [{ key: 'name', label: 'Nama Group', required: true }],
    createFn: masterDataService.createGroup,
    updateFn: masterDataService.updateGroup
  }

  const divisionConfig = {
    title: 'Division',
    fields: [
      { key: 'name', label: 'Nama Division', required: true },
      {
        key: 'groupId', label: 'Group', required: true, type: 'dropdown',
        options: groups.map(g => ({ value: g.id, label: g.name }))
      }
    ],
    createFn: masterDataService.createDivision,
    updateFn: masterDataService.updateDivision
  }

  const departmentConfig = {
    title: 'Department',
    fields: [
      { key: 'name', label: 'Nama Department', required: true },
      {
        key: 'divisionId', label: 'Division', required: true, type: 'dropdown',
        options: divisions.map(d => ({ value: d.id, label: `${d.name} — ${d.Group?.name || '-'}` }))
      }
    ],
    createFn: masterDataService.createDepartment,
    updateFn: masterDataService.updateDepartment
  }

  const salesTeamConfig = {
    title: 'Sales Name',
    fields: [
      { key: 'name', label: 'Nama Sales', required: true },
      {
        key: 'departmentId', label: 'Department', required: true, type: 'dropdown',
        options: departments.map(d => ({ value: d.id, label: `${d.name} — ${d.Division?.name || '-'}` }))
      }
    ],
    createFn: masterDataService.createSalesTeam,
    updateFn: masterDataService.updateSalesTeam
  }

  // SERVICE
  const serviceConfig = {
    title: 'Service',
    fields: [
      { key: 'name', label: 'Nama Service', required: true },
      {
        key: 'serviceCategory', label: 'Service Segment', required: true, type: 'dropdown',
        options: [{ value: 'TelCo', label: 'TelCo' }, { value: 'TechCo', label: 'TechCo' }]
      }
    ],
    createFn: masterDataService.createService,
    updateFn: masterDataService.updateService
  }

  const getSubServiceConfig = (parentService) => ({
    title: `Sub-Service (${parentService?.name})`,
    fields: [
      { key: 'name', label: 'Nama Sub-Service', required: true },
      { key: 'serviceId', label: '', type: 'hidden', defaultValue: parentService?.id }
    ],
    createFn: (data) => masterDataService.createSubService({ ...data, serviceId: parentService?.id }),
    updateFn: masterDataService.updateSubService
  })

  // TEAMS
  const pricingTeamConfig = {
    title: 'Pricing Team',
    fields: [{ key: 'name', label: 'Nama Pricing Team', required: true }],
    createFn: masterDataService.createPricingTeam,
    updateFn: masterDataService.updatePricingTeam
  }

  const preSalesTeamConfig = {
    title: 'Pre-Sales Team',
    fields: [{ key: 'name', label: 'Nama Pre-Sales Team', required: true }],
    createFn: masterDataService.createPreSalesTeam,
    updateFn: masterDataService.updatePreSalesTeam
  }

  // ── Render helpers ────────────────────────────────────────────────────────

  const renderTable = (title, data, columns, config, deleteFn, addDisabled = false, addDisabledReason = '') => (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>{title}</h3>
        <div style={styles.sectionHeaderRight}>
          {addDisabled && addDisabledReason && (
            <span style={styles.disabledHint}>{addDisabledReason}</span>
          )}
          <button
            onClick={() => !addDisabled && openModal(config)}
            style={{ ...styles.addButton, opacity: addDisabled ? 0.4 : 1, cursor: addDisabled ? 'not-allowed' : 'pointer' }}
            disabled={addDisabled}
          >
            + Tambah {config.title}
          </button>
        </div>
      </div>
      {data.length === 0 ? (
        <p style={styles.emptyText}>Belum ada data.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHead}>
              <th style={styles.th}>No</th>
              {columns.map(col => <th key={col.key} style={styles.th}>{col.label}</th>)}
              <th style={styles.th}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} style={styles.tableRow}>
                <td style={styles.td}>{index + 1}</td>
                {columns.map(col => (
                  <td key={col.key} style={styles.td}>{col.render ? col.render(item) : item[col.key] || '-'}</td>
                ))}
                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <button onClick={() => openModal(config, item)} style={styles.editButton}>Edit</button>
                    <button onClick={() => handleDelete(deleteFn, item.id)} style={styles.deleteButton}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )

  // Sub-service table for a specific service
  const renderSubServiceTable = (parentService) => {
    const subs = subServices.filter(ss => String(ss.serviceId) === String(parentService.id))
    const config = getSubServiceConfig(parentService)
    return (
      <div style={styles.subSection} key={parentService.id}>
        <div style={styles.subSectionHeader}>
          <div style={styles.subSectionTitleRow}>
            <span style={styles.subSectionDot}></span>
            <span style={styles.subSectionTitle}>Sub-Service dari: <strong>{parentService.name}</strong></span>
            <span style={styles.segmentBadge(parentService.serviceCategory)}>{parentService.serviceCategory || '-'}</span>
          </div>
          <button onClick={() => openModal(config)} style={styles.addSubBtn}>+ Tambah Sub-Service</button>
        </div>
        {subs.length === 0 ? (
          <p style={styles.emptyTextSmall}>Belum ada sub-service untuk {parentService.name}.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>No</th>
                <th style={styles.th}>Nama Sub-Service</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((ss, i) => (
                <tr key={ss.id} style={styles.tableRow}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={styles.td}>{ss.name}</td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button onClick={() => openModal(config, ss)} style={styles.editButton}>Edit</button>
                      <button onClick={() => handleDelete(masterDataService.deleteSubService, ss.id)} style={styles.deleteButton}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Master Data Management</h1>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsWrapper}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              ...styles.tab,
              backgroundColor: activeTab === tab.key ? '#E91E8C' : '#fff',
              color: activeTab === tab.key ? '#fff' : '#555',
              fontWeight: activeTab === tab.key ? '600' : '400'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={styles.loadingText}>Memuat data...</p>
      ) : (
        <div style={styles.content}>

          {/* ── TAB: Sales Hierarchy ── */}
          {activeTab === 'salesHierarchy' && (
            <>
              {renderTable('Group', groups,
                [{ key: 'name', label: 'Nama Group' }],
                groupConfig, masterDataService.deleteGroup
              )}

              {renderTable('Division', divisions,
                [
                  { key: 'name', label: 'Nama Division' },
                  { key: 'group', label: 'Group', render: (item) => item.Group?.name || '-' }
                ],
                divisionConfig, masterDataService.deleteDivision,
                groups.length === 0, 'Tambah Group terlebih dahulu'
              )}

              {renderTable('Department', departments,
                [
                  { key: 'name', label: 'Nama Department' },
                  { key: 'division', label: 'Division', render: (item) => item.Division?.name || '-' },
                  { key: 'group', label: 'Group', render: (item) => item.Division?.Group?.name || '-' }
                ],
                departmentConfig, masterDataService.deleteDepartment,
                divisions.length === 0, 'Tambah Division terlebih dahulu'
              )}

              {renderTable('Sales Name', salesTeams,
                [
                  { key: 'name', label: 'Nama Sales' },
                  { key: 'department', label: 'Department', render: (item) => item.Department?.name || '-' },
                  { key: 'division', label: 'Division', render: (item) => item.Department?.Division?.name || '-' },
                  { key: 'group', label: 'Group', render: (item) => item.Department?.Division?.Group?.name || '-' }
                ],
                salesTeamConfig, masterDataService.deleteSalesTeam,
                departments.length === 0, 'Tambah Department terlebih dahulu'
              )}
            </>
          )}

          {/* ── TAB: Service ── */}
          {activeTab === 'service' && (
            <>
              {/* Service table */}
              {renderTable('Service', services,
                [
                  { key: 'name', label: 'Nama Service' },
                  {
                    key: 'serviceCategory', label: 'Segment',
                    render: (item) => (
                      <span style={styles.segmentBadge(item.serviceCategory)}>
                        {item.serviceCategory || '-'}
                      </span>
                    )
                  }
                ],
                serviceConfig, masterDataService.deleteService
              )}

              {/* Sub-service per service */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Sub-Service</h3>
                <p style={styles.subServiceHint}>Click Service below to manage its Sub-Services</p>

                {services.length === 0 ? (
                  <p style={styles.emptyText}>Tambah Service terlebih dahulu.</p>
                ) : (
                  <>
                    {/* Service selector */}
                    <div style={styles.serviceSelector}>
                      {services.map(svc => (
                        <button
                          key={svc.id}
                          onClick={() => setSelectedServiceForSub(
                            selectedServiceForSub?.id === svc.id ? null : svc
                          )}
                          style={{
                            ...styles.serviceSelectorBtn,
                            backgroundColor: selectedServiceForSub?.id === svc.id ? '#E91E8C' : '#f5f5f5',
                            color: selectedServiceForSub?.id === svc.id ? '#fff' : '#3d3d3d',
                            borderColor: selectedServiceForSub?.id === svc.id ? '#E91E8C' : '#e0e0e0'
                          }}
                        >
                          {svc.name}
                          <span style={{
                            ...styles.serviceSelectorBadge,
                            backgroundColor: selectedServiceForSub?.id === svc.id ? 'rgba(255,255,255,0.25)' : '#e0e0e0',
                            color: selectedServiceForSub?.id === svc.id ? '#fff' : '#666'
                          }}>
                            {subServices.filter(ss => String(ss.serviceId) === String(svc.id)).length}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Selected service sub-table */}
                    {selectedServiceForSub && renderSubServiceTable(selectedServiceForSub)}
                    {!selectedServiceForSub && (
                      <p style={{ ...styles.emptyText, color: '#aaa', fontStyle: 'italic' }}>
                        Click one of the Services above to view and manage its Sub-Services.
                      </p>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {/* ── TAB: Teams ── */}
          {activeTab === 'teams' && (
            <>
              {renderTable('Pricing Team', pricingTeams,
                [{ key: 'name', label: 'Nama Pricing Team' }],
                pricingTeamConfig, masterDataService.deletePricingTeam
              )}
              {renderTable('Pre-Sales Team', preSalesTeams,
                [{ key: 'name', label: 'Nama Pre-Sales Team' }],
                preSalesTeamConfig, masterDataService.deletePreSalesTeam
              )}
            </>
          )}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && modalConfig && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editItem ? `Edit ${modalConfig.title}` : `Tambah ${modalConfig.title}`}
              </h2>
              <button onClick={closeModal} style={styles.closeButton}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              {modalConfig.fields.filter(f => f.type !== 'hidden').map(field => (
                <div key={field.key} style={styles.formGroup}>
                  <label style={styles.label}>{field.label}{field.required && ' *'}</label>
                  {field.type === 'dropdown' ? (
                    <select
                      name={field.key}
                      value={form[field.key] || ''}
                      onChange={handleChange}
                      style={styles.input}
                      required={field.required}
                    >
                      <option value=''>-- Pilih {field.label} --</option>
                      {field.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name={field.key}
                      type='text'
                      value={form[field.key] || ''}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder={`Masukkan ${field.label.toLowerCase()}`}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.modalFooter}>
                <button type='button' onClick={closeModal} style={styles.cancelButton}>Batal</button>
                <button
                  type='submit'
                  style={{ ...styles.submitButton, opacity: submitLoading ? 0.7 : 1 }}
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '32px', backgroundColor: '#f5f5f5', minHeight: '100vh' },
  header: { marginBottom: '24px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#3d3d3d', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#888' },
  tabsWrapper: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  tab: { padding: '8px 20px', border: '1px solid #e0e0e0', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' },
  loadingText: { color: '#888', textAlign: 'center', padding: '32px' },
  content: { display: 'flex', flexDirection: 'column', gap: '20px' },

  depInfo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #90caf9', marginBottom: '4px' },
  depInfoIcon: { fontSize: '16px', flexShrink: 0 },
  depInfoText: { fontSize: '13px', color: '#1565c0' },

  section: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  sectionHeaderRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  sectionTitle: { fontSize: '15px', fontWeight: '700', color: '#3d3d3d' },
  disabledHint: { fontSize: '12px', color: '#e65100', fontStyle: 'italic' },
  addButton: { padding: '8px 16px', backgroundColor: '#E91E8C', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },

  emptyText: { color: '#aaa', textAlign: 'center', padding: '20px', fontSize: '14px' },
  emptyTextSmall: { color: '#aaa', fontSize: '13px', padding: '12px 0', fontStyle: 'italic' },

  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { backgroundColor: '#fafafa' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', borderBottom: '1px solid #f0f0f0' },
  tableRow: { borderBottom: '1px solid #f9f9f9' },
  td: { padding: '12px 14px', fontSize: '13px', color: '#3d3d3d' },
  actionButtons: { display: 'flex', gap: '8px' },
  editButton: { padding: '5px 12px', backgroundColor: '#f5f5f5', color: '#3d3d3d', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
  deleteButton: { padding: '5px 12px', backgroundColor: '#fff5f5', color: '#e53935', border: '1px solid #ffcdd2', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },

  // Service tab
  subServiceHint: { fontSize: '13px', color: '#888', marginBottom: '12px' },
  serviceSelector: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' },
  serviceSelectorBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', border: '1.5px solid', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.15s' },
  serviceSelectorBadge: { padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' },

  subSection: { marginTop: '16px', border: '1px solid #f0f0f0', borderRadius: '10px', padding: '16px', backgroundColor: '#fafafa' },
  subSectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  subSectionTitleRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  subSectionDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E91E8C', flexShrink: 0 },
  subSectionTitle: { fontSize: '13px', color: '#3d3d3d' },
  segmentBadge: (cat) => ({
    padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
    backgroundColor: cat === 'TelCo' ? '#e3f2fd' : cat === 'TechCo' ? '#f3e5f5' : '#f5f5f5',
    color: cat === 'TelCo' ? '#1565c0' : cat === 'TechCo' ? '#6a1b9a' : '#888'
  }),
  addSubBtn: { padding: '6px 12px', backgroundColor: '#fce4ec', color: '#E91E8C', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },

  // Modal
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  modalTitle: { fontSize: '18px', fontWeight: '700', color: '#3d3d3d' },
  closeButton: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#888' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#555' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '14px', color: '#3d3d3d', backgroundColor: '#fafafa', outline: 'none', width: '100%', boxSizing: 'border-box' },
  error: { fontSize: '13px', color: '#e53935', textAlign: 'center' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' },
  cancelButton: { padding: '10px 20px', backgroundColor: '#f5f5f5', color: '#3d3d3d', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  submitButton: { padding: '10px 20px', backgroundColor: '#E91E8C', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }
}

export default MasterDataPage