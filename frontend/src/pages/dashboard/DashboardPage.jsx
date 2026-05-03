import { useAuth } from '../../store/AuthContext'
import { useNavigate } from 'react-router-dom'
import authService from '../../services/authService'

const DashboardPage = () => {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await authService.logout()
    logoutUser()
    navigate('/login')
  }

  return (
    <div style={{ padding: '32px' }}>
      <h1>Dashboard</h1>
    </div>
  )
}

export default DashboardPage