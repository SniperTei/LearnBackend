// 检查是否存在基础菜单
const baseMenus = [
    { code: "system" },
    { code: "system_dashboard" },
    { code: "system_users" }
];

for (const menu of baseMenus) {
    const exists = db.menus.findOne({ code: menu.code });
    if (!exists) {
        print(`Base menu ${menu.code} not found, loading from base data...`);
        load("scripts/development/base_menus.js");
        break;
    }
}

print("开发环境菜单数据检查完成");
