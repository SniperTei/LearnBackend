var pool = require('../config/db');

const getMovieCommentList = (currentPage, pageSize, movieId) => {
  return new Promise((resolve, reject) => {
    let page = currentPage || 1;
    let limit = pageSize || 10;
    let offset = (page - 1) * limit;
    let sql = `SELECT * FROM tbl_movies_comments tmc where tmc.is_deleted = 0`;
    if (movieId) {
      sql += ` AND tmc.movieId = '${movieId}'`;
    }
    sql += ` LIMIT ${limit} OFFSET ${offset}`;
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('An error occurred:', err);
        reject(err);
      }
      resolve(result);
    });
  });
}

const getMovieCommentCount = (movieId) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) as count FROM tbl_movies_comments tmc where tmc.is_deleted = 0`;
    if (movieId) {
      sql += ` AND tmc.movieId = '${movieId}'`;
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

const addMovieComment = (movieComment) => {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO tbl_movies_comments SET ?`;
    pool.query(sql, movieComment, (err, result) => {
      if (err) {
        console.error('An error occurred:', err);
        reject(err);
      }
      resolve(result);
    });
  });
}

const logicDeleteMovieComment = (movieCommentId) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE tbl_movies_comments SET is_deleted = 1 WHERE movie_comment_id = '${movieCommentId}'`;
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('An error occurred:', err);
        reject(err);
      }
      resolve(result);
    });
  });
}

module.exports = {
  getMovieCommentList,
  getMovieCommentCount,
  addMovieComment,
  logicDeleteMovieComment
};