const Group = require('../models/Group')
const Division = require('../models/Division')
const Department = require('../models/Department')
const SalesTeam = require('../models/SalesTeam')
const PricingTeam = require('../models/PricingTeam')
const PreSalesTeam = require('../models/PreSalesTeam')
const SubService = require('../models/SubService')
const Service = require('../models/Service')

const seedMasterData = async () => {
  try {
    const groupCount = await Group.count()
    if (groupCount > 0) return

    // Groups
    const [g1] = await Group.findOrCreate({ where: { name: 'B2B Commercial' } })
    const [g2] = await Group.findOrCreate({ where: { name: 'B2B Product' } })

    // Divisions
    const [d1] = await Division.findOrCreate({ where: { name: 'Enterprise Sales West' }, defaults: { groupId: g1.id } })
    const [d2] = await Division.findOrCreate({ where: { name: 'Enterprise Sales East' }, defaults: { groupId: g1.id } })
    const [d3] = await Division.findOrCreate({ where: { name: 'SME Sales' }, defaults: { groupId: g2.id } })

    // Departments
    const [dep1] = await Department.findOrCreate({ where: { name: 'Jakarta Enterprise' }, defaults: { divisionId: d1.id } })
    const [dep2] = await Department.findOrCreate({ where: { name: 'Surabaya Enterprise' }, defaults: { divisionId: d2.id } })
    const [dep3] = await Department.findOrCreate({ where: { name: 'SME West' }, defaults: { divisionId: d3.id } })

    // Sales Teams
    await SalesTeam.findOrCreate({ where: { name: 'Budi Santoso' }, defaults: { departmentId: dep1.id } })
    await SalesTeam.findOrCreate({ where: { name: 'Siti Rahayu' }, defaults: { departmentId: dep1.id } })
    await SalesTeam.findOrCreate({ where: { name: 'Ahmad Fauzi' }, defaults: { departmentId: dep2.id } })
    await SalesTeam.findOrCreate({ where: { name: 'Dewi Kusuma' }, defaults: { departmentId: dep3.id } })

    // Pricing Teams
    await PricingTeam.findOrCreate({ where: { name: 'Pricing Team A' } })
    await PricingTeam.findOrCreate({ where: { name: 'Pricing Team B' } })

    // Pre Sales Teams
    await PreSalesTeam.findOrCreate({ where: { name: 'Pre Sales Team A' } })
    await PreSalesTeam.findOrCreate({ where: { name: 'Pre Sales Team B' } })

    // Sub Services
    const [ss1] = await SubService.findOrCreate({ where: { name: 'Connectivity' } })
    const [ss2] = await SubService.findOrCreate({ where: { name: 'Cloud' } })
    const [ss3] = await SubService.findOrCreate({ where: { name: 'Security' } })

    // Services
    await Service.findOrCreate({
      where: { name: 'MIDI' },
      defaults: { infraType: 'Onnet', infraNotes: 'Metro Ethernet', subServiceId: ss1.id }
    })
    await Service.findOrCreate({
      where: { name: 'MPLS' },
      defaults: { infraType: 'Onnet', infraNotes: 'MPLS VPN', subServiceId: ss1.id }
    })
    await Service.findOrCreate({
      where: { name: 'Internet Dedicated' },
      defaults: { infraType: 'Offnet', infraNotes: null, subServiceId: ss1.id }
    })
    await Service.findOrCreate({
      where: { name: 'Cloud Storage' },
      defaults: { infraType: null, infraNotes: null, subServiceId: ss2.id }
    })
    await Service.findOrCreate({
      where: { name: 'Firewall as a Service' },
      defaults: { infraType: null, infraNotes: null, subServiceId: ss3.id }
    })

    console.log('✅ Master data seeded')
  } catch (error) {
    console.error('❌ Seed master data failed:', error)
  }
}

module.exports = seedMasterData