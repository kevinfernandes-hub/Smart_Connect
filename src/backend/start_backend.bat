@echo off
echo 🌱 KisanMitra Disease Detection Backend
echo =====================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv" (
    echo 🔧 Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ❌ Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate

REM Check if model file exists
if not exist "leaf_disease_model.h5" (
    echo ❌ Model file not found: leaf_disease_model.h5
    echo Please copy your trained model file to this directory
    pause
    exit /b 1
)

REM Install requirements
echo 📦 Installing required packages...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install packages
    pause
    exit /b 1
)

REM Start the API server
echo 🚀 Starting Disease Detection API server...
echo 📱 React frontend will connect to: http://localhost:5000
echo 🔍 Health check: http://localhost:5000/health
echo Press Ctrl+C to stop the server
echo --------------------------------------------------

python disease_detection_api.py

pause