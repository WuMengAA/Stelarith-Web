@echo off
chcp 65001 >nul
title Stelarith · 本地自托管（方案 C）
cd /d "%~dp0"

echo ========================================
echo   Stelarith 星璃 · 本地自托管节点
echo   双重站点分流分压架构的本地侧
echo ========================================
echo.

rem ---- 定位 node（优先 .workbuddy / nvm / Program Files）----
set "NODE=node"
where node >nul 2>nul || (
    if exist "%USERPROFILE%\.workbuddy\binaries\node\versions\22.12.0\node-v22.12.0-win-x64\node.exe" set "NODE=%USERPROFILE%\.workbuddy\binaries\node\versions\22.12.0\node-v22.12.0-win-x64\node.exe"
)
"%NODE%" --version >nul 2>nul || (
    echo [错误] 未找到 node，请先安装 Node.js 22
    pause
    exit /b 1
)

echo [INFO] Node: %NODE%
echo.

rem ---- 构建（若 .output 缺失）----
if not exist ".output\server\index.mjs" (
    echo [INFO] 首次运行，正在构建本地模式...
    "%NODE%" scripts/selfhost.mjs build
    if errorlevel 1 (
        echo [错误] 构建失败
        pause
        exit /b 1
    )
)

echo [INFO] 启动本地站点（端口 3000）...
"%NODE%" scripts/selfhost.mjs start
echo.
echo [提示] 手机连同一 WiFi 后可用局域网地址访问
echo [提示] 停止服务请运行 stop-selfhost.bat
echo.
