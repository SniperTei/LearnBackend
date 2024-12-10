const { verifyToken } = require('../authorization');
const foodService = require('../service/foodService');

const foodList = async (req, res) => {
  foodService.queryFoodList(req.query).then(result => {
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

const foodAdd = async (req, res) => {
  // const token = req.headers['authorization'];
  try {
    // let verifyResult = verifyToken(token);
    // if (!verifyResult.valid) {
    //   throw new Error('Invalid token');
    // }
    foodService.foodAdd(req.body).then(result => {
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
  } catch (error) {
    res.json({
      code: '100002',
      msg: 'Invalid token',
    });
  }
}

module.exports = {
  foodList,
  foodAdd,
};