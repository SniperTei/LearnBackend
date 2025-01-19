const MovieDAL = require('../dal/movie.dal');
const UserMovieDAL = require('../dal/userMovie.dal');

class MovieService {
  async createMovie(movieData, userId) {
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

    return this._formatMovie(movie);
  }

  async listMovies(query, options) {
    const { keyword, genres, actors, director, ...otherQuery } = query;
    let result;

    // 根据不同的查询参数使用不同的查询方法
    if (keyword) {
      result = await MovieDAL.search(keyword, options);
    } else if (genres) {
      result = await MovieDAL.findByGenres(genres, options);
    } else if (actors) {
      result = await MovieDAL.findByActors(actors, options);
    } else if (director) {
      result = await MovieDAL.findByDirector(director, options);
    } else {
      result = await MovieDAL.findAll(otherQuery, options);
    }

    const { movies, total } = result;
    const totalPages = Math.ceil(total / options.limit);
    const currentPage = Math.floor(options.skip / options.limit) + 1;

    return {
      movies: movies.map(movie => this._formatMovie(movie)),
      total,
      totalPages,
      currentPage
    };
  }

  async getMovie(id) {
    const movie = await MovieDAL.findById(id);
    if (!movie) {
      throw new Error('未找到电影');
    }

    const stats = await UserMovieDAL.findMovieStats(id);
    const formattedMovie = this._formatMovie(movie);

    return {
      ...formattedMovie,
      stats
    };
  }

  async updateMovie(id, updateData, userId) {
    const movie = await MovieDAL.findById(id);
    if (!movie) {
      throw new Error('未找到电影');
    }

    // 如果更新了movieUni，检查是否与其他电影冲突
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

    return this._formatMovie(updatedMovie);
  }

  async deleteMovie(id) {
    const movie = await MovieDAL.findById(id);
    if (!movie) {
      throw new Error('未找到电影');
    }

    const deletedMovie = await MovieDAL.delete(id);
    return this._formatMovie(deletedMovie);
  }

  // 格式化电影数据，将_id转换为movieId
  _formatMovie(movie) {
    if (!movie) return null;

    const movieObj = movie.toObject ? movie.toObject() : movie;
    const { _id, ...rest } = movieObj;

    return {
      movieId: _id.toString(),
      ...rest
    };
  }
}

module.exports = MovieService;
