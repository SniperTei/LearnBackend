var pool = require('../config/db');

const getMovieList = (currentPage, pageSize, condition) => {
  return new Promise((resolve, reject) => {
    let page = currentPage || 1;
    let limit = pageSize || 10;
    let offset = (page - 1) * limit;
    let sql = `SELECT * FROM tbl_movies tm where tm.is_deleted = 0`;
    if (condition.title) {
      sql += ` AND tm.title like '%${condition.title}%'`;
    }
    if (condition.actor) {
      sql += ` AND tm.actors like '%${condition.actors}%'`;
    }
    if (condition.genre) {
      sql += ` AND tm.genre like '%${condition.genre}%'`;
    }
    // 地区
    if (condition.country) {
      sql += ` AND tm.country like '%${condition.country}%'`;
    }
    // 上映时间是否在某个时间段
    if (condition.release_year) {
      let start = condition.release_year + '-01-01';
      let end = condition.release_year + '-12-31';
      sql += ` AND tm.release_date >= '${start}' AND tm.release_date <= '${end}'`;
    }
    // sniper是否看过
    if (condition.sniper_viewed) {
      sql += ` AND tm.sniper_viewed = ${condition.sniper_viewed}`;
    }
    // jyp是否看过
    if (condition.jyp_viewed) {
      sql += ` AND tm.jyp_viewed = ${condition.jyp_viewed}`;
    }
    sql += ` LIMIT ${limit} OFFSET ${offset}`;
    console.log('sql:', sql )
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('An error occurred:', err);
        reject(err);
      }
      resolve(result);
    });
  });
}

const getMovieCount = (condition) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) as count FROM tbl_movies tm where tm.is_deleted = 0`;
    if (condition.title) {
      sql += ` AND tm.title like '%${condition.title}%'`;
    }
    if (condition.director) {
      sql += ` AND tm.director like '%${condition.director}%'`;
    }
    if (condition.actor) {
      sql += ` AND tm.actor like '%${condition.actor}%'`;
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

const getMovie = (movieId) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM tbl_movies tm where tm.movieId = '${movieId}'`;
    pool.query(sql, (err, result) => {
      if (err) {
        console.error('An error occurred:', err);
        reject(err);
      }
      resolve(result);
    });
  });
}

const addMovie = (movie) => {
  return new Promise((resolve, reject) => {
    // let sql = `INSERT INTO tbl_movies (title, director, actor, genre, release_date, duration, rating, summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    let sql = `INSERT INTO tbl_movies SET ?`;
    // Execute
    pool.query(sql, movie, (err, result) => {
      if (err) {
        console.error('An error occurred:', err);
        reject(err);
      }
      resolve(result);
    });
  });
}

const updateMovie = (movie) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE tbl_movies SET ? WHERE movieId = '${movie.movieId}'`;
    // Execute
    pool.query(sql, movie, (err, result) => {
      if (err) {
        console.error('An error occurred:', err);
        reject(err);
      }
      resolve(result);
    });
  });
}

// 物理删除
const physicalDeleteMovie = (movie) => {
  return new Promise((resolve, reject) => {
    let sql = `DELETE FROM tbl_movies WHERE movieId = ?`;
    pool.query(sql, [movie.movieId], (err, result) => {
      if (err) {
        console.error('An error occurred:', err);
        reject(err);
      }
      resolve(result);
    });
  });
}

// 逻辑删除
const logicDeleteMovie = (movie) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE tbl_movies SET is_deleted = 1 WHERE movieId = ?`;
    pool.query(sql, [movie.movieId], (err, result) => {
      if (err) {
        console.error('An error occurred:', err);
        reject(err);
      }
      resolve(result);
    });
  });
}

module.exports = {
  getMovieList,
  getMovieCount,
  getMovie,
  addMovie,
  updateMovie,
  physicalDeleteMovie,
  logicDeleteMovie
};