const { verifyToken } = require('../authorization');
const drinkService = require('../service/drinkService');

// 获取饮酒列表
const drinkListAPI = (req, res) => {
  // Check if the request has a token in the header
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  verifyToken(req, res, () => {
    console.log('token验证通过');
    drinkService.queryDrinks(req.query).then((result) => {
      console.log('service result:', result);
      return res.json({ code: '000000', msg: 'success', data: result});
    }).catch((error) => {
      console.error('An error occurred:', error);
      return res.json({ code: '999999', msg: 'ERROR : ' + error});
    });
  });
}

// 新增喝酒事件
const addDrinkAPI = (req, res) => {
  // Check if the request has a token in the header
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  verifyToken(req, res, () => {
    console.log('token验证通过');
    drinkService.addDrink(req.body).then((result) => {
      console.log('service result:', result);
      return res.json({ code: '000000', msg: 'success', data: result});
    }).catch((error) => {
      console.error('An error occurred:', error);
      return res.json({ code: '999999', msg: 'ERROR : ' + error});
    });
  });
}

module.exports = {
  drinkListAPI,
  addDrinkAPI
};