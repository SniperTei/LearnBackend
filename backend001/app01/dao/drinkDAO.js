var pool = require('../config/db');

const getDrinkList = (currentPage, pageSize, condition) => {
  return new Promise((resolve, reject) => {
    let page = currentPage || 1;
    let limit = pageSize || 10;
    let offset = (page - 1) * limit;
    let sql = `SELECT * FROM tbl_drinks dt where 1 = 1`;
    if (condition.name) {
      sql += ` AND dt.name like '%${condition.name}%'`;
    }
    if (condition.type) {
      sql += ` AND dt.type like '%${condition.type}%'`;
    }
    // drink_date在开始日期和结束日期之间的数据
    if (condition.startDate && condition.endDate) {
      sql += ` AND dt.drink_date BETWEEN '${condition.startDate}' AND '${condition.endDate}'`;
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

// const getDrinkCount = (condition) => {
//   return new Promise((resolve, reject) => {
//     let sql = `SELECT COUNT(*) as count FROM tbl_drinks dt where dt.is_deleted = 0`;
//     if (condition.name) {
//       sql += ` AND dt.name like '%${condition.name}%'`;
//     }
//     if (condition.type) {
//       sql += ` AND dt.type like '%${condition.type}%'`;
//     }
//     pool.query(sql, (err, result) => {
//       if (err) {
//         console.error('An error occurred:', err);
//         reject(err);
//       }
//       resolve(result[0].count);
//     });
//   });
// }

module.exports = {
  getDrinkList,
  // getDrinkCount
};