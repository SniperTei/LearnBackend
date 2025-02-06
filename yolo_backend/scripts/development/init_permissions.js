// 检查是否存在基础权限
const baseUsers = [
    { username: "admin" },
    { username: "teinan" },
    { username: "jinyan" }
];

for (const user of baseUsers) {
    const exists = db.permissions.findOne({ username: user.username });
    if (!exists) {
        print(`Base permission for ${user.username} not found, loading from base data...`);
        load("scripts/development/base_permissions.js");
        break;
    }
}

print("开发环境权限数据检查完成");
