const express = require('express')
const router = express.Router()
const {
  groupCRUD, divisionCRUD, departmentCRUD,
  salesTeamCRUD, pricingTeamCRUD, preSalesTeamCRUD,
  subServiceCRUD, serviceCRUD
} = require('../controllers/masterDataController')
const { verifyToken } = require('../middlewares/authMiddleware')
const { authorizeRoles } = require('../middlewares/roleMiddleware')

const adminOnly = [verifyToken, authorizeRoles('Admin')]
const allRoles = [verifyToken]

router.get('/groups', allRoles, groupCRUD.getAll)
router.post('/groups', adminOnly, groupCRUD.create)
router.put('/groups/:id', adminOnly, groupCRUD.update)
router.delete('/groups/:id', adminOnly, groupCRUD.destroy)

router.get('/divisions', allRoles, divisionCRUD.getAll)
router.post('/divisions', adminOnly, divisionCRUD.create)
router.put('/divisions/:id', adminOnly, divisionCRUD.update)
router.delete('/divisions/:id', adminOnly, divisionCRUD.destroy)

router.get('/departments', allRoles, departmentCRUD.getAll)
router.post('/departments', adminOnly, departmentCRUD.create)
router.put('/departments/:id', adminOnly, departmentCRUD.update)
router.delete('/departments/:id', adminOnly, departmentCRUD.destroy)

router.get('/sales-teams', allRoles, salesTeamCRUD.getAll)
router.post('/sales-teams', adminOnly, salesTeamCRUD.create)
router.put('/sales-teams/:id', adminOnly, salesTeamCRUD.update)
router.delete('/sales-teams/:id', adminOnly, salesTeamCRUD.destroy)

router.get('/pricing-teams', allRoles, pricingTeamCRUD.getAll)
router.post('/pricing-teams', adminOnly, pricingTeamCRUD.create)
router.put('/pricing-teams/:id', adminOnly, pricingTeamCRUD.update)
router.delete('/pricing-teams/:id', adminOnly, pricingTeamCRUD.destroy)

router.get('/pre-sales-teams', allRoles, preSalesTeamCRUD.getAll)
router.post('/pre-sales-teams', adminOnly, preSalesTeamCRUD.create)
router.put('/pre-sales-teams/:id', adminOnly, preSalesTeamCRUD.update)
router.delete('/pre-sales-teams/:id', adminOnly, preSalesTeamCRUD.destroy)

router.get('/sub-services', allRoles, subServiceCRUD.getAll)
router.post('/sub-services', adminOnly, subServiceCRUD.create)
router.put('/sub-services/:id', adminOnly, subServiceCRUD.update)
router.delete('/sub-services/:id', adminOnly, subServiceCRUD.destroy)

router.get('/services', allRoles, serviceCRUD.getAll)
router.post('/services', adminOnly, serviceCRUD.create)
router.put('/services/:id', adminOnly, serviceCRUD.update)
router.delete('/services/:id', adminOnly, serviceCRUD.destroy)

module.exports = router
