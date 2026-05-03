const User = require('./User')
const BusinessCase = require('./BusinessCase')
const TenderDetail = require('./TenderDetail')
const ServiceDetail = require('./ServiceDetail')
const SalesTeam = require('./SalesTeam')
const PricingTeam = require('./PricingTeam')
const PreSalesTeam = require('./PreSalesTeam')
const Service = require('./Service')
const SubService = require('./SubService')
const Group = require('./Group')
const Division = require('./Division')
const Department = require('./Department')

// User → BusinessCase
User.hasMany(BusinessCase, { foreignKey: 'userId' })
BusinessCase.belongsTo(User, { foreignKey: 'userId' })

// BusinessCase → TenderDetail
BusinessCase.hasOne(TenderDetail, { foreignKey: 'businessCaseId', onDelete: 'CASCADE' })
TenderDetail.belongsTo(BusinessCase, { foreignKey: 'businessCaseId' })

// BusinessCase → ServiceDetail
BusinessCase.hasMany(ServiceDetail, { foreignKey: 'businessCaseId', onDelete: 'CASCADE' })
ServiceDetail.belongsTo(BusinessCase, { foreignKey: 'businessCaseId' })

// ServiceDetail → Service
Service.hasMany(ServiceDetail, { foreignKey: 'serviceId' })
ServiceDetail.belongsTo(Service, { foreignKey: 'serviceId' })

// Service → SubService
SubService.hasMany(Service, { foreignKey: 'subServiceId' })
Service.belongsTo(SubService, { foreignKey: 'subServiceId' })

// BusinessCase → PricingTeam
PricingTeam.hasMany(BusinessCase, { foreignKey: 'pricingTeamId' })
BusinessCase.belongsTo(PricingTeam, { foreignKey: 'pricingTeamId' })

// BusinessCase → PreSalesTeam
PreSalesTeam.hasMany(BusinessCase, { foreignKey: 'preSalesTeamId' })
BusinessCase.belongsTo(PreSalesTeam, { foreignKey: 'preSalesTeamId' })

// SalesTeam many-to-many BusinessCase
BusinessCase.belongsToMany(SalesTeam, {
  through: 'business_case_sales_teams',
  foreignKey: 'businessCaseId',
  otherKey: 'salesTeamId'
})
SalesTeam.belongsToMany(BusinessCase, {
  through: 'business_case_sales_teams',
  foreignKey: 'salesTeamId',
  otherKey: 'businessCaseId'
})

// SalesTeam → Department → Division → Group
SalesTeam.belongsTo(Department, { foreignKey: 'departmentId' })
Department.hasMany(SalesTeam, { foreignKey: 'departmentId' })

Department.belongsTo(Division, { foreignKey: 'divisionId' })
Division.hasMany(Department, { foreignKey: 'divisionId' })

Division.belongsTo(Group, { foreignKey: 'groupId' })
Group.hasMany(Division, { foreignKey: 'groupId' })

module.exports = {
  User,
  BusinessCase,
  TenderDetail,
  ServiceDetail,
  SalesTeam,
  PricingTeam,
  PreSalesTeam,
  Service,
  SubService,
  Group,
  Division,
  Department
}