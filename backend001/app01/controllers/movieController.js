const express = require('express');
const pool = require('../config/db');
const { verifyToken } = require('../authorization');

// Import any required modules or dependencies
// For example, if you're using Express.js:

// Create a router instance
const router = express.Router();

// For example, a route to get a movie by ID
const movieList = (req, res) => {
  // 如果没登录
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  // 验证token
  verifyToken(req, res, () => {
    console.log('token验证通过');
    getMovies(req, res);
  });
};

const getMovies = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Failed to connect to the database:', err);
      return;
    }
    console.log('Connected to the database');
    let sql = 'SELECT * FROM tbl_movie';
    // Logic to get all movies
    connection.query(sql, (error, results, fields) => {
      if (error) {
        throw error;
      }
      res.json({ code: '000000', msg: 'success', data: { list: results, total: results.length}});
    });
    // Release the connection
    connection.release();
  });
}
// Add more routes as needed, such as creating, updating, or deleting movies

// Export the router
module.exports = {
  movieList,
};