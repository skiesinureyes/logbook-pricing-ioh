import { useState, useEffect } from 'react'
import masterDataService from '../../services/masterDataService'

const TABS = [
  { key: 'organization', label: 'Organisasi' },
  { key: 'service', label: 'Service' },
  { key: 'teams', label: 'Teams' },
]

const MasterDataPage = () => {
  const [activeTab, setActiveTab] = useState('organization')

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
  const [showModal, setShowModal] = useState(false)
  const [modalConfig, setModalConfig] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({})
  const [error, setError] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

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
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const openModal = (config, item = null) => {
    setModalConfig(config)
    setEditItem(item)
    if (item) {
      const f = {}
      config.fields.forEach(field => { f[field.key] = item[field.key] ?? '' })
      setForm(f)
    } else {
      const f = {}
      config.fields.forEach(field => { f[field.key] = '' })
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
      if (editItem) {
        await modalConfig.updateFn(editItem.id, form)
      } else {
        await modalConfig.createFn(form)
      }
      await fetchAll()
      closeModal()
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (deleteFn, id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return
    try {
      await deleteFn(id)
      await fetchAll()
    } catch (err) {
      alert(err.response?.data?.message || 'Terjadi kesalahan')
    }
  }

  // Modal configs
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

  const subServiceConfig = {
    title: 'Sub-Service',
    fields: [{ key: 'name', label: 'Nama Sub-Service', required: true }],
    createFn: masterDataService.createSubService,
    updateFn: masterDataService.updateSubService
  }

  const serviceConfig = {
    title: 'Service',
    fields: [
      { key: 'name', label: 'Nama Service', required: true },
      {
        key: 'subServiceId', label: 'Sub-Service', required: true, type: 'dropdown',
        options: subServices.map(s => ({ value: s.id, label: s.name }))
      }
    ],
    createFn: masterDataService.createService,
    updateFn: masterDataService.updateService
  }

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

  const renderTable = (title, data, columns, config, deleteFn) => (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>{title}</h3>
        <button onClick={() => openModal(config)} style={styles.addButton}>
          + Tambah {config.title}
        </button>
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
                  <td key={col.key} style={styles.td}>{col.render ? col.render(item) : item[col.key]}</td>
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Master Data Management</h1>
          <p style={styles.subtitle}>Kelola data referensi sistem IsiLogbook</p>
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
          {/* Tab: Organisasi */}
          {activeTab === 'organization' && (
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
                divisionConfig, masterDataService.deleteDivision
              )}
              {renderTable('Department', departments,
                [
                  { key: 'name', label: 'Nama Department' },
                  { key: 'division', label: 'Division', render: (item) => item.Division?.name || '-' },
                  { key: 'group', label: 'Group', render: (item) => item.Division?.Group?.name || '-' }
                ],
                departmentConfig, masterDataService.deleteDepartment
              )}
              {renderTable('Sales Name', salesTeams,
                [
                  { key: 'name', label: 'Nama Sales' },
                  { key: 'group', label: 'Group', render: (item) => item.Department?.Division?.Group?.name || '-' },
                  { key: 'division', label: 'Division', render: (item) => item.Department?.Division?.name || '-' },
                  { key: 'department', label: 'Department', render: (item) => item.Department?.name || '-' }
                ],
                salesTeamConfig, masterDataService.deleteSalesTeam
              )}
            </>
          )}

          {/* Tab: Service */}
          {activeTab === 'service' && (
            <>
              {renderTable('Sub-Service', subServices,
                [{ key: 'name', label: 'Nama Sub-Service' }],
                subServiceConfig, masterDataService.deleteSubService
              )}
              {renderTable('Service', services,
                [
                  { key: 'name', label: 'Nama Service' },
                  { key: 'subService', label: 'Sub-Service', render: (item) => item.SubService?.name || '-' }
                ],
                serviceConfig, masterDataService.deleteService
              )}
            </>
          )}

          {/* Tab: Teams */}
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

      {/* Modal */}
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
              {modalConfig.fields.map(field => (
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
  content: { display: 'flex', flexDirection: 'column', gap: '24px' },
  section: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#3d3d3d' },
  addButton: { padding: '8px 16px', backgroundColor: '#E91E8C', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  emptyText: { color: '#aaa', textAlign: 'center', padding: '24px', fontSize: '14px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { backgroundColor: '#fafafa' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666', borderBottom: '1px solid #f0f0f0' },
  tableRow: { borderBottom: '1px solid #f9f9f9' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#3d3d3d' },
  actionButtons: { display: 'flex', gap: '8px' },
  editButton: { padding: '6px 14px', backgroundColor: '#f5f5f5', color: '#3d3d3d', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
  deleteButton: { padding: '6px 14px', backgroundColor: '#fff5f5', color: '#e53935', border: '1px solid #ffcdd2', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
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