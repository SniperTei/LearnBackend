const DictionaryService = require('../services/dictionary.service');
const ApiResponse = require('../utils/response');

class DictionaryController {
  constructor() {
    this.dictionaryService = new DictionaryService();
  }

  /**
   * 获取指定分组的字典数据
   */
  async getDictionariesByGroups(req, res) {
    try {
      const { groups } = req.query; // 从查询参数获取groups
      
      if (!groups) {
        return res.status(400).json(ApiResponse.error('请指定字典分组'));
      }

      const result = await this.dictionaryService.getDictionariesByGroups(groups);
      
      res.json(ApiResponse.success(result));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = DictionaryController;
