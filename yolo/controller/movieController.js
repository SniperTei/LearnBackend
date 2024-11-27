const { verifyToken } = require('../authorization');
const movieService = require('../service/movieService');

const movieList = async (req, res) => {
  movieService.queryMovieList(req.query).then(result => {
    res.json({
      code: '000000',
      msg: result.msg,
      data: result.data
    });
  }).catch(err => {
    res.json({
      code: '100001',
      msg: err.message,
    });
  });
}

const movieAdd = async (req, res) => {
  // const token = req.headers['authorization'];
  try {
    // let verifyResult = verifyToken(token);
    // if (!verifyResult.valid) {
    //   throw new Error('Invalid token');
    // }
    movieService.addTestDatas().then(result => {
      res.json({
        code: '000000',
        msg: result.msg,
      });
    }).catch(err => {
      res.json({
        code: '100001',
        msg: err.message,
      });
    });
    // movieService.addMovie(req.body).then(result => {
    //   res.json({
    //     code: '000000',
    //     msg: result.msg,
    //   });
    // }).catch(err => {
    //   res.json({
    //     code: '100001',
    //     msg: err.message,
    //   });
    // });
  } catch (error) {
    res.json({
      code: '100002',
      msg: 'Invalid token',
    });
  }
}

module.exports = {
  movieList,
  movieAdd,
};