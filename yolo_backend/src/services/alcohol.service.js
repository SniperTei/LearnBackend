const AlcoholDAO = require('../dal/alcohol.dal');
const Drink = require('../models/drink.model');

class AlcoholService {
  constructor() {
    this.alcoholDAO = new AlcoholDAO();
  }

  /**
   * 创建酒类
   * @param {Object} alcoholData - 酒类数据
   * @returns {Promise<Object>} 创建的酒类记录
   */
  async createAlcohol(alcoholData) {
    const alcohol = await this.alcoholDAO.createAlcohol(alcoholData);

    return this.formatAlcohol(alcohol);
  }

  /**
   * 获取酒类列表
   * @param {Object} filter - 过滤条件
   * @param {Object} options - 分页和排序选项
   * @returns {Promise<Array>} 酒类列表
   */
  async getAllAlcohols(filter = {}, options = {}) {
    const result = await this.alcoholDAO.getAllAlcohols(filter, options);
    console.log('result : ', result);
    const alcohols = result.alcohols.map(alcohol => this.formatAlcohol(alcohol));
    return {
      alcohols,
      pagination: result.pagination
    };
  }

  /**
   * 获取单个酒类
   * @param {string} id - 酒类ID
   * @returns {Promise<Object>} 酒类记录
   */
  async getAlcoholById(id) {
    const alcohol = await this.alcoholDAO.getAlcoholById(id);

    return this.formatAlcohol(alcohol);
  }

  /**
   * 更新酒类
   * @param {string} id - 酒类ID
   * @param {Object} alcoholData - 更新的数据
   * @returns {Promise<Object>} 更新后的酒类记录
   */
  async updateAlcohol(id, alcoholData) {
    const alcohol = await this.alcoholDAO.updateAlcohol(id, alcoholData);

    return this.formatAlcohol(alcohol);
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
   * @returns {Promise<Object>} 删除的酒类记录
   */
  async deleteAlcohol(id) {
    const alcohol = await this.alcoholDAO.deleteAlcohol(id);
    return this.formatAlcohol(alcohol);
  }

  /**
   * 格式化alcohol数据，将_id转换为alcoholId
   * @private
   */
  formatAlcohol(alcohol) {
    if (!alcohol) return null;

    const { _id, __v, ...rest } = alcohol;
    return {
      alcoholId: _id.toString(),
      ...rest
    };
  }
}

module.exports = AlcoholService;
