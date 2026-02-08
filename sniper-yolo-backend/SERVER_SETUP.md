# 🚀 服务器部署指南

这个文档将指导你在火山引擎云服务器上部署 Sniper YOLO Backend 项目。

## 📋 前置要求

- 已安装 Docker 的云服务器
- 有 Git 仓库访问权限
- 服务器防火墙已配置（端口 22, 80, 443）

## 🎯 部署步骤

### 第一步：连接服务器

```bash
ssh root@your-server-ip
```

### 第二步：安装 Docker（如果未安装）

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 重新登录以使组权限生效
exit
ssh root@your-server-ip
```

### 第三步：选择部署目录并克隆代码

你可以选择以下任一目录部署项目：

**选项 1：使用 /opt/services（推荐）**
```bash
# 创建服务目录
mkdir -p /opt/services
cd /opt/services
git clone -b dev_zheng https://github.com/SniperTei/LearnBackend.git sniper-yolo-backend
cd sniper-yolo-backend
```

**选项 2：使用 /data/projects**
```bash
mkdir -p /data/projects
cd /data/projects
git clone -b dev_zheng https://github.com/SniperTei/LearnBackend.git sniper-yolo-backend
cd sniper-yolo-backend
```

**选项 3：使用 /srv**
```bash
mkdir -p /srv
cd /srv
git clone -b dev_zheng https://github.com/SniperTei/LearnBackend.git sniper-yolo-backend
cd sniper-yolo-backend
```

**选项 4：自定义目录**
```bash
mkdir -p /your/custom/path
cd /your/custom/path
git clone -b dev_zheng https://github.com/SniperTei/LearnBackend.git sniper-yolo-backend
cd sniper-yolo-backend
```

> **提示**：如果选择了非默认路径（/opt/services），在本地使用部署脚本时需要设置环境变量：
> ```bash
> export DEPLOY_PATH=/your/custom/path/sniper-yolo-backend
> ./git-deploy.sh
> ```

### 第四步：配置环境变量

#### 配置测试环境

```bash
# 测试环境可以使用默认配置
# 如果需要修改，可以编辑 .env.test
vim .env.test
```

#### 配置生产环境（重要！）

```bash
# 1. 复制示例配置
cp .env.prod.example .env.prod

# 2. 生成强密码和密钥
openssl rand -base64 64  # 用于 SECRET_KEY
openssl rand -base64 32  # 用于数据库密码

# 3. 编辑配置文件
vim .env.prod
```

**必须修改的配置项**：
```bash
SECRET_KEY=生成的64位随机字符串
DATABASE_URL=postgresql+asyncpg://sniper:生成的密码@postgres:5432/sniper_yolo
ALEMBIC_DATABASE_URL=postgresql+psycopg2://sniper:生成的密码@postgres:5432/sniper_yolo
BACKEND_CORS_ORIGINS=["https://your-domain.com"]
QINIU_ACCESS_KEY=你的七牛云密钥
QINIU_SECRET_KEY=你的七牛云密钥
```

### 第五步：部署测试环境

```bash
# 1. 构建镜像
./deploy.sh test build

# 2. 启动服务
./deploy.sh test up

# 3. 等待服务启动
sleep 30

# 4. 运行数据库迁移
./deploy.sh test migrate

# 5. 检查状态
./deploy.sh test ps
```

### 第六步：验证测试环境

```bash
# 检查健康状态
curl http://localhost:8002/api/v1/health

# 查看日志
./deploy.sh test logs
```

### 第七步：部署生产环境（可选）

```bash
# 1. 确认已配置 .env.prod
cat .env.prod | grep SECRET_KEY

# 2. 构建镜像
./deploy.sh prod build

# 3. 启动服务
./deploy.sh prod up

# 4. 等待服务启动
sleep 30

# 5. 运行数据库迁移
./deploy.sh prod migrate

# 6. 配置 SSL（可选但强烈推荐）
./deploy.sh prod ssl
```

### 第八步：配置防火墙

在火山引擎控制台配置安全组规则：

| 端口 | 协议 | 说明 |
|------|------|------|
| 22 | TCP | SSH |
| 80 | TCP | HTTP |
| 443 | TCP | HTTPS |

## 🔄 日常更新

### 方式一：手动更新

```bash
# 在服务器上执行（根据你选择的目录）
cd /opt/services/sniper-yolo-backend  # 或你使用的其他路径
git pull origin dev_zheng

# 如果有代码改动，重新构建
./deploy.sh test build && ./deploy.sh test up

# 如果只是配置改动，只需重启
./deploy.sh test restart
```

### 方式二：使用本地脚本

在你的本地开发机器上：

```bash
# 1. 配置环境变量（首次使用）
export DEPLOY_SERVER=root@your-server-ip
export DEPLOY_ENV=test

# 2. 部署
./git-deploy.sh
```

## 📊 环境对比

| 配置项 | 测试环境 | 生产环境 |
|--------|---------|---------|
| **分支** | dev_zheng | dev_zheng/main |
| **API 端口** | 8002 | 8000 |
| **数据库** | sniper_yolo_test | sniper_yolo |
| **PostgreSQL 端口** | 5434 | 5432 |
| **Redis 端口** | 6381 | 6379 |
| **Nginx 端口** | 8081 | 80/443 |
| **DEBUG** | true | false |
| **SSL** | 否 | 是 |

## 🛠️ 常用命令

```bash
# 查看服务状态
./deploy.sh test ps
./deploy.sh prod ps

# 查看日志
./deploy.sh test logs
./deploy.sh prod logs

# 重启服务
./deploy.sh test restart
./deploy.sh prod restart

# 停止服务
./deploy.sh test down
./deploy.sh prod down

# 备份数据库
./deploy.sh test backup
./deploy.sh prod backup

# 运行迁移
./deploy.sh test migrate
./deploy.sh prod migrate
```

## 🔧 故障排查

### 问题 1：容器启动失败

```bash
# 查看详细日志
./deploy.sh test logs

# 检查容器状态
docker ps -a

# 重新构建
./deploy.sh test build
```

### 问题 2：数据库连接失败

```bash
# 检查数据库是否就绪
docker exec sniper_postgres_test pg_isready -U sniper

# 查看数据库日志
docker logs sniper_postgres_test
```

### 问题 3：端口冲突

```bash
# 查看端口占用
netstat -tulpn | grep :8002

# 停止占用端口的服务
./deploy.sh test down
```

## 📞 获取帮助

- 查看快速开始: `cat QUICKSTART.md`
- 查看完整文档: `cat DEPLOYMENT.md`
- 查看检查清单: `cat DEPLOYMENT_CHECKLIST.md`

## ⚠️ 安全提醒

1. **修改默认密码**：`.env.prod` 中的所有密码都必须修改
2. **启用 HTTPS**：生产环境务必配置 SSL 证书
3. **定期备份**：使用 `./deploy.sh prod backup` 定期备份数据库
4. **限制访问**：配置防火墙，只开放必要的端口
5. **更新系统**：定期更新系统和 Docker 版本

---

**部署完成后记得测试**：
```bash
curl http://localhost:8002/api/v1/health
curl https://your-domain.com/api/v1/health
```
