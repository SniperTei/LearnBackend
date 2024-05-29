const express = require('express');
const mysql = require('mysql2');

const app = express();

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'test001',
  password: '123456',
  database: 'MYAPP001',
  waitForConnections: true,
  connectionLimit: 10,
  port: 3306
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Connect to the database
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    return;
  }

  console.log('Connected to the database');

  // Start the server
  app.listen(3001, () => {
    console.log('Server is running on port 3001');
  });

  // Release the connection
  connection.release();
});

// Handle connection errors
pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

module.exports = pool;