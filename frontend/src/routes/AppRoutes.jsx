import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import LoginPage from '../pages/auth/LoginPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import UserManagementPage from '../pages/user-management/UserManagementPage'
import MainLayout from '../components/layout/MainLayout'
import MasterDataPage from '../pages/master-data/MasterDataPage'
import BCListPage from '../pages/logbook/BCListPage'
import BCFormPage from '../pages/logbook/BCFormPage'
import BCDetailPage from '../pages/logbook/BCDetailPage'

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { token } = useAuth()
  return token ? <Navigate to="/dashboard" replace /> : children
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>}
        />
        <Route
          path="/users"
          element={<ProtectedRoute><MainLayout><UserManagementPage /></MainLayout></ProtectedRoute>}
        />
        <Route
          path="/master-data"
          element={<ProtectedRoute><MainLayout><MasterDataPage /></MainLayout></ProtectedRoute>}
        />
        <Route
          path="/logbook"
          element={<ProtectedRoute><MainLayout><BCListPage /></MainLayout></ProtectedRoute>}
        />
        <Route
          path="/logbook/add"
          element={<ProtectedRoute><MainLayout><BCFormPage /></MainLayout></ProtectedRoute>}
        />
        <Route
          path="/logbook/:id"
          element={<ProtectedRoute><MainLayout><BCDetailPage /></MainLayout></ProtectedRoute>}
        />
        <Route
          path="/logbook/:id/edit"
          element={<ProtectedRoute><MainLayout><BCFormPage /></MainLayout></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes