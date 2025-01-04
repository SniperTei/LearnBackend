const Drink = require('../models/drink.model');
const drinkService = require('../services/drink.service');

// 创建饮品
exports.createDrink = async (req, res) => {
  try {
    const drink = await drinkService.createDrink(req.body);
    res.status(201).json({ message: 'Drink created successfully', drink });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 获取所有饮品
exports.getAllDrinks = async (req, res) => {
  try {
    const drinks = await drinkService.getAllDrinks();
    res.status(200).json(drinks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 获取单个饮品
exports.getDrinkById = async (req, res) => {
  try {
    const drink = await drinkService.getDrinkById(req.params.id);
    if (!drink) return res.status(404).json({ message: 'Drink not found' });
    res.status(200).json(drink);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 更新饮品
exports.updateDrink = async (req, res) => {
  try {
    const drink = await drinkService.updateDrink(req.params.id, req.body);
    if (!drink) return res.status(404).json({ message: 'Drink not found' });
    res.status(200).json({ message: 'Drink updated successfully', drink });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 删除饮品
exports.deleteDrink = async (req, res) => {
  try {
    const drink = await drinkService.deleteDrink(req.params.id);
    if (!drink) return res.status(404).json({ message: 'Drink not found' });
    res.status(200).json({ message: 'Drink deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
