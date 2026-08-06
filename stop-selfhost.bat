@echo off
chcp 65001 >nul
title Stelarith · 停止本地自托管
cd /d "%~dp0"
echo ========================================
echo   Stelarith · 停止本地自托管节点
echo ========================================
echo.
set "NODE=node"
where node >nul 2>nul || (
    if exist "%USERPROFILE%\.workbuddy\binaries\node\versions\22.12.0\node-v22.12.0-win-x64\node.exe" set "NODE=%USERPROFILE%\.workbuddy\binaries\node\versions\22.12.0\node-v22.12.0-win-x64\node.exe"
)
"%NODE%" scripts/selfhost.mjs stop
echo.
pause
