const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  time: String,
  location: String,
  activity: { type: String, required: true },
  duration: String,
  notes: String,
  images: [{
    url: { type: String, required: true },
    description: String,
    uploadDate: { type: Date, default: Date.now }
  }]
});

const itinerarySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  date: { type: Date, required: true },
  activities: [activitySchema]
});

const travelPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  destination: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    locations: [String]
  },
  itinerary: [itinerarySchema],
  budget: {
    total: Number,
    currency: { type: String, default: 'CNY' },
    breakdown: {
      transportation: Number,
      accommodation: Number,
      activities: Number,
      food: Number,
      other: Number
    }
  },
  coverImage: {
    url: String,
    description: String,
    uploadDate: { type: Date, default: Date.now }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'completed'],
    default: 'draft'
  },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
}, {
  timestamps: true
});

module.exports = mongoose.model('TravelPlan', travelPlanSchema);
