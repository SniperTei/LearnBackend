# Docker 操作指南

本文档提供了构建、部署和管理 YOLO Backend 应用的 Docker 相关操作指南。

## 目录
- [环境要求](#环境要求)
- [构建 Docker 镜像](#构建-docker-镜像)
- [运行应用](#运行应用)
- [部署到服务器](#部署到服务器)
- [常用 Docker 命令](#常用-docker-命令)
- [故障排除](#故障排除)

## 环境要求

- Docker Desktop
- Node.js 18+
- MongoDB 6+

## 构建 Docker 镜像

1. 准备环境配置文件：
```bash
# 复制环境配置模板
cp .env.example .env.production

# 编辑 .env.production 文件，设置必要的环境变量
```

2. 构建生产环境代码：
```bash
# 运行生产环境构建脚本
./scripts/production/build-prod.sh
```

3. 构建 Docker 镜像：
```bash
# 构建镜像
docker build -t yolo-backend:prod .

# 检查镜像是否创建成功
docker images | grep yolo-backend
```

## 运行应用

1. 创建 `.env` 文件（与 docker-compose.yml 同级），设置必要的环境变量：
```env
JWT_SECRET=your_jwt_secret_here
ADMIN_PASSWORD=your_admin_password_here
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=your_mongodb_password_here
MONGODB_DATABASE=yolo_database_prod
```

2. 使用 Docker Compose 启动服务：
```bash
# 启动所有服务
docker compose up -d

# 检查服务状态
docker compose ps

# 查看应用日志
docker compose logs app

# 查看数据库日志
docker compose logs mongodb
```

## 部署到服务器

### 方法一：使用镜像仓库（推荐）

1. 推送到镜像仓库：
```bash
# 登录到镜像仓库
docker login mydockers.tslience.com

# 给镜像打标签
docker tag yolo-backend:prod mydockers.tslience.com/yolo-backend:prod

# 推送镜像
docker push mydockers.tslience.com/yolo-backend:prod
```

2. 在服务器上拉取和运行：
```bash
# 登录到镜像仓库
docker login mydockers.tslience.com

# 拉取镜像
docker pull mydockers.tslience.com/yolo-backend:prod

# 运行服务
docker compose up -d
```

### 方法二：使用文件传输

1. 在本地打包：
```bash
# 保存镜像为文件
docker save -o yolo-backend.tar yolo-backend:prod

# 压缩文件
gzip yolo-backend.tar

# 创建部署包
mkdir -p deploy
cp docker-compose.yml .env.production deploy/
cp -r scripts/production deploy/scripts/
cp yolo-backend.tar.gz deploy/
tar -czf yolo-backend-deploy.tar.gz deploy/
```

2. 传输到服务器：
```bash
# 将部署包传输到服务器
scp yolo-backend-deploy.tar.gz username@your-server:/path/to/deploy/

# 在服务器上解压和运行
ssh username@your-server
cd /path/to/deploy
tar -xzf yolo-backend-deploy.tar.gz
cd deploy
gunzip yolo-backend.tar.gz
docker load -i yolo-backend.tar
docker compose up -d
```

## 常用 Docker 命令

### 镜像相关
```bash
# 列出所有镜像
docker images

# 删除镜像
docker rmi [镜像ID]

# 强制删除镜像
docker rmi -f [镜像ID]

# 清理未使用的镜像
docker image prune
```

### 容器相关
```bash
# 列出运行中的容器
docker ps

# 列出所有容器（包括停止的）
docker ps -a

# 停止容器
docker stop [容器ID]

# 启动容器
docker start [容器ID]

# 重启容器
docker restart [容器ID]

# 删除容器
docker rm [容器ID]

# 强制删除运行中的容器
docker rm -f [容器ID]
```

### Docker Compose 命令
```bash
# 启动服务
docker compose up -d

# 停止服务
docker compose down

# 查看服务状态
docker compose ps

# 查看服务日志
docker compose logs

# 查看特定服务的日志
docker compose logs [服务名]

# 重启服务
docker compose restart

# 强制重建容器
docker compose up -d --force-recreate
```

### 其他实用命令
```bash
# 查看容器资源使用情况
docker stats

# 进入容器内部
docker exec -it [容器ID] bash

# 查看容器日志
docker logs [容器ID]

# 实时查看日志
docker logs -f [容器ID]

# 清理系统
docker system prune
```

## 故障排除

### 1. 镜像拉取失败
如果遇到镜像拉取失败，可以：
- 检查网络连接
- 使用国内镜像源
- 检查镜像仓库登录状态

### 2. 容器启动失败
如果容器无法启动：
- 检查端口是否被占用
- 查看容器日志 `docker logs [容器ID]`
- 确认环境变量是否正确设置

### 3. 数据库连接失败
如果无法连接到 MongoDB：
- 确认 MongoDB 容器是否运行 `docker compose ps`
- 检查环境变量中的数据库配置
- 查看 MongoDB 日志 `docker compose logs mongodb`

### 4. 性能问题
如果遇到性能问题：
- 使用 `docker stats` 监控资源使用情况
- 检查日志中的警告和错误
- 考虑增加容器资源限制

## 注意事项

1. **安全性**
   - 不要在代码仓库中提交敏感信息
   - 使用强密码
   - 定期更新依赖和镜像

2. **数据持久化**
   - 重要数据使用 Docker volumes 存储
   - 定期备份数据
   - 谨慎使用 `docker compose down -v`

3. **资源管理**
   - 定期清理未使用的镜像和容器
   - 监控容器资源使用情况
   - 适时调整资源限制
