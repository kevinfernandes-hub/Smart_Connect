#!/usr/bin/env python3
"""
KisanConnect Disease Detection Backend Startup Script
This script helps set up and run the TensorFlow-based disease detection API
"""

import os
import sys
import subprocess
import platform

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version}")
    return True

def check_model_file():
    """Check if the model file exists"""
    model_path = "leaf_disease_model.h5"
    if os.path.exists(model_path):
        print(f"✅ Model file found: {model_path}")
        return True
    else:
        print(f"❌ Model file not found: {model_path}")
        print("Please copy your trained model file to this directory")
        return False

def install_requirements():
    """Install required packages"""
    print("📦 Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ All packages installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install packages: {e}")
        return False

def create_virtual_env():
    """Create virtual environment if it doesn't exist"""
    venv_name = "venv"
    if not os.path.exists(venv_name):
        print("🔧 Creating virtual environment...")
        try:
            subprocess.check_call([sys.executable, "-m", "venv", venv_name])
            print("✅ Virtual environment created")
            
            # Provide activation instructions
            if platform.system() == "Windows":
                activation_cmd = f"{venv_name}\\Scripts\\activate"
            else:
                activation_cmd = f"source {venv_name}/bin/activate"
            
            print(f"To activate the virtual environment, run:")
            print(f"  {activation_cmd}")
            print(f"Then run this script again.")
            return False
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to create virtual environment: {e}")
            return False
    return True

def start_api_server():
    """Start the Flask API server"""
    print("🚀 Starting Disease Detection API server...")
    print("📱 React frontend will connect to: http://localhost:5000")
    print("🔍 Health check available at: http://localhost:5000/health")
    print("Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        import disease_detection_api
        # The Flask app will run when the module is imported
    except ImportError as e:
        print(f"❌ Failed to import API module: {e}")
        print("Make sure all requirements are installed")
        return False
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        return True
    except Exception as e:
        print(f"❌ Server error: {e}")
        return False

def main():
    """Main startup function"""
    print("🌱 KisanConnect Disease Detection Backend")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Check if we're in a virtual environment
    in_venv = hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix)
    
    if not in_venv:
        print("⚠️  It's recommended to use a virtual environment")
        create_env = input("Create virtual environment? (y/n): ").lower().strip()
        if create_env == 'y':
            if not create_virtual_env():
                sys.exit(1)
    
    # Check model file
    if not check_model_file():
        sys.exit(1)
    
    # Install requirements
    install_reqs = input("Install/update required packages? (y/n): ").lower().strip()
    if install_reqs == 'y':
        if not install_requirements():
            sys.exit(1)
    
    # Start server
    print("\n🎯 Ready to start the API server!")
    start_server = input("Start the disease detection API? (y/n): ").lower().strip()
    if start_server == 'y':
        start_api_server()
    else:
        print("To start the server manually, run:")
        print("  python disease_detection_api.py")

if __name__ == "__main__":
    main()