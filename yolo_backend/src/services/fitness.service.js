const fitnessDAL = require('../dal/fitness.dal');

class FitnessService {
  constructor() {
    this.fitnessDAL = new fitnessDAL();
  }

  /**
   * 创建运动记录
   * @param {Object} fitnessData - 运动记录数据
   * @returns {Promise<Object>} 创建的运动记录
   */
  async createFitness(fitnessData) {
    return await fitnessDAL.createFitness(fitnessData);
  }

  /**
   * 获取运动记录列表
   * @param {Object} filter - 过滤条件
   * @param {Object} options - 分页和排序选项
   * @returns {Promise<Object>} 包含分页信息的运动记录列表
   */
  async getAllFitness(filter, options) {
    const records = await fitnessDAL.getAllFitness(filter, options);
    const total = await fitnessDAL.countFitness(filter);
    const totalPages = Math.ceil(total / options.limit);

    return {
      records,
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
   * 获取单个运动记录
   * @param {string} id - 运动记录ID
   * @returns {Promise<Object>} 运动记录
   */
  async getFitnessById(id) {
    return await fitnessDAL.getFitnessById(id);
  }

  /**
   * 更新运动记录
   * @param {string} id - 运动记录ID
   * @param {Object} updateData - 更新的数据
   * @returns {Promise<Object>} 更新后的运动记录
   */
  async updateFitness(id, updateData) {
    return await fitnessDAL.updateFitness(id, updateData);
  }

  /**
   * 删除运动记录
   * @param {string} id - 运动记录ID
   * @returns {Promise<Object>} 删除的运动记录
   */
  async deleteFitness(id) {
    return await fitnessDAL.deleteFitness(id);
  }
}

module.exports = FitnessService;
