const PerformanceDAO = require('../dal/performance.dal');
const CustomerService = require('./customer.service');

class PerformanceService {
  constructor() {
    this.performanceDao = new PerformanceDAO();
    this.customerService = new CustomerService();
  }

  /**
   * 格式化performance数据，将_id转换为performanceId
   * @private
   */
  formatPerformance(performance) {
    if (!performance) return null;

    const { _id, __v, ...rest } = performance;
    return {
      performanceId: _id.toString(),
      ...rest
    };
  }

  async createPerformance(performanceData) {
    const performance = await this.performanceDao.create(performanceData);
    return this.formatPerformance(performance);
  }

  async getAllPerformances(filter = {}, options = {}) {
    try {
      const {
        page,
        limit,
        customerId,
        performanceType,
        startDate,
        endDate
      } = options;

      // 构建查询条件
      const query = { ...filter };
      if (customerId) query.customerId = customerId;
      if (performanceType) query.performanceType = performanceType;
      if (startDate || endDate) {
        query.performanceDate = {};
        if (startDate) query.performanceDate.$gte = new Date(startDate);
        if (endDate) query.performanceDate.$lte = new Date(endDate);
      }

      const result = await this.performanceDao.findAll(query, { page, limit });
      return {
        performances: result.performances.map(this.formatPerformance),
        pagination: result.pagination
      };
    } catch (error) {
      throw new Error(`获取performance列表失败: ${error.message}`);
    }
  }

  async getPerformanceById(id) {
    const performance = await this.performanceDao.findById(id);
    if (!performance) {
      throw new Error('Performance not found');
    }
    return this.formatPerformance(performance);
  }

  async updatePerformance(id, updateData) {
    const performance = await this.performanceDao.update(id, updateData);
    if (!performance) {
      throw new Error('Performance not found');
    }
    return this.formatPerformance(performance);
  }

  async deletePerformance(id) {
    const performance = await this.performanceDao.delete(id);
    if (!performance) {
      throw new Error('Performance not found');
    }
    return this.formatPerformance(performance);
  }

  async createCustomerWithPerformance(data, userId) {
    try {
      // 1. 创建客户
      const customerData = {
        name: data.name,
        avatarUrl: data.avatarUrl,
        medicalRecordNumber: data.medicalRecordNumber,
        lastPurchaseDate: data.lastPurchaseDate,
        remarks: data.customerRemarks
      };
      
      const customer = await this.customerService.createCustomer(customerData, userId);

      // 2. 创建performance记录
      const performanceData = {
        customerId: customer.customerId,
        performanceDate: data.performanceDate,
        performanceType: data.performanceType,
        amount: data.amount,
        itemA: data.itemA,
        itemB: data.itemB,
        remarks: data.performanceRemarks
      };

      const performance = await this.createPerformance(performanceData);

      // 3. 返回组合数据
      return {
        customer,
        performance
      };
    } catch (error) {
      throw new Error(`创建客户和消费记录失败: ${error.message}`);
    }
  }
}

module.exports = new PerformanceService(); 