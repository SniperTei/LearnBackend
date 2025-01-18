const { Restaurant } = require('../models/restaurant.model');

class RestaurantDAL {
  constructor() {
    this.Restaurant = Restaurant;
  }

  /**
   * 创建餐厅
   * @param {Object} restaurantData 餐厅数据
   * @returns {Promise<Object>} 创建的餐厅文档
   */
  async create(restaurantData) {
    return await Restaurant.create(restaurantData);
  }

  /**
   * 获取餐厅列表
   * @param {Object} filter 过滤条件
   * @param {Object} options 分页和排序选项
   * @returns {Promise<Array>} 餐厅列表
   */
  async find(filter = {}, options = {}) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    const total = await Restaurant.countDocuments(filter);
    const restaurants = await Restaurant.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return {
      restaurants,
      total,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * 根据ID获取餐厅
   * @param {string} id 餐厅ID
   * @returns {Promise<Object>} 餐厅文档
   */
  async findById(id) {
    return await Restaurant.findById(id);
  }

  /**
   * 更新餐厅信息
   * @param {string} id 餐厅ID
   * @param {Object} updateData 更新数据
   * @returns {Promise<Object>} 更新后的餐厅文档
   */
  async update(id, updateData) {
    return await Restaurant.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }

  /**
   * 删除餐厅
   * @param {string} id 餐厅ID
   * @returns {Promise<Object>} 删除的餐厅文档
   */
  async delete(id) {
    return await Restaurant.findByIdAndDelete(id);
  }
}

module.exports = RestaurantDAL;
