const MovieService = require('../services/movie.service');
const ApiResponse = require('../utils/response');

class MovieController {
  static async createMovie(req, res, next) {
    try {
      const movieData = req.body;
      const userId = req.user._id;

      const movie = await MovieService.createMovie(movieData, userId);
      const response = ApiResponse.success(movie, '电影创建成功', 201);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async listMovies(req, res, next) {
    try {
      const { page = 1, limit = 10, ...query } = req.query;
      const options = {
        skip: (page - 1) * limit,
        limit: parseInt(limit)
      };
      const result = await MovieService.listMovies(query, options);
      const response = ApiResponse.success(result, '获取电影列表成功', 200);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getMovie(req, res, next) {
    try {
      const { id } = req.params;
      const movie = await MovieService.getMovie(id);
      const response = ApiResponse.success(movie, '获取电影详情成功', 200);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateMovie(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user._id;

      const movie = await MovieService.updateMovie(id, updateData, userId);
      const response = ApiResponse.success(movie, '更新电影成功', 200);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async deleteMovie(req, res, next) {
    try {
      const { id } = req.params;
      const movie = await MovieService.deleteMovie(id);
      const response = ApiResponse.success(movie, '删除电影成功', 200);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async searchMovies(req, res, next) {
    try {
      const { page = 1, limit = 10, keyword, genres, actors, director } = req.query;
      const options = {
        skip: (page - 1) * limit,
        limit: parseInt(limit)
      };

      const params = { keyword, genres, actors, director };
      const result = await MovieService.searchMovies(params, options);
      const response = ApiResponse.success(result, '搜索电影成功', 200);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MovieController;
