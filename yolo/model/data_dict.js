const mongoose = require('mongoose');

// 数据字典，先留着，感觉以后能用到
const dataDict = new mongoose.Schema({
  dict_type: {
    type: String,
    required: true,
  },
  dict_type_desc: {
    type: String,
    required: false
  },
  dict_code: {
    type: String,
    required: true,
  },
  dict_desc: {
    type: String,
    required: true,
  },
  dict_sort: {
    type: Number,
    required: false,
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

module.exports = mongoose.model('DataDict', dataDict, 'data_dict');