const Customer = require('../models/customer.model');
const CustomerService = require('../services/customer.service');
const ApiResponse = require('../utils/response');

class CustomerController {
  constructor() {
    console.log('customer controller created');
    this.customerService = new CustomerService();
  }

  /**
   * 创建客户
   * POST /api/v1/customers
   */
  async createCustomer(req, res) {
    try {
      // 从请求中获取用户ID (假设通过auth中间件设置)
      const userId = req.user.id;
      
      const customer = await this.customerService.createCustomer(req.body, userId);
      res.status(201).json({
        code: '000000',
        statusCode: 201,
        msg: '创建成功',
        data: customer
      });
    } catch (error) {
      res.status(500).json({
        code: 'A00500',
        statusCode: 500,
        msg: error.message,
        data: null
      });
    }
  }

  /**
   * 获取客户列表
   * GET /api/v1/customers
   * 支持分页、姓名过滤
   */
  async getAllCustomers(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        name,
        sortBy = 'createdAt',
        order = 'desc'
      } = req.query;

      // 构建过滤条件
      const filter = {};
      if (name) filter.name = { $regex: name, $options: 'i' }; // 不区分大小写的姓名搜索

      // 构建排序条件
      const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

      const customers = await this.customerService.getAllCustomers(
        filter,
        {
          page: parseInt(page),
          limit: parseInt(limit),
          sort
        }
      );

      res.json(ApiResponse.success(customers));
    } catch (error) {
      res.status(500).json(ApiResponse.error('Failed to fetch customers: ' + error.message));
    }
  }

  /**
   * 获取单个客户详情
   * GET /api/v1/customers/:id
   * @param {string} id - 客户ID
   * @returns {Promise<Object>} 客户记录
   */
  async getCustomerById(req, res) {
    try {
      const customer = await this.customerService.getCustomerById(req.params.id);
      if (!customer) {
        return res.status(404).json(ApiResponse.error('Customer not found'));
      }
      res.json(ApiResponse.success(customer));
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json(ApiResponse.error('Invalid customer ID'));
      }
      res.status(500).json(ApiResponse.error('Failed to fetch customer: ' + error.message));
    }
  }

  /**
   * 更新客户信息
   * PUT /api/v1/customers/:id
   */
  async updateCustomer(req, res) {
    try {
      const userId = req.user.id; // 从认证中间件获取当前用户ID
      
      // 只提取需要更新的字段
      const updateData = {
        name: req.body.name,
        avatarUrl: req.body.avatarUrl,
        medicalRecordNumber: req.body.medicalRecordNumber,
        lastPurchaseDate: req.body.lastPurchaseDate,
        remarks: req.body.remarks,
        updatedBy: userId // 使用当前用户ID
      };

      const customer = await this.customerService.updateCustomer(
        req.params.id,
        updateData
      );

      res.json({
        code: '000000',
        statusCode: 200,
        msg: '更新成功',
        data: customer
      });
    } catch (error) {
      res.status(500).json({
        code: 'A00500',
        statusCode: 500,
        msg: error.message,
        data: null
      });
    }
  }

  /**
   * 删除客户
   * DELETE /api/v1/customers/:id
   * @param {string} id - 客户ID
   * @returns {Promise<Object>} 删除的客户记录
   */
  async deleteCustomer(req, res) {
    try {
      const customer = await this.customerService.deleteCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json(ApiResponse.error('Customer not found'));
      }
      res.json(ApiResponse.success(null, 'Customer deleted successfully'));
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json(ApiResponse.error('Invalid customer ID'));
      }
      res.status(500).json(ApiResponse.error('Failed to delete customer: ' + error.message));
    }
  }
}

module.exports = CustomerController;
