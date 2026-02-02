@echo off
setlocal
echo ==========================================
echo 💎 ROB IDE: FINAL FUNCTIONAL LAUNCH
echo ==========================================
echo.

:: 1. Force Local Build
echo [1/3] Final Verification...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ FAILED.
    pause
    exit /b 1
)
echo ✅ Engine Ready.

:: 2. Sync
echo [2/3] Preparing functional payload...
git add .
git commit -m "feat: implement high-fidelity functional generation and robust sandbox bootstrapper"
echo ✅ Package sealed.

:: 3. Push
echo [3/3] Deploying to Cloud...
set /p PAT="Enter your GitHub Token: "
if "%PAT%"=="" ( exit /b 1 )

git remote remove origin >nul 2>&1
git push https://hilyte870:%PAT%@github.com/hilyte870/rob-the-builder.git main --force

if %errorlevel% equ 0 (
    echo ✅ SUCCESS!
) else (
    echo ❌ FAIL.
)

echo.
echo ==========================================
pause
