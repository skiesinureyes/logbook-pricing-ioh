import api from './api'

const getAllUsers = async () => {
  const response = await api.get('/users')
  return response.data
}

const createUser = async (userData) => {
  const response = await api.post('/users', userData)
  return response.data
}

const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData)
  return response.data
}

const updateUserStatus = async (id, isActive) => {
  const response = await api.patch(`/users/${id}/status`, { isActive })
  return response.data
}

export default { getAllUsers, createUser, updateUser, updateUserStatus }