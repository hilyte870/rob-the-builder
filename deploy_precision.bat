@echo off
setlocal
echo ==========================================
echo 🛠️ ROB THE BUILDER: PRECISION DEPLOYMENT
echo ==========================================
echo.

:: 1. Verification Build
echo [1/4] Verifying Build...
call npm install
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ❌ BUILD FAILED: Please check your Node.js/NPM installation.
    pause
    exit /b %errorlevel%
)
echo ✅ Build Verified.

:: 2. Git Initialization
echo [2/4] Initializing Git...
git init
git add .
git commit -m "feat: initial high-precision scaffold for Rob The Builder"
echo ✅ Git Initialized.

:: 3. GitHub Push
echo [3/4] Connecting to GitHub...
echo.
echo ^> Repository: https://github.com/hilyte870/rob-the-builder
echo.
git remote add origin https://github.com/hilyte870/rob-the-builder.git
git branch -M main
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo ❌ PUSH FAILED: Check your GitHub permissions or Personal Access Token.
    pause
    exit /b %errorlevel%
)
echo ✅ Push Successful.

:: 4. Deployment Check
echo [4/4] Finalizing...
echo ^> Now go to https://vercel.com/new
echo ^> Import 'rob-the-builder'
echo ^> Click Deploy.
echo.
echo ==========================================
echo 🚀 DEPLOYMENT SCRIPT COMPLETE
echo ==========================================
pause
