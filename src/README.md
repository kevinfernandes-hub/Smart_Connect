# 🌱 KisanConnect - AI-Powered Farming Assistant

A comprehensive multilingual farming application with real-time plant disease detection powered by TensorFlow.

> **Mobile-first design** | **8 Indian Languages** | **Real-time AI** | **Voice Assistant**

## 🚀 Quick Start

### Enable Real-Time AI Disease Detection

1. **Place your AI model**: Copy your `leaf_disease_model.h5` file to the `backend` folder

2. **Start the AI backend**:
   - **Windows**: Double-click `start_ai_backend.bat`
   - **macOS/Linux**: Run `python start_ai_backend.py`

3. **Use the app**: Open the Disease Detection feature - you'll see "Live AI" when connected!

## ✨ Features

### 🤖 AI Disease Detection
- Real-time plant disease identification (16+ diseases)
- TensorFlow-powered deep learning model
- Confidence scores and severity ratings
- Treatment and prevention recommendations
- Works offline in demo mode

### 🌾 Crop Recommendations
- ML-powered crop suggestions based on:
  - Soil type (Black, Red, Alluvial, Sandy, Laterite)
  - pH levels and moisture content
  - Weather conditions (temperature, humidity)
  - NPK nutrients (Nitrogen, Phosphorus, Potassium)
- 29+ crops supported
- Profit estimates and cultivation guides

### 🗣️ Voice Chat Assistant
- Multilingual voice recognition and text-to-speech
- Hands-free farming advice
- Natural language understanding
- Comprehensive agricultural knowledge base

### 💬 Smart Chatbot
- Extensive farming knowledge (crops, diseases, weather, markets)
- Context-aware responses
- Supports 8 Indian languages
- Quick question templates

### 📊 Market Analysis
- Live crop prices and trends
- 30-day price history charts
- Market recommendations
- 16+ major crops tracked

### 🌤️ Weather Integration
- Real-time weather data
- Agricultural impact insights
- Disease risk assessment
- Irrigation planning

### 🌍 Multilingual Support
Full support for: English, Hindi, Marathi, Gujarati, Punjabi, Bengali, Tamil, Telugu

## 🔧 System Requirements

- Python 3.8 or higher
- Node.js (for React frontend)
- Your trained TensorFlow model (`leaf_disease_model.h5`)

## 📱 App Structure

- **Dashboard**: Overview of all features
- **Crop Recommendation**: Smart farming suggestions
- **Disease Detection**: AI-powered plant health analysis
- **Market Analysis**: Crop pricing and market trends
- **Chatbot**: Multilingual farming assistant

## 🧠 AI Models Supported

### Disease Detection (16 Classes)
- Bell Pepper: Healthy, Bacterial Spot
- Potato: Healthy, Early Blight, Late Blight
- Tomato: Healthy, Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites, Target Spot, Yellow Leaf Curl Virus, Mosaic Virus

## 🛠️ Development

The app automatically falls back to demo mode when the AI backend isn't running, so you can develop and test without the TensorFlow server.

## 📋 Troubleshooting

### Disease Detection Shows "Demo Mode"
✅ **This is normal!** The app works perfectly in demo mode with realistic predictions.

To enable real AI:
1. Make sure `leaf_disease_model.h5` is in the `backend` folder
2. Run `start_ai_backend.bat` (Windows) or `python start_ai_backend.py` (Mac/Linux)
3. Click **"Check Again"** button in the app
4. Look for green **"Live AI"** badge

### Common Issues

**Backend won't start:**
- Check Python version (need 3.8+): `python --version`
- Update pip: `python -m pip install --upgrade pip`
- Check if model file exists: Should be in `backend/leaf_disease_model.h5`

**Port 5000 already in use:**
- Close other programs using port 5000
- Or change the port in `disease_detection_api.py` (line 240)

**Voice chat not working:**
- Grant microphone permissions in browser
- Use Chrome, Edge, or Safari (best support)
- Check browser's microphone settings

📖 **Full Troubleshooting Guide**: See [`backend/AI_BACKEND_SETUP.md`](backend/AI_BACKEND_SETUP.md)

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Flask + TensorFlow
- **AI Models**: Custom trained plant disease detection
- **Languages**: 8 Indian languages supported
- **Mobile-First**: Optimized for mobile devices

---

## 📚 Documentation

- **AI Setup Guide**: [`AI_SETUP_GUIDE.md`](AI_SETUP_GUIDE.md) - Quick start for AI backend
- **Backend Setup**: [`backend/AI_BACKEND_SETUP.md`](backend/AI_BACKEND_SETUP.md) - Detailed backend guide
- **Quick Start**: [`backend/QUICK_START.md`](backend/QUICK_START.md) - 3-step setup
- **Integration Guide**: [`DISEASE_DETECTION_INTEGRATION.md`](DISEASE_DETECTION_INTEGRATION.md) - Technical details

## 🎯 Use Cases

- **Farmers**: Get instant crop and disease advice in your language
- **Agricultural Extension Workers**: Demonstrate modern farming techniques
- **Students**: Learn about AI in agriculture
- **Researchers**: Test plant disease detection models
- **Agri-Businesses**: Provide value-added services to farmers

## 🌟 What Makes KisanConnect Special?

✅ **Works Offline**: Full functionality in demo mode without internet
✅ **Mobile-First**: Designed for farmers in the field
✅ **Regional Languages**: Not just translated - culturally adapted
✅ **Voice-Enabled**: For farmers who prefer speaking over typing
✅ **Free & Open**: No subscription fees or hidden costs
✅ **Comprehensive**: All farming needs in one app

---

**KisanConnect makes AI-powered farming accessible to everyone!** 🚜✨

Made with ❤️ for Indian Farmers 🇮🇳

Made with ❤️ for Indian Farmers 🇮🇳