const TravelPlanDAL = require('../dal/travelPlan.dal');
const createError = require('http-errors');

class TravelPlanService {
  /**
   * 创建旅行计划
   * @param {Object} travelPlanData - 旅行计划数据
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 创建的旅行计划
   */
  static async createTravelPlan(travelPlanData, userId) {
    const data = {
      ...travelPlanData,
      userId,
      createdBy: userId,
      updatedBy: userId
    };
    return await TravelPlanDAL.create(data);
  }

  /**
   * 获取旅行计划列表
   * @param {Object} filters - 过滤条件
   * @param {Object} options - 分页等选项
   * @param {string} userId - 用户ID
   * @returns {Promise<{travelPlans: Array, totalPages: Number, currentPage: Number}>} 旅行计划列表和分页信息
   */
  static async listTravelPlans(filters, options, userId) {
    const query = { userId, ...filters };
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const { travelPlans, total } = await TravelPlanDAL.findAll(query, {
      skip,
      limit,
      sort: { createdAt: -1 }
    });

    return {
      travelPlans,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  }

  /**
   * 查询单个旅行计划
   * @param {string} id - 旅行计划ID
   * @returns {Promise<Object>} 旅行计划
   * @throws {Error} 未找到旅行计划时抛出错误
   */
  static async getTravelPlan(id) {
    const travelPlan = await TravelPlanDAL.findById(id);
    if (!travelPlan) {
      throw createError(404, '未找到旅行计划');
    }
    return travelPlan;
  }

  /**
   * 更新旅行计划
   * @param {string} id - 旅行计划ID
   * @param {Object} updateData - 更新数据
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 更新后的旅行计划
   * @throws {Error} 未找到旅行计划或无权限时抛出错误
   */
  static async updateTravelPlan(id, updateData, userId) {
    const travelPlan = await TravelPlanDAL.findById(id);
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

    return await TravelPlanDAL.update(id, data);
  }

  /**
   * 删除旅行计划
   * @param {string} id - 旅行计划ID
   * @param {string} userId - 用户ID
   * @returns {Promise<void>}
   * @throws {Error} 未找到旅行计划或无权限时抛出错误
   */
  static async deleteTravelPlan(id, userId) {
    const travelPlan = await TravelPlanDAL.findById(id);
    if (!travelPlan) {
      throw createError(404, '未找到旅行计划');
    }

    if (travelPlan.userId.toString() !== userId.toString()) {
      throw createError(403, '没有权限删除此旅行计划');
    }

    await TravelPlanDAL.delete(id);
  }
}

module.exports = TravelPlanService;
