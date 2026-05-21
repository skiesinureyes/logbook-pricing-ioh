const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Token tidak ditemukan, silakan login'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({
      status: 'error',
      message: 'Token tidak valid atau sudah expired'
    })
  }
}

module.exports = { verifyToken }