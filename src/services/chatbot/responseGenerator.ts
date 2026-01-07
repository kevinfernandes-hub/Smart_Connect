// Response Generator for KisanConnect Chatbot
// Generates contextual, action-oriented responses in multiple languages

import { Intent, ClassificationResult, DetectedLanguage } from './intentClassifier';
import { ConversationMemory, hasFarmSize } from './conversationMemory';
import cropsDatabase from '../../knowledge/agri_guides/crops_database.json';

// Maximum lines per response
const MAX_RESPONSE_LINES = 5;

// Response templates for each intent in different languages
interface ResponseTemplate {
  en: string[];
  hi: string[];
  mr: string[];
}

// Follow-up questions for each intent
const FOLLOW_UP_QUESTIONS: Record<Intent, ResponseTemplate> = {
  greeting: {
    en: ['Which crop are you currently growing or planning to grow?'],
    hi: ['आप अभी कौन सी फसल उगा रहे हैं या उगाने की योजना बना रहे हैं?'],
    mr: ['तुम्ही सध्या कोणते पीक घेत आहात किंवा घेण्याची योजना आखत आहात?']
  },
  help: {
    en: ['What specific farming topic would you like help with today?'],
    hi: ['आज किस खेती विषय पर मदद चाहिए?'],
    mr: ['आज कोणत्या शेती विषयावर मदत हवी आहे?']
  },
  thanks: {
    en: ['Is there anything else you need help with?'],
    hi: ['क्या कुछ और मदद चाहिए?'],
    mr: ['अजून काही मदत हवी आहे का?']
  },
  disease_help: {
    en: ['Can you describe the symptoms - what color are the spots/leaves?'],
    hi: ['क्या आप लक्षण बता सकते हैं - दाग/पत्ते किस रंग के हैं?'],
    mr: ['तुम्ही लक्षणे सांगू शकता का - डाग/पाने कोणत्या रंगाचे आहेत?']
  },
  fertilizer_help: {
    en: ['What is your farm size in acres/hectares for accurate dosage?'],
    hi: ['सही खुराक के लिए आपकी जमीन कितने एकड़/हेक्टेयर है?'],
    mr: ['अचूक मात्रेसाठी तुमची जमीन किती एकर/हेक्टर आहे?']
  },
  market_sell_advice: {
    en: ['Which market/mandi are you planning to sell at?'],
    hi: ['आप किस मंडी में बेचने की सोच रहे हैं?'],
    mr: ['तुम्ही कोणत्या बाजारात विकण्याचा विचार करत आहात?']
  },
  weather_advice: {
    en: ['Would you like weather-based recommendations for your crop?'],
    hi: ['क्या आप अपनी फसल के लिए मौसम आधारित सलाह चाहते हैं?'],
    mr: ['तुमच्या पिकासाठी हवामान आधारित सल्ला हवा आहे का?']
  },
  government_scheme: {
    en: ['Have you applied for any schemes? I can guide with registration.'],
    hi: ['क्या आपने किसी योजना के लिए आवेदन किया है? मैं पंजीकरण में मदद कर सकता हूं।'],
    mr: ['तुम्ही कोणत्या योजनेसाठी अर्ज केला आहे का? मी नोंदणीत मदत करू शकतो.']
  },
  crop_info: {
    en: ['What stage is your crop at - sowing, growing, or harvesting?'],
    hi: ['आपकी फसल किस अवस्था में है - बुवाई, बढ़वार, या कटाई?'],
    mr: ['तुमचे पीक कोणत्या टप्प्यावर आहे - पेरणी, वाढ, की काढणी?']
  },
  pest_management: {
    en: ['Have you noticed the pest/insect attacking any specific part of the plant?'],
    hi: ['क्या कीड़े पौधे के किसी विशेष भाग पर हमला कर रहे हैं?'],
    mr: ['किडे रोपाच्या कोणत्या भागावर हल्ला करत आहेत?']
  },
  irrigation_help: {
    en: ['What irrigation system do you have - drip, sprinkler, or flood?'],
    hi: ['आपके पास कौन सी सिंचाई व्यवस्था है - ड्रिप, स्प्रिंकलर, या बाढ़?'],
    mr: ['तुमच्याकडे कोणती सिंचन व्यवस्था आहे - ठिबक, तुषार, की पाट?']
  },
  soil_help: {
    en: ['Have you done a soil test recently? It helps give accurate advice.'],
    hi: ['क्या हाल ही में मिट्टी की जांच कराई है? इससे सही सलाह मिलती है।'],
    mr: ['अलीकडे माती परीक्षण केले आहे का? यामुळे अचूक सल्ला मिळतो.']
  },
  organic_farming: {
    en: ['Are you looking to convert your entire farm to organic or just a portion?'],
    hi: ['क्या पूरी जमीन जैविक करना चाहते हैं या कुछ हिस्सा?'],
    mr: ['संपूर्ण शेती सेंद्रिय करायची आहे की काही भाग?']
  },
  seed_info: {
    en: ['Are you looking for hybrid seeds or traditional varieties?'],
    hi: ['क्या आप हाइब्रिड बीज चाहते हैं या देसी किस्म?'],
    mr: ['तुम्हाला संकरित बियाणे हवे की देशी जाती?']
  },
  harvest_help: {
    en: ['How many days since sowing? This helps determine harvest timing.'],
    hi: ['बुवाई के कितने दिन हुए? इससे कटाई का समय पता चलता है।'],
    mr: ['पेरणीला किती दिवस झाले? यावरून काढणीची वेळ समजते.']
  },
  storage_advice: {
    en: ['What quantity do you need to store and for how long?'],
    hi: ['कितनी मात्रा और कितने समय के लिए भंडारण करना है?'],
    mr: ['किती प्रमाण आणि किती काळासाठी साठवणूक करायची आहे?']
  },
  crop_rotation: {
    en: ['What was your previous crop this season?'],
    hi: ['इस सीजन में पहले कौन सी फसल थी?'],
    mr: ['या हंगामात आधी कोणते पीक होते?']
  },
  season_advice: {
    en: ['Which state/region are you farming in?'],
    hi: ['आप किस राज्य/क्षेत्र में खेती करते हैं?'],
    mr: ['तुम्ही कोणत्या राज्यात/प्रदेशात शेती करता?']
  },
  unknown: {
    en: ['Could you please rephrase or tell me more specifically what help you need?'],
    hi: ['कृपया दोबारा बताएं या स्पष्ट करें कि क्या मदद चाहिए?'],
    mr: ['कृपया पुन्हा सांगा किंवा स्पष्ट करा कोणती मदत हवी आहे?']
  }
};

// Safety guardrail messages
const SAFETY_GUARDRAILS: Record<string, ResponseTemplate> = {
  chemical_dosage_no_farm_size: {
    en: [
      '⚠️ For accurate chemical dosage, I need your farm size.',
      'Wrong dosage can harm crops and environment.',
      'Please tell me your farm area in acres or hectares.'
    ],
    hi: [
      '⚠️ सही दवाई मात्रा के लिए जमीन का आकार जानना जरूरी है।',
      'गलत मात्रा फसल और पर्यावरण को नुकसान पहुंचा सकती है।',
      'कृपया अपनी जमीन एकड़ या हेक्टेयर में बताएं।'
    ],
    mr: [
      '⚠️ अचूक औषध मात्रेसाठी जमिनीचा आकार माहित असणे आवश्यक आहे।',
      'चुकीची मात्रा पिकाला आणि पर्यावरणाला हानी पोहोचवू शकते।',
      'कृपया तुमची जमीन एकर किंवा हेक्टरमध्ये सांगा.'
    ]
  },
  scheme_disclaimer: {
    en: [
      '📋 Scheme details may change. Verify from official sources.',
      'Visit your nearest agricultural office for latest information.'
    ],
    hi: [
      '📋 योजना विवरण बदल सकते हैं। आधिकारिक स्रोतों से सत्यापित करें।',
      'नवीनतम जानकारी के लिए नजदीकी कृषि कार्यालय जाएं।'
    ],
    mr: [
      '📋 योजनांचे तपशील बदलू शकतात. अधिकृत स्रोतांकडून खात्री करा.',
      'नवीनतम माहितीसाठी जवळच्या कृषी कार्यालयात भेट द्या.'
    ]
  }
};

/**
 * Get crop data from knowledge base
 */
function getCropData(cropId: string): any {
  const allCategories = Object.values(cropsDatabase.crops);
  for (const category of allCategories) {
    const crop = (category as any[]).find(c => c.id === cropId);
    if (crop) return crop;
  }
  return null;
}

/**
 * Get scheme data from knowledge base
 */
function getSchemeData(schemeId: string): any {
  return cropsDatabase.governmentSchemes.find(s => s.id === schemeId);
}

/**
 * Format response to max lines
 */
function formatResponse(lines: string[], maxLines: number = MAX_RESPONSE_LINES): string {
  return lines.slice(0, maxLines).join('\n');
}

/**
 * Generate greeting response
 */
function generateGreetingResponse(lang: DetectedLanguage): string {
  const responses: ResponseTemplate = {
    en: [
      '🙏 Namaste! I am your KisanConnect farming expert.',
      '✅ I can help with: crops, diseases, fertilizers, market prices, weather, schemes.',
      '💬 Ask in Hindi, Marathi, or English - I understand all!'
    ],
    hi: [
      '🙏 नमस्ते! मैं आपका किसानकनेक्ट कृषि विशेषज्ञ हूं।',
      '✅ मैं मदद कर सकता हूं: फसल, बीमारी, खाद, बाजार भाव, मौसम, योजनाएं।',
      '💬 हिंदी, मराठी, या अंग्रेजी में पूछें - मैं सब समझता हूं!'
    ],
    mr: [
      '🙏 नमस्कार! मी तुमचा किसानकनेक्ट शेती तज्ञ आहे.',
      '✅ मी मदत करू शकतो: पीक, रोग, खत, बाजारभाव, हवामान, योजना.',
      '💬 हिंदी, मराठी, किंवा इंग्रजीत विचारा - मला सर्व समजते!'
    ]
  };
  return formatResponse(responses[lang]);
}

/**
 * Generate crop info response
 */
function generateCropInfoResponse(
  cropId: string,
  lang: DetectedLanguage,
  context: ConversationMemory
): string {
  const crop = getCropData(cropId);
  if (!crop) {
    return lang === 'hi' 
      ? `इस फसल की जानकारी उपलब्ध नहीं है। कृपया दूसरी फसल पूछें।`
      : lang === 'mr'
      ? `या पिकाची माहिती उपलब्ध नाही. कृपया दुसरे पीक विचारा.`
      : `Information for this crop is not available. Please ask about another crop.`;
  }

  const cropName = crop.names[lang] || crop.names.en;
  const season = cropsDatabase.seasons[crop.season as keyof typeof cropsDatabase.seasons];
  const seasonName = season?.name[lang] || crop.season;

  if (lang === 'hi') {
    return formatResponse([
      `🌾 **${cropName}** - संपूर्ण गाइड:`,
      `📅 बुवाई: ${crop.sowingMonths?.join(', ') || 'N/A'} (${seasonName})`,
      `🌡️ तापमान: ${crop.temperature?.min}-${crop.temperature?.max}°C`,
      `💧 पानी: ${crop.waterRequirement === 'high' ? 'अधिक' : crop.waterRequirement === 'low' ? 'कम' : 'मध्यम'}`,
      `📊 उपज: ${crop.expectedYield?.value} ${crop.expectedYield?.unit}`
    ]);
  } else if (lang === 'mr') {
    return formatResponse([
      `🌾 **${cropName}** - संपूर्ण मार्गदर्शक:`,
      `📅 पेरणी: ${crop.sowingMonths?.join(', ') || 'N/A'} (${seasonName})`,
      `🌡️ तापमान: ${crop.temperature?.min}-${crop.temperature?.max}°C`,
      `💧 पाणी: ${crop.waterRequirement === 'high' ? 'जास्त' : crop.waterRequirement === 'low' ? 'कमी' : 'मध्यम'}`,
      `📊 उत्पादन: ${crop.expectedYield?.value} ${crop.expectedYield?.unit}`
    ]);
  } else {
    return formatResponse([
      `🌾 **${cropName}** - Complete Guide:`,
      `📅 Sowing: ${crop.sowingMonths?.join(', ') || 'N/A'} (${seasonName})`,
      `🌡️ Temperature: ${crop.temperature?.min}-${crop.temperature?.max}°C`,
      `💧 Water: ${crop.waterRequirement} requirement`,
      `📊 Yield: ${crop.expectedYield?.value} ${crop.expectedYield?.unit}`
    ]);
  }
}

/**
 * Generate disease help response
 */
function generateDiseaseResponse(
  lang: DetectedLanguage,
  context: ConversationMemory,
  detectedDisease?: string
): string {
  const disease = detectedDisease || context.problem.diseaseDetected;
  
  if (disease) {
    // Continue from disease detection result
    if (lang === 'hi') {
      return formatResponse([
        `🔬 पहचाना गया: **${disease}**`,
        `✅ तुरंत करें: संक्रमित पत्ते हटाएं`,
        `💊 उपचार: फफूंदनाशक छिड़काव (मैंकोजेब/कार्बेंडाजिम)`,
        `⏰ समय: सुबह या शाम को छिड़काव करें`,
        `🔄 दोहराएं: 10-15 दिन बाद फिर से`
      ]);
    } else if (lang === 'mr') {
      return formatResponse([
        `🔬 ओळखला गेला: **${disease}**`,
        `✅ लगेच करा: बाधित पाने काढा`,
        `💊 उपचार: बुरशीनाशक फवारणी (मॅन्कोझेब/कार्बेन्डाझिम)`,
        `⏰ वेळ: सकाळी किंवा संध्याकाळी फवारणी करा`,
        `🔄 पुनरावृत्ती: 10-15 दिवसांनी पुन्हा`
      ]);
    } else {
      return formatResponse([
        `🔬 Detected: **${disease}**`,
        `✅ Immediate action: Remove infected leaves`,
        `💊 Treatment: Apply fungicide spray (Mancozeb/Carbendazim)`,
        `⏰ Timing: Spray in morning or evening`,
        `🔄 Repeat: After 10-15 days if needed`
      ]);
    }
  }
  
  // General disease advice
  if (lang === 'hi') {
    return formatResponse([
      `🔬 रोग पहचान के लिए:`,
      `📸 "फोटो अपलोड" बटन से पौधे की तस्वीर भेजें`,
      `📝 या बताएं: पत्ते का रंग, दाग का आकार, कौन सा भाग प्रभावित`,
      `⚡ जल्दी पहचान से फसल बचती है!`
    ]);
  } else if (lang === 'mr') {
    return formatResponse([
      `🔬 रोग ओळखण्यासाठी:`,
      `📸 "फोटो अपलोड" बटणाने रोपाचा फोटो पाठवा`,
      `📝 किंवा सांगा: पानांचा रंग, डागाचा आकार, कोणता भाग बाधित`,
      `⚡ लवकर ओळख पिकाला वाचवते!`
    ]);
  } else {
    return formatResponse([
      `🔬 For disease identification:`,
      `📸 Upload plant photo using "Photo Upload" button`,
      `📝 Or describe: leaf color, spot shape, affected part`,
      `⚡ Early detection saves your crop!`
    ]);
  }
}

/**
 * Generate fertilizer help response
 */
function generateFertilizerResponse(
  lang: DetectedLanguage,
  context: ConversationMemory,
  classification: ClassificationResult
): string {
  // Check if farm size is needed for dosage
  if (classification.requiresFarmSize && !hasFarmSize(context)) {
    return formatResponse(SAFETY_GUARDRAILS.chemical_dosage_no_farm_size[lang]);
  }
  
  const crop = context.crop.currentCrop 
    ? getCropData(context.crop.currentCrop)
    : null;
  
  if (crop && context.farm.farmSize) {
    const hectares = context.farm.farmSize.value * 
      (context.farm.farmSize.unit === 'hectare' ? 1 : 0.4047);
    const fert = crop.fertilizerSchedule;
    
    if (fert && lang === 'hi') {
      return formatResponse([
        `💊 **${crop.names.hi}** के लिए खाद (${context.farm.farmSize.value} ${context.farm.farmSize.unit}):`,
        `🔵 नाइट्रोजन (N): ${Math.round(fert.nitrogen.total * hectares)} kg (${fert.nitrogen.splits} बार में)`,
        `🟢 फॉस्फोरस (P): ${Math.round(fert.phosphorus.total * hectares)} kg (बुवाई पर)`,
        `🟡 पोटाश (K): ${Math.round(fert.potassium.total * hectares)} kg (बुवाई पर)`,
        `⚠️ मिट्टी जांच के अनुसार समायोजित करें`
      ]);
    } else if (fert && lang === 'mr') {
      return formatResponse([
        `💊 **${crop.names.mr}** साठी खत (${context.farm.farmSize.value} ${context.farm.farmSize.unit}):`,
        `🔵 नायट्रोजन (N): ${Math.round(fert.nitrogen.total * hectares)} kg (${fert.nitrogen.splits} वेळा)`,
        `🟢 फॉस्फरस (P): ${Math.round(fert.phosphorus.total * hectares)} kg (पेरणीवेळी)`,
        `🟡 पोटॅश (K): ${Math.round(fert.potassium.total * hectares)} kg (पेरणीवेळी)`,
        `⚠️ माती चाचणीनुसार समायोजित करा`
      ]);
    } else if (fert) {
      return formatResponse([
        `💊 Fertilizer for **${crop.names.en}** (${context.farm.farmSize.value} ${context.farm.farmSize.unit}):`,
        `🔵 Nitrogen (N): ${Math.round(fert.nitrogen.total * hectares)} kg (in ${fert.nitrogen.splits} splits)`,
        `🟢 Phosphorus (P): ${Math.round(fert.phosphorus.total * hectares)} kg (basal)`,
        `🟡 Potash (K): ${Math.round(fert.potassium.total * hectares)} kg (basal)`,
        `⚠️ Adjust based on soil test results`
      ]);
    }
  }
  
  // General fertilizer advice
  if (lang === 'hi') {
    return formatResponse([
      `💊 उर्वरक मार्गदर्शन:`,
      `🔵 N (नाइट्रोजन): पत्ते हरे-भरे के लिए (यूरिया)`,
      `🟢 P (फॉस्फोरस): जड़ विकास के लिए (DAP)`,
      `🟡 K (पोटाश): रोग प्रतिरोधक के लिए (MOP)`,
      `✅ जैविक विकल्प: वर्मीकम्पोस्ट, गोबर खाद, नीम खली`
    ]);
  } else if (lang === 'mr') {
    return formatResponse([
      `💊 खत मार्गदर्शन:`,
      `🔵 N (नायट्रोजन): पाने हिरवीगार करण्यासाठी (युरिया)`,
      `🟢 P (फॉस्फरस): मुळे विकासासाठी (DAP)`,
      `🟡 K (पोटॅश): रोग प्रतिकारासाठी (MOP)`,
      `✅ सेंद्रिय पर्याय: गांडूळ खत, शेणखत, निंबोळी पेंड`
    ]);
  } else {
    return formatResponse([
      `💊 Fertilizer guidance:`,
      `🔵 N (Nitrogen): For leafy growth (Urea)`,
      `🟢 P (Phosphorus): For root development (DAP)`,
      `🟡 K (Potash): For disease resistance (MOP)`,
      `✅ Organic options: Vermicompost, FYM, Neem cake`
    ]);
  }
}

/**
 * Generate market/selling advice response
 */
function generateMarketResponse(
  lang: DetectedLanguage,
  context: ConversationMemory
): string {
  if (lang === 'hi') {
    return formatResponse([
      `📊 बाजार सलाह:`,
      `1️⃣ ई-नाम पोर्टल पर भाव देखें (enam.gov.in)`,
      `2️⃣ ग्रेडिंग करें: A-ग्रेड माल = 10-15% ज्यादा भाव`,
      `3️⃣ FPO/सहकारी से जुड़ें: बेहतर मोलभाव`,
      `4️⃣ सही समय: कटाई के तुरंत बाद न बेचें, भाव गिरे होते हैं`
    ]);
  } else if (lang === 'mr') {
    return formatResponse([
      `📊 बाजार सल्ला:`,
      `1️⃣ ई-नाम पोर्टलवर भाव पहा (enam.gov.in)`,
      `2️⃣ प्रतवारी करा: A-ग्रेड माल = 10-15% जास्त भाव`,
      `3️⃣ FPO/सहकारी संस्थेशी जोडा: चांगला सौदा`,
      `4️⃣ योग्य वेळ: काढणीनंतर लगेच विकू नका, भाव कमी असतात`
    ]);
  } else {
    return formatResponse([
      `📊 Market advice:`,
      `1️⃣ Check e-NAM portal for prices (enam.gov.in)`,
      `2️⃣ Grade your produce: A-grade = 10-15% better price`,
      `3️⃣ Join FPO/cooperative: Better bargaining power`,
      `4️⃣ Right timing: Don't sell immediately after harvest`
    ]);
  }
}

/**
 * Generate weather advice response
 */
function generateWeatherResponse(
  lang: DetectedLanguage,
  context: ConversationMemory
): string {
  if (lang === 'hi') {
    return formatResponse([
      `🌤️ मौसम आधारित कार्रवाई:`,
      `☔ बारिश आने वाली हो: स्प्रे टालें, जल निकासी सुनिश्चित करें`,
      `🌡️ गर्मी >35°C: सुबह-शाम पानी दें, मल्चिंग करें`,
      `❄️ ठंड <10°C: पौधों को ढकें, सिंचाई से ठंड कम होती है`,
      `💨 तेज हवा: फसल को सहारा दें, स्प्रे न करें`
    ]);
  } else if (lang === 'mr') {
    return formatResponse([
      `🌤️ हवामान आधारित कृती:`,
      `☔ पाऊस येणार: फवारणी टाळा, पाण्याचा निचरा सुनिश्चित करा`,
      `🌡️ उष्णता >35°C: सकाळी-संध्याकाळी पाणी द्या, आच्छादन करा`,
      `❄️ थंडी <10°C: रोपांना झाका, पाणी दिल्यास थंडी कमी होते`,
      `💨 जोरदार वारा: पिकाला आधार द्या, फवारणी करू नका`
    ]);
  } else {
    return formatResponse([
      `🌤️ Weather-based actions:`,
      `☔ Rain expected: Postpone spraying, ensure drainage`,
      `🌡️ Heat >35°C: Water in morning/evening, do mulching`,
      `❄️ Cold <10°C: Cover plants, irrigation reduces frost damage`,
      `💨 Strong wind: Support crops, avoid spraying`
    ]);
  }
}

/**
 * Generate government scheme response
 */
function generateSchemeResponse(lang: DetectedLanguage): string {
  const disclaimer = SAFETY_GUARDRAILS.scheme_disclaimer[lang];
  
  if (lang === 'hi') {
    return formatResponse([
      `🏛️ प्रमुख सरकारी योजनाएं:`,
      `💰 PM-KISAN: ₹6000/वर्ष (3 किस्तों में)`,
      `🛡️ PMFBY: फसल बीमा (खरीफ 2%, रबी 1.5% प्रीमियम)`,
      `💳 KCC: 4% ब्याज पर कृषि ऋण`,
      disclaimer[0]
    ]);
  } else if (lang === 'mr') {
    return formatResponse([
      `🏛️ प्रमुख शासकीय योजना:`,
      `💰 PM-KISAN: ₹6000/वर्ष (3 हप्त्यांमध्ये)`,
      `🛡️ PMFBY: पीक विमा (खरीप 2%, रब्बी 1.5% प्रीमियम)`,
      `💳 KCC: 4% व्याजावर कृषी कर्ज`,
      disclaimer[0]
    ]);
  } else {
    return formatResponse([
      `🏛️ Key Government Schemes:`,
      `💰 PM-KISAN: ₹6000/year (in 3 installments)`,
      `🛡️ PMFBY: Crop insurance (2% Kharif, 1.5% Rabi premium)`,
      `💳 KCC: Farm loan at 4% interest`,
      disclaimer[0]
    ]);
  }
}

/**
 * Generate pest management response
 */
function generatePestResponse(lang: DetectedLanguage): string {
  if (lang === 'hi') {
    return formatResponse([
      `🐛 IPM (समन्वित कीट प्रबंधन):`,
      `1️⃣ फेरोमोन ट्रैप लगाएं (1 प्रति एकड़)`,
      `2️⃣ नीम तेल स्प्रे: 5ml/लीटर पानी`,
      `3️⃣ पीला चिपचिपा ट्रैप: सफेद मक्खी के लिए`,
      `⚠️ रासायनिक दवाई अंतिम विकल्प रखें`
    ]);
  } else if (lang === 'mr') {
    return formatResponse([
      `🐛 IPM (एकात्मिक कीड व्यवस्थापन):`,
      `1️⃣ फेरोमोन सापळे लावा (1 प्रति एकर)`,
      `2️⃣ कडुनिंब तेल फवारणी: 5ml/लिटर पाणी`,
      `3️⃣ पिवळे चिकट सापळे: पांढऱ्या माशीसाठी`,
      `⚠️ रासायनिक औषध शेवटचा पर्याय ठेवा`
    ]);
  } else {
    return formatResponse([
      `🐛 IPM (Integrated Pest Management):`,
      `1️⃣ Install pheromone traps (1 per acre)`,
      `2️⃣ Neem oil spray: 5ml per liter water`,
      `3️⃣ Yellow sticky traps: For whitefly control`,
      `⚠️ Use chemicals only as last resort`
    ]);
  }
}

/**
 * Main response generator function
 */
export function generateResponse(
  classification: ClassificationResult,
  context: ConversationMemory
): { response: string; followUp: string } {
  const lang = classification.language;
  let response: string;
  
  switch (classification.intent) {
    case 'greeting':
      response = generateGreetingResponse(lang);
      break;
      
    case 'crop_info':
      if (classification.entities.crops.length > 0) {
        response = generateCropInfoResponse(classification.entities.crops[0], lang, context);
      } else if (context.crop.currentCrop) {
        response = generateCropInfoResponse(context.crop.currentCrop, lang, context);
      } else {
        response = lang === 'hi'
          ? '🌾 कौन सी फसल के बारे में जानना चाहते हैं? गेहूं, धान, कपास, सोयाबीन...'
          : lang === 'mr'
          ? '🌾 कोणत्या पिकाबद्दल जाणून घ्यायचे आहे? गहू, भात, कापूस, सोयाबीन...'
          : '🌾 Which crop do you want to know about? Wheat, Rice, Cotton, Soybean...';
      }
      break;
      
    case 'disease_help':
      response = generateDiseaseResponse(lang, context);
      break;
      
    case 'fertilizer_help':
      response = generateFertilizerResponse(lang, context, classification);
      break;
      
    case 'market_sell_advice':
      response = generateMarketResponse(lang, context);
      break;
      
    case 'weather_advice':
      response = generateWeatherResponse(lang, context);
      break;
      
    case 'government_scheme':
      response = generateSchemeResponse(lang);
      break;
      
    case 'pest_management':
      response = generatePestResponse(lang);
      break;
      
    case 'irrigation_help':
      if (lang === 'hi') {
        response = formatResponse([
          `💧 सिंचाई मार्गदर्शन:`,
          `🌡️ गर्मी में: सुबह 6 बजे से पहले या शाम 5 बजे के बाद`,
          `💦 ड्रिप सिंचाई: 40-50% पानी बचत (सब्सिडी उपलब्ध)`,
          `⏰ महत्वपूर्ण समय: फूल और दाना भरने पर जरूरी`,
          `✅ मल्चिंग से 30% वाष्पीकरण कम होता है`
        ]);
      } else if (lang === 'mr') {
        response = formatResponse([
          `💧 सिंचन मार्गदर्शन:`,
          `🌡️ उन्हाळ्यात: सकाळी 6 पूर्वी किंवा संध्याकाळी 5 नंतर`,
          `💦 ठिबक सिंचन: 40-50% पाणी बचत (अनुदान उपलब्ध)`,
          `⏰ महत्त्वाची वेळ: फुलोरा आणि दाणे भरताना आवश्यक`,
          `✅ आच्छादनाने 30% बाष्पीभवन कमी होते`
        ]);
      } else {
        response = formatResponse([
          `💧 Irrigation guidance:`,
          `🌡️ Summer: Water before 6 AM or after 5 PM`,
          `💦 Drip irrigation: 40-50% water saving (subsidy available)`,
          `⏰ Critical stages: Flowering and grain filling`,
          `✅ Mulching reduces evaporation by 30%`
        ]);
      }
      break;
      
    case 'soil_help':
      if (lang === 'hi') {
        response = formatResponse([
          `🌱 मिट्टी प्रबंधन:`,
          `🧪 हर 2-3 साल में मिट्टी जांच कराएं (मुफ्त)`,
          `📊 pH 6.5-7.5 अधिकांश फसलों के लिए आदर्श`,
          `🐄 FYM: 10-15 टन/हेक्टेयर हर साल`,
          `🌿 हरी खाद: ढैंचा या सनई उगाएं और मिलाएं`
        ]);
      } else if (lang === 'mr') {
        response = formatResponse([
          `🌱 माती व्यवस्थापन:`,
          `🧪 दर 2-3 वर्षांनी माती चाचणी करा (मोफत)`,
          `📊 pH 6.5-7.5 बहुतेक पिकांसाठी आदर्श`,
          `🐄 शेणखत: 10-15 टन/हेक्टर दरवर्षी`,
          `🌿 हिरवळीचे खत: ताग किंवा धैंचा लावा आणि मिसळा`
        ]);
      } else {
        response = formatResponse([
          `🌱 Soil management:`,
          `🧪 Get soil test every 2-3 years (free)`,
          `📊 pH 6.5-7.5 is ideal for most crops`,
          `🐄 FYM: 10-15 tons/hectare annually`,
          `🌿 Green manure: Grow dhaincha/sunhemp and incorporate`
        ]);
      }
      break;
      
    case 'organic_farming':
      if (lang === 'hi') {
        response = formatResponse([
          `🌿 जैविक खेती शुरू करें:`,
          `1️⃣ जीवामृत: गोबर + गोमूत्र + गुड़ + बेसन + मिट्टी`,
          `2️⃣ बीजामृत: बीज उपचार के लिए`,
          `3️⃣ वर्मीकम्पोस्ट: 2-3 टन/एकड़`,
          `💰 प्रमाणीकरण के बाद 20-30% अधिक भाव मिलता है`
        ]);
      } else if (lang === 'mr') {
        response = formatResponse([
          `🌿 सेंद्रिय शेती सुरू करा:`,
          `1️⃣ जीवामृत: शेण + गोमूत्र + गूळ + बेसन + माती`,
          `2️⃣ बीजामृत: बियाणे प्रक्रियेसाठी`,
          `3️⃣ गांडूळ खत: 2-3 टन/एकर`,
          `💰 प्रमाणीकरणानंतर 20-30% जास्त भाव मिळतो`
        ]);
      } else {
        response = formatResponse([
          `🌿 Start organic farming:`,
          `1️⃣ Jeevamrut: Cowdung + Urine + Jaggery + Flour + Soil`,
          `2️⃣ Beejamrut: For seed treatment`,
          `3️⃣ Vermicompost: 2-3 tons/acre`,
          `💰 Get 20-30% premium after certification`
        ]);
      }
      break;
      
    default:
      response = lang === 'hi'
        ? '🤔 कृपया अपना सवाल स्पष्ट करें। मैं फसल, बीमारी, खाद, मौसम, बाजार भाव में मदद कर सकता हूं।'
        : lang === 'mr'
        ? '🤔 कृपया तुमचा प्रश्न स्पष्ट करा. मी पीक, रोग, खत, हवामान, बाजारभाव याबाबत मदत करू शकतो.'
        : '🤔 Please clarify your question. I can help with crops, diseases, fertilizers, weather, market prices.';
  }
  
  // Get appropriate follow-up question
  const followUpQuestions = FOLLOW_UP_QUESTIONS[classification.intent] || FOLLOW_UP_QUESTIONS.unknown;
  const followUp = followUpQuestions[lang][0];
  
  return { response, followUp };
}

export default {
  generateResponse
};
