const userService = require('../service/userService');

const login = async (req, res) => {
  const { username, password } = req.body;
  userService.login({ username, password }).then(result => {
    let msg = 'success';
    if (result.msg) {
      msg = result.msg;
    }
    res.json({
      code: '000000',
      msg: msg,
      data: result.data
    });
  }).catch(err => {
    res.json({
      code: '100001',
      msg: err.message,
    });
  });
};

const register = async (req, res) => {
  userService.register(req.body).then(result => {
    let msg = 'success';
    if (result.msg) {
      msg = result.msg;
    }
    res.json({
      code: '000000',
      msg: msg,
    });
  }).catch(err => {
    res.json({
      code: '100001',
      msg: err.message,
    });
  });
};

module.exports = {
  login,
  register,
};