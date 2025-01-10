const TravelDiary = require('../models/travelDiary.model');

class TravelDiaryDAL {
  static async create(diaryData) {
    const diary = new TravelDiary(diaryData);
    return await diary.save();
  }

  static async findAll(query, options) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    const diaries = await TravelDiary.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username')
      .populate('travelPlanId', 'title');
    
    const total = await TravelDiary.countDocuments(query);
    return { diaries, total };
  }

  static async findById(id) {
    return await TravelDiary.findById(id)
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username')
      .populate('travelPlanId', 'title');
  }

  static async update(id, updateData) {
    return await TravelDiary.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username')
     .populate('updatedBy', 'username')
     .populate('travelPlanId', 'title');
  }

  static async delete(id) {
    return await TravelDiary.findByIdAndDelete(id);
  }
}

module.exports = TravelDiaryDAL;
