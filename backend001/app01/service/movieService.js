const { query } = require('express');
const movieDAO = require('../dao/movieDAO');
const moment = require('moment');

const movieService = {
  queryMovies: async (query) => {
    console.log('query:', query);
    try {
      let page = query.page || 1;
      let limit = query.limit || 10;
      let condition = query.movie || {};
      let result = await movieDAO.getMovieList(page, limit, condition);
      let count = await movieDAO.getMovieCount(condition);
      result.forEach((movie) => {
        movie.release_date = moment(movie.release_date).format('YYYY-MM-DD');
      });
      console.log('result:', result);
      console.log('count:', count);
      return { list: result, total: count };
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  },
  queryMovieById: async (movieId) => {
    try {
      let result = await movieDAO.getMovie(movieId);
      console.log('result:', result);
      if (result.length > 0) {
        result[0].release_date = moment(result[0].release_date).format('YYYY-MM-DD');
        return result[0];
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
  }
};

module.exports = movieService;