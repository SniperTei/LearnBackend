// 清空现有集合
db.users.drop();

// 插入用户数据


// 创建索引
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "mobile": 1 }, { unique: true });

print("生产环境用户数据初始化完成");
