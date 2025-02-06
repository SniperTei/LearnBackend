#!/bin/bash

# 确保脚本在错误时退出
set -e

# 检查必要的环境变量
required_vars=(
    "JWT_SECRET"
    "ADMIN_PASSWORD"
    "MONGO_INITDB_ROOT_USERNAME"
    "MONGO_INITDB_ROOT_PASSWORD"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: $var is not set"
        echo "Please set the required environment variables before running this script:"
        echo "export JWT_SECRET=your_jwt_secret"
        echo "export ADMIN_PASSWORD=your_admin_password"
        echo "export MONGO_INITDB_ROOT_USERNAME=your_mongodb_username"
        echo "export MONGO_INITDB_ROOT_PASSWORD=your_mongodb_password"
        exit 1
    fi
done

# 创建生产环境配置文件
cat > .env.production << EOL
# Server Configuration
PORT=3000
NODE_ENV=production

# MongoDB Configuration (Docker 内部配置)
MONGODB_HOST=mongodb
MONGODB_PORT=27017
MONGODB_DATABASE=yolo_database_prod
MONGODB_URI=mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/yolo_database_prod?authSource=admin

# MongoDB Root Credentials
MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME}
MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}

# Admin Configuration
ADMIN_PASSWORD=${ADMIN_PASSWORD}

# JWT Configuration
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=12h

# Logging Configuration
LOG_LEVEL=warn
EOL

echo "Generated .env.production with secure configuration"

# 构建镜像
echo "Building Docker images..."
docker-compose build

# 停止旧容器
echo "Stopping existing containers..."
docker-compose down

# 启动新容器
echo "Starting containers..."
docker-compose up -d

# 等待 MongoDB 启动
echo "Waiting for MongoDB to start..."
sleep 10

# 初始化数据库
echo "Initializing database..."
docker-compose exec -T mongodb mongosh \
    "mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/yolo_database_prod?authSource=admin" \
    /docker-entrypoint-initdb.d/init_users.js \
    /docker-entrypoint-initdb.d/init_menus.js \
    /docker-entrypoint-initdb.d/init_permissions.js

echo "Deployment completed successfully!"
