// SIH Disease Model Integration for KisanConnect
// Handles ML model labels and generates tailored responses

import { DetectedLanguage } from './intentClassifier';
import { ConversationMemory, hasFarmSize } from './conversationMemory';

// SIH Model Disease Labels
export type SIHDiseaseLabel = 
  | 'Nitrogen_Deficiency'
  | 'Aphid_Attack'
  | 'Fungal_Spot'
  | 'Healthy'
  | 'Unknown';

export interface SIHModelResult {
  label: SIHDiseaseLabel;
  confidence: number;
  rawPrediction?: string;
  timestamp: Date;
}

// Crop types for tailored responses
export type CropType = 'cotton' | 'tomato' | 'soybean' | 'wheat' | 'rice' | 'chilli' | 'other';

// Season determination for Vidarbha region
export function getCurrentSeason(): 'kharif' | 'rabi' | 'zaid' {
  const month = new Date().getMonth() + 1; // 1-12
  
  if (month >= 6 && month <= 10) return 'kharif';
  if (month >= 11 || month <= 2) return 'rabi';
  return 'zaid';
}

// Get season name in different languages
export function getSeasonName(season: 'kharif' | 'rabi' | 'zaid', lang: DetectedLanguage): string {
  const seasonNames = {
    kharif: { en: 'Kharif (Monsoon)', hi: 'खरीफ (मानसून)', mr: 'खरीप (पावसाळा)' },
    rabi: { en: 'Rabi (Winter)', hi: 'रबी (सर्दी)', mr: 'रब्बी (हिवाळा)' },
    zaid: { en: 'Zaid (Summer)', hi: 'जायद (गर्मी)', mr: 'उन्हाळी (उन्हाळा)' }
  };
  return seasonNames[season][lang];
}

/**
 * Generate response for Nitrogen Deficiency
 */
function generateNitrogenDeficiencyResponse(
  lang: DetectedLanguage,
  context: ConversationMemory,
  confidence: number
): { response: string; needsFarmSize: boolean } {
  const crop = context.crop.currentCrop || 'पीक';
  const season = getSeasonName(getCurrentSeason(), lang);
  const needsFarmSize = !hasFarmSize(context);
  
  if (lang === 'mr') {
    if (needsFarmSize) {
      return {
        response: [
          `🟡 **नायट्रोजन कमतरता ओळखली** (${Math.round(confidence * 100)}% खात्री)`,
          `📋 ${crop} - ${season}`,
          ``,
          `⚠️ खत मात्रा सांगण्यासाठी तुमची जमीन किती एकर/हेक्टर आहे ते सांगा.`,
          `तोपर्यंत जीवामृत वापरा - सेंद्रिय आणि सुरक्षित!`
        ].join('\n'),
        needsFarmSize: true
      };
    }
    
    const farmSize = context.farm.farmSize!;
    const ureaQty = Math.round(farmSize.value * 2); // ~2kg/acre
    
    return {
      response: [
        `🟡 **नायट्रोजन कमतरता** - ${crop} (${season})`,
        ``,
        `✅ **3 पायऱ्या:**`,
        `1️⃣ खत: 19:19:19 @ ${ureaQty}kg/${farmSize.value} ${farmSize.unit} (ड्रिपमधून)`,
        `2️⃣ पाणी: ठिबक सायकल वाढवा, सकाळी 6 पूर्वी`,
        `3️⃣ सेंद्रिय: जीवामृत 200L/${farmSize.unit} - नायट्रोजन वाढवतो`
      ].join('\n'),
      needsFarmSize: false
    };
  } else if (lang === 'hi') {
    if (needsFarmSize) {
      return {
        response: [
          `🟡 **नाइट्रोजन की कमी पहचानी** (${Math.round(confidence * 100)}% विश्वास)`,
          `📋 ${crop} - ${season}`,
          ``,
          `⚠️ खाद मात्रा बताने के लिए आपकी जमीन कितने एकड़/हेक्टेयर है?`,
          `तब तक जीवामृत इस्तेमाल करें - जैविक और सुरक्षित!`
        ].join('\n'),
        needsFarmSize: true
      };
    }
    
    const farmSize = context.farm.farmSize!;
    const ureaQty = Math.round(farmSize.value * 2);
    
    return {
      response: [
        `🟡 **नाइट्रोजन की कमी** - ${crop} (${season})`,
        ``,
        `✅ **3 कदम:**`,
        `1️⃣ खाद: 19:19:19 @ ${ureaQty}kg/${farmSize.value} ${farmSize.unit} (ड्रिप से)`,
        `2️⃣ पानी: ड्रिप साइकल बढ़ाएं, सुबह 6 बजे से पहले`,
        `3️⃣ जैविक: जीवामृत 200L/${farmSize.unit} - नाइट्रोजन बढ़ाता है`
      ].join('\n'),
      needsFarmSize: false
    };
  } else {
    if (needsFarmSize) {
      return {
        response: [
          `🟡 **Nitrogen Deficiency Detected** (${Math.round(confidence * 100)}% confidence)`,
          `📋 Crop: ${crop} | Season: ${season}`,
          ``,
          `⚠️ Please tell me your farm size (acres/hectares) for exact dosage.`,
          `Meanwhile, apply Jeevamrut - organic and safe!`
        ].join('\n'),
        needsFarmSize: true
      };
    }
    
    const farmSize = context.farm.farmSize!;
    const ureaQty = Math.round(farmSize.value * 2);
    
    return {
      response: [
        `🟡 **Nitrogen Deficiency** - ${crop} (${season})`,
        ``,
        `✅ **3 Action Steps:**`,
        `1️⃣ Fertilizer: 19:19:19 @ ${ureaQty}kg/${farmSize.value} ${farmSize.unit} (via drip)`,
        `2️⃣ Irrigation: Increase drip cycles, water before 6 AM`,
        `3️⃣ Organic: Jeevamrut 200L/${farmSize.unit} - boosts nitrogen naturally`
      ].join('\n'),
      needsFarmSize: false
    };
  }
}

/**
 * Generate response for Aphid Attack
 */
function generateAphidAttackResponse(
  lang: DetectedLanguage,
  context: ConversationMemory,
  confidence: number
): { response: string; needsFarmSize: boolean } {
  const needsFarmSize = !hasFarmSize(context);
  
  if (lang === 'mr') {
    return {
      response: [
        `🐛 **माव्याचा हल्ला ओळखला** (${Math.round(confidence * 100)}% खात्री)`,
        ``,
        `✅ **IPM योजना (सेंद्रिय प्रथम):**`,
        `1️⃣ कडुनिंब तेल: 5ml/लिटर पाणी - लगेच फवारा`,
        `2️⃣ पिवळे चिकट सापळे: 8-10 प्रति एकर लावा`,
        needsFarmSize 
          ? `3️⃣ रासायनिक: जमीन आकार सांगा, मग मात्रा देतो`
          : `3️⃣ शेवटचा पर्याय: इमिडाक्लोप्रिड 0.5ml/L (${context.farm.farmSize!.value} ${context.farm.farmSize!.unit}साठी)`
      ].join('\n'),
      needsFarmSize
    };
  } else if (lang === 'hi') {
    return {
      response: [
        `🐛 **माहू का हमला पहचाना** (${Math.round(confidence * 100)}% विश्वास)`,
        ``,
        `✅ **IPM योजना (जैविक पहले):**`,
        `1️⃣ नीम तेल: 5ml/लीटर पानी - तुरंत छिड़काव करें`,
        `2️⃣ पीले चिपचिपे ट्रैप: 8-10 प्रति एकड़ लगाएं`,
        needsFarmSize
          ? `3️⃣ रासायनिक: खेत का आकार बताएं, फिर मात्रा दूंगा`
          : `3️⃣ अंतिम विकल्प: इमिडाक्लोप्रिड 0.5ml/L (${context.farm.farmSize!.value} ${context.farm.farmSize!.unit} के लिए)`
      ].join('\n'),
      needsFarmSize
    };
  } else {
    return {
      response: [
        `🐛 **Aphid Attack Detected** (${Math.round(confidence * 100)}% confidence)`,
        ``,
        `✅ **IPM Plan (Organic First):**`,
        `1️⃣ Neem oil: 5ml/liter water - spray immediately`,
        `2️⃣ Yellow sticky traps: Install 8-10 per acre`,
        needsFarmSize
          ? `3️⃣ Chemical: Tell me farm size for exact dosage`
          : `3️⃣ Last resort: Imidacloprid 0.5ml/L (for ${context.farm.farmSize!.value} ${context.farm.farmSize!.unit})`
      ].join('\n'),
      needsFarmSize
    };
  }
}

/**
 * Generate response for Fungal Spot
 */
function generateFungalSpotResponse(
  lang: DetectedLanguage,
  context: ConversationMemory,
  confidence: number
): { response: string; needsCropType: boolean } {
  const crop = context.crop.currentCrop;
  const needsCropType = !crop || !['cotton', 'tomato', 'soybean', 'kapas', 'tamatar', 'soyabin'].some(
    c => crop.toLowerCase().includes(c)
  );
  
  if (lang === 'mr') {
    if (needsCropType) {
      return {
        response: [
          `🍄 **बुरशीजन्य डाग ओळखले** (${Math.round(confidence * 100)}% खात्री)`,
          ``,
          `📋 फवारणी वेळापत्रक तयार करण्यासाठी:`,
          `तुमचे पीक कोणते आहे?`,
          `• कापूस 🌿 • टोमॅटो 🍅 • सोयाबीन 🫘`
        ].join('\n'),
        needsCropType: true
      };
    }
    
    return {
      response: [
        `🍄 **बुरशीजन्य डाग** - ${crop}`,
        ``,
        `✅ **फवारणी वेळापत्रक:**`,
        `1️⃣ आज: मॅन्कोझेब 2.5g/L फवारा (संध्याकाळी 5 नंतर)`,
        `2️⃣ 7 दिवसांनी: कार्बेन्डाझिम 1g/L`,
        `3️⃣ प्रतिबंध: बाधित पाने काढा, हवा खेळती ठेवा`
      ].join('\n'),
      needsCropType: false
    };
  } else if (lang === 'hi') {
    if (needsCropType) {
      return {
        response: [
          `🍄 **फफूंद धब्बे पहचाने** (${Math.round(confidence * 100)}% विश्वास)`,
          ``,
          `📋 स्प्रे शेड्यूल बनाने के लिए:`,
          `आपकी फसल कौन सी है?`,
          `• कपास 🌿 • टमाटर 🍅 • सोयाबीन 🫘`
        ].join('\n'),
        needsCropType: true
      };
    }
    
    return {
      response: [
        `🍄 **फफूंद धब्बे** - ${crop}`,
        ``,
        `✅ **स्प्रे शेड्यूल:**`,
        `1️⃣ आज: मैंकोजेब 2.5g/L छिड़काव (शाम 5 बजे के बाद)`,
        `2️⃣ 7 दिन बाद: कार्बेंडाजिम 1g/L`,
        `3️⃣ रोकथाम: संक्रमित पत्ते हटाएं, हवा का प्रवाह बनाएं`
      ].join('\n'),
      needsCropType: false
    };
  } else {
    if (needsCropType) {
      return {
        response: [
          `🍄 **Fungal Spot Detected** (${Math.round(confidence * 100)}% confidence)`,
          ``,
          `📋 To create a spray schedule:`,
          `Which crop is affected?`,
          `• Cotton 🌿 • Tomato 🍅 • Soybean 🫘`
        ].join('\n'),
        needsCropType: true
      };
    }
    
    return {
      response: [
        `🍄 **Fungal Spot** - ${crop}`,
        ``,
        `✅ **Spray Schedule:**`,
        `1️⃣ Today: Mancozeb 2.5g/L spray (after 5 PM)`,
        `2️⃣ After 7 days: Carbendazim 1g/L`,
        `3️⃣ Prevention: Remove infected leaves, improve air circulation`
      ].join('\n'),
      needsCropType: false
    };
  }
}

/**
 * Generate response for Healthy plant
 */
function generateHealthyResponse(
  lang: DetectedLanguage,
  context: ConversationMemory,
  confidence: number
): string {
  const crop = context.crop.currentCrop || '';
  const season = getSeasonName(getCurrentSeason(), lang);
  
  if (lang === 'mr') {
    return [
      `🟢 **पीक निरोगी आहे!** (${Math.round(confidence * 100)}% खात्री)`,
      ``,
      `✅ **प्रतिबंधात्मक सल्ला:**`,
      `1️⃣ जीवामृत/दशपर्णी फवारणी सुरू ठेवा`,
      `2️⃣ ${season} - नागपूर मंडी भाव चांगले आहेत`,
      `3️⃣ काढणीपूर्वी 15 दिवस आधी खरेदीदार शोधा`
    ].join('\n');
  } else if (lang === 'hi') {
    return [
      `🟢 **फसल स्वस्थ है!** (${Math.round(confidence * 100)}% विश्वास)`,
      ``,
      `✅ **निवारक सलाह:**`,
      `1️⃣ जीवामृत/दशपर्णी स्प्रे जारी रखें`,
      `2️⃣ ${season} - नागपुर मंडी भाव अच्छे हैं`,
      `3️⃣ कटाई से 15 दिन पहले खरीदार खोजें`
    ].join('\n');
  } else {
    return [
      `🟢 **Crop is Healthy!** (${Math.round(confidence * 100)}% confidence)`,
      ``,
      `✅ **Preventive Advisory:**`,
      `1️⃣ Continue Jeevamrut/Dashparni sprays`,
      `2️⃣ ${season} - Nagpur mandi prices are good`,
      `3️⃣ Find buyers 15 days before harvest`
    ].join('\n');
  }
}

/**
 * Get follow-up question based on label
 */
export function getFollowUpQuestion(label: SIHDiseaseLabel, lang: DetectedLanguage): string {
  const questions: Record<SIHDiseaseLabel, { en: string; hi: string; mr: string }> = {
    Nitrogen_Deficiency: {
      en: 'Have you done a soil test recently? It helps confirm the deficiency.',
      hi: 'क्या हाल ही में मिट्टी जांच कराई है? इससे कमी की पुष्टि होती है।',
      mr: 'अलीकडे माती परीक्षण केले आहे का? यामुळे कमतरतेची खात्री होते.'
    },
    Aphid_Attack: {
      en: 'Are the aphids on leaves or on the stem? This helps target the spray.',
      hi: 'माहू पत्तों पर हैं या तने पर? इससे स्प्रे का सही जगह पता चलता है।',
      mr: 'माव्या पानांवर आहेत की खोडावर? यामुळे फवारणी योग्य जागी होते.'
    },
    Fungal_Spot: {
      en: 'Are the spots spreading rapidly? This determines spray urgency.',
      hi: 'क्या धब्बे तेजी से फैल रहे हैं? इससे स्प्रे की जरूरत पता चलती है।',
      mr: 'डाग वेगाने पसरत आहेत का? यावरून फवारणीची निकड समजते.'
    },
    Healthy: {
      en: 'Would you like market price advice for Nagpur/Akola mandi?',
      hi: 'क्या नागपुर/अकोला मंडी के भाव जानना चाहते हैं?',
      mr: 'नागपूर/अकोला मंडी भाव जाणून घ्यायचे आहेत का?'
    },
    Unknown: {
      en: 'Can you upload a clearer photo for better analysis?',
      hi: 'क्या आप बेहतर विश्लेषण के लिए साफ तस्वीर भेज सकते हैं?',
      mr: 'चांगल्या विश्लेषणासाठी स्पष्ट फोटो पाठवू शकता का?'
    }
  };
  
  return questions[label][lang];
}

/**
 * Main function to generate SIH model-based response
 */
export function generateSIHModelResponse(
  result: SIHModelResult,
  context: ConversationMemory,
  lang: DetectedLanguage
): {
  response: string;
  followUp: string;
  needsInput?: 'farm_size' | 'crop_type';
} {
  let responseData: { response: string; needsFarmSize?: boolean; needsCropType?: boolean };
  
  switch (result.label) {
    case 'Nitrogen_Deficiency':
      responseData = generateNitrogenDeficiencyResponse(lang, context, result.confidence);
      break;
      
    case 'Aphid_Attack':
      responseData = generateAphidAttackResponse(lang, context, result.confidence);
      break;
      
    case 'Fungal_Spot':
      responseData = generateFungalSpotResponse(lang, context, result.confidence);
      break;
      
    case 'Healthy':
      responseData = { response: generateHealthyResponse(lang, context, result.confidence) };
      break;
      
    default:
      responseData = {
        response: lang === 'mr'
          ? `⚠️ विश्लेषण अस्पष्ट. कृपया स्पष्ट फोटो पुन्हा पाठवा.`
          : lang === 'hi'
          ? `⚠️ विश्लेषण अस्पष्ट। कृपया साफ फोटो दोबारा भेजें।`
          : `⚠️ Analysis unclear. Please upload a clearer photo.`
      };
  }
  
  const followUp = getFollowUpQuestion(result.label, lang);
  
  return {
    response: responseData.response,
    followUp,
    needsInput: responseData.needsFarmSize ? 'farm_size' : responseData.needsCropType ? 'crop_type' : undefined
  };
}

/**
 * Parse ML model response to SIH label
 */
export function parseMlModelResponse(prediction: string): SIHDiseaseLabel {
  const normalized = prediction.toLowerCase().trim();
  
  if (normalized.includes('nitrogen') || normalized.includes('deficiency')) {
    return 'Nitrogen_Deficiency';
  }
  if (normalized.includes('aphid') || normalized.includes('mahu') || normalized.includes('माहू')) {
    return 'Aphid_Attack';
  }
  if (normalized.includes('fungal') || normalized.includes('spot') || normalized.includes('blight')) {
    return 'Fungal_Spot';
  }
  if (normalized.includes('healthy') || normalized.includes('normal')) {
    return 'Healthy';
  }
  
  return 'Unknown';
}

export default {
  generateSIHModelResponse,
  parseMlModelResponse,
  getCurrentSeason,
  getSeasonName,
  getFollowUpQuestion
};
