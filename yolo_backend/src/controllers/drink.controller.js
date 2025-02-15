const Alcohol = require('../models/alcohol.model');
const DrinkService = require('../services/drink.service');
const ApiResponse = require('../utils/response');

class DrinkController {
  constructor() {
    this.drinkService = new DrinkService();
  }

  /**
   * 创建饮品记录
   * POST /api/v1/drinks
   */
  async createDrink(req, res) {
    console.log('req.body:', req.body);
    try {
      // 验证必需字段
      const { alcoholId, amount, unit } = req.body;
      if (!alcoholId || !amount || !unit) {
        return res.status(400).json(ApiResponse.badRequest('Missing required fields: alcoholId, amount, unit'));
      }
      // 打印
      console.log('alcoholId:', alcoholId);

      // 验证 alcoholId 是否存在
      const alcohol = await Alcohol.findById(alcoholId);
      if (!alcohol) {
        return res.status(404).json(ApiResponse.notFound('Alcohol not found'));
      }
      // 打印
      console.log('alcohol:', alcohol);

      // 构建饮品记录数据
      const drinkData = {
        ...req.body,
        userId: req.user.userId,
        createdBy: req.user.username,
        updatedBy: req.user.username,
        drinkTime: req.body.drinkTime || new Date()
      };

      console.log('drinkData:', drinkData);
      
      const drink = await this.drinkService.createDrink(drinkData);
      // 没必要返回刚创建的drink记录
      // await drink.populate('alcoholId');
      
      res.status(201).json(ApiResponse.success(drink, 'Drink record created successfully'));
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json(ApiResponse.badRequest('Validation failed: ' + error.message));
      }
      res.status(500).json(ApiResponse.error('Failed to create drink record: ' + error.message));
    }
  }

  /**
   * 获取当前用户的所有饮品记录
   * GET /api/v1/drinks
   * 支持分页、时间范围过滤、心情过滤、场合过滤
   */
  async getAllDrinks(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        startDate,
        endDate,
        mood,
        occasion,
        sortBy = 'drinkTime',
        order = 'desc'
      } = req.query;

      // 构建过滤条件
      const filter = { userId: req.user.userId };
      console.log('filter:', filter);
      // 时间范围过滤
      if (startDate || endDate) {
        filter.drinkTime = {};
        if (startDate) filter.drinkTime.$gte = new Date(startDate);
        if (endDate) filter.drinkTime.$lte = new Date(endDate);
      }
      
      // 心情和场合过滤
      if (mood) filter.mood = mood;
      if (occasion) filter.occasion = occasion;

      // 构建排序条件
      const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

      const drinks = await this.drinkService.getAllDrinks(
        filter,
        {
          page: parseInt(page),
          limit: parseInt(limit),
          sort
        }
      );

      res.json(ApiResponse.success(drinks));
    } catch (error) {
      res.status(500).json(ApiResponse.error('Failed to fetch drink records: ' + error.message));
    }
  }

  /**
   * 获取单个饮品记录详情
   * GET /api/v1/drinks/:id
   */
  async getDrinkById(req, res) {
    try {
      const drink = await this.drinkService.getDrinkById(req.params.id);
      if (!drink) {
        return res.status(404).json(ApiResponse.notFound('Drink record not found'));
      }
      
      // 验证是否是当前用户的记录
      if (drink.userId.toString() !== req.user.userId) {
        return res.status(403).json(ApiResponse.forbidden('You do not have permission to view this drink record'));
      }
      
      res.json(ApiResponse.success(drink));
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json(ApiResponse.badRequest('Invalid drink record ID'));
      }
      res.status(500).json(ApiResponse.error('Failed to fetch drink record: ' + error.message));
    }
  }

  /**
   * 更新饮品记录
   * PUT /api/v1/drinks/:id
   */
  async updateDrink(req, res) {
    try {
      const drink = await this.drinkService.getDrinkById(req.params.id);
      if (!drink) {
        return res.status(404).json(ApiResponse.notFound('Drink record not found'));
      }
      
      // 验证是否是当前用户的记录
      if (drink.userId.toString() !== req.user.userId.toString()) {
        return res.status(403).json(ApiResponse.forbidden('You do not have permission to update this drink record'));
      }

      // 如果更新了 alcoholId，验证新的 alcohol 是否存在
      if (req.body.alcoholId && req.body.alcoholId !== drink.alcoholId.toString()) {
        const alcohol = await Alcohol.findById(req.body.alcoholId);
        if (!alcohol) {
          return res.status(404).json(ApiResponse.notFound('Alcohol not found'));
        }
      }

      // 构建更新数据
      const updateData = {
        ...req.body,
        updatedBy: req.user.username,
        updatedAt: new Date()
      };
      
      const updatedDrink = await this.drinkService.updateDrink(req.params.id, updateData);
      res.json(ApiResponse.success(updatedDrink, 'Drink record updated successfully'));
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json(ApiResponse.badRequest('Validation failed: ' + error.message));
      }
      if (error.name === 'CastError') {
        return res.status(400).json(ApiResponse.badRequest('Invalid drink record ID'));
      }
      res.status(500).json(ApiResponse.error('Failed to update drink record: ' + error.message));
    }
  }

  /**
   * 删除饮品记录
   * DELETE /api/v1/drinks/:id
   */
  async deleteDrink(req, res) {
    console.log('req.query:', req.query);
    console.log('req.params:', req.params);
    console.log('req.body:', req.body);
    
    try {
      const drink = await this.drinkService.getDrinkById(req.params.id);
      if (!drink) {
        return res.status(404).json(ApiResponse.notFound('Drink record not found'));
      }

      // 验证是否为创建者
      if (drink.userId.toString() !== req.user.userId.toString()) {
        return res.status(403).json(ApiResponse.forbidden('You can only delete your own drink records'));
      }

      await this.drinkService.deleteDrink(req.params.id);
      res.json(ApiResponse.success(null, 'Drink record deleted successfully'));
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json(ApiResponse.badRequest('Invalid drink record ID'));
      }
      res.status(500).json(ApiResponse.error('Failed to delete drink record: ' + error.message));
    }
  }
}

module.exports = DrinkController;
