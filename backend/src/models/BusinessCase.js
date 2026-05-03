const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const BusinessCase = sequelize.define('BusinessCase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bcCode: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  bcTitle: { type: DataTypes.STRING, allowNull: false },
  bcType: {
    type: DataTypes.ENUM('Non-BC', 'BC-CPB', 'BC'),
    allowNull: false
  },
  cpbDate: { type: DataTypes.DATEONLY, allowNull: true },
  projectType: {
    type: DataTypes.ENUM('Non-Tender', 'Tender'),
    allowNull: false
  },
  activityType: {
    type: DataTypes.ENUM('BAU', 'Non BAU'),
    allowNull: false
  },
  projectStatus: {
    type: DataTypes.ENUM('On Progress', 'Win', 'Lost', 'Drop Exp', 'Drop Sls', 'Double', 'Cancel'),
    allowNull: false
  },
  lastFollowUpDate: { type: DataTypes.DATE, allowNull: true },
  esReqDate: { type: DataTypes.DATEONLY, allowNull: false },
  cfDate: { type: DataTypes.DATEONLY, allowNull: false },
  dueDate: { type: DataTypes.DATEONLY, allowNull: true },
  sfalId: { type: DataTypes.STRING, allowNull: true },
  opportunityId: { type: DataTypes.STRING, allowNull: true },
  salesOrder: { type: DataTypes.STRING, allowNull: true },
  quote: { type: DataTypes.STRING, allowNull: true },
  custName: { type: DataTypes.STRING, allowNull: false },
  lineOfBusiness: {
    type: DataTypes.ENUM(
      'Agriculture, Forestry Management',
      'Agriculture, Livestock and Fisheries',
      'Hunting/Wildlife Conservation',
      'Business Services',
      'Communication',
      'Technology',
      'Education Services',
      'Mining & Quarrying',
      'Mining, Oil & Gas Support Services',
      'Oil & Gas',
      'Public Utilities',
      'Banking',
      'Non - Bank Financial',
      'Government',
      'Health Services',
      'Hotel',
      'Restaurant',
      'Broadcaster',
      'Media',
      'Non Profit Organization',
      'Building Service,Architect & Eng.',
      'Construction',
      'Engineering, Procurement & Construction',
      'Property Developer',
      'Real Estate',
      'Distribution',
      'Logistic',
      'Manufacturing',
      'Trading and Retailer',
      'Transport Service',
      'Transportation'
    ),
    allowNull: false
  },
  custJoinDate: { type: DataTypes.DATEONLY, allowNull: false },
  contractType: {
    type: DataTypes.ENUM('Existing', 'New'),
    allowNull: false
  },
  activationType: {
    type: DataTypes.ENUM('New', 'Additional', 'Renewal', 'Upgrade', 'Relocated', 'Downgrade', 'Reconfiguration'),
    allowNull: false
  },
  rfsDate: { type: DataTypes.DATEONLY, allowNull: false },
  contractPeriod: {
    type: DataTypes.ENUM('1', '12', '24', '36', '48', '60', 'Other'),
    allowNull: false
  },
  otc: { type: DataTypes.BIGINT, allowNull: true },
  mrc: { type: DataTypes.BIGINT, allowNull: true },
  tcv: { type: DataTypes.BIGINT, allowNull: true },
  totalNetRev: { type: DataTypes.BIGINT, allowNull: true },
  portOnlyRev: { type: DataTypes.BIGINT, allowNull: true },
  y1RevCalendar: { type: DataTypes.BIGINT, allowNull: true },
  y1RevYearly: { type: DataTypes.BIGINT, allowNull: true },
  pprEligibility: {
    type: DataTypes.ENUM('Eligible', 'Not Eligible'),
    allowNull: true
  },
  pprStatus: {
    type: DataTypes.ENUM('On Progress', 'Done'),
    allowNull: true
  },
  y1CoS: { type: DataTypes.BIGINT, allowNull: true },
  totalCoS: { type: DataTypes.BIGINT, allowNull: true },
  networkOpex: { type: DataTypes.BIGINT, allowNull: true },
  financingCost: { type: DataTypes.BIGINT, allowNull: true },
  otherOpexDirect: { type: DataTypes.BIGINT, allowNull: true },
  b2bDirectOverhead: { type: DataTypes.BIGINT, allowNull: true },
  contributionMargin: { type: DataTypes.BIGINT, allowNull: true },
  iohOverheadAllocation: { type: DataTypes.BIGINT, allowNull: true },
  ebitda: { type: DataTypes.BIGINT, allowNull: true },
  ebitdaMargin: { type: DataTypes.DOUBLE, allowNull: true },
  netProfit: { type: DataTypes.BIGINT, allowNull: true },
  totalCapex: { type: DataTypes.BIGINT, allowNull: true },
  totalFcf: { type: DataTypes.BIGINT, allowNull: true },
  totalAccFcf: { type: DataTypes.BIGINT, allowNull: true },
  wacc: { type: DataTypes.DOUBLE, allowNull: true },
  npv: { type: DataTypes.BIGINT, allowNull: true },
  irr: { type: DataTypes.DOUBLE, allowNull: true },
  payback: { type: DataTypes.DOUBLE, allowNull: true },
  marketingCost: { type: DataTypes.BIGINT, allowNull: true },
  fileName: { type: DataTypes.STRING, allowNull: true },
  filePath: { type: DataTypes.STRING, allowNull: true },
  fileUploadedAt: { type: DataTypes.DATE, allowNull: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  pricingTeamId: { type: DataTypes.INTEGER, allowNull: false },
  preSalesTeamId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'business_cases',
  timestamps: true
})

module.exports = BusinessCase