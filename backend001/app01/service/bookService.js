const { query } = require('express');
const bookDAO = require('../dao/bookDAO');
const moment = require('moment');

// Import the book DAO module
const bookService = {

  // promise
  queryBooks: async (query) => {
    console.log('query:', query);
    try {
      let page = query.page || 1;
      let limit = query.limit || 10;
      let condition = query.book || {};
      // Call the getBookById method of the book DAO
      let result = await bookDAO.getBookList(page, limit, condition);
      let count = await bookDAO.getBookCount(condition);
      // 遍历result，将每个book的pudate转换为yyyy-MM-dd格式
      result.forEach((book) => {
        book.pubdate = moment(book.pubdate).format('YYYY-MM-DD');
      });
      console.log('result:', result);
      console.log('count:', count);
      return { list: result, total: count };
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  },

  queryBookById: async (bookId) => {
    try {
      // Call the getBookById method of the book DAO
      let result = await bookDAO.getBook(bookId);
      console.log('result:', result);
      if (result.length > 0) {
        result[0].pubdate = moment(result[0].pubdate).format('YYYY-MM-DD');
        result[0].typeDesc = getBookTypeDesc(result[0].type);
        return result[0];
      } else {
        return {};
      }
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  },

  addBook: async (book) => {
    try {
      // Call the addBook method of the book DAO
      let result = await bookDAO.addBook(book);
      console.log('result:', result);
      return result;
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  },

  updateBook: async (bookId, book) => {
    try {
      // Call the updateBook method of the book DAO
      let result = await bookDAO.updateBook(bookId, book);
      console.log('result:', result);
      return result;
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  },

  physicalDeleteBook: async (bookId) => {
    try {
      // Call the deleteBook method of the book DAO
      let result = await bookDAO.physicalDeleteBook(bookId);
      console.log('result:', result);
      return result;
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  },

  logicalDeleteBook: async (bookId) => {
    try {
      // Call the logicalDeleteBook method of the book DAO
      let result = await bookDAO.logicalDeleteBook(bookId);
      console.log('result:', result);
      return result;
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  }
};

const getBookTypeDesc = (type) => {
  let typeDesc = '';
  // 类型(0: 未知, 1: 科幻, 2: 悬疑, 3: 爱情, 4: 惊悚, 5: 恐怖, 6: 励志, 7: 历史, 8: 传记, 9: 其他)
  switch (type) {
    case 0:
      typeDesc = '未知';
      break;
    case 1:
      typeDesc = '科幻';
      break;
    case 2:
      typeDesc = '悬疑';
      break;
    case 3:
      typeDesc = '爱情';
      break;
    case 4:
      typeDesc = '惊悚';
      break;
    case 5:
      typeDesc = '恐怖';
      break;
    case 6:
      typeDesc = '励志';
      break;
    case 7:
      typeDesc = '历史';
      break;
    case 8:
      typeDesc = '传记';
      break;
    case 9:
      typeDesc = '其他';
      break;
    default:
      typeDesc = '未知';
      break;
  }
  return typeDesc;
}

// Export the book service object
module.exports = bookService;