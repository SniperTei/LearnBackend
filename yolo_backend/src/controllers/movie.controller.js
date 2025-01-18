const MovieService = require('../services/movie.service');
const ApiResponse = require('../utils/response');

class MovieController {
  constructor() {
    this.movieService = new MovieService();
  }

  async createMovie(req, res, next) {
    try {
      const movieData = req.body;
      const userId = req.user._id;

      const movie = await this.movieService.createMovie(movieData, userId);
      const response = ApiResponse.success(movie, '电影创建成功', 201);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listMovies(req, res, next) {
    try {
      const { page = 1, limit = 10, title, keyword, genres, actors, director, ...query } = req.query;
      const options = {
        skip: (page - 1) * limit,
        limit: parseInt(limit)
      };

      // 过滤掉空字符串参数，只保留有效的搜索条件
      const searchParams = {
        ...query,
        ...(title && title.trim() && { title: title.trim() }),
        ...(keyword && keyword.trim() && { keyword: keyword.trim() }),
        ...(genres && genres.trim() && { genres: genres.trim().split(',').filter(Boolean) }),
        ...(actors && actors.trim() && { actors: actors.trim().split(',').filter(Boolean) }),
        ...(director && director.trim() && { director: director.trim() })
      };

      const result = await this.movieService.listMovies(searchParams, options);
      const response = ApiResponse.success(result, '获取电影列表成功', 200);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getMovie(req, res, next) {
    try {
      const { id } = req.params;
      const movie = await this.movieService.getMovie(id);
      const response = ApiResponse.success(movie, '获取电影详情成功', 200);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateMovie(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user._id;

      const movie = await this.movieService.updateMovie(id, updateData, userId);
      const response = ApiResponse.success(movie, '电影更新成功', 200);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteMovie(req, res, next) {
    try {
      const { id } = req.params;
      const movie = await this.movieService.deleteMovie(id);
      const response = ApiResponse.success(movie, '电影删除成功', 200);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MovieController();
