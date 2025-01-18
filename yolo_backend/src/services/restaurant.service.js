const RestaurantDAL = require('../dal/restaurant.dal');
const { PriceLevelEnum } = require('../models/restaurant.model');

class RestaurantService {
  constructor() {
    this.restaurantDAL = new RestaurantDAL();
  }

  /**
   * 创建餐厅
   * @param {Object} restaurantData 餐厅数据
   * @param {string} username 创建者用户名
   * @returns {Promise<Object>} 创建的餐厅
   */
  async createRestaurant(restaurantData, username) {
    restaurantData.createdBy = username;
    restaurantData.updatedBy = username;
    const restaurant = await this.restaurantDAL.create(restaurantData);
    return this._formatRestaurant(restaurant);
  }

  /**
   * 获取餐厅列表
   * @param {Object} params 查询参数
   * @returns {Promise<Object>} 餐厅列表和分页信息
   */
  async getAllRestaurants(params) {
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

    const result = await this.restaurantDAL.find(filter, options);
    const restaurants = result.restaurants.map(restaurant => this._formatRestaurant(restaurant));

    return {
      restaurants,
      pagination: result.pagination
    };
  }

  /**
   * 获取单个餐厅
   * @param {string} id 餐厅ID
   * @returns {Promise<Object>} 餐厅信息
   */
  async getRestaurantById(id) {
    const restaurant = await this.restaurantDAL.findById(id);
    return this._formatRestaurant(restaurant);
  }

  /**
   * 更新餐厅信息
   * @param {string} id 餐厅ID
   * @param {Object} updateData 更新数据
   * @param {string} username 更新者用户名
   * @returns {Promise<Object>} 更新后的餐厅
   */
  async updateRestaurant(id, updateData, username) {
    updateData.updatedBy = username;
    const restaurant = await this.restaurantDAL.update(id, updateData);
    return this._formatRestaurant(restaurant);
  }

  /**
   * 删除餐厅
   * @param {string} id 餐厅ID
   * @returns {Promise<Object>} 删除的餐厅
   */
  async deleteRestaurant(id) {
    const restaurant = await this.restaurantDAL.delete(id);
    return this._formatRestaurant(restaurant);
  }

  /**
   * 格式化餐厅数据，将_id转换为restaurantId
   * @private
   */
  _formatRestaurant(restaurant) {
    if (!restaurant) return null;

    const restaurantObj = restaurant.toObject ? restaurant.toObject() : restaurant;
    const { _id, ...rest } = restaurantObj;

    return {
      restaurantId: _id.toString(),
      ...rest
    };
  }
}

module.exports = RestaurantService;
