const Dictionary = require('../models/dictionary.model');

class DictionaryDAL {
  /**
   * 根据多个分组获取字典列表
   * @param {string[]} groups 分组名称数组
   * @returns {Promise<Array>} 字典列表
   */
  static async findByGroups(groups) {
    return await Dictionary.find({ 
      group: { $in: groups } 
    }).select('key value group').sort({ key: 1 });
  }
}

module.exports = DictionaryDAL;
