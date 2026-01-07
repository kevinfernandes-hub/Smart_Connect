// API Integration for KisanConnect Chatbot
// Handles external service calls with proper error handling

export interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  rainfall: number;
  windSpeed: number;
  forecast: {
    date: string;
    temp: number;
    condition: string;
  }[];
}

export interface MandiPrice {
  commodity: string;
  market: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  date: string;
}

export interface DiseaseDetectionResult {
  disease: string;
  confidence: number;
  description: string;
  treatment: string[];
  prevention: string[];
}

export interface ChatApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  sessionId?: string;
}

// API Base URL - configure based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Session cookie name
const SESSION_COOKIE = 'kc_session';

/**
 * Check if user is authenticated (has valid session)
 */
export function isAuthenticated(): boolean {
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find(c => c.trim().startsWith(`${SESSION_COOKIE}=`));
  return !!sessionCookie;
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: any
): Promise<{ data?: T; error?: string; status: number }> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for session
    };
    
    if (body && method === 'POST') {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    // Handle specific error codes
    if (response.status === 401) {
      return { error: 'Session expired. Please login again.', status: 401 };
    }
    
    if (response.status === 500) {
      return { error: 'Server error. Please try again later.', status: 500 };
    }
    
    if (!response.ok) {
      return { error: `Request failed: ${response.statusText}`, status: response.status };
    }
    
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error('API request error:', error);
    return { error: 'Network error. Check your connection.', status: 0 };
  }
}

/**
 * Send chat message to backend
 */
export async function sendChatMessage(
  message: string,
  sessionId: string,
  context?: {
    crop?: string;
    season?: string;
    state?: string;
    farmSize?: number;
  }
): Promise<ChatApiResponse> {
  const result = await apiRequest<ChatApiResponse>('/chat', 'POST', {
    message,
    sessionId,
    context,
    timestamp: new Date().toISOString()
  });
  
  if (result.error) {
    return {
      success: false,
      message: '',
      error: result.error
    };
  }
  
  return result.data || { success: false, message: '', error: 'Unknown error' };
}

/**
 * Fetch weather data for a location
 */
export async function fetchWeather(
  location: string,
  lat?: number,
  lon?: number
): Promise<{ data?: WeatherData; error?: string }> {
  const params = new URLSearchParams();
  if (location) params.append('location', location);
  if (lat !== undefined) params.append('lat', lat.toString());
  if (lon !== undefined) params.append('lon', lon.toString());
  
  const result = await apiRequest<WeatherData>(`/weather?${params.toString()}`);
  
  if (result.error) {
    return { error: result.error };
  }
  
  return { data: result.data };
}

/**
 * Fetch mandi/market prices
 */
export async function fetchMandiPrices(
  commodity?: string,
  state?: string,
  market?: string
): Promise<{ data?: MandiPrice[]; error?: string }> {
  const params = new URLSearchParams();
  if (commodity) params.append('commodity', commodity);
  if (state) params.append('state', state);
  if (market) params.append('market', market);
  
  const result = await apiRequest<MandiPrice[]>(`/mandi_prices?${params.toString()}`);
  
  if (result.error) {
    return { error: result.error };
  }
  
  return { data: result.data };
}

/**
 * Upload image for disease detection
 */
export async function detectDisease(
  imageFile: File
): Promise<{ data?: DiseaseDetectionResult; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch(`${API_BASE_URL}/disease_detect`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    
    if (response.status === 401) {
      return { error: 'Session expired. Please login again.' };
    }
    
    if (response.status === 500) {
      return { error: 'Disease detection service unavailable.' };
    }
    
    if (!response.ok) {
      return { error: 'Failed to analyze image.' };
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Disease detection error:', error);
    return { error: 'Network error. Check your connection.' };
  }
}

/**
 * Format weather data for chat response
 */
export function formatWeatherForChat(
  weather: WeatherData,
  lang: 'en' | 'hi' | 'mr' = 'en'
): string {
  if (lang === 'hi') {
    return [
      `🌤️ **मौसम जानकारी:**`,
      `🌡️ तापमान: ${weather.temperature}°C`,
      `💧 नमी: ${weather.humidity}%`,
      `☔ बारिश: ${weather.rainfall}mm`,
      `💨 हवा: ${weather.windSpeed} km/h`
    ].join('\n');
  } else if (lang === 'mr') {
    return [
      `🌤️ **हवामान माहिती:**`,
      `🌡️ तापमान: ${weather.temperature}°C`,
      `💧 आर्द्रता: ${weather.humidity}%`,
      `☔ पाऊस: ${weather.rainfall}mm`,
      `💨 वारा: ${weather.windSpeed} km/h`
    ].join('\n');
  } else {
    return [
      `🌤️ **Weather Information:**`,
      `🌡️ Temperature: ${weather.temperature}°C`,
      `💧 Humidity: ${weather.humidity}%`,
      `☔ Rainfall: ${weather.rainfall}mm`,
      `💨 Wind: ${weather.windSpeed} km/h`
    ].join('\n');
  }
}

/**
 * Format mandi prices for chat response
 */
export function formatMandiPricesForChat(
  prices: MandiPrice[],
  lang: 'en' | 'hi' | 'mr' = 'en'
): string {
  if (prices.length === 0) {
    return lang === 'hi'
      ? '📊 इस कमोडिटी के लिए कोई भाव उपलब्ध नहीं है।'
      : lang === 'mr'
      ? '📊 या वस्तूसाठी कोणताही भाव उपलब्ध नाही.'
      : '📊 No prices available for this commodity.';
  }
  
  const topPrices = prices.slice(0, 3);
  
  if (lang === 'hi') {
    const lines = [`📊 **मंडी भाव (₹/क्विंटल):**`];
    topPrices.forEach(p => {
      lines.push(`• ${p.market}: ₹${p.modalPrice} (${p.minPrice}-${p.maxPrice})`);
    });
    return lines.join('\n');
  } else if (lang === 'mr') {
    const lines = [`📊 **बाजारभाव (₹/क्विंटल):**`];
    topPrices.forEach(p => {
      lines.push(`• ${p.market}: ₹${p.modalPrice} (${p.minPrice}-${p.maxPrice})`);
    });
    return lines.join('\n');
  } else {
    const lines = [`📊 **Mandi Prices (₹/quintal):**`];
    topPrices.forEach(p => {
      lines.push(`• ${p.market}: ₹${p.modalPrice} (${p.minPrice}-${p.maxPrice})`);
    });
    return lines.join('\n');
  }
}

/**
 * Format disease detection result for chat
 */
export function formatDiseaseResultForChat(
  result: DiseaseDetectionResult,
  lang: 'en' | 'hi' | 'mr' = 'en'
): string {
  const confidence = Math.round(result.confidence * 100);
  
  if (lang === 'hi') {
    return [
      `🔬 **रोग पहचाना गया:** ${result.disease}`,
      `📊 विश्वास: ${confidence}%`,
      `📋 ${result.description}`,
      `💊 उपचार: ${result.treatment[0]}`,
      `🛡️ रोकथाम: ${result.prevention[0]}`
    ].join('\n');
  } else if (lang === 'mr') {
    return [
      `🔬 **रोग ओळखला:** ${result.disease}`,
      `📊 आत्मविश्वास: ${confidence}%`,
      `📋 ${result.description}`,
      `💊 उपचार: ${result.treatment[0]}`,
      `🛡️ प्रतिबंध: ${result.prevention[0]}`
    ].join('\n');
  } else {
    return [
      `🔬 **Disease Detected:** ${result.disease}`,
      `📊 Confidence: ${confidence}%`,
      `📋 ${result.description}`,
      `💊 Treatment: ${result.treatment[0]}`,
      `🛡️ Prevention: ${result.prevention[0]}`
    ].join('\n');
  }
}

// Mock implementations for demo/offline mode
export const mockApi = {
  weather: (): WeatherData => ({
    temperature: 28,
    humidity: 65,
    description: 'Partly Cloudy',
    rainfall: 0,
    windSpeed: 12,
    forecast: [
      { date: '2026-01-08', temp: 29, condition: 'Sunny' },
      { date: '2026-01-09', temp: 27, condition: 'Cloudy' },
      { date: '2026-01-10', temp: 26, condition: 'Rain' },
    ]
  }),
  
  mandiPrices: (commodity: string): MandiPrice[] => {
    const mockPrices: Record<string, MandiPrice[]> = {
      wheat: [
        { commodity: 'Wheat', market: 'Indore', state: 'MP', minPrice: 2100, maxPrice: 2300, modalPrice: 2200, date: '2026-01-07' },
        { commodity: 'Wheat', market: 'Delhi', state: 'Delhi', minPrice: 2150, maxPrice: 2350, modalPrice: 2250, date: '2026-01-07' },
      ],
      rice: [
        { commodity: 'Rice', market: 'Karnal', state: 'Haryana', minPrice: 2800, maxPrice: 3200, modalPrice: 3000, date: '2026-01-07' },
      ],
      cotton: [
        { commodity: 'Cotton', market: 'Rajkot', state: 'Gujarat', minPrice: 6500, maxPrice: 7200, modalPrice: 6800, date: '2026-01-07' },
      ],
      soybean: [
        { commodity: 'Soybean', market: 'Indore', state: 'MP', minPrice: 4800, maxPrice: 5200, modalPrice: 5000, date: '2026-01-07' },
      ],
      onion: [
        { commodity: 'Onion', market: 'Nashik', state: 'Maharashtra', minPrice: 1200, maxPrice: 1800, modalPrice: 1500, date: '2026-01-07' },
      ],
    };
    return mockPrices[commodity.toLowerCase()] || [];
  },
  
  // SIH ML Model mock - returns one of the 4 SIH labels
  diseaseDetection: (): DiseaseDetectionResult => {
    const sihLabels = ['Nitrogen_Deficiency', 'Aphid_Attack', 'Fungal_Spot', 'Healthy'];
    const randomLabel = sihLabels[Math.floor(Math.random() * sihLabels.length)];
    const confidence = 0.75 + Math.random() * 0.2;
    
    const labelInfo: Record<string, { description: string; treatment: string[]; prevention: string[] }> = {
      'Nitrogen_Deficiency': {
        description: 'Yellowing of leaves due to nitrogen deficiency - common in Vidarbha soils',
        treatment: ['Apply Urea 50kg/acre', 'Use Jeevamrut organic spray', 'Add vermicompost'],
        prevention: ['Soil testing before sowing', 'Intercrop with legumes', 'Green manuring']
      },
      'Aphid_Attack': {
        description: 'Aphid/Mawa infestation detected - common in cotton and soybean',
        treatment: ['Neem oil spray 5ml/L', 'Imidacloprid 0.5ml/L if severe', 'Release ladybugs'],
        prevention: ['Yellow sticky traps', 'Border crops', 'Avoid excess nitrogen']
      },
      'Fungal_Spot': {
        description: 'Fungal leaf spot infection - needs immediate attention',
        treatment: ['Mancozeb 2.5g/L spray', 'Remove infected leaves', 'Trichoderma application'],
        prevention: ['Crop rotation', 'Avoid waterlogging', 'Use resistant varieties']
      },
      'Healthy': {
        description: 'Plant is healthy - continue current practices',
        treatment: ['No treatment needed', 'Continue regular monitoring'],
        prevention: ['Maintain current practices', 'Regular scouting', 'Balanced nutrition']
      }
    };
    
    const info = labelInfo[randomLabel];
    return {
      disease: randomLabel,
      confidence,
      description: info.description,
      treatment: info.treatment,
      prevention: info.prevention
    };
  }
};

export default {
  sendChatMessage,
  fetchWeather,
  fetchMandiPrices,
  detectDisease,
  formatWeatherForChat,
  formatMandiPricesForChat,
  formatDiseaseResultForChat,
  isAuthenticated,
  mockApi
};
