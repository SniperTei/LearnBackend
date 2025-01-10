const TravelDiaryDAL = require('../dal/travelDiary.dal');
const createError = require('http-errors');

class TravelDiaryService {
  static async createDiary(diaryData, userId) {
    const data = {
      ...diaryData,
      userId,
      createdBy: userId,
      updatedBy: userId
    };
    return await TravelDiaryDAL.create(data);
  }

  static async listDiaries(filters, options, userId) {
    const query = { userId, ...filters };
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const { diaries, total } = await TravelDiaryDAL.findAll(query, {
      skip,
      limit,
      sort: { createdAt: -1 }
    });

    return {
      diaries,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  }

  static async getDiary(id) {
    const diary = await TravelDiaryDAL.findById(id);
    if (!diary) {
      throw createError(404, '未找到游记');
    }
    return diary;
  }

  static async updateDiary(id, updateData, userId) {
    const diary = await TravelDiaryDAL.findById(id);
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

    return await TravelDiaryDAL.update(id, data);
  }

  static async deleteDiary(id, userId) {
    const diary = await TravelDiaryDAL.findById(id);
    if (!diary) {
      throw createError(404, '未找到游记');
    }

    if (diary.userId.toString() !== userId.toString()) {
      throw createError(403, '没有权限删除此游记');
    }

    await TravelDiaryDAL.delete(id);
  }
}

module.exports = TravelDiaryService;
