const UserMovieDAL = require('../dal/userMovie.dal');
const MovieDAL = require('../dal/movie.dal');

class UserMovieService {
  static async updateUserMovie(userId, movieId, updateData) {
    // 检查电影是否存在
    const movie = await MovieDAL.findById(movieId);
    if (!movie) {
      throw new Error('未找到电影');
    }

    // 查找或创建用户电影记录
    let userMovie = await UserMovieDAL.findOne(userId, movieId);
    
    if (!userMovie) {
      userMovie = await UserMovieDAL.create({
        userId,
        movieId,
        ...updateData,
        createdBy: userId,
        updatedBy: userId
      });
    } else {
      userMovie = await UserMovieDAL.update(userId, movieId, {
        ...updateData,
        updatedBy: userId
      });
    }

    return userMovie;
  }

  static async getUserMovie(userId, movieId) {
    const userMovie = await UserMovieDAL.findOne(userId, movieId);
    if (!userMovie) {
      throw new Error('未找到观影记录');
    }
    return userMovie;
  }

  static async deleteUserMovie(userId, movieId) {
    const userMovie = await UserMovieDAL.findOne(userId, movieId);
    if (!userMovie) {
      throw new Error('未找到观影记录');
    }

    await UserMovieDAL.delete(userId, movieId);
    return userMovie;
  }

  static async listUserMovies(userId, params, options) {
    const { status } = params;
    let result;

    switch (status) {
      case 'watched':
        result = await UserMovieDAL.findWatchedMovies(userId, options);
        break;
      case 'want_to_watch':
        result = await UserMovieDAL.findWantToWatchMovies(userId, options);
        break;
      case 'liked':
        result = await UserMovieDAL.findLikedMovies(userId, options);
        break;
      default:
        result = await UserMovieDAL.findUserMovies(userId, {}, options);
    }

    const { userMovies, total } = result;
    const totalPages = Math.ceil(total / options.limit);
    const currentPage = Math.floor(options.skip / options.limit) + 1;

    return {
      userMovies,
      total,
      totalPages,
      currentPage
    };
  }

  static async getUserStats(userId) {
    const stats = await UserMovieDAL.findUserMovieStats(userId);
    return stats;
  }

  static async markAsWatched(userId, movieId, rating, review) {
    return await this.updateUserMovie(userId, movieId, {
      watchStatus: 'watched',
      rating,
      review
    });
  }

  static async markAsWantToWatch(userId, movieId) {
    return await this.updateUserMovie(userId, movieId, {
      wantToWatchStatus: 'Y'
    });
  }

  static async removeFromWantToWatch(userId, movieId) {
    return await this.updateUserMovie(userId, movieId, {
      wantToWatchStatus: 'N'
    });
  }

  static async toggleLike(userId, movieId) {
    const userMovie = await UserMovieDAL.findOne(userId, movieId);
    const newLikeStatus = userMovie && userMovie.likeStatus === 'Y' ? 'N' : 'Y';
    
    return await this.updateUserMovie(userId, movieId, {
      likeStatus: newLikeStatus
    });
  }

  static async updateRating(userId, movieId, rating) {
    return await this.updateUserMovie(userId, movieId, {
      rating
    });
  }

  static async updateReview(userId, movieId, review) {
    return await this.updateUserMovie(userId, movieId, {
      review
    });
  }
}

module.exports = UserMovieService;
