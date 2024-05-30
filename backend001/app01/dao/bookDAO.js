var pool = require('../config/db');

// Get book list from the database and  return it as a JSON object
const getBookList = (currentPage, pageSize, condition) => {
  // Get the start index of the books to be retrieved
  return new Promise((resolve, reject) => {
    let page = currentPage || 1;
    let limit = pageSize || 10;
    let offset = (page - 1) * limit;
    // SQL query to get the list of books
    let sql = `SELECT * FROM tbl_books bt where bt.is_deleted = 0`;
    if (condition.title) {
      sql += ` AND bt.title like '%${condition.title}%'`;
    }
    if (condition.author) {
      sql += ` AND bt.author like '%${condition.author}%'`;
    }
    if (condition.publisher) {
      sql += ` AND bt.publisher like '%${condition.publisher}%'`;
    }
    sql += ` LIMIT ${limit} OFFSET ${offset}`;
    // Execute the query
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('An error occurred:', err);
        reject(err);
      }
      // Return the result
      resolve(result);
    });
  });
}
// Get the total number of books from the database
const getBookCount = (condition) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) as count FROM tbl_books bt where bt.is_deleted = 0`;
    if (condition.title) {
      sql += ` AND bt.title like '%${condition.title}%'`;
    }
    if (condition.author) {
      sql += ` AND bt.author like '%${condition.author}%'`;
    }
    if (condition.publisher) {
      sql += ` AND bt.publisher like '%${condition.publisher}%'`;
    }
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('An error occurred:', err);
        reject(err);
      }
      resolve(result[0].count);
    });
  });
}

// get the book
const getBook = (bookId) => {
  return new Promise((resolve, reject) => {
    // SQL query to get the list of books
    let sql = `SELECT * FROM tbl_books bt where bt.bookId = '${bookId}'`;
    // Execute
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('An error occurred:', err);
        reject(err);
      }
      resolve(result);
    });
  });
  // // SQL query to get the list of books
  // let sql = `SELECT * FROM tbl_books bt where bt.bookId = ${bookId}`;
  // // Execute the query
  // pool.query(sql, (err, result) => {
  //   if (err) {
  //     console.error('An error occurred:', err);
  //     callback(err, null);
  //     return;
  //   }
  //   // Return the result
  //   callback(null, result);
  // });
}

// update book
const updateBook = (book) => {
  return new Promise((resolve, reject) => {
    // SQL query to get the list of books
    let sql = `UPDATE tbl_books SET ? WHERE bookId = '${book.bookId}'`;
    // Execute
    pool.query(sql, book, (err, result) => {
      if (err) {
        console.error('An error occurred:', err);
        reject(err);
      }
      resolve(result);
    });
  });
  // // SQL query to get the list of books
  // let sql = `UPDATE tbl_books SET ? WHERE bookId = '${book.bookId}'`;
  // // Execute the query
  // pool.query(sql, book, (err, result) => {
  //   if (err) {
  //     console.error('An error occurred:', err);
  //     callback(err, null);
  //     return;
  //   }
  //   // Return the result
  //   callback(null, result);
  // });
}

// add book
const addBook = (book) => {
  return new Promise((resolve, reject) => {
    // SQL query to get the list of books
    let sql = `INSERT INTO tbl_books SET ?`;
    // Execute
    pool.query(sql, book, (err, result) => {
      if (err) {
        console.error('An error occurred:', err);
        reject(err);
      }
      resolve(result);
    });
  });
  // // SQL query to get the list of books
  // let sql = `INSERT INTO tbl_books SET ?`;
  // // Execute the query
  // pool.query(sql, book, (err, result) => {
  //   if (err) {
  //     console.error('An error occurred:', err);
  //     callback(err, null);
  //     return;
  //   }
  //   // Return the result
  //   callback(null, result);
  // });
}

// 物理删除书籍
const physicalDeleteBook = (bookId) => {
  return new Promise((resolve, reject) => {
    // SQL query to get the list of books
    let sql = `DELETE FROM tbl_books WHERE bookId = '${bookId}'`;
    //
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('An error occurred:', err);
        reject(err);
      }
      resolve(result);
    });
  });
}

// 逻辑删除书籍
const logicalDeleteBook = (bookId) => {
  return new Promise((resolve, reject) => {
    // SQL query to get the list of books
    let sql = `UPDATE tbl_books SET is_deleted = 0 WHERE bookId = '${bookId}'`;
    // Execute
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('An error occurred:', err);
        reject(err);
      }
      resolve(result);
    });
  });
}

// Export the functions
module.exports = {
  getBookList,
  getBookCount,
  getBook,
  updateBook,
  addBook,
  physicalDeleteBook,
  logicalDeleteBook
}