// 连接到数据库
db = db.getSiblingDB('yolo_backend');

// 清空现有数据
db.foodmenus.drop();

// 准备插入的数据
const foodMenus = [
  // 荤菜
  {
    name: "孜盐牛肉",
    type: "meat",
    description: "选用上等牛肉，配以孜然和盐巴烹制，香气四溢，口感鲜美。",
    imageUrl: "https://food-images.com/ziyaniurou.jpg",
    price: 68,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "수육",
    type: "meat",
    description: "韩式白切肉，肉质鲜嫩，搭配特制酱料，风味独特。",
    imageUrl: "https://food-images.com/suyuk.jpg",
    price: 58,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "锅包肉",
    type: "meat",
    description: "东北名菜，酸甜可口，外酥里嫩。",
    imageUrl: "https://food-images.com/guobaorou.jpg",
    price: 48,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "辣鱿鱼",
    type: "meat",
    description: "新鲜鱿鱼配以特制辣酱，口感爽滑，开胃下饭。",
    imageUrl: "https://food-images.com/layouyu.jpg",
    price: 46,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "可乐鸡翅",
    type: "meat",
    description: "可乐焖制鸡翅，甜中带咸，肉质滑嫩。",
    imageUrl: "https://food-images.com/kelejichi.jpg",
    price: 36,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "红烧排骨",
    type: "meat",
    description: "精选猪排骨，红烧入味，肉质酥烂。",
    imageUrl: "https://food-images.com/hongshaopaigu.jpg",
    price: 58,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "金燕式肥牛饭",
    type: "meat",
    description: "特制酱料腌制肥牛，搭配米饭，香气四溢。",
    imageUrl: "https://food-images.com/feiniufan.jpg",
    price: 38,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "香辣肉丝",
    type: "meat",
    description: "精选猪肉切丝，爆炒入味，香辣可口。",
    imageUrl: "https://food-images.com/xiangrousi.jpg",
    price: 38,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "香辣蟹",
    type: "meat",
    description: "新鲜螃蟹配以特制香辣酱料，香辣过瘾。",
    imageUrl: "https://food-images.com/xiangxie.jpg",
    price: 128,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "辣炒蚬子",
    type: "meat",
    description: "新鲜蚬子爆炒，辣味十足，开胃下饭。",
    imageUrl: "https://food-images.com/lachaoxianzi.jpg",
    price: 46,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "清蒸金昌鱼",
    type: "meat",
    description: "新鲜金昌鱼清蒸，保持鱼的原汁原味。",
    imageUrl: "https://food-images.com/jinchangyu.jpg",
    price: 68,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "煎刀鱼",
    type: "meat",
    description: "新鲜刀鱼煎制，外酥内嫩，鱼香四溢。",
    imageUrl: "https://food-images.com/jiandaoyu.jpg",
    price: 48,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "秋刀鱼",
    type: "meat",
    description: "烤制秋刀鱼，鱼肉鲜美，营养丰富。",
    imageUrl: "https://food-images.com/qiudaoyu.jpg",
    price: 38,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "금연양념치킨",
    type: "meat",
    description: "韩式调味炸鸡，外酥内嫩，风味独特。",
    imageUrl: "https://food-images.com/yangniemchicken.jpg",
    price: 58,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "鸡蛋虾仁",
    type: "meat",
    description: "新鲜虾仁配以鸡蛋，营养美味。",
    imageUrl: "https://food-images.com/jidanxiaren.jpg",
    price: 48,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "매운양념명태구이",
    type: "meat",
    description: "韩式辣味明太鱼，口感鲜美，开胃下饭。",
    imageUrl: "https://food-images.com/mingtaiyu.jpg",
    price: 58,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "닭복음탕",
    type: "meat",
    description: "韩式炖鸡，汤汁浓郁，鸡肉鲜嫩。",
    imageUrl: "https://food-images.com/dakbokeum.jpg",
    price: 88,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "크림새우",
    type: "meat",
    description: "韩式奶油虾，口感细腻，风味独特。",
    imageUrl: "https://food-images.com/creamshrimp.jpg",
    price: 68,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "西兰花炒虾仁",
    type: "meat",
    description: "新鲜虾仁配以西兰花，营养均衡。",
    imageUrl: "https://food-images.com/broccolishrimp.jpg",
    price: 48,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "泡椒牛肉",
    type: "meat",
    description: "泡椒炒牛肉，麻辣鲜香，开胃下饭。",
    imageUrl: "https://food-images.com/paojiaobeef.jpg",
    price: 58,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "青椒酿虾滑",
    type: "meat",
    description: "虾滑酿青椒，口感独特，营养美味。",
    imageUrl: "https://food-images.com/stuffedpepper.jpg",
    price: 48,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },

  // 凉菜
  {
    name: "菠菜",
    type: "cold_dish",
    description: "清爽可口的凉拌菠菜，开胃爽口。",
    imageUrl: "https://food-images.com/spinach.jpg",
    price: 18,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "黄瓜大头菜",
    type: "cold_dish",
    description: "爽口黄瓜配以大头菜，清新可口。",
    imageUrl: "https://food-images.com/cucumberpickle.jpg",
    price: 16,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "拌生菜",
    type: "cold_dish",
    description: "新鲜生菜凉拌，清脆爽口。",
    imageUrl: "https://food-images.com/lettucesalad.jpg",
    price: 16,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "拌黄花",
    type: "cold_dish",
    description: "凉拌黄花菜，爽口开胃。",
    imageUrl: "https://food-images.com/yellowflower.jpg",
    price: 18,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "黄瓜干豆腐",
    type: "cold_dish",
    description: "黄瓜配以干豆腐，清淡爽口。",
    imageUrl: "https://food-images.com/cucumbertofu.jpg",
    price: 16,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },

  // 素菜
  {
    name: "苦瓜炒蛋",
    type: "vegetarian",
    description: "苦瓜配以鸡蛋，清香可口，营养丰富。",
    imageUrl: "https://food-images.com/kuguachaodan.jpg",
    price: 28,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "炒豆芽",
    type: "vegetarian",
    description: "清炒豆芽，爽口开胃，清脆可口。",
    imageUrl: "https://food-images.com/chaodouya.jpg",
    price: 18,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "炒鱼丸",
    type: "vegetarian",
    description: "鱼丸炒制，口感弹牙，美味可口。",
    imageUrl: "https://food-images.com/chaoyuwan.jpg",
    price: 32,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "炒蘑菇",
    type: "vegetarian",
    description: "新鲜蘑菇炒制，菌香四溢，营养丰富。",
    imageUrl: "https://food-images.com/chaomogu.jpg",
    price: 28,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "西红柿鸡蛋",
    type: "vegetarian",
    description: "经典搭配，酸甜可口，家常美味。",
    imageUrl: "https://food-images.com/fanqiejidan.jpg",
    price: 26,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "烫西兰花",
    type: "vegetarian",
    description: "清烫西兰花，保持营养，清甜爽口。",
    imageUrl: "https://food-images.com/tangxilanhua.jpg",
    price: 26,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "芹菜辣椒",
    type: "vegetarian",
    description: "芹菜配以辣椒，清香微辣，开胃爽口。",
    imageUrl: "https://food-images.com/qincailajiao.jpg",
    price: 24,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "锅包豆腐",
    type: "vegetarian",
    description: "外酥内嫩的锅包豆腐，口感独特，美味可口。",
    imageUrl: "https://food-images.com/guobaodoufu.jpg",
    price: 32,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "葱爆豆腐",
    type: "vegetarian",
    description: "葱香豆腐，清淡可口，营养美味。",
    imageUrl: "https://food-images.com/congbaodoufu.jpg",
    price: 28,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "辣拌土豆丝",
    type: "vegetarian",
    description: "爽口土豆丝，开胃下饭，香辣可口。",
    imageUrl: "https://food-images.com/tudousi.jpg",
    price: 22,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "金燕土豆片",
    type: "vegetarian",
    description: "特色土豆片，金燕独家配方，美味可口。",
    imageUrl: "https://food-images.com/jinyanpotato.jpg",
    price: 24,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "辣白菜土豆片",
    type: "vegetarian",
    description: "辣白菜配土豆片，韩式风味，开胃下饭。",
    imageUrl: "https://food-images.com/kimsipotato.jpg",
    price: 26,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "爆炒大头菜",
    type: "vegetarian",
    description: "爆炒大头菜，咸香可口，开胃下饭。",
    imageUrl: "https://food-images.com/datoucai.jpg",
    price: 26,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "醋溜白菜",
    type: "vegetarian",
    description: "醋溜白菜，酸甜可口，开胃爽口。",
    imageUrl: "https://food-images.com/culiubaicai.jpg",
    price: 24,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },

  // 汤类
  {
    name: "豆腐汤",
    type: "soup",
    description: "清淡可口的豆腐汤，营养美味，暖胃舒心。",
    imageUrl: "https://food-images.com/doufutang.jpg",
    price: 22,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "大酱汤",
    type: "soup",
    description: "韩式大酱汤，浓郁鲜美，开胃暖身。",
    imageUrl: "https://food-images.com/daejiangtang.jpg",
    price: 24,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "豆芽汤",
    type: "soup",
    description: "清爽豆芽汤，开胃解腻，营养健康。",
    imageUrl: "https://food-images.com/douyatang.jpg",
    price: 20,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "酸汤肥牛",
    type: "soup",
    description: "酸爽开胃的肥牛汤，汤鲜肉嫩，美味可口。",
    imageUrl: "https://food-images.com/suantangfeiniu.jpg",
    price: 46,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },

  // 下饭菜
  {
    name: "장조림",
    type: "side_dish",
    description: "韩式酱牛肉，咸香可口，是传统的下饭菜。",
    imageUrl: "https://food-images.com/jangjorim.jpg",
    price: 42,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "콩장",
    type: "side_dish",
    description: "韩式豆酱，香浓可口，开胃下饭。",
    imageUrl: "https://food-images.com/kongjang.jpg",
    price: 32,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "蚬子",
    type: "side_dish",
    description: "新鲜蚬子，鲜美可口，开胃下饭。",
    imageUrl: "https://food-images.com/xianzi.jpg",
    price: 36,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },

  // 主食
  {
    name: "炒米粉",
    type: "staple_food",
    description: "特制炒米粉，口感滑嫩，香气四溢。",
    imageUrl: "https://food-images.com/chaomifen.jpg",
    price: 28,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  },
  {
    name: "金燕咖喱牛肉粉",
    type: "staple_food",
    description: "金燕特制咖喱牛肉粉，浓郁香醇，回味无穷。",
    imageUrl: "https://food-images.com/currybeefnoodles.jpg",
    price: 36,
    chef: "朴金燕",
    createdBy: "admin",
    updatedBy: "admin"
  }
];

// 插入数据
db.foodmenus.insertMany(foodMenus);

// 打印结果
print("Food menus initialized successfully!");
