#!/bin/bash
set -e

echo "=== Sniper YOLO Backend Entrypoint ==="

# 等待数据库就绪
echo "[1/3] 等待数据库就绪..."
until python3 -c "
import psycopg2, os
url = os.getenv('ALEMBIC_DATABASE_URL', '').replace('+psycopg2', '')
conn = psycopg2.connect(url)
conn.close()
" 2>/dev/null; do
    sleep 1
done
echo "  数据库已就绪"

# 执行数据库迁移
echo "[2/3] 执行 Alembic 数据库迁移..."
alembic upgrade head
echo "  迁移完成"

# 启动应用（连库 + 创建超管 + 启动服务）
echo "[3/3] 启动应用..."
exec python3 run.py
