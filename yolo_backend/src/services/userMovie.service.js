const UserMovieDAL = require('../dal/userMovie.dal');
const MovieDAL = require('../dal/movie.dal');

class UserMovieService {
  constructor() {
    this.userMovieDAL = new UserMovieDAL();
    this.movieDAL = new MovieDAL();
  }

  async updateUserMovie(userId, movieId, updateData) {
    // 检查电影是否存在
    const movie = await this.movieDAL.findById(movieId);
    if (!movie) {
      throw new Error('未找到电影');
    }

    // 查找或创建用户电影记录
    let userMovie = await this.userMovieDAL.findOne(userId, movieId);
    
    if (!userMovie) {
      userMovie = await this.userMovieDAL.create({
        userId,
        movieId,
        ...updateData,
        createdBy: userId,
        updatedBy: userId
      });
    } else {
      userMovie = await this.userMovieDAL.update(userId, movieId, {
        ...updateData,
        updatedBy: userId
      });
    }

    return this._formatUserMovie(userMovie);
  }

  async getUserMovie(userId, movieId) {
    const userMovie = await this.userMovieDAL.findOne(userId, movieId);
    if (!userMovie) {
      throw new Error('未找到观影记录');
    }
    return this._formatUserMovie(userMovie);
  }

  async deleteUserMovie(userId, movieId) {
    const userMovie = await this.userMovieDAL.findOne(userId, movieId);
    if (!userMovie) {
      throw new Error('未找到观影记录');
    }

    await this.userMovieDAL.delete(userId, movieId);
    return this._formatUserMovie(userMovie);
  }

  async listUserMovies(userId, params, options) {
    const { status } = params;
    let result;

    switch (status) {
      case 'watched':
        result = await this.userMovieDAL.findWatchedMovies(userId, options);
        break;
      case 'want_to_watch':
        result = await this.userMovieDAL.findWantToWatchMovies(userId, options);
        break;
      case 'liked':
        result = await this.userMovieDAL.findLikedMovies(userId, options);
        break;
      default:
        result = await this.userMovieDAL.findUserMovies(userId, {}, options);
    }

    const { userMovies, total } = result;
    const totalPages = Math.ceil(total / options.limit);
    const currentPage = Math.floor(options.skip / options.limit) + 1;

    return {
      userMovies: userMovies.map(userMovie => this._formatUserMovie(userMovie)),
      total,
      totalPages,
      currentPage
    };
  }

  async getUserStats(userId) {
    const stats = await this.userMovieDAL.findUserMovieStats(userId);
    return stats;
  }

  async markAsWatched(userId, movieId, rating, review) {
    return await this.updateUserMovie(userId, movieId, {
      watchStatus: 'watched',
      rating,
      review
    });
  }

  async markAsWantToWatch(userId, movieId) {
    return await this.updateUserMovie(userId, movieId, {
      wantToWatchStatus: 'Y'
    });
  }

  async removeFromWantToWatch(userId, movieId) {
    return await this.updateUserMovie(userId, movieId, {
      wantToWatchStatus: 'N'
    });
  }

  async toggleLike(userId, movieId) {
    const userMovie = await this.userMovieDAL.findOne(userId, movieId);
    const newLikeStatus = userMovie && userMovie.likeStatus === 'Y' ? 'N' : 'Y';
    
    return await this.updateUserMovie(userId, movieId, {
      likeStatus: newLikeStatus
    });
  }

  /**
   * 格式化用户电影数据，将_id转换为userMovieId
   * @private
   */
  _formatUserMovie(userMovie) {
    if (!userMovie) return null;

    const userMovieObj = userMovie.toObject ? userMovie.toObject() : userMovie;
    const { _id, ...rest } = userMovieObj;

    return {
      userMovieId: _id.toString(),
      ...rest
    };
  }
}

module.exports = UserMovieService;
