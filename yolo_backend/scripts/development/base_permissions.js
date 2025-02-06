// 清空现有集合
db.permissions.drop();

// 插入权限数据
db.permissions.insertMany([
  {
    "_id": ObjectId("67794044e3355e0b17621990"),
    "username": "jinyan",
    "menuCodes": [
      "system",
      "system_dashboard",
      "entertainment_movie",
      "discipline_drinking",
      "food_restaurant",
      "system_users",
      "entertainment",
      "entertainment_game",
      "food_foodmenu",
      "entertainment_travel",
      "discipline",
      "discipline_fitness",
      "food",
      "food_alcohol",
      "system_menus"
    ],
    "isDeleted": false,
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "createdAt": new Date("2025-01-04T14:05:56.813Z"),
    "updatedAt": new Date("2025-01-27T09:14:38.235Z"),
    "__v": 1,
    "userId": ObjectId("67794044e3355e0b1762198d")
  },
  {
    "_id": ObjectId("677f5f65523623b6f1a9ebfd"),
    "username": "tester",
    "menuCodes": [
      "system",
      "system_dashboard",
      "system_users",
      "system_menus",
      "entertainment",
      "entertainment_movie",
      "entertainment_game",
      "entertainment_travel",
      "discipline",
      "discipline_fitness",
      "discipline_drinking",
      "discipline_books",
      "food",
      "food_restaurant",
      "food_foodmenu",
      "food_alcohol"
    ],
    "isDeleted": false,
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "createdAt": new Date("2025-01-09T05:32:21.485Z"),
    "updatedAt": new Date("2025-01-09T05:32:21.485Z"),
    "__v": 0,
    "userId": ObjectId("677f5f65523623b6f1a9ebfa")
  },
  {
    "_id": ObjectId("678bc01929a5e50b5cd06ad3"),
    "username": "admin",
    "menuCodes": [
      "system",
      "system_dashboard",
      "system_users",
      "system_menus",
      "entertainment",
      "entertainment_movie",
      "entertainment_game",
      "entertainment_travel",
      "discipline",
      "discipline_fitness",
      "discipline_drinking",
      "discipline_books",
      "food",
      "food_restaurant",
      "food_foodmenu",
      "food_alcohol"
    ],
    "isDeleted": false,
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "createdAt": new Date("2025-01-18T14:52:09.270Z"),
    "updatedAt": new Date("2025-01-18T14:52:09.270Z"),
    "__v": 0,
    "userId": ObjectId("6776246679552adfa3ea6bef")
  }
]);

// 创建索引
db.permissions.createIndex({ "username": 1 }, { unique: true });

print("权限数据初始化完成");
