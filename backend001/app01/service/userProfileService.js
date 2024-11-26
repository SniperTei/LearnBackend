const UserProfile = require("../model/userProfileModel");

const userProfileService = {
  // 查该用户
  queryUserProfile: async (username) => {
    try {
      const userProfile = await UserProfile.findOne({ username});
      // 打印出来看看
      console.log("userProfile:", userProfile);
      return userProfile;
    } catch (error) {
      console.error("An error occurred:", error);
      throw error;
    }
  }
};