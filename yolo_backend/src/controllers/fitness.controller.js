const fitnessService = require('../services/fitness.service');
const ApiResponse = require('../utils/response');

class FitnessController {
  /**
   * 创建运动记录
   */
  static async createFitness(req, res) {
    try {
      const fitnessData = {
        ...req.body,
        userId: req.user.userId,
        createdBy: req.user.username,
        updatedBy: req.user.username,
        exerciseDate: req.body.exerciseDate || new Date()
      };

      const fitness = await fitnessService.createFitness(fitnessData);
      res.status(201).json(ApiResponse.success(fitness, '运动记录创建成功'));
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json(ApiResponse.error('数据验证失败: ' + error.message));
      }
      res.status(500).json(ApiResponse.error('创建运动记录失败: ' + error.message));
    }
  }

  /**
   * 获取运动记录列表
   */
  static async getAllFitness(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        startDate,
        endDate,
        exerciseType,
        intensity,
        sortBy = 'exerciseDate',
        order = 'desc'
      } = req.query;

      // 构建过滤条件
      const filter = { userId: req.user.userId };
      
      // 时间范围过滤
      if (startDate || endDate) {
        filter.exerciseDate = {};
        if (startDate) filter.exerciseDate.$gte = new Date(startDate);
        if (endDate) filter.exerciseDate.$lte = new Date(endDate);
      }
      
      // 运动类型和强度过滤
      if (exerciseType) filter.exerciseType = exerciseType;
      if (intensity) filter.intensity = intensity;

      // 构建排序条件
      const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

      const result = await fitnessService.getAllFitness(
        filter,
        {
          page: parseInt(page),
          limit: parseInt(limit),
          sort
        }
      );

      res.json(ApiResponse.success(result));
    } catch (error) {
      res.status(500).json(ApiResponse.error('获取运动记录失败: ' + error.message));
    }
  }

  /**
   * 获取单个运动记录
   */
  static async getFitnessById(req, res) {
    try {
      const fitness = await fitnessService.getFitnessById(req.params.id);
      
      if (!fitness) {
        return res.status(404).json(ApiResponse.error('运动记录不存在'));
      }

      // 验证用户权限
      if (fitness.userId._id.toString() !== req.user.userId) {
        return res.status(403).json(ApiResponse.error('无权访问此运动记录'));
      }

      res.json(ApiResponse.success(fitness));
    } catch (error) {
      res.status(500).json(ApiResponse.error('获取运动记录失败: ' + error.message));
    }
  }

  /**
   * 更新运动记录
   */
  static async updateFitness(req, res) {
    try {
      const fitness = await fitnessService.getFitnessById(req.params.id);
      
      if (!fitness) {
        return res.status(404).json(ApiResponse.error('运动记录不存在'));
      }

      // 验证用户权限
      if (fitness.userId._id.toString() !== req.user.userId) {
        return res.status(403).json(ApiResponse.error('无权修改此运动记录'));
      }

      const updateData = {
        ...req.body,
        updatedBy: req.user.username
      };

      const updatedFitness = await fitnessService.updateFitness(req.params.id, updateData);
      res.json(ApiResponse.success(updatedFitness, '运动记录更新成功'));
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json(ApiResponse.error('数据验证失败: ' + error.message));
      }
      res.status(500).json(ApiResponse.error('更新运动记录失败: ' + error.message));
    }
  }

  /**
   * 删除运动记录
   */
  static async deleteFitness(req, res) {
    try {
      const fitness = await fitnessService.getFitnessById(req.params.id);
      
      if (!fitness) {
        return res.status(404).json(ApiResponse.error('运动记录不存在'));
      }

      // 验证用户权限
      if (fitness.userId._id.toString() !== req.user.userId) {
        return res.status(403).json(ApiResponse.error('无权删除此运动记录'));
      }

      await fitnessService.deleteFitness(req.params.id);
      res.json(ApiResponse.success(null, '运动记录删除成功'));
    } catch (error) {
      res.status(500).json(ApiResponse.error('删除运动记录失败: ' + error.message));
    }
  }
}

module.exports = FitnessController;
