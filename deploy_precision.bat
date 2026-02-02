@echo off
setlocal
echo ==========================================
echo 🛠️ ROB THE BUILDER: PRECISION DEPLOYMENT
echo ==========================================
echo.

:: 1. Force Clean Git State
echo [1/5] Cleaning Repository...
if exist vercel.json del /f /q vercel.json
echo ✅ Legacy configs removed.

:: 2. Verification Build
echo [2/5] Verifying Build...
call npm install
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ❌ BUILD FAILED: Local verification failed.
    pause
    exit /b %errorlevel%
)
echo ✅ Build Verified locally.

:: 3. Git Fix: Stop tracking node_modules
echo [3/5] Fixing Git tracking...
if not exist .git (
    git init
)
:: This is critical: remove already tracked node_modules from git index
git rm -r --cached node_modules >nul 2>&1
git rm -r --cached dist >nul 2>&1
git add .
git commit -m "fix: remove node_modules and legacy configs to fix Vercel permission denied"
echo ✅ Git index cleaned.

:: 4. GitHub Push
echo [4/5] Connecting to GitHub...
set /p PAT="Enter your GitHub Personal Access Token (starts with ghp_): "

if "%PAT%"=="" (
    echo ❌ Token cannot be empty.
    pause
    exit /b 1
)

git remote remove origin >nul 2>&1
echo 🚀 Attempting precision push...
git push https://hilyte870:%PAT%@github.com/hilyte870/rob-the-builder.git main --force

if %errorlevel% neq 0 (
    echo.
    echo ❌ PUSH FAILED: Check your PAT or repository permissions.
    pause
    exit /b %errorlevel%
)
echo ✅ Push Successful.

:: Clean up remote
git remote add origin https://github.com/hilyte870/rob-the-builder.git

:: 5. Deployment Finalization
echo [5/5] Finalizing...
echo ^> Go to Vercel: https://vercel.com/hilyte870/rob-the-builder
echo ^> If a build is running, it should now succeed!
echo.
echo ==========================================
echo 🚀 DEPLOYMENT SCRIPT COMPLETE
echo ==========================================
pause
