const fs = require('fs');
const path = require('path');

// 读取 JSON 文件
const jsonData = fs.readFileSync(path.join(__dirname, '../../src/forai/yolo_database.menus.json'), 'utf8');
const menus = JSON.parse(jsonData);

// 转换函数
function convertMenu(menu) {
  const converted = { ...menu };
  
  // 转换 _id
  if (menu._id && menu._id.$oid) {
    converted._id = `ObjectId("${menu._id.$oid}")`;
  }
  
  // 转换日期
  if (menu.createdAt && menu.createdAt.$date) {
    converted.createdAt = `ISODate("${menu.createdAt.$date}")`;
  }
  if (menu.updatedAt && menu.updatedAt.$date) {
    converted.updatedAt = `ISODate("${menu.updatedAt.$date}")`;
  }
  
  return converted;
}

// 转换所有菜单
const convertedMenus = menus.map(convertMenu);

// 生成 MongoDB 脚本
const scriptContent = `// 读取新的菜单数据
const newMenus = ${JSON.stringify(convertedMenus, null, 2)
  .replace(/"ObjectId\((.*?)\)"/g, 'ObjectId($1)')
  .replace(/"ISODate\((.*?)\)"/g, 'ISODate($1)')};

// 清空现有菜单
db.menus.drop();

// 插入新菜单
newMenus.forEach(menu => {
  // 如果菜单有 _id，保持原有的 ObjectId
  if (menu._id) {
    db.menus.insertOne(menu);
  } else {
    // 如果没有 _id，MongoDB 会自动生成
    delete menu._id;
    db.menus.insertOne(menu);
  }
});

// 创建必要的索引
db.menus.createIndex({ "code": 1 }, { unique: true });

print("菜单数据更新完成");`;

// 写入到文件
fs.writeFileSync(path.join(__dirname, 'update_menus.js'), scriptContent);
console.log('转换完成，脚本已生成到 update_menus.js');
