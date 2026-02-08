#!/bin/bash

# Sniper YOLO Backend - 本地部署到服务器脚本
# 这个脚本会自动同步代码并部署到远程服务器

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

# 默认配置
SERVER="${DEPLOY_SERVER:-root@your-server-ip}"
REMOTE_PATH="${DEPLOY_PATH:-/root/sniper-yolo-backend}"
ENV="${DEPLOY_ENV:-test}"

# 显示使用说明
show_usage() {
    cat << EOF
╔═══════════════════════════════════════════════════════════════╗
║     Sniper YOLO Backend - 本地部署脚本 v1.0                  ║
╚═══════════════════════════════════════════════════════════════╝

使用方法:
    $0 [OPTIONS] [COMMAND]

OPTIONS:
    -s, --server SERVER     服务器地址 (默认: root@your-server-ip)
    -p, --path PATH         远程路径 (默认: /root/sniper-yolo-backend)
    -e, --env ENV           环境: test 或 prod (默认: test)
    -h, --help              显示此帮助信息

COMMAND:
    sync        仅同步代码，不部署
    deploy      同步代码并部署 (默认)
    quick       快速部署 - 不重新构建镜像
    restart     重启远程服务

环境变量:
    DEPLOY_SERVER     服务器地址
    DEPLOY_PATH       远程路径
    DEPLOY_ENV        环境 (test/prod)

示例:
    # 部署到测试环境
    $0

    # 部署到生产环境
    $0 -e prod

    # 使用自定义服务器
    $0 -s root@192.168.1.100 -e prod

    # 仅同步代码
    $0 sync

    # 快速部署（不重新构建）
    $0 quick

    # 使用环境变量
    export DEPLOY_SERVER=root@your-server-ip
    export DEPLOY_ENV=prod
    $0

EOF
}

# 解析命令行参数
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -s|--server)
                SERVER="$2"
                shift 2
                ;;
            -p|--path)
                REMOTE_PATH="$2"
                shift 2
                ;;
            -e|--env)
                ENV="$2"
                shift 2
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            sync|deploy|quick|restart)
                COMMAND="$1"
                shift
                ;;
            *)
                print_error "未知参数: $1"
                show_usage
                exit 1
                ;;
        esac
    done

    # 默认命令是 deploy
    COMMAND="${COMMAND:-deploy}"

    # 验证环境参数
    if [ "$ENV" != "test" ] && [ "$ENV" != "prod" ]; then
        print_error "无效的环境: $env (支持: test, prod)"
        exit 1
    fi
}

# 检查服务器连接
check_connection() {
    print_step "检查服务器连接..."

    if ! ssh -o ConnectTimeout=5 $SERVER "echo > /dev/null" 2>&1; then
        print_error "无法连接到服务器: $SERVER"
        echo ""
        echo "请检查："
        echo "1. 服务器地址是否正确"
        echo "2. 是否已配置 SSH 密钥或密码"
        echo "3. 网络连接是否正常"
        echo ""
        echo "配置示例："
        echo "  $0 -s root@your-server-ip"
        exit 1
    fi

    print_info "✅ 服务器连接正常"
}

# 同步代码到服务器
sync_code() {
    print_step "同步代码到服务器 ($ENV 环境)..."

    # 显示配置信息
    echo ""
    echo "📋 部署配置:"
    echo "  服务器: $SERVER"
    echo "  路径:   $REMOTE_PATH"
    echo "  环境:   $ENV"
    echo ""

    # 使用 rsync 同步代码
    rsync -avz --delete \
        --exclude='.git' \
        --exclude='__pycache__' \
        --exclude='*.pyc' \
        --exclude='node_modules' \
        --exclude='backups' \
        --exclude='*.log' \
        --exclude='.env.prod' \
        --exclude='deploy-to-server.sh' \
        . $SERVER:$REMOTE_PATH/

    if [ $? -eq 0 ]; then
        print_info "✅ 代码同步完成"
    else
        print_error "❌ 代码同步失败"
        exit 1
    fi
}

# 部署到远程服务器
deploy_remote() {
    print_step "在远程服务器上部署 $ENV 环境..."

    ssh $SERVER "cd $REMOTE_PATH && ./deploy.sh $ENV build && ./deploy.sh $ENV up"

    if [ $? -eq 0 ]; then
        print_info "✅ 部署完成！"
    else
        print_error "❌ 部署失败"
        exit 1
    fi
}

# 快速部署（不重新构建）
deploy_quick() {
    print_step "快速部署 $ENV 环境（不重新构建镜像）..."

    ssh $SERVER "cd $REMOTE_PATH && ./deploy.sh $ENV down && ./deploy.sh $ENV up"

    if [ $? -eq 0 ]; then
        print_info "✅ 快速部署完成！"
    else
        print_error "❌ 部署失败"
        exit 1
    fi
}

# 重启远程服务
restart_remote() {
    print_step "重启 $ENV 环境服务..."

    ssh $SERVER "cd $REMOTE_PATH && ./deploy.sh $ENV restart"

    if [ $? -eq 0 ]; then
        print_info "✅ 服务重启完成！"
    else
        print_error "❌ 重启失败"
        exit 1
    fi
}

# 显示部署后信息
show_post_deploy_info() {
    local port=$( [ "$ENV" = "prod" ] && echo "8000" || echo "8002" )

    cat << EOF

╔═══════════════════════════════════════════════════════════════╗
║                  部署成功！                                    ║
╠═══════════════════════════════════════════════════════════════╣
║  环境:         $ENV                                          ║
║  服务器:       $SERVER                                 ║
║  API 地址:     http://your-server-ip:$port                   ║
║                                                                  ║
║  下一步:                                                          ║
║    1. 检查服务状态:  ssh $SERVER "cd $REMOTE_PATH && ./deploy.sh $ENV ps"     ║
║    2. 查看日志:      ssh $SERVER "cd $REMOTE_PATH && ./deploy.sh $ENV logs"    ║
║    3. 测试 API:      curl http://your-server-ip:$port/api/v1/health             ║
╚═══════════════════════════════════════════════════════════════╝

EOF
}

# 主函数
main() {
    echo ""
    parse_args "$@"
    check_connection

    case $COMMAND in
        sync)
            sync_code
            print_info "✅ 代码同步完成（未部署）"
            ;;
        deploy)
            sync_code
            deploy_remote
            show_post_deploy_info
            ;;
        quick)
            sync_code
            deploy_quick
            show_post_deploy_info
            ;;
        restart)
            restart_remote
            show_post_deploy_info
            ;;
    esac
}

# 运行主函数
main "$@"
