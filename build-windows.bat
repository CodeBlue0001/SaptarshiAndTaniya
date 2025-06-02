@echo off
title Wedding Gallery - Build for Production

echo ================================
echo Wedding Photo Gallery
echo Production Build for Windows
echo ================================
echo.

echo Running TypeScript check...
npm run typecheck

if errorlevel 1 (
    echo ERROR: TypeScript compilation failed
    pause
    exit /b 1
)

echo.
echo Building production bundle...
npm run build

if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo ================================
echo Build completed successfully!
echo ================================
echo.
echo The production build is available in the 'dist' folder.
echo You can deploy the contents of this folder to any web server.
echo.
echo To preview the production build locally, run:
echo npm run preview
echo.
pause
