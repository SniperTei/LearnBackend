const alcoholDAO = require('../dal/alcohol.dal');
const Drink = require('../models/drink.model');

class AlcoholService {
  /**
   * 创建酒类
   * @param {Object} alcoholData - 酒类数据
   * @returns {Promise<Object>} 创建的酒类
   */
  async createAlcohol(alcoholData) {
    return await alcoholDAO.createAlcohol(alcoholData);
  }

  /**
   * 获取酒类列表
   * @param {Object} filter - 过滤条件
   * @param {Object} options - 分页和排序选项
   * @returns {Promise<Object>} 包含分页信息的酒类列表
   */
  async getAllAlcohols(filter, options) {
    const alcohols = await alcoholDAO.getAllAlcohols(filter, options);
    const total = await alcoholDAO.countAlcohols(filter);
    const totalPages = Math.ceil(total / options.limit);

    return {
      alcohols,
      pagination: {
        total,
        totalPages,
        currentPage: options.page,
        limit: options.limit,
        hasNextPage: options.page < totalPages,
        hasPrevPage: options.page > 1
      }
    };
  }

  /**
   * 获取单个酒类
   * @param {string} id - 酒类ID
   * @returns {Promise<Object>} 酒类
   */
  async getAlcoholById(id) {
    return await alcoholDAO.getAlcoholById(id);
  }

  /**
   * 更新酒类
   * @param {string} id - 酒类ID
   * @param {Object} alcoholData - 更新的数据
   * @returns {Promise<Object>} 更新后的酒类
   */
  async updateAlcohol(id, alcoholData) {
    return await alcoholDAO.updateAlcohol(id, alcoholData);
  }

  /**
   * 检查酒类是否被饮品记录引用
   * @param {string} id - 酒类ID
   * @returns {Promise<boolean>} 是否被引用
   */
  async checkAlcoholReferences(id) {
    const count = await Drink.countDocuments({ alcoholId: id });
    return count > 0;
  }

  /**
   * 删除酒类
   * @param {string} id - 酒类ID
   * @returns {Promise<Object>} 删除的酒类
   */
  async deleteAlcohol(id) {
    return await alcoholDAO.deleteAlcohol(id);
  }
}

module.exports = new AlcoholService();
