import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import businessCaseService from '../../services/businessCaseService'

const STATUS_COLORS = {
  'On Progress': { bg: '#e3f2fd', color: '#1565c0' },
  'Win': { bg: '#e8f5e9', color: '#2e7d32' },
  'Lost': { bg: '#ffebee', color: '#c62828' },
  'Drop Exp': { bg: '#fff3e0', color: '#e65100' },
  'Drop Sls': { bg: '#fff3e0', color: '#e65100' },
  'Double': { bg: '#f3e5f5', color: '#6a1b9a' },
  'Cancel': { bg: '#fafafa', color: '#757575' }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const BCListPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [bcs, setBcs] = useState([])
  const [pendingBcs, setPendingBcs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterBcType, setFilterBcType] = useState('')
  const [sort, setSort] = useState('createdAt')
  const [order, setOrder] = useState('DESC')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({})
  const [exportLoading, setExportLoading] = useState(false)

  const canEdit = ['Admin', 'Staf'].includes(user?.role)

  const fetchBCs = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 20, sort, order }
      if (search) params.search = search
      if (filterStatus) params.status = filterStatus
      if (filterBcType) params.bcType = filterBcType

      const [bcRes, pendingRes] = await Promise.all([
        businessCaseService.getAll(params),
        businessCaseService.getPendingFollowUp()
      ])

      setBcs(bcRes.data.data)
      setMeta(bcRes.data.meta)
      setPendingBcs(pendingRes.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBCs() }, [page, sort, order])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchBCs()
  }

  const handleSort = (col) => {
    if (sort === col) {
      setOrder(order === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSort(col)
      setOrder('ASC')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus Business Case ini?')) return
    try {
      await businessCaseService.delete(id)
      fetchBCs()
    } catch (err) {
      alert(err.response?.data?.message || 'Terjadi kesalahan')
    }
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (filterStatus) params.status = filterStatus
      if (filterBcType) params.bcType = filterBcType

      const res = await businessCaseService.exportExcel(params)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `business_cases_${Date.now()}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      alert('Gagal mengekspor data')
    } finally {
      setExportLoading(false)
    }
  }

  const getServiceNames = (bc) => {
    if (!bc.ServiceDetails || bc.ServiceDetails.length === 0) return '-'
    return bc.ServiceDetails.map(sd => sd.Service?.name || '-').join(', ')
  }

  const getSubServiceNames = (bc) => {
    if (!bc.ServiceDetails || bc.ServiceDetails.length === 0) return '-'
    const unique = [...new Set(bc.ServiceDetails.map(sd => sd.Service?.SubService?.name || '-'))]
    return unique.join(', ')
  }

  const SortIcon = ({ col }) => {
    if (sort !== col) return <span style={{ color: '#ccc' }}> ↕</span>
    return <span style={{ color: '#E91E8C' }}>{order === 'ASC' ? ' ↑' : ' ↓'}</span>
  }

  const renderActionButtons = (bc) => (
    <div style={styles.actionButtons}>
      <button onClick={() => navigate(`/logbook/${bc.id}`)} style={styles.viewButton}>View</button>
      {canEdit && (
        <>
          <button onClick={() => navigate(`/logbook/${bc.id}/edit`)} style={styles.editButton}>Edit</button>
          <button onClick={() => handleDelete(bc.id)} style={styles.deleteButton}>Hapus</button>
        </>
      )}
    </div>
  )

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Logbook Business Case</h1>
          <p style={styles.subtitle}>Pengelolaan data Business Case Divisi Commercial Pricing</p>
        </div>
        {canEdit && (
          <button onClick={() => navigate('/logbook/add')} style={styles.addButton}>
            + Tambah BC
          </button>
        )}
      </div>

      {/* Tabel Tindak Lanjut Tertunda */}
      {pendingBcs.length > 0 && (
        <div style={styles.pendingSection}>
          <div style={styles.pendingHeader}>
            <span style={styles.pendingBadge}>⚠ Tindak Lanjut Tertunda</span>
            <span style={styles.pendingCount}>{pendingBcs.length} BC belum diperbarui {'>'} 14 hari</span>
          </div>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>Aksi</th>
                  <th style={styles.th}>BC Code</th>
                  <th style={styles.th}>BC Title</th>
                  <th style={styles.th}>Cust Name</th>
                  <th style={styles.th}>Service</th>
                  <th style={styles.th}>CF Date</th>
                  <th style={styles.th}>Last Follow Up</th>
                </tr>
              </thead>
              <tbody>
                {pendingBcs.map(bc => (
                  <tr key={bc.id} style={{ ...styles.tableRow, backgroundColor: '#fff8e1' }}>
                    <td style={styles.td}>{renderActionButtons(bc)}</td>
                    <td style={styles.td}><span style={styles.bcCode}>{bc.bcCode || '-'}</span></td>
                    <td style={styles.td}>{bc.bcTitle}</td>
                    <td style={styles.td}>{bc.custName}</td>
                    <td style={styles.td}>{getServiceNames(bc)}</td>
                    <td style={styles.td}>{formatDate(bc.cfDate)}</td>
                    <td style={{ ...styles.td, color: '#e65100', fontWeight: '600' }}>
                      {formatDate(bc.lastFollowUpDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div style={styles.filterWrapper}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type='text'
            placeholder='Cari BC Code, judul, atau nama customer...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button type='submit' style={styles.searchButton}>Cari</button>
        </form>

        <div style={styles.filters}>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }} style={styles.filterSelect}>
            <option value=''>Semua Status</option>
            {['On Progress', 'Win', 'Lost', 'Drop Exp', 'Drop Sls', 'Double', 'Cancel'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select value={filterBcType} onChange={(e) => { setFilterBcType(e.target.value); setPage(1) }} style={styles.filterSelect}>
            <option value=''>Semua BC Type</option>
            {['Non-BC', 'BC-CPB', 'BC'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <button onClick={handleExport} style={styles.exportButton} disabled={exportLoading}>
            {exportLoading ? 'Mengekspor...' : '↓ Export Excel'}
          </button>
        </div>
      </div>

      {/* Tabel Business Case */}
      <div style={styles.tableCard}>
        {loading ? (
          <p style={styles.loadingText}>Memuat data...</p>
        ) : bcs.length === 0 ? (
          <p style={styles.emptyText}>Belum ada data Business Case.</p>
        ) : (
          <>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>Aksi</th>
                    <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleSort('bcCode')}>
                      BC Code <SortIcon col='bcCode' />
                    </th>
                    <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleSort('bcTitle')}>
                      BC Title <SortIcon col='bcTitle' />
                    </th>
                    <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleSort('projectStatus')}>
                      Status <SortIcon col='projectStatus' />
                    </th>
                    <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleSort('lastFollowUpDate')}>
                      Last Follow Up <SortIcon col='lastFollowUpDate' />
                    </th>
                    <th style={styles.th}>BC Type</th>
                    <th style={styles.th}>Project Type</th>
                    <th style={styles.th}>Activity Type</th>
                    <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => handleSort('cfDate')}>
                      CF Date <SortIcon col='cfDate' />
                    </th>
                    <th style={styles.th}>Cust Name</th>
                    <th style={styles.th}>Service</th>
                    <th style={styles.th}>Sub-Service</th>
                  </tr>
                </thead>
                <tbody>
                  {bcs.map(bc => (
                    <tr key={bc.id} style={styles.tableRow}>
                      <td style={styles.td}>{renderActionButtons(bc)}</td>
                      <td style={styles.td}><span style={styles.bcCode}>{bc.bcCode || '-'}</span></td>
                      <td style={{ ...styles.td, maxWidth: '200px' }}>
                        <div style={styles.truncate}>{bc.bcTitle}</div>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: STATUS_COLORS[bc.projectStatus]?.bg || '#f5f5f5',
                          color: STATUS_COLORS[bc.projectStatus]?.color || '#555'
                        }}>
                          {bc.projectStatus}
                        </span>
                      </td>
                      <td style={styles.td}>{formatDate(bc.lastFollowUpDate)}</td>
                      <td style={styles.td}>{bc.bcType}</td>
                      <td style={styles.td}>{bc.projectType}</td>
                      <td style={styles.td}>{bc.activityType}</td>
                      <td style={styles.td}>{formatDate(bc.cfDate)}</td>
                      <td style={styles.td}>{bc.custName}</td>
                      <td style={styles.td}>{getServiceNames(bc)}</td>
                      <td style={styles.td}>{getSubServiceNames(bc)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={styles.pagination}>
              <span style={styles.paginationInfo}>
                Menampilkan {bcs.length} dari {meta.total} data
              </span>
              <div style={styles.paginationButtons}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ ...styles.pageButton, opacity: page === 1 ? 0.4 : 1 }}
                >
                  ← Prev
                </button>
                <span style={styles.pageInfo}>Hal {page} / {meta.totalPages || 1}</span>
                <button
                  onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                  disabled={page >= meta.totalPages}
                  style={{ ...styles.pageButton, opacity: page >= meta.totalPages ? 0.4 : 1 }}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '32px', backgroundColor: '#f5f5f5', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#3d3d3d', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#888' },
  addButton: { padding: '10px 20px', backgroundColor: '#E91E8C', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  pendingSection: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #ffe082' },
  pendingHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  pendingBadge: { fontSize: '14px', fontWeight: '700', color: '#e65100' },
  pendingCount: { fontSize: '13px', color: '#888' },
  filterWrapper: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' },
  searchForm: { display: 'flex', gap: '8px', flex: 1, minWidth: '280px' },
  searchInput: { flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '14px', outline: 'none' },
  searchButton: { padding: '10px 20px', backgroundColor: '#3d3d3d', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  filters: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  filterSelect: { padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '13px', outline: 'none', backgroundColor: '#fff' },
  exportButton: { padding: '10px 16px', backgroundColor: '#fff', color: '#3d3d3d', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' },
  tableCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  tableWrapper: { overflowX: 'auto' },
  loadingText: { color: '#888', textAlign: 'center', padding: '32px' },
  emptyText: { color: '#aaa', textAlign: 'center', padding: '32px', fontSize: '14px' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '1100px' },
  tableHead: { backgroundColor: '#fafafa' },
  th: { padding: '12px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' },
  tableRow: { borderBottom: '1px solid #f9f9f9' },
  td: { padding: '12px 14px', fontSize: '13px', color: '#3d3d3d', whiteSpace: 'nowrap' },
  truncate: { maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  bcCode: { fontFamily: 'monospace', fontSize: '12px', backgroundColor: '#f5f5f5', padding: '2px 8px', borderRadius: '4px' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  actionButtons: { display: 'flex', gap: '4px' },
  viewButton: { padding: '5px 10px', backgroundColor: '#e3f2fd', color: '#1565c0', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' },
  editButton: { padding: '5px 10px', backgroundColor: '#f5f5f5', color: '#3d3d3d', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
  deleteButton: { padding: '5px 10px', backgroundColor: '#fff5f5', color: '#e53935', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
  pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' },
  paginationInfo: { fontSize: '13px', color: '#888' },
  paginationButtons: { display: 'flex', alignItems: 'center', gap: '12px' },
  pageButton: { padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  pageInfo: { fontSize: '13px', color: '#555' }
}

export default BCListPage