@echo off
title Wedding Gallery - Development Server

echo ================================
echo Wedding Photo Gallery
echo Development Server for Windows
echo ================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
npm install

if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Starting development server...
echo The gallery will be available at: http://localhost:8080
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
