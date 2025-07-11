#!/bin/bash

# PhotoGrid Pro 部署脚本
# 使用方法: ./deploy.sh [环境]
# 环境选项: dev, staging, prod

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数定义
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查Docker是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装，请先安装Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose未安装，请先安装Docker Compose"
        exit 1
    fi
}

# 构建镜像
build_image() {
    log_info "开始构建Docker镜像..."
    
    # 设置镜像标签
    IMAGE_TAG="photogrid-pro:$(date +%Y%m%d-%H%M%S)"
    LATEST_TAG="photogrid-pro:latest"
    
    # 构建镜像
    docker build -t $IMAGE_TAG -t $LATEST_TAG .
    
    if [ $? -eq 0 ]; then
        log_success "镜像构建成功: $IMAGE_TAG"
    else
        log_error "镜像构建失败"
        exit 1
    fi
}

# 停止现有容器
stop_container() {
    log_info "停止现有容器..."
    docker-compose down || true
}

# 启动容器
start_container() {
    log_info "启动容器..."
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        log_success "容器启动成功"
    else
        log_error "容器启动失败"
        exit 1
    fi
}

# 健康检查
health_check() {
    log_info "等待应用启动..."
    sleep 10
    
    # 检查容器是否运行
    if docker-compose ps | grep -q "Up"; then
        log_success "容器运行正常"
    else
        log_error "容器未正常运行"
        docker-compose logs
        exit 1
    fi
    
    # 检查HTTP响应
    log_info "检查HTTP响应..."
    for i in {1..10}; do
        if curl -sf http://localhost:8080/health > /dev/null; then
            log_success "应用健康检查通过"
            break
        else
            log_warning "健康检查失败，重试 $i/10"
            sleep 5
        fi
        
        if [ $i -eq 10 ]; then
            log_error "健康检查最终失败"
            exit 1
        fi
    done
}

# 清理旧镜像
cleanup() {
    log_info "清理旧镜像..."
    docker image prune -f
}

# 显示部署信息
show_info() {
    log_success "部署完成！"
    echo ""
    echo "应用信息:"
    echo "  - 访问地址: http://localhost:8080"
    echo "  - 健康检查: http://localhost:8080/health"
    echo ""
    echo "Docker命令:"
    echo "  - 查看日志: docker-compose logs -f"
    echo "  - 停止服务: docker-compose down"
    echo "  - 重启服务: docker-compose restart"
    echo ""
}

# 主函数
main() {
    log_info "开始部署 PhotoGrid Pro..."
    
    # 检查环境
    check_docker
    
    # 构建和部署
    build_image
    stop_container
    start_container
    health_check
    cleanup
    show_info
}

# 执行主函数
main "$@"
