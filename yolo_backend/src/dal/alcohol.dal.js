const Alcohol = require('../models/alcohol.model');

class AlcoholDAO {
  constructor() {
    this.Alcohol = Alcohol;
  }

  /**
   * 创建酒类
   * @param {Object} alcoholData - 酒类数据
   * @returns {Promise<Object>} 创建的酒类记录
   */
  async createAlcohol(alcoholData) {
    const alcohol = new this.Alcohol(alcoholData);
    return await alcohol.save();
  }

  /**
   * 获取酒类列表
   * @param {Object} filter - 过滤条件
   * @param {Object} options - 选项（分页、排序等）
   * @returns {Promise<Object>} 酒类列表和总数
   */
  async getAllAlcohols(filter = {}, options = {}) {
    const { page = 1, limit = 10, sort = {} } = options;
    const skip = (page - 1) * limit;

    const [alcohols, total] = await Promise.all([
      this.Alcohol
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      this.Alcohol.countDocuments(filter)
    ]);

    return {
      alcohols,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * 根据ID获取酒类
   * @param {string} id - 酒类ID
   * @returns {Promise<Object>} 酒类记录
   */
  async getAlcoholById(id) {
    return await this.Alcohol.findById(id);
  }

  /**
   * 更新酒类
   * @param {string} id - 酒类ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object>} 更新后的酒类记录
   */
  async updateAlcohol(id, updateData) {
    return await this.Alcohol.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }

  /**
   * 删除酒类
   * @param {string} id - 酒类ID
   * @returns {Promise<Object>} 删除的酒类记录
   */
  async deleteAlcohol(id) {
    return await this.Alcohol.findByIdAndDelete(id);
  }
}

module.exports = AlcoholDAO;
