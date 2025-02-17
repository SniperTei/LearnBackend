// 清空现有集合
db.permissions.drop();

// 插入权限数据
db.permissions.insertMany([
  {
    "_id": ObjectId("678bc01929a5e50b5cd06ad3"),
    "username": "admin",
    "menuCodes": [
      "system",
      "system_dashboard",
      "system_users",
      "entertainment",
      "entertainment_movie"
    ],
    "isDeleted": false,
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "createdAt": new Date("2025-01-18T14:52:09.270Z"),
    "updatedAt": new Date("2025-01-18T14:52:09.270Z"),
    "__v": 0,
    "userId": ObjectId("6776246679552adfa3ea6bef")
  },
  {
    "_id": ObjectId("6776246679552adfa3ea6bf1"),
    "username": "teinan",
    "menuCodes": [
      "system_dashboard",
      "entertainment",
      "entertainment_movie"
    ],
    "isDeleted": false,
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "createdAt": new Date("2025-01-02T05:30:14.037Z"),
    "updatedAt": new Date("2025-01-20T03:36:07.354Z"),
    "__v": 0,
    "userId": ObjectId("6776246679552adfa3ea6bf0")
  },
  {
    "_id": ObjectId("67794044e3355e0b17621990"),
    "username": "jinyan",
    "menuCodes": [
      "system_dashboard",
      "entertainment",
      "entertainment_movie"
    ],
    "isDeleted": false,
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "createdAt": new Date("2025-01-04T14:05:56.813Z"),
    "updatedAt": new Date("2025-01-27T09:14:38.235Z"),
    "__v": 1,
    "userId": ObjectId("67794044e3355e0b1762198d")
  }
]);

// 创建索引
db.permissions.createIndex({ "username": 1 }, { unique: true });

print("生产环境权限数据初始化完成");
