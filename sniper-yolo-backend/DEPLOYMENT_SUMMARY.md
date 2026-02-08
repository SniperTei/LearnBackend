# 📦 部署配置完成总结

## ✅ 已创建的文件

### Docker 配置
- ✅ `Dockerfile` - 优化的 Docker 镜像构建配置
- ✅ `docker-compose.test.yml` - 测试环境配置
- ✅ `docker-compose.prod.yml` - 生产环境配置

### 环境变量
- ✅ `.env.test` - 测试环境变量
- ✅ `.env.prod` - 生产环境变量（需修改密钥和密码）

### Nginx 配置
- ✅ `nginx/nginx.test.conf` - 测试环境反向代理
- ✅ `nginx/nginx.prod.conf` - 生产环境反向代理（含SSL和安全配置）
- ✅ `nginx/ssl/` - SSL 证书目录
- ✅ `nginx/logs/` - 日志目录

### 脚本和工具
- ✅ `deploy.sh` - 一键部署脚本（支持 test/prod）
- ✅ `scripts/init-db.sql` - 数据库初始化脚本

### 文档
- ✅ `QUICKSTART.md` - 快速开始指南
- ✅ `DEPLOYMENT.md` - 完整部署文档
- ✅ `DEPLOYMENT_CHECKLIST.md` - 部署检查清单

## 🎯 环境对比

| 项目 | 测试环境 | 生产环境 |
|------|---------|---------|
| **用途** | 开发测试 | 线上服务 |
| **API端口** | 8002 | 8000 |
| **Nginx端口** | 8081 | 80/443 |
| **数据库** | sniper_yolo_test | sniper_yolo |
| **PostgreSQL端口** | 5434 | 5432 |
| **Redis端口** | 6381 | 6379 |
| **DEBUG** | true | false |
| **SSL** | 否 | 是 |
| **限流** | 基础 | 严格 |
| **日志级别** | 详细 | 生产 |

## 🔄 代码更新和部署

### 推荐方案对比

| 方案 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| **Git** | 团队协作、正式部署 | 版本控制、可回滚、分支管理 | 需要搭建 Git 仓库 |
| **rsync** | 个人开发、快速迭代 | 增量同步、速度快、灵活 | 无版本控制 |
| **一键脚本** | 日常开发更新 | 自动化、方便 | 需要额外配置 |

### 方案一：使用 Git（推荐）

**首次部署**：
```bash
# 在服务器上执行
cd /root
git clone https://github.com/your-username/sniper-yolo-backend.git
cd sniper-yolo-backend
```

**日常更新**：
```bash
# 本地提交
git add .
git commit -m "描述改动"
git push origin main

# 服务器更新
ssh root@your-server-ip
cd /root/sniper-yolo-backend
git pull origin main
./deploy.sh test build && ./deploy.sh test up
```

### 方案二：使用一键部署脚本（最方便）

```bash
# 首次使用 - 配置服务器地址
export DEPLOY_SERVER=root@your-server-ip
export DEPLOY_ENV=test

# 完整部署（重新构建镜像）
./deploy-to-server.sh

# 快速部署（不重新构建）
./deploy-to-server.sh quick

# 仅同步代码
./deploy-to-server.sh sync
```

### 什么时候需要重新构建？

| 改动类型 | 需要 build | 需要 restart |
|---------|-----------|-------------|
| Python 代码 | ✅ | ✅ |
| requirements.txt | ✅ | ✅ |
| 环境变量 (.env.*) | ❌ | ✅ |
| Nginx 配置 | ❌ | ✅ |
| 数据库迁移 | ❌ | ✅ |

**配置文件修改后快速重启**：
```bash
./deploy.sh test down && ./deploy.sh test up
```

## 🚀 快速部署

### 测试环境
```bash
./deploy.sh test build
./deploy.sh test up
sleep 30
./deploy.sh test migrate
```

### 生产环境
```bash
# 1. 修改配置
vim .env.prod  # 修改 SECRET_KEY 和密码

# 2. 部署
./deploy.sh prod build
./deploy.sh prod up
sleep 30
./deploy.sh prod migrate

# 3. 配置SSL（可选）
./deploy.sh prod ssl
```

## ⚠️ 重要提醒

### 部署前必做

1. **修改 .env.prod 密钥**
   ```bash
   SECRET_KEY=生成一个64位的随机字符串
   DATABASE_PASSWORD=设置强密码
   ```

2. **配置防火墙**
   ```
   火山引擎安全组：
   - SSH: 22
   - HTTP: 80
   - HTTPS: 443
   ```

3. **修改域名**
   ```bash
   # .env.prod 和 nginx/nginx.prod.conf
   # 将域名改为你的实际域名
   ```

### 安全配置

- ✅ 已配置 Nginx 限流
- ✅ 已配置安全响应头
- ✅ 已配置日志轮转
- ✅ 已配置健康检查
- ⚠️ **需手动配置 SSL 证书**

## 📋 部署检查清单

- [ ] 服务器已准备
- [ ] Docker 已安装
- [ ] 代码已上传
- [ ] .env.prod 已配置
- [ ] 防火墙已配置
- [ ] 测试环境已部署
- [ ] 生产环境已部署
- [ ] 数据库迁移已完成
- [ ] SSL 证书已配置（生产）
- [ ] 备份策略已设置

## 🛠️ 常用命令

```bash
# 查看状态
./deploy.sh test ps
./deploy.sh prod ps

# 查看日志
./deploy.sh test logs
./deploy.sh prod logs

# 重启服务
./deploy.sh test restart
./deploy.sh prod restart

# 备份数据库
./deploy.sh prod backup

# 运行迁移
./deploy.sh test migrate
./deploy.sh prod migrate
```

## 📖 相关文档

- 快速开始: `cat QUICKSTART.md`
- 完整文档: `cat DEPLOYMENT.md`
- 检查清单: `cat DEPLOYMENT_CHECKLIST.md`

---

**下一步**: 阅读 `QUICKSTART.md` 开始部署！
