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
if not exist .git (
    git init
)
git add .
git commit -m "feat: initial high-precision scaffold for Rob The Builder"
echo ✅ Git Initialized.

:: 3. GitHub Push (Direct Token Injection)
echo [3/4] Connecting to GitHub...
echo.
echo ^> Repository: https://github.com/hilyte870/rob-the-builder
echo.

set /p PAT="Enter your GitHub Personal Access Token (starts with ghp_): "

if "%PAT%"=="" (
    echo ❌ Token cannot be empty.
    pause
    exit /b 1
)

:: Handle existing remote origin
git remote remove origin >nul 2>&1

echo.
echo 🚀 Attempting precision push...
git push https://hilyte870:%PAT%@github.com/hilyte870/rob-the-builder.git main --force

if %errorlevel% neq 0 (
    echo.
    echo ❌ PUSH FAILED:
    echo 1. Ensure the token has "repo" permissions.
    echo 2. Ensure your username is "hilyte870".
    echo 3. Check for any extra spaces in the token.
    pause
    exit /b %errorlevel%
)
echo ✅ Push Successful.

:: Clean up remote to avoid storing token in .git/config
git remote add origin https://github.com/hilyte870/rob-the-builder.git

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
