const mongoose = require('mongoose');

const emovie = new mongoose.Schema({
  title: { // 电影名称
    type: String,
    required: true,
  },
  bango: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: false,
  },
  actors: { // 演员
    type: [String],
    required: false,
  },
  tags: {
    type: [String],
    required: false,
  },
  maker: {
    type: [String],
    required: false,
  },
  // 系列
  series: {
    type: String,
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
  }
});

// 输出模型
module.exports = mongoose.model('EMovie', emovie, 'emovie');

