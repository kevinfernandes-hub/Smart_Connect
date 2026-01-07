# 🌱 KisanConnect AI Disease Detection Backend

## Real-Time TensorFlow Disease Detection - Setup Guide

This backend provides real-time plant disease detection using a TensorFlow deep learning model trained on 16 disease classes.

---

## 🚀 Quick Start (Easiest Method)

### For Windows Users:
1. **Get your model file:** Place `leaf_disease_model.h5` in the `backend` folder
2. **Double-click:** `start_ai_backend.bat` (in the root folder)
3. **Wait:** For "🎉 AI Backend is now running!" message
4. **Refresh:** Your KisanConnect app - it will auto-connect!

### For Mac/Linux Users:
1. **Get your model file:** Place `leaf_disease_model.h5` in the `backend` folder
2. **Run:** `python start_ai_backend.py` (from the root folder)
3. **Wait:** For "🎉 AI Backend is now running!" message
4. **Refresh:** Your KisanConnect app - it will auto-connect!

---

## 📋 System Requirements

- **Python:** 3.8 or higher
- **RAM:** Minimum 4GB (8GB recommended)
- **Storage:** ~500MB for packages + model file size
- **OS:** Windows 10+, macOS 10.14+, or Linux

---

## 📦 What Gets Installed

The startup scripts automatically install:
- **TensorFlow 2.15.0** - Deep learning framework
- **Flask 3.0.0** - Web server
- **Flask-CORS 4.0.0** - Cross-origin support
- **Pillow 10.1.0** - Image processing
- **NumPy 1.24.3** - Numerical computing

---

## 🎯 Supported Disease Classes (16 Total)

### Bell Pepper:
- ✅ Bacterial Spot
- ✅ Healthy

### Potato:
- ✅ Early Blight
- ✅ Late Blight
- ✅ Healthy

### Tomato:
- ✅ Bacterial Spot
- ✅ Early Blight
- ✅ Late Blight
- ✅ Leaf Mold
- ✅ Septoria Leaf Spot
- ✅ Spider Mites
- ✅ Target Spot
- ✅ Yellow Leaf Curl Virus
- ✅ Mosaic Virus
- ✅ Healthy

---

## 🔧 Manual Setup (Advanced)

If you prefer manual setup or encounter issues:

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment (Recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Verify Model File
Make sure `leaf_disease_model.h5` exists in the backend folder:
```bash
# Windows
dir leaf_disease_model.h5

# Mac/Linux
ls -l leaf_disease_model.h5
```

### 5. Start Server
```bash
python disease_detection_api.py
```

---

## ✅ Verification Steps

### 1. Check Server Status
Open your browser and visit:
```
http://localhost:5000/health
```

You should see:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "classes_count": 16
}
```

### 2. Check in KisanConnect App
- Go to **Disease Detection** section
- Look for **"Live AI"** green badge in the header
- You should see: "Real-time TensorFlow-powered disease detection"

### 3. Test a Prediction
- Upload any plant leaf image
- Click **"Analyze Image"**
- You should get results with confidence scores

---

## 🐛 Troubleshooting

### Issue: "Model file not found"
**Solution:** 
- Ensure `leaf_disease_model.h5` is in the `backend` folder
- File name must be exactly `leaf_disease_model.h5`
- Check file permissions

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Windows - Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: "TensorFlow installation failed"
**Solution:**
- Update pip: `python -m pip install --upgrade pip`
- Install TensorFlow separately: `pip install tensorflow==2.15.0`
- For Apple Silicon Macs: `pip install tensorflow-macos`
- For older CPUs without AVX: Use TensorFlow 2.5.0

### Issue: "CORS errors in browser"
**Solution:**
- Make sure Flask-CORS is installed: `pip install flask-cors==4.0.0`
- Restart the backend server
- Clear browser cache

### Issue: "Backend shows offline in app"
**Solution:**
1. Check if server is running (should show terminal output)
2. Visit http://localhost:5000/health manually
3. Click "Check Again" button in KisanConnect app
4. Check firewall settings (allow port 5000)

---

## 📡 API Endpoints

### Health Check
```
GET http://localhost:5000/health
```
Returns server status and model information

### Predict Disease
```
POST http://localhost:5000/predict
Content-Type: multipart/form-data
Body: image file
```
Returns disease prediction with confidence score

### Get Classes
```
GET http://localhost:5000/classes
```
Returns all supported disease classes and information

---

## 💡 Performance Tips

### For Faster Predictions:
1. Use GPU if available (TensorFlow will auto-detect)
2. Keep images under 2MB
3. Use JPG format for smaller file sizes
4. Restart server if it becomes slow

### For Better Accuracy:
1. Upload clear, well-lit photos
2. Focus on affected leaf areas
3. Avoid blurry or shadowed images
4. Include some healthy tissue for comparison

---

## 🔄 Updating the Model

To use a new/updated model:

1. **Stop the backend** (Ctrl+C in terminal)
2. **Replace** `leaf_disease_model.h5` with your new model
3. **Ensure** the new model has the same input size (224x224x3)
4. **Update** class names in `disease_detection_api.py` if needed
5. **Restart** the backend

---

## 🌐 Remote Access (Optional)

To access from other devices on your network:

1. Find your local IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. The server is already configured to accept connections from `0.0.0.0`

3. Access from other devices:
   ```
   http://YOUR_IP_ADDRESS:5000
   ```

4. Update the frontend API URL if needed (in `/services/api.ts`)

⚠️ **Security Warning:** Only use on trusted networks. For production, use HTTPS and authentication.

---

## 📊 Model Training Information

If you want to train your own model:

### Dataset:
- Use PlantVillage dataset or similar
- Minimum 1000 images per class
- Balanced classes recommended

### Model Architecture:
- Input: 224x224x3 (RGB images)
- Output: Softmax layer with disease classes
- Save as: `leaf_disease_model.h5`

### Recommended:
- Use data augmentation
- Transfer learning (ResNet, MobileNet)
- Validation split: 80/20
- Early stopping to prevent overfitting

---

## 🆘 Need Help?

### Demo Mode:
- The app works perfectly without the backend
- Uses realistic mock predictions
- Great for testing the UI/UX

### Getting Support:
1. Check this documentation first
2. Review error messages in terminal
3. Verify all requirements are met
4. Test with the health endpoint

---

## 📝 License & Credits

- **TensorFlow:** Apache 2.0 License
- **Flask:** BSD License
- **Model:** PlantVillage dataset based
- **KisanConnect:** Built for Indian farmers 🇮🇳

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ Terminal shows: "🎉 AI Backend is now running!"
✅ Health check returns model_loaded: true
✅ App header shows green "Live AI" badge
✅ Predictions complete in 1-3 seconds
✅ Confidence scores are displayed

---

**Happy Farming! 🌾**

For issues or questions, check the troubleshooting section above.
