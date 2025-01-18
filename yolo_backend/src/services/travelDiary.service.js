const TravelDiaryDAL = require('../dal/travelDiary.dal');
const createError = require('http-errors');

class TravelDiaryService {
  constructor() {
    this.travelDiaryDAL = new TravelDiaryDAL();
  }

  async createDiary(diaryData, userId) {
    const data = {
      ...diaryData,
      userId,
      createdBy: userId,
      updatedBy: userId
    };
    const diary = await this.travelDiaryDAL.create(data);
    return this._formatDiary(diary);
  }

  async listDiaries(filters, options, userId) {
    const query = { userId, ...filters };
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const { diaries, total } = await this.travelDiaryDAL.findAll(query, {
      skip,
      limit,
      sort: { createdAt: -1 }
    });

    return {
      diaries: diaries.map(diary => this._formatDiary(diary)),
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  }

  async getDiary(id) {
    const diary = await this.travelDiaryDAL.findById(id);
    if (!diary) {
      throw createError(404, '未找到游记');
    }
    return this._formatDiary(diary);
  }

  async updateDiary(id, updateData, userId) {
    const diary = await this.travelDiaryDAL.findById(id);
    if (!diary) {
      throw createError(404, '未找到游记');
    }

    if (diary.userId.toString() !== userId.toString()) {
      throw createError(403, '没有权限更新此游记');
    }

    const data = {
      ...updateData,
      updatedBy: userId
    };

    const updatedDiary = await this.travelDiaryDAL.update(id, data);
    return this._formatDiary(updatedDiary);
  }

  async deleteDiary(id, userId) {
    const diary = await this.travelDiaryDAL.findById(id);
    if (!diary) {
      throw createError(404, '未找到游记');
    }

    if (diary.userId.toString() !== userId.toString()) {
      throw createError(403, '没有权限删除此游记');
    }

    await this.travelDiaryDAL.delete(id);
    return this._formatDiary(diary);
  }

  /**
   * 格式化游记数据，将_id转换为diaryId
   * @private
   */
  _formatDiary(diary) {
    if (!diary) return null;

    const diaryObj = diary.toObject ? diary.toObject() : diary;
    const { _id, ...rest } = diaryObj;

    return {
      diaryId: _id.toString(),
      ...rest
    };
  }
}

module.exports = TravelDiaryService;
