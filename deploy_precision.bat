@echo off
setlocal
echo ==========================================
echo 🛠️ ROB IDE: PRECISION DEPLOYMENT V3
echo ==========================================
echo.

:: 1. Force Clean Git State
echo [1/5] Cleaning Repository...
if exist vercel.json del /f /q vercel.json
echo ✅ Repository cleaned.

:: 2. Verification Build
echo [2/5] Verifying "Rob IDE" Build...
call npm install
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ❌ BUILD FAILED: IDE verification failed locally.
    pause
    exit /b %errorlevel%
)
echo ✅ IDE Engine Verified.

:: 3. Git Fix
echo [3/5] Syncing IDE Workspace...
if not exist .git (
    git init
)
git add .
git commit -m "feat: upgrade to Rob IDE 3.0 - Professional Functional Engine"
echo ✅ Workspace synced.

:: 4. GitHub Push
echo [4/5] Connecting to GitHub...
set /p PAT="Enter your GitHub Personal Access Token (ghp_): "

if "%PAT%"=="" (
    echo ❌ Token cannot be empty.
    pause
    exit /b 1
)

git remote remove origin >nul 2>&1
echo 🚀 Launching functional payload...
git push https://hilyte870:%PAT%@github.com/hilyte870/rob-the-builder.git main --force

if %errorlevel% neq 0 (
    echo.
    echo ❌ PUSH FAILED: Check your PAT or repository settings.
    pause
    exit /b %errorlevel%
)
echo ✅ Push Successful.

:: 5. Deployment Finalization
echo [5/5] Finalizing Cloud Launch...
echo ^> Check GitHub: https://github.com/hilyte870/rob-the-builder
echo ^> Check Vercel: https://vercel.com/hilyte870/rob-the-builder
echo.
echo ==========================================
echo 💎 ROB IDE DEPLOYMENT COMPLETE
echo ==========================================
pause
