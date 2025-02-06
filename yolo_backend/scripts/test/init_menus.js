// 清空现有集合
db.menus.drop();

// 插入菜单数据
db.menus.insertMany([
  {
    "_id": ObjectId("677620bc1b77d3a638d5c441"),
    "title": "系统管理",
    "code": "system",
    "path": "/system",
    "icon": "fa-solid fa-gear",
    "isFolder": true,
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "createdAt": new Date("2025-01-02T05:14:36.967Z"),
    "updatedAt": new Date("2025-01-02T05:14:36.967Z"),
    "sort": 1
  },
  {
    "_id": ObjectId("677620bc1b77d3a638d5c442"),
    "title": "仪表盘",
    "code": "system_dashboard",
    "path": "/system/dashboard",
    "icon": "fa-solid fa-gauge",
    "isFolder": false,
    "createdBy": "SYSTEM",
    "updatedBy": "admin",
    "createdAt": new Date("2025-01-02T05:14:36.967Z"),
    "updatedAt": new Date("2025-01-27T06:09:36.955Z"),
    "sort": 1,
    "parentCode": null
  },
  {
    "_id": ObjectId("677620bc1b77d3a638d5c443"),
    "title": "用户管理",
    "code": "system_users",
    "path": "/system/users",
    "icon": "fa-solid fa-users",
    "isFolder": false,
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "createdAt": new Date("2025-01-02T05:14:36.967Z"),
    "updatedAt": new Date("2025-01-02T05:14:36.967Z"),
    "sort": 2
  },
  {
    "_id": ObjectId("677620bc1b77d3a638d5c444"),
    "title": "测试功能",
    "code": "test_features",
    "path": "/test",
    "icon": "fa-solid fa-vial",
    "isFolder": true,
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "createdAt": new Date("2025-01-02T05:14:36.989Z"),
    "updatedAt": new Date("2025-01-02T05:14:36.989Z"),
    "sort": 2
  },
  {
    "_id": ObjectId("677620bc1b77d3a638d5c445"),
    "title": "功能测试A",
    "code": "test_feature_a",
    "path": "/test/feature-a",
    "icon": "fa-solid fa-flask",
    "isFolder": false,
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "createdAt": new Date("2025-01-02T05:14:36.989Z"),
    "updatedAt": new Date("2025-01-02T05:14:36.989Z"),
    "sort": 1
  }
]);

// 创建索引
db.menus.createIndex({ "code": 1 }, { unique: true });

print("测试环境菜单数据初始化完成");
