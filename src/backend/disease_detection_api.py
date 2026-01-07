from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow import keras
import numpy as np
import os
import io
from PIL import Image
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# =============================
# 1. Load the trained model
# =============================
MODEL_PATH = "leaf_disease_model.h5"

try:
    model = keras.models.load_model(MODEL_PATH)
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# =============================
# 2. Class names and information
# =============================
class_names = [
    'Pepper__bell___Bacterial_spot',
    'Pepper__bell___healthy',
    'PlantVillage',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Tomato_Bacterial_spot',
    'Tomato_Early_blight',
    'Tomato_Late_blight',
    'Tomato_Leaf_Mold',
    'Tomato_Septoria_leaf_spot',
    'Tomato_Spider_mites_Two_spotted_spider_mite',
    'Tomato__Target_Spot',
    'Tomato__Tomato_YellowLeaf__Curl_Virus',
    'Tomato__Tomato_mosaic_virus',
    'Tomato_healthy'
]

# Disease information mapping
disease_info = {
    'Pepper__bell___Bacterial_spot': {
        'name': 'Bell Pepper Bacterial Spot',
        'severity': 'moderate',
        'treatment': 'Apply copper-based fungicides like copper hydroxide or copper sulfate. Remove infected leaves and improve air circulation. Avoid overhead watering and ensure proper plant spacing.',
        'prevention': 'Use certified disease-free seeds, practice crop rotation, avoid working in wet fields, and maintain proper plant spacing for good air circulation. Water at soil level to keep leaves dry.'
    },
    'Pepper__bell___healthy': {
        'name': 'Healthy Bell Pepper',
        'severity': 'none',
        'treatment': 'No treatment needed. Continue current care practices.',
        'prevention': 'Maintain proper watering, fertilization, and pest management. Monitor regularly for early signs of disease or pest issues.'
    },
    'PlantVillage': {
        'name': 'Unidentified Plant',
        'severity': 'unknown',
        'treatment': 'Unable to identify specific disease. Consult with local agricultural extension services for proper diagnosis.',
        'prevention': 'Follow general good agricultural practices including crop rotation, proper spacing, and regular monitoring.'
    },
    'Potato___Early_blight': {
        'name': 'Potato Early Blight',
        'severity': 'moderate',
        'treatment': 'Apply fungicides containing chlorothalonil, mancozeb, or copper compounds. Remove affected foliage and improve air circulation. Ensure adequate potassium nutrition.',
        'prevention': 'Use resistant varieties, practice 3-4 year crop rotation, avoid overhead irrigation, and maintain proper plant nutrition especially potassium levels.'
    },
    'Potato___Late_blight': {
        'name': 'Potato Late Blight',
        'severity': 'severe',
        'treatment': 'Immediately apply systemic fungicides like metalaxyl or mefenoxam. Remove and destroy infected plants. Avoid irrigation during cool, wet weather.',
        'prevention': 'Use certified disease-free seed potatoes, apply preventive fungicides during favorable weather conditions, and practice good field sanitation.'
    },
    'Potato___healthy': {
        'name': 'Healthy Potato',
        'severity': 'none',
        'treatment': 'No treatment needed. Continue current care practices.',
        'prevention': 'Maintain proper soil health, adequate nutrition, and regular monitoring. Ensure proper hilling and avoid mechanical damage to tubers.'
    },
    'Tomato_Bacterial_spot': {
        'name': 'Tomato Bacterial Spot',
        'severity': 'moderate',
        'treatment': 'Apply copper-based bactericides. Remove infected leaves and improve air circulation. Use drip irrigation instead of overhead watering.',
        'prevention': 'Use certified disease-free seeds, practice crop rotation, avoid working in wet conditions, and maintain proper plant spacing.'
    },
    'Tomato_Early_blight': {
        'name': 'Tomato Early Blight',
        'severity': 'moderate',
        'treatment': 'Apply fungicides containing chlorothalonil, mancozeb, or azoxystrobin. Remove lower infected leaves and improve air circulation.',
        'prevention': 'Mulch around plants, water at soil level, ensure adequate plant spacing, and maintain proper plant nutrition.'
    },
    'Tomato_Late_blight': {
        'name': 'Tomato Late Blight',
        'severity': 'severe',
        'treatment': 'Apply systemic fungicides immediately. Remove and destroy infected plants. Avoid overhead watering and improve ventilation.',
        'prevention': 'Use resistant varieties, apply preventive fungicides during cool, wet weather, and ensure good air circulation.'
    },
    'Tomato_Leaf_Mold': {
        'name': 'Tomato Leaf Mold',
        'severity': 'moderate',
        'treatment': 'Improve air circulation and reduce humidity. Apply fungicides containing chlorothalonil or copper compounds. Remove infected leaves.',
        'prevention': 'Ensure proper ventilation, avoid overhead watering, maintain proper plant spacing, and use resistant varieties when possible.'
    },
    'Tomato_Septoria_leaf_spot': {
        'name': 'Tomato Septoria Leaf Spot',
        'severity': 'moderate',
        'treatment': 'Apply fungicides containing chlorothalonil, mancozeb, or copper compounds. Remove infected lower leaves and improve air circulation.',
        'prevention': 'Mulch around plants, water at soil level, practice crop rotation, and remove plant debris at end of season.'
    },
    'Tomato_Spider_mites_Two_spotted_spider_mite': {
        'name': 'Tomato Spider Mites',
        'severity': 'moderate',
        'treatment': 'Apply miticides or insecticidal soaps. Increase humidity around plants. Introduce beneficial predatory mites. Remove heavily infested leaves.',
        'prevention': 'Maintain adequate soil moisture, avoid water stress, monitor regularly, and encourage beneficial insects.'
    },
    'Tomato__Target_Spot': {
        'name': 'Tomato Target Spot',
        'severity': 'moderate',
        'treatment': 'Apply fungicides containing azoxystrobin, chlorothalonil, or mancozeb. Remove infected plant debris and improve air circulation.',
        'prevention': 'Practice crop rotation, use drip irrigation, mulch around plants, and remove plant debris at end of season.'
    },
    'Tomato__Tomato_YellowLeaf__Curl_Virus': {
        'name': 'Tomato Yellow Leaf Curl Virus',
        'severity': 'severe',
        'treatment': 'No direct treatment available. Remove infected plants to prevent spread. Control whitefly vectors with insecticides or yellow sticky traps.',
        'prevention': 'Use virus-resistant varieties, control whitefly populations, use reflective mulches, and remove infected plants immediately.'
    },
    'Tomato__Tomato_mosaic_virus': {
        'name': 'Tomato Mosaic Virus',
        'severity': 'severe',
        'treatment': 'No direct treatment available. Remove and destroy infected plants. Disinfect tools and hands when working with plants.',
        'prevention': 'Use virus-free seeds and transplants, practice good sanitation, avoid tobacco use around plants, and control aphid vectors.'
    },
    'Tomato_healthy': {
        'name': 'Healthy Tomato',
        'severity': 'none',
        'treatment': 'No treatment needed. Continue current care practices.',
        'prevention': 'Maintain proper watering, fertilization, and pest management. Support plants properly and monitor for early signs of problems.'
    }
}

# =============================
# 3. Prediction function
# =============================
def predict_image(image):
    try:
        # Resize image to model input size
        img = image.resize((224, 224))
        img_array = keras.utils.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0)

        # Make prediction
        predictions = model.predict(img_array, verbose=0)
        score = tf.nn.softmax(predictions[0])

        predicted_class = class_names[np.argmax(score)]
        confidence = float(100 * np.max(score))

        # Get disease information
        disease_data = disease_info.get(predicted_class, {
            'name': predicted_class,
            'severity': 'unknown',
            'treatment': 'Consult with local agricultural experts for proper diagnosis and treatment.',
            'prevention': 'Follow general good agricultural practices.'
        })

        return {
            'disease': disease_data['name'],
            'confidence': confidence,
            'severity': disease_data['severity'],
            'treatment': disease_data['treatment'],
            'prevention': disease_data['prevention'],
            'raw_class': predicted_class
        }
    except Exception as e:
        raise Exception(f"Prediction error: {str(e)}")

# =============================
# 4. API Endpoints
# =============================
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'classes_count': len(class_names)
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500

        # Check if image is provided
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        image_file = request.files['image']
        
        if image_file.filename == '':
            return jsonify({'error': 'No image selected'}), 400

        # Process image
        image = Image.open(io.BytesIO(image_file.read()))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Make prediction
        result = predict_image(image)
        
        return jsonify({
            'success': True,
            'result': result
        })

    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/classes', methods=['GET'])
def get_classes():
    return jsonify({
        'classes': class_names,
        'disease_info': disease_info
    })

if __name__ == '__main__':
    print(f"✅ Loaded {len(class_names)} disease classes")
    print("🚀 Starting Disease Detection API server...")
    print("📱 React app can connect to: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)