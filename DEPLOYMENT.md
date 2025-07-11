# PhotoGrid Pro 部署指南

## 部署文件说明

### 核心文件
- `Dockerfile` - Docker镜像构建文件
- `docker-compose.yml` - Docker Compose配置文件
- `nginx.conf` - Nginx服务器配置文件
- `.dockerignore` - Docker构建忽略文件

### 部署脚本
- `deploy.sh` - Linux/macOS部署脚本
- `deploy.bat` - Windows部署脚本

## 快速部署

### 方法1：使用部署脚本（推荐）

#### Linux/macOS:
```bash
# 赋予执行权限
chmod +x deploy.sh

# 执行部署
./deploy.sh
```

#### Windows:
```cmd
# 直接运行
deploy.bat
```

### 方法2：手动部署

```bash
# 1. 构建镜像
docker build -t photogrid-pro .

# 2. 启动服务
docker-compose up -d

# 3. 查看状态
docker-compose ps

# 4. 查看日志
docker-compose logs -f
```

## 访问应用

- **应用地址**: http://localhost:8080
- **健康检查**: http://localhost:8080/health

## 常用命令

### 容器管理
```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f

# 查看容器状态
docker-compose ps
```

### 镜像管理
```bash
# 查看镜像
docker images

# 清理未使用的镜像
docker image prune -f

# 删除特定镜像
docker rmi photogrid-pro:latest
```

## 生产环境部署建议

### 1. 使用环境变量
```bash
# 设置环境变量
export NODE_ENV=production
export PORT=8080

# 或者在docker-compose.yml中设置
environment:
  - NODE_ENV=production
  - PORT=8080
```

### 2. 使用HTTPS
```bash
# 添加SSL证书
- ./certs:/etc/nginx/certs

# 配置SSL
server {
    listen 443 ssl;
    ssl_certificate /etc/nginx/certs/cert.pem;
    ssl_certificate_key /etc/nginx/certs/key.pem;
}
```

### 3. 设置资源限制
```yaml
# docker-compose.yml
services:
  photogrid-pro:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 4. 配置日志
```yaml
# docker-compose.yml
services:
  photogrid-pro:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## 性能优化

### Nginx配置优化
- 启用gzip压缩
- 设置静态文件缓存
- 配置HTTP/2支持

### Docker镜像优化
- 使用多阶段构建
- 使用Alpine Linux基础镜像
- 清理不必要的文件

## 监控和维护

### 健康检查
```bash
# 检查应用健康状态
curl http://localhost:8080/health

# 检查容器健康状态
docker-compose ps
```

### 日志监控
```bash
# 实时查看日志
docker-compose logs -f

# 查看特定时间的日志
docker-compose logs --since="2024-01-01T00:00:00" --until="2024-01-02T00:00:00"
```

### 备份和恢复
```bash
# 备份镜像
docker save photogrid-pro:latest > photogrid-pro-backup.tar

# 恢复镜像
docker load < photogrid-pro-backup.tar
```

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查看端口占用
   netstat -an | grep :8080
   
   # 修改端口
   # 在docker-compose.yml中修改ports配置
   ```

2. **容器无法启动**
   ```bash
   # 查看详细日志
   docker-compose logs
   
   # 检查镜像是否存在
   docker images
   ```

3. **应用访问502错误**
   ```bash
   # 检查Nginx配置
   docker-compose exec photogrid-pro nginx -t
   
   # 重启服务
   docker-compose restart
   ```

## 更新部署

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建和部署
./deploy.sh

# 或者手动更新
docker-compose down
docker build -t photogrid-pro .
docker-compose up -d
```

## 卸载

```bash
# 停止并删除容器
docker-compose down

# 删除镜像
docker rmi photogrid-pro:latest

# 清理所有未使用的资源
docker system prune -a
```
