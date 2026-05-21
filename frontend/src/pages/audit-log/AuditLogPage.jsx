import { useState, useEffect, useCallback } from 'react'
import auditLogService from '../../services/auditLogService'

const ACTION_COLORS = {
  CREATE: { bg: '#e8f5e9', color: '#2e7d32', label: 'Create' },
  UPDATE: { bg: '#fff8e1', color: '#f57f17', label: 'Update' },
  DELETE: { bg: '#fce4ec', color: '#c62828', label: 'Delete' }
}

const formatDate = (iso) => {
  if (!iso) return '-'
  const d = new Date(iso)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const AuditLogPage = () => {
  const [logs, setLogs] = useState([])
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 })
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    search: '', action: '', startDate: '', endDate: '', page: 1, limit: 10
  })
  const [searchInput, setSearchInput] = useState('')

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = { ...filters }
      Object.keys(params).forEach(k => { if (!params[k] && params[k] !== 0) delete params[k] })
      const res = await auditLogService.getAll(params)
      setLogs(res.data.data)
      setMeta(res.data.meta)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters(f => ({ ...f, search: searchInput, page: 1 }))
  }

  const handleFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value, page: 1 }))
  }

  const handlePage = (p) => setFilters(f => ({ ...f, page: p }))

  const handleReset = () => {
    setSearchInput('')
    setFilters({ search: '', action: '', startDate: '', endDate: '', page: 1, limit: 10 })
  }

  return (
    <div style={styles.pageWrapper}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Audit Log</h1>
        </div>
      </div>

      <div style={styles.card}>
        {/* Subsection title */}
        <div style={styles.subsectionHeader}>
          <div style={styles.subsectionTitleRow}>
            <div style={styles.subsectionDot} />
            <h2 style={styles.subsectionTitle}>Activity Records</h2>
            {meta.total > 0 && (
              <span style={styles.totalCountBadge}>{meta.total}</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div style={styles.controlsRow}>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              type='text'
              placeholder='Search BC Code, BC Title, or Description...'
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              style={styles.searchInput}
            />
            <button type='submit' style={styles.searchButton}>Search</button>
          </form>

          <div style={styles.rightControls}>
            <input
              type='date'
              style={styles.dateInput}
              value={filters.startDate}
              onChange={e => handleFilter('startDate', e.target.value)}
            />
            <span style={{ color: '#ccc', fontSize: '13px' }}>–</span>
            <input
              type='date'
              style={styles.dateInput}
              value={filters.endDate}
              onChange={e => handleFilter('endDate', e.target.value)}
            />
            <select
              style={styles.limitSelect}
              value={filters.action}
              onChange={e => handleFilter('action', e.target.value)}
            >
              <option value=''>All Action</option>
              <option value='CREATE'>Create</option>
              <option value='UPDATE'>Update</option>
              <option value='DELETE'>Delete</option>
            </select>
            <div style={styles.limitWrapper}>
              <span style={styles.limitLabel}>Show</span>
              <select
                value={filters.limit}
                onChange={e => setFilters(f => ({ ...f, limit: parseInt(e.target.value), page: 1 }))}
                style={styles.limitSelect}
              >
                {[10, 20, 30, 40, 50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span style={styles.limitLabel}>per page</span>
            </div>
            <button onClick={handleReset} style={styles.resetButton}>Reset</button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p style={styles.loadingText}>Memuat data...</p>
        ) : logs.length === 0 ? (
          <div style={styles.emptyWrap}>
            <p style={styles.emptyText}>Belum ada aktivitas tercatat</p>
          </div>
        ) : (
          <>
            <div style={styles.tableScroll}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    {['Waktu', 'Aksi', 'BC Code', 'Judul BC', 'Pengguna', 'Role', 'Keterangan'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => {
                    const ac = ACTION_COLORS[log.action] || {}
                    return (
                      <tr key={log.id} style={{ ...styles.tableRow, backgroundColor: i % 2 === 1 ? '#fafafa' : '#fff' }}>
                        <td style={styles.td}>
                          <span style={styles.dateText}>{formatDate(log.createdAt)}</span>
                        </td>
                        <td style={styles.td}>
                          <span style={{ ...styles.badge, backgroundColor: ac.bg, color: ac.color }}>
                            {ac.label || log.action}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.bcCode}>{log.bcCode || '-'}</span>
                        </td>
                        <td style={{ ...styles.td, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {log.bcTitle || '-'}
                        </td>
                        <td style={styles.td}>
                          <div style={styles.userCell}>
                            <div style={styles.avatar}>
                              {log.User?.firstName?.charAt(0)}{log.User?.lastName?.charAt(0)}
                            </div>
                            <span>{log.User ? `${log.User.firstName} ${log.User.lastName}` : '-'}</span>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.roleText}>{log.User?.role || '-'}</span>
                        </td>
                        <td style={{ ...styles.td, minWidth: '260px' }}>
                          <span style={styles.descText}>{log.description || '-'}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination — persis sama dengan BCListPage */}
            <div style={styles.pagination}>
              <span style={styles.paginationInfo}>
                Showing {Math.min(filters.limit, logs.length)} from {meta.total} data
              </span>
              <div style={styles.paginationButtons}>
                <button
                  onClick={() => handlePage(1)}
                  disabled={filters.page === 1}
                  style={{ ...styles.pageButton, opacity: filters.page === 1 ? 0.4 : 1 }}
                >«</button>
                <button
                  onClick={() => handlePage(filters.page - 1)}
                  disabled={filters.page === 1}
                  style={{ ...styles.pageButton, opacity: filters.page === 1 ? 0.4 : 1 }}
                >‹ Prev</button>
                <span style={styles.pageInfo}>Page {filters.page} / {meta.totalPages || 1}</span>
                <button
                  onClick={() => handlePage(filters.page + 1)}
                  disabled={filters.page >= meta.totalPages}
                  style={{ ...styles.pageButton, opacity: filters.page >= meta.totalPages ? 0.4 : 1 }}
                >Next ›</button>
                <button
                  onClick={() => handlePage(meta.totalPages)}
                  disabled={filters.page >= meta.totalPages}
                  style={{ ...styles.pageButton, opacity: filters.page >= meta.totalPages ? 0.4 : 1 }}
                >»</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  pageWrapper: { padding: '32px', backgroundColor: '#f5f5f5', minHeight: '100vh' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#3d3d3d', marginBottom: '4px' },

  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px', overflow: 'hidden' },

  subsectionHeader: { marginBottom: '16px' },
  subsectionTitleRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' },
  subsectionDot: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#E91E8C', flexShrink: 0 },
  subsectionTitle: { fontSize: '16px', fontWeight: '700', color: '#3d3d3d' },
  subsectionDesc: { fontSize: '13px', color: '#888', marginLeft: '20px' },
  totalCountBadge: { padding: '2px 8px', backgroundColor: '#f3e5f5', color: '#6a1b9a', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },

  controlsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '12px', flexWrap: 'wrap' },
  searchForm: { display: 'flex', gap: '8px', flex: 1 },
  searchInput: { flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '14px', outline: 'none' },
  searchButton: { padding: '10px 20px', backgroundColor: '#3d3d3d', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '1000', cursor: 'pointer', whiteSpace: 'nowrap' },
  rightControls: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  dateInput: { padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '13px', outline: 'none', backgroundColor: '#fafafa' },
  limitWrapper: { display: 'flex', alignItems: 'center', gap: '8px' },
  limitLabel: { fontSize: '13px', color: '#666', whiteSpace: 'nowrap' },
  limitSelect: { padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '13px', outline: 'none', backgroundColor: '#fff' },
  resetButton: { padding: '10px 16px', backgroundColor: '#f5f5f5', color: '#555', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' },

  tableScroll: { overflowX: 'auto' },
  table: { borderCollapse: 'collapse', width: '100%' },
  tableHead: { backgroundColor: '#fafafa' },
  th: { padding: '10px 12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap', backgroundColor: '#fafafa' },
  tableRow: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '10px 12px', fontSize: '13px', color: '#3d3d3d', verticalAlign: 'middle' },

  dateText: { color: '#666', fontSize: '12px', whiteSpace: 'nowrap' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' },
  bcCode: { fontFamily: 'monospace', fontSize: '11px', backgroundColor: '#f5f5f5', padding: '2px 7px', borderRadius: '4px', whiteSpace: 'nowrap' },
  userCell: { display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' },
  avatar: {
    width: '28px', height: '28px', borderRadius: '50%',
    backgroundColor: '#fce4ec', color: '#E91E8C',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '10px', fontWeight: '700', flexShrink: 0
  },
  roleText: { fontSize: '12px', color: '#888', whiteSpace: 'nowrap' },
  descText: { color: '#666', fontSize: '12px', lineHeight: '1.6', wordBreak: 'break-word' },

  loadingText: { color: '#888', textAlign: 'center', padding: '32px' },
  emptyWrap: { display: 'flex', justifyContent: 'center', padding: '40px' },
  emptyText: { fontSize: '14px', color: '#aaa' },

  pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f0f0f0' },
  paginationInfo: { fontSize: '13px', color: '#888' },
  paginationButtons: { display: 'flex', alignItems: 'center', gap: '8px' },
  pageButton: { padding: '6px 12px', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
  pageInfo: { fontSize: '13px', color: '#555', padding: '0 4px' },
}

export default AuditLogPage