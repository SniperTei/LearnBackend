const Drink = require('../models/drink.model');
const drinkService = require('../services/drink.service');
const ApiResponse = require('../utils/response');

// 创建饮品
exports.createDrink = async (req, res) => {
  try {
    // 用户信息已经在 auth 中间件中验证并添加到 req.user
    const drinkData = {
      ...req.body,
      userId: req.user.userId,
      createdBy: req.user.username,
      updatedBy: req.user.username
    };
    
    const drink = await drinkService.createDrink(drinkData);
    res.json(ApiResponse.success(drink, 'Drink created successfully'));
  } catch (error) {
    res.status(400).json(ApiResponse.error(error.message));
  }
};

// 获取当前用户的所有饮品
exports.getAllDrinks = async (req, res) => {
  try {
    // 从 auth 中间件获取用户 ID
    const drinks = await drinkService.getAllDrinks(req.user.userId);
    res.json(ApiResponse.success(drinks));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// 获取单个饮品
exports.getDrinkById = async (req, res) => {
  try {
    const drink = await drinkService.getDrinkById(req.params.id);
    if (!drink) {
      return res.status(404).json(ApiResponse.error('Drink not found'));
    }
    res.json(ApiResponse.success(drink));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};

// 更新饮品
exports.updateDrink = async (req, res) => {
  try {
    const updatedDrink = await drinkService.updateDrink(req.params.id, req.body);
    if (!updatedDrink) {
      return res.status(404).json(ApiResponse.error('Drink not found'));
    }
    res.json(ApiResponse.success(updatedDrink, 'Drink updated successfully'));
  } catch (error) {
    res.status(400).json(ApiResponse.error(error.message));
  }
};

// 删除饮品
exports.deleteDrink = async (req, res) => {
  try {
    const drink = await drinkService.deleteDrink(req.params.id);
    if (!drink) {
      return res.status(404).json(ApiResponse.error('Drink not found'));
    }
    res.json(ApiResponse.success(null, 'Drink deleted successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error.message));
  }
};
