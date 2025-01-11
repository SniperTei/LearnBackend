const UserMovieService = require('../services/userMovie.service');
const { ApiResponse } = require('../utils/response');

class UserMovieController {
  static async getUserMovie(req, res, next) {
    try {
      const userId = req.user._id;
      const { movieId } = req.params;

      const userMovie = await UserMovieService.getUserMovie(userId, movieId);
      
      return ApiResponse.success(res, {
        msg: '获取观影记录成功',
        data: userMovie
      });
    } catch (error) {
      next(error);
    }
  }

  static async listUserMovies(req, res, next) {
    try {
      const userId = req.user._id;
      const { page = 1, limit = 10, status } = req.query;
      const options = {
        skip: (page - 1) * limit,
        limit: parseInt(limit)
      };

      const result = await UserMovieService.listUserMovies(userId, { status }, options);
      
      return ApiResponse.success(res, {
        msg: '获取观影列表成功',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserStats(req, res, next) {
    try {
      const userId = req.user._id;
      const stats = await UserMovieService.getUserStats(userId);
      
      return ApiResponse.success(res, {
        msg: '获取用户观影统计成功',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsWatched(req, res, next) {
    try {
      const userId = req.user._id;
      const { movieId } = req.params;
      const { rating, review } = req.body;

      const userMovie = await UserMovieService.markAsWatched(userId, movieId, rating, review);
      
      return ApiResponse.success(res, {
        msg: '标记为已看成功',
        data: userMovie
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsWantToWatch(req, res, next) {
    try {
      const userId = req.user._id;
      const { movieId } = req.params;

      const userMovie = await UserMovieService.markAsWantToWatch(userId, movieId);
      
      return ApiResponse.success(res, {
        msg: '添加到想看列表成功',
        data: userMovie
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeFromWantToWatch(req, res, next) {
    try {
      const userId = req.user._id;
      const { movieId } = req.params;

      const userMovie = await UserMovieService.removeFromWantToWatch(userId, movieId);
      
      return ApiResponse.success(res, {
        msg: '从想看列表移除成功',
        data: userMovie
      });
    } catch (error) {
      next(error);
    }
  }

  static async toggleLike(req, res, next) {
    try {
      const userId = req.user._id;
      const { movieId } = req.params;

      const userMovie = await UserMovieService.toggleLike(userId, movieId);
      
      return ApiResponse.success(res, {
        msg: userMovie.likeStatus === 'Y' ? '收藏电影成功' : '取消收藏成功',
        data: userMovie
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateRating(req, res, next) {
    try {
      const userId = req.user._id;
      const { movieId } = req.params;
      const { rating } = req.body;

      const userMovie = await UserMovieService.updateRating(userId, movieId, rating);
      
      return ApiResponse.success(res, {
        msg: '更新评分成功',
        data: userMovie
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateReview(req, res, next) {
    try {
      const userId = req.user._id;
      const { movieId } = req.params;
      const { review } = req.body;

      const userMovie = await UserMovieService.updateReview(userId, movieId, review);
      
      return ApiResponse.success(res, {
        msg: '更新评论成功',
        data: userMovie
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserMovieController;
