#!/usr/bin/env python3
"""
KisanConnect AI Backend - One-Click Startup
===========================================

This script automatically sets up and starts the TensorFlow disease detection backend.
Just run this file and your AI will be ready!
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

def print_header():
    print("🌱 KisanConnect - AI Disease Detection")
    print("=" * 40)
    print("Starting your real-time plant disease detection AI...")
    print()

def check_requirements():
    """Check if we have everything we need"""
    issues = []
    
    # Check Python version
    if sys.version_info < (3, 8):
        issues.append(f"❌ Python 3.8+ required (found {sys.version})")
    else:
        print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}")
    
    # Check if backend directory exists
    backend_dir = Path("backend")
    if not backend_dir.exists():
        issues.append("❌ Backend directory not found")
    else:
        print("✅ Backend directory found")
    
    # Check if model file exists
    model_file = backend_dir / "leaf_disease_model.h5"
    if not model_file.exists():
        issues.append("❌ AI model file missing: backend/leaf_disease_model.h5")
        issues.append("   Please copy your trained model to: backend/leaf_disease_model.h5")
    else:
        print("✅ AI model file found")
    
    return issues

def setup_backend():
    """Set up the backend environment"""
    print("\n🔧 Setting up AI backend...")
    
    backend_dir = Path("backend")
    os.chdir(backend_dir)
    
    # Install requirements
    print("📦 Installing Python packages...")
    try:
        subprocess.run([
            sys.executable, "-m", "pip", "install", 
            "tensorflow==2.15.0", 
            "flask==3.0.0", 
            "flask-cors==4.0.0", 
            "pillow==10.1.0", 
            "numpy==1.24.3"
        ], check=True, capture_output=True)
        print("✅ Packages installed successfully")
    except subprocess.CalledProcessError:
        print("⚠️  Installing from requirements.txt...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
    
    return True

def start_server():
    """Start the Flask server"""
    print("\n🚀 Starting AI Disease Detection Server...")
    print("📱 Your React app will connect automatically!")
    print("🔍 Server will be available at: http://localhost:5000")
    print("Press Ctrl+C to stop")
    print("-" * 40)
    
    try:
        # Import and run the Flask app
        import disease_detection_api
        print("🎉 AI Backend is now running!")
    except KeyboardInterrupt:
        print("\n🛑 AI Backend stopped")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        return False
    
    return True

def main():
    print_header()
    
    # Check requirements
    issues = check_requirements()
    if issues:
        print("\n⚠️  Setup issues found:")
        for issue in issues:
            print(f"   {issue}")
        print("\nPlease fix these issues and try again.")
        input("Press Enter to exit...")
        return
    
    try:
        # Setup backend
        if not setup_backend():
            return
        
        # Start server
        start_server()
        
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        input("Press Enter to exit...")

if __name__ == "__main__":
    main()