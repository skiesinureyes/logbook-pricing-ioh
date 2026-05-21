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
import AuditLogPage from '../pages/audit-log/AuditLogPage'

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
        // Login
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

        // Redirect root to dashboard
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        // Protected Routes
        <Route
          path="/dashboard"
          element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>}
        />

        // User Management
        <Route
          path="/users"
          element={<ProtectedRoute><MainLayout><UserManagementPage /></MainLayout></ProtectedRoute>}
        />

        // Master Data
        <Route
          path="/master-data"
          element={<ProtectedRoute><MainLayout><MasterDataPage /></MainLayout></ProtectedRoute>}
        />

        // Logbook
        <Route
          path="/logbook"
          element={<ProtectedRoute><MainLayout><BCListPage /></MainLayout></ProtectedRoute>}
        />

        // Logbook Add
        <Route
          path="/logbook/add"
          element={<ProtectedRoute><MainLayout><BCFormPage /></MainLayout></ProtectedRoute>}
        />

        // Logbook Detail
        <Route
          path="/logbook/:id"
          element={<ProtectedRoute><MainLayout><BCDetailPage /></MainLayout></ProtectedRoute>}
        />

        // Logbook Edit
        <Route
          path="/logbook/:id/edit"
          element={<ProtectedRoute><MainLayout><BCFormPage /></MainLayout></ProtectedRoute>}
        />

        // Audit Log
        <Route
          path="/audit-log"
          element={<ProtectedRoute><MainLayout><AuditLogPage /></MainLayout></ProtectedRoute>}
        />

        // Catch-all route to redirect to login if no match
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes