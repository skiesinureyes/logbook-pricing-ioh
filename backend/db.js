const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'db_logbook_ioh'
});

connection.connect(error => {
  if (error) {
    console.error("Failed to connect to MySQL: " + error.message);
    return;
  }
  console.log("Successfully connected to MySQL database!");
});

module.exports = connection;