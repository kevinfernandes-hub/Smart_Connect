// API Utilities with caching and offline support

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  key: string;
}

class APICache {
  static set(key: string, data: any, ttl: number) {
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(`api_cache_${key}`, JSON.stringify(item));
  }

  static get(key: string): any | null {
    const itemStr = localStorage.getItem(`api_cache_${key}`);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = Date.now();

    if (now - item.timestamp > item.ttl) {
      localStorage.removeItem(`api_cache_${key}`);
      return null;
    }

    return item.data;
  }

  static clear(key?: string) {
    if (key) {
      localStorage.removeItem(`api_cache_${key}`);
    } else {
      // Clear all cache
      Object.keys(localStorage)
        .filter(k => k.startsWith('api_cache_'))
        .forEach(k => localStorage.removeItem(k));
    }
  }
}

// Fast API call with caching
export async function fetchWithCache<T>(
  url: string,
  options: RequestInit = {},
  cacheConfig?: CacheConfig
): Promise<T> {
  // Check cache first
  if (cacheConfig) {
    const cached = APICache.get(cacheConfig.key);
    if (cached) {
      console.log(`Cache hit for ${cacheConfig.key}`);
      return cached as T;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Store in cache
    if (cacheConfig) {
      APICache.set(cacheConfig.key, data, cacheConfig.ttl);
    }

    return data as T;
  } catch (error) {
    console.error('API fetch error:', error);
    
    // If offline, try to return cached data even if expired
    if (cacheConfig) {
      const itemStr = localStorage.getItem(`api_cache_${cacheConfig.key}`);
      if (itemStr) {
        const item = JSON.parse(itemStr);
        console.log('Using stale cache due to network error');
        return item.data as T;
      }
    }
    
    throw error;
  }
}

// Debounce utility for search/input
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Batch API requests
export async function batchRequests<T>(
  requests: (() => Promise<T>)[],
  batchSize: number = 3
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(req => req()));
    results.push(...batchResults);
  }
  
  return results;
}

// Weather API with caching (30 minutes)
export async function getWeatherData(location: string) {
  return fetchWithCache(
    `https://api.weatherapi.com/v1/forecast.json?key=YOUR_API_KEY&q=${location}&days=7`,
    {},
    {
      key: `weather_${location}`,
      ttl: 30 * 60 * 1000 // 30 minutes
    }
  );
}

// Market prices API with caching (1 hour)
export async function getMarketPrices(market: string, crop?: string) {
  const url = crop 
    ? `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=YOUR_API_KEY&market=${market}&commodity=${crop}`
    : `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=YOUR_API_KEY&market=${market}`;
  
  return fetchWithCache(
    url,
    {},
    {
      key: `market_${market}_${crop || 'all'}`,
      ttl: 60 * 60 * 1000 // 1 hour
    }
  );
}

// Disease detection API (no caching for real-time detection)
export async function detectDisease(imageData: string) {
  // This would call your ML backend
  const response = await fetch('/api/disease-detection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image: imageData })
  });

  if (!response.ok) {
    throw new Error('Disease detection failed');
  }

  return response.json();
}

// Check if online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Listen for online/offline events
export function setupOfflineListener(
  onOnline: () => void,
  onOffline: () => void
) {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

// Register service worker
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    });
  }
}

export { APICache };
