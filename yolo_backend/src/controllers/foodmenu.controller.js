const FoodMenuService = require('../services/foodmenu.service');
const ApiResponse = require('../utils/response');

class FoodMenuController {
  /**
   * 创建菜品
   */
  static async createFoodMenu(req, res) {
    try {
      const foodMenuData = req.body;
      const username = req.user.username; // 从认证中间件获取用户名

      const foodMenu = await FoodMenuService.createFoodMenu(foodMenuData, username);
      res.status(201).json(ApiResponse.success(foodMenu, '菜品创建成功'));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message));
    }
  }

  /**
   * 获取菜品列表
   */
  static async getAllFoodMenus(req, res) {
    try {
      const result = await FoodMenuService.getFoodMenus(req.query);
      res.json(ApiResponse.success(result));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message));
    }
  }

  /**
   * 获取单个菜品
   */
  static async getFoodMenuById(req, res) {
    try {
      const foodMenu = await FoodMenuService.getFoodMenuById(req.params.id);
      if (!foodMenu) {
        return res.status(404).json(ApiResponse.error('菜品不存在'));
      }
      res.json(ApiResponse.success(foodMenu));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message));
    }
  }

  /**
   * 更新菜品
   */
  static async updateFoodMenu(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const username = req.user.username;

      const foodMenu = await FoodMenuService.updateFoodMenu(id, updateData, username);
      if (!foodMenu) {
        return res.status(404).json(ApiResponse.error('菜品不存在'));
      }
      res.json(ApiResponse.success(foodMenu, '菜品更新成功'));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message));
    }
  }

  /**
   * 删除菜品
   */
  static async deleteFoodMenu(req, res) {
    try {
      const { id } = req.params;
      const foodMenu = await FoodMenuService.deleteFoodMenu(id);
      if (!foodMenu) {
        return res.status(404).json(ApiResponse.error('菜品不存在'));
      }
      res.json(ApiResponse.success(null, '菜品删除成功'));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = FoodMenuController;
