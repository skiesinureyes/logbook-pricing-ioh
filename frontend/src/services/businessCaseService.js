import api from './api'

const businessCaseService = {
  getAll: (params) => api.get('/business-cases', { params }), getDashboardStats: (params) => api.get('/business-cases/dashboard/stats', { params }),
  getPendingFollowUp: () => api.get('/business-cases/pending-follow-up'),
  getById: (id) => api.get(`/business-cases/${id}`),
  create: (formData) => api.post('/business-cases', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/business-cases/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/business-cases/${id}`),
  downloadFile: (id) => api.get(`/business-cases/${id}/file`, { responseType: 'blob' }),
  exportExcel: (params) => api.get('/business-cases/export', { params, responseType: 'blob' }),
  getCustNames: (search) => api.get('/business-cases/cust-names', { params: { search } })
}

export default businessCaseService