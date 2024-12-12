const mongoose = require('mongoose');

const book = new mongoose.Schema({
  title: { // 书名
    type: String,
    required: true,
  },
  author: { // 作者
    type: String,
    required: true,
  },
  publisher: { // 出版社
    type: String,
    required: true,
  },
  pubdate: { // 出版日期
    type: Date,
    required: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  updated_by: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: String,
    required: true,
  },
});

// 输出模型
module.exports = mongoose.model('Book', book, 'book');