const MovieDAL = require('../dal/movie.dal');
const UserMovieDAL = require('../dal/userMovie.dal');

class MovieService {
  static async createMovie(movieData, userId) {
    // 检查movieUni是否已存在
    if (movieData.movieUni) {
      const existingMovie = await MovieDAL.findByMovieUni(movieData.movieUni);
      if (existingMovie) {
        throw new Error('电影ID已存在');
      }
    }

    const movie = await MovieDAL.create({
      ...movieData,
      createdBy: userId,
      updatedBy: userId
    });

    return movie;
  }

  static async listMovies(query, options) {
    const { movies, total } = await MovieDAL.findAll(query, options);
    const totalPages = Math.ceil(total / options.limit);
    const currentPage = Math.floor(options.skip / options.limit) + 1;

    return {
      movies,
      total,
      totalPages,
      currentPage
    };
  }

  static async getMovie(id) {
    const movie = await MovieDAL.findById(id);
    if (!movie) {
      throw new Error('未找到电影');
    }

    // 获取电影统计信息
    const stats = await UserMovieDAL.findMovieStats(id);
    
    return {
      ...movie.toObject(),
      stats
    };
  }

  static async updateMovie(id, updateData, userId) {
    const movie = await MovieDAL.findById(id);
    if (!movie) {
      throw new Error('未找到电影');
    }

    // 如果更新包含movieUni，检查是否与其他电影冲突
    if (updateData.movieUni && updateData.movieUni !== movie.movieUni) {
      const existingMovie = await MovieDAL.findByMovieUni(updateData.movieUni);
      if (existingMovie && existingMovie._id.toString() !== id) {
        throw new Error('电影ID已存在');
      }
    }

    const updatedMovie = await MovieDAL.update(id, {
      ...updateData,
      updatedBy: userId
    });

    return updatedMovie;
  }

  static async deleteMovie(id) {
    const movie = await MovieDAL.findById(id);
    if (!movie) {
      throw new Error('未找到电影');
    }

    await MovieDAL.delete(id);
    return movie;
  }

  static async searchMovies(params, options) {
    const { keyword, genres, actors, director } = params;
    let result;

    if (keyword) {
      result = await MovieDAL.search(keyword, options);
    } else if (genres) {
      result = await MovieDAL.findByGenres(genres, options);
    } else if (actors) {
      result = await MovieDAL.findByActors(actors, options);
    } else if (director) {
      result = await MovieDAL.findByDirector(director, options);
    } else {
      result = await MovieDAL.findAll({}, options);
    }

    const { movies, total } = result;
    const totalPages = Math.ceil(total / options.limit);
    const currentPage = Math.floor(options.skip / options.limit) + 1;

    return {
      movies,
      total,
      totalPages,
      currentPage
    };
  }
}

module.exports = MovieService;
