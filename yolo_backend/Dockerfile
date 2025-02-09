# 使用 Node.js 18 作为基础镜像
FROM mydockers.tslience.com/node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制所有源代码和配置文件
COPY . .

# 设置环境变量
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["npm", "run", "prod"]