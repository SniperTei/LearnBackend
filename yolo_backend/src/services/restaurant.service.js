const RestaurantDAL = require('../dal/restaurant.dal');
const { PriceLevelEnum } = require('../models/restaurant.model');

class RestaurantService {
  /**
   * 创建餐厅
   * @param {Object} restaurantData 餐厅数据
   * @param {string} username 创建者用户名
   * @returns {Promise<Object>} 创建的餐厅
   */
  static async createRestaurant(restaurantData, username) {
    restaurantData.createdBy = username;
    restaurantData.updatedBy = username;
    return await RestaurantDAL.create(restaurantData);
  }

  /**
   * 获取餐厅列表
   * @param {Object} params 查询参数
   * @returns {Promise<Object>} 餐厅列表和分页信息
   */
  static async getAllRestaurants(params) {
    const {
      page = 1,
      limit = 10,
      name,
      minRating,
      maxRating,
      priceLevel,
      sortBy = 'createdAt',
      order = 'desc'
    } = params;

    // 构建过滤条件
    const filter = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    if (minRating !== undefined || maxRating !== undefined) {
      filter.rating = {};
      if (minRating !== undefined) filter.rating.$gte = parseFloat(minRating);
      if (maxRating !== undefined) filter.rating.$lte = parseFloat(maxRating);
    }
    if (priceLevel) {
      filter.priceLevel = priceLevel;
    }

    // 构建排序条件
    const sort = {};
    sort[sortBy] = order === 'desc' ? -1 : 1;

    // 构建分页选项
    const options = {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      sort
    };

    return await RestaurantDAL.find(filter, options);
  }

  /**
   * 获取单个餐厅
   * @param {string} id 餐厅ID
   * @returns {Promise<Object>} 餐厅信息
   */
  static async getRestaurantById(id) {
    return await RestaurantDAL.findById(id);
  }

  /**
   * 更新餐厅信息
   * @param {string} id 餐厅ID
   * @param {Object} updateData 更新数据
   * @param {string} username 更新者用户名
   * @returns {Promise<Object>} 更新后的餐厅
   */
  static async updateRestaurant(id, updateData, username) {
    updateData.updatedBy = username;
    return await RestaurantDAL.update(id, updateData);
  }

  /**
   * 删除餐厅
   * @param {string} id 餐厅ID
   * @returns {Promise<Object>} 删除的餐厅
   */
  static async deleteRestaurant(id) {
    return await RestaurantDAL.delete(id);
  }
}

module.exports = RestaurantService;
