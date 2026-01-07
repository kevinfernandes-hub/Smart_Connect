import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { 
  Leaf, MapPin, Droplets, Thermometer, Brain, Loader2, CheckCircle, TrendingUp, Cloud,
  Star, Calendar, IndianRupee, Wheat, BookOpen, MessageCircle, Save, Sparkles, Award,
  ArrowRight, Info, Package
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { cropService, CropRecommendation as CropRec, MLRecommendation } from "../services/api";
import { weatherService, WeatherData } from "../services/weatherApi";
import { WeatherWidget } from "./WeatherWidget";
import { toast } from "sonner";

// Enhanced ML Recommendation with top 3 crops
interface EnhancedMLRecommendation {
  crops: CropCard[];
  inputSummary: {
    soilHealth: string;
    climate: string;
    season: string;
  };
}

interface CropCard {
  name: string;
  nameHi: string;
  nameMr: string;
  confidence: number;
  rank: number;
  season: 'kharif' | 'rabi' | 'zaid' | 'all';
  reasons: {
    en: string[];
    hi: string[];
    mr: string[];
  };
  yieldPerAcre: string;
  profitPerAcre: string;
  duration: string;
  mandiPrice?: {
    price: number;
    market: string;
    trend: 'up' | 'down' | 'stable';
  };
}

// Crop database with multilingual support
const CROP_DATA: Record<string, Omit<CropCard, 'confidence' | 'rank'>> = {
  'Rice': {
    name: 'Rice', nameHi: 'चावल/धान', nameMr: 'तांदूळ/भात',
    season: 'kharif',
    reasons: {
      en: ['Ideal for high rainfall areas', 'Your soil moisture is perfect', 'Good market demand currently'],
      hi: ['ज्यादा बारिश वाले क्षेत्र के लिए उपयुक्त', 'आपकी मिट्टी की नमी सही है', 'बाजार में अच्छी मांग'],
      mr: ['जास्त पावसाच्या भागासाठी योग्य', 'तुमच्या मातीची ओलावा योग्य आहे', 'बाजारात चांगली मागणी']
    },
    yieldPerAcre: '20-25 क्विंटल',
    profitPerAcre: '₹25,000 - ₹35,000',
    duration: '120-150 दिन'
  },
  'Wheat': {
    name: 'Wheat', nameHi: 'गेहूं', nameMr: 'गहू',
    season: 'rabi',
    reasons: {
      en: ['Good soil nutrients detected', 'Winter season crop', 'Stable market prices'],
      hi: ['मिट्टी में अच्छे पोषक तत्व', 'सर्दी की फसल', 'बाजार में स्थिर भाव'],
      mr: ['मातीत चांगले पोषक घटक', 'हिवाळी पीक', 'बाजारात स्थिर भाव']
    },
    yieldPerAcre: '18-22 क्विंटल',
    profitPerAcre: '₹20,000 - ₹30,000',
    duration: '120-140 दिन'
  },
  'Cotton': {
    name: 'Cotton', nameHi: 'कपास', nameMr: 'कापूस',
    season: 'kharif',
    reasons: {
      en: ['Black soil is ideal', 'Good potassium in soil', 'High demand in textile market'],
      hi: ['काली मिट्टी सबसे अच्छी', 'मिट्टी में पोटाश अच्छा', 'कपड़ा बाजार में मांग'],
      mr: ['काळी माती सर्वोत्तम', 'मातीत पोटॅश चांगले', 'कापड बाजारात मागणी']
    },
    yieldPerAcre: '8-12 क्विंटल',
    profitPerAcre: '₹35,000 - ₹50,000',
    duration: '150-180 दिन'
  },
  'Soybean': {
    name: 'Soybean', nameHi: 'सोयाबीन', nameMr: 'सोयाबीन',
    season: 'kharif',
    reasons: {
      en: ['Fixes nitrogen in soil', 'Good rainfall conditions', 'Strong export demand'],
      hi: ['मिट्टी में नाइट्रोजन बढ़ाती है', 'बारिश की स्थिति अच्छी', 'निर्यात में मांग'],
      mr: ['मातीत नायट्रोजन वाढवते', 'पावसाची स्थिती चांगली', 'निर्यातीत मागणी']
    },
    yieldPerAcre: '10-15 क्विंटल',
    profitPerAcre: '₹30,000 - ₹45,000',
    duration: '90-120 दिन'
  },
  'Sugarcane': {
    name: 'Sugarcane', nameHi: 'गन्ना', nameMr: 'ऊस',
    season: 'all',
    reasons: {
      en: ['High water availability', 'Good alkaline soil', 'Sugar mill nearby ensures sale'],
      hi: ['पानी की अच्छी उपलब्धता', 'क्षारीय मिट्टी उपयुक्त', 'नजदीक चीनी मिल'],
      mr: ['पाण्याची चांगली उपलब्धता', 'क्षारीय माती योग्य', 'जवळ साखर कारखाना']
    },
    yieldPerAcre: '350-400 क्विंटल',
    profitPerAcre: '₹80,000 - ₹1,20,000',
    duration: '12-18 महीने'
  },
  'Chickpea': {
    name: 'Chickpea', nameHi: 'चना', nameMr: 'हरभरा',
    season: 'rabi',
    reasons: {
      en: ['Low water requirement', 'Good for crop rotation', 'High protein demand'],
      hi: ['कम पानी की जरूरत', 'फसल चक्र के लिए अच्छा', 'प्रोटीन की मांग'],
      mr: ['कमी पाणी लागते', 'पीक चक्रासाठी चांगले', 'प्रथिनांची मागणी']
    },
    yieldPerAcre: '8-12 क्विंटल',
    profitPerAcre: '₹25,000 - ₹35,000',
    duration: '90-120 दिन'
  },
  'Groundnut': {
    name: 'Groundnut', nameHi: 'मूंगफली', nameMr: 'भुईमूग',
    season: 'kharif',
    reasons: {
      en: ['Sandy loam soil ideal', 'Good oil content demand', 'Fixes nitrogen in soil'],
      hi: ['बलुई दोमट मिट्टी उपयुक्त', 'तेल की मांग अच्छी', 'नाइट्रोजन स्थिर करती है'],
      mr: ['वालुकामय चिकणमाती योग्य', 'तेलाची मागणी चांगली', 'नायट्रोजन स्थिर करते']
    },
    yieldPerAcre: '12-18 क्विंटल',
    profitPerAcre: '₹35,000 - ₹50,000',
    duration: '100-130 दिन'
  },
  'Turmeric': {
    name: 'Turmeric', nameHi: 'हल्दी', nameMr: 'हळद',
    season: 'kharif',
    reasons: {
      en: ['High NPK in your soil', 'Good for spice cultivation', 'Export quality possible'],
      hi: ['मिट्टी में NPK अच्छा', 'मसाला खेती के लिए', 'निर्यात गुणवत्ता संभव'],
      mr: ['मातीत NPK चांगले', 'मसाला शेतीसाठी', 'निर्यात गुणवत्ता शक्य']
    },
    yieldPerAcre: '80-100 क्विंटल (कच्ची)',
    profitPerAcre: '₹1,50,000 - ₹2,50,000',
    duration: '8-9 महीने'
  },
  'Bajra': {
    name: 'Bajra', nameHi: 'बाजरा', nameMr: 'बाजरी',
    season: 'kharif',
    reasons: {
      en: ['Drought resistant crop', 'Low input cost', 'Growing health food demand'],
      hi: ['सूखा सहनशील फसल', 'कम लागत', 'स्वास्थ्य भोजन की मांग'],
      mr: ['दुष्काळ सहनशील पीक', 'कमी खर्च', 'आरोग्य अन्नाची मागणी']
    },
    yieldPerAcre: '10-15 क्विंटल',
    profitPerAcre: '₹15,000 - ₹25,000',
    duration: '70-90 दिन'
  },
  'Mustard': {
    name: 'Mustard', nameHi: 'सरसों', nameMr: 'मोहरी',
    season: 'rabi',
    reasons: {
      en: ['Cold weather crop', 'Oil seed demand high', 'Short duration crop'],
      hi: ['ठंडी में उगने वाली', 'तिलहन की मांग', 'कम समय की फसल'],
      mr: ['थंड हवामानातील पीक', 'तेलबियांची मागणी', 'कमी कालावधीचे पीक']
    },
    yieldPerAcre: '6-10 क्विंटल',
    profitPerAcre: '₹20,000 - ₹30,000',
    duration: '110-140 दिन'
  }
};

// Mock mandi prices
const MOCK_MANDI_PRICES: Record<string, { price: number; market: string; trend: 'up' | 'down' | 'stable' }> = {
  'Rice': { price: 2200, market: 'Nagpur', trend: 'stable' },
  'Wheat': { price: 2400, market: 'Akola', trend: 'up' },
  'Cotton': { price: 6800, market: 'Nagpur', trend: 'up' },
  'Soybean': { price: 4500, market: 'Latur', trend: 'down' },
  'Sugarcane': { price: 350, market: 'Kolhapur', trend: 'stable' },
  'Chickpea': { price: 5200, market: 'Jalna', trend: 'up' },
  'Groundnut': { price: 5800, market: 'Rajkot', trend: 'stable' },
  'Turmeric': { price: 8500, market: 'Sangli', trend: 'up' },
  'Bajra': { price: 2100, market: 'Aurangabad', trend: 'stable' },
  'Mustard': { price: 5500, market: 'Jaipur', trend: 'down' }
};

// Generate enhanced ML recommendation with top 3 crops
function generateEnhancedMLRecommendation(
  nitrogen: number, phosphorus: number, potassium: number,
  temperature: number, humidity: number, ph: number, rainfall: number
): EnhancedMLRecommendation {
  const scores: { crop: string; score: number }[] = [];
  
  // Score each crop based on parameters
  Object.keys(CROP_DATA).forEach(cropName => {
    let score = 50; // Base score
    
    // Rice scoring
    if (cropName === 'Rice') {
      if (rainfall > 150) score += 30;
      if (humidity > 70) score += 15;
      if (temperature > 25 && temperature < 35) score += 10;
    }
    // Wheat scoring
    else if (cropName === 'Wheat') {
      if (nitrogen > 60 && phosphorus > 40) score += 25;
      if (temperature > 15 && temperature < 25) score += 20;
      if (ph >= 6 && ph <= 7.5) score += 10;
    }
    // Cotton scoring
    else if (cropName === 'Cotton') {
      if (potassium > 60) score += 25;
      if (rainfall < 100) score += 15;
      if (temperature > 25) score += 10;
    }
    // Soybean scoring
    else if (cropName === 'Soybean') {
      if (nitrogen > 50 && rainfall > 80) score += 30;
      if (ph >= 6 && ph <= 7) score += 15;
    }
    // Sugarcane scoring
    else if (cropName === 'Sugarcane') {
      if (ph > 7) score += 20;
      if (temperature > 25) score += 15;
      if (rainfall > 100) score += 15;
    }
    // Chickpea scoring
    else if (cropName === 'Chickpea') {
      if (temperature > 15 && temperature < 30) score += 25;
      if (humidity > 40 && humidity < 70) score += 15;
      if (rainfall < 100) score += 10;
    }
    // Groundnut scoring
    else if (cropName === 'Groundnut') {
      if (phosphorus > 40 && potassium > 50) score += 25;
      if (ph >= 5.5 && ph <= 7) score += 15;
    }
    // Turmeric scoring
    else if (cropName === 'Turmeric') {
      if (nitrogen > 80 && phosphorus > 60 && potassium > 60) score += 35;
      if (rainfall > 100) score += 10;
    }
    // Bajra scoring
    else if (cropName === 'Bajra') {
      if (nitrogen < 50) score += 20;
      if (rainfall < 80) score += 20;
      if (temperature > 25) score += 10;
    }
    // Mustard scoring
    else if (cropName === 'Mustard') {
      if (temperature > 15 && temperature < 28) score += 25;
      if (humidity < 60) score += 15;
    }
    
    // Add some randomness for variety
    score += Math.random() * 10;
    scores.push({ crop: cropName, score: Math.min(score, 98) });
  });
  
  // Sort and take top 3
  scores.sort((a, b) => b.score - a.score);
  const top3 = scores.slice(0, 3);
  
  const crops: CropCard[] = top3.map((item, index) => {
    const cropData = CROP_DATA[item.crop];
    return {
      ...cropData,
      confidence: Math.round(item.score),
      rank: index + 1,
      mandiPrice: MOCK_MANDI_PRICES[item.crop]
    };
  });
  
  // Generate input summary
  const soilHealth = nitrogen > 60 && phosphorus > 40 && potassium > 40
    ? 'Good' : nitrogen > 40 ? 'Moderate' : 'Low';
  const climate = temperature > 30 ? 'Hot' : temperature > 20 ? 'Moderate' : 'Cool';
  const season = rainfall > 100 ? 'Kharif' : temperature < 20 ? 'Rabi' : 'Zaid';
  
  return {
    crops,
    inputSummary: { soilHealth, climate, season }
  };
}

// Season badge component
function SeasonBadge({ season, language }: { season: string; language: string }) {
  const seasonLabels: Record<string, Record<string, string>> = {
    kharif: { en: 'Kharif (Jun-Oct)', hi: 'खरीफ (जून-अक्टूबर)', mr: 'खरीप (जून-ऑक्टोबर)' },
    rabi: { en: 'Rabi (Nov-Mar)', hi: 'रबी (नवंबर-मार्च)', mr: 'रब्बी (नोव्हेंबर-मार्च)' },
    zaid: { en: 'Zaid (Mar-Jun)', hi: 'जायद (मार्च-जून)', mr: 'उन्हाळी (मार्च-जून)' },
    all: { en: 'Year Round', hi: 'साल भर', mr: 'वर्षभर' }
  };
  
  const colors: Record<string, string> = {
    kharif: 'bg-green-100 text-green-800 border-green-300',
    rabi: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    zaid: 'bg-orange-100 text-orange-800 border-orange-300',
    all: 'bg-blue-100 text-blue-800 border-blue-300'
  };
  
  const lang = language as 'en' | 'hi' | 'mr';
  return (
    <Badge variant="outline" className={`${colors[season]} font-medium`}>
      <Calendar className="h-3 w-3 mr-1" />
      {seasonLabels[season]?.[lang] || seasonLabels[season]?.en || season}
    </Badge>
  );
}

// Rank badge component
function RankBadge({ rank }: { rank: number }) {
  const colors = ['bg-yellow-400 text-yellow-900', 'bg-gray-300 text-gray-800', 'bg-orange-300 text-orange-900'];
  const icons = ['🥇', '🥈', '🥉'];
  
  return (
    <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full ${colors[rank - 1]} flex items-center justify-center text-sm font-bold shadow-md`}>
      {icons[rank - 1]}
    </div>
  );
}

// Enhanced Crop Card Component
function CropResultCard({ 
  crop, 
  language, 
  onViewGuide, 
  onMarketPrice, 
  onChatAdvisor,
  onSavePlan 
}: { 
  crop: CropCard; 
  language: string;
  onViewGuide: (crop: string) => void;
  onMarketPrice: (crop: string) => void;
  onChatAdvisor: (crop: string) => void;
  onSavePlan: (crop: string) => void;
}) {
  const lang = language as 'en' | 'hi' | 'mr';
  
  const labels = {
    yieldPerAcre: { en: 'Yield/Acre', hi: 'उपज/एकड़', mr: 'उत्पादन/एकर' },
    profitPerAcre: { en: 'Profit/Acre', hi: 'लाभ/एकड़', mr: 'नफा/एकर' },
    duration: { en: 'Duration', hi: 'अवधि', mr: 'कालावधी' },
    whyThisCrop: { en: 'Why This Crop?', hi: 'यह फसल क्यों?', mr: 'हे पीक का?' },
    currentPrice: { en: 'Current Price', hi: 'वर्तमान भाव', mr: 'सध्याचा भाव' },
    viewGuide: { en: 'View Guide', hi: 'गाइड देखें', mr: 'मार्गदर्शन पहा' },
    marketPrice: { en: 'Market Price', hi: 'बाजार भाव', mr: 'बाजारभाव' },
    chatAdvisor: { en: 'Chat Advisor', hi: 'सलाहकार से बात', mr: 'सल्लागाराशी बोला' },
    savePlan: { en: 'Save Plan', hi: 'प्लान सेव करें', mr: 'योजना जतन करा' },
    confidence: { en: 'Match', hi: 'मैच', mr: 'जुळणी' }
  };
  
  const trendIcons = { up: '📈', down: '📉', stable: '➡️' };
  const cropName = lang === 'hi' ? crop.nameHi : lang === 'mr' ? crop.nameMr : crop.name;
  const reasons = crop.reasons[lang] || crop.reasons.en;
  
  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${
      crop.rank === 1 ? 'ring-2 ring-green-500 ring-offset-2' : ''
    }`}>
      <RankBadge rank={crop.rank} />
      
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 ml-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Wheat className="h-5 w-5 text-green-600" />
              {cropName}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <SeasonBadge season={crop.season} language={language} />
              <Badge variant="secondary" className="font-medium">
                <Star className="h-3 w-3 mr-1 text-yellow-500" />
                {crop.confidence}% {labels.confidence[lang]}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Confidence Progress */}
        <Progress value={crop.confidence} className="h-2" />
        
        {/* Why This Crop - Reasons in bullets */}
        <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
          <h4 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-1">
            <Info className="h-4 w-4" />
            {labels.whyThisCrop[lang]}
          </h4>
          <ul className="space-y-1">
            {reasons.slice(0, 3).map((reason, idx) => (
              <li key={idx} className="text-sm text-green-700 dark:text-green-300 flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Yield & Profit Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-2">
            <Package className="h-4 w-4 mx-auto text-blue-600 mb-1" />
            <div className="text-xs text-muted-foreground">{labels.yieldPerAcre[lang]}</div>
            <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">{crop.yieldPerAcre}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-2">
            <IndianRupee className="h-4 w-4 mx-auto text-green-600 mb-1" />
            <div className="text-xs text-muted-foreground">{labels.profitPerAcre[lang]}</div>
            <div className="text-sm font-semibold text-green-700 dark:text-green-300">{crop.profitPerAcre}</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950 rounded-lg p-2">
            <Calendar className="h-4 w-4 mx-auto text-orange-600 mb-1" />
            <div className="text-xs text-muted-foreground">{labels.duration[lang]}</div>
            <div className="text-sm font-semibold text-orange-700 dark:text-orange-300">{crop.duration}</div>
          </div>
        </div>
        
        {/* Mandi Price Preview */}
        {crop.mandiPrice && (
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-muted-foreground">{labels.currentPrice[lang]}:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">₹{crop.mandiPrice.price}/क्विंटल</span>
              <span>{trendIcons[crop.mandiPrice.trend]}</span>
              <span className="text-xs text-muted-foreground">({crop.mandiPrice.market})</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <Separator />
      
      <CardFooter className="pt-3 pb-3">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => onViewGuide(crop.name)}
          >
            <BookOpen className="h-3 w-3" />
            {labels.viewGuide[lang]}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => onMarketPrice(crop.name)}
          >
            <TrendingUp className="h-3 w-3" />
            {labels.marketPrice[lang]}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => onChatAdvisor(crop.name)}
          >
            <MessageCircle className="h-3 w-3" />
            {labels.chatAdvisor[lang]}
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1 bg-green-600 hover:bg-green-700"
            onClick={() => onSavePlan(crop.name)}
          >
            <Save className="h-3 w-3" />
            {labels.savePlan[lang]}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export function CropRecommendation() {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    location: "",
    soilType: "",
    season: "",
    farmSize: "",
    ph: 6.5,
    moisture: 50
  });
  
  const [mlData, setMLData] = useState({
    nitrogen: 50,
    phosphorus: 40,
    potassium: 40,
    temperature: 25,
    humidity: 80,
    ph: 6.5,
    rainfall: 100
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [recommendation, setRecommendation] = useState<CropRec | null>(null);
  const [mlRecommendation, setMLRecommendation] = useState<MLRecommendation | null>(null);
  const [enhancedMLRec, setEnhancedMLRec] = useState<EnhancedMLRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [mlLoading, setMLLoading] = useState(false);
  
  // Saved plans for farmer history
  const [savedPlans, setSavedPlans] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMLInputChange = (field: string, value: number) => {
    setMLData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Action handlers
  const handleViewGuide = useCallback((crop: string) => {
    toast.info(
      language === 'hi' ? `${crop} की खेती गाइड खोल रहे हैं...` :
      language === 'mr' ? `${crop} शेती मार्गदर्शक उघडत आहे...` :
      `Opening ${crop} cultivation guide...`
    );
  }, [language]);
  
  const handleMarketPrice = useCallback((crop: string) => {
    toast.info(
      language === 'hi' ? `${crop} का बाजार भाव देख रहे हैं...` :
      language === 'mr' ? `${crop} चा बाजारभाव पहात आहे...` :
      `Checking ${crop} market prices...`
    );
  }, [language]);
  
  const handleChatAdvisor = useCallback((crop: string) => {
    toast.info(
      language === 'hi' ? `${crop} के बारे में सलाहकार से बात शुरू...` :
      language === 'mr' ? `${crop} बद्दल सल्लागाराशी बोलणे सुरू...` :
      `Starting chat about ${crop}...`
    );
  }, [language]);
  
  const handleSavePlan = useCallback((crop: string) => {
    setSavedPlans(prev => {
      if (prev.includes(crop)) {
        toast.info(
          language === 'hi' ? `${crop} पहले से सेव है` :
          language === 'mr' ? `${crop} आधीच जतन केले आहे` :
          `${crop} is already saved`
        );
        return prev;
      }
      toast.success(
        language === 'hi' ? `✅ ${crop} की योजना सेव हो गई!` :
        language === 'mr' ? `✅ ${crop} ची योजना जतन झाली!` :
        `✅ ${crop} plan saved!`
      );
      return [...prev, crop];
    });
  }, [language]);

  const getWeatherAndRecommendation = async () => {
    if (!formData.location || !formData.soilType) {
      toast.error("Please fill in location and soil type");
      return;
    }

    setLoading(true);
    try {
      // Get weather data
      const weather = await weatherService.getWeatherByCity(formData.location);
      if (!weather) {
        toast.error("Could not fetch weather data for this location");
        setLoading(false);
        return;
      }
      
      setWeatherData(weather);
      
      // Get crop recommendation - adapt weather data to old format
      const adaptedWeather = {
        temperature: weather.current.temperature,
        humidity: weather.current.humidity,
        city: weather.location.city,
        description: weather.current.description,
        windSpeed: weather.current.windSpeed,
        pressure: weather.current.pressure
      };
      
      const cropRec = await cropService.getRecommendation(
        formData.soilType,
        formData.ph,
        formData.moisture,
        adaptedWeather
      );
      
      setRecommendation(cropRec);
      toast.success("Recommendation generated successfully!");
    } catch (error) {
      toast.error("Failed to generate recommendation");
    } finally {
      setLoading(false);
    }
  };

  const getMLRecommendation = async () => {
    setMLLoading(true);
    setEnhancedMLRec(null);
    
    try {
      // Simulate ML model processing with loading animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate enhanced recommendation with top 3 crops
      const enhanced = generateEnhancedMLRecommendation(
        mlData.nitrogen,
        mlData.phosphorus,
        mlData.potassium,
        mlData.temperature,
        mlData.humidity,
        mlData.ph,
        mlData.rainfall
      );
      
      setEnhancedMLRec(enhanced);
      
      // Also get original ML recommendation for backward compatibility
      const mlRec = await cropService.getMLRecommendation(
        mlData.nitrogen,
        mlData.phosphorus,
        mlData.potassium,
        mlData.temperature,
        mlData.humidity,
        mlData.ph,
        mlData.rainfall
      );
      setMLRecommendation(mlRec);
      
      toast.success(
        language === 'hi' ? '✅ AI सिफारिश तैयार!' :
        language === 'mr' ? '✅ AI शिफारस तयार!' :
        '✅ AI recommendation ready!'
      );
    } catch (error) {
      toast.error(
        language === 'hi' ? 'सिफारिश बनाने में समस्या हुई' :
        language === 'mr' ? 'शिफारस तयार करण्यात समस्या' :
        'Failed to generate ML recommendation'
      );
    } finally {
      setMLLoading(false);
    }
  };
  
  // Multilingual labels for ML input fields (farmer-friendly, no NPK jargon)
  const mlLabels = {
    nitrogen: { 
      en: 'Soil Fertility (Nitrogen)', 
      hi: 'मिट्टी की उर्वरता (नाइट्रोजन)', 
      mr: 'मातीची सुपीकता (नायट्रोजन)',
      desc: { en: 'Green leaf growth', hi: 'पत्तियों की हरियाली', mr: 'पानांची हिरवळ' }
    },
    phosphorus: { 
      en: 'Root Strength (Phosphorus)', 
      hi: 'जड़ की मजबूती (फास्फोरस)', 
      mr: 'मुळांची ताकद (फॉस्फरस)',
      desc: { en: 'Root development', hi: 'जड़ों का विकास', mr: 'मुळांचा विकास' }
    },
    potassium: { 
      en: 'Crop Immunity (Potassium)', 
      hi: 'फसल की प्रतिरोधक क्षमता (पोटाश)', 
      mr: 'पिकाची रोगप्रतिकारशक्ती (पोटॅश)',
      desc: { en: 'Disease resistance', hi: 'रोग प्रतिरोधक', mr: 'रोगप्रतिकारक' }
    },
    temperature: { 
      en: 'Temperature', 
      hi: 'तापमान', 
      mr: 'तापमान',
      desc: { en: 'Current temp', hi: 'मौजूदा तापमान', mr: 'सध्याचे तापमान' }
    },
    humidity: { 
      en: 'Air Moisture', 
      hi: 'हवा की नमी', 
      mr: 'हवेतील ओलावा',
      desc: { en: 'Humidity level', hi: 'नमी का स्तर', mr: 'ओलावा पातळी' }
    },
    ph: { 
      en: 'Soil Acidity (pH)', 
      hi: 'मिट्टी की अम्लता (pH)', 
      mr: 'मातीची आम्लता (pH)',
      desc: { en: 'Acid/Alkaline', hi: 'अम्लीय/क्षारीय', mr: 'आम्ल/क्षारीय' }
    },
    rainfall: { 
      en: 'Expected Rainfall', 
      hi: 'अपेक्षित बारिश', 
      mr: 'अपेक्षित पाऊस',
      desc: { en: 'mm per month', hi: 'मिमी प्रति महीना', mr: 'मिमी प्रति महिना' }
    }
  };
  
  const lang = language as 'en' | 'hi' | 'mr';

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t('cropRecommendationTitle')}</h2>
        <p className="text-muted-foreground">{t('getPersonalizedSuggestions')}</p>
      </div>

      <Tabs defaultValue="ml" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic" className="gap-1">
            <Leaf className="h-4 w-4" />
            {language === 'hi' ? 'सामान्य सिफारिश' : language === 'mr' ? 'सामान्य शिफारस' : 'Basic'}
          </TabsTrigger>
          <TabsTrigger value="ml" className="gap-1">
            <Brain className="h-4 w-4" />
            {language === 'hi' ? 'AI सिफारिश' : language === 'mr' ? 'AI शिफारस' : 'AI Powered'}
          </TabsTrigger>
        </TabsList>

        {/* Basic Recommendation Tab */}
        <TabsContent value="basic" className="space-y-6">
          {/* Weather Information */}
          {formData.location && (
            <WeatherWidget 
              city={formData.location} 
              compact={true} 
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                {language === 'hi' ? 'खेत की जानकारी' : language === 'mr' ? 'शेताची माहिती' : 'Farm Information'}
              </CardTitle>
              <CardDescription>
                {language === 'hi' ? 'अपने खेत का विवरण दें' : language === 'mr' ? 'तुमच्या शेताचे वर्णन द्या' : 'Enter your farm details'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">{t('location')}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder={t('enterLocation')}
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="soilType">{t('soilType')}</Label>
                  <Select value={formData.soilType} onValueChange={(value) => handleInputChange('soilType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectSoilType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alluvial">Alluvial</SelectItem>
                      <SelectItem value="Black">Black</SelectItem>
                      <SelectItem value="Red">Red</SelectItem>
                      <SelectItem value="Laterite">Laterite</SelectItem>
                      <SelectItem value="Mountain">Mountain</SelectItem>
                      <SelectItem value="Desert">Desert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="season">{t('season')}</Label>
                  <Select value={formData.season} onValueChange={(value) => handleInputChange('season', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectSeason')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kharif">{t('kharif')}</SelectItem>
                      <SelectItem value="rabi">{t('rabi')}</SelectItem>
                      <SelectItem value="zaid">{t('zaid')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="farmSize">{t('farmSize')}</Label>
                  <Input
                    id="farmSize"
                    type="number"
                    placeholder={t('enterFarmSize')}
                    value={formData.farmSize}
                    onChange={(e) => handleInputChange('farmSize', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Soil pH: {formData.ph}</Label>
                  <input
                    type="range"
                    min="4"
                    max="10"
                    step="0.1"
                    value={formData.ph}
                    onChange={(e) => handleInputChange('ph', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Acidic (4)</span>
                    <span>Neutral (7)</span>
                    <span>Alkaline (10)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Soil Moisture: {formData.moisture}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.moisture}
                    onChange={(e) => handleInputChange('moisture', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Dry (0%)</span>
                    <span>Optimal (50%)</span>
                    <span>Wet (100%)</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={getWeatherAndRecommendation} 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting recommendation...
                  </>
                ) : (
                  t('getRecommendations')
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Weather Data Display */}
          {weatherData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Current Weather - {weatherData.city}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span>Temperature: {weatherData.temperature}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span>Humidity: {weatherData.humidity}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Basic Recommendation Results */}
          {recommendation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Recommended Crop
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-green-700">{recommendation.crop}</h3>
                  <Badge variant="secondary" className="text-sm">
                    {recommendation.confidence.toFixed(1)}% confidence
                  </Badge>
                </div>
                
                <Progress value={recommendation.confidence} className="w-full" />
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">{recommendation.reason}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ML Recommendation Tab - Enhanced with Top 3 Crops Grid */}
        <TabsContent value="ml" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <Sparkles className="h-4 w-4 text-yellow-500" />
                {language === 'hi' ? 'AI फसल सिफारिश' : language === 'mr' ? 'AI पीक शिफारस' : 'AI Crop Recommendation'}
              </CardTitle>
              <CardDescription>
                {language === 'hi' ? 'मिट्टी और मौसम के आधार पर सर्वोत्तम फसलें' : 
                 language === 'mr' ? 'माती आणि हवामानावर आधारित सर्वोत्तम पिके' : 
                 'Best crops based on your soil and weather conditions'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Farmer-friendly input sliders with multilingual labels */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Soil Fertility (Nitrogen) */}
                <div className="space-y-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <Label className="flex items-center justify-between">
                    <span className="font-medium text-green-800 dark:text-green-200">
                      {mlLabels.nitrogen[lang]}
                    </span>
                    <Badge variant="outline" className="bg-green-100">{mlData.nitrogen}</Badge>
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    value={mlData.nitrogen}
                    onChange={(e) => handleMLInputChange('nitrogen', parseInt(e.target.value))}
                    className="w-full accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{language === 'hi' ? 'कम' : language === 'mr' ? 'कमी' : 'Low'}</span>
                    <span>{mlLabels.nitrogen.desc[lang]}</span>
                    <span>{language === 'hi' ? 'ज्यादा' : language === 'mr' ? 'जास्त' : 'High'}</span>
                  </div>
                </div>

                {/* Root Strength (Phosphorus) */}
                <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <Label className="flex items-center justify-between">
                    <span className="font-medium text-blue-800 dark:text-blue-200">
                      {mlLabels.phosphorus[lang]}
                    </span>
                    <Badge variant="outline" className="bg-blue-100">{mlData.phosphorus}</Badge>
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    value={mlData.phosphorus}
                    onChange={(e) => handleMLInputChange('phosphorus', parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{language === 'hi' ? 'कम' : language === 'mr' ? 'कमी' : 'Low'}</span>
                    <span>{mlLabels.phosphorus.desc[lang]}</span>
                    <span>{language === 'hi' ? 'ज्यादा' : language === 'mr' ? 'जास्त' : 'High'}</span>
                  </div>
                </div>

                {/* Crop Immunity (Potassium) */}
                <div className="space-y-2 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <Label className="flex items-center justify-between">
                    <span className="font-medium text-orange-800 dark:text-orange-200">
                      {mlLabels.potassium[lang]}
                    </span>
                    <Badge variant="outline" className="bg-orange-100">{mlData.potassium}</Badge>
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    value={mlData.potassium}
                    onChange={(e) => handleMLInputChange('potassium', parseInt(e.target.value))}
                    className="w-full accent-orange-600"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{language === 'hi' ? 'कम' : language === 'mr' ? 'कमी' : 'Low'}</span>
                    <span>{mlLabels.potassium.desc[lang]}</span>
                    <span>{language === 'hi' ? 'ज्यादा' : language === 'mr' ? 'जास्त' : 'High'}</span>
                  </div>
                </div>

                {/* Temperature */}
                <div className="space-y-2 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                  <Label className="flex items-center justify-between">
                    <span className="font-medium text-red-800 dark:text-red-200 flex items-center gap-1">
                      <Thermometer className="h-4 w-4" />
                      {mlLabels.temperature[lang]}
                    </span>
                    <Badge variant="outline" className="bg-red-100">{mlData.temperature}°C</Badge>
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={mlData.temperature}
                    onChange={(e) => handleMLInputChange('temperature', parseInt(e.target.value))}
                    className="w-full accent-red-600"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{language === 'hi' ? 'ठंडा' : language === 'mr' ? 'थंड' : 'Cold'}</span>
                    <span>{mlLabels.temperature.desc[lang]}</span>
                    <span>{language === 'hi' ? 'गर्म' : language === 'mr' ? 'गरम' : 'Hot'}</span>
                  </div>
                </div>

                {/* Air Moisture (Humidity) */}
                <div className="space-y-2 p-3 bg-cyan-50 dark:bg-cyan-950 rounded-lg">
                  <Label className="flex items-center justify-between">
                    <span className="font-medium text-cyan-800 dark:text-cyan-200 flex items-center gap-1">
                      <Droplets className="h-4 w-4" />
                      {mlLabels.humidity[lang]}
                    </span>
                    <Badge variant="outline" className="bg-cyan-100">{mlData.humidity}%</Badge>
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={mlData.humidity}
                    onChange={(e) => handleMLInputChange('humidity', parseInt(e.target.value))}
                    className="w-full accent-cyan-600"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{language === 'hi' ? 'सूखा' : language === 'mr' ? 'कोरडे' : 'Dry'}</span>
                    <span>{mlLabels.humidity.desc[lang]}</span>
                    <span>{language === 'hi' ? 'नम' : language === 'mr' ? 'दमट' : 'Humid'}</span>
                  </div>
                </div>

                {/* Soil pH */}
                <div className="space-y-2 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <Label className="flex items-center justify-between">
                    <span className="font-medium text-purple-800 dark:text-purple-200">
                      {mlLabels.ph[lang]}
                    </span>
                    <Badge variant="outline" className="bg-purple-100">{mlData.ph}</Badge>
                  </Label>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    step="0.1"
                    value={mlData.ph}
                    onChange={(e) => handleMLInputChange('ph', parseFloat(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{language === 'hi' ? 'अम्लीय' : language === 'mr' ? 'आम्लीय' : 'Acidic'}</span>
                    <span>{mlLabels.ph.desc[lang]}</span>
                    <span>{language === 'hi' ? 'क्षारीय' : language === 'mr' ? 'क्षारीय' : 'Alkaline'}</span>
                  </div>
                </div>

                {/* Expected Rainfall */}
                <div className="space-y-2 p-3 bg-sky-50 dark:bg-sky-950 rounded-lg md:col-span-2 lg:col-span-3">
                  <Label className="flex items-center justify-between">
                    <span className="font-medium text-sky-800 dark:text-sky-200 flex items-center gap-1">
                      <Cloud className="h-4 w-4" />
                      {mlLabels.rainfall[lang]}
                    </span>
                    <Badge variant="outline" className="bg-sky-100">{mlData.rainfall} mm</Badge>
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={mlData.rainfall}
                    onChange={(e) => handleMLInputChange('rainfall', parseInt(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{language === 'hi' ? 'कम बारिश' : language === 'mr' ? 'कमी पाऊस' : 'Low rainfall'}</span>
                    <span>{mlLabels.rainfall.desc[lang]}</span>
                    <span>{language === 'hi' ? 'ज्यादा बारिश' : language === 'mr' ? 'जास्त पाऊस' : 'Heavy rainfall'}</span>
                  </div>
                </div>
              </div>

              {/* Get Recommendation Button */}
              <Button 
                onClick={getMLRecommendation} 
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 h-12 text-lg" 
                disabled={mlLoading}
              >
                {mlLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="animate-pulse">
                      {language === 'hi' ? 'AI मॉडल काम कर रहा है...' : 
                       language === 'mr' ? 'AI मॉडेल काम करत आहे...' : 
                       'AI model processing...'}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    <Sparkles className="h-4 w-4" />
                    {language === 'hi' ? 'AI सिफारिश प्राप्त करें' : 
                     language === 'mr' ? 'AI शिफारस मिळवा' : 
                     'Get AI Recommendation'}
                    <ArrowRight className="h-5 w-5 ml-1" />
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Loading Animation */}
          {mlLoading && (
            <Card className="border-2 border-dashed border-green-300">
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-pulse"></div>
                    <Brain className="absolute inset-0 m-auto h-8 w-8 text-green-600 animate-bounce" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-green-700">
                      {language === 'hi' ? 'आपके खेत के लिए सर्वोत्तम फसलें खोज रहे हैं...' : 
                       language === 'mr' ? 'तुमच्या शेतासाठी सर्वोत्तम पिके शोधत आहे...' : 
                       'Finding the best crops for your farm...'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === 'hi' ? 'कृपया प्रतीक्षा करें' : 
                       language === 'mr' ? 'कृपया प्रतीक्षा करा' : 
                       'Please wait'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced ML Recommendation Results - TOP 3 Crops Grid */}
          {enhancedMLRec && !mlLoading && (
            <div className="space-y-6">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-xl font-bold">
                    {language === 'hi' ? 'आपके लिए सर्वोत्तम 3 फसलें' : 
                     language === 'mr' ? 'तुमच्यासाठी सर्वोत्तम 3 पिके' : 
                     'Top 3 Crops for You'}
                  </h3>
                </div>
                {savedPlans.length > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    <Save className="h-3 w-3" />
                    {savedPlans.length} {language === 'hi' ? 'सेव किए' : language === 'mr' ? 'जतन केले' : 'saved'}
                  </Badge>
                )}
              </div>
              
              {/* Top 3 Crops Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enhancedMLRec.crops.map((crop) => (
                  <CropResultCard
                    key={crop.name}
                    crop={crop}
                    language={language}
                    onViewGuide={handleViewGuide}
                    onMarketPrice={handleMarketPrice}
                    onChatAdvisor={handleChatAdvisor}
                    onSavePlan={handleSavePlan}
                  />
                ))}
              </div>
              
              {/* Input Summary */}
              <Card className="bg-gray-50 dark:bg-gray-900">
                <CardContent className="py-4">
                  <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">
                        {language === 'hi' ? 'मिट्टी स्वास्थ्य:' : language === 'mr' ? 'माती आरोग्य:' : 'Soil Health:'}
                      </span>
                      <Badge variant="outline">{enhancedMLRec.inputSummary.soilHealth}</Badge>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-orange-600" />
                      <span className="text-muted-foreground">
                        {language === 'hi' ? 'जलवायु:' : language === 'mr' ? 'हवामान:' : 'Climate:'}
                      </span>
                      <Badge variant="outline">{enhancedMLRec.inputSummary.climate}</Badge>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-muted-foreground">
                        {language === 'hi' ? 'सीजन:' : language === 'mr' ? 'हंगाम:' : 'Season:'}
                      </span>
                      <Badge variant="outline">{enhancedMLRec.inputSummary.season}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}