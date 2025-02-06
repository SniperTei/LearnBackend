// 检查是否存在基础用户
const baseUsers = [
    { username: "admin" },
    { username: "teinan" },
    { username: "jinyan" }
];

for (const user of baseUsers) {
    const exists = db.users.findOne({ username: user.username });
    if (!exists) {
        print(`Base user ${user.username} not found, loading from base data...`);
        load("scripts/development/base_users.js");
        break;
    }
}

print("开发环境用户数据检查完成");
