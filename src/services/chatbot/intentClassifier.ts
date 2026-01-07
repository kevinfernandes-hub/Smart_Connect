// Intent Classifier for KisanConnect Chatbot
// Classifies user messages into agricultural intents

export type Intent = 
  | 'greeting'
  | 'help'
  | 'thanks'
  | 'disease_help'
  | 'fertilizer_help'
  | 'market_sell_advice'
  | 'weather_advice'
  | 'government_scheme'
  | 'crop_info'
  | 'pest_management'
  | 'irrigation_help'
  | 'soil_help'
  | 'organic_farming'
  | 'seed_info'
  | 'harvest_help'
  | 'storage_advice'
  | 'crop_rotation'
  | 'season_advice'
  | 'unknown';

export type DetectedLanguage = 'en' | 'hi' | 'mr';

export interface ClassificationResult {
  intent: Intent;
  confidence: number;
  language: DetectedLanguage;
  entities: {
    crops: string[];
    diseases: string[];
    pests: string[];
    chemicals: string[];
    seasons: string[];
    states: string[];
  };
  requiresFarmSize: boolean;
  isChemicalQuery: boolean;
}

// Hinglish and Marathi transliteration patterns
const HINGLISH_PATTERNS: Record<string, string[]> = {
  // Crops
  wheat: ['gehu', 'gehun', 'gahu', 'gehoo'],
  rice: ['dhan', 'chawal', 'bhat', 'chaval'],
  cotton: ['kapas', 'rui', 'kapaas'],
  sugarcane: ['ganna', 'ganne', 'oos', 'us'],
  maize: ['makka', 'makkai', 'bhutta', 'makai'],
  soybean: ['soyabin', 'soya', 'soyabeen'],
  groundnut: ['mungfali', 'moongfali', 'singdana', 'mungphali'],
  mustard: ['sarson', 'sarso', 'rai', 'mohri'],
  chickpea: ['chana', 'chhole', 'harbhara', 'gram'],
  pigeon_pea: ['arhar', 'toor', 'tur', 'tuvar'],
  lentil: ['masoor', 'masur', 'dal'],
  green_gram: ['moong', 'mung', 'moog'],
  black_gram: ['urad', 'udad', 'urid'],
  tomato: ['tamatar', 'tamater'],
  onion: ['pyaz', 'pyaj', 'kanda', 'pyaaz'],
  potato: ['aloo', 'batata', 'aaloo'],
  brinjal: ['baingan', 'begun', 'wange', 'vangi'],
  chilli: ['mirch', 'mirchi', 'lal mirch'],
  okra: ['bhindi', 'bhendi', 'bhinda'],
  cabbage: ['pattagobhi', 'bandgobhi', 'kobi'],
  cauliflower: ['phulgobhi', 'gobi', 'fulkobi'],
  mango: ['aam', 'amba', 'keri'],
  banana: ['kela', 'kele'],
  papaya: ['papita', 'papai'],
  guava: ['amrood', 'peru', 'amrud'],
  turmeric: ['haldi', 'halad'],
  ginger: ['adrak', 'aale', 'adarak'],
  coriander: ['dhaniya', 'kothimbir', 'dhania'],
  cumin: ['jeera', 'jire', 'zeera'],
  fenugreek: ['methi'],
  bajra: ['bajra', 'bajri'],
  jowar: ['jowar', 'jwari', 'jowari'],
  grapes: ['angoor', 'draksh', 'angur'],
  pomegranate: ['anaar', 'dalimb', 'anar'],
  cucumber: ['kheera', 'kakdi', 'khira'],
  pumpkin: ['kaddu', 'bhopla', 'lal bhopla'],
};

// Intent keyword patterns (multi-language)
const INTENT_PATTERNS: Record<Intent, string[]> = {
  greeting: [
    'hello', 'hi', 'hey', 'namaste', 'namaskar', 'नमस्ते', 'नमस्कार', 
    'kem cho', 'kemon acho', 'vanakkam', 'sat sri akal'
  ],
  help: [
    'help', 'madad', 'sahayata', 'मदद', 'सहायता', 'मला मदत करा',
    'kya kar sakte', 'guide', 'batao', 'बताओ', 'samjhao'
  ],
  thanks: [
    'thanks', 'thank you', 'dhanyawad', 'dhanyavaad', 'धन्यवाद', 
    'shukriya', 'शुक्रिया', 'aabhar', 'आभार'
  ],
  disease_help: [
    'disease', 'bimari', 'rog', 'बीमारी', 'रोग', 'infection', 'fungus',
    'yellow', 'peela', 'पीला', 'black', 'kala', 'काला', 'spot', 'daag', 'दाग',
    'wilt', 'murjhana', 'मुरझाना', 'rot', 'sadna', 'सड़ना', 'blight',
    'rust', 'mildew', 'virus', 'पत्ते सूख', 'leaves dying', 'patte such',
    'rogavar', 'rogache', 'आजार', 'rogawar upay'
  ],
  fertilizer_help: [
    'fertilizer', 'khad', 'खाद', 'उर्वरक', 'urea', 'यूरिया', 'dap',
    'npk', 'potash', 'पोटाश', 'nitrogen', 'phosphorus', 'zinc',
    'micro nutrient', 'सूक्ष्म पोषक', 'organic manure', 'जैविक खाद',
    'vermicompost', 'केंचुआ खाद', 'fym', 'gobar', 'गोबर', 'neem cake',
    'fertilizer schedule', 'khad kitni', 'खाद कितनी', 'kitna khad',
    'khatacha', 'खत', 'khat kiti'
  ],
  market_sell_advice: [
    'price', 'bhav', 'भाव', 'rate', 'daam', 'दाम', 'mandi', 'मंडी',
    'market', 'बाजार', 'sell', 'bechna', 'बेचना', 'kharid', 'खरीद',
    'trading', 'e-nam', 'apmc', 'minimum support', 'msp', 'एमएसपी',
    'kab beche', 'कब बेचें', 'best time to sell', 'vikri', 'विक्री',
    'bazaar bhav', 'bazaarbhav'
  ],
  weather_advice: [
    'weather', 'mausam', 'मौसम', 'barish', 'बारिश', 'rain', 'baarish',
    'temperature', 'tapman', 'तापमान', 'humidity', 'namee', 'नमी',
    'forecast', 'monsoon', 'winter', 'summer', 'garmi', 'गर्मी',
    'thanda', 'ठंडा', 'cold', 'frost', 'pala', 'पाला', 'heatwave',
    'havaaman', 'हवामान', 'paoos', 'पाऊस'
  ],
  government_scheme: [
    'scheme', 'yojana', 'योजना', 'subsidy', 'सब्सिडी', 'anudan', 'अनुदान',
    'pm kisan', 'पीएम किसान', 'fasal bima', 'फसल बीमा', 'pmfby',
    'kcc', 'kisan credit', 'किसान क्रेडिट', 'loan', 'rin', 'ऋण',
    'sarkari', 'सरकारी', 'government', 'registration', 'panjikaran',
    'शासकीय योजना', 'sarkari yojana'
  ],
  crop_info: [
    'how to grow', 'kaise ugaye', 'कैसे उगाएं', 'cultivation', 'kheti',
    'खेती', 'farming', 'ugana', 'उगाना', 'variety', 'kism', 'किस्म',
    'seed rate', 'beej dar', 'बीज दर', 'sowing', 'buwai', 'बुवाई',
    'yield', 'upaj', 'उपज', 'paidavar', 'पैदावार', 'harvesting',
    'katai', 'कटाई', 'crop information', 'fasal', 'फसल', 'pik',
    'पीक', 'pikaची माहिती', 'kashi ugvave'
  ],
  pest_management: [
    'pest', 'keeda', 'कीड़ा', 'keet', 'कीट', 'insect', 'bug',
    'caterpillar', 'sundi', 'सुंडी', 'borer', 'beetle', 'aphid',
    'mahu', 'माहू', 'whitefly', 'safed makhi', 'सफेद मक्खी',
    'control', 'spray', 'chidkav', 'छिड़काव', 'pesticide', 'dawai',
    'दवाई', 'chemical', 'rasayan', 'रसायन', 'organic control',
    'jaivik niyantran', 'जैविक नियंत्रण', 'kida', 'किडा', 'kidiche'
  ],
  irrigation_help: [
    'irrigation', 'sinchai', 'सिंचाई', 'pani', 'पानी', 'water',
    'drip', 'टपक', 'sprinkler', 'fuhara', 'फुहारा', 'bore', 'tubewell',
    'canal', 'nahar', 'नहर', 'paani dena', 'पानी देना', 'when to water',
    'kab pani de', 'कब पानी दें', 'water schedule', 'panyache',
    'पाणी', 'sinchan', 'सिंचन'
  ],
  soil_help: [
    'soil', 'mitti', 'मिट्टी', 'bhumi', 'भूमि', 'land', 'zameen', 'जमीन',
    'ph', 'testing', 'jaanch', 'जांच', 'fertility', 'upjaau', 'उपजाऊ',
    'improvement', 'sudhar', 'सुधार', 'type', 'prakar', 'प्रकार',
    'black soil', 'kali mitti', 'काली मिट्टी', 'red soil', 'lal mitti',
    'माती', 'mati', 'jaminichi'
  ],
  organic_farming: [
    'organic', 'jaivik', 'जैविक', 'natural', 'prakritik', 'प्राकृतिक',
    'bio', 'chemical free', 'rasayan mukt', 'रसायन मुक्त', 'desi',
    'देसी', 'traditional', 'paramparik', 'पारंपरिक', 'cow urine',
    'gomutra', 'गोमूत्र', 'panchagavya', 'पंचगव्य', 'jeevamrut',
    'जीवामृत', 'सेंद्रिय', 'sendriya', 'नैसर्गिक', 'naisargik'
  ],
  seed_info: [
    'seed', 'beej', 'बीज', 'variety', 'kism', 'किस्म', 'hybrid',
    'sankar', 'संकर', 'certified', 'pramanik', 'प्रमाणिक',
    'treatment', 'upchar', 'उपचार', 'germination', 'ankuran', 'अंकुरण',
    'where to buy', 'kahan se le', 'कहां से लें', 'bian', 'बियाणे'
  ],
  harvest_help: [
    'harvest', 'katai', 'कटाई', 'udai', 'उड़ाई', 'reaping',
    'when to harvest', 'kab kate', 'कब काटें', 'maturity', 'pakna',
    'पकना', 'ready', 'taiyar', 'तैयार', 'picking', 'todna', 'तोड़ना',
    'काढणी', 'kadhni'
  ],
  storage_advice: [
    'storage', 'bhandaran', 'भंडारण', 'store', 'rakhna', 'रखना',
    'godown', 'warehouse', 'preservation', 'sanrakshan', 'संरक्षण',
    'moisture', 'nami', 'नमी', 'rotting', 'sadna', 'सड़ना',
    'साठवणूक', 'sathvanuk'
  ],
  crop_rotation: [
    'rotation', 'fasal chakra', 'फसल चक्र', 'after', 'baad', 'बाद',
    'next crop', 'agli fasal', 'अगली फसल', 'sequence', 'kram', 'क्रम',
    'intercrop', 'sah fasal', 'सह फसल', 'फेरपालट', 'ferpalat'
  ],
  season_advice: [
    'season', 'mausam', 'मौसम', 'ritu', 'ऋतु', 'kharif', 'खरीफ',
    'rabi', 'रबी', 'zaid', 'जायद', 'summer', 'winter', 'monsoon',
    'which crop', 'konsi fasal', 'कौनसी फसल', 'what to grow',
    'kya ugaye', 'क्या उगाएं', 'हंगाम', 'hangam'
  ],
  unknown: []
};

// Chemical/pesticide keywords that require farm size before dosage
const CHEMICAL_KEYWORDS = [
  'dose', 'dosage', 'kharakh', 'खुराक', 'quantity', 'matra', 'मात्रा',
  'spray', 'छिड़काव', 'chidkav', 'kitna dale', 'कितना डालें',
  'how much', 'per acre', 'प्रति एकड़', 'per hectare', 'प्रति हेक्टेयर',
  'mixing ratio', 'anupat', 'अनुपात', 'pesticide', 'कीटनाशक',
  'fungicide', 'फफूंदनाशक', 'herbicide', 'खरपतवारनाशी',
  'insecticide', 'कीटनाशक दवाई'
];

// Hindi script detection
const HINDI_SCRIPT_REGEX = /[\u0900-\u097F]/;
// Marathi-specific words and patterns
const MARATHI_WORDS = [
  'आहे', 'करा', 'काय', 'कसे', 'माहिती', 'पाहिजे', 'होतो', 'आणि',
  'मला', 'तुम्ही', 'हवे', 'कशी', 'कोणती', 'आवश्यक', 'सांगा',
  'पीक', 'माती', 'पाऊस', 'शेती', 'शेतकरी', 'भाव', 'विक्री'
];

// Indian states for regional context
const INDIAN_STATES = [
  'maharashtra', 'महाराष्ट्र', 'madhya pradesh', 'मध्य प्रदेश', 'mp',
  'uttar pradesh', 'उत्तर प्रदेश', 'up', 'punjab', 'पंजाब',
  'haryana', 'हरियाणा', 'rajasthan', 'राजस्थान', 'gujarat', 'गुजरात',
  'karnataka', 'कर्नाटक', 'andhra', 'आंध्र', 'telangana', 'तेलंगाना',
  'tamil nadu', 'तमिल नाडु', 'kerala', 'केरल', 'bihar', 'बिहार',
  'west bengal', 'पश्चिम बंगाल', 'odisha', 'ओडिशा', 'jharkhand', 'झारखंड',
  'chhattisgarh', 'छत्तीसगढ़', 'assam', 'असम'
];

// Season keywords
const SEASON_KEYWORDS = {
  kharif: ['kharif', 'खरीफ', 'खरीप', 'monsoon', 'barsaat', 'बरसात', 'june', 'july'],
  rabi: ['rabi', 'रबी', 'रब्बी', 'winter', 'sardi', 'सर्दी', 'october', 'november'],
  zaid: ['zaid', 'जायद', 'summer', 'garmi', 'गर्मी', 'march', 'april', 'उन्हाळी']
};

/**
 * Detects the language of the input message
 */
export function detectLanguage(message: string): DetectedLanguage {
  const lowerMessage = message.toLowerCase();
  
  // Check for Devanagari script (Hindi/Marathi)
  if (HINDI_SCRIPT_REGEX.test(message)) {
    // Check for Marathi-specific words
    const hasMarathiWords = MARATHI_WORDS.some(word => message.includes(word));
    if (hasMarathiWords) {
      return 'mr';
    }
    return 'hi';
  }
  
  // Check for Hinglish patterns (Hindi written in Roman script)
  const hinglishIndicators = [
    'kaise', 'kya', 'kab', 'kahan', 'kitna', 'kitni', 'kaun',
    'mera', 'meri', 'mere', 'hai', 'hain', 'tha', 'thi',
    'karna', 'dena', 'lena', 'jana', 'aana', 'chahiye',
    'accha', 'theek', 'bahut', 'thoda', 'zyada', 'kam',
    'wala', 'wali', 'ke liye', 'mein', 'par', 'se'
  ];
  
  const marathiRomanIndicators = [
    'kashi', 'kay', 'kiti', 'kuthe', 'mazha', 'mazi', 
    'ahe', 'aahe', 'pahije', 'sangha', 'aamhi', 'tumhi',
    'shetkari', 'sheti', 'pik', 'pani'
  ];
  
  const hinglishCount = hinglishIndicators.filter(word => lowerMessage.includes(word)).length;
  const marathiCount = marathiRomanIndicators.filter(word => lowerMessage.includes(word)).length;
  
  if (marathiCount > hinglishCount && marathiCount >= 1) {
    return 'mr';
  }
  
  if (hinglishCount >= 1) {
    return 'hi';
  }
  
  return 'en';
}

/**
 * Extract crop names from message (handles Hinglish transliteration)
 */
export function extractCrops(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  const detectedCrops: string[] = [];
  
  for (const [cropId, variations] of Object.entries(HINGLISH_PATTERNS)) {
    // Check main crop name
    if (lowerMessage.includes(cropId)) {
      detectedCrops.push(cropId);
      continue;
    }
    
    // Check transliterated variations
    for (const variant of variations) {
      if (lowerMessage.includes(variant)) {
        detectedCrops.push(cropId);
        break;
      }
    }
  }
  
  return [...new Set(detectedCrops)];
}

/**
 * Extract seasons from message
 */
export function extractSeasons(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  const detectedSeasons: string[] = [];
  
  for (const [season, keywords] of Object.entries(SEASON_KEYWORDS)) {
    if (keywords.some(kw => lowerMessage.includes(kw))) {
      detectedSeasons.push(season);
    }
  }
  
  return detectedSeasons;
}

/**
 * Extract state names from message
 */
export function extractStates(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  return INDIAN_STATES.filter(state => lowerMessage.includes(state.toLowerCase()));
}

/**
 * Check if message contains chemical/dosage related query
 */
export function isChemicalQuery(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return CHEMICAL_KEYWORDS.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
}

/**
 * Classify the intent of a user message
 */
export function classifyIntent(message: string): ClassificationResult {
  const lowerMessage = message.toLowerCase();
  const language = detectLanguage(message);
  
  // Calculate intent scores
  const intentScores: Record<Intent, number> = {} as Record<Intent, number>;
  
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    const matchCount = patterns.filter(pattern => 
      lowerMessage.includes(pattern.toLowerCase())
    ).length;
    intentScores[intent as Intent] = matchCount;
  }
  
  // Find the intent with highest score
  let maxIntent: Intent = 'unknown';
  let maxScore = 0;
  
  for (const [intent, score] of Object.entries(intentScores)) {
    if (score > maxScore) {
      maxScore = score;
      maxIntent = intent as Intent;
    }
  }
  
  // Extract entities
  const crops = extractCrops(message);
  const seasons = extractSeasons(message);
  const states = extractStates(message);
  const chemicalQuery = isChemicalQuery(message);
  
  // If crops are mentioned but no clear intent, default to crop_info
  if (maxIntent === 'unknown' && crops.length > 0) {
    maxIntent = 'crop_info';
    maxScore = 1;
  }
  
  // Calculate confidence (normalized)
  const totalPatterns = Object.values(INTENT_PATTERNS)
    .reduce((sum, patterns) => sum + patterns.length, 0);
  const confidence = Math.min(maxScore / 5, 1); // Normalize to 0-1
  
  return {
    intent: maxIntent,
    confidence,
    language,
    entities: {
      crops,
      diseases: [], // Will be populated from disease detection if available
      pests: [],
      chemicals: [],
      seasons,
      states
    },
    requiresFarmSize: chemicalQuery,
    isChemicalQuery: chemicalQuery
  };
}

export default {
  classifyIntent,
  detectLanguage,
  extractCrops,
  extractSeasons,
  extractStates,
  isChemicalQuery
};
