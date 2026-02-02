@echo off
setlocal
echo ==========================================
echo 🛠️ ROB IDE: PRECISION HOTFIX V3.1
echo ==========================================
echo.

:: 1. Verification Build
echo [1/4] Verifying Hotfix...
call npm install
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ❌ BUILD FAILED: Hotfix verification failed locally.
    pause
    exit b %errorlevel%
)
echo ✅ Engine Hotfix Verified.

:: 2. Git Sync
echo [2/4] Syncing Runtime Hotfix...
git add .
git commit -m "fix: resolve white screen by fixing sandbox icon injection and adding error boundaries"
echo ✅ Runtime synced.

:: 3. GitHub Push
echo [3/4] Connecting to GitHub...
set /p PAT="Enter your GitHub Token (Starts with ghp_): "

if "%PAT%"=="" (
    echo ❌ Token cannot be empty.
    pause
    exit /b 1
)

git remote remove origin >nul 2>&1
echo 🚀 Launching precision fix...
git push https://hilyte870:%PAT%@github.com/hilyte870/rob-the-builder.git main --force

if %errorlevel% neq 0 (
    echo.
    echo ❌ PUSH FAILED: Check your PAT permissions.
    pause
    exit /b %errorlevel%
)
echo ✅ Fix Deployed Successfully.

:: 4. Finalization
echo [4/4] Cloud Update Finalized.
echo ^> Refresh Vercel in 60 seconds.
echo.
echo ==========================================
pause
