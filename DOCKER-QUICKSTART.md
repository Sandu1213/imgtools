# Docker 部署快速开始

## 一键部署

### Windows 用户
```cmd
deploy.bat
```

### Linux/macOS 用户
```bash
chmod +x deploy.sh
./deploy.sh
```

## 手动部署

```bash
# 构建并启动
docker-compose up -d

# 查看状态
docker-compose ps

# 访问应用
# http://localhost:8080
```

## 常用命令

```bash
# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart
```

## 文件说明

- `Dockerfile` - 镜像构建配置
- `docker-compose.yml` - 服务编排配置
- `nginx.conf` - Web服务器配置
- `deploy.sh/deploy.bat` - 自动部署脚本
