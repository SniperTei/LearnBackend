const FoodMenuService = require('../services/foodmenu.service');
const ApiResponse = require('../utils/response');

class FoodMenuController {
  constructor() {
    this.foodMenuService = new FoodMenuService();
  }

  /**
   * 创建菜品
   */
  async createFoodMenu(req, res) {
    try {
      const foodMenuData = req.body;
      const username = req.user.username; // 从认证中间件获取用户名

      const foodMenu = await this.foodMenuService.createFoodMenu(foodMenuData, username);
      res.status(201).json(ApiResponse.success(foodMenu, '菜品创建成功'));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message));
    }
  }

  /**
   * 获取菜品列表
   */
  async getAllFoodMenus(req, res) {
    try {
      const result = await this.foodMenuService.getFoodMenus(req.query);
      res.json(ApiResponse.success(result));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message));
    }
  }

  /**
   * 获取单个菜品
   */
  async getFoodMenuById(req, res) {
    try {
      const foodMenu = await this.foodMenuService.getFoodMenuById(req.params.id);
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
  async updateFoodMenu(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const username = req.user.username;

      const foodMenu = await this.foodMenuService.updateFoodMenu(id, updateData, username);
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
  async deleteFoodMenu(req, res) {
    try {
      const { id } = req.params;
      const foodMenu = await this.foodMenuService.deleteFoodMenu(id);
      if (!foodMenu) {
        return res.status(404).json(ApiResponse.error('菜品不存在'));
      }
      res.json(ApiResponse.success(null, '菜品删除成功'));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message));
    }
  }

  /**
   * 随机推荐菜品
   */
  async getRandomFoodMenus(req, res) {
    try {
      const foodCount = parseInt(req.query.foodCount) || 1;
      
      // 限制最大返回数量为10
      const count = Math.min(Math.max(1, foodCount), 10);
      
      const foodMenus = await this.foodMenuService.getRandomFoodMenus(count);
      res.json(ApiResponse.success({ result: foodMenus }, '今晚吃这些！'));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = new FoodMenuController();
