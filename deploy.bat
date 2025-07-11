@echo off
setlocal enabledelayedexpansion

:: PhotoGrid Pro 部署脚本 (Windows版本)
:: 使用方法: deploy.bat

echo [INFO] 开始部署 PhotoGrid Pro...

:: 检查Docker是否安装
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker未安装，请先安装Docker Desktop
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose未安装，请先安装Docker Compose
    pause
    exit /b 1
)

:: 生成时间戳
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do (
    set "date=%%d%%b%%c"
)
for /f "tokens=1-2 delims=: " %%a in ('time /t') do (
    set "time=%%a%%b"
)
set "timestamp=%date%-%time%"
set "timestamp=%timestamp: =0%"

:: 设置镜像标签
set "IMAGE_TAG=photogrid-pro:%timestamp%"
set "LATEST_TAG=photogrid-pro:latest"

:: 构建镜像
echo [INFO] 开始构建Docker镜像...
docker build -t %IMAGE_TAG% -t %LATEST_TAG% .
if errorlevel 1 (
    echo [ERROR] 镜像构建失败
    pause
    exit /b 1
)
echo [SUCCESS] 镜像构建成功: %IMAGE_TAG%

:: 停止现有容器
echo [INFO] 停止现有容器...
docker-compose down

:: 启动容器
echo [INFO] 启动容器...
docker-compose up -d
if errorlevel 1 (
    echo [ERROR] 容器启动失败
    pause
    exit /b 1
)
echo [SUCCESS] 容器启动成功

:: 等待应用启动
echo [INFO] 等待应用启动...
timeout /t 10 /nobreak >nul

:: 检查容器状态
docker-compose ps | findstr "Up" >nul
if errorlevel 1 (
    echo [ERROR] 容器未正常运行
    docker-compose logs
    pause
    exit /b 1
)
echo [SUCCESS] 容器运行正常

:: 健康检查
echo [INFO] 检查HTTP响应...
for /l %%i in (1,1,10) do (
    curl -sf http://localhost:8080/health >nul 2>&1
    if not errorlevel 1 (
        echo [SUCCESS] 应用健康检查通过
        goto :health_ok
    )
    echo [WARNING] 健康检查失败，重试 %%i/10
    timeout /t 5 /nobreak >nul
)
echo [ERROR] 健康检查最终失败
pause
exit /b 1

:health_ok
:: 清理旧镜像
echo [INFO] 清理旧镜像...
docker image prune -f >nul

:: 显示部署信息
echo.
echo [SUCCESS] 部署完成！
echo.
echo 应用信息:
echo   - 访问地址: http://localhost:8080
echo   - 健康检查: http://localhost:8080/health
echo.
echo Docker命令:
echo   - 查看日志: docker-compose logs -f
echo   - 停止服务: docker-compose down
echo   - 重启服务: docker-compose restart
echo.
pause
