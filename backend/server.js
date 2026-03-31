const express = require('express');
const cors = require('cors');
const db = require('./db'); // Mengambil koneksi dari db.js yang kita buat tadi
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Tes rute sederhana (Endpoint)
app.get('/', (req, res) => {
  res.send('Server Logbook Indosat Berjalan!');
});

// Endpoint untuk mengambil semua data Business Case (Sesuai FR-10)
app.get('/api/business-case', (req, res) => {
  const query = 'SELECT * FROM business_cases';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});