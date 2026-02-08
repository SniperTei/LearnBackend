#!/bin/bash

# Sniper YOLO Backend 部署脚本
# 支持测试环境和生产环境的一键部署

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 检查 Docker 是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装，请先安装 Docker"
        echo "安装命令: curl -fsSL https://get.docker.com | sh"
        exit 1
    fi
    print_info "Docker 已安装: $(docker --version)"
}

# 检查 Docker Compose 是否安装
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
    if docker compose version &> /dev/null; then
        print_info "Docker Compose 已安装: $(docker compose version)"
        DOCKER_COMPOSE="docker compose"
    else
        print_info "Docker Compose 已安装: $(docker-compose --version)"
        DOCKER_COMPOSE="docker-compose"
    fi
}

# 显示使用说明
show_usage() {
    cat << EOF
╔═══════════════════════════════════════════════════════════════╗
║     Sniper YOLO Backend 部署脚本 v1.0                        ║
╚═══════════════════════════════════════════════════════════════╝

使用方法:
    $0 [ENVIRONMENT] [COMMAND]

ENVIRONMENT:
    test    测试环境 (端口: 8002)
    prod    生产环境 (端口: 8000)

COMMAND:
    build   构建 Docker 镜像
    up      启动所有服务
    down    停止所有服务
    restart 重启所有服务
    logs    查看服务日志 (实时)
    ps      查看服务运行状态
    clean   清理容器和数据（危险操作）
    migrate 运行数据库迁移
    backup  备份数据库
    ssl     生成 SSL 证书 (仅生产环境)

示例:
    $0 test build      # 构建测试环境镜像
    $0 prod up         # 启动生产环境
    $0 test logs       # 查看测试环境日志
    $0 prod backup     # 备份生产环境数据库

文档:
    快速开始: cat QUICKSTART.md
    完整文档: cat DEPLOYMENT.md
    检查清单: cat DEPLOYMENT_CHECKLIST.md

EOF
}

# 获取 compose 文件
get_compose_file() {
    local env=$1
    case $env in
        test)
            echo "docker-compose.test.yml"
            ;;
        prod)
            echo "docker-compose.prod.yml"
            ;;
        *)
            print_error "未知的环境: $env (支持: test, prod)"
            exit 1
            ;;
    esac
}

# 获取环境端口
get_env_port() {
    local env=$1
    case $env in
        test)
            echo "8002"
            ;;
        prod)
            echo "8000"
            ;;
    esac
}

# 构建镜像
build_image() {
    local env=$1
    local compose_file=$(get_compose_file $env)
    local port=$(get_env_port $env)

    print_step "构建 $env 环境镜像..."

    $DOCKER_COMPOSE -f $compose_file build --no-cache

    print_info "✅ 构建完成！"
    print_info "访问地址: http://localhost:$port"
}

# 启动服务
start_services() {
    local env=$1
    local compose_file=$(get_compose_file $env)
    local port=$(get_env_port $env)

    print_step "启动 $env 环境服务..."

    # 创建必要的目录
    mkdir -p nginx/logs/$env
    mkdir -p backups/postgres

    # 生产环境额外检查
    if [ "$env" = "prod" ]; then
        # 检查 SSL 证书
        if [ ! -f "nginx/ssl/fullchain.pem" ]; then
            print_warning "未检测到 SSL 证书，HTTP 将无法重定向到 HTTPS"
            print_info "如需配置 HTTPS，请运行: $0 prod ssl"
        fi
    fi

    # 启动服务
    $DOCKER_COMPOSE -f $compose_file up -d

    print_info "⏳ 等待服务启动..."
    sleep 30

    # 检查服务状态
    if $DOCKER_COMPOSE -f $compose_file ps | grep -q "Exit"; then
        print_error "部分服务启动失败，请查看日志"
        $DOCKER_COMPOSE -f $compose_file logs --tail=50
        exit 1
    fi

    print_info "✅ $env 环境服务已启动！"
    print_info "访问地址: http://localhost:$port"
}

# 停止服务
stop_services() {
    local env=$1
    local compose_file=$(get_compose_file $env)

    print_step "停止 $env 环境服务..."
    $DOCKER_COMPOSE -f $compose_file down

    print_info "✅ $env 环境服务已停止！"
}

# 重启服务
restart_services() {
    local env=$1
    print_step "重启 $env 环境服务..."
    stop_services $env
    start_services $env
}

# 查看日志
view_logs() {
    local env=$1
    local compose_file=$(get_compose_file $env)

    print_info "查看 $env 环境日志 (Ctrl+C 退出)..."
    $DOCKER_COMPOSE -f $compose_file logs -f
}

# 查看运行状态
show_status() {
    local env=$1
    local compose_file=$(get_compose_file $env)

    print_step "$env 环境运行状态:"
    echo ""
    $DOCKER_COMPOSE -f $compose_file ps
    echo ""

    # 显示健康检查
    local port=$(get_env_port $env)
    print_info "执行健康检查..."
    if curl -s http://localhost:$port/api/v1/health > /dev/null; then
        print_info "✅ API 服务正常"
    else
        print_warning "⚠️  API 服务可能未就绪"
    fi
}

# 清理环境
clean_environment() {
    local env=$1
    local compose_file=$(get_compose_file $env)

    print_warning "⚠️  警告：此操作将删除 $env 环境的所有容器和数据！"
    read -p "确定要继续吗？请输入 'yes' 确认: " confirm

    if [ "$confirm" != "yes" ]; then
        print_info "操作已取消"
        exit 0
    fi

    print_step "清理 $env 环境..."
    $DOCKER_COMPOSE -f $compose_file down -v

    # 删除日志
    rm -rf nginx/logs/$env/*

    print_info "✅ $env 环境清理完成！"
}

# 数据库迁移
run_migrations() {
    local env=$1
    local compose_file=$(get_compose_file $env)

    print_step "运行 $env 环境数据库迁移..."

    # 等待数据库就绪
    print_info "等待数据库启动..."
    sleep 10

    # 运行 Alembic 迁移
    if $DOCKER_COMPOSE -f $compose_file exec -T web alembic upgrade head; then
        print_info "✅ 数据库迁移完成！"
    else
        print_error "❌ 数据库迁移失败"
        exit 1
    fi
}

# 备份数据库
backup_database() {
    local env=$1
    local compose_file=$(get_compose_file $env)
    local backup_dir="backups/postgres"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local db_name="sniper_yolo${env}"

    print_step "备份 $env 环境数据库..."

    # 创建备份目录
    mkdir -p $backup_dir

    # 执行备份
    local db_container="sniper_postgres_${env}"
    if docker ps | grep -q $db_container; then
        docker exec $db_container pg_dump -U sniper $db_name > "$backup_dir/backup_${env}_${timestamp}.sql"

        if [ $? -eq 0 ]; then
            print_info "✅ 备份完成: $backup_dir/backup_${env}_${timestamp}.sql"

            # 压缩备份文件
            gzip "$backup_dir/backup_${env}_${timestamp}.sql"
            print_info "✅ 备份已压缩"
        else
            print_error "❌ 备份失败"
            exit 1
        fi
    else
        print_error "❌ 数据库容器未运行"
        exit 1
    fi
}

# 生成 SSL 证书 (使用 Let's Encrypt)
generate_ssl() {
    print_step "生成 SSL 证书..."

    # 检查是否安装 certbot
    if ! command -v certbot &> /dev/null; then
        print_error "certbot 未安装"
        echo "安装命令: sudo apt install certbot"
        exit 1
    fi

    # 获取域名
    read -p "请输入你的域名 (例如: api.sniper14.com): " domain

    if [ -z "$domain" ]; then
        print_error "域名不能为空"
        exit 1
    fi

    print_info "为域名 $domain 生成 SSL 证书..."

    # 生成证书
    sudo certbot certonly --standalone \
        -d $domain \
        --www-root /var/www/html \
        --email your@email.com \
        --agree-tos \
        --non-interactive

    if [ $? -eq 0 ]; then
        # 复制证书到 nginx 目录
        sudo mkdir -p nginx/ssl
        sudo cp /etc/letsencrypt/live/$domain/fullchain.pem nginx/ssl/
        sudo cp /etc/letsencrypt/live/$domain/privkey.pem nginx/ssl/
        sudo cp /etc/letsencrypt/live/$domain/chain.pem nginx/ssl/

        # 设置权限
        sudo chown -R $USER:$USER nginx/ssl
        sudo chmod 644 nginx/ssl/*.pem

        print_info "✅ SSL 证书生成成功！"
        print_info "证书路径: nginx/ssl/"

        # 重启 nginx 使证书生效
        read -p "是否现在重启 nginx？(yes/no): " restart
        if [ "$restart" = "yes" ]; then
            docker restart sniper_nginx_prod
        fi
    else
        print_error "❌ SSL 证书生成失败"
        exit 1
    fi
}

# 显示环境信息
show_env_info() {
    local env=$1
    local port=$(get_env_port $env)

    cat << EOF

╔═══════════════════════════════════════════════════════════════╗
║              $env 环境信息                                    ║
╠═══════════════════════════════════════════════════════════════╣
║  API 地址:     http://localhost:$port                         ║
║  Nginx 地址:   ${env} = "prod" ]] && echo "https://localhost" || echo "http://localhost:8081"}  ║
║  数据库:       PostgreSQL 5432                                ║
║  Redis:        Redis 6379                                      ║
╠═══════════════════════════════════════════════════════════════╣
║  常用命令:                                                  ║
║    查看日志:   $0 $env logs                                 ║
║    重启服务:   $0 $env restart                               ║
║    运行迁移:   $0 $env migrate                               ║
║    备份数据:   $0 $env backup                                ║
╚═══════════════════════════════════════════════════════════════╝

EOF
}

# 主函数
main() {
    if [ $# -lt 2 ]; then
        show_usage
        exit 1
    fi

    local env=$1
    local command=$2

    # 检查环境参数
    if [ "$env" != "test" ] && [ "$env" != "prod" ]; then
        print_error "无效的环境参数: $env (支持: test, prod)"
        show_usage
        exit 1
    fi

    # 检查 Docker
    check_docker
    check_docker_compose

    # 执行命令
    case $command in
        build)
            build_image $env
            show_env_info $env
            ;;
        up)
            start_services $env
            show_env_info $env
            ;;
        down)
            stop_services $env
            ;;
        restart)
            restart_services $env
            show_env_info $env
            ;;
        logs)
            view_logs $env
            ;;
        ps)
            show_status $env
            ;;
        clean)
            clean_environment $env
            ;;
        migrate)
            run_migrations $env
            ;;
        backup)
            backup_database $env
            ;;
        ssl)
            if [ "$env" = "prod" ]; then
                generate_ssl
            else
                print_error "SSL 证书仅用于生产环境"
                exit 1
            fi
            ;;
        info)
            show_env_info $env
            ;;
        *)
            print_error "未知命令: $command"
            show_usage
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@"
