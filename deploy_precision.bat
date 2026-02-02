@echo off
setlocal
echo ==========================================
echo 💎 ROB IDE: ABSOLUTE LAUNCH (v3.4)
echo ==========================================
echo.

:: 1. Build
echo [1/3] Final Code Sealing...
call npm run build
if %errorlevel% neq 0 ( exit /b 1 )

:: 2. Sync
git add .
git commit -m "fix: implement zero-transpile htm runtime for 100% stable execution"

:: 3. Push
echo [2/3] Bypassing Authentication...
set /p PAT="Enter Token: "
if "%PAT%"=="" ( exit /b 1 )

git remote remove origin >nul 2>&1
git push https://hilyte870:%PAT%@github.com/hilyte870/rob-the-builder.git main --force

if %errorlevel% equ 0 (
    echo.
    echo ✅ DEPLOYMENT COMPLETE.
    echo 🚀 Vercel will finish in 60 seconds.
) else (
    echo.
    echo ❌ PUSH FAILED.
)
pause
