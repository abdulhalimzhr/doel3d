@echo off
echo.
echo ========================================
echo  DOEL3D - Development Environment
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js 18.0.0 or higher
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed
    echo Please install Docker Desktop
    pause
    exit /b 1
)

echo Starting DOEL3D Development Environment...
echo.

REM Create logs directory
if not exist "logs" mkdir logs

REM Start Backend
echo Starting Backend Services...
cd be
start /b cmd /c "npm run start:dev > ../logs/backend.log 2>&1"
cd ..

REM Wait a moment
timeout /t 5 /nobreak >nul

REM Start Frontend
echo Starting Frontend Services...
cd fe
start /b cmd /c "npm run dev > ../logs/frontend.log 2>&1"
cd ..

echo.
echo ========================================
echo  Services Started Successfully!
echo ========================================
echo.
echo Backend (NestJS):     http://localhost:4000
echo GraphQL Playground:  http://localhost:4000/graphql
echo Frontend (Next.js):  http://localhost:3000
echo.
echo Logs are being written to:
echo   Backend:  logs\backend.log
echo   Frontend: logs\frontend.log
echo.
echo Press any key to stop all services...
pause >nul

REM Kill all node processes (this is a simple approach)
taskkill /f /im node.exe >nul 2>&1

echo Services stopped.
pause
