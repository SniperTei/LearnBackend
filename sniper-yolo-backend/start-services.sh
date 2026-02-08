#!/bin/bash
# 启动后端测试环境服务（连接到 sniper_test_network）

# 加载环境变量
if [ -f .env.test ]; then
  export $(cat .env.test | xargs)
fi

echo "🚀 启动 PostgreSQL..."
docker run -d \
  --name sniper_postgres_test \
  --network sniper_test_network \
  -e POSTGRES_USER=sniper \
  -e POSTGRES_PASSWORD=${DB_PASSWORD} \
  -e POSTGRES_DB=sniper_yolo_test \
  -e POSTGRES_INITDB_ARGS="--encoding=UTF-8 --locale=C" \
  -p 5434:5432 \
  -v postgres_data_test:/var/lib/postgresql/data \
  --restart unless-stopped \
  postgres:15-alpine

echo "⏳ 等待 PostgreSQL 启动..."
sleep 5

echo "🚀 启动 Redis..."
docker run -d \
  --name sniper_redis_test \
  --network sniper_test_network \
  -p 6381:6379 \
  -v redis_data_test:/data \
  --restart unless-stopped \
  redis:7-alpine \
  redis-server --appendonly yes

echo "✅ 所有服务已启动！"
echo ""
echo "📊 容器状态："
docker ps --filter "name=sniper_" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "🌐 网络信息："
docker network inspect sniper_test_network --format '{{range .Containers}}{{.Name}}: {{.IPv4Address}}{{"\n"}}{{end}}'
