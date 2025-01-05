const FoodMenuDAL = require('../dal/foodmenu.dal');
const FoodMenu = require('../models/foodmenu.model');

class FoodMenuService {
  /**
   * 创建菜品
   */
  static async createFoodMenu(foodMenuData, username) {
    const data = {
      ...foodMenuData,
      createdBy: username,
      updatedBy: username
    };
    return await FoodMenuDAL.create(data);
  }

  /**
   * 获取菜品列表
   */
  static async getFoodMenus(query = {}) {
    const {
      page,
      limit,
      type,
      minPrice,
      maxPrice,
      sortBy,
      order
    } = query;

    // 构建过滤条件
    const filter = {};
    if (type) filter.type = type;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    // 构建选项
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      order
    };

    return await FoodMenuDAL.find(filter, options);
  }

  /**
   * 获取单个菜品
   */
  static async getFoodMenuById(id) {
    return await FoodMenuDAL.findById(id);
  }

  /**
   * 更新菜品
   */
  static async updateFoodMenu(id, updateData, username) {
    const data = {
      ...updateData,
      updatedBy: username
    };
    return await FoodMenuDAL.update(id, data);
  }

  /**
   * 删除菜品
   */
  static async deleteFoodMenu(id) {
    return await FoodMenuDAL.delete(id);
  }

  /**
   * 随机获取指定数量的菜品
   * @param {number} count 需要获取的菜品数量
   * @returns {Promise<Array>} 随机菜品列表
   */
  static async getRandomFoodMenus(count = 1) {
    try {
      // 直接使用 FoodMenu 模型调用 aggregate
      const foodMenus = await FoodMenu.aggregate([
        { $sample: { size: parseInt(count) } }
      ]);
      
      return foodMenus;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FoodMenuService;
