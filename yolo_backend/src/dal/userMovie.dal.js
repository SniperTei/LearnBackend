const UserMovie = require('../models/userMovie.model');

class UserMovieDAL {
  static async create(userMovieData) {
    return await UserMovie.create(userMovieData);
  }

  static async findOne(userId, movieId) {
    return await UserMovie.findOne({ userId, movieId })
      .populate('movieId')
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username');
  }

  static async update(userId, movieId, updateData) {
    return await UserMovie.findOneAndUpdate(
      { userId, movieId },
      updateData,
      { new: true, runValidators: true }
    ).populate('movieId')
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username');
  }

  static async delete(userId, movieId) {
    return await UserMovie.findOneAndDelete({ userId, movieId });
  }

  static async findUserMovies(userId, query, options) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    const finalQuery = { userId, ...query };

    const userMovies = await UserMovie.find(finalQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('movieId')
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username');

    const total = await UserMovie.countDocuments(finalQuery);

    return { userMovies, total };
  }

  static async findWatchedMovies(userId, options) {
    return await this.findUserMovies(
      userId,
      { watchStatus: 'watched' },
      options
    );
  }

  static async findWantToWatchMovies(userId, options) {
    return await this.findUserMovies(
      userId,
      { wantToWatchStatus: 'Y' },
      options
    );
  }

  static async findLikedMovies(userId, options) {
    return await this.findUserMovies(
      userId,
      { likeStatus: 'Y' },
      options
    );
  }

  static async findMovieStats(movieId) {
    const stats = await UserMovie.aggregate([
      { $match: { movieId: movieId } },
      {
        $group: {
          _id: null,
          watchCount: {
            $sum: { $cond: [{ $eq: ['$watchStatus', 'watched'] }, 1, 0] }
          },
          wantToWatchCount: {
            $sum: { $cond: [{ $eq: ['$wantToWatchStatus', 'Y'] }, 1, 0] }
          },
          likeCount: {
            $sum: { $cond: [{ $eq: ['$likeStatus', 'Y'] }, 1, 0] }
          },
          averageRating: { $avg: '$rating' },
          reviewCount: {
            $sum: { $cond: [{ $ne: ['$review', null] }, 1, 0] }
          }
        }
      }
    ]);

    return stats.length > 0 ? stats[0] : {
      watchCount: 0,
      wantToWatchCount: 0,
      likeCount: 0,
      averageRating: 0,
      reviewCount: 0
    };
  }

  static async findUserMovieStats(userId) {
    const stats = await UserMovie.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          watchedCount: {
            $sum: { $cond: [{ $eq: ['$watchStatus', 'watched'] }, 1, 0] }
          },
          wantToWatchCount: {
            $sum: { $cond: [{ $eq: ['$wantToWatchStatus', 'Y'] }, 1, 0] }
          },
          likedCount: {
            $sum: { $cond: [{ $eq: ['$likeStatus', 'Y'] }, 1, 0] }
          },
          reviewCount: {
            $sum: { $cond: [{ $ne: ['$review', null] }, 1, 0] }
          }
        }
      }
    ]);

    return stats.length > 0 ? stats[0] : {
      watchedCount: 0,
      wantToWatchCount: 0,
      likedCount: 0,
      reviewCount: 0
    };
  }
}

module.exports = UserMovieDAL;
