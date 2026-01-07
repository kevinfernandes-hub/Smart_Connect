// Mock Backend API Services - simulating the Streamlit backend functionality

export interface User {
  username: string;
  password: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  city: string;
  description?: string;
  windSpeed?: number;
  pressure?: number;
}

export interface CropRecommendation {
  crop: string;
  confidence: number;
  reason: string;
}

export interface MLRecommendation {
  crop: string;
  confidence: number;
  factors: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Mock user database (in real app, this would be SQLite/PostgreSQL)
const mockUsers: User[] = [
  { username: "farmer1", password: "password123" },
  { username: "demo", password: "demo" }
];

// Mock weather API key
const WEATHER_API_KEY = "0586a12f77b380f12b217f8bb156e370";

// Authentication Services
export const authService = {
  login: async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('kisanconnect_user', JSON.stringify(user));
      return { success: true, message: "Login successful" };
    }
    return { success: false, message: "Invalid credentials" };
  },

  register: async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = mockUsers.find(u => u.username === username);
    if (existingUser) {
      return { success: false, message: "Username already exists" };
    }
    
    mockUsers.push({ username, password });
    return { success: true, message: "Registration successful" };
  },

  logout: () => {
    localStorage.removeItem('kisanconnect_user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('kisanconnect_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// Weather Service - Enhanced with more details
export const weatherService = {
  getWeather: async (city: string): Promise<WeatherData | null> => {
    try {
      // In real app, you'd use the actual OpenWeatherMap API
      // const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
      // const response = await fetch(url);
      // const data = await response.json();
      
      // Mock weather data for demo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const descriptions = ["Clear sky", "Partly cloudy", "Overcast", "Light rain", "Sunny"];
      const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
      
      const mockWeatherData: { [key: string]: WeatherData } = {
        "nagpur": { 
          temperature: 28, 
          humidity: 65, 
          city: "Nagpur",
          description: "Sunny",
          windSpeed: 12,
          pressure: 1015 
        },
        "mumbai": { 
          temperature: 32, 
          humidity: 75, 
          city: "Mumbai",
          description: "Partly cloudy",
          windSpeed: 15,
          pressure: 1012 
        },
        "pune": { 
          temperature: 25, 
          humidity: 60, 
          city: "Pune",
          description: "Clear sky",
          windSpeed: 8,
          pressure: 1018 
        },
        "delhi": { 
          temperature: 30, 
          humidity: 55, 
          city: "Delhi",
          description: "Overcast",
          windSpeed: 10,
          pressure: 1014 
        },
        "bangalore": { 
          temperature: 24, 
          humidity: 70, 
          city: "Bangalore",
          description: "Light rain",
          windSpeed: 6,
          pressure: 1020 
        }
      };
      
      return mockWeatherData[city.toLowerCase()] || {
        temperature: 26 + Math.random() * 10,
        humidity: 50 + Math.random() * 30,
        city: city,
        description: randomDesc,
        windSpeed: 5 + Math.random() * 15,
        pressure: 1010 + Math.random() * 20
      };
    } catch (error) {
      console.error('Weather API error:', error);
      return null;
    }
  }
};

// Crop Recommendation Service
export const cropService = {
  getRecommendation: async (
    soilType: string,
    ph: number,
    moisture: number,
    weatherData: WeatherData
  ): Promise<CropRecommendation> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Enhanced rule-based recommendation logic
    let crop: string;
    let reason: string;
    
    // Primary pH-based classification
    if (ph < 5.5) {
      crop = "Rice";
      reason = "Highly acidic soil is perfect for rice cultivation";
    } else if (ph < 6.5) {
      crop = "Rice";
      reason = "Acidic soil is ideal for rice and some legumes";
    } else if (ph < 7.5) {
      crop = "Wheat";
      reason = "Neutral pH is perfect for wheat and most cereals";
    } else if (ph < 8.0) {
      crop = "Cotton";
      reason = "Slightly alkaline soil supports cotton cultivation";
    } else {
      crop = "Barley";
      reason = "Alkaline soil is suitable for barley and some hardy crops";
    }
    
    // Advanced adjustments based on soil type and weather
    if (soilType === "Black") {
      if (weatherData.temperature > 25 && weatherData.humidity < 60) {
        crop = "Cotton";
        reason = "Black soil with warm, dry climate is ideal for cotton";
      } else if (weatherData.temperature > 20) {
        crop = "Soybean";
        reason = "Black soil with moderate temperature favors soybean";
      }
    } else if (soilType === "Alluvial") {
      if (weatherData.humidity > 70 && weatherData.temperature > 25) {
        crop = "Rice";
        reason = "Alluvial soil with high humidity and warmth favors rice";
      } else if (moisture > 60) {
        crop = "Sugarcane";
        reason = "Alluvial soil with high moisture is excellent for sugarcane";
      } else {
        crop = "Wheat";
        reason = "Alluvial soil is versatile and supports wheat cultivation";
      }
    } else if (soilType === "Red") {
      if (weatherData.temperature > 30) {
        crop = "Groundnut";
        reason = "Red soil with warm climate is ideal for groundnut";
      } else {
        crop = "Jowar";
        reason = "Red soil supports drought-resistant crops like jowar";
      }
    } else if (soilType === "Sandy") {
      if (weatherData.temperature > 25) {
        crop = "Bajra";
        reason = "Sandy soil with warm climate suits bajra cultivation";
      } else {
        crop = "Mustard";
        reason = "Sandy soil is suitable for mustard and other oilseeds";
      }
    } else if (soilType === "Laterite") {
      if (weatherData.humidity > 80) {
        crop = "Turmeric";
        reason = "Laterite soil with high humidity is perfect for turmeric";
      } else {
        crop = "Cashew";
        reason = "Laterite soil supports tree crops and spices";
      }
    }
    
    // Special conditions for specific crops
    if (weatherData.temperature < 15) {
      crop = "Potato";
      reason = "Cool climate is ideal for potato cultivation";
    } else if (weatherData.temperature > 35 && moisture < 30) {
      crop = "Castor";
      reason = "Hot, dry conditions favor drought-resistant castor";
    } else if (ph > 7.0 && weatherData.humidity > 60) {
      crop = "Onion";
      reason = "Alkaline soil with good moisture suits onion cultivation";
    }
    
    return {
      crop,
      confidence: 75 + Math.random() * 20,
      reason
    };
  },

  getMLRecommendation: async (
    nitrogen: number,
    phosphorus: number,
    potassium: number,
    temperature: number,
    humidity: number,
    ph: number,
    rainfall: number
  ): Promise<MLRecommendation> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock ML model prediction logic
    const crops = [
      'Rice', 'Wheat', 'Cotton', 'Maize', 'Sugarcane', 'Barley', 'Jowar', 'Bajra', 'Ragi',
      'Mustard', 'Sunflower', 'Groundnut', 'Soybean', 'Chickpea', 'Lentil', 'Black Gram',
      'Green Gram', 'Pigeon Pea', 'Sesame', 'Safflower', 'Castor', 'Turmeric', 'Cumin',
      'Coriander', 'Fenugreek', 'Onion', 'Potato', 'Tomato', 'Chili'
    ];
    
    // Simple scoring based on parameters
    let bestCrop = 'Rice';
    let factors: string[] = [];
    
    if (nitrogen > 100 && phosphorus > 80 && potassium > 80) {
      bestCrop = 'Turmeric';
      factors.push('High NPK content ideal for turmeric cultivation');
    } else if (nitrogen > 80 && phosphorus > 60) {
      bestCrop = 'Wheat';
      factors.push('High N-P content favors wheat');
    } else if (temperature > 30 && humidity > 70 && rainfall > 150) {
      bestCrop = 'Rice';
      factors.push('Warm humid conditions with good rainfall ideal for rice');
    } else if (potassium > 80 && rainfall < 50) {
      bestCrop = 'Cotton';
      factors.push('High K with low rainfall suits cotton');
    } else if (ph > 7.5 && temperature > 25) {
      bestCrop = 'Sugarcane';
      factors.push('Alkaline soil and warm temperature good for sugarcane');
    } else if (nitrogen < 40 && temperature > 25 && humidity < 60) {
      bestCrop = 'Bajra';
      factors.push('Low nitrogen and dry conditions favor bajra');
    } else if (phosphorus > 50 && potassium > 60 && ph < 7) {
      bestCrop = 'Groundnut';
      factors.push('Good P-K ratio with slightly acidic soil suits groundnut');
    } else if (temperature > 20 && temperature < 30 && humidity > 50) {
      bestCrop = 'Chickpea';
      factors.push('Moderate temperature and humidity ideal for chickpea');
    } else if (nitrogen > 60 && rainfall > 100) {
      bestCrop = 'Soybean';
      factors.push('Good nitrogen and adequate rainfall favor soybean');
    } else if (temperature > 25 && humidity < 50) {
      bestCrop = 'Mustard';
      factors.push('Warm dry conditions suit mustard cultivation');
    }
    
    if (temperature > 25) factors.push('Optimal temperature range');
    if (humidity > 60) factors.push('Good humidity levels');
    if (ph >= 6.0 && ph <= 7.5) factors.push('Ideal pH range');
    
    return {
      crop: bestCrop,
      confidence: 80 + Math.random() * 15,
      factors
    };
  }
};

// Disease Detection Service
export const diseaseService = {
  detectDisease: async (imageFile: File): Promise<{
    disease: string;
    confidence: number;
    treatment: string;
    prevention: string;
    severity?: string;
  }> => {
    try {
      // Check if backend is available
      const BACKEND_URL = 'http://localhost:5000';
      
      // First check if backend is healthy
      try {
        const healthResponse = await fetch(`${BACKEND_URL}/health`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!healthResponse.ok) {
          throw new Error('Backend not available');
        }
      } catch (error) {
        console.info('TensorFlow backend not started - using demo mode. To enable real-time AI detection, run the backend server.');
        return await getMockDiseaseDetection();
      }

      // Prepare form data for real-time prediction
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`${BACKEND_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Prediction failed');
      }

      const result = data.result;
      
      return {
        disease: result.disease,
        confidence: Math.round(result.confidence * 100) / 100, // Round to 2 decimal places
        treatment: result.treatment,
        prevention: result.prevention,
        severity: result.severity
      };

    } catch (error) {
      console.info('Using demo mode for disease detection. Start the TensorFlow backend for real-time AI analysis.');
      return await getMockDiseaseDetection();
    }
  }
};

// Mock disease detection fallback
async function getMockDiseaseDetection(): Promise<{
  disease: string;
  confidence: number;
  treatment: string;
  prevention: string;
  severity?: string;
}> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const diseases = [
    {
      disease: "Tomato Early Blight",
      confidence: 85.4,
      severity: "moderate",
      treatment: "Apply fungicides containing chlorothalonil, mancozeb, or azoxystrobin. Remove lower infected leaves and improve air circulation.",
      prevention: "Mulch around plants, water at soil level, ensure adequate plant spacing, and maintain proper plant nutrition."
    },
    {
      disease: "Potato Late Blight",
      confidence: 92.1,
      severity: "severe",
      treatment: "Apply systemic fungicides immediately. Remove and destroy infected plants. Avoid overhead watering and improve ventilation.",
      prevention: "Use resistant varieties, apply preventive fungicides during cool, wet weather, and ensure good air circulation."
    },
    {
      disease: "Bell Pepper Bacterial Spot",
      confidence: 78.7,
      severity: "moderate",
      treatment: "Apply copper-based fungicides like copper hydroxide. Remove infected leaves and improve air circulation. Avoid overhead watering.",
      prevention: "Use certified disease-free seeds, practice crop rotation, avoid working in wet fields, and maintain proper plant spacing."
    },
    {
      disease: "Healthy Tomato",
      confidence: 96.3,
      severity: "none",
      treatment: "No treatment needed. Continue current care practices.",
      prevention: "Maintain proper watering, fertilization, and pest management. Support plants properly and monitor for early signs of problems."
    },
    {
      disease: "Tomato Leaf Mold",
      confidence: 81.2,
      severity: "moderate",
      treatment: "Improve air circulation and reduce humidity. Apply fungicides containing chlorothalonil or copper compounds. Remove infected leaves.",
      prevention: "Ensure proper ventilation, avoid overhead watering, maintain proper plant spacing, and use resistant varieties when possible."
    }
  ];
  
  return diseases[Math.floor(Math.random() * diseases.length)];
}

// Enhanced Chatbot Service with Comprehensive Agricultural Knowledge
export const chatService = {
  sendMessage: async (message: string, language: 'en' | 'hi' | 'mr' | 'gu' | 'pa' | 'bn' | 'ta' | 'te' = 'en'): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Advanced AI-like chatbot with context-aware responses
    const lowerMessage = message.toLowerCase();
    
    const responses = {
      en: {
        // Crop-specific detailed responses
        wheat: "🌾 **Wheat Cultivation Guide:**\n\n📅 **Sowing Time:** November-December (Rabi season)\n🌡️ **Temperature:** 10-25°C optimal\n💧 **Irrigation:** Every 20-25 days, 4-6 irrigations needed\n🧪 **Soil pH:** 6.0-7.5 (slightly acidic to neutral)\n🌱 **Seed Rate:** 100-125 kg/hectare\n🌿 **Varieties:** HD-2967, PBW-343, DBW-17\n💰 **Expected Yield:** 40-50 quintals/hectare\n\n**Pro Tips:**\n• Apply urea in 3 splits for better nitrogen use\n• Control weeds at 30-35 days after sowing\n• Watch for rust and aphid attacks",
        
        rice: "🌾 **Rice Cultivation Complete Guide:**\n\n📅 **Seasons:**\n• Kharif (June-July) - Main season\n• Rabi (November-December) - Winter rice\n🌡️ **Temperature:** 20-35°C\n💧 **Water:** Needs standing water, 1200-1500mm rainfall\n🧪 **Soil pH:** 5.5-6.5 (acidic)\n🌱 **Varieties:** Swarna, IR-64, Basmati\n💰 **Yield:** 50-60 quintals/hectare\n\n**Key Points:**\n• Puddling essential for water retention\n• Transplant 25-30 day old seedlings\n• Apply zinc sulfate if leaves turn yellow\n• Beware of blast, brown spot diseases",
        
        cotton: "🌿 **Cotton Farming Essentials:**\n\n📅 **Sowing:** April-May (Kharif)\n🌡️ **Climate:** Warm 21-30°C, 180+ frost-free days\n💧 **Rainfall:** 50-100cm annually\n🧪 **Soil:** Black cotton soil ideal (pH 6.5-8.0)\n🌱 **Spacing:** 90cm x 60cm\n💰 **Yield:** 15-20 quintals/hectare\n\n**Management:**\n• Drip irrigation saves 40% water\n• Pink bollworm is major pest - use pheromone traps\n• Bt cotton provides bollworm resistance\n• Harvest when 60% bolls open",
        
        sugarcane: "🎋 **Sugarcane Cultivation:**\n\n📅 **Planting:** February-March (Spring), September-October (Autumn)\n🌡️ **Temperature:** 20-30°C during growth\n💧 **Water:** High requirement - 1500-2500mm\n🧪 **Soil:** Deep, well-drained loam (pH 6.5-7.5)\n🌱 **Varieties:** Co-0238, Co-86032, Co-0403\n💰 **Yield:** 800-1000 quintals/hectare\n\n**Care Tips:**\n• Apply 300kg N, 60kg P, 60kg K per hectare\n• Earthing up at 90-120 days critical\n• Control red rot and smut diseases\n• Harvest at 10-12 months",
        
        maize: "🌽 **Maize/Corn Growing Guide:**\n\n📅 **Season:** Kharif (June-July), Rabi (October-November)\n🌡️ **Temperature:** 21-27°C ideal\n💧 **Irrigation:** Critical at tasseling and grain filling\n🧪 **Soil pH:** 5.5-7.5\n🌱 **Spacing:** 60cm x 20cm\n💰 **Yield:** 60-70 quintals/hectare\n\n**Best Practices:**\n• Use hybrid seeds for better yield\n• Apply 120kg N in 3 splits\n• Control fall armyworm with biological agents\n• Harvest when kernels harden",
        
        soybean: "🫘 **Soybean Farming Tips:**\n\n📅 **Sowing:** June-July (with monsoon)\n🌡️ **Temperature:** 20-30°C\n💧 **Rainfall:** 450-700mm\n🧪 **Soil:** Well-drained loam (pH 6.5-7.5)\n🌱 **Seed Rate:** 75-80 kg/hectare\n💰 **Yield:** 20-25 quintals/hectare\n\n**Success Tips:**\n• Inoculate seeds with Rhizobium\n• Sow at 30-45cm row spacing\n• Control yellow mosaic virus (use resistant varieties)\n• Harvest when 95% pods turn brown",
        
        groundnut: "🥜 **Groundnut/Peanut Cultivation:**\n\n📅 **Season:** Kharif (June) & Summer (January-February)\n🌡️ **Temperature:** 20-30°C\n💧 **Water:** 500-600mm well distributed\n🧪 **Soil:** Sandy loam, red soil (pH 6.0-6.5)\n🌱 **Varieties:** TMV-2, JL-24, TAG-24\n💰 **Yield:** 20-25 quintals/hectare\n\n**Pro Tips:**\n• Apply gypsum at flowering (200-400 kg/ha)\n• Crucial for pod development\n• Control leaf miner and tikka disease\n• Harvest when leaves turn yellow",
        
        // Soil and fertilizer management
        soil: "🌱 **Soil Health Management:**\n\n**Soil Testing:** Test every 2-3 years for NPK, pH, organic matter\n\n**Soil Types & Crops:**\n• **Black Soil:** Cotton, soybean, wheat, jowar\n• **Red Soil:** Groundnut, millets, pulses\n• **Alluvial:** Rice, wheat, sugarcane, vegetables\n• **Sandy:** Bajra, groundnut, watermelon\n• **Laterite:** Cashew, coconut, spices\n\n**Improvement Methods:**\n• Add organic matter (FYM, compost)\n• Green manuring with dhaincha, sunhemp\n• Crop rotation to prevent nutrient depletion\n• Mulching to retain moisture",
        
        fertilizer: "💊 **Fertilizer Application Guide:**\n\n**Major Nutrients (NPK):**\n• **Nitrogen (N):** Leaf growth, greening - Urea, CAN\n• **Phosphorus (P):** Root development - DAP, SSP\n• **Potassium (K):** Disease resistance - MOP, SOP\n\n**Micro-nutrients:**\n• **Zinc:** Yellow leaves, stunted growth\n• **Boron:** Flowering, fruit set\n• **Iron:** Chlorosis in young leaves\n\n**Organic Options:**\n• Farmyard manure (FYM): 10-15 tons/hectare\n• Vermicompost: 2-3 tons/hectare\n• Neem cake: Pest control + nutrition\n\n**Application Tips:**\n• Split N application for efficiency\n• Apply P & K as basal dose\n• Don't over-fertilize - causes pollution",
        
        organic: "🌿 **Organic Farming Practices:**\n\n**Benefits:**\n✅ Better soil health & biodiversity\n✅ Higher market price (20-30% premium)\n✅ Safe for environment and health\n✅ Reduced input costs long-term\n\n**Key Practices:**\n• Crop rotation & intercropping\n• Green manuring (sunhemp, dhaincha)\n• Vermicomposting & FYM\n• Biological pest control (Trichoderma, NPV)\n• Mulching & water conservation\n\n**Organic Inputs:**\n• Panchagavya for growth\n• Neem oil for pest control\n• Jeevamrut for soil health\n• Beejamrut for seed treatment",
        
        // Pest and disease management
        pest: "🐛 **Integrated Pest Management (IPM):**\n\n**Prevention First:**\n• Use disease-resistant varieties\n• Crop rotation breaks pest cycles\n• Maintain field sanitation\n• Proper spacing for air circulation\n\n**Monitoring:**\n• Install pheromone traps (1/acre)\n• Light traps for night-flying insects\n• Yellow sticky traps for whiteflies\n• Scout fields weekly\n\n**Biological Control:**\n• Trichogramma for bollworms\n• Chrysoperla for aphids\n• NPV viruses for caterpillars\n• Neem oil (5ml/liter) as repellent\n\n**Chemical Control (Last Resort):**\n• Use recommended doses only\n• Rotate pesticide groups\n• Follow safety withdrawal periods",
        
        disease: "🦠 **Plant Disease Management:**\n\n**Common Diseases:**\n\n**Fungal:**\n• Blight (potato, tomato) - Use mancozeb\n• Rust (wheat, pulses) - Propiconazole spray\n• Powdery mildew - Sulfur dusting\n\n**Bacterial:**\n• Bacterial leaf spot - Copper fungicides\n• Wilt diseases - Crop rotation essential\n\n**Viral:**\n• Yellow mosaic - Control whitefly vectors\n• Leaf curl - Remove infected plants\n\n**Prevention:**\n• Use certified disease-free seeds\n• Treat seeds with Trichoderma\n• Avoid over-watering\n• Remove crop residues\n• Maintain field hygiene",
        
        // Weather and irrigation
        weather: "🌤️ **Weather & Crop Management:**\n\n**Temperature Impact:**\n• **High (>35°C):** Increases water need, affects pollination\n• **Low (<15°C):** Slows growth, frost damage risk\n• **Optimal:** Varies by crop - check specific guides\n\n**Rainfall Patterns:**\n• **Monsoon (June-Sep):** Kharif crops (rice, cotton, soybean)\n• **Winter (Oct-Mar):** Rabi crops (wheat, mustard, chickpea)\n• **Summer:** Irrigated crops only\n\n**Weather-Based Actions:**\n• Heavy rain forecast → Postpone spraying\n• Heat wave → Increase irrigation frequency\n• Cold wave → Protect seedlings with mulch\n• High humidity → Monitor for fungal diseases\n\n**Use KisanConnect weather widget for:**\n• 7-day forecasts\n• Agricultural advisories\n• Rainfall predictions",
        
        irrigation: "💧 **Smart Irrigation Practices:**\n\n**Methods:**\n• **Drip:** 40-70% water saving, best for vegetables, cotton\n• **Sprinkler:** Uniform coverage, good for wheat, vegetables\n• **Furrow:** Traditional, suitable for row crops\n• **Flood:** For rice paddies\n\n**Critical Stages for Irrigation:**\n• **Wheat:** Crown root, tillering, flowering, grain filling\n• **Rice:** Transplanting, tillering, flowering\n• **Cotton:** Square formation, flowering, boll development\n\n**Water Conservation:**\n• Mulching reduces evaporation by 50%\n• Irrigate in morning/evening\n• Adopt micro-irrigation (govt subsidies available)\n• Rainwater harvesting in farm ponds",
        
        // Market and economics
        price: "💰 **Market Price Information:**\n\nTo get current market prices, please:\n1. Visit the **Market Analysis** section in KisanConnect\n2. Check Mandi prices for your region\n3. Compare prices across different markets\n\n**Price Trends:**\n• Monitor 30-day price charts\n• Understand seasonal variations\n• Plan harvesting based on price forecasts\n\n**Better Prices Tips:**\n• Grade your produce properly\n• Clean and dry grains before selling\n• Consider Farmer Producer Organizations (FPOs)\n• Use e-NAM platform for wider market access\n• Store produce when prices are low (if possible)",
        
        market: "📊 **Agricultural Marketing Tips:**\n\n**Where to Sell:**\n• **APMC Mandis:** Traditional, established system\n• **e-NAM Platform:** Online national market\n• **Contract Farming:** Pre-decided prices\n• **FPO/Cooperatives:** Better bargaining power\n• **Direct to Retailers:** Higher margins\n\n**Value Addition:**\n• Grading & sorting increases price by 10-15%\n• Packaging attracts better buyers\n• Organic certification → Premium prices\n\n**Timing:**\n• Avoid selling immediately after harvest (glut period)\n• Store if prices are low & storage facilities available\n• Track market trends weekly\n\n**Government Support:**\n• MSP (Minimum Support Price) for major crops\n• Warehouse receipt system\n• Market development schemes",
        
        // Technology and government schemes
        technology: "📱 **Farm Technology & Digital Tools:**\n\n**KisanConnect Features:**\n✅ AI Crop Recommendation\n✅ Disease Detection via Photo\n✅ Real-time Weather Updates\n✅ Market Price Analysis\n✅ Multilingual Support\n\n**Other Useful Tech:**\n• Soil health card app\n• e-NAM for online trading\n• Kisan Suvidha for advisories\n• mKisan for SMS alerts\n• Crop insurance apps\n\n**Precision Farming:**\n• Drones for spraying & monitoring\n• Soil sensors for irrigation management\n• GPS-based land measurement\n• Weather stations",
        
        subsidy: "🎁 **Government Schemes & Subsidies:**\n\n**PM-KISAN:**\n• ₹6000/year direct benefit transfer\n• For all farmer families\n\n**Crop Insurance (PMFBY):**\n• 2% premium for Kharif crops\n• 1.5% for Rabi crops\n• Coverage against natural calamities\n\n**Irrigation:**\n• 90% subsidy for SC/ST farmers on micro-irrigation\n• 80% for small/marginal farmers\n\n**Machinery:**\n• 40-50% subsidy on farm equipment\n• Custom Hiring Centers\n\n**Soil Health Card:**\n• Free soil testing\n• Nutrient recommendations\n\n**KCC (Kisan Credit Card):**\n• Easy farm loans at 4% interest\n• ₹3 lakh limit without collateral",
        
        // Seasonal and crop rotation
        season: "📅 **Crop Calendar & Seasonal Guide:**\n\n**Kharif (June-October):**\n• Rice, cotton, soybean, maize\n• Groundnut, bajra, jowar\n• Monsoon-dependent crops\n\n**Rabi (October-March):**\n• Wheat, mustard, chickpea\n• Potato, onion, barley\n• Requires irrigation\n\n**Summer/Zaid (March-June):**\n• Watermelon, cucumber, vegetables\n• Fodder crops, green gram\n• High water requirement\n\n**Perennial:**\n• Sugarcane (12-18 months)\n• Fruit trees, spices\n\n**October 2025 Activities:**\n• Start wheat sowing (North India)\n• Harvest Kharif crops\n• Prepare for Rabi season\n• Apply basal fertilizers",
        
        rotation: "🔄 **Crop Rotation Benefits:**\n\n**Why Rotate:**\n✅ Prevents soil nutrient depletion\n✅ Breaks pest & disease cycles\n✅ Improves soil structure\n✅ Increases overall farm income\n\n**Good Rotation Examples:**\n• **Rice → Wheat → Legume** (Punjab, Haryana)\n• **Cotton → Wheat → Green Gram** (Maharashtra)\n• **Soybean → Wheat → Summer Moong** (MP)\n• **Groundnut → Wheat → Fodder** (Gujarat)\n\n**Principles:**\n• Follow deep-rooted with shallow-rooted crops\n• Include legumes (add nitrogen to soil)\n• Alternate high & low nutrient demand crops\n• Include green manure crops\n\n**Never grow same crop continuously!**",
        
        // Greetings and general
        hello: "👋 Namaste! I'm your KisanConnect AI Assistant. I'm here to help you with:\n\n✅ Crop cultivation guidance\n✅ Pest & disease management\n✅ Soil & fertilizer advice\n✅ Weather & irrigation tips\n✅ Market prices & trends\n✅ Government schemes\n\nWhat would you like to know about farming today?",
        
        help: "🤝 **How I Can Help You:**\n\n**Ask me about:**\n• Specific crops (wheat, rice, cotton, etc.)\n• Soil testing & management\n• Fertilizers & organic farming\n• Pest & disease control\n• Irrigation techniques\n• Market prices & selling tips\n• Weather-based farming\n• Government schemes & subsidies\n• Crop rotation & seasonal planning\n\n**Example Questions:**\n• \"How to grow wheat?\"\n• \"What fertilizer for rice?\"\n• \"Best time to sow cotton?\"\n• \"Current tomato prices?\"\n• \"How to control pests organically?\"\n\nI respond in multiple Indian languages! 🇮🇳",
        
        thanks: "🙏 You're very welcome! I'm always here to help. Remember:\n\n💡 Check our **Weather Widget** for forecasts\n📊 Visit **Market Analysis** for prices\n🌾 Use **Crop Recommendation** for personalized suggestions\n📸 Try **Disease Detection** to identify plant problems\n\nHappy farming! May your fields be fertile and your harvests abundant! 🌾✨",
        
        default: "I understand you're asking about farming. Could you be more specific? For example:\n\n• Ask about a specific crop: \"How to grow wheat?\"\n• Soil management: \"How to improve soil health?\"\n• Pest control: \"How to control pests in rice?\"\n• Market info: \"Current cotton prices?\"\n• Weather: \"Best irrigation practices?\"\n\nI'm here to help with all your agricultural questions! 🌾"
      },
      hi: {
        wheat: "गेहूं की खेती के लिए: नवंबर-दिसंबर में बुआई करें, मिट्टी का pH 6.0-7.5 रखें, और हर 20-25 दिन में सिंचाई करें।",
        rice: "चावल बाढ़ वाले खेतों में pH 5.5-6.5 के साथ सबसे अच्छा बढ़ता है। अधिकतम उपज के लिए मानसून के दौरान रोपाई करें।",
        cotton: "कपास को गर्म जलवायु (21-30°C), अच्छी जल निकासी वाली मिट्टी और मध्यम वर्षा की आवश्यकता होती है। काली मिट्टी आदर्श है।",
        weather: "मौसम खेती म��ं महत्वपूर्ण भूमिका निभाता है। सर्वोत्तम परिणामों के लिए तापमान, आर्द्रता और वर्षा की निगरानी करें।",
        disease: "सामान्य पौधों के रोगों में ब्लाइट, फफूंदी और जंग शामिल हैं। जल्दी पहचान और उपचार महत्वपूर्ण है।",
        fertilizer: "संतुलित NPK उर्वरकों का उपयोग करें। जैविक खाद मिट्टी के स्वास्थ्य और फसल की उपज में सुधार करती है।",
        default: "मैं आपके सभी कृषि प्रश्नों में मदद के लिए यहाँ हूँ। फसल, मौसम, बीमारी या कृषि तकनीकों के बारे में पूछें!"
      },
      mr: {
        wheat: "गहूच्या लागवडीसाठी: नोव्हेंबर-डिसेंबरमध्ये पेरणी करा, मातीचा pH 6.0-7.5 ठेवा, आणि दर 20-25 दिवसांनी पाणी द्या।",
        rice: "तांदूळ बाढीच्या शेतात pH 5.5-6.5 सह सर्वात चांगला वाढतो। जास्तीत जास्त उत्पादनासाठी पावसाळ्यात लावणी करा।",
        cotton: "कापसाला उष्ण हवामान (21-30°C), चांगला निचरा असलेली माती आणि मध्यम पाऊस हवा. काळी माती योग्य आहे।",
        weather: "हवामान शेतीमध्ये महत्त्वपूर्ण भूमिका बजावते। सर्वोत्तम परिणामांसाठी तापमान, आर्द्रता आणि पावसाचे निरीक्षण करा।",
        disease: "सामान्य पौधों के रोगों में ब्लाइट, फफूंदी और जंग शामिल हैं। जल्दी पहचान और उपचार महत्वपूर्ण है।",
        fertilizer: "संतुलित NPK उर्वरकों का उपयोग करें। जैविक खाद मिट्टी के स्वास्थ्य और फसल की उपज में सुधार करती है।",
        default: "मी तुमच्या सर्व शेती प्रश्नांसाठी मदत करण्यासाठी इथे आहे. पीक, हवामान, रोग किंवा शेती तंत्रांबद्दल विचारा!"
      },
      gu: {
        wheat: "ઘઉંની ખેતી માટે: નવેમ્બર-ડિસેમ્બરમાં વાવણી કરો, માટીનો pH 6.0-7.5 રાખો, અને દર 20-25 દિવસે પાણી આપો।",
        rice: "ચોખા પૂરવાળા ખેતરોમાં pH 5.5-6.5 સાથે શ્રેષ્ઠ ઉગે છે। મહત્તમ ઉપજ માટે ચોમાસા દરમિયાન રોપણી કરો।",
        cotton: "કપાસને ગરમ આબોહવા (21-30°C), સારા ડ્રેનેજવાળી માટી અને મધ્યમ વરસાદની જરૂર છે। કાળી માટી આદર્શ છે।",
        weather: "હવામાન ખેતીમાં મહત્વપૂર્ણ ભૂમિકા ભજવે છે। શ્રેષ્ઠ પરિણામો માટે તાપમાન, ભેજ અને વરસાદનું નિરીક્ષણ કરો।",
        disease: "સામાન્ય છોડના રોગોમાં બ્લાઇટ, ફૂગ અને કાટ સામેલ છે। વહેલી ઓળખ અને સારવાર મહત્વપૂર્ણ છે।",
        fertilizer: "સંતુલિત NPK ખાતરોનો ઉપયોગ કરો। કાર્બનિક ખાતર માટીની ગુણવત્તા અને પાકની ઉપજ સુધારે છે।",
        default: "હું તમારા બધા ખેતીના પ્રશ્નોમાં મદદ માટે અહીં છું. પાક, હવામાન, રોગ અથવા ખેતી તકનીકો વિશે પૂછો!"
      },
      pa: {
        wheat: "ਕਣਕ ਦੀ ਖੇਤੀ ਲਈ: ਨਵੰਬਰ-ਦਸੰਬਰ ਵਿੱਚ ਬਿਜਾਈ ਕਰੋ, ਮਿੱਟੀ ਦਾ pH 6.0-7.5 ਰੱਖੋ, ਅਤੇ ਹਰ 20-25 ਦਿਨਾਂ ਵਿੱਚ ਪਾਣੀ ਦਿਓ।",
        rice: "ਚਾਵਲ ਹੜ੍ਹ ਵਾਲੇ ਖੇਤਾਂ ਵਿੱਚ pH 5.5-6.5 ਨਾਲ ਸਭ ਤੋਂ ਵਧੀਆ ਉੱਗਦਾ ਹੈ। ਵੱਧ ਤੋਂ ਵੱਧ ਪੈਦਾਵਾਰ ਲਈ ਮਾਨਸੂਨ ਦੌਰਾਨ ਰੋਪਾਈ ਕਰੋ।",
        cotton: "ਕਪਾਹ ਨੂੰ ਗਰਮ ਜਲਵਾਯੂ (21-30°C), ਚੰਗੀ ਡਰੇਨੇਜ ਵਾਲੀ ਮਿੱਟੀ ਅਤੇ ਦਰਮਿਆਨੀ ਬਾਰਿਸ਼ ਦੀ ਲੋੜ ਹੈ। ਕਾਲੀ ਮਿੱਟੀ ਆਦਰਸ਼ ਹੈ।",
        weather: "ਮੌਸਮ ਖੇਤੀ ਵਿੱਚ ਮਹੱਤਵਪੂਰਨ ਭੂਮਿਕਾ ਨਿਭਾਉਂਦਾ ਹੈ। ਸਰਵੋਤਮ ਨਤੀਜਿਆਂ ਲਈ ਤਾਪਮਾਨ, ਨਮੀ ਅਤੇ ਬਾਰਿਸ਼ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ।",
        disease: "ਆਮ ਪੌਧਿਆਂ ਦੀਆਂ ਬਿਮਾਰੀਆਂ ਵਿੱਚ ਬਲਾਈਟ, ਉੱਲੀ ਅਤੇ ਜੰਗ ਸ਼ਾਮਲ ਹਨ। ਜਲਦੀ ਪਛਾਣ ਅਤੇ ਇਲਾਜ ਮਹੱਤਵਪੂਰਨ ਹੈ।",
        fertilizer: "ਸੰਤੁਲਿਤ NPK ਖਾਦਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ। ਜੈਵਿਕ ਖਾਦ ਮਿੱਟੀ ਦੀ ਗੁਣਵੱਤਾ ਅਤੇ ਫਸਲ ਦੀ ਪੈਦਾਵਾਰ ਵਿੱਚ ਸੁਧਾਰ ਕਰਦੀ ਹੈ।",
        default: "ਮੈਂ ਤੁਹਾਡੇ ਸਾਰੇ ਖੇਤੀ ਪ੍ਰਸ਼ਨਾਂ ਦੀ ਮਦਦ ਲਈ ਇੱਥੇ ਹਾਂ। ਫਸਲ, ਮੌਸਮ, ਬਿਮਾਰੀ ਜਾਂ ਖੇਤੀ ਤਕਨੀਕਾਂ ਬਾਰੇ ਪੁੱਛੋ!"
      },
      bn: {
        wheat: "গমের চাষের জন্য: নভেম্বর-ডিসেম্বরে বপন করুন, মাটির pH 6.0-7.5 রাখুন এবং প্রতি 20-25 দিনে পানি দিন।",
        rice: "ধান প্লাবিত জমিতে pH 5.5-6.5 সহ সবচেয়ে ভাল জন্মায়। সর্বোচ্চ ফলনের জন্য বর্ষাকালে রোপণ করুন।",
        cotton: "তুলার উষ্ণ জলবায়ু (21-30°C), ভাল নিষ্কাশনযুক্ত মাটি এবং মাঝারি বৃষ্টিপাত প্রয়োজন। কালো মাটি আদর্শ।",
        weather: "আবহাওয়া কৃষিতে গুরুত্বপূর্ণ ভূমিকা পালন করে। সর্বোত্তম ফলাফলের জন্য তাপমাত্রা, আর্দ্রতা এবং বৃষ্টিপাত নিরীক্ষণ করুন।",
        disease: "সাধারণ উদ্ভিদ রোগের মধ্যে রয়েছে ব্লাইট, ছত্রাক এবং মরিচা। প্রাথমিক সনাক্তকরণ এবং চিকিৎসা গুরুত্বপূর্ণ।",
        fertilizer: "সুষম NPK সার ব্যবহার করুন। জৈব সার মাটির গুণমান এবং ফসলের ফলন উন্নত করে।",
        default: "আমি আপনার সমস্ত কৃষি প্রশ্নের সাহায্যের জন্য এখানে আছি। ফসল, আবহাওয়া, রোগ বা কৃষি কৌশল সম্পর্কে জিজ্ঞাসা করুন!"
      },
      ta: {
        wheat: "கோதுமை விவசாயத்திற்கு: நவம்பர்-டிசம்பரில் விதைக்கவும், மண்ணின் pH 6.0-7.5 வைத்திருக்கவும், மற்றும் ஒவ்வொரு 20-25 நாட்களுக்கும் தண்ணீர் கொடுக்கவும்.",
        rice: "நெல் வெள்ளப்பெருக்கு நிலங்களில் pH 5.5-6.5 உடன் சிறப்பாக வளரும். அதிகபட்ச மகசூலுக்கு பருவமழை காலத்தில் நடவு செய்யவும்.",
        cotton: "பருத்திக்கு சூடான காலநிலை (21-30°C), நல்ல வடிகால் மண் மற்றும் மிதமான மழைப்பொழிவு தேவை। கருப்பு மண் சிறந்தது।",
        weather: "வானிலை விவசாயத்தில் முக்கிய பங்கு வகிக்கிறது। சிறந்த முடிவுகளுக்கு வெப்பநிலை, ஈரப்பதம் மற்றும் மழைப்பொழிவைக் கண்காணிக்கவும்.",
        disease: "பொதுவான தாவர நோய்களில் ப்ளைட், பூஞ்சை மற்றும் துரு ஆகியவை அடங்கும். ஆரம்ப கண்டறிதல் மற்றும் சிகிச்சை முக்கியம்.",
        fertilizer: "சமச்சீர் NPK உரங்களைப் பயன்படுத்துங்கள். இயற்கை உரம் மண்ணின் தரம் மற்றும் பயிர் மகசூலை மேம்படுத்துகிறது।",
        default: "உங்கள் அனைத்து விவசாய கேள்விகளுக்கும் உதவ நான் இங்கே இருக்கிறேன். பயிர், வானிலை, நோய் அல்லது விவசாய நுட்பங்களைப் பற்றி கேளுங்கள்!"
      },
      te: {
        wheat: "గోధుమ సాగుకు: నవంబర్-డిసెంబర్‌లో విత్తండి, మట్టి pH 6.0-7.5 ఉంచండి, మరియు ప్రతి 20-25 రోజులకు నీరు ఇవ్వండి।",
        rice: "వరి వరద భూములలో pH 5.5-6.5తో బాగా పెరుగుతుంది। గరిష్ట దిగుబడి కోసం వర్షాకాలంలో నాటండి।",
        cotton: "పత్తికి వెచ్చని వాతావరణం (21-30°C), మంచి డ్రైనేజీ ఉన్న మట్టి మరియు మితమైన వర్షపాతం అవసరం. నల్ల మట్టి ఆదర్శం.",
        weather: "వాతావరణం వ్యవసాయంలో కీలక పాత్ర పోషిస్తుంది। మంచి ఫలితాల కోసం ఉష్ణోగ్రత, తేమ మరియు వర్షపాతాన్ని పర్యవేక్షించండి।",
        disease: "సాధారణ మొక్కల వ్యాధులలో బ్లైట్, ఫంగస్ మరియు తుప్పు ఉన్నాయి. ముందస్తు గుర్తింపు మరియు చికిత్స ముఖ్యం.",
        fertilizer: "సమతుల్య NPK ఎరువులను ఉపయోగించండి. సేంద్రీయ ఎరువులు మట్టి నాణ్యత మరియు పంట దిగుబడిని మెరుగుపరుస్తాయి।",
        default: "మీ అన్ని వ్యవసాయ ప్రశ్నలకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. పంట, వాతావరణం, వ్యాధులు లేదా వ్యవసాయ పద్ధతుల గురించి అడగండి!"
      }
    };
    
    const langResponses = responses[language] || responses['en'];
    
    // Check for keywords and return appropriate response
    for (const [keyword, response] of Object.entries(langResponses)) {
      if (keyword !== 'default' && lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    return langResponses.default;
  }
};

// Market Analysis Service
export const marketService = {
  getCurrentPrices: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        crop: "Wheat",
        price: 2320,
        change: 8.2,
        trend: "up" as const,
        volume: 1200
      },
      {
        crop: "Rice",
        price: 2050,
        change: 11.1,
        trend: "up" as const,
        volume: 2200
      },
      {
        crop: "Cotton",
        price: 7850,
        change: -2.3,
        trend: "down" as const,
        volume: 850
      },
      {
        crop: "Sugarcane",
        price: 380,
        change: 8.6,
        trend: "up" as const,
        volume: 5200
      },
      {
        crop: "Maize",
        price: 1760,
        change: 6.7,
        trend: "up" as const,
        volume: 1820
      },
      {
        crop: "Soybean",
        price: 4320,
        change: 13.7,
        trend: "up" as const,
        volume: 1580
      },
      {
        crop: "Groundnut",
        price: 5320,
        change: 10.8,
        trend: "up" as const,
        volume: 1280
      },
      {
        crop: "Mustard",
        price: 5720,
        change: 10.0,
        trend: "up" as const,
        volume: 860
      },
      {
        crop: "Chickpea",
        price: 4720,
        change: 12.4,
        trend: "up" as const,
        volume: 1080
      },
      {
        crop: "Turmeric",
        price: 9720,
        change: 5.7,
        trend: "up" as const,
        volume: 560
      },
      {
        crop: "Onion",
        price: 2720,
        change: 23.6,
        trend: "up" as const,
        volume: 3600
      },
      {
        crop: "Potato",
        price: 1380,
        change: 15.0,
        trend: "up" as const,
        volume: 4600
      },
      {
        crop: "Tomato",
        price: 3320,
        change: 18.6,
        trend: "up" as const,
        volume: 3100
      },
      {
        crop: "Chili",
        price: 8720,
        change: 6.3,
        trend: "up" as const,
        volume: 860
      },
      {
        crop: "Cumin",
        price: 26800,
        change: 7.2,
        trend: "up" as const,
        volume: 260
      },
      {
        crop: "Coriander",
        price: 9020,
        change: 6.1,
        trend: "up" as const,
        volume: 460
      }
    ];
  },

  getPriceHistory: async (crop: string, period: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock historical data with crop-specific base prices
    const basePrices: { [key: string]: number } = {
      wheat: 2200, rice: 1900, sugarcane: 350, cotton: 7500, maize: 1650,
      barley: 1450, jowar: 2850, bajra: 2200, ragi: 3200, mustard: 5200,
      sunflower: 6200, groundnut: 4800, soybean: 3800, chickpea: 4200,
      lentil: 5500, blackgram: 6800, greengram: 6200, pigeonpea: 5800,
      sesame: 8200, safflower: 4500, castor: 5600, turmeric: 9200,
      cumin: 25000, coriander: 8500, fenugreek: 3200, onion: 2200,
      potato: 1200, tomato: 2800, chili: 8200
    };

    const basePrice = basePrices[crop.toLowerCase()] || 2000;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    
    return months.map((month, index) => ({
      month,
      price: Math.round(basePrice + (Math.random() - 0.5) * 200 + index * 20),
      volume: Math.round(500 + Math.random() * 1000 + (basePrice / 100))
    }));
  }
};