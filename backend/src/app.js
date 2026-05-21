const express = require('express')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const businessCaseRoutes = require('./routes/businessCaseRoutes')
const masterDataRoutes = require('./routes/masterDataRoutes')
const auditLogRoutes = require('./routes/auditLogRoutes')

const app = express()

app.use(cors({
  origin: '*',  // ← allow semua origin untuk ngrok
  credentials: true
}))

app.use((req, res, next) => {
  res.setHeader('ngrok-skip-browser-warning', 'true')
  next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static('uploads'))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/business-cases', businessCaseRoutes)
app.use('/api/master', masterDataRoutes)
app.use('/api/audit-logs', auditLogRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// ← Serve frontend build
app.use(express.static(path.join(__dirname, '../../frontend/dist')))
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'))
})

module.exports = app