// 系统管理菜单
db.menus.insertMany([
  {
    title: "系统管理",
    code: "system",
    path: "/system",
    icon: "setting",
    isFolder: true,
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "仪表盘",
    code: "system_dashboard",
    path: "/system/dashboard",
    icon: "dashboard",
    isFolder: false,
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "用户管理",
    code: "system_users",
    path: "/system/users",
    icon: "user",
    isFolder: false,
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// 娱乐菜单
db.menus.insertMany([
  {
    title: "娱乐",
    code: "entertainment",
    path: "/entertainment",
    icon: "smile",
    isFolder: true,
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "影视",
    code: "entertainment_movie",
    path: "/entertainment/movie",
    icon: "video-camera",
    isFolder: false,
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "游戏",
    code: "entertainment_game",
    path: "/entertainment/game",
    icon: "gamepad",
    isFolder: false,
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "旅游",
    code: "entertainment_travel",
    path: "/entertainment/travel",
    icon: "compass",
    isFolder: false,
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// 自律菜单
db.menus.insertMany([
  {
    title: "自律",
    code: "discipline",
    path: "/discipline",
    icon: "trophy",
    isFolder: true,
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "健身",
    code: "discipline_fitness",
    path: "/discipline/fitness",
    icon: "heart",
    isFolder: false,
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "饮酒",
    code: "discipline_drinking",
    path: "/discipline/drinking",
    icon: "coffee",
    isFolder: false,
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "图书",
    code: "discipline_books",
    path: "/discipline/books",
    icon: "book",
    isFolder: false,
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// 美食菜单
db.menus.insertMany([
  {
    title: "美食",
    code: "food",
    path: "/food",
    icon: "coffee",
    isFolder: true,
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "菜谱",
    code: "food_recipe",
    path: "/food/recipe",
    icon: "book",
    isFolder: false,
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "菜单",
    code: "food_menu",
    path: "/food/menu",
    icon: "file-text",
    isFolder: false,
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "酒类",
    code: "food_wine",
    path: "/food/wine",
    icon: "wine",
    isFolder: false,
    createdBy: "SYSTEM",
    updatedBy: "SYSTEM",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
