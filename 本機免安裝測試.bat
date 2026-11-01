@echo off
chcp 65001 >nul
title J.WoodStudio - AI 員工辦公室 (Vercel 預覽模式)
echo ========================================================
echo   正在以本機 Web 服務預覽 J.WoodStudio 獨立辦公室...
echo ========================================================
echo.
echo 正在啟動輕量靜態服務...
cd /d "%~dp0"
npx --yes serve . -l 3000
pause
