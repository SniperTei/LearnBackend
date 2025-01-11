const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '电影名称是必需的'],
    trim: true
  },
  actors: [{
    type: String,
    trim: true
  }],
  genres: [{
    type: String,
    trim: true
  }],
  director: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String
  },
  movieUni: {
    type: String,
    unique: true,
    sparse: true
  },
  country: {
    type: String,
    trim: true
  },
  publishDate: {
    type: Date
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  eflag: {
    type: String,
    enum: ['Y', 'N'],
    default: 'N'
  },
  devFlag: {
    type: String,
    enum: ['Y', 'N'],
    default: 'N'
  },
  desc: {
    type: String
  },
  synopsis: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// 创建索引
movieSchema.index({ title: 1 });
movieSchema.index({ movieUni: 1 }, { sparse: true });
movieSchema.index({ genres: 1 });
movieSchema.index({ actors: 1 });
movieSchema.index({ director: 1 });
movieSchema.index({ country: 1 });
movieSchema.index({ publishDate: -1 });
movieSchema.index({ rating: -1 });

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
