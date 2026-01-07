@echo off
title KisanConnect AI Backend
color 0A

echo.
echo 🌱 KisanConnect - AI Disease Detection
echo =====================================
echo Starting your real-time plant disease detection AI...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from python.org
    echo.
    pause
    exit /b 1
)

REM Check if backend directory exists
if not exist "backend" (
    echo ❌ Backend directory not found
    echo Please make sure you're running this from the project root
    echo.
    pause
    exit /b 1
)

REM Check if model file exists
if not exist "backend\leaf_disease_model.h5" (
    echo ❌ AI model file missing: backend\leaf_disease_model.h5
    echo Please copy your trained model file to: backend\leaf_disease_model.h5
    echo.
    pause
    exit /b 1
)

echo ✅ All requirements found
echo.

REM Navigate to backend directory
cd backend

echo 🔧 Setting up AI backend...
echo 📦 Installing Python packages...

REM Install required packages
python -m pip install --quiet tensorflow==2.15.0 flask==3.0.0 flask-cors==4.0.0 pillow==10.1.0 numpy==1.24.3

if errorlevel 1 (
    echo ⚠️  Installing from requirements.txt...
    python -m pip install -r requirements.txt
)

echo ✅ Packages installed successfully
echo.

echo 🚀 Starting AI Disease Detection Server...
echo 📱 Your React app will connect automatically!
echo 🔍 Server available at: http://localhost:5000
echo Press Ctrl+C to stop
echo ----------------------------------------
echo.

REM Start the server
python disease_detection_api.py

echo.
echo 👋 AI Backend stopped
pause