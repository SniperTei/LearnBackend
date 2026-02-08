# Sniper YOLO Backend - 测试环境部署

## 前置要求

在启动服务之前，需要创建环境变量文件：

```bash
# 创建测试环境配置文件
cp .env.example .env.test

# 编辑文件，设置数据库密码
vim .env.test
```

`.env.test` 示例：
```bash
DB_PASSWORD=your_secure_password_here
POSTGRES_USER=sniper
POSTGRES_DB=sniper_yolo_test
```

**注意：** `.env.test` 已在 `.gitignore` 中，不会被提交到 git。

## 网络配置

**测试环境专用网络：**
- 网络名称：`sniper_test_network`
- 子网：`172.20.0.0/16`
- 类型：bridge

**容器连接到该网络：**

| 容器名 | 服务 | 网络内 IP | 容器端口 | 主机端口映射 |
|---------|------|-----------|---------|-------------|
| `sniper_postgres_test` | PostgreSQL | 172.20.0.2 | 5432 | 5434:5432 |
| `sniper_redis_test` | Redis | 172.20.0.3 | 6379 | 6381:6379 |

## 快速启动

### 启动数据库服务

```bash
cd /opt/services/sniper-yolo-backend/sniper-yolo-backend
./start-services.sh
```

### 启动 FastAPI 应用

```bash
cd /opt/services/sniper-yolo-backend/sniper-yolo-backend

# 1. 创建环境变量文件（首次需要）
cp .env.example .env.test
# 然后修改 .env.test 中的 DB_PASSWORD

# 2. 加载环境变量
source .env.test 2>/dev/null || true

# 3. 激活虚拟环境
source venv/bin/activate

# 4. 设置数据库连接
export DATABASE_URL="postgresql+asyncpg://sniper:${DB_PASSWORD}@localhost:5434/sniper_yolo_test"
export ALEMBIC_DATABASE_URL="postgresql+psycopg2://sniper:${DB_PASSWORD}@localhost:5434/sniper_yolo_test"

# 5. 运行迁移
alembic upgrade head

# 6. 启动应用
./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8002
```

或者后台运行：

```bash
nohup ./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8002 > /tmp/yolo-api.log 2>&1 &
```

## 网络使用

### 容器间通信

如果后续前端也用 Docker 部署，可以加入 `sniper_test_network` 网络，然后通过容器名访问：

```yaml
services:
  frontend:
    networks:
      - sniper_test_network
    environment:
      - API_URL=http://sniper_postgres_test:5432  # 或者其他服务
```

**容器间可用的服务名：**
- `sniper_postgres_test` - PostgreSQL (端口 5432)
- `sniper_redis_test` - Redis (端口 6379)

### 主机访问数据库

从主机访问使用 localhost + 映射端口：

- PostgreSQL: `localhost:5434`
- Redis: `localhost:6381`

连接字符串（需要先加载 .env.test 中的密码）：
```bash
source .env.test
export DB_URL="postgresql://sniper:${DB_PASSWORD}@localhost:5434/sniper_yolo_test"
```

或手动替换 ${DB_PASSWORD} 为实际密码：
```
postgresql://sniper:YOUR_PASSWORD@localhost:5434/sniper_yolo_test
```

## 管理命令

### 查看容器状态

```bash
docker ps --filter "name=sniper_"
```

### 查看网络

```bash
docker network inspect sniper_test_network
```

### 查看日志

```bash
# PostgreSQL
docker logs -f sniper_postgres_test

# Redis
docker logs -f sniper_redis_test

# FastAPI
tail -f /tmp/yolo-api.log
```

### 停止服务

```bash
docker stop sniper_postgres_test sniper_redis_test
```

### 启动服务

```bash
docker start sniper_postgres_test sniper_redis_test
```

## 前端部署（示例）

当部署前端到 Docker 时，加入同一个网络：

```yaml
version: '3.8'

services:
  frontend:
    image: your-frontend-image
    container_name: sniper_frontend_test
    networks:
      - sniper_test_network
    ports:
      - "3000:80"
    environment:
      - API_URL=http://sniper_postgres_test:5432  # 或其他服务

networks:
  sniper_test_network:
    external: true
```

## 访问地址

- FastAPI: http://localhost:8002
- API 文档: http://localhost:8002/api/v1/docs
- 通过域名: http://api-test.sniper14.online

## 故障排查

### 检查数据库连接

```bash
# 进入 PostgreSQL 容器
docker exec -it sniper_postgres_test psql -U sniper -d sniper_yolo_test

# 测试连接
\conninfo
```

### 检查 Redis

```bash
# 进入 Redis 容器
docker exec -it sniper_redis_test redis-cli

# 测试
ping
```

### 检查网络连接

```bash
# 从一个容器测试连接另一个
docker exec sniper_redis_test ping sniper_postgres_test
```
