import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import authService from '../../services/authService'
import indosatLogo from '../../assets/indosat-logo.png'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ username: '', password: '', general: '' })
  const [loading, setLoading] = useState(false)

  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    if (e && e.preventDefault)e.preventDefault()
    setErrors({ username: '', password: '', general: '' })

    // Validasi kosong
    if (!username && !password) {
      setErrors({ username: 'Username need to be filled in.', password: 'Password need to be filled in.', general: 'Input username and password.' })
      return
    }
    if (!username) {
      setErrors(prev => ({ ...prev, username: 'Username need to be filled in.' }))
      return
    }
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password need to be filled in.' }))
      return
    }

    setLoading(true)
    try {
      const response = await authService.login(username, password)
      loginUser(response.data.user, response.data.token)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || ''
      const status = err.response?.status
      if (status === 401) {
        setErrors({ username: '', password: 'Username atau password salah', general: '' })
      } else if (status === 403) {
        setErrors({ username: '', password: '', general: 'Akun Anda telah dinonaktifkan' })
      } else {
        setErrors({ username: '', password: '', general: msg || 'Terjadi kesalahan, coba lagi' })
      }
    } finally {
      setLoading(false)
    }
    
  }

  const inputStyle = (fieldError) => ({
    ...styles.input,
    borderColor: fieldError ? '#e53935' : '#e0e0e0',
    backgroundColor: fieldError ? '#fff5f5' : '#fafafa',
  })

  const iconColor = (fieldError) => fieldError ? '#e53935' : '#aaa'

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrapper}>
          <img src={indosatLogo} alt="Indosat Business" style={{ width: '100px', height: '50px', objectFit: 'contain' }} />
        </div>

        {/* Heading */}
        <h1 style={styles.heading}>Hello, Pricing Team!</h1>
        <p style={styles.subheading}>Welcome to <strong>IsiLogbook</strong></p>

        {/* General error */}
        {errors.general && (
          <div style={styles.generalError}>
            <span style={styles.generalErrorIcon}>⚠</span>
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form} noValidate autoComplete='off'>
          {/* Username */}
          <div style={styles.fieldGroup}>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconColor(errors.username)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setErrors(prev => ({ ...prev, username: '', general: '' })) }}
                style={inputStyle(errors.username)}
                autoComplete='off'
              />
            </div>
            {errors.username && <p style={styles.fieldError}>{errors.username}</p>}
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconColor(errors.password)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '', general: '' })) }}
                style={inputStyle(errors.password)}
                autoComplete='Off'
              />
            </div>
            {errors.password && <p style={styles.fieldError}>{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            style={{ ...styles.button, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '48px 56px', width: '100%', maxWidth: '420px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  logoWrapper: { marginBottom: '28px' },
  heading: { fontSize: '22px', fontWeight: '700', color: '#3d3d3d', marginBottom: '8px', textAlign: 'center' },
  subheading: { fontSize: '14px', color: '#666', marginBottom: '24px', textAlign: 'center' },
  generalError: { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '12px 14px', backgroundColor: '#fff5f5', border: '1px solid #ffcdd2', borderRadius: '8px', color: '#c62828', fontSize: '13px', marginBottom: '12px' },
  generalErrorIcon: { fontSize: '16px', flexShrink: 0 },
  form: { width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '14px', display: 'flex', alignItems: 'center' },
  input: { width: '100%', padding: '14px 14px 14px 44px', borderRadius: '8px', border: '1.5px solid', fontSize: '14px', color: '#3d3d3d', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' },
  fieldError: { fontSize: '12px', color: '#e53935', margin: '0', paddingLeft: '4px' },
  button: { width: '100%', padding: '15px', backgroundColor: '#E91E8C', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', marginTop: '8px', transition: 'opacity 0.2s' },
}

export default LoginPage