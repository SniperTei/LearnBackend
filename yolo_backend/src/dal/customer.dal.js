const Customer = require('../models/customer.model');

class CustomerDAO {
  constructor() {
    this.Customer = Customer;
  }

  /**
   * 创建客户
   * @param {Object} customerData - 客户数据
   * @returns {Promise<Object>} 创建的酒类记录
   */
  async createCustomer(customerData) {
    const customer = new this.Customer(customerData);
    return await customer.save();
  }

  /**
   * 获取客户列表
   * @param {Object} filter - 过滤条件
   * @param {Object} options - 选项（分页、排序等）
   * @returns {Promise<Object>} 客户列表和总数
   */
  async getAllCustomers(filter = {}, options = {}) {
    const { page = 1, limit = 10, sort = {} } = options;
    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      this.Customer
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.Customer.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      customers,
      pagination: {
        total,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * 根据ID获取客户
   * @param {string} id - 客户ID
   * @returns {Promise<Object>} 客户记录
   */
  async getCustomerById(id) {
    return await this.Customer.findById(id).lean();
  }

  /**
   * 更新客户
   * @param {string} id - 客户ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object>} 更新后的客户记录
   */
  async updateCustomer(id, updateData) {
    return await this.Customer.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true, lean: true }
    )
  }
  
  /**
   * 删除客户
   * @param {string} id - 客户ID
   * @returns {Promise<Object>} 删除的客户记录
   */
  async deleteCustomer(id) {
    return await this.Customer.findByIdAndDelete(id).lean();
  }
}

module.exports = CustomerDAO;
