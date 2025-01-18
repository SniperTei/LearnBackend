const AlcoholService = require('../services/alcohol.service');
const ApiResponse = require('../utils/response');

class AlcoholController {
  constructor() {
    console.log('alcohol controller created');
    this.alcoholService = new AlcoholService();
  }

  /**
   * 创建酒类
   * POST /api/v1/alcohols
   */
  async createAlcohol(req, res) {
    try {
      // 验证必需字段
      const { name, type, brand, alcoholContent, volume, volumeUnit } = req.body;
      if (!name || !type || !brand || !alcoholContent || !volume || !volumeUnit) {
        return res.status(400).json(ApiResponse.error('Missing required fields'));
      }

      // 构建酒类数据
      const alcoholData = {
        ...req.body,
        createdBy: req.user.username,
        updatedBy: req.user.username
      };
      
      const alcohol = await this.alcoholService.createAlcohol(alcoholData);
      res.status(201).json(ApiResponse.success(alcohol, 'Alcohol created successfully'));
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json(ApiResponse.error('Validation failed: ' + error.message));
      }
      res.status(500).json(ApiResponse.error('Failed to create alcohol: ' + error.message));
    }
  }

  /**
   * 获取酒类列表
   * GET /api/v1/alcohols
   * 支持分页、类型过滤
   */
  async getAllAlcohols(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        brand,
        minAlcoholContent,
        maxAlcoholContent,
        sortBy = 'createdAt',
        order = 'desc'
      } = req.query;

      // 构建过滤条件
      const filter = {};
      if (type) filter.type = type;
      if (brand) filter.brand = { $regex: brand, $options: 'i' }; // 不区分大小写的品牌搜索
      if (minAlcoholContent || maxAlcoholContent) {
        filter.alcoholContent = {};
        if (minAlcoholContent) filter.alcoholContent.$gte = parseFloat(minAlcoholContent);
        if (maxAlcoholContent) filter.alcoholContent.$lte = parseFloat(maxAlcoholContent);
      }

      // 构建排序条件
      const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

      const alcohols = await this.alcoholService.getAllAlcohols(
        filter,
        {
          page: parseInt(page),
          limit: parseInt(limit),
          sort
        }
      );

      res.json(ApiResponse.success(alcohols));
    } catch (error) {
      res.status(500).json(ApiResponse.error('Failed to fetch alcohols: ' + error.message));
    }
  }

  /**
   * 获取单个酒类详情
   * GET /api/v1/alcohols/:id
   */
  async getAlcoholById(req, res) {
    try {
      const alcohol = await this.alcoholService.getAlcoholById(req.params.id);
      if (!alcohol) {
        return res.status(404).json(ApiResponse.error('Alcohol not found'));
      }
      res.json(ApiResponse.success(alcohol));
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json(ApiResponse.error('Invalid alcohol ID'));
      }
      res.status(500).json(ApiResponse.error('Failed to fetch alcohol: ' + error.message));
    }
  }

  /**
   * 更新酒类信息
   * PUT /api/v1/alcohols/:id
   */
  async updateAlcohol(req, res) {
    try {
      const alcohol = await this.alcoholService.updateAlcohol(
        req.params.id,
        {
          ...req.body,
          updatedBy: req.user.username
        }
      );

      if (!alcohol) {
        return res.status(404).json(ApiResponse.error('Alcohol not found'));
      }

      res.json(ApiResponse.success(alcohol, 'Alcohol updated successfully'));
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json(ApiResponse.error('Validation failed: ' + error.message));
      }
      if (error.name === 'CastError') {
        return res.status(400).json(ApiResponse.error('Invalid alcohol ID'));
      }
      res.status(500).json(ApiResponse.error('Failed to update alcohol: ' + error.message));
    }
  }

  /**
   * 删除酒类
   * DELETE /api/v1/alcohols/:id
   */
  async deleteAlcohol(req, res) {
    try {
      const alcohol = await this.alcoholService.deleteAlcohol(req.params.id);
      if (!alcohol) {
        return res.status(404).json(ApiResponse.error('Alcohol not found'));
      }
      res.json(ApiResponse.success(null, 'Alcohol deleted successfully'));
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json(ApiResponse.error('Invalid alcohol ID'));
      }
      res.status(500).json(ApiResponse.error('Failed to delete alcohol: ' + error.message));
    }
  }
}

module.exports = AlcoholController;
