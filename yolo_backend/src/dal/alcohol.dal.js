const Alcohol = require('../models/alcohol.model');

class AlcoholDAO {
  /**
   * 创建酒类
   * @param {Object} alcoholData - 酒类数据
   * @returns {Promise<Object>} 创建的酒类
   */
  async createAlcohol(alcoholData) {
    const alcohol = new Alcohol(alcoholData);
    return await alcohol.save();
  }

  /**
   * 获取酒类列表
   * @param {Object} filter - 过滤条件
   * @param {Object} options - 分页和排序选项
   * @returns {Promise<Array>} 酒类列表
   */
  async getAllAlcohols(filter, options) {
    const { page = 1, limit = 10, sort } = options;
    // 确保 page 和 limit 是数字
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    return await Alcohol.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);
  }

  /**
   * 统计符合条件的记录总数
   * @param {Object} filter - 过滤条件
   * @returns {Promise<number>} 记录总数
   */
  async countAlcohols(filter) {
    return await Alcohol.countDocuments(filter);
  }

  /**
   * 获取单个酒类
   * @param {string} id - 酒类ID
   * @returns {Promise<Object>} 酒类
   */
  async getAlcoholById(id) {
    return await Alcohol.findById(id);
  }

  /**
   * 更新酒类
   * @param {string} id - 酒类ID
   * @param {Object} alcoholData - 更新的数据
   * @returns {Promise<Object>} 更新后的酒类
   */
  async updateAlcohol(id, alcoholData) {
    return await Alcohol.findByIdAndUpdate(
      id,
      alcoholData,
      {
        new: true, // 返回更新后的文档
        runValidators: true // 运行验证
      }
    );
  }

  /**
   * 删除酒类
   * @param {string} id - 酒类ID
   * @returns {Promise<Object>} 删除的酒类
   */
  async deleteAlcohol(id) {
    return await Alcohol.findByIdAndDelete(id);
  }
}

module.exports = new AlcoholDAO();
