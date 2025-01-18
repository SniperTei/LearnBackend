const FoodMenuDAL = require('../dal/foodmenu.dal');
const FoodMenu = require('../models/foodmenu.model');

class FoodMenuService {
  constructor() {
    this.foodMenuDAL = new FoodMenuDAL();
  }

  /**
   * 创建菜品
   */
  async createFoodMenu(foodMenuData, username) {
    const data = {
      ...foodMenuData,
      createdBy: username,
      updatedBy: username
    };
    const foodMenu = await this.foodMenuDAL.create(data);
    return this._formatFoodMenu(foodMenu);
  }

  /**
   * 获取菜品列表
   */
  async getFoodMenus(query = {}) {
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

    const result = await this.foodMenuDAL.find(filter, options);
    const foodMenus = result.foodMenus.map(foodMenu => this._formatFoodMenu(foodMenu));

    return {
      foodMenus,
      pagination: result.pagination
    };
  }

  /**
   * 获取单个菜品
   */
  async getFoodMenuById(id) {
    const foodMenu = await this.foodMenuDAL.findById(id);
    return this._formatFoodMenu(foodMenu);
  }

  /**
   * 更新菜品
   */
  async updateFoodMenu(id, updateData, username) {
    const data = {
      ...updateData,
      updatedBy: username
    };
    const foodMenu = await this.foodMenuDAL.update(id, data);
    return this._formatFoodMenu(foodMenu);
  }

  /**
   * 删除菜品
   */
  async deleteFoodMenu(id) {
    const foodMenu = await this.foodMenuDAL.delete(id);
    return this._formatFoodMenu(foodMenu);
  }

  /**
   * 随机获取指定数量的菜品
   * @param {number} count 需要获取的菜品数量
   * @returns {Promise<Array>} 随机菜品列表
   */
  async getRandomFoodMenus(count = 1) {
    try {
      const foodMenus = await this.foodMenuDAL.getRandom(count);
      return foodMenus.map(foodMenu => this._formatFoodMenu(foodMenu));
    } catch (error) {
      throw error;
    }
  }

  /**
   * 格式化菜品数据，将_id转换为foodMenuId
   * @private
   */
  _formatFoodMenu(foodMenu) {
    if (!foodMenu) return null;

    const foodMenuObj = foodMenu.toObject ? foodMenu.toObject() : foodMenu;
    const { _id, ...rest } = foodMenuObj;

    return {
      foodMenuId: _id.toString(),
      ...rest
    };
  }
}

module.exports = FoodMenuService;
