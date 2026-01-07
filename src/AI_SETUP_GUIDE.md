# 🤖 Enable Real-Time AI Disease Detection

## One-Click Setup! ⚡

### Step 1: Get Your AI Model
Place your `leaf_disease_model.h5` file in the `backend` folder

### Step 2: Start the AI Backend

#### Windows Users:
Double-click: **`start_ai_backend.bat`**

#### Mac/Linux Users:
Run in terminal:
```bash
python start_ai_backend.py
```

### Step 3: Wait for Success Message
```
🎉 AI Backend is now running!
```

### Step 4: Refresh KisanConnect App
The app will automatically detect and connect to your AI backend!

---

## ✅ How to Verify It's Working

1. **Open Disease Detection** section in KisanConnect
2. **Look for green badge:** "Live AI" near the title
3. **Click "Check Again"** button if it shows "Demo Mode"
4. **Upload a plant image** and get instant AI predictions!

---

## 📦 What You Need

- Python 3.8 or higher ([Download here](https://www.python.org/downloads/))
- Your trained model file: `leaf_disease_model.h5`
- About 500MB of free space for packages

---

## 🆘 Quick Troubleshooting

**Q: "Backend shows offline"**
- Make sure the backend terminal is still running
- Click the "Check Again" button in the app
- Check if http://localhost:5000/health opens in browser

**Q: "Model file not found"**
- Ensure `leaf_disease_model.h5` is in the `backend` folder
- Check the file name is exactly correct

**Q: "Installation errors"**
- Update pip: `python -m pip install --upgrade pip`
- Try running as administrator (Windows)

---

## 📖 Full Documentation

For detailed setup, troubleshooting, and advanced options:
👉 See `/backend/AI_BACKEND_SETUP.md`

---

## 💡 Don't Have a Model Yet?

**No problem!** KisanConnect works perfectly in **Demo Mode**:
- Realistic disease predictions
- Full UI/UX experience  
- Perfect for testing and demonstrations
- No backend needed

---

## 🎯 Supported Diseases (16 Classes)

Bell Pepper, Potato, and Tomato diseases:
- Bacterial Spot, Early Blight, Late Blight
- Leaf Mold, Septoria, Spider Mites
- Target Spot, Viral diseases, and more!

---

**Happy Farming! 🌾**
