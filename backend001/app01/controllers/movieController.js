const express = require('express');
const { verifyToken } = require('../authorization');
// Import the movieService module
const movieService = require('../service/movieService');

// Import any required modules or dependencies
// For example, if you're using Express.js:

// Create a router instance
const router = express.Router();

// For example, a route to get a movie by ID
const movieList = (req, res) => {
  // 如果没登录
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  // 验证token
  verifyToken(req, res, () => {
    console.log('token验证通过');
    // Call the movieService module's queryMovies method
    movieService.queryMovies(req.query).then((result) => {
      console.log('service result:', result);
      return res.json({ code: '000000', msg: 'success', data: result});
    }).catch((error) => {
      console.error('An error occurred:', error);
      return res.json({ code: '999999', msg: 'ERROR : ' + error});
    });
  });
};

const movieDetail = (req, res) => {
  // 如果没登录
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  // 验证token
  verifyToken(req, res, () => {
    console.log('token验证通过');
    // Call the movieService module's queryMovieById method
    movieService.queryMovieById(req.params.movieId).then((result) => {
      console.log('service result:', result);
      return res.json({ code: '000000', msg: 'success', data: result});
    }).catch((error) => {
      console.error('An error occurred:', error);
      return res.json({ code: '999999', msg: 'ERROR : ' + error});
    });
  });
}

const addMovie = (req, res) => {
  // 如果没登录
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  // 验证token
  verifyToken(req, res, () => {
    console.log('token验证通过');
    // Call the movieService module's addMovie method
    movieService.addMovie(req.body).then((result) => {
      console.log('service result:', result);
      return res.json({ code: '000000', msg: 'success', data: result});
    }
    ).catch((error) => {
      console.error('An error occurred:', error);
      return res.json({ code: '999999', msg: 'ERROR : ' + error});
    });
  });
}

const updateMovie = (req, res) => {
  // 如果没登录
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  // 验证token
  verifyToken(req, res, () => {
    console.log('token验证通过');
    // Call the movieService module's updateMovie method
    // console.log('req.params:', req.params);
    // console.log('req.body:', req.body);
    // console.log('req.query:', req.query);
    movieService.updateMovie(req.query).then((result) => {
      console.log('service result:', result);
      return res.json({ code: '000000', msg: 'success'});
    }).catch((error) => {
      console.error('An error occurred:', error);
      return res.json({ code: '999999', msg: 'ERROR : ' + error});
    });
  });
}

const deleteMovie = (req, res) => {
  // 如果没登录
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  // 验证token
  verifyToken(req, res, () => {
    console.log('token验证通过');
    // Call the movieService module's deleteMovie method
    movieService.deleteMovie(req.params.movieId).then((result) => {
      console.log('service result:', result);
      return res.json({ code: '000000', msg: 'success', data: result});
    }).catch((error) => {
      console.error('An error occurred:', error);
      return res.json({ code: '999999', msg: 'ERROR : ' + error});
    });
  });
}

// Export the router
module.exports = {
  movieList,
  movieDetail,
  addMovie,
  updateMovie,
  deleteMovie
};