#!/bin/bash

# JWT配置
export JWT_SECRET="PROD_SECRET_JYP_0421_LOVE"

# 管理员配置
export ADMIN_PASSWORD="your_admin_password_here"

# MongoDB配置
export MONGO_INITDB_ROOT_USERNAME="admin"
export MONGO_INITDB_ROOT_PASSWORD="your_mongodb_password_here"

# 显示设置的变量（不显示密码）
echo "Production environment variables set:"
echo "JWT_SECRET=${JWT_SECRET}"
echo "MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME}"
echo "ADMIN_PASSWORD=********"
echo "MONGO_INITDB_ROOT_PASSWORD=********"

echo "Environment variables have been set. You can now run: ./deploy.sh"
