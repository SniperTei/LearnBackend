// 创建管理员用户
db.users.insertOne({
  username: "admin",
  email: "admin@example.com",
  mobile: "13800000001",
  password: "e0cf1f46689e696f5782a33b9487fef3", // 123123的MD5值
  gender: "male",
  birthDate: new Date("1990-01-30"),
  isAdmin: true,
  createdBy: "SYSTEM",
  updatedBy: "SYSTEM",
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false,
  lastLoginAt: null,
  avatarUrl: "default-avatar.png"
});

// 创建具有所有菜单权限的普通用户
db.users.insertOne({
  username: "teinan",
  email: "teinan@example.com",
  mobile: "13800000002",
  password: "e0cf1f46689e696f5782a33b9487fef3", // 123123的MD5值
  gender: "male",
  birthDate: new Date("1990-01-30"),
  isAdmin: false,
  createdBy: "SYSTEM",
  updatedBy: "SYSTEM",
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false,
  lastLoginAt: null,
  avatarUrl: "default-avatar.png"
});

// 创建限制权限的普通用户
db.users.insertOne({
  username: "test001",
  email: "test001@example.com",
  mobile: "13800000003",
  password: "e0cf1f46689e696f5782a33b9487fef3", // 123123的MD5值
  gender: "male",
  birthDate: new Date("1990-01-30"),
  isAdmin: false,
  createdBy: "SYSTEM",
  updatedBy: "SYSTEM",
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false,
  lastLoginAt: null,
  avatarUrl: "default-avatar.png"
});

// 创建用户权限集合
db.permissions.insertMany([
  // teinan用户的权限（所有菜单）
  {
    username: "teinan",
    menuCodes: [
      "system", "system_dashboard", "system_users",
      "entertainment", "entertainment_movie", "entertainment_game", "entertainment_travel",
      "discipline", "discipline_fitness", "discipline_drinking", "discipline_books",
      "food", "food_recipe", "food_menu", "food_wine"
    ],
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // test001用户的权限（除了自律及其子菜单外的所有菜单）
  {
    username: "test001",
    menuCodes: [
      "system", "system_dashboard", "system_users",
      "entertainment", "entertainment_movie", "entertainment_game", "entertainment_travel",
      "food", "food_recipe", "food_menu", "food_wine"
    ],
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
