const FitnessDAL = require('../dal/fitness.dal');

class FitnessService {
  constructor() {
    this.fitnessDAL = new FitnessDAL();
  }

  /**
   * 创建运动记录
   * @param {Object} fitnessData - 运动记录数据
   * @returns {Promise<Object>} 创建的运动记录
   */
  async createFitness(fitnessData) {
    const fitness = await this.fitnessDAL.createFitness(fitnessData);
    return this._formatFitness(fitness);
  }

  /**
   * 获取运动记录列表
   * @param {Object} filter - 过滤条件
   * @param {Object} options - 分页和排序选项
   * @returns {Promise<Object>} 包含分页信息的运动记录列表
   */
  async getAllFitness(filter, options) {
    const result = await this.fitnessDAL.getAllFitness(filter, options);
    const records = result.map(fitness => this._formatFitness(fitness));

    return {
      records,
      pagination: result.pagination
    };
  }

  /**
   * 获取单个运动记录
   * @param {string} id - 运动记录ID
   * @returns {Promise<Object>} 运动记录
   */
  async getFitnessById(id) {
    const fitness = await this.fitnessDAL.getFitnessById(id);
    return this._formatFitness(fitness);
  }

  /**
   * 更新运动记录
   * @param {string} id - 运动记录ID
   * @param {Object} updateData - 更新的数据
   * @returns {Promise<Object>} 更新后的运动记录
   */
  async updateFitness(id, updateData) {
    const fitness = await this.fitnessDAL.updateFitness(id, updateData);
    return this._formatFitness(fitness);
  }

  /**
   * 删除运动记录
   * @param {string} id - 运动记录ID
   * @returns {Promise<Object>} 删除的运动记录
   */
  async deleteFitness(id) {
    const fitness = await this.fitnessDAL.deleteFitness(id);
    return this._formatFitness(fitness);
  }

  /**
   * 格式化健身数据，将_id转换为fitnessId
   * @private
   */
  _formatFitness(fitness) {
    if (!fitness) return null;

    const fitnessObj = fitness.toObject ? fitness.toObject() : fitness;
    const { _id, ...rest } = fitnessObj;

    return {
      fitnessId: _id.toString(),
      ...rest
    };
  }
}

module.exports = FitnessService;
