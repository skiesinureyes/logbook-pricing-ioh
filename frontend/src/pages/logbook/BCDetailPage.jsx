import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import businessCaseService from '../../services/businessCaseService'

const formatDate = (d) => {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
const formatIDR = (val) => {
  if (!val && val !== 0) return '-'
  return 'IDR ' + Number(val).toLocaleString('id-ID')
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

const Field = ({ label, value, fullWidth }) => (
  <div style={{ ...styles.field, gridColumn: fullWidth ? 'span 2' : 'span 1' }}>
    <span style={styles.fieldLabel}>{label}</span>
    <span style={styles.fieldValue}>{value || '-'}</span>
  </div>
)

const SubsectionLabel = ({ label }) => (
  <div style={{ gridColumn: 'span 2', ...styles.subsectionLabel }}>{label}</div>
)

const SectionCard = ({ title, children }) => (
  <div style={styles.section}>
    <h2 style={styles.sectionTitle}>{title}</h2>
    {children}
  </div>
)

const BCDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bc, setBc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloadLoading, setDownloadLoading] = useState(false)

  const canEdit = ['Admin', 'Staf'].includes(user?.role)

  useEffect(() => { fetchBC() }, [id])

  const fetchBC = async () => {
    try {
      const res = await businessCaseService.getById(id)
      setBc(res.data.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleDownload = async () => {
    setDownloadLoading(true)
    try {
      const res = await businessCaseService.downloadFile(id)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', bc.fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch { alert('Gagal mengunduh file') }
    finally { setDownloadLoading(false) }
  }

  if (loading) return <div style={styles.loading}>Memuat data...</div>
  if (!bc) return <div style={styles.loading}>Business Case tidak ditemukan.</div>

  const salesNames = bc.SalesTeams?.map(s => s.name).join(', ') || '-'
  const firstSales = bc.SalesTeams?.[0]

  const ebitdaTierColor = (margin) => {
    const m = (margin || 0) * 100
    if (m < 20) return '#e53935'
    if (m < 33) return '#e65100'
    if (m < 42.5) return '#f9a825'
    return '#2e7d32'
  }

  const ebitdaTier = (margin) => {
    const m = (margin || 0) * 100
    if (m < 20) return '< 20%'
    if (m < 33) return '20 - 33%'
    if (m < 42.5) return '33 - 42.5%'
    return '> 42.5%'
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.breadcrumb}>
            <span style={styles.breadcrumbLink} onClick={() => navigate('/logbook')}>Logbook</span>
            <span style={styles.breadcrumbSep}>/</span>
            <span style={styles.breadcrumbCurrent}>{bc.bcCode || `BC #${bc.id}`}</span>
          </div>
          <h1 style={styles.title}>{bc.bcTitle}</h1>
          <div style={styles.titleMeta}>
            <span style={styles.bcCodeBadge}>{bc.bcCode || '-'}</span>
            <span style={{ ...styles.statusBadge, backgroundColor: STATUS_COLORS[bc.projectStatus]?.bg || '#f5f5f5', color: STATUS_COLORS[bc.projectStatus]?.color || '#555' }}>
              {bc.projectStatus}
            </span>
          </div>
        </div>
        <div style={styles.headerActions}>
          <button onClick={() => navigate('/logbook')} style={styles.backButton}>← Kembali</button>
          {canEdit && (
            <button onClick={() => navigate(`/logbook/${bc.id}/edit`)} style={styles.editButton}>Edit</button>
          )}
        </div>
      </div>

      {/* ── BC Details ── */}
      <SectionCard title='BC Details'>
        <div style={styles.grid2}>
          <Field label='BC Title' value={bc.bcTitle} />
          <Field label='BC Code' value={bc.bcCode} />
          <Field label='BC Type' value={bc.bcType} />
          <Field label='Project Type' value={bc.projectType} />
          <Field label='Activity Type' value={bc.activityType} />
          <Field label='Project Status' value={bc.projectStatus} />
          <Field label='Last Follow Up Date' value={formatDate(bc.lastFollowUpDate)} />
          {bc.followUpNotes && <Field label='Follow Up Notes' value={bc.followUpNotes} fullWidth />}
          <Field label='ES Request Date' value={formatDate(bc.esReqDate)} />
          <Field label='CF Date' value={formatDate(bc.cfDate)} />
          {bc.bcType === 'BC-CPB' && <Field label='CPB Date' value={formatDate(bc.cpbDate)} />}
          <Field label='SFA ID' value={bc.sfalId} />
          <Field label='Opportunity ID' value={bc.opportunityId} />
          <Field label='Sales Order' value={bc.salesOrder} />
          <Field label='Quote' value={bc.quote} />
          <Field label='Customer Name' value={bc.custName} />
          <Field label='Customer Join Year' value={bc.custJoinYear} />
          <Field label='Line of Business' value={bc.lineOfBusiness} fullWidth />
          <Field label='Contract Type' value={bc.contractType} />
          <Field label='Activation Type' value={bc.activationType} />
          <Field label='Contract Period' value={bc.contractPeriod ? (bc.contractPeriod !== 'Other' ? `${bc.contractPeriod} months` : 'Other') : '-'} />
          <Field label='RFS Date' value={formatDate(bc.rfsDate)} />
        </div>
      </SectionCard>

      {/* ── Stakeholders ── */}
      <SectionCard title='Stakeholders Involved'>
        <div style={styles.grid2}>
          <Field label='Sales Name' value={salesNames} />
          <Field label='Group' value={firstSales?.Department?.Division?.Group?.name} />
          <Field label='Division' value={firstSales?.Department?.Division?.name} />
          <Field label='Department' value={firstSales?.Department?.name} />
          <Field label='Pre-Sales Team' value={bc.PreSalesTeam?.name} />
          <Field label='Pricing Team' value={bc.PricingTeam?.name} />
        </div>
      </SectionCard>

      {/* ── Service ── */}
      <SectionCard title='Service'>
        {bc.ServiceDetails?.length > 0 ? bc.ServiceDetails.map((sd, i) => {
          const subSvc = sd.Service?.SubServices?.find(ss => String(ss.id) === String(sd.subServiceId))
          const isMPLS = subSvc?.name === 'MPLS' || sd.Service?.name === 'MPLS'
          const isMIDI = sd.Service?.name === 'MIDI'
          return (
            <div key={sd.id} style={styles.serviceBlock}>
              <div style={styles.serviceBlockTitle}>
                Service {i + 1}
                {sd.serviceSegment && <span style={styles.segmentBadge(sd.serviceSegment)}>{sd.serviceSegment}</span>}
                {sd.Service?.name && <span style={{ marginLeft: '6px', color: '#555' }}>— {sd.Service.name}</span>}
              </div>
              <div style={styles.grid2}>
                <Field label='Service Segment' value={sd.serviceSegment} />
                <Field label='Service Type' value={sd.Service?.name} />
                <Field label='Sub-Service Type' value={subSvc?.name || '-'} />
                <Field label='Total Unit' value={sd.totalUnit} />
                {sd.detailService && <Field label='Detail Service' value={sd.detailService} fullWidth />}
                {!isMPLS && sd.serviceLocation && <Field label='Service Location' value={sd.serviceLocation} />}
                {isMPLS && <Field label='Location A' value={sd.locationA} />}
                {isMPLS && <Field label='Location B' value={sd.locationB} />}
                {isMIDI && <Field label='Total BW/Mbps' value={sd.totalBwPerMbps} />}
                {isMIDI && <Field label='Price/Mbps' value={formatIDR(sd.pricePerMbps)} />}
              </div>
            </div>
          )
        }) : <p style={styles.emptyText}>Tidak ada data service.</p>}
      </SectionCard>

      {/* ── Tender Detail ── */}
      {bc.TenderDetail && (
        <SectionCard title='Tender Details'>
          <div style={styles.grid2}>
            <Field label='Winner Name' value={bc.TenderDetail.winnerName} />
            <Field label='Winning Price' value={formatIDR(bc.TenderDetail.winningPrice)} />
            {bc.TenderDetail.lostReason && <Field label='Lost Reason' value={bc.TenderDetail.lostReason} />}
            <Field label='Reason' value={bc.TenderDetail.reason} fullWidth />
          </div>
        </SectionCard>
      )}

      {/* ── Financial Projection ── */}
      <SectionCard title='Financial Projection'>
        {/* Auto-calculated */}
        <div style={styles.autoCalcBox}>
          <div style={styles.autoCalcItem}>
            <span style={styles.autoCalcLabel}>PPR Eligibility</span>
            <span style={{ ...styles.autoCalcValue, color: bc.pprEligibility === 'Eligible' ? '#2e7d32' : '#e65100' }}>
              {bc.pprEligibility || '-'}
            </span>
          </div>
          <div style={styles.autoCalcItem}>
            <span style={styles.autoCalcLabel}>EBITDA</span>
            <span style={styles.autoCalcValue}>{formatIDR(bc.ebitda)}</span>
          </div>
          <div style={styles.autoCalcItem}>
            <span style={styles.autoCalcLabel}>EBITDA Margin</span>
            <span style={styles.autoCalcValue}>{bc.ebitdaMargin != null ? `${(bc.ebitdaMargin * 100).toFixed(2)}%` : '-'}</span>
          </div>
          <div style={styles.autoCalcItem}>
            <span style={styles.autoCalcLabel}>EBITDA Margin Tier</span>
            <span style={{ ...styles.autoCalcValue, color: ebitdaTierColor(bc.ebitdaMargin), fontSize: '14px' }}>
              {bc.ebitdaMargin != null ? ebitdaTier(bc.ebitdaMargin) : '-'}
            </span>
          </div>
          <div style={styles.autoCalcItem}>
            <span style={styles.autoCalcLabel}>Total OPEX</span>
            <span style={styles.autoCalcValue}>{formatIDR(bc.totalOpex)}</span>
          </div>
        </div>

        <div style={styles.grid2}>
          <Field label='PPR Status' value={bc.pprStatus} />

          <SubsectionLabel label='Charge' />
          <Field label='OTC (One-Time Charge)' value={formatIDR(bc.otc)} />
          <Field label='MRC (Monthly Recurring Charge)' value={formatIDR(bc.mrc)} />

          <SubsectionLabel label='Cost' />
          <Field label='Total CAPEX' value={formatIDR(bc.totalCapex)} />
          <Field label='Total OPEX (auto)' value={formatIDR(bc.totalOpex)} />
          <Field label='Y1 CoS (Cost of Sales)' value={formatIDR(bc.y1CoS)} />
          <Field label='Total CoS (Cost of Sales)' value={formatIDR(bc.totalCoS)} />
          <Field label='Network OPEX' value={formatIDR(bc.networkOpex)} />
          <Field label='Direct OPEX' value={formatIDR(bc.directOpex)} />
          <Field label='Other Direct OPEX' value={formatIDR(bc.otherOpexDirect)} />
          <Field label='Indirect OPEX' value={formatIDR(bc.indirectOpex)} />
          <Field label='Financing Cost' value={formatIDR(bc.financingCost)} />
          <Field label='Marketing Cost' value={formatIDR(bc.marketingCost)} />
          <Field label='Risk Cost' value={formatIDR(bc.riskCost)} />
          <Field label='B2B Direct Overhead' value={formatIDR(bc.b2bDirectOverhead)} />
          <Field label='IOH Overhead' value={formatIDR(bc.iohOverheadAllocation)} />
          <Field label='Contribution Margin' value={formatIDR(bc.contributionMargin)} />

          <SubsectionLabel label='Revenue' />
          <Field label='TCV (Total Contract Value)' value={formatIDR(bc.tcv)} />
          <Field label='Total Net Revenue' value={formatIDR(bc.totalNetRev)} />
          <Field label='Port Only Revenue' value={formatIDR(bc.portOnlyRev)} />
          <Field label='Y1 Revenue Calendar' value={formatIDR(bc.y1RevCalendar)} />
          <Field label='Y1 Revenue Yearly' value={formatIDR(bc.y1RevYearly)} />

          <SubsectionLabel label='Financial Metrics' />
          <Field label='Net Profit' value={formatIDR(bc.netProfit)} />
          <Field label='Total FCF (Free Cash Flow)' value={formatIDR(bc.totalFcf)} />
          <Field label='Total Accumulated FCF' value={formatIDR(bc.totalAccFcf)} />
          <Field label='WACC (%)' value={bc.wacc != null ? `${bc.wacc}%` : '-'} />
          <Field label='NPV' value={formatIDR(bc.npv)} />
          <Field label='IRR (%)' value={bc.irr != null ? `${bc.irr}%` : '-'} />
          <Field label='Payback Period' value={bc.payback != null ? `${bc.payback} tahun` : '-'} />
        </div>
      </SectionCard>

      {/* ── Upload BC ── */}
      <SectionCard title='File Business Case'>
        {bc.fileName ? (
          <div style={styles.fileBox}>
            <div style={styles.fileInfo}>
              <span style={styles.fileIcon}>📄</span>
              <div>
                <p style={styles.fileName}>{bc.fileName}</p>
                <p style={styles.fileDate}>Diunggah pada {formatDate(bc.fileUploadedAt)}</p>
              </div>
            </div>
            <button onClick={handleDownload} style={styles.downloadBtn} disabled={downloadLoading}>
              {downloadLoading ? 'Mengunduh...' : '↓ Download File'}
            </button>
          </div>
        ) : (
          <p style={styles.emptyText}>Belum ada file yang diunggah.</p>
        )}
      </SectionCard>

      <div style={styles.timestamps}>
        <span>Dibuat: {formatDate(bc.createdAt)}</span>
        <span>Diperbarui: {formatDate(bc.updatedAt)}</span>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '32px', backgroundColor: '#f5f5f5', minHeight: '100vh', maxWidth: '1100px', margin: '0 auto' },
  loading: { padding: '64px', textAlign: 'center', color: '#888' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' },
  breadcrumbLink: { fontSize: '13px', color: '#E91E8C', cursor: 'pointer', textDecoration: 'underline' },
  breadcrumbSep: { fontSize: '13px', color: '#aaa' },
  breadcrumbCurrent: { fontSize: '13px', color: '#888' },
  title: { fontSize: '22px', fontWeight: '700', color: '#3d3d3d', marginBottom: '8px' },
  titleMeta: { display: 'flex', gap: '8px', alignItems: 'center' },
  bcCodeBadge: { fontFamily: 'monospace', fontSize: '12px', backgroundColor: '#f5f5f5', padding: '3px 10px', borderRadius: '6px', color: '#555' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  headerActions: { display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 },
  backButton: { padding: '10px 18px', backgroundColor: '#fff', color: '#3d3d3d', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  editButton: { padding: '10px 18px', backgroundColor: '#E91E8C', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  section: { backgroundColor: '#fff', borderRadius: '12px', padding: '28px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#3d3d3d', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #fce4ec' },
  subsectionLabel: { fontSize: '12px', fontWeight: '700', color: '#E91E8C', textTransform: 'uppercase', letterSpacing: '0.5px', paddingBottom: '6px', borderBottom: '1px solid #fce4ec', marginTop: '8px', marginBottom: '4px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '4px' },
  fieldLabel: { fontSize: '11px', fontWeight: '600', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' },
  fieldValue: { fontSize: '14px', color: '#3d3d3d', fontWeight: '500', wordBreak: 'break-word' },
  serviceBlock: { border: '1px solid #f0f0f0', borderRadius: '8px', padding: '16px', marginBottom: '12px' },
  serviceBlockTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700', color: '#3d3d3d', marginBottom: '12px' },
  segmentBadge: (cat) => ({
    padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700',
    backgroundColor: cat === 'TelCo' ? '#e3f2fd' : '#f3e5f5',
    color: cat === 'TelCo' ? '#1565c0' : '#6a1b9a'
  }),
  emptyText: { fontSize: '14px', color: '#aaa', textAlign: 'center', padding: '16px 0' },
  autoCalcBox: { display: 'flex', gap: '16px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  autoCalcItem: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '130px' },
  autoCalcLabel: { fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase' },
  autoCalcValue: { fontSize: '15px', fontWeight: '700', color: '#3d3d3d' },
  fileBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' },
  fileInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  fileIcon: { fontSize: '28px' },
  fileName: { fontSize: '14px', fontWeight: '600', color: '#3d3d3d', marginBottom: '2px' },
  fileDate: { fontSize: '12px', color: '#888' },
  downloadBtn: { padding: '10px 20px', backgroundColor: '#fff', color: '#1565c0', border: '1.5px solid #90caf9', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  timestamps: { display: 'flex', gap: '24px', fontSize: '12px', color: '#aaa', marginTop: '8px', paddingBottom: '32px' },
}

export default BCDetailPage