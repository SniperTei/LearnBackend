const TravelPlanDAL = require('../dal/travelPlan.dal');
const createError = require('http-errors');
const mongoose = require('mongoose'); // Add mongoose import

class TravelPlanService {
  constructor() {
    this.travelPlanDAL = new TravelPlanDAL();
  }

  /**
   * 创建旅行计划
   * @param {Object} travelPlanData - 旅行计划数据
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 创建的旅行计划
   */
  async createTravelPlan(travelPlanData, userId) {
    const data = {
      ...travelPlanData,
      userId,
      createdBy: userId,
      updatedBy: userId
    };
    const travelPlan = await this.travelPlanDAL.create(data);
    return this._formatTravelPlan(travelPlan);
  }

  /**
   * 获取旅行计划列表
   * @param {Object} filters - 过滤条件
   * @param {Object} options - 分页等选项
   * @param {string} userId - 用户ID
   * @returns {Promise<{travelPlans: Array, totalPages: Number, currentPage: Number}>} 旅行计划列表和分页信息
   */
  async listTravelPlans(filters, options, userId) {
    const query = { userId, ...filters };
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const { travelPlans, total } = await this.travelPlanDAL.findAll(query, {
      skip,
      limit,
      sort: { createdAt: -1 }
    });

    return {
      travelPlans: travelPlans.map(plan => this._formatTravelPlan(plan)),
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  }

  /**
   * 查询单个旅行计划
   * @param {string} id - 旅行计划ID
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 旅行计划
   * @throws {Error} 未找到旅行计划时抛出错误
   */
  async getTravelPlan(id, userId) {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, '无效的旅行计划ID');
    }

    // Find travel plan by id and userId
    const travelPlan = await this.travelPlanDAL.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!travelPlan) {
      throw createError(404, '未找到旅行计划');
    }

    return this._formatTravelPlan(travelPlan);
  }

  /**
   * 更新旅行计划
   * @param {string} id - 旅行计划ID
   * @param {Object} updateData - 更新数据
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 更新后的旅行计划
   * @throws {Error} 未找到旅行计划或无权限时抛出错误
   */
  async updateTravelPlan(id, updateData, userId) {
    const travelPlan = await this.travelPlanDAL.findById(id);
    if (!travelPlan) {
      throw createError(404, '未找到旅行计划');
    }

    if (travelPlan.userId.toString() !== userId.toString()) {
      throw createError(403, '没有权限更新此旅行计划');
    }

    const data = {
      ...updateData,
      updatedBy: userId
    };

    const updatedPlan = await this.travelPlanDAL.update(id, data);
    return this._formatTravelPlan(updatedPlan);
  }

  /**
   * 删除旅行计划
   * @param {string} id - 旅行计划ID
   * @param {string} userId - 用户ID
   * @returns {Promise<void>}
   * @throws {Error} 未找到旅行计划或无权限时抛出错误
   */
  async deleteTravelPlan(id, userId) {
    const travelPlan = await this.travelPlanDAL.findById(id);
    if (!travelPlan) {
      throw createError(404, '未找到旅行计划');
    }

    if (travelPlan.userId.toString() !== userId.toString()) {
      throw createError(403, '没有权限删除此旅行计划');
    }

    await this.travelPlanDAL.delete(id);
    return this._formatTravelPlan(travelPlan);
  }

  /**
   * 格式化旅行计划数据，将_id转换为travelPlanId
   * @private
   */
  _formatTravelPlan(travelPlan) {
    if (!travelPlan) return null;

    const travelPlanObj = travelPlan.toObject ? travelPlan.toObject() : travelPlan;
    const { _id, ...rest } = travelPlanObj;

    return {
      travelPlanId: _id.toString(),
      ...rest
    };
  }
}

module.exports = TravelPlanService;
