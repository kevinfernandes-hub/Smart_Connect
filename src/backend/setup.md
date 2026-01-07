# Disease Detection Backend Setup

## Prerequisites
1. Python 3.8 or higher
2. Your trained model file `leaf_disease_model.h5`

## Installation Steps

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install required packages:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Place your model file:**
   - Copy your `leaf_disease_model.h5` file to the `backend` directory
   - Ensure the file name matches exactly: `leaf_disease_model.h5`

5. **Run the API server:**
   ```bash
   python disease_detection_api.py
   ```

6. **Test the API:**
   - API will be available at: `http://localhost:5000`
   - Health check: `http://localhost:5000/health`

## API Endpoints

- `GET /health` - Check if the API and model are working
- `POST /predict` - Upload an image for disease detection
- `GET /classes` - Get list of supported disease classes

## Frontend Integration

The React frontend will automatically connect to this backend API when you start the disease detection feature in KisanMitra.

## Troubleshooting

1. **Model loading error**: Ensure `leaf_disease_model.h5` is in the backend directory
2. **Port conflicts**: Change the port in `disease_detection_api.py` if needed
3. **CORS issues**: The API includes CORS headers for frontend integration