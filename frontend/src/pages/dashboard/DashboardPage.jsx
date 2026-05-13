import { useState, useEffect } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList
} from 'recharts'
import businessCaseService from '../../services/businessCaseService'
import masterDataService from '../../services/masterDataService'

const STATUS_COLORS = {
  'On Progress': '#1565c0',
  'Win': '#2e7d32',
  'Lost': '#c62828',
  'Drop Exp': '#e65100',
  'Drop Sls': '#f57c00',
  'Double': '#6a1b9a',
  'Cancel': '#757575'
}

const SERVICE_COLORS = [
  '#E91E8C', '#1565c0', '#2e7d32', '#e65100', '#6a1b9a',
  '#00838f', '#c62828', '#f57c00', '#283593', '#4e342e'
]

const BC_TYPES = ['Non-BC', 'BC-CPB', 'BC']

// Custom donut label
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, count }) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill='white' textAnchor='middle' dominantBaseline='central' fontSize={13} fontWeight='700'>
      {count}
    </text>
  )
}

// Custom bar label (above bar)
const renderBarLabel = ({ x, y, width, value }) => {
  if (!value) return null
  return (
    <text x={x + width / 2} y={y - 6} fill='#555' textAnchor='middle' fontSize={12} fontWeight='600'>
      {value}
    </text>
  )
}

// Custom stacked bar total label (above bar)
const StackedTotalLabel = ({ x, y, width, value }) => {
  if (!value) return null
  return (
    <text x={x + width / 2} y={y - 6} fill='#3d3d3d' textAnchor='middle' fontSize={12} fontWeight='700'>
      {value}
    </text>
  )
}

const DashboardPage = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState([])
  const [timeView, setTimeView] = useState('monthly')

  // Slicer state
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [bcType, setBcType] = useState('')
  const [serviceType, setServiceType] = useState('')

  useEffect(() => {
    fetchServices()
    fetchStats()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await masterDataService.getServices()
      setServices(res.data.data)
    } catch (err) { console.error(err) }
  }

  const fetchStats = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      if (bcType) params.append('bcType', bcType)
      if (serviceType) params.append('serviceType', serviceType)

      const res = await fetch(`http://localhost:3000/api/business-cases/dashboard/stats?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await res.json()
      setStats(data.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleApply = () => fetchStats()
  const handleReset = () => {
    setStartDate(''); setEndDate(''); setBcType(''); setServiceType('')
    setTimeout(() => fetchStats(), 100)
  }

  const timeData = stats?.bcByServiceTime?.[timeView] || []
  const allServiceNames = stats?.allServiceNames || []

  // Compute total per period for stacked label
  const timeDataWithTotal = timeData.map(d => ({ ...d, _total: d.total }))

  const formatXAxis = (val) => {
    if (timeView === 'monthly') {
      const [y, m] = val.split('-')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
      return `${months[parseInt(m) - 1]} ${y}`
    }
    if (timeView === 'weekly') {
      const d = new Date(val)
      const end = new Date(d); end.setDate(d.getDate() + 6)
      return `${d.getDate()}/${d.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`
    }
    return val
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
        </div>
        <div style={styles.totalBadge}>
          <span style={styles.totalLabel}>Total BC</span>
          <span style={styles.totalNum}>{stats?.totalBC ?? '-'}</span>
        </div>
      </div>

      {/* Slicer */}
      <div style={styles.slicerCard}>
        <div style={styles.slicerRow}>
          <div style={styles.slicerGroup}>
            <label style={styles.slicerLabel}>Start Date</label>
            <input type='date' value={startDate} onChange={e => setStartDate(e.target.value)} style={styles.slicerInput} />
          </div>
          <div style={styles.slicerGroup}>
            <label style={styles.slicerLabel}>End Date</label>
            <input type='date' value={endDate} onChange={e => setEndDate(e.target.value)} style={styles.slicerInput} />
          </div>
          <div style={styles.slicerGroup}>
            <label style={styles.slicerLabel}>BC Type</label>
            <select value={bcType} onChange={e => setBcType(e.target.value)} style={styles.slicerInput}>
              <option value=''>All</option>
              {BC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={styles.slicerGroup}>
            <label style={styles.slicerLabel}>Service Type</label>
            <select value={serviceType} onChange={e => setServiceType(e.target.value)} style={styles.slicerInput}>
              <option value=''>All</option>
              {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div style={styles.slicerBtns}>
            <button onClick={handleApply} style={styles.applyBtn}>Apply Slicer</button>
            <button onClick={handleReset} style={styles.resetBtn}>Reset</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingBox}>Memuat data...</div>
      ) : !stats || stats.totalBC === 0 ? (
        <div style={styles.emptyBox}>
          <span style={{ fontSize: '40px' }}>📊</span>
          <p>Belum ada data untuk ditampilkan</p>
        </div>
      ) : (
        <>
          {/* Row 1: Pie + Bar TCV */}
          <div style={styles.row}>
            {/* Pie Chart: BC by Status */}
            <div style={{ ...styles.chartCard, flex: 1 }}>
              <h3 style={styles.chartTitle}># BC Project by Status</h3>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={stats.bcByStatus}
                    dataKey='count'
                    nameKey='status'
                    cx='40%'
                    cy='50%'
                    innerRadius={70}
                    outerRadius={120}
                    labelLine={false}
                    label={renderCustomLabel}
                  >
                    {stats.bcByStatus.map((entry, i) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#ccc'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [val, name]} />
                  <Legend
                    layout='vertical'
                    align='right'
                    verticalAlign='middle'
                    formatter={(value) => <span style={{ fontSize: '13px', color: '#3d3d3d' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart: TCV by Service */}
            <div style={{ ...styles.chartCard, flex: 1.2 }}>
              <h3 style={styles.chartTitle}>Total Contract Value (TCV) by Service</h3>
              <p style={styles.chartSubtitle}>In Million IDR</p>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={stats.bcTcvByService} margin={{ top: 24, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='service' tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v}`} />
                  <Tooltip formatter={(val) => [`${val.toLocaleString('id-ID')} juta`, 'TCV']} />
                  <Bar dataKey='totalTcvMillions' radius={[6, 6, 0, 0]}>
                    {stats.bcTcvByService.map((_, i) => (
                      <Cell key={i} fill={SERVICE_COLORS[i % SERVICE_COLORS.length]} />
                    ))}
                    <LabelList dataKey='totalTcvMillions' content={renderBarLabel} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: Stacked Bar BC by Service over time */}
          <div style={styles.chartCard}>
            <div style={styles.chartTitleRow}>
              <div>
                <h3 style={styles.chartTitle}># BC Project by Service</h3>
                <p style={styles.chartSubtitle}>Total Business Cases based on Service Type per time period</p>
              </div>
              <div style={styles.timeToggle}>
                {['daily', 'weekly', 'monthly'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTimeView(t)}
                    style={{
                      ...styles.timeBtn,
                      backgroundColor: timeView === t ? '#E91E8C' : '#fff',
                      color: timeView === t ? '#fff' : '#555',
                      fontWeight: timeView === t ? '600' : '400'
                    }}
                  >
                    {t === 'daily' ? 'Daily' : t === 'weekly' ? 'Weekly' : 'Monthly'}
                  </button>
                ))}
              </div>
            </div>

            {timeDataWithTotal.length === 0 ? (
              <div style={styles.emptyBox}>Tidak ada data untuk periode ini</div>
            ) : (
              <ResponsiveContainer width='100%' height={360}>
                <BarChart data={timeDataWithTotal} margin={{ top: 30, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='period' tickFormatter={formatXAxis} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(val, name) => [val, name]}
                    labelFormatter={(label) => formatXAxis(label)}
                  />
                  <Legend
                    verticalAlign='top'
                    formatter={(value) => <span style={{ fontSize: '12px', color: '#3d3d3d' }}>{value}</span>}
                  />
                  {allServiceNames.map((svc, i) => (
                    <Bar
                      key={svc}
                      dataKey={svc}
                      stackId='a'
                      fill={SERVICE_COLORS[i % SERVICE_COLORS.length]}
                      radius={i === allServiceNames.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    >
                      {/* Label per service di tengah stack */}
                      <LabelList
                        dataKey={svc}
                        position='center'
                        style={{ fill: '#fff', fontSize: '11px', fontWeight: '600' }}
                        formatter={(val) => val > 0 ? val : ''}
                      />
                      {/* Total label di atas bar (hanya di service terakhir) */}
                      {i === allServiceNames.length - 1 && (
                        <LabelList dataKey='_total' content={StackedTotalLabel} />
                      )}
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '32px', backgroundColor: '#f5f5f5', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#3d3d3d', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#888' },
  totalBadge: { display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff', padding: '12px 24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  totalNum: { fontSize: '28px', fontWeight: '700', color: '#E91E8C' },
  totalLabel: { fontSize: '12px', color: '#888' },

  slicerCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  slicerRow: { display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' },
  slicerGroup: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '140px' },
  slicerLabel: { fontSize: '12px', fontWeight: '600', color: '#555' },
  slicerInput: { padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '13px', outline: 'none', backgroundColor: '#fafafa' },
  slicerBtns: { display: 'flex', gap: '8px', paddingBottom: '1px' },
  applyBtn: { padding: '9px 20px', backgroundColor: '#E91E8C', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' },
  resetBtn: { padding: '9px 16px', backgroundColor: '#f5f5f5', color: '#555', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' },

  row: { display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' },
  chartCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '0', minWidth: '300px' },
  chartTitleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' },
  chartTitle: { fontSize: '15px', fontWeight: '700', color: '#3d3d3d', marginBottom: '2px' },
  chartSubtitle: { fontSize: '12px', color: '#aaa', marginBottom: '8px' },

  timeToggle: { display: 'flex', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' },
  timeBtn: { padding: '7px 14px', border: 'none', cursor: 'pointer', fontSize: '13px', transition: 'all 0.15s' },

  loadingBox: { textAlign: 'center', padding: '64px', color: '#888', fontSize: '15px' },
  emptyBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '64px', color: '#888', fontSize: '14px' },
}

export default DashboardPage