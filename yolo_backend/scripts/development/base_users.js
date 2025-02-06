// 清空现有集合
db.users.drop();

// 插入用户数据
db.users.insertMany([
  {
    "_id": ObjectId("6776246679552adfa3ea6bef"),
    "username": "admin",
    "email": "admin@example.com",
    "mobile": "13800000001",
    "password": "4297f44b13955235245b2497399d7a93",
    "gender": "male",
    "birthDate": new Date("1990-01-30T00:00:00.000Z"),
    "isAdmin": true,
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "createdAt": new Date("2025-01-02T05:30:14.029Z"),
    "updatedAt": new Date("2025-01-27T08:05:19.663Z"),
    "isDeleted": false,
    "lastLoginAt": new Date("2025-01-27T08:05:19.662Z"),
    "avatarUrl": "default-avatar.png"
  },
  {
    "_id": ObjectId("6776246679552adfa3ea6bf0"),
    "username": "teinan",
    "email": "teinan@example.com",
    "mobile": "13800000002",
    "password": "c8837b23ff8aaa8a2dde915473ce0991",
    "gender": "male",
    "birthDate": new Date("1990-01-30T00:00:00.000Z"),
    "isAdmin": false,
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "createdAt": new Date("2025-01-02T05:30:14.034Z"),
    "updatedAt": new Date("2025-01-23T08:16:08.757Z"),
    "isDeleted": false,
    "lastLoginAt": new Date("2025-01-23T08:16:08.756Z"),
    "avatarUrl": "default-avatar.png"
  },
  {
    "_id": ObjectId("67794044e3355e0b1762198d"),
    "username": "jinyan",
    "email": "thisisa@qq.com",
    "mobile": "13913991399",
    "password": "4297f44b13955235245b2497399d7a93",
    "gender": "female",
    "birthDate": new Date("1991-04-20T00:00:00.000Z"),
    "avatarUrl": "default-avatar.png",
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "isAdmin": false,
    "isDeleted": false,
    "createdAt": new Date("2025-01-04T14:05:56.802Z"),
    "updatedAt": new Date("2025-01-04T14:05:56.802Z")
  }
]);

// 创建索引
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "mobile": 1 }, { unique: true });

print("用户数据初始化完成");
