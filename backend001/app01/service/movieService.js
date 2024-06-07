const movieDAO = require('../dao/movieDAO');
const movieCommentDAO = require('../dao/movieCommentDAO');
const moment = require('moment');

const movieService = {
  queryMovies: async (query) => {
    console.log('query:', query);
    try {
      let page = query.page || 1;
      let limit = query.limit || 10;
      let condition = query.condition || {};
      let result = await movieDAO.getMovieList(page, limit, condition);
      let count = await movieDAO.getMovieCount(condition);
      result.forEach((movie) => {
        movie.release_date = moment(movie.release_date).format('YYYY-MM-DD');
      });
      return { list: result, total: count };
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  },
  queryMovieById: async (query) => {
    try {
      let page = query.page || 1;
      let limit = query.limit || 10;
      let movieId = query.movieId || {};
      // 电影
      let result = await movieDAO.getMovie(movieId);
      // 电影评论
      let movieComments = await movieCommentDAO.getMovieCommentList(page, limit, movieId);
      if (movieComments.length > 0) {
        movieComments.forEach((comment) => {
          comment.created_at = moment(comment.created_at).format('YYYY-MM-DD HH:mm:ss');
          comment.updated_at = moment(comment.updated_at).format('YYYY-MM-DD HH:mm:ss');
        });
      }
      // 电影评论总数
      let count = await movieCommentDAO.getMovieCommentCount(movieId);
      let movieComment = {
        list: movieComments,
        total: count
      };
      if (result.length > 0) {
        result[0].release_date = moment(result[0].release_date).format('YYYY-MM-DD');
        // return { movie: result[0], 'aaa': 'bbb' };
        return { movie: result[0], movieComment: movieComment };
      } else {
        return {};
      }
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  },
  addMovie: async (movie) => {
    try {
      let result = await movieDAO.addMovie(movie);
      console.log('result:', result);
      return result;
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  },
  updateMovie: async (movie) => {
    try {
      console.log('movie1:', movie);
      // 转换成数据库需要的格式
      movie.updated_at = moment().format('YYYY-MM-DD HH:mm:ss');
      movie.created_at = moment(movie.created_at).format('YYYY-MM-DD HH:mm:ss');
      // movie.sniper_viewed = movie.sniper_viewd ? 1 : 0;
      // movie.jyp_viewed = movie.jyp_viewed ? 1 : 0;

      let result = await movieDAO.updateMovie(movie);
      console.log('result:', result);
      return result;
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  },
  physicalDeleteMovie: async (movie) => {
    try {
      let result = await movieDAO.physicalDeleteMovie(movie);
      console.log('result:', result);
      return result;
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  },

  logicDeleteMovie: async (movie) => {
    try {
      let result = await movieDAO.logicDeleteMovie(movie);
      console.log('result:', result);
      return result;
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  },

  addMovieComment: async (movieComment) => {
    try {
      let result = await movieCommentDAO.addMovieComment(movieComment);
      console.log('result:', result);
      return result;
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  }
};

module.exports = movieService;