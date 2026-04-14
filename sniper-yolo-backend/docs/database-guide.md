# PostgreSQL 数据库使用指南

## 📋 目录

- [数据库连接](#数据库连接)
- [数据库结构](#数据库结构)
- [常用命令](#常用命令)
- [查询示例](#查询示例)
- [最佳实践](#最佳实践)

## 🔌 数据库连接

### 连接信息

```bash
Host: 127.0.0.1
Port: 5432
Database: sniper_yolo
User: sniper
Password: <your_password>  # 请在 .env 文件中配置
```

### 连接方式

**方式1：psql 命令**
```bash
psql -h 127.0.0.1 -p 5432 -U sniper -d sniper_yolo
```

**方式2：连接字符串**
```bash
psql postgresql://sniper:<your_password>@127.0.0.1:5432/sniper_yolo
```

**方式3：Python**
```python
import psycopg2
conn = psycopg2.connect('postgresql://sniper:<your_password>@127.0.0.1:5432/sniper_yolo')
cur = conn.cursor()
```

## 📊 数据库结构

### 表概览

| 表名 | 说明 | 关键字段 |
|------|------|----------|
| users | 用户表 | id, username, email, is_superuser |
| foods | 美食表 | id, title, star, maker |
| enjoys | 饭店表 | id, title, location, price_per_person |
| items | 物品表 | id, title, price, owner_id |
| drinks | 饮品表 | id, drink_name, drink_type, star |
| funs | 娱乐表 | id, title, star, maker |

### users 表结构

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    mobile VARCHAR UNIQUE,
    hashed_password VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 🛠️ 常用命令

### 为用户添加超级用户权限

psql -d postgres -c "ALTER USER sniper WITH SUPERUSER;"   

### psql 元命令

| 命令 | 说明 |
|------|------|
| `\dt` | 列出所有表 |
| `\d [表名]` | 查看表结构 |
| `\du` | 列出所有用户 |
| `\l` | 列出所有数据库 |
| `\x` | 切换扩展显示模式 |
| `\q` | 退出 |

### 基础查询

```sql
-- 查看所有表
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public';

-- 查看表结构
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'users';

-- 统计各表记录数
SELECT 
    tablename,
    n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public';
```

## 📝 查询示例

### 用户表查询

```sql
-- 查看所有用户
SELECT * FROM users;

-- 查看超级用户
SELECT * FROM users WHERE is_superuser = true;

-- 统计用户数
SELECT 
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE is_superuser = true) as admins
FROM users;
```

### 业务数据查询

```sql
-- 查看美食（带评分筛选）
SELECT * FROM foods WHERE star >= 4 ORDER BY star DESC;

-- 查看饭店（按价格区间）
SELECT title, location, price_per_person 
FROM enjoys 
WHERE price_per_person BETWEEN 50 AND 200;

-- 查看物品（含所有者信息）
SELECT 
    i.title,
    i.price,
    u.username as owner
FROM items i
JOIN users u ON i.owner_id = u.id;
```

## 📈 高级查询

### 分页查询

```sql
SELECT * FROM users
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;
```

### 模糊搜索

```sql
-- 标题搜索
SELECT * FROM foods WHERE title LIKE '%川菜%';

-- 多条件搜索
SELECT * FROM foods 
WHERE title LIKE '%川%' OR content LIKE '%川%';
```

### 数组字段查询

```sql
-- 标签包含某个值
SELECT * FROM foods WHERE '美食' = ANY(tags);

-- 标签包含多个值
SELECT * FROM foods WHERE tags @> ARRAY['美食', '辣'];
```

## 🚀 性能优化

### 索引管理

```sql
-- 查看索引
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public';

-- 创建索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_foods_star ON foods(star);

-- 分析查询性能
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

## 🛡️ 数据备份

### 备份命令

```bash
# 完整备份
pg_dump -h 127.0.0.1 -U sniper sniper_yolo > backup.sql

# 恢复数据库
psql -h 127.0.0.1 -U sniper sniper_yolo < backup.sql
```

## 📌 最佳实践

1. **使用事务**：重要操作使用 BEGIN/COMMIT/ROLLBACK
2. **参数化查询**：防止 SQL 注入
3. **定期维护**：ANALYZE、VACUUM
4. **监控性能**：检查慢查询并优化

## 🔧 故障排查

### 常见问题

**连接失败**
```bash
# 检查服务状态
ps aux | grep postgres

# 测试连接
psql -h 127.0.0.1 -p 5432 -U sniper -d sniper_yolo
```

**查看连接数**
```sql
SELECT COUNT(*) FROM pg_stat_activity;
```

---

**更新时间**: 2026-02-05  
**维护者**: Sniper Team
