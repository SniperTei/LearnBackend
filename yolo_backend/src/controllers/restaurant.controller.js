const RestaurantService = require('../services/restaurant.service');
const ApiResponse = require('../utils/response');

class RestaurantController {
  /**
   * 创建餐厅
   */
  static async createRestaurant(req, res) {
    try {
      // 检查管理员权限
      if (!req.user.isAdmin) {
        return res.status(403).json(ApiResponse.error('只有管理员才能创建餐厅'));
      }

      const restaurant = await RestaurantService.createRestaurant(req.body, req.user.username);
      res.status(201).json(ApiResponse.success(restaurant, '餐厅创建成功'));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message));
    }
  }

  /**
   * 获取餐厅列表
   */
  static async getAllRestaurants(req, res) {
    try {
      const result = await RestaurantService.getAllRestaurants(req.query);
      res.json(ApiResponse.success(result));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message));
    }
  }

  /**
   * 获取单个餐厅
   */
  static async getRestaurantById(req, res) {
    try {
      const restaurant = await RestaurantService.getRestaurantById(req.params.id);
      if (!restaurant) {
        return res.status(404).json(ApiResponse.error('餐厅不存在'));
      }
      res.json(ApiResponse.success(restaurant));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message));
    }
  }

  /**
   * 更新餐厅
   */
  static async updateRestaurant(req, res) {
    try {
      // 检查管理员权限
      if (!req.user.isAdmin) {
        return res.status(403).json(ApiResponse.error('只有管理员才能更新餐厅'));
      }

      const restaurant = await RestaurantService.updateRestaurant(
        req.params.id,
        req.body,
        req.user.username
      );
      if (!restaurant) {
        return res.status(404).json(ApiResponse.error('餐厅不存在'));
      }
      res.json(ApiResponse.success(restaurant, '餐厅更新成功'));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message));
    }
  }

  /**
   * 删除餐厅
   */
  static async deleteRestaurant(req, res) {
    try {
      // 检查管理员权限
      if (!req.user.isAdmin) {
        return res.status(403).json(ApiResponse.error('只有管理员才能删除餐厅'));
      }

      const restaurant = await RestaurantService.deleteRestaurant(req.params.id);
      if (!restaurant) {
        return res.status(404).json(ApiResponse.error('餐厅不存在'));
      }
      res.json(ApiResponse.success(null, '餐厅删除成功'));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = RestaurantController;
