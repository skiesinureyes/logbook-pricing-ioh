import api from './api'

const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password })
  return response.data
}

const logout = async () => {
  await api.post('/auth/logout')
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export default { login, logout }