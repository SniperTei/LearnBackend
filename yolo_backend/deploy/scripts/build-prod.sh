#!/bin/bash

# 项目配置
PROJECT_NAME="yolo_backend"
BUILD_DIR="dist"

echo "Building production package..."

# 清理旧的构建文件
rm -rf ${BUILD_DIR}
rm -rf node_modules

# 创建构建目录
mkdir -p ${BUILD_DIR}

# 安装生产依赖
echo "Installing production dependencies..."
npm ci --only=production

# 复制必要的文件到构建目录
echo "Copying files..."
cp -r \
    package.json \
    package-lock.json \
    Dockerfile \
    docker-compose.yml \
    src \
    scripts \
    node_modules \
    ${BUILD_DIR}/

# 复制环境配置示例
cp .env.example ${BUILD_DIR}/

# 创建生产环境配置文件
echo "Generating production environment file..."
cat > ${BUILD_DIR}/.env.production << EOL
# Server Configuration
PORT=3000
NODE_ENV=production

# MongoDB Configuration
MONGODB_HOST=mongodb
MONGODB_PORT=27017
MONGODB_DATABASE=yolo_database_prod
MONGODB_URI=mongodb://\${MONGO_INITDB_ROOT_USERNAME}:\${MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017/yolo_database_prod?authSource=admin

# JWT Configuration
JWT_SECRET=\${JWT_SECRET}
JWT_EXPIRES_IN=12h

# Admin Configuration
ADMIN_PASSWORD=\${ADMIN_PASSWORD}

# Logging Configuration
LOG_LEVEL=warn
EOL

# 创建一个部署说明文件
cat > ${BUILD_DIR}/README.md << EOL
# YOLO Backend Production Deployment

## 环境变量配置
部署前需要设置以下环境变量：

\`\`\`bash
# JWT配置
export JWT_SECRET="your_jwt_secret"

# 管理员配置
export ADMIN_PASSWORD="your_admin_password"

# MongoDB配置
export MONGO_INITDB_ROOT_USERNAME="admin"
export MONGO_INITDB_ROOT_PASSWORD="your_mongodb_password"
\`\`\`

## 部署步骤
1. 设置环境变量
2. 构建 Docker 镜像：\`docker build -t yolo-backend .\`
3. 启动服务：\`docker-compose up -d\`

## 验证部署
- 检查容器状态：\`docker-compose ps\`
- 查看日志：\`docker-compose logs -f\`
EOL

# 创建部署包
echo "Creating deployment archive..."
cd ${BUILD_DIR}
tar -czf ../${PROJECT_NAME}_prod.tar.gz .
cd ..

# 构建Docker镜像
echo "开始构建 Docker 镜像..."
IMAGE_NAME="yolo-backend"
IMAGE_TAG="latest"
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

# 检查构建是否成功
if [ $? -eq 0 ]; then
    echo "Docker 镜像构建成功！"
    echo "镜像信息："
    docker images | grep ${IMAGE_NAME}
else
    echo "Docker 镜像构建失败！"
    exit 1
fi

echo "Production build completed!"
echo "Deployment package created: ${PROJECT_NAME}_prod.tar.gz"
echo ""
echo "Next steps:"
echo "1. Copy ${PROJECT_NAME}_prod.tar.gz to your server"
echo "2. Extract the archive: tar xzf ${PROJECT_NAME}_prod.tar.gz"
echo "3. Set environment variables"
echo "4. Run docker-compose up -d"
