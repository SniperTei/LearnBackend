// 清空现有集合
db.permissions.drop();

// 插入权限数据
db.permissions.insertMany([
  {
    "_id": ObjectId("67794044e3355e0b17621990"),
    "username": "admin",
    "menuCodes": [
      "system",
      "system_dashboard",
      "system_users",
      "test_features",
      "test_feature_a"
    ],
    "isDeleted": false,
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "createdAt": new Date("2025-01-04T14:05:56.813Z"),
    "updatedAt": new Date("2025-01-27T09:14:38.235Z"),
    "__v": 1,
    "userId": ObjectId("6776246679552adfa3ea6bef")
  },
  {
    "_id": ObjectId("677f5f65523623b6f1a9ebfd"),
    "username": "test_user",
    "menuCodes": [
      "system_dashboard",
      "test_features",
      "test_feature_a"
    ],
    "isDeleted": false,
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "createdAt": new Date("2025-01-09T05:32:21.485Z"),
    "updatedAt": new Date("2025-01-09T05:32:21.485Z"),
    "__v": 0,
    "userId": ObjectId("6776246679552adfa3ea6bf0")
  }
]);

// 创建索引
db.permissions.createIndex({ "username": 1 }, { unique: true });

print("测试环境权限数据初始化完成");
