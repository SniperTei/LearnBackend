const Drink = require('../models/drink.model');

class DrinkDAO {
  constructor() {
    this.Drink = Drink;
  }

  /**
   * 创建饮品记录
   * @param {Object} drinkData - 饮品记录数据
   * @returns {Promise<Object>} 创建的饮品记录
   */
  async createDrink(drinkData) {
    const drink = new Drink(drinkData);
    return await drink.save();
  }

  /**
   * 获取饮品记录列表
   * @param {Object} filter - 过滤条件
   * @param {Object} options - 分页和排序选项
   * @returns {Promise<Array>} 饮品记录列表
   */
  async getAllDrinks(filter, options) {
    const { page, limit, sort } = options;
    const skip = (page - 1) * limit;

    return await Drink.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('alcoholId');
  }

  /**
   * 统计符合条件的记录总数
   * @param {Object} filter - 过滤条件
   * @returns {Promise<number>} 记录总数
   */
  async countDrinks(filter) {
    return await Drink.countDocuments(filter);
  }

  /**
   * 获取单个饮品记录
   * @param {string} id - 饮品记录ID
   * @returns {Promise<Object>} 饮品记录
   */
  async getDrinkById(id) {
    return await Drink.findById(id).populate('alcoholId');
  }

  /**
   * 更新饮品记录
   * @param {string} id - 饮品记录ID
   * @param {Object} drinkData - 更新的数据
   * @returns {Promise<Object>} 更新后的饮品记录
   */
  async updateDrink(id, drinkData) {
    return await Drink.findByIdAndUpdate(
      id,
      drinkData,
      {
        new: true, // 返回更新后的文档
        runValidators: true // 运行验证
      }
    ).populate('alcoholId');
  }

  /**
   * 删除饮品记录
   * @param {string} id - 饮品记录ID
   * @returns {Promise<Object>} 删除的饮品记录
   */
  async deleteDrink(id) {
    return await Drink.findByIdAndDelete(id);
  }
}

module.exports = DrinkDAO;
