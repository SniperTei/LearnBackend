const bookModel = require('../model/book');
const moment = require('moment');

const bookService = {
  // 查询
  queryBookList: async (params) => {
    let page = 1;
    let limit = 10;
    let condition = {};
    console.log('params:', params);
    if (params.page) {
      page = parseInt(params.page);
    }
    if (params.limit) {
      limit = parseInt(params.limit);
    }
    if (params.condition) { // 查询条件
      // 把空字段去掉
      for (let key in params.condition) {
        if (params.condition[key]) {
          condition[key] = params.condition[key];
        }
      }
    }
    console.log('condition:', condition);
    try {
      // 获取第一页的10个书籍列表
      let bookList = await bookModel.find(condition).skip((page - 1) * limit).limit(limit);
      bookList = bookList.map(book => {
        return {
          ...book._doc,
          pubdate: moment(book.pubdate).format('YYYY-MM-DD')
        };
      });
      // 所有书籍的总数
      let total = await bookModel.countDocuments(condition);
      return { msg: 'Query book list success', data: { list: bookList, total: total } };
    } catch (error) {
      throw new Error(error.message);
    }
    // try {
    //   // 获取第一页的10个书籍列表
    //   let bookList = await bookModel.find().skip((page - 1) * limit).limit(limit);
    //   bookList = bookList.map(book => {
    //     return {
    //       ...book._doc,
    //       pubdate: moment(book.pubdate).format('YYYY-MM-DD')
    //     };
    //   });
    //   // 所有书籍的总数
    //   let total = await bookModel.countDocuments();
    //   return { msg: 'Query book list success', data: { list: bookList, total: total } };
    // } catch (error) {
    //   throw new Error(error.message);
    // }
  },
};

module.exports = bookService;