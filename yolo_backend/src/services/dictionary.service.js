const DictionaryDAL = require('../dal/dictionary.dal');

class DictionaryService {
  constructor() {
    this.dictionaryDAL = new DictionaryDAL();
  }

  /**
   * 获取指定分组的字典数据
   * @param {string} groupStr 以逗号分隔的分组名称字符串
   * @returns {Promise<Object>} 按分组组织的字典数据
   */
  async getDictionariesByGroups(groupStr) {
    // 将逗号分隔的字符串转为数组，并去除空白字符
    const groups = groupStr.split(',').map(g => g.trim()).filter(Boolean);
    
    // 获取所有数据
    const dictionaries = await this.dictionaryDAL.findByGroups(groups);
    
    // 按group分组整理数据
    const result = {};
    dictionaries.forEach(item => {
      if (!result[item.group]) {
        result[item.group] = [];
      }
      result[item.group].push({
        key: item.key,
        value: item.value
      });
    });
    
    return result;
  }
}

module.exports = DictionaryService;
