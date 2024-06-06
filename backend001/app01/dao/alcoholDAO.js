var pool = require('../config/db');

const getAlcoholList = (currentPage, pageSize, condition) => {
  return new Promise((resolve, reject) => {
    let page = currentPage || 1;
    let limit = pageSize || 10;
    let offset = (page - 1) * limit;
    let sql = `SELECT * FROM tbl_alcohols ta where ta.is_deleted = 0`;
    if (condition.alcohol_name) {
      sql += ` AND ta.alcohol_name like '%${condition.alcohol_name}%'`;
    }
    if (condition.alcohol_type) {
      sql += ` AND ta.alcohol_type like '%${condition.alcohol_type}%'`;
    }
    if (condition.nan_rating) {
      sql += ` AND ta.nan_rating like '%${condition.nan_rating}%'`;
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

const getAlcoholCount = (condition) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) as count FROM tbl_alcohols ta where ta.is_deleted = 0`;
    if (condition.alcohol_name) {
      sql += ` AND ta.alcohol_name like '%${condition.alcohol_name}%'`;
    }
    if (condition.alcohol_type) {
      sql += ` AND ta.alcohol_type like '%${condition.alcohol_type}%'`;
    }
    if (condition.nan_rating) {
      sql += ` AND ta.nan_rating like '%${condition.nan_rating}%'`;
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

module.exports = {
  getAlcoholList,
  getAlcoholCount
};