# 构建参数，默认为生产环境
ARG ENVIRONMENT=production

# 第一阶段：构建环境
FROM python:3.11-slim-bookworm AS builder

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# 复制requirements.txt并安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 第二阶段：生产环境
FROM python:3.11-slim-bookworm AS production

WORKDIR /app

# 从构建阶段复制已安装的依赖
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# 复制项目代码
COPY . .

# 设置生产环境变量
ENV DEBUG=False

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["python3", "run.py"]

# 第三阶段：测试环境
FROM builder AS test

WORKDIR /app

# 复制项目代码
COPY . .

# 安装测试依赖（如果有单独的测试依赖文件）
# COPY requirements-test.txt .
# RUN pip install --no-cache-dir -r requirements-test.txt

# 设置测试环境变量
ENV DEBUG=True

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["python3", "run.py"]

# 根据构建参数选择最终镜像
FROM ${ENVIRONMENT}