const TravelPlan = require('../models/travelPlan.model');

class TravelPlanDAL {
  /**
   * 创建旅行计划
   * @param {Object} travelPlanData - 旅行计划数据
   * @returns {Promise<Object>} 创建的旅行计划
   */
  async create(travelPlanData) {
    const travelPlan = new TravelPlan(travelPlanData);
    return await travelPlan.save();
  }

  /**
   * 根据条件查询旅行计划列表
   * @param {Object} query - 查询条件
   * @param {Object} options - 分页等选项
   * @returns {Promise<{travelPlans: Array, total: Number}>} 旅行计划列表和总数
   */
  async findAll(query, options) {
    const { skip, limit, sort = { createdAt: -1 } } = options;
    
    const [travelPlans, total] = await Promise.all([
      TravelPlan.find(query)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate('createdBy', 'username')
        .populate('updatedBy', 'username'),
      TravelPlan.countDocuments(query)
    ]);

    return { travelPlans, total };
  }

  /**
   * 根据ID查询单个旅行计划
   * @param {string} id - 旅行计划ID
   * @returns {Promise<Object>} 旅行计划
   */
  async findById(id) {
    return await TravelPlan.findById(id)
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username');
  }

  /**
   * 根据条件查询单个旅行计划
   * @param {Object} query - 查询条件
   * @returns {Promise<Object>} 旅行计划
   */
  async findOne(query) {
    return await TravelPlan.findOne(query)
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username');
  }

  /**
   * 更新旅行计划
   * @param {string} id - 旅行计划ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object>} 更新后的旅行计划
   */
  async update(id, updateData) {
    return await TravelPlan.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username')
     .populate('updatedBy', 'username');
  }

  /**
   * 删除旅行计划
   * @param {string} id - 旅行计划ID
   * @returns {Promise<Object>} 删除结果
   */
  async delete(id) {
    return await TravelPlan.findByIdAndDelete(id);
  }
}

module.exports = TravelPlanDAL;
