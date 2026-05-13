import { useState, useEffect } from 'react'
import userService from '../../services/userService'

const ROLES = ['Admin', 'Staf', 'AVP & VP']

const emptyForm = {
  username: '',
  firstName: '',
  lastName: '',
  password: '',
  role: 'Staf'
}

const UserManagementPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  const fetchUsers = async () => {
    try {
      const res = await userService.getAllUsers()
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openAddModal = () => {
    setEditUser(null)
    setForm(emptyForm)
    setError('')
    setShowModal(true)
  }

  const openEditModal = (user) => {
    setEditUser(user)
    setForm({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      password: '',
      role: user.role
    })
    setError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditUser(null)
    setForm(emptyForm)
    setError('')
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitLoading(true)

    try {
      if (editUser) {
        const updateData = {
          firstName: form.firstName,
          lastName: form.lastName,
          role: form.role
        }
        if (form.password) updateData.password = form.password
        await userService.updateUser(editUser.id, updateData)
      } else {
        await userService.createUser(form)
      }
      await fetchUsers()
      closeModal()
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleToggleStatus = async (user) => {
    try {
      await userService.updateUserStatus(user.id, !user.isActive)
      await fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Terjadi kesalahan')
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>User Management</h1>
        </div>
        <button onClick={openAddModal} style={styles.addButton}>
          + Add New User
        </button>
      </div>

      {/* Table */}
      <div style={styles.tableWrapper}>
        {loading ? (
          <p style={styles.loadingText}>Memuat data...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>No</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Nama Lengkap</th>
                <th style={styles.th}>Peran</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} style={styles.tableRow}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{user.username}</td>
                  <td style={styles.td}>{user.firstName} {user.lastName}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.roleBadge,
                      backgroundColor: user.role === 'Admin' ? '#fce4ec' : user.role === 'Staf' ? '#e3f2fd' : '#f3e5f5',
                      color: user.role === 'Admin' ? '#c2185b' : user.role === 'Staf' ? '#1565c0' : '#6a1b9a'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: user.isActive ? '#e8f5e9' : '#fafafa',
                      color: user.isActive ? '#2e7d32' : '#999'
                    }}>
                      {user.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => openEditModal(user)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        style={{
                          ...styles.toggleButton,
                          backgroundColor: user.isActive ? '#fff3e0' : '#e8f5e9',
                          color: user.isActive ? '#e65100' : '#2e7d32'
                        }}
                      >
                        {user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
              </h2>
              <button onClick={closeModal} style={styles.closeButton}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {!editUser && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Username</label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Masukkan username"
                    required
                  />
                </div>
              )}

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nama Depan</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Nama depan"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nama Belakang</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Nama belakang"
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Password {editUser && <span style={styles.optional}>(kosongkan jika tidak diubah)</span>}
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder={editUser ? 'Password baru (opsional)' : 'Masukkan password'}
                  required={!editUser}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Peran</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  style={styles.input}
                  required
                >
                  {ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {error && <p style={styles.error}>{error}</p>}

              <div style={styles.modalFooter}>
                <button type="button" onClick={closeModal} style={styles.cancelButton}>
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ ...styles.submitButton, opacity: submitLoading ? 0.7 : 1 }}
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Menyimpan...' : editUser ? 'Simpan Perubahan' : 'Tambah Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: '32px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px'
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#3d3d3d',
    marginBottom: '4px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#888'
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#E91E8C',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  tableWrapper: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  loadingText: {
    color: '#888',
    textAlign: 'center',
    padding: '32px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHead: {
    backgroundColor: '#fafafa'
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#666',
    borderBottom: '1px solid #f0f0f0'
  },
  tableRow: {
    borderBottom: '1px solid #f9f9f9'
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#3d3d3d'
  },
  roleBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px'
  },
  editButton: {
    padding: '6px 14px',
    backgroundColor: '#f5f5f5',
    color: '#3d3d3d',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer'
  },
  toggleButton: {
    padding: '6px 14px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '32px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#3d3d3d'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#888'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  formRow: {
    display: 'flex',
    gap: '16px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#555'
  },
  optional: {
    fontWeight: '400',
    color: '#999'
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1.5px solid #e0e0e0',
    fontSize: '14px',
    color: '#3d3d3d',
    backgroundColor: '#fafafa',
    outline: 'none'
  },
  error: {
    fontSize: '13px',
    color: '#e53935',
    textAlign: 'center'
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px'
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#f5f5f5',
    color: '#3d3d3d',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#E91E8C',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  }
}

export default UserManagementPage