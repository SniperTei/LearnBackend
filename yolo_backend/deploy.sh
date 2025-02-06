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
        exit 1
    fi
done

# 设置默认值
export MONGODB_DATABASE=${MONGODB_DATABASE:-yolo_database_prod}

# 创建生产环境配置文件
cat > .env.production << EOL
# Server Configuration
PORT=3000
NODE_ENV=production

# MongoDB Configuration
MONGODB_HOST=mongodb
MONGODB_PORT=27017
MONGODB_DATABASE=${MONGODB_DATABASE}
MONGODB_URI=mongodb://mongodb:27017/${MONGODB_DATABASE}

# JWT Configuration
JWT_SECRET=${JWT_SECRET:-'change_this_in_production'}
JWT_EXPIRES_IN=12h

# Logging Configuration
LOG_LEVEL=warn
EOL

# 构建镜像
docker-compose build

# 停止旧容器
docker-compose down

# 启动新容器
docker-compose up -d

# 等待 MongoDB 启动
echo "Waiting for MongoDB to start..."
sleep 10

# 初始化数据库
docker-compose exec -T mongodb mongosh \
    "mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/${MONGODB_DATABASE}?authSource=admin" \
    /docker-entrypoint-initdb.d/init_users.js \
    /docker-entrypoint-initdb.d/init_menus.js \
    /docker-entrypoint-initdb.d/init_permissions.js

echo "Deployment completed!"
