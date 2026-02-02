@echo off
setlocal
echo ==========================================
echo 🛠️ ROB IDE: PUSHING DEPLOYMENT FINAL FIX
echo ==========================================
echo.

:: 1. Verification
echo [1/3] Verifying Hotfix...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ❌ LOCAL BUILD FAILED. Check your code.
    pause
    exit /b %errorlevel%
)
echo ✅ Verification Passed.

:: 2. Git Commit
echo [2/3] Preparing Sync...
git add .
git commit -m "fix: total rebuild of runtime sandbox for robust functional architecture"
echo ✅ Commit ready.

:: 3. GitHub Push
echo [3/3] Finalizing GitHub Remote...
set /p PAT="Enter your GitHub Token (ghp_): "

if "%PAT%"=="" (
    echo ❌ Token cannot be empty.
    pause
    exit /b 1
)

git remote remove origin >nul 2>&1
echo 🚀 Launching functional fix...
git push https://hilyte870:%PAT%@github.com/hilyte870/rob-the-builder.git main --force

if %errorlevel% neq 0 (
    echo.
    echo ❌ PUSH FAILED.
    pause
    exit /b %errorlevel%
)
echo ✅ DEPLOYMENT SUCCESSFUL.

echo.
echo ==========================================
echo 🌟 MISSION SUCCESS: REFRESH VERCEL IN 60S
echo ==========================================
pause
