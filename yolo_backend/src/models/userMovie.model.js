const mongoose = require('mongoose');

const userMovieSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  watchStatus: {
    type: String,
    enum: ['watched', 'not_watched'],
    default: 'not_watched'
  },
  wantToWatchStatus: {
    type: String,
    enum: ['Y', 'N'],
    default: 'N'
  },
  likeStatus: {
    type: String,
    enum: ['Y', 'N'],
    default: 'N'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  review: {
    type: String,
    trim: true
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

// 创建复合唯一索引确保用户不会重复记录同一部电影
userMovieSchema.index({ userId: 1, movieId: 1 }, { unique: true });

// 创建其他有用的索引
userMovieSchema.index({ userId: 1, watchStatus: 1 });
userMovieSchema.index({ userId: 1, wantToWatchStatus: 1 });
userMovieSchema.index({ userId: 1, likeStatus: 1 });
userMovieSchema.index({ movieId: 1, rating: -1 });
userMovieSchema.index({ createdAt: -1 });

const UserMovie = mongoose.model('UserMovie', userMovieSchema);

module.exports = UserMovie;
