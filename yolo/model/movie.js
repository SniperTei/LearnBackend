const mongoose = require('mongoose');

const movie = new mongoose.Schema({
  title: { // 电影名称
    type: String,
    required: true,
  },
  genre: { // 类型
    type: [String],
    required: false,
  },
  country: { // 国家
    type: String,
    required: false,
  },
  release_date: { // 上映日期
    type: Date,
    required: false,
  },
  description: { // 简介
    type: String,
    required: false,
  },
  image: { // 海报
    type: String,
    required: false,
  },
  duration: { // 时长
    type: Number,
    required: false,
  },
  jyp_viewed: { // 是否被jyp观看
    type: String,
    required: false,
  },
  sniper_viewed: { // 是否被sniper观看
    type: String,
    required: false,
  },
});

// 输出模型
module.exports = mongoose.model('Movie', movie, 'movie');

