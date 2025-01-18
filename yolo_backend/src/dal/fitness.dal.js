const Fitness = require('../models/fitness.model');

class FitnessDAL {
  constructor() {
    this.Fitness = Fitness;
  }

  /**
   * 创建运动记录
   * @param {Object} fitnessData - 运动记录数据
   * @returns {Promise<Object>} 创建的运动记录
   */
  async createFitness(fitnessData) {
    const fitness = new this.Fitness(fitnessData);
    return await fitness.save();
  }

  /**
   * 获取运动记录列表
   * @param {Object} filter - 过滤条件
   * @param {Object} options - 分页和排序选项
   * @returns {Promise<Array>} 运动记录列表
   */
  async getAllFitness(filter, options) {
    const { page, limit, sort } = options;
    const skip = (page - 1) * limit;

    return await Fitness.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username'); // 只返回用户名
  }

  /**
   * 统计符合条件的记录总数
   * @param {Object} filter - 过滤条件
   * @returns {Promise<number>} 记录总数
   */
  async countFitness(filter) {
    return await Fitness.countDocuments(filter);
  }

  /**
   * 获取单个运动记录
   * @param {string} id - 运动记录ID
   * @returns {Promise<Object>} 运动记录
   */
  async getFitnessById(id) {
    return await Fitness.findById(id).populate('userId', 'username');
  }

  /**
   * 更新运动记录
   * @param {string} id - 运动记录ID
   * @param {Object} updateData - 更新的数据
   * @returns {Promise<Object>} 更新后的运动记录
   */
  async updateFitness(id, updateData) {
    return await Fitness.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('userId', 'username');
  }

  /**
   * 删除运动记录
   * @param {string} id - 运动记录ID
   * @returns {Promise<Object>} 删除的运动记录
   */
  async deleteFitness(id) {
    return await Fitness.findByIdAndDelete(id);
  }
}

module.exports = FitnessDAL;
