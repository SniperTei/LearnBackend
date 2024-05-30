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
      return { list: result, count: count };
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
      return result;
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

  deleteBook: async (bookId) => {
    try {
      // Call the deleteBook method of the book DAO
      let result = await bookDAO.deleteBook(bookId);
      console.log('result:', result);
      return result;
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  }
};

// Export the book service object
module.exports = bookService;