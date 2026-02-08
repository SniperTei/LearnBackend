# Sniper YOLO Backend 部署文档

本文档说明如何将 Sniper YOLO Backend 部署到火山引擎云服务器。

## 目录

- [环境要求](#环境要求)
- [项目结构](#项目结构)
- [部署架构](#部署架构)
- [快速开始](#快速开始)
- [详细部署步骤](#详细部署步骤)
- [环境配置](#环境配置)
- [数据库迁移](#数据库迁移)
- [监控和日志](#监控和日志)
- [故障排查](#故障排查)

## 环境要求

### 服务器要求

- **操作系统**: Linux (推荐 Ubuntu 20.04+ 或 CentOS 7+)
- **CPU**: 最少 2 核，推荐 4 核
- **内存**: 最少 4GB，推荐 8GB
- **磁盘**: 最少 20GB，推荐 50GB SSD

### 软件要求

- Docker 20.10+
- Docker Compose 2.0+
- Git (可选，用于代码部署)

## 项目结构

```
sniper-yolo-backend/
├── app/                    # 应用代码
├── alembic/               # 数据库迁移
├── nginx/                 # Nginx 配置
│   ├── nginx.dev.conf    # 开发环境配置
│   ├── nginx.test.conf   # 测试环境配置
│   └── logs/             # 日志目录
├── scripts/               # 脚本文件
│   └── init-db.sql       # 数据库初始化
├── docker-compose.dev.yml # 开发环境 Docker Compose
├── docker-compose.test.yml# 测试环境 Docker Compose
├── Dockerfile            # Docker 镜像构建文件
├── deploy.sh             # 部署脚本
├── .env.dev             # 开发环境变量
├── .env.test            # 测试环境变量
└── DEPLOYMENT.md        # 本文档
```

## 部署架构

### 开发环境

- **FastAPI**: 端口 8001 (容器内 8000)
- **PostgreSQL**: 端口 5433 (容器内 5432)
- **Redis**: 端口 6380 (容器内 6379)
- **Nginx**: 端口 8080

### 测试环境

- **FastAPI**: 端口 8002 (容器内 8000)
- **PostgreSQL**: 端口 5434 (容器内 5432)
- **Redis**: 端口 6381 (容器内 6379)
- **Nginx**: 端口 8081

## 快速开始

### 1. 安装 Docker

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 添加当前用户到 docker 组（可选，避免每次使用 sudo）
sudo usermod -aG docker $USER
newgrp docker
```

### 2. 安装 Docker Compose

```bash
# Docker Compose V2
# 随 Docker 安装自动包含

# 验证安装
docker compose version
```

### 3. 部署项目

```bash
# 克隆代码
git clone <repository-url>
cd sniper-yolo-backend

# 构建并启动开发环境
./deploy.sh dev build
./deploy.sh dev up

# 查看运行状态
./deploy.sh dev ps

# 查看日志
./deploy.sh dev logs
```

## 详细部署步骤

### 步骤 1: 准备服务器

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装必要工具
sudo apt install -y git curl wget vim

# 配置防火墙（如果启用）
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 8001/tcp  # 开发环境 API
sudo ufw allow 8002/tcp  # 测试环境 API
sudo ufw allow 8080/tcp  # 开发环境 Nginx
sudo ufw allow 8081/tcp  # 测试环境 Nginx
sudo ufw enable
```

### 步骤 2: 部署开发环境

```bash
# 进入项目目录
cd sniper-yolo-backend

# 构建镜像
./deploy.sh dev build

# 启动服务
./deploy.sh dev up

# 等待服务启动（约 30 秒）
sleep 30

# 检查服务状态
./deploy.sh dev ps

# 运行数据库迁移
./deploy.sh dev migrate
```

**验证部署:**

```bash
# 检查 API 健康状态
curl http://localhost:8001/api/v1/health

# 查看 Nginx 状态
curl http://localhost:8080/health
```

### 步骤 3: 部署测试环境

```bash
# 构建镜像
./deploy.sh test build

# 启动服务
./deploy.sh test up

# 等待服务启动
sleep 30

# 检查状态
./deploy.sh test ps

# 运行数据库迁移
./deploy.sh test migrate
```

**验证部署:**

```bash
# 检查 API 健康状态
curl http://localhost:8002/api/v1/health

# 查看 Nginx 状态
curl http://localhost:8081/health
```

## 环境配置

### 环境变量说明

#### 开发环境 (.env.dev)

```env
# 基础配置
DEBUG=true
ENVIRONMENT=development

# 数据库配置（Docker 内部网络）
DATABASE_URL=postgresql+asyncpg://sniper:db123456@postgres:5432/sniper_yolo_dev

# 七牛云配置
QINIU_ACCESS_KEY=your-access-key
QINIU_SECRET_KEY=your-secret-key
QINIU_BUCKET_NAME=your-bucket-name
QINIU_DOMAIN=your-domain
```

#### 测试环境 (.env.test)

```env
# 基础配置
DEBUG=true
ENVIRONMENT=test

# 数据库配置
DATABASE_URL=postgresql+asyncpg://sniper:db123456@postgres:5432/sniper_yolo_test

# 七牛云配置
QINIU_ACCESS_KEY=your-access-key
QINIU_SECRET_KEY=your-secret-key
QINIU_BUCKET_NAME=your-bucket-name
QINIU_DOMAIN=your-domain
```

### 修改配置

1. **编辑环境变量文件**

```bash
vim .env.dev
# 或
vim .env.test
```

2. **重启服务使配置生效**

```bash
./deploy.sh dev restart
# 或
./deploy.sh test restart
```

## 数据库迁移

### 首次部署

```bash
# 开发环境
./deploy.sh dev migrate

# 测试环境
./deploy.sh test migrate
```

### 手动执行迁移

```bash
# 进入容器
docker exec -it sniper_yolo_backend_dev bash

# 运行迁移
alembic upgrade head

# 退出容器
exit
```

### 创建新迁移

```bash
# 在本地开发环境
alembic revision --autogenerate -m "migration message"

# 应用迁移
alembic upgrade head
```

## 监控和日志

### 查看日志

```bash
# 查看所有服务日志
./deploy.sh dev logs

# 查看特定服务日志
docker logs sniper_yolo_backend_dev
docker logs sniper_postgres_dev
docker logs sniper_nginx_dev

# 实时跟踪日志
docker logs -f sniper_yolo_backend_dev

# 查看 Nginx 访问日志
tail -f nginx/logs/dev/access.log
```

### 容器状态监控

```bash
# 查看所有容器状态
docker ps -a

# 查看资源使用情况
docker stats

# 查看容器详细信息
docker inspect sniper_yolo_backend_dev
```

### 健康检查

```bash
# API 健康检查
curl http://localhost:8001/api/v1/health

# 检查数据库连接
docker exec sniper_postgres_dev pg_isready -U sniper

# 检查 Redis
docker exec sniper_redis_dev redis-cli ping
```

## 故障排查

### 问题 1: 容器无法启动

**症状**: `docker ps` 看不到容器运行

**解决方案**:

```bash
# 查看容器日志
docker logs sniper_yolo_backend_dev

# 检查配置文件
cat .env.dev

# 重新构建镜像
./deploy.sh dev build

# 重启服务
./deploy.sh dev restart
```

### 问题 2: 数据库连接失败

**症状**: API 返回数据库连接错误

**解决方案**:

```bash
# 检查数据库容器状态
docker ps | grep postgres

# 检查数据库日志
docker logs sniper_postgres_dev

# 测试数据库连接
docker exec -it sniper_postgres_dev psql -U sniper -d sniper_yolo_dev

# 重启数据库
docker restart sniper_postgres_dev
```

### 问题 3: Nginx 502 错误

**症状**: 访问 Nginx 返回 502 Bad Gateway

**解决方案**:

```bash
# 检查后端服务是否运行
docker ps | grep web

# 检查 Nginx 配置
docker exec sniper_nginx_dev nginx -t

# 查看 Nginx 日志
tail -f nginx/logs/dev/error.log

# 重启 Nginx
docker restart sniper_nginx_dev
```

### 问题 4: 磁盘空间不足

**症状**: 容器启动失败或运行缓慢

**解决方案**:

```bash
# 检查磁盘使用
df -h

# 清理未使用的 Docker 资源
docker system prune -a

# 清理特定环境的 volumes（危险操作）
docker volume rm sniper_yolo_backend_postgres_data_dev
```

### 问题 5: 端口冲突

**症状**: 启动时报端口已被占用

**解决方案**:

```bash
# 查看端口占用
sudo netstat -tlnp | grep :8001

# 停止占用端口的进程
sudo kill -9 <PID>

# 或修改 docker-compose 文件中的端口映射
vim docker-compose.dev.yml
```

## 常用命令

### 部署脚本命令

```bash
# 构建镜像
./deploy.sh dev build

# 启动服务
./deploy.sh dev up

# 停止服务
./deploy.sh dev down

# 重启服务
./deploy.sh dev restart

# 查看日志
./deploy.sh dev logs

# 查看状态
./deploy.sh dev ps

# 清理环境
./deploy.sh dev clean

# 运行迁移
./deploy.sh dev migrate
```

### Docker 原生命令

```bash
# 进入容器
docker exec -it sniper_yolo_backend_dev bash

# 从容器复制文件
docker cp sniper_yolo_backend_dev:/app/app/config.py ./

# 复制文件到容器
docker cp config.py sniper_yolo_backend_dev:/app/app/

# 查看容器资源使用
docker stats sniper_yolo_backend_dev

# 查看容器进程
docker top sniper_yolo_backend_dev
```

## 备份和恢复

### 数据库备份

```bash
# 备份开发环境数据库
docker exec sniper_postgres_dev pg_dump -U sniper sniper_yolo_dev > backup_dev_$(date +%Y%m%d).sql

# 备份测试环境数据库
docker exec sniper_postgres_test pg_dump -U sniper sniper_yolo_test > backup_test_$(date +%Y%m%d).sql
```

### 数据库恢复

```bash
# 恢复开发环境数据库
docker exec -i sniper_postgres_dev psql -U sniper sniper_yolo_dev < backup_dev_20250101.sql
```

## 安全建议

1. **修改默认密码**
   - 修改 .env 文件中的数据库密码
   - 使用强密码（包含大小写字母、数字、特殊字符）

2. **限制端口访问**
   - 在生产环境中关闭不必要的端口
   - 使用防火墙限制访问

3. **定期更新**
   - 定期更新 Docker 和基础镜像
   - 及时更新依赖库

4. **日志监控**
   - 定期检查日志文件
   - 设置日志轮转

5. **备份策略**
   - 定期备份数据库
   - 备份配置文件

## 联系支持

如有问题，请联系：
- 项目维护者
- 技术支持邮箱

## 附录

### 端口映射表

| 环境 | 服务 | 容器端口 | 宿主机端口 |
|------|------|----------|-----------|
| dev | FastAPI | 8000 | 8001 |
| dev | PostgreSQL | 5432 | 5433 |
| dev | Redis | 6379 | 6380 |
| dev | Nginx | 80 | 8080 |
| test | FastAPI | 8000 | 8002 |
| test | PostgreSQL | 5432 | 5434 |
| test | Redis | 6379 | 6381 |
| test | Nginx | 80 | 8081 |

### 目录结构说明

```
volumes/
├── postgres_data_dev/    # 开发环境数据库数据
├── postgres_data_test/   # 测试环境数据库数据
├── redis_data_dev/       # 开发环境 Redis 数据
└── redis_data_test/      # 测试环境 Redis 数据

nginx/logs/
├── dev/                  # 开发环境 Nginx 日志
│   ├── access.log
│   └── error.log
└── test/                 # 测试环境 Nginx 日志
    ├── access.log
    └── error.log
```

---

**最后更新**: 2025-02-08
**文档版本**: 1.0.0
