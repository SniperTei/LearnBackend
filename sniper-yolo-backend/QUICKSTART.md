# 🚀 快速开始指南

## 部署到火山引擎云服务器

### 第一步：连接服务器

```bash
ssh root@your-server-ip
```

### 第二步：安装 Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### 第三步：部署代码

#### 方式一：使用 Git（推荐）

**首次部署**：
```bash
# 在服务器上执行
cd /root
git clone https://github.com/your-username/sniper-yolo-backend.git
cd sniper-yolo-backend
```

**后续更新**：
```bash
# 在服务器上执行
cd /root/sniper-yolo-backend
git pull origin main
```

#### 方式二：使用 rsync 增量同步（适合快速更新）

```bash
# 在本地执行 - 只同步变化的文件
rsync -avz --delete \
  --exclude='.git' \
  --exclude='__pycache__' \
  --exclude='*.pyc' \
  --exclude='node_modules' \
  --exclude='.env.prod' \
  sniper-yolo-backend/ root@your-server-ip:/root/sniper-yolo-backend/
```

#### 方式三：首次使用 scp，后续使用 Git

```bash
# 首次部署 - 在本地执行
scp -r sniper-yolo-backend root@your-server-ip:/root/

# 然后在服务器上初始化 Git
ssh root@your-server-ip
cd /root/sniper-yolo-backend
git init
git remote add origin https://github.com/your-username/sniper-yolo-backend.git

# 后续更新就可以直接 git pull 了
git pull origin main
```

### 第四步：部署测试环境

```bash
# 连接到服务器后
cd /root/sniper-yolo-backend

# 构建并启动
./deploy.sh test build
./deploy.sh test up

# 等待 30 秒后运行迁移
sleep 30
./deploy.sh test migrate
```

### 第五步：验证测试环境

```bash
# 检查服务状态
./deploy.sh test ps

# 测试 API
curl http://localhost:8002/api/v1/health
```

### 第六步：部署生产环境

```bash
# 1. 配置环境变量
vim .env.prod
# 修改 SECRET_KEY 和数据库密码

# 2. 构建并启动
./deploy.sh prod build
./deploy.sh prod up

# 3. 等待 30 秒后运行迁移
sleep 30
./deploy.sh prod migrate

# 4. 配置 SSL（可选）
./deploy.sh prod ssl
```

### 第七步：验证生产环境

```bash
# 检查服务状态
./deploy.sh prod ps

# 测试 API
curl http://localhost:8000/api/v1/health
```

## 访问地址

| 环境 | 服务 | 端口 |
|------|------|------|
| 测试 | FastAPI | 8002 |
| 测试 | Nginx | 8081 |
| 生产 | FastAPI | 8000 |
| 生产 | Nginx HTTP | 80 |
| 生产 | Nginx HTTPS | 443 |

## 代码更新和重新部署

### 推荐工作流程

#### 1. 使用 Git（最适合团队协作）

**优点**：
- 版本控制，可以回滚
- 只传输变化的内容，速度快
- 可以追踪部署历史
- 支持分支管理（测试/生产环境不同分支）

**首次部署**：
```bash
# 在服务器上
cd /root
git clone https://github.com/your-username/sniper-yolo-backend.git
cd sniper-yolo-backend
```

**日常更新流程**：
```bash
# 1. 本地提交代码
git add .
git commit -m "描述你的改动"
git push origin main

# 2. 服务器上拉取更新
ssh root@your-server-ip
cd /root/sniper-yolo-backend
git pull origin main

# 3. 重新构建和部署
./deploy.sh test build   # 或 prod build
./deploy.sh test up      # 或 prod up
```

#### 2. 使用 rsync（适合个人开发快速更新）

**优点**：
- 增量同步，只传输变化的文件
- 速度快，带宽占用小
- 可以排除不需要的文件（缓存、依赖等）
- 适合频繁小改动

**使用场景**：当你还没有搭建 Git 仓库，或者只是本地测试

```bash
# 在本地执行 - 快速同步到服务器
rsync -avz --delete \
  --exclude='.git' \
  --exclude='__pycache__' \
  --exclude='*.pyc' \
  --exclude='node_modules' \
  --exclude='backups' \
  --exclude='*.log' \
  --exclude='.env.prod' \
  sniper-yolo-backend/ root@your-server-ip:/root/sniper-yolo-backend/

# 然后登录服务器重启服务
ssh root@your-server-ip "cd /root/sniper-yolo-backend && ./deploy.sh test up"
```

#### 3. 完整的更新脚本（一键部署）

创建一个本地脚本 `deploy-to-server.sh`：

```bash
#!/bin/bash

SERVER="root@your-server-ip"
REMOTE_PATH="/root/sniper-yolo-backend"
ENV="test"  # 或 prod

echo "🚀 开始部署到 $ENV 环境..."

# 1. 使用 rsync 同步代码
rsync -avz --delete \
  --exclude='.git' \
  --exclude='__pycache__' \
  --exclude='*.pyc' \
  --exclude='node_modules' \
  --exclude='backups' \
  --exclude='*.log' \
  --exclude='.env.prod' \
  . $SERVER:$REMOTE_PATH/

# 2. 在服务器上重新构建和启动
ssh $SERVER "cd $REMOTE_PATH && ./deploy.sh $ENV build && ./deploy.sh $ENV up"

echo "✅ 部署完成！"
```

使用方式：
```bash
chmod +x deploy-to-server.sh
./deploy-to-server.sh
```

### 什么时候需要重新构建镜像？

| 改动类型 | 是否需要 build | 是否需要 restart |
|---------|---------------|-----------------|
| Python 代码改动 | ✅ 需要 | ✅ 需要 |
| 依赖改动 (requirements.txt) | ✅ 需要 | ✅ 需要 |
| 环境变量改动 (.env.*) | ❌ 不需要 | ✅ 需要 |
| Nginx 配置改动 | ❌ 不需要 | ✅ 需要 (只需重启 nginx) |
| 数据库迁移 | ❌ 不需要 | ✅ 需要 |

**快速重启（不重新构建镜像）**：
```bash
# 修改配置文件后
./deploy.sh test down
./deploy.sh test up

# 或者使用 restart
./deploy.sh test restart
```

## 常用命令

```bash
# 测试环境
./deploy.sh test logs      # 查看日志
./deploy.sh test restart   # 重启服务
./deploy.sh test backup    # 备份数据库

# 生产环境
./deploy.sh prod logs      # 查看日志
./deploy.sh prod restart   # 重启服务
./deploy.sh prod backup    # 备份数据库
./deploy.sh prod ssl       # 配置 SSL 证书
```

## 重要提醒

### 生产环境配置

⚠️ **部署前必须修改以下配置**：

1. **修改 .env.prod 中的敏感信息**
   ```bash
   vim .env.prod

   # 必须修改：
   SECRET_KEY=your-strong-secret-key-here
   DATABASE_PASSWORD=your-strong-password-here
   ```

2. **修改 CORS 域名**
   ```bash
   # 将域名改为你实际的域名
   BACKEND_CORS_ORIGINS=["https://your-domain.com"]
   ```

3. **配置防火墙**
   ```bash
   # 火山引擎控制台安全组规则
   - 22  (SSH)
   - 80  (HTTP)
   - 443 (HTTPS)
   - 8000 (API - 可选，直接访问)
   ```

### 安全建议

- ✅ 使用强密码（至少 16 位，包含大小写字母、数字、特殊字符）
- ✅ 启用 HTTPS（使用 `./deploy.sh prod ssl`）
- ✅ 定期备份数据库（使用 `./deploy.sh prod backup`）
- ✅ 限制 API 访问频率（已在 Nginx 中配置）
- ✅ 定期更新系统和依赖

### 备份

```bash
# 手动备份
./deploy.sh prod backup

# 备份文件位置
ls -lh backups/postgres/
```

## 需要帮助？

- 📖 完整文档: `cat DEPLOYMENT.md`
- ✅ 检查清单: `cat DEPLOYMENT_CHECKLIST.md`
- 🐛 问题排查: 查看 DEPLOYMENT.md 中的故障排查章节

---

**环境配置**:
- 测试环境: 用于开发测试，可以经常重启重建
- 生产环境: 用于线上服务，需要高可用和备份

**端口说明**:
- 生产环境使用标准端口 (80/443/8000)
- 测试环境使用非标准端口 (8002/8081/5434/6381) 避免冲突
