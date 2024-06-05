const express = require('express');
const { verifyToken } = require('../authorization');
// Import the alcohol module
const alcoholService = require('../service/alcoholService');

// Create a router instance
const router = express.Router();

const alcoholList = (req, res) => {
  // 如果没登录
  if (!req.headers.authorization) {
    return res.json({ code: "200000", msg: "token无效" });
  }
  // 验证token
  verifyToken(req, res, () => {
    console.log('token验证通过');
    // Call the alcoholService module's queryAlcohols method
    console.log('req.query:', req.query);
    alcoholService.queryAlcohols(req.query).then((result) => {
      console.log('service result:', result);
      return res.json({ code: '000000', msg: 'success', data: result});
    }).catch((error) => {
      console.error('An error occurred:', error);
      return res.json({ code: '999999', msg: 'ERROR : ' + error});
    });
  });
}
