import React, { createContext, useContext, useState, ReactNode } from 'react';
import { cropTranslations } from './LanguageContextCropExpansion';

export type Language = 'en' | 'hi' | 'mr' | 'gu' | 'pa' | 'bn' | 'ta' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations = {
  en: {
    // App Header
    appName: "Farm Advisor",
    appSubtitle: "Farmer's Friend",
    
    // Navigation
    home: "Home",
    crops: "Crops",
    scan: "Scan",
    market: "Market",
    chat: "Chat",
    
    // Dashboard
    welcomeBack: "Welcome back",
    farmingAssistant: "Your Smart Farming Assistant",
    quickActions: "Quick Actions",
    cropRecommendation: "Crop Recommendation",
    cropRecommendationDesc: "Get personalized crop suggestions based on your soil and climate",
    diseaseDetection: "Disease Detection",
    diseaseDetectionDesc: "Identify plant diseases using AI-powered image analysis",
    marketAnalysis: "Market Analysis",
    marketAnalysisDesc: "Track crop prices and market trends",
    chatAssistant: "Chat Assistant",
    chatAssistantDesc: "Get instant farming advice and support",
    todaysWeather: "Today's Weather",
    temperature: "Temperature",
    humidity: "Humidity",
    rainfall: "Rainfall",
    recentUpdates: "Recent Updates",
    newPestAlert: "New pest alert for wheat crops in your area",
    marketPriceUpdate: "Market price update: Tomato prices increased by 15%",
    weatherWarning: "Weather warning: Heavy rainfall expected next week",
    
    // Crop Recommendation
    cropRecommendationTitle: "Crop Recommendation",
    getPersonalizedSuggestions: "Get personalized crop suggestions based on your farm conditions",
    soilType: "Soil Type",
    selectSoilType: "Select soil type",
    clayey: "Clayey",
    sandy: "Sandy",
    loamy: "Loamy",
    silty: "Silty",
    location: "Location",
    enterLocation: "Enter your location",
    season: "Season",
    selectSeason: "Select season",
    kharif: "Kharif (Monsoon)",
    rabi: "Rabi (Winter)",
    zaid: "Zaid (Summer)",
    farmSize: "Farm Size (acres)",
    enterFarmSize: "Enter farm size",
    getRecommendations: "Get Recommendations",
    recommendedCrops: "Recommended Crops",
    estimatedYield: "Estimated Yield",
    profitPotential: "Profit Potential",
    growthDuration: "Growth Duration",
    waterRequirement: "Water Requirement",
    moderate: "Moderate",
    high: "High",
    low: "Low",
    months: "months",
    
    // Disease Detection
    diseaseDetectionTitle: "Disease Detection",
    aiPoweredAnalysis: "AI-powered plant disease identification",
    uploadPlantImage: "Upload Plant Image",
    dragDropImage: "Drag and drop an image here, or click to select",
    analyzeImage: "Analyze Image",
    analysisResults: "Analysis Results",
    confidence: "Confidence",
    treatment: "Treatment",
    prevention: "Prevention",
    
    // Market Analysis
    marketAnalysisTitle: "Market Analysis",
    cropPricesAndTrends: "Track crop prices, market trends, and get selling recommendations",
    priceChart: "Price Chart (Last 30 days)",
    currentPrice: "Current Price",
    priceChange: "Price Change",
    marketTrends: "Market Trends",
    demandStatus: "Demand Status",
    todaysNews: "Today's Market News",
    priceAlert: "Price Alert: Onion prices have increased by 20% this week",
    demandIncrease: "High demand for organic vegetables in metro cities",
    exportOpportunity: "Export opportunity: Rice prices favorable for international trade",
    
    // Market Analysis Extended
    wheat: "Wheat",
    rice: "Rice", 
    sugarcane: "Sugarcane",
    cotton: "Cotton",
    maize: "Maize",
    barley: "Barley",
    jowar: "Jowar",
    bajra: "Bajra",
    ragi: "Ragi",
    mustard: "Mustard",
    sunflower: "Sunflower",
    groundnut: "Groundnut",
    soybean: "Soybean",
    chickpea: "Chickpea",
    lentil: "Lentil",
    blackgram: "Black Gram",
    greengram: "Green Gram",
    pigeonpea: "Pigeon Pea",
    sesame: "Sesame",
    safflower: "Safflower",
    castor: "Castor",
    turmeric: "Turmeric",
    cumin: "Cumin",
    coriander: "Coriander",
    fenugreek: "Fenugreek",
    onion: "Onion",
    potato: "Potato",
    tomato: "Tomato",
    chili: "Chili",
    priceTrends: "Price Trends",
    tradingVolume: "Trading Volume",
    monthlyTradingVolumes: "Monthly trading volumes in metric tons",
    marketShare: "Market Share",
    regionalCropDistribution: "Regional crop distribution",
    priceAlerts: "Price Alerts",
    recentPriceMovements: "Recent price movements",
    marketNews: "Market News",
    latestUpdates: "Latest updates",
    goodTimeToSell: "Good time to sell",
    holdForBetterPrices: "Hold for better prices",
    steadyMarket: "Steady market",
    waitForRecovery: "Wait for recovery",
    reachedTargetPrice: "Reached target price",
    strongUpwardTrend: "Strong upward trend",
    priceCorrection: "Price correction",
    govAnnounceMSP: "Government announces MSP increase for Rabi crops",
    exportDemandRice: "Export demand for rice surges in international markets",
    weatherForecast: "Weather forecast predicts good monsoon this year",
    hoursAgo: "hours ago",
    dayAgo: "day ago",
    month1: "1 Month",
    month3: "3 Months",
    month6: "6 Months",
    year1: "1 Year",
    pricesOver: "prices over",
    
    // Chatbot
    chatTitle: "Farming Assistant",
    bilingualSupport: "Bilingual farming support and guidance",
    typeMessage: "Type your farming question...",
    send: "Send",
    aiAssistant: "AI Assistant",
    askQuestions: "Ask questions about farming, crops, diseases, and market prices in Hindi or English",
    quickQuestions: "Quick Questions",
    clickToAsk: "Click to ask common questions",
    chatWithKisanConnect: "Chat with KisanConnect",
    tips: "Tips for better answers:",
    tipsCrop: "Mention your crop name (wheat, rice, etc.)",
    tipsLocation: "Include your location if asking about weather/market",
    tipsSpecific: "Be specific about the problem you're facing",
    botGreeting: "Hello! I'm your agricultural assistant. I can help you with crops, seeds, soil, diseases, and market information. How can I help you?",
    
    // Quick Questions English
    quickQuestion1: "What is the right time to sow wheat?",
    quickQuestion2: "How to test soil quality?",
    quickQuestion3: "Pests in crops, what to do?",
    quickQuestion4: "What are today's market prices?",
    quickQuestion5: "How to make organic fertilizer?",
    quickQuestion6: "How to care for crops after rain?",
    
    // Bot Responses English
    wheatResponse: "For wheat cultivation:\n\n🌾 **Sowing time**: November-December\n🌡️ **Temperature**: 20-25°C suitable\n💧 **Irrigation**: First irrigation 20-25 days after sowing\n🌱 **Seed rate**: 40-50 kg per acre\n💊 **Fertilizer**: Balanced use of DAP and urea\n\nDo you need any other information?",
    soilResponse: "For soil testing:\n\n🔬 **pH test**: 6.0-7.5 ideal range\n🧪 **Nutrients**: Check N, P, K content\n💧 **Moisture**: Check soil moisture level\n🏢 **Government lab**: Contact nearest agriculture department\n📍 **Private lab**: For immediate reports\n\nUse organic fertilizer for soil improvement.",
    pestResponse: "For pests or diseases in crops:\n\n🔍 **First check**: Identify the pest or disease\n🌿 **Natural remedies**: Neem oil, cow urine spray\n💊 **Medicine**: Consult agricultural expert\n⏰ **Right time**: Morning or evening best for spraying\n🚫 **Prevention**: Separate infected plants\n\nIf the problem is serious, consult agricultural advisor immediately.",
    priceResponse: "Today's market prices:\n\n🌾 **Wheat**: ₹2,320 per quintal (+8.2%)\n🍚 **Rice**: ₹2,050 per quintal (+11.1%)\n🎯 **Sugarcane**: ₹380 per quintal (+8.6%)\n🌱 **Cotton**: ₹7,850 per quintal (-2.3%)\n\n📈 **Suggestion**: Good demand for wheat and rice, good time to sell.\n\n💡 **Tip**: Market prices change daily, check multiple places before selling.",
    organicResponse: "Method to make organic fertilizer:\n\n🥬 **Materials**: Green leaves, cow dung, soil\n⏱️ **Time**: Ready in 45-60 days\n🌊 **Moisture**: Maintain proper moisture\n🔄 **Mixing**: Turn once every 15 days\n🌡️ **Temperature**: Keep in shade\n\n**Benefits**:\n✅ Improves soil quality\n✅ Reduces cost\n✅ Good for environment\n\nVermicompost is also a good option.",
    rainResponse: "Crop care after rain:\n\n💧 **Drain water**: Remove standing water from field\n🌱 **Aeration**: Increase air circulation in soil\n💊 **Fungicide**: To prevent fungal diseases\n🌿 **Leaf fall**: Normal, don't worry\n⚡ **Immediate action**: Drainage needed within 24 hours\n\n**Precautions**:\n⚠️ Don't enter field while water is there\n⚠️ Keep electrical equipment away",
    
    defaultResponse1: "That's a very good question! I'll try to help you. Please explain your question in a bit more detail.",
    defaultResponse2: "This is an important issue in agriculture. If I get more information about your area and crop, I can give better advice.",
    defaultResponse3: "I can give you general information on this topic. For specific advice, also contact local agricultural experts.",
    
    // Common
    back: "Back",
    next: "Next",
    submit: "Submit",
    cancel: "Cancel",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    tryAgain: "Try Again",
    rupees: "₹",
    perKg: "/kg",
    acres: "acres",
    days: "days",
    
    // Language Selector
    selectLanguage: "Select Language",
    english: "English",
    hindi: "हिंदी",
    
    // Auth & User
    welcome: "Welcome",
    logout: "Logout",
    profile: "Profile",
    notifications: "Notifications",
    refreshData: "Refresh Data",
    
    // ML Recommendation
    mlRecommendation: "ML Recommendation",
    aiPowered: "AI-Powered",
    processing: "Processing",
    analyzing: "Analyzing",
    confidence: "Confidence",
    factors: "Factors",
    parameters: "Parameters",
    
    // Disease Detection
    uploadImage: "Upload Image",
    selectImage: "Select Image",
    analyzing: "Analyzing",
    healthy: "Healthy",
    infected: "Infected",
    saveAnalysis: "Save Analysis",
    analyzeAnother: "Analyze Another",
    
    // Market
    refresh: "Refresh",
    loading: "Loading",
    updated: "Updated",
    prices: "Prices",
    volume: "Volume",
    
    // Voice Assistant
    voiceAssistant: "Voice Assistant",
    voiceChat: "Voice Chat",
    startRecording: "Start Recording",
    stopRecording: "Stop Recording",
    listening: "Listening...",
    speaking: "Speaking...",
    tapToSpeak: "Tap to Speak",
    voiceNotSupported: "Voice not supported in your browser",
    
    // Voice Features Extended
    voiceBotGreeting: "Hello! I am your voice assistant. You can speak to me and I will help you with farming questions.",
    noSpeechDetected: "No speech detected. Please try again.",
    microphoneError: "Microphone access denied.",
    microphonePermission: "Microphone permission required.",
    networkError: "Network error occurred.",
    speechError: "Speech recognition error occurred.",
    voiceErrorResponse: "Sorry, I encountered an error. Please try again.",
    speechSynthesisError: "Speech synthesis error occurred.",
    microphoneStartError: "Failed to start microphone.",
    micEnabled: "Mic Enabled",
    micDisabled: "Mic Disabled",
    speakerEnabled: "Speaker Enabled", 
    speakerDisabled: "Speaker Disabled",
    startListening: "Start Listening",
    stopListening: "Stop Listening",
    stopSpeaking: "Stop Speaking",
    speaker: "Speaker",
    clear: "Clear",
    ready: "Ready",
    voiceInstructions: "Tap the microphone to start speaking. Ask me about crops, diseases, weather, or market prices.",
    
    // Permission & Setup
    microphonePermissionRequired: "Microphone Permission Required",
    permissionInstructions: "To use voice features:",
    permissionStep1: "Click the microphone icon in your browser's address bar",
    permissionStep2: "Select 'Allow' when prompted for microphone access", 
    permissionStep3: "Reload the page if needed",
    httpsRequired: "Note: Voice features require HTTPS connection",
    checkingPermission: "Checking permission...",
    close: "Close",
    enableMic: "Enable Mic",
    checking: "Checking...",
    noMicrophoneFound: "No microphone found on this device",
    speechServiceError: "Speech service unavailable",
    speechNotRecognized: "Speech not recognized. Please try again.",
    microphoneBlocked: "Microphone Blocked",
    microphoneBlockedDesc: "To use voice chat, please enable microphone access in your browser settings.",
    showInstructions: "Show Instructions",
    forMobile: "For Mobile Devices:",
    mobileStep1: "Look for camera/microphone icon next to the URL",
    mobileStep2: "Tap 'Allow' or 'Grant Permission'",
    mobileStep3: "Refresh the page",
    forDesktop: "For Desktop Browsers:",
    desktopStep1: "Click the microphone icon in the address bar",
    desktopStep2: "Select 'Always allow' for this site", 
    desktopStep3: "Reload the page if needed",
    troubleshootingNote: "Still having issues?",
    clearCacheNote: "Try clearing your browser cache and cookies, then restart the browser.",
    securityNote: "Security Note:",
    
    // Weather
    weather: "Weather",
    currentWeather: "Current Weather",
    forecast: "Forecast",
    todaysWeather: "Today's Weather",
    weatherConditions: "Weather Conditions",
    feelsLike: "Feels like",
    wind: "Wind",
    pressure: "Pressure",
    visibility: "Visibility",
    uvIndex: "UV Index",
    dewPoint: "Dew Point",
    windDirection: "Wind Direction",
    growingConditions: "Growing Conditions",
    soilMoisture: "Soil Moisture",
    agriculturalInsights: "Agricultural Insights",
    irrigation: "Irrigation",
    planting: "Planting",
    harvesting: "Harvesting",
    diseaseRisk: "Disease Risk",
    recommendations: "Recommendations",
    alerts: "Alerts",
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
    weatherWarning: "Weather Warning",
    weatherAlert: "Weather Alert",
    lastUpdated: "Last Updated",
    
    // Common Actions
    upload: "Upload",
    save: "Save",
    cancel: "Cancel",
    continue: "Continue",
    retry: "Retry"
  },
  hi: {
    // App Header
    appName: "किसानकनेक्ट",
    appSubtitle: "किसान का मित्र",
    
    // Navigation
    home: "होम",
    crops: "फसल",
    scan: "स्कैन",
    market: "बाज़ार",
    chat: "चैट",
    
    // Dashboard
    welcomeBack: "वापस स्वागत है",
    farmingAssistant: "आपका स्मार्ट खेती सहायक",
    quickActions: "त्वरित कार्य",
    cropRecommendation: "फसल सिफारिश",
    cropRecommendationDesc: "अपनी मिट्टी और जलवायु के आधार पर व्यक्तिगत फसल सुझाव प्राप्त करें",
    diseaseDetection: "रोग जांच",
    diseaseDetectionDesc: "AI-संचालित छवि विश्लेषण का उपयोग करके पौधों की बीमारियों की पहचान करें",
    marketAnalysis: "बाज़ार विश्लेषण",
    marketAnalysisDesc: "फसल की कीमतों और बाज़ार के रुझान को ट्रैक करें",
    chatAssistant: "चैट सहायक",
    chatAssistantDesc: "तत्काल खेती की सलाह और सहायता प्राप्त करें",
    todaysWeather: "आज का मौसम",
    temperature: "तापमान",
    humidity: "आर्द्रता",
    rainfall: "वर्षा",
    recentUpdates: "हाल की अपडेट",
    newPestAlert: "आपके क्षेत्र में गेहूं की फसल के लिए नए कीट की चेतावनी",
    marketPriceUpdate: "बाज़ार मूल्य अपडेट: टमाटर की कीमतों में 15% की वृद्धि",
    weatherWarning: "मौसम चेतावनी: अगले सप्ताह भारी बारिश की उम्मीद",
    
    // Crop Recommendation
    cropRecommendationTitle: "फसल सिफारिश",
    getPersonalizedSuggestions: "अपनी खेत की स्थितियों के आधार पर व्यक्तिगत फसल सुझाव प्राप्त करें",
    soilType: "मिट्टी का प्रकार",
    selectSoilType: "मिट्टी का प्रकार चुनें",
    clayey: "चिकनी मिट्टी",
    sandy: "रेतीली मिट्टी",
    loamy: "दोमट मिट्टी",
    silty: "गाद मिट्टी",
    location: "स्थान",
    enterLocation: "अपना स्थान दर्ज करें",
    season: "मौसम",
    selectSeason: "मौसम चुनें",
    kharif: "खरीफ (मानसून)",
    rabi: "रबी (सर्दी)",
    zaid: "जायद (गर्मी)",
    farmSize: "खेत का आकार (एकड़)",
    enterFarmSize: "खेत का आकार दर्ज करें",
    getRecommendations: "सिफारिशें प्राप्त करें",
    recommendedCrops: "सुझाई गई फसलें",
    estimatedYield: "अनुमानित उपज",
    profitPotential: "लाभ की संभावना",
    growthDuration: "वृद्धि अवधि",
    waterRequirement: "पानी की आवश्यकता",
    moderate: "मध्यम",
    high: "उच्च",
    low: "कम",
    months: "महीने",
    
    // Disease Detection
    diseaseDetectionTitle: "रोग जांच",
    aiPoweredAnalysis: "AI-संचालित पौधों की बीमारी की पहचान",
    uploadPlantImage: "पौधे की छवि अपलोड करें",
    dragDropImage: "यहाँ एक छवि खींचें और छोड़ें, या चुनने के लिए क्लिक करें",
    analyzeImage: "छवि का विश्लेषण करें",
    analysisResults: "विश्लेषण परिणाम",
    confidence: "विश्वास",
    treatment: "उपचार",
    prevention: "बचाव",
    
    // Market Analysis
    marketAnalysisTitle: "बाज़ार विश्लेषण",
    cropPricesAndTrends: "फसल की कीमतों, बाज़ार के रुझान को ट्रैक करें और बिक्री की सिफारिशें प्राप्त करें",
    priceChart: "मूल्य चार्ट (पिछले 30 दिन)",
    currentPrice: "वर्तमान मूल्य",
    priceChange: "मूल्य परिवर्तन",
    marketTrends: "बाज़ार के रुझान",
    demandStatus: "मांग की स्थिति",
    todaysNews: "आज के बाज़ार समाचार",
    priceAlert: "मूल्य चेतावनी: इस सप्ताह प्याज की कीमतों में 20% की वृद्धि",
    demandIncrease: "मेट्रो शहरों में जैविक सब्जियों की अधिक मांग",
    exportOpportunity: "निर्यात अवसर: चावल की कीमतें अंतर्राष्ट्रीय व्यापार के लिए अनुकूल",
    
    // Market Analysis Extended
    wheat: "गेहूं",
    rice: "चावल",
    sugarcane: "गन्ना",
    cotton: "कपास",
    maize: "मक्का",
    barley: "जौ",
    jowar: "ज्वार",
    bajra: "बाजरा",
    ragi: "रागी",
    mustard: "सरसों",
    sunflower: "सूरजमुखी",
    groundnut: "मूंगफली",
    soybean: "सोयाबीन",
    chickpea: "चना",
    lentil: "मसूर",
    blackgram: "उड़द",
    greengram: "मूंग",
    pigeonpea: "अरहर",
    sesame: "तिल",
    safflower: "कुसुम",
    castor: "अरंडी",
    turmeric: "हल्दी",
    cumin: "जीरा",
    coriander: "धनिया",
    fenugreek: "मेथी",
    onion: "प्याज",
    potato: "आलू",
    tomato: "टमाटर",
    chili: "मिर्च",
    priceTrends: "मूल्य रुझान",
    tradingVolume: "व्यापारिक मात्रा",
    monthlyTradingVolumes: "मासिक व्यापारिक मात्रा मेट्रिक टन में",
    marketShare: "बाज़ार हिस्सेदारी",
    regionalCropDistribution: "क्षेत्रीय फसल वितरण",
    priceAlerts: "मूल्य अलर्ट",
    recentPriceMovements: "हाल की मूल्य गतिविधियां",
    marketNews: "बाज़ार समाचार",
    latestUpdates: "नवीनतम अपडेट",
    goodTimeToSell: "बेचने का अच्छा समय",
    holdForBetterPrices: "बेहतर कीमतों के लिए प्रतीक्षा करें",
    steadyMarket: "स्थिर बाज़ार",
    waitForRecovery: "रिकवरी की प्रतीक्षा करें",
    reachedTargetPrice: "लक्ष्य मूल्य तक पहुंचा",
    strongUpwardTrend: "मजबूत ऊपरी रुझान",
    priceCorrection: "मूल्य सुधार",
    govAnnounceMSP: "सरकार ने रबी फसलों के लिए MSP वृद्धि की घोषणा की",
    exportDemandRice: "अंतर्राष्ट्रीय बाजारों में चावल की निर्यात मांग बढ़ी",
    weatherForecast: "मौसम पूर्वानुमान इस वर्ष अच्छे मानसून की भविष्यवाणी करता है",
    hoursAgo: "घंटे पहले",
    dayAgo: "दिन पहले",
    month1: "1 महीना",
    month3: "3 महीने",
    month6: "6 महीने",
    year1: "1 साल",
    pricesOver: "की कीमतें",
    
    // Chatbot
    chatTitle: "खेती सहायक",
    bilingualSupport: "द्विभाषी खेती सहायता और मार्गदर्शन",
    typeMessage: "अपना खेती का प्रश्न टाइप करें...",
    send: "भेजें",
    aiAssistant: "AI सहायक",
    askQuestions: "हिंदी या अंग्रेजी में खेती, फसल, बीमारी और बाज़ार की कीमतों के बारे में प्रश्न पूछें",
    quickQuestions: "त्वरित प्रश्न",
    clickToAsk: "सामान्य प्रश्न पूछने के लिए क्लिक करें",
    chatWithKisanConnect: "किसानकनेक्ट के साथ चैट करें",
    tips: "बेहतर उत्तर के लिए सुझाव:",
    tipsCrop: "अपनी फसल का नाम बताएं (गेहूं, चावल, आदि)",
    tipsLocation: "मौसम/बाज़ार के बारे में पूछते समय अपना स्थान शामिल करें",
    tipsSpecific: "आप जिस समस्या का सामना कर रहे हैं उसके बारे में स्पष्ट रूप से बताएं",
    botGreeting: "नमस्ते! मैं आपका कृषि सहायक हूं। मैं फसल, बीज, मिट्टी, बीमारी, और बाजार के बारे में आपकी मदद कर सकता हूं। आप कैसे मदद चाहते हैं?",
    
    // Quick Questions Hindi
    quickQuestion1: "गेहूं की बुआई का सही समय क्या है?",
    quickQuestion2: "मिट्टी की जांच कैसे करें?",
    quickQuestion3: "फसल में कीड़े लगे हैं, क्या करें?",
    quickQuestion4: "बाजार में आज के भाव क्या हैं?",
    quickQuestion5: "जैविक खाद कैसे बनाएं?",
    quickQuestion6: "बारिश के बाद फसल की देखभाल कैसे करें?",
    
    // Bot Responses Hindi
    wheatResponse: "गेहूं की बुआई के लिए:\n\n🌾 **बुआई का समय**: नवंबर-दिसंबर\n🌡️ **तापमान**: 20-25°C उपयुक्त\n💧 **सिंचाई**: बुआई के 20-25 दिन बाद पहली सिंचाई\n🌱 **बीज दर**: 40-50 किलो प्रति एकड़\n💊 **खाद**: DAP और यूरिया का संतुलित उपयोग\n\nक्या आपको और कोई जानकारी चाहिए?",
    soilResponse: "मिट्टी की जांच के लिए:\n\n🔬 **pH टेस्ट**: 6.0-7.5 आदर्श रेंज\n🧪 **पोषक तत्व**: N, P, K की मात्रा जांचें\n💧 **नमी**: मिट्टी में नमी का स्तर देखें\n🏢 **सरकारी लैब**: नजदीकी कृषि विभाग से संपर्क करें\n📍 **निजी लैब**: तुरंत रिपोर्ट के लिए\n\nमिट्टी सुधार के लिए जैविक खाद का उपयोग करें।",
    pestResponse: "फसल में कीड़े या बीमारी के लिए:\n\n🔍 **पहले जांच लें**: कीड़े या बीमारी की पहचान करें\n🌿 **प्राकृतिक उपाय**: नीम का तेल, गोमूत्र का स्प्रे\n💊 **दवाई**: कृषि विशेषज्ञ की सलाह लें\n⏰ **सही समय**: सुबह या शाम का समय स्प्रे के लिए उत्तम\n🚫 **बचाव**: संक्रमित पौधों को अलग करें\n\nयदि समस्या गंभीर है तो तुरंत कृषि सलाहकार से मिलें।",
    priceResponse: "आज के बाजार भाव:\n\n🌾 **गेहूं**: ₹2,320 प्रति क्विंटल (+8.2%)\n🍚 **चावल**: ₹2,050 प्रति क्विंटल (+11.1%)\n🎯 **गन्ना**: ₹380 प्रति क्विंटल (+8.6%)\n🌱 **कपास**: ₹7,850 प्रति क्विंटल (-2.3%)\n\n📈 **सुझाव**: गेहूं और चावल की मांग अच्छी है, बेचने का अच्छा समय है।\n\n💡 **टिप**: बाजार के भाव रोज बदलते रहते हैं, बेचने से पहले कई जगह भाव पूछें।",
    organicResponse: "जैविक खाद बनाने की विधि:\n\n🥬 **सामग्री**: हरी पत्तियां, गोबर, मिट्टी\n⏱️ **समय**: 45-60 दिन में तैयार\n🌊 **नमी**: उचित नमी बनाए रखें\n🔄 **मिलाना**: 15 दिन में एक बार पलटें\n🌡️ **तापमान**: छांव में रखें\n\n**फायदे**:\n✅ मिट्टी की गुणवत्ता बढ़ती है\n✅ लागत कम होती है\n✅ पर्यावरण के लिए अच्छा\n\nवर्मी कंपोस्ट भी एक अच्छा विकल्प है।",
    rainResponse: "बारिश के बाद फसल की देखभाल:\n\n💧 **पानी निकालें**: खेत में जमा पानी निकालें\n🌱 **हवा दें**: मिट्टी में हवा का संचार बढ़ाएं\n💊 **फंगीसाइड**: फफूंद रोग से बचाव के लिए\n🌿 **पत्ती झड़ना**: सामान्य है, घबराएं नहीं\n⚡ **तुरंत कार्य**: 24 घंटे में निकासी जरूरी\n\n**सावधानियां**:\n⚠️ खेत में न जाएं जब तक पानी हो\n⚠️ बिजली के उपकरण दूर रखें",
    
    defaultResponse1: "यह बहुत अच्छा सवाल है! मैं आपकी मदद करने की कोशिश करता हूं। कृपया अपना सवाल थोड़ा और विस्तार से बताएं।",
    defaultResponse2: "कृषि में यह एक महत्वपूर्ण मुद्दा है। आपके क्षेत्र और फसल के बारे में और जानकारी मिले तो बेहतर सलाह दे सकूंगा।",
    defaultResponse3: "इस विषय पर मैं आपको सामान्य जानकारी दे सकता हूं। विशिष्ट सलाह के लिए स्थानीय कृषि विशेषज्ञ से भी संपर्क करें।",
    
    // Common
    back: "वापस",
    next: "अगला",
    submit: "जमा करें",
    cancel: "रद्द करें",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
    tryAgain: "पुनः प्रयास करें",
    rupees: "₹",
    perKg: "/किग्रा",
    acres: "एकड़",
    days: "दिन",
    
    // Language Selector
    selectLanguage: "भाषा चुनें",
    english: "English",
    hindi: "हिंदी",
    
    // Auth & User
    welcome: "स्वागत",
    logout: "लॉग आउट",
    profile: "प्रोफ़ाइल",
    notifications: "सूचनाएं",
    refreshData: "डेटा रीफ्रेश करें",
    
    // ML Recommendation
    mlRecommendation: "एमएल सिफारिश",
    aiPowered: "AI-संचालित",
    processing: "प्रसंस्करण",
    analyzing: "विश्लेषण",
    confidence: "विश्वास",
    factors: "कारक",
    parameters: "पैरामीटर",
    
    // Disease Detection
    uploadImage: "छवि अपलोड करें",
    selectImage: "छवि चुनें",
    analyzing: "विश्लेषण",
    healthy: "स्वस्थ",
    infected: "संक्रमित",
    saveAnalysis: "विश्लेषण सेव करें",
    analyzeAnother: "दूसरा विश्लेषण करें",
    
    // Market
    refresh: "रीफ्रेश",
    loading: "लोड हो रहा है",
    updated: "अपडेट किया गया",
    prices: "कीमतें",
    volume: "मात्रा",
    
    // Weather
    weather: "मौसम",
    currentWeather: "वर्तमान मौसम",
    forecast: "पूर्वानुमान",
    todaysWeather: "आज का मौसम",
    weatherConditions: "मौसम की स्थिति",
    feelsLike: "महसूस होता है",
    wind: "हवा",
    pressure: "दबाव",
    visibility: "दृश्यता",
    uvIndex: "UV इंडेक्स",
    dewPoint: "ओस बिंदु",
    windDirection: "हवा की दिशा",
    growingConditions: "वृद्धि स्थितियां",
    soilMoisture: "मिट्टी की नमी",
    agriculturalInsights: "कृषि अंतर्दृष्टि",
    irrigation: "सिंचाई",
    planting: "रोपण",
    harvesting: "कटाई",
    diseaseRisk: "रोग जोखिम",
    recommendations: "सिफारिशें",
    alerts: "अलर्ट",
    excellent: "उत्कृष्ट",
    good: "अच्छा",
    fair: "ठीक",
    poor: "खराब",
    weatherWarning: "मौसम चेतावनी",
    weatherAlert: "मौसम अलर्ट",
    lastUpdated: "अंतिम बार अपडेट किया गया",
    
    // Common Actions
    upload: "अपलोड",
    save: "सेव",
    cancel: "रद्द करें",
    continue: "जारी रखें",
    retry: "पुनः प्रयास",
    
    // Voice Assistant Extended Hindi  
    microphonePermissionRequired: "माइक्रोफोन अनुमति आवश्यक",
    permissionInstructions: "आवाज सुविधाओं का उपयोग करने के लिए:",
    permissionStep1: "अपने ब्राउज़र के एड्रेस बार में माइक्रोफोन आइकन पर क्लिक करें",
    permissionStep2: "माइक्रोफोन एक्सेस के लिए पूछे जाने पर 'अनुमति दें' चुनें",
    permissionStep3: "यदि आवश्यक हो तो पेज रीलोड करें",
    httpsRequired: "नोट: आवाज सुविधाओं के लिए HTTPS कनेक्शन आवश्यक है",
    checkingPermission: "अनुमति जांच रहे हैं...",
    close: "बंद करें",
    enableMic: "माइक चालू करें",
    checking: "जांच रहे हैं...",
    noMicrophoneFound: "इस डिवाइस पर कोई माइक्रोफोन नहीं मिला",
    speechServiceError: "वाक् सेवा अनुपलब्ध",
    speechNotRecognized: "वाक् पहचानी नहीं गई। कृपया पुनः प्रयास करें।",
    microphoneBlocked: "माइक्रोफोन ब्लॉक",
    microphoneBlockedDesc: "आवाज चैट का उपयोग करने के लिए, कृपया अपनी ब्राउज़र सेटिंग्स में माइक्रोफोन एक्सेस सक्षम करें।",
    showInstructions: "निर्देश दिखाएं",
    forMobile: "मोबाइल डिवाइस के लिए:",
    mobileStep1: "URL के बगल में कैमरा/माइक्रोफोन आइकन खोजें",
    mobileStep2: "'अनुमति दें' या 'Grant Permission' दबाएं",
    mobileStep3: "पेज को रीफ्रेश करें",
    forDesktop: "डेस्कटॉप ब्राउज़र के लिए:",
    desktopStep1: "एड्रेस बार में माइक्रोफोन आइकन पर क्लिक करें",
    desktopStep2: "इस साइट के लिए 'हमेशा अनुमति दें' चुनें",
    desktopStep3: "यदि आवश्यक हो तो पेज रीलोड करें",
    troubleshootingNote: "अभी भी समस्या हो रही है?",
    clearCacheNote: "अपना ब्राउज़र कैश और कुकीज़ साफ़ करके, फिर ब्राउज़र को रीस्टार्ट करें।",
    securityNote: "सुरक्षा नोट:"
  },
  
  // Marathi translations
  mr: {
    // App Header
    appName: "किसानकनेक्ट",
    appSubtitle: "शेतकऱ्याचा मित्र",
    
    // Navigation
    home: "होम",
    crops: "पीक",
    scan: "स्कॅन",
    market: "बाजार",
    chat: "चॅट",
    
    // Dashboard
    welcomeBack: "पुन्हा स्वागत",
    farmingAssistant: "तुमचा हुशार शेती सहाय्यक",
    quickActions: "त्वरित कृती",
    cropRecommendation: "पीक शिफारस",
    cropRecommendationDesc: "तुमच्या माती आणि हवामानावर आधारित वैयक्तिक पीक सूचना मिळवा",
    diseaseDetection: "रोग तपासणी",
    diseaseDetectionDesc: "AI-चालित प्रतिमा विश्लेषण वापरून वनस्पती रोगांची ओळख करा",
    marketAnalysis: "बाजार विश्लेषण",
    marketAnalysisDesc: "पीक किंमती आणि बाजार ट्रेंड ट्रॅक करा",
    chatAssistant: "चॅट सहाय्यक",
    chatAssistantDesc: "तात्काळ शेती सल्ला आणि मदत मिळवा",
    todaysWeather: "आजचे हवामान",
    temperature: "तापमान",
    humidity: "आर्द्रता",
    rainfall: "पाऊस",
    
    // Basic terms
    selectLanguage: "भाषा निवडा",
    english: "English",
    hindi: "हिंदी",
    marathi: "मराठी",
    gujarati: "ગુજરાતી",
    punjabi: "ਪੰਜਾਬੀ",
    bengali: "বাংলা",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    
    // Voice Assistant
    voiceAssistant: "आवाज सहाय्यक",
    voiceChat: "आवाज चॅट",
    startRecording: "रेकॉर्डिंग सुरू करा",
    stopRecording: "रेकॉर्डिंग थांबवा",
    listening: "ऐकत आहे...",
    speaking: "बोलत आहे...",
    tapToSpeak: "बोलण्यासाठी दाबा",
    voiceNotSupported: "तुमच्या ब्राउझरमध्ये आवाज समर्थन नाही",
    
    // Common
    loading: "लोड होत आहे...",
    error: "त्रुटी",
    success: "यश",
    submit: "सबमिट करा",
    cancel: "रद्द करा",
    continue: "सुरू ठेवा",
    
    // Chatbot responses
    botGreeting: "नमस्कार! मी तुमचा कृषी सहाय्यक आहे. मी पीक, बियाणे, माती, रोग आणि बाजार माहितीसाठी मदत करू शकतो. तुम्हाला कशी मदत हवी?",
    quickQuestion1: "गहूचे पेरणीचे योग्य वेळ काय आहे?",
    quickQuestion2: "मातीची तपासणी कशी करावी?",
    quickQuestion3: "पिकांमध्ये कीड लागले आहेत, काय करावे?",
    quickQuestion4: "बाजारात आजचे भाव काय आहेत?",
    typeMessage: "तुमचा शेती प्रश्न टाइप करा...",
    send: "पाठवा"
  },
  
  // Gujarati translations
  gu: {
    // App Header
    appName: "કિસાનકનેક્ટ",
    appSubtitle: "ખેડૂતનો મિત્ર",
    
    // Navigation
    home: "હોમ",
    crops: "પાક",
    scan: "સ્કૅન",
    market: "બજાર",
    chat: "ચૅટ",
    
    // Dashboard
    welcomeBack: "પાછા આવવા બદલ સ્વાગત",
    farmingAssistant: "તમારો સ્માર્ટ ખેતી સહાયક",
    quickActions: "ઝડપી ક્રિયાઓ",
    cropRecommendation: "પાક ભલામણ",
    cropRecommendationDesc: "તમારી માટી અને હવામાનના આધારે વ્યક્તિગત પાક સૂચનો મેળવો",
    diseaseDetection: "રોગ તપાસ",
    diseaseDetectionDesc: "AI-સંચાલિત છબી વિશ્લેષણ વાપરીને છોડના રોગોની ઓળખ કરો",
    marketAnalysis: "બજાર વિશ્લેષણ",
    marketAnalysisDesc: "પાકની કિંમતો અને બજારના વલણોને ટ્રૅક કરો",
    chatAssistant: "ચૅટ સહાયક",
    chatAssistantDesc: "તાત્કાલિક ખેતી સલાહ અને સહાય મેળવો",
    todaysWeather: "આજનું હવામાન",
    temperature: "તાપમાન",
    humidity: "ભેજ",
    rainfall: "વરસાદ",
    
    // Basic terms
    selectLanguage: "ભાષા પસંદ કરો",
    english: "English",
    hindi: "हिंदी",
    marathi: "मराठी",
    gujarati: "ગુજરાતી",
    punjabi: "ਪੰਜਾਬੀ",
    bengali: "বাংলা",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    
    // Voice Assistant
    voiceAssistant: "આવાજ સહાયક",
    voiceChat: "આવાજ ચૅટ",
    startRecording: "રેકોર્ડિંગ શરૂ કરો",
    stopRecording: "રેકોર્ડિંગ બંધ કરો",
    listening: "સાંભળી રહ્યું છે...",
    speaking: "બોલી રહ્યું છે...",
    tapToSpeak: "બોલવા માટે દબાવો",
    voiceNotSupported: "તમારા બ્રાઉઝરમાં આવાજ સપોર્ટ નથી",
    
    // Common
    loading: "લોડ થઈ રહ્યું છે...",
    error: "ભૂલ",
    success: "સફળતા",
    submit: "સબમિટ કરો",
    cancel: "રદ કરો",
    continue: "ચાલુ રાખો",
    
    // Chatbot responses
    botGreeting: "નમસ્તે! હું તમારો કૃષિ સહાયક છું. હું પાક, બીજ, માટી, રોગ અને બજારની માહિતી માટે મદદ કરી શકું છું. તમને કેવી મદદ જોઈએ?",
    quickQuestion1: "ઘઉંની વાવણીનો યોગ્ય સમય શું છે?",
    quickQuestion2: "માટીની તપાસ કેવી રીતે કરવી?",
    quickQuestion3: "પાકમાં જીવાતો લાગ્યા છે, શું કરવું?",
    quickQuestion4: "બજારમાં આજના ભાવ શું છે?",
    typeMessage: "તમારો ખેતીનો પ્રશ્ન ટાઈપ કરો...",
    send: "મોકલો"
  },
  
  // Punjabi translations
  pa: {
    // App Header
    appName: "ਕਿਸਾਨਕਨੈਕਟ",
    appSubtitle: "ਕਿਸਾਨ ਦਾ ਮਿੱਤਰ",
    
    // Navigation
    home: "ਹੋਮ",
    crops: "ਫਸਲ",
    scan: "ਸਕੈਨ",
    market: "ਮੰਡੀ",
    chat: "ਚੈਟ",
    
    // Dashboard
    welcomeBack: "ਵਾਪਸ ਆਉਣ ਲਈ ਸੁਆਗਤ",
    farmingAssistant: "ਤੁਹਾਡਾ ਸਮਾਰਟ ਖੇਤੀ ਸਹਾਇਕ",
    quickActions: "ਤੇਜ਼ ਕਾਰਵਾਈਆਂ",
    cropRecommendation: "ਫਸਲ ਸਿਫਾਰਸ਼",
    cropRecommendationDesc: "ਆਪਣੀ ਮਿੱਟੀ ਅਤੇ ਮੌਸਮ ਦੇ ਆਧਾਰ 'ਤੇ ਵਿਅਕਤੀਗਤ ਫਸਲ ਸੁਝਾਅ ਪ੍ਰਾਪਤ ਕਰੋ",
    diseaseDetection: "ਬਿਮਾਰੀ ਜਾਂਚ",
    diseaseDetectionDesc: "AI-ਸੰਚਾਲਿਤ ਚਿੱਤਰ ਵਿਸ਼ਲੇਸ਼ਣ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਪੌਧਿਆਂ ਦੀਆਂ ਬਿਮਾਰੀਆਂ ਦੀ ਪਛਾਣ ਕਰੋ",
    marketAnalysis: "ਮੰਡੀ ਵਿਸ਼ਲੇਸ਼ਣ",
    marketAnalysisDesc: "ਫਸਲ ਦੀਆਂ ਕੀਮਤਾਂ ਅਤੇ ਮੰਡੀ ਦੇ ਰੁਝਾਨਾਂ ਨੂੰ ਟਰੈਕ ਕਰੋ",
    chatAssistant: "ਚੈਟ ਸਹਾਇਕ",
    chatAssistantDesc: "ਤੁਰੰਤ ਖੇਤੀ ਸਲਾਹ ਅਤੇ ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕਰੋ",
    todaysWeather: "ਅੱਜ ਦਾ ਮੌਸਮ",
    temperature: "ਤਾਪਮਾਨ",
    humidity: "ਨਮੀ",
    rainfall: "ਬਾਰਿਸ਼",
    
    // Basic terms
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    english: "English",
    hindi: "हिंदी",
    marathi: "मराठी",
    gujarati: "ગુજરાતી",
    punjabi: "ਪੰਜਾਬੀ",
    bengali: "বাংলা",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    
    // Voice Assistant
    voiceAssistant: "ਆਵਾਜ਼ ਸਹਾਇਕ",
    voiceChat: "ਆਵਾਜ਼ ਚੈਟ",
    startRecording: "ਰਿਕਾਰਡਿੰਗ ਸ਼ੁਰੂ ਕਰੋ",
    stopRecording: "ਰਿਕਾਰਡਿੰਗ ਰੋਕੋ",
    listening: "ਸੁਣ ਰਿਹਾ ਹੈ...",
    speaking: "ਬੋਲ ਰਿਹਾ ਹੈ...",
    tapToSpeak: "ਬੋਲਣ ਲਈ ਦਬਾਓ",
    voiceNotSupported: "ਤੁਹਾਡੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਆਵਾਜ਼ ਸਪੋਰਟ ਨਹੀਂ ਹੈ",
    
    // Common
    loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    error: "ਗਲਤੀ",
    success: "ਸਫਲਤਾ",
    submit: "ਸਪੁਰਦ ਕਰੋ",
    cancel: "ਰੱਦ ਕਰੋ",
    continue: "ਜਾਰੀ ਰੱਖੋ",
    
    // Chatbot responses
    botGreeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਫਸਲ, ਬੀਜ, ਮਿੱਟੀ, ਬਿਮਾਰੀ ਅਤੇ ਮੰਡੀ ਦੀ ਜਾਣਕਾਰੀ ਲਈ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਕਿਵੇਂ ਮਦਦ ਚਾਹੁੰਦੇ ਹੋ?",
    quickQuestion1: "ਕਣਕ ਦੀ ਬਿਜਾਈ ਦਾ ਸਹੀ ਸਮਾਂ ਕੀ ਹੈ?",
    quickQuestion2: "ਮਿੱਟੀ ਦੀ ਜਾਂਚ ਕਿਵੇਂ ਕਰੀਏ?",
    quickQuestion3: "ਫਸਲ ਵਿੱਚ ਕੀੜੇ ਲੱਗੇ ਹਨ, ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ?",
    quickQuestion4: "ਮੰਡੀ ਵਿੱਚ ਅੱਜ ਦੇ ਭਾਅ ਕੀ ਹਨ?",
    typeMessage: "ਆਪਣਾ ਖੇਤੀ ਪ੍ਰਸ਼ਨ ਟਾਈਪ ਕਰੋ...",
    send: "ਭੇਜੋ"
  },
  
  // Bengali translations
  bn: {
    // App Header
    appName: "কিষানমিত্র",
    appSubtitle: "কৃষকের বন্ধু",
    
    // Navigation
    home: "হোম",
    crops: "ফসল",
    scan: "স্ক্যান",
    market: "বাজার",
    chat: "চ্যাট",
    
    // Dashboard
    welcomeBack: "ফিরে আসার জন্য স্বাগতম",
    farmingAssistant: "আপনার স্মার্ট কৃষি সহায়ক",
    quickActions: "দ্রুত কার্যাবলী",
    cropRecommendation: "ফসল সুপারিশ",
    cropRecommendationDesc: "আপনার মাটি এবং জলবায়ুর ভিত্তিতে ব্যক্তিগত ফসলের পরামর্শ পান",
    diseaseDetection: "রোগ নির্ণয়",
    diseaseDetectionDesc: "AI-চালিত ছবি বিশ্লেষণ ব্যবহার করে উদ্ভিদের রোগ চিহ্নিত করুন",
    marketAnalysis: "বাজার বিশ্লেষণ",
    marketAnalysisDesc: "ফসলের দাম এবং বাজারের প্রবণতা ট্র্যাক করুন",
    chatAssistant: "চ্যাট সহায়ক",
    chatAssistantDesc: "তাৎক্ষণিক কৃষি পরামর্শ এবং সহায়তা পান",
    todaysWeather: "আজকের আবহাওয়া",
    temperature: "তাপমাত্রা",
    humidity: "আর্দ্রতা",
    rainfall: "বৃষ্টিপাত",
    
    // Basic terms
    selectLanguage: "ভাষা নির্বাচন করুন",
    english: "English",
    hindi: "हिंदी",
    marathi: "मराठी",
    gujarati: "ગુજરાતી",
    punjabi: "ਪੰਜਾਬੀ",
    bengali: "বাংলা",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    
    // Voice Assistant
    voiceAssistant: "ভয়েস সহায়ক",
    voiceChat: "ভয়েস চ্যাট",
    startRecording: "রেকর্ডিং শুরু করুন",
    stopRecording: "রেকর্ডিং বন্ধ করুন",
    listening: "শুনছে...",
    speaking: "বলছে...",
    tapToSpeak: "কথা বলার জন্য চাপুন",
    voiceNotSupported: "আপনার ব্রাউজারে ভয়েস সাপোর্ট নেই",
    
    // Common
    loading: "লোড হচ্ছে...",
    error: "ত্রুটি",
    success: "সফলতা",
    submit: "জমা দিন",
    cancel: "বাতিল করুন",
    continue: "চালিয়ে যান",
    
    // Chatbot responses
    botGreeting: "নমস্কার! আমি আপনার কৃষি সহায়ক। আমি ফসল, বীজ, মাটি, রোগ এবং বাজারের তথ্যের জন্য সাহায্য করতে পারি। আপনার কেমন সাহায্য দরকার?",
    quickQuestion1: "গমের বপনের সঠিক সময় কী?",
    quickQuestion2: "মাটি পরীক্ষা কীভাবে করব?",
    quickQuestion3: "ফসলে পোকা লেগেছে, কী করব?",
    quickQuestion4: "বাজারে আজকের দাম কত?",
    typeMessage: "আপনার কৃষি প্রশ্ন টাইপ করুন...",
    send: "পাঠান"
  },
  
  // Tamil translations
  ta: {
    // App Header
    appName: "கிசான்மித்ரா",
    appSubtitle: "விவசாயியின் நண்பன்",
    
    // Navigation
    home: "ஹோம்",
    crops: "பயிர்",
    scan: "ஸ்கேன்",
    market: "சந்தை",
    chat: "அரட்டை",
    
    // Dashboard
    welcomeBack: "மீண்டும் வருக",
    farmingAssistant: "உங்கள் புத்திசாலி விவசாய உதவியாளர்",
    quickActions: "விரைவு செயல்கள்",
    cropRecommendation: "பயிர் பரிந்துரை",
    cropRecommendationDesc: "உங்கள் மண் மற்றும் காலநிலையின் அடிப்படையில் தனிப்பட்ட பயிர் பரிந்துரைகளைப் பெறுங்கள்",
    diseaseDetection: "நோய் கண்டறிதல்",
    diseaseDetectionDesc: "AI-இயங்கும் படம் பகுப்பாய்வைப் பயன்படுத்தி தாவர நோய்களை அடையாளம் காணுங்கள்",
    marketAnalysis: "சந்தை பகுப்பாய்வு",
    marketAnalysisDesc: "பயிர் விலைகள் மற்றும் சந்தை போக்குகளைக் கண்காணிக்கவும்",
    chatAssistant: "அரட்டை உதவியாளர்",
    chatAssistantDesc: "உடனடி விவசாய ஆலோசனை மற்றும் உதவி பெறுங்கள்",
    todaysWeather: "இன்றைய வானிலை",
    temperature: "வெப்பநிலை",
    humidity: "ஈரப்பதம்",
    rainfall: "மழைப்பொழிவு",
    
    // Basic terms
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    english: "English",
    hindi: "हिंदी",
    marathi: "मराठी",
    gujarati: "ગુજરાતી",
    punjabi: "ਪੰਜਾਬੀ",
    bengali: "বাংলা",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    
    // Voice Assistant
    voiceAssistant: "குரல் உதவியாளர்",
    voiceChat: "குரல் அரட்டை",
    startRecording: "பதிவை தொடங்கவும்",
    stopRecording: "பதிவை நிறுத்தவும்",
    listening: "கேட்கிறது...",
    speaking: "பேசுகிறது...",
    tapToSpeak: "பேச டேப் செய்யவும்",
    voiceNotSupported: "உங்கள் உலாவியில் குரல் ஆதரவு இல்லை",
    
    // Common
    loading: "ஏற்றுகிறது...",
    error: "பிழை",
    success: "வெற்றி",
    submit: "சமர்ப்பிக்கவும்",
    cancel: "ரத்து செய்யவும்",
    continue: "தொடரவும்",
    
    // Chatbot responses
    botGreeting: "வணக்கம்! நான் உங்கள் விவசாய உதவியாளர். பயிர், விதை, மண், நோய் மற்றும் சந்தை தகவல்களுக்கு உதவ முடியும். எவ்வாறு உதவ வேண்டும்?",
    quickQuestion1: "கோதுமை விதைப்பின் சரியான நேரம் என்ன?",
    quickQuestion2: "மண் பரிசோதனை எப்படி செய்வது?",
    quickQuestion3: "பயிரில் பூச்சிகள் தாக்கியுள்ளன, என்ன செய்வது?",
    quickQuestion4: "சந்தையில் இன்றைய விலை என்ன?",
    typeMessage: "உங்கள் விவசாய கேள்வியை டைப் செய்யவும்...",
    send: "அனுப்பவும்"
  },
  
  // Telugu translations
  te: {
    // App Header
    appName: "కిసాన్‌మిత్ర",
    appSubtitle: "రైతు మిత్రుడు",
    
    // Navigation
    home: "హోమ్",
    crops: "పంట",
    scan: "స్కాన్",
    market: "మార్కెట్",
    chat: "చా��్",
    
    // Dashboard
    welcomeBack: "తిరిగి రావడానికి స్వాగతం",
    farmingAssistant: "మీ స్మార్ట్ వ్యవసాయ సహాయకుడు",
    quickActions: "త్వరిత చర్యలు",
    cropRecommendation: "పంట సిఫా��్సు",
    cropRecommendationDesc: "మీ మట్టి మరియు వాతావరణం ఆధారంగా వ్యక్తిగత పంట సూచనలను పొందండి",
    diseaseDetection: "వ్యాధి గుర్తింపు",
    diseaseDetectionDesc: "AI-ఆధారిత చిత్ర విశ్లేషణను ఉపయోగించి మొక్కల వ్యాధులను గుర్తించండి",
    marketAnalysis: "మార్కెట్ విశ్లేషణ",
    marketAnalysisDesc: "పంట ధరలు మరియు మార్కెట్ ట్రెండ్‌లను ట్రాక్ చేయండి",
    chatAssistant: "చాట్ సహాయకుడు",
    chatAssistantDesc: "తక్షణ వ్యవసాయ సలహా మరియు సహాయం పొందండి",
    todaysWeather: "నేటి ���ాతావరణం",
    temperature: "ఉష్ణోగ్రత",
    humidity: "తేమ",
    rainfall: "వర్షపాతం",
    
    // Basic terms
    selectLanguage: "భాషను ఎంచుకోండి",
    english: "English",
    hindi: "हिंदी",
    marathi: "मराठी",
    gujarati: "ગુજરાતી",
    punjabi: "ਪੰਜਾਬੀ",
    bengali: "বাংলা",
    tamil: "தமிழ்",
    telugu: "తెలుగు",
    
    // Voice Assistant
    voiceAssistant: "వాయిస్ అసిస్టెంట్",
    voiceChat: "వాయిస్ చాట్",
    startRecording: "రికార్డింగ్ ప్రారంభించండి",
    stopRecording: "రికార్డింగ్ ఆపండి",
    listening: "వింటున్నది...",
    speaking: "మాట్లాడుతోంది...",
    tapToSpeak: "మాట్లాడటానికి నొక్కండి",
    voiceNotSupported: "మీ బ్రౌజర్‌లో వాయిస్ సపోర్ట్ లేదు",
    
    // Common
    loading: "లోడ్ అవుతోంది...",
    error: "లోపం",
    success: "విజయం",
    submit: "సమర్పించండి",
    cancel: "రద్దు చేయండి",
    continue: "కొనసాగించండి",
    
    // Chatbot responses
    botGreeting: "నమస్కారం! నేను మీ వ్యవసాయ సహాయకుడను. పంట, విత్తనాలు, మట్టి, వ్యాధులు మరియు మార్కెట్ సమాచారం కోసం సహాయం చేయగలను. మీకు ఎలాంటి సహాయం కావాలి?",
    quickQuestion1: "గోధుమ విత్తనాల సరైన సమయం ఏమిటి?",
    quickQuestion2: "మట్టి పరీక్ష ఎలా చేయాలి?",
    quickQuestion3: "పంటలో కీటకాలు వచ్చాయి, ఏమి చేయాలి?",
    quickQuestion4: "మార్కెట్‌లో నేటి రేట్లు ఎంత?",
    typeMessage: "మీ వ్యవసాయ ప్రశ్నను టైప్ చేయండి...",
    send: "పంపండి"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, params?: Record<string, string | number>): string => {
    // First check crop translations
    const cropTranslation = cropTranslations[language]?.[key as keyof typeof cropTranslations[typeof language]];
    if (cropTranslation) {
      return cropTranslation;
    }
    
    // Then check main translations
    const translation = translations[language][key as keyof typeof translations[typeof language]] || key;
    
    if (params) {
      return Object.entries(params).reduce((str, [paramKey, value]) => {
        return str.replace(`{{${paramKey}}}`, String(value));
      }, translation);
    }
    
    return translation;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};