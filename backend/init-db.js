const mysql = require('mysql2');
require('dotenv').config();

// Connect to MySQL without specifying a database
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
});

connection.connect(error => {
  if (error) {
    console.error("Gagal terhubung ke MySQL: " + error.message);
    process.exit(1);
  }
  console.log("Terhubung ke MySQL!");

  // Create database
  const dbName = process.env.DB_NAME || 'db_logbook_ioh';
  connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
    if (err) {
      console.error("Error creating database: " + err.message);
      connection.end();
      process.exit(1);
    }
    console.log(`Database '${dbName}' created/exists!`);

    // Use the database
    connection.query(`USE ${dbName}`, (err) => {
      if (err) {
        console.error("Error selecting database: " + err.message);
        connection.end();
        process.exit(1);
      }

      // Create business_cases table
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS business_cases (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `;

      connection.query(createTableQuery, (err) => {
        if (err) {
          console.error("Error creating table: " + err.message);
          connection.end();
          process.exit(1);
        }
        console.log("Table 'business_cases' created/exists!");
        console.log("\n✅ Database setup completed successfully!");
        connection.end();
        process.exit(0);
      });
    });
  });
});
