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
  },
  // 新增
  addBook: async (params) => {
    try {
      let { title, author, publisher, pubdate, created_by, updated_by } = params;
      if (!title || !author || !publisher || !pubdate || !created_by || !updated_by) {
        throw new Error('Missing parameters');
      }
      let book = new bookModel(params);
      await book.save();
      return { msg: 'Add book success', data: book };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  // 修改
  updateBook: async (params) => {
    try {
      let { _id, title, author, publisher, pubdate, updated_by } = params;
      if (!_id || !title || !author || !publisher || !pubdate || !updated_by) {
        throw new Error('Missing parameters');
      }
      let book = await bookModel.findById(_id);
      if (!book) {
        throw new Error('Book not found');
      }
      book.title = title;
      book.author = author;
      book.publisher = publisher;
      book.pubdate = pubdate;
      book.updated_by = updated_by;
      book.updated_at = Date.now();
      await book.save();
      return { msg: 'Update book success', data: book };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  // 删除
  deleteBook: async (params) => {
    try {
      let { _id } = params;
      if (!_id) {
        throw new Error('Missing parameters');
      }
      let book = await bookModel.findById(_id);
      if (!book) {
        throw new Error('Book not found');
      }
      await bookModel.deleteOne({ _id });
      return { msg: 'Delete book success' };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = bookService;