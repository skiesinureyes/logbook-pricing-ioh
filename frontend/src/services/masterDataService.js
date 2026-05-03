import api from './api'

const masterDataService = {
  // Groups
  getGroups: () => api.get('/master/groups'),
  createGroup: (data) => api.post('/master/groups', data),
  updateGroup: (id, data) => api.put(`/master/groups/${id}`, data),
  deleteGroup: (id) => api.delete(`/master/groups/${id}`),

  // Divisions
  getDivisions: () => api.get('/master/divisions'),
  createDivision: (data) => api.post('/master/divisions', data),
  updateDivision: (id, data) => api.put(`/master/divisions/${id}`, data),
  deleteDivision: (id) => api.delete(`/master/divisions/${id}`),

  // Departments
  getDepartments: () => api.get('/master/departments'),
  createDepartment: (data) => api.post('/master/departments', data),
  updateDepartment: (id, data) => api.put(`/master/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/master/departments/${id}`),

  // Sales Teams
  getSalesTeams: () => api.get('/master/sales-teams'),
  createSalesTeam: (data) => api.post('/master/sales-teams', data),
  updateSalesTeam: (id, data) => api.put(`/master/sales-teams/${id}`, data),
  deleteSalesTeam: (id) => api.delete(`/master/sales-teams/${id}`),

  // Pricing Teams
  getPricingTeams: () => api.get('/master/pricing-teams'),
  createPricingTeam: (data) => api.post('/master/pricing-teams', data),
  updatePricingTeam: (id, data) => api.put(`/master/pricing-teams/${id}`, data),
  deletePricingTeam: (id) => api.delete(`/master/pricing-teams/${id}`),

  // Pre Sales Teams
  getPreSalesTeams: () => api.get('/master/pre-sales-teams'),
  createPreSalesTeam: (data) => api.post('/master/pre-sales-teams', data),
  updatePreSalesTeam: (id, data) => api.put(`/master/pre-sales-teams/${id}`, data),
  deletePreSalesTeam: (id) => api.delete(`/master/pre-sales-teams/${id}`),

  // Sub Services
  getSubServices: () => api.get('/master/sub-services'),
  createSubService: (data) => api.post('/master/sub-services', data),
  updateSubService: (id, data) => api.put(`/master/sub-services/${id}`, data),
  deleteSubService: (id) => api.delete(`/master/sub-services/${id}`),

  // Services
  getServices: () => api.get('/master/services'),
  createService: (data) => api.post('/master/services', data),
  updateService: (id, data) => api.put(`/master/services/${id}`, data),
  deleteService: (id) => api.delete(`/master/services/${id}`),
}

export default masterDataService