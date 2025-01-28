const RestaurantService = require('../services/restaurant.service');
const UserService = require('../services/user.service');
const ApiResponse = require('../utils/response');

class RestaurantController {
  constructor() {
    this.restaurantService = new RestaurantService();
    this.userService = new UserService();
  }

  /**
   * 创建餐厅
   */
  async createRestaurant(req, res) {
    try {
      // 通过req.user 从users里找user
      const user = await this.userService.getUserById(req.user.userId);
      // 检查管理员权限
      if (!user.isAdmin) {
        return res.status(403).json(ApiResponse.forbidden('只有管理员才能创建餐厅'));
      }

      const restaurant = await this.restaurantService.createRestaurant(req.body, req.user.username);
      res.status(201).json(ApiResponse.success(restaurant, '餐厅创建成功'));
    } catch (error) {
      res.status(400).json(ApiResponse.badRequest(error.message));
    }
  }

  /**
   * 获取餐厅列表
   */
  async getAllRestaurants(req, res) {
    try {
      const result = await this.restaurantService.getAllRestaurants(req.query);
      res.json(ApiResponse.success(result));
    } catch (error) {
      res.status(400).json(ApiResponse.badRequest(error.message));
    }
  }

  /**
   * 获取单个餐厅
   */
  async getRestaurantById(req, res) {
    try {
      const restaurant = await this.restaurantService.getRestaurantById(req.params.id);
      if (!restaurant) {
        return res.status(404).json(ApiResponse.notFound('餐厅不存在'));
      }
      res.json(ApiResponse.success(restaurant));
    } catch (error) {
      res.status(400).json(ApiResponse.badRequest(error.message));
    }
  }

  /**
   * 更新餐厅
   */
  async updateRestaurant(req, res) {
    try {
      // 通过req.user 从users里找user
      const user = await this.userService.getUserById(req.user.userId);
      // 检查管理员权限
      if (!user.isAdmin) {
        return res.status(403).json(ApiResponse.forbidden('只有管理员才能更新餐厅'));
      }

      const restaurant = await this.restaurantService.updateRestaurant(
        req.params.id,
        req.body,
        req.user.username
      );
      if (!restaurant) {
        return res.status(404).json(ApiResponse.notFound('餐厅不存在'));
      }
      res.json(ApiResponse.success(restaurant, '餐厅更新成功'));
    } catch (error) {
      res.status(400).json(ApiResponse.badRequest(error.message));
    }
  }

  /**
   * 删除餐厅
   */
  async deleteRestaurant(req, res) {
    try {
      // 通过req.user 从users里找user
      const user = await this.userService.getUserById(req.user.userId);
      // 检查管理员权限
      if (!user.isAdmin) {
        return res.status(403).json(ApiResponse.forbidden('只有管理员才能删除餐厅'));
      }

      const restaurant = await this.restaurantService.deleteRestaurant(req.params.id);
      if (!restaurant) {
        return res.status(404).json(ApiResponse.notFound('餐厅不存在'));
      }
      res.json(ApiResponse.success(null, '餐厅删除成功'));
    } catch (error) {
      res.status(400).json(ApiResponse.badRequest(error.message));
    }
  }
}

module.exports = RestaurantController;
