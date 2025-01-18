const FoodMenu = require('../models/foodmenu.model');

class FoodMenuDAL {
  constructor() {
    this.FoodMenu = FoodMenu;
  }

  /**
   * 创建菜品
   * @param {Object} foodMenuData 菜品数据
   * @returns {Promise<Object>} 创建的菜品
   */
  async create(foodMenuData) {
    const foodMenu = new this.FoodMenu(foodMenuData);
    return await foodMenu.save();
  }

  /**
   * 获取菜品列表
   * @param {Object} filter 过滤条件
   * @param {Object} options 选项（分页、排序等）
   * @returns {Promise<Object>} 菜品列表和分页信息
   */
  async find(filter = {}, options = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = options;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

    const [foodMenus, total] = await Promise.all([
      this.FoodMenu.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      this.FoodMenu.countDocuments(filter)
    ]);

    return {
      foodMenus,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * 根据ID获取菜品
   * @param {string} id 菜品ID
   * @returns {Promise<Object>} 菜品信息
   */
  async findById(id) {
    return await this.FoodMenu.findById(id);
  }

  /**
   * 更新菜品
   * @param {string} id 菜品ID
   * @param {Object} updateData 更新数据
   * @returns {Promise<Object>} 更新后的菜品
   */
  async update(id, updateData) {
    return await this.FoodMenu.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }

  /**
   * 删除菜品
   * @param {string} id 菜品ID
   * @returns {Promise<Object>} 删除的菜品
   */
  async delete(id) {
    return await this.FoodMenu.findByIdAndDelete(id);
  }

  /**
   * 随机获取菜品
   * @param {number} count 需要获取的菜品数量
   * @returns {Promise<Array>} 随机菜品列表
   */
  async getRandom(count) {
    return await this.FoodMenu.aggregate([
      { $sample: { size: parseInt(count) } }
    ]);
  }
}

module.exports = FoodMenuDAL;
