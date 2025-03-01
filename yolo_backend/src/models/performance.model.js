const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  performanceDate: {
    type: Date,
    required: true
  },
  performanceType: { // 注射inject、 皮肤skin、 手术operate
    type: String,
    required: true
  },
  // 金额
  amount: {
    type: String,
    required: true
  },
  // 消费项目A
  itemA: {
    type: String,
    required: true
  },
  // 消费项目B
  itemB: {
    type: String
  },
  // 备注
  remarks: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Performance', performanceSchema);
