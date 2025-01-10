const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const travelDiarySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  location: {
    country: String,
    city: String,
    place: String
  },
  images: [{
    url: String,
    caption: String
  }],
  travelPlanId: {
    type: Schema.Types.ObjectId,
    ref: 'TravelPlan',
    required: false
  },
  tags: [String],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TravelDiary', travelDiarySchema);
