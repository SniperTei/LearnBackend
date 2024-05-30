var pool = require('../config/db');

// Get book list from the database and return it as a JSON object
const getBookList = (currentPage, pageSize, book, callback) => {
  // Get the start index of the books to be retrieved
  const startIndex = (currentPage - 1) * pageSize;
  let page = currentPage || 1;
  let limit = pageSize || 10;
  let offset = (page - 1) * limit;
  // SQL query to get the list of books
  let sql = `SELECT * FROM tbl_books bt where 1=1`;
  if (book.title) {
    sql += ` AND bt.title like '%${book.title}%'`;
  }
  if (book.author) {
    sql += ` AND bt.author like '%${book.author}%'`;
  }
  if (book.publisher) {
    sql += ` AND bt.publisher like '%${book.publisher}%'`;
  }
  sql += ` LIMIT ${limit} OFFSET ${offset}`;
  // Execute the query
  pool.query(sql, (err, result) => {
    if (err) {
      console.error('An error occurred:', err);
      callback(err, null);
      return;
    }
    // Return the result
    callback(null, result);
  });
}
// Get the total number of books from the database
const getBookCount = (book, callback) => {
  let sql = `SELECT COUNT(*) as count FROM tbl_books bt where 1=1`;
  if (book.title) {
    sql += ` AND bt.title like '%${book.title}%'`;
  }
  if (book.author) {
    sql += ` AND bt.author like '%${book.author}%'`;
  }
  if (book.publisher) {
    sql += ` AND bt.publisher like '%${book.publisher}%'`;
  }
  pool.query(sql, (err, result) => {
    if (err) {
      console.error('An error occurred:', err);
      callback(err, null);
      return;
    }
    callback(null, result[0].count);
  });
}

// get the book
const getBook = (bookId, callback) => {
  // SQL query to get the list of books
  let sql = `SELECT * FROM tbl_books bt where bt.bookId = ${bookId}`;
  // Execute the query
  pool.query(sql, (err, result) => {
    if (err) {
      console.error('An error occurred:', err);
      callback(err, null);
      return;
    }
    // Return the result
    callback(null, result);
  });
}

// update book
const updateBook = (book, callback) => {
  // SQL query to get the list of books
  let sql = `UPDATE tbl_books SET ? WHERE bookId = '${book.bookId}'`;
  // Execute the query
  pool.query(sql, book, (err, result) => {
    if (err) {
      console.error('An error occurred:', err);
      callback(err, null);
      return;
    }
    // Return the result
    callback(null, result);
  });
}

// add book
const addBook = (book, callback) => {
  // SQL query to get the list of books
  let sql = `INSERT INTO tbl_books SET ?`;
  // Execute the query
  pool.query(sql, book, (err, result) => {
    if (err) {
      console.error('An error occurred:', err);
      callback(err, null);
      return;
    }
    // Return the result
    callback(null, result);
  });
}

// Export the functions
module.exports = {
  getBookList,
  getBookCount,
  getBook
}