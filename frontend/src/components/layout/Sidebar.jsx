import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import authService from '../../services/authService'
import indosatLogo from '../../assets/indosat-logo.png'

const Sidebar = () => {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [hoveredPath, setHoveredPath] = useState(null)
  const [showUserTooltip, setShowUserTooltip] = useState(false)
  const [showLogoutTooltip, setShowLogoutTooltip] = useState(false)

  const handleLogout = async () => {
    await authService.logout()
    logoutUser()
    navigate('/login')
  }

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
      roles: ['Admin', 'Staf', 'AVP & VP']
    },
    {
      label: 'Logbook',
      path: '/logbook',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      roles: ['Admin', 'Staf', 'AVP & VP']
    },
    {
      label: 'User Management',
      path: '/users',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      roles: ['Admin']
    },
    {
      label: 'Master Data',
      path: '/master-data',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"/>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        </svg>
      ),
      roles: ['Admin']
    }
  ]

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role))
  const isActive = (path) => location.pathname === path

  return (
    <div style={styles.sidebar}>
      {/* Logo */}
        <div style={styles.logoSection}>
            <img src={indosatLogo} alt="Indosat Business" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        </div>

      {/* Menu Items */}
      <nav style={styles.nav}>
        {filteredMenu.map((item) => (
          <div
            key={item.path}
            style={styles.menuWrapper}
            onMouseEnter={() => setHoveredPath(item.path)}
            onMouseLeave={() => setHoveredPath(null)}
          >
            <button
              onClick={() => navigate(item.path)}
              style={{
                ...styles.menuItem,
                backgroundColor: isActive(item.path) ? '#fce4ec' : hoveredPath === item.path ? '#fafafa' : 'transparent',
                color: isActive(item.path) ? '#E91E8C' : '#888'
              }}
            >
              {item.icon}
            </button>

            {/* Tooltip */}
            {hoveredPath === item.path && (
              <div style={styles.tooltip}>
                {item.label}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom: Avatar + Logout */}
      <div style={styles.bottomSection}>
        {/* Avatar */}
        <div
          style={styles.menuWrapper}
          onMouseEnter={() => setShowUserTooltip(true)}
          onMouseLeave={() => setShowUserTooltip(false)}
        >
          <div style={styles.avatar}>
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          {showUserTooltip && (
            <div style={styles.tooltip}>
              <span style={styles.tooltipName}>{user?.firstName} {user?.lastName}</span>
              <span style={styles.tooltipRole}>{user?.role}</span>
            </div>
          )}
        </div>

        {/* Logout */}
        <div
          style={styles.menuWrapper}
          onMouseEnter={() => setShowLogoutTooltip(true)}
          onMouseLeave={() => setShowLogoutTooltip(false)}
        >
          <button onClick={handleLogout} style={styles.logoutButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
          {showLogoutTooltip && (
            <div style={styles.tooltip}>Logout</div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  sidebar: {
    width: '64px',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
    boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100
  },
  logoSection: {
    marginBottom: '32px'
  },
  logoCircle: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    flex: 1,
    width: '100%',
    padding: '0 8px'
  },
  menuWrapper: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  menuItem: {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.15s'
  },
  tooltip: {
    position: 'absolute',
    left: '52px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: 200,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  tooltipName: {
    fontSize: '13px',
    fontWeight: '600'
  },
  tooltipRole: {
    fontSize: '11px',
    color: '#aaa'
  },
  bottomSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '0 8px',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '16px'
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#fce4ec',
    color: '#E91E8C',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'default'
  },
  logoutButton: {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: '#e53935',
    transition: 'background-color 0.15s'
  }
}

export default Sidebar