// Weather API service for KisanMitra
// This service provides comprehensive weather data for agricultural decisions

export interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    description: string;
    icon: string;
    feelsLike: number;
    uvIndex: number;
    visibility: number;
    dewPoint: number;
  };
  location: {
    city: string;
    country: string;
    lat: number;
    lon: number;
  };
  forecast: {
    date: string;
    tempMax: number;
    tempMin: number;
    humidity: number;
    description: string;
    icon: string;
    precipitation: number;
    windSpeed: number;
  }[];
  agricultural: {
    soilMoisture: 'low' | 'medium' | 'high';
    growingConditions: 'poor' | 'fair' | 'good' | 'excellent';
    recommendations: string[];
    alerts: string[];
  };
}

export interface WeatherAlert {
  id: string;
  type: 'warning' | 'watch' | 'advisory';
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  startTime: string;
  endTime: string;
}

class WeatherService {
  private apiKey = 'YOUR_OPENWEATHER_API_KEY'; // Replace with actual API key
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  // Get current weather by coordinates
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
      // In a real implementation, this would make an actual API call
      // For now, returning mock data that represents realistic weather patterns for Indian agriculture
      return this.getMockWeatherData(lat, lon);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return this.getMockWeatherData(lat, lon);
    }
  }

  // Get weather by city name
  async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      // In a real implementation: 
      // const response = await fetch(`${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`);
      return this.getMockWeatherData(0, 0, city);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return this.getMockWeatherData(0, 0, city);
    }
  }

  // Get 5-day weather forecast
  async getForecast(lat: number, lon: number): Promise<WeatherData['forecast']> {
    try {
      // Mock forecast data
      const today = new Date();
      const forecast = [];
      
      for (let i = 1; i <= 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        forecast.push({
          date: date.toISOString().split('T')[0],
          tempMax: Math.round(28 + Math.random() * 10),
          tempMin: Math.round(18 + Math.random() * 8),
          humidity: Math.round(60 + Math.random() * 30),
          description: this.getRandomWeatherDescription(),
          icon: this.getRandomWeatherIcon(),
          precipitation: Math.round(Math.random() * 10),
          windSpeed: Math.round(5 + Math.random() * 10)
        });
      }
      
      return forecast;
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      return [];
    }
  }

  // Get weather alerts
  async getWeatherAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
    // Mock alerts based on common agricultural weather concerns in India
    const alerts: WeatherAlert[] = [];
    
    // Randomly generate relevant alerts
    const alertTypes = [
      {
        type: 'warning' as const,
        title: 'Heavy Rainfall Expected',
        description: 'Heavy rainfall expected in the next 24-48 hours. Consider protecting crops and ensuring proper drainage.',
        severity: 'moderate' as const
      },
      {
        type: 'advisory' as const,
        title: 'High Temperature Alert',
        description: 'Temperatures expected to exceed 35°C. Ensure adequate irrigation and consider heat stress protection for crops.',
        severity: 'minor' as const
      },
      {
        type: 'watch' as const,
        title: 'Dry Spell Continues',
        description: 'Extended dry period continuing. Monitor soil moisture levels and adjust irrigation schedules.',
        severity: 'moderate' as const
      }
    ];

    // Randomly include 0-2 alerts
    const numAlerts = Math.floor(Math.random() * 3);
    for (let i = 0; i < numAlerts; i++) {
      const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const startTime = new Date();
      const endTime = new Date();
      endTime.setHours(endTime.getHours() + 24 + Math.random() * 48);
      
      alerts.push({
        id: `alert-${i}`,
        ...alert,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      });
    }

    return alerts;
  }

  // Get agricultural insights based on weather
  getAgriculturalInsights(weather: WeatherData): {
    irrigation: string;
    planting: string;
    harvesting: string;
    disease: string;
  } {
    const { current } = weather;
    
    let irrigation = 'Normal irrigation schedule';
    let planting = 'Good conditions for planting';
    let harvesting = 'Suitable for harvesting activities';
    let disease = 'Low disease risk';

    // Adjust recommendations based on weather conditions
    if (current.humidity > 80) {
      irrigation = 'Reduce irrigation frequency due to high humidity';
      disease = 'High humidity increases fungal disease risk - monitor crops closely';
    }

    if (current.temperature > 35) {
      irrigation = 'Increase irrigation frequency due to high temperature';
      planting = 'Consider delaying planting until cooler conditions';
      harvesting = 'Schedule harvesting during cooler hours';
    }

    if (current.temperature < 15) {
      planting = 'Cold conditions - consider frost protection measures';
      harvesting = 'Monitor for frost damage before harvesting';
    }

    if (current.windSpeed > 15) {
      planting = 'High winds - postpone planting activities';
      harvesting = 'Strong winds may affect harvesting - exercise caution';
    }

    return { irrigation, planting, harvesting, disease };
  }

  // Private helper methods
  private getMockWeatherData(lat: number, lon: number, city?: string): WeatherData {
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad'];
    const selectedCity = city || cities[Math.floor(Math.random() * cities.length)];
    
    const temperature = Math.round(20 + Math.random() * 15); // 20-35°C range
    const humidity = Math.round(40 + Math.random() * 40); // 40-80% range
    
    const current = {
      temperature,
      humidity,
      pressure: Math.round(1010 + Math.random() * 20),
      windSpeed: Math.round(5 + Math.random() * 15),
      windDirection: Math.round(Math.random() * 360),
      description: this.getRandomWeatherDescription(),
      icon: this.getRandomWeatherIcon(),
      feelsLike: temperature + Math.round((Math.random() - 0.5) * 4),
      uvIndex: Math.round(3 + Math.random() * 8),
      visibility: Math.round(8 + Math.random() * 4),
      dewPoint: Math.round(temperature - 10 + Math.random() * 8)
    };

    // Generate agricultural recommendations
    const soilMoisture = humidity > 70 ? 'high' : humidity > 50 ? 'medium' : 'low';
    const growingConditions = this.getGrowingConditions(current);
    const recommendations = this.getWeatherRecommendations(current);
    const alerts = this.getWeatherAlerts(current);

    return {
      current,
      location: {
        city: selectedCity,
        country: 'India',
        lat: lat || 19.0760,
        lon: lon || 72.8777
      },
      forecast: [], // Will be populated by getForecast method
      agricultural: {
        soilMoisture,
        growingConditions,
        recommendations,
        alerts
      }
    };
  }

  private getRandomWeatherDescription(): string {
    const descriptions = [
      'Clear sky', 'Few clouds', 'Scattered clouds', 'Partly cloudy',
      'Overcast', 'Light rain', 'Moderate rain', 'Sunny', 'Partly sunny'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private getRandomWeatherIcon(): string {
    const icons = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'];
    return icons[Math.floor(Math.random() * icons.length)];
  }

  private getGrowingConditions(weather: any): 'poor' | 'fair' | 'good' | 'excellent' {
    const temp = weather.temperature;
    const humidity = weather.humidity;
    
    if (temp >= 20 && temp <= 30 && humidity >= 50 && humidity <= 70) {
      return 'excellent';
    } else if (temp >= 15 && temp <= 35 && humidity >= 40 && humidity <= 80) {
      return 'good';
    } else if (temp >= 10 && temp <= 40) {
      return 'fair';
    } else {
      return 'poor';
    }
  }

  private getWeatherRecommendations(weather: any): string[] {
    const recommendations = [];
    
    if (weather.temperature > 30) {
      recommendations.push('Apply mulching to retain soil moisture');
      recommendations.push('Schedule watering during early morning or evening');
    }
    
    if (weather.humidity > 75) {
      recommendations.push('Ensure good air circulation around plants');
      recommendations.push('Monitor for fungal diseases');
    }
    
    if (weather.windSpeed > 20) {
      recommendations.push('Provide windbreaks for sensitive crops');
      recommendations.push('Secure loose agricultural materials');
    }
    
    if (weather.uvIndex > 7) {
      recommendations.push('Consider shade nets for sensitive crops');
    }
    
    return recommendations.length > 0 ? recommendations : ['Continue normal farming activities'];
  }

  private getWeatherAlerts(weather: any): string[] {
    const alerts = [];
    
    if (weather.temperature > 35) {
      alerts.push('High temperature alert - protect crops from heat stress');
    }
    
    if (weather.humidity > 85) {
      alerts.push('High humidity - increased disease risk');
    }
    
    if (weather.windSpeed > 25) {
      alerts.push('Strong wind warning - secure farm equipment');
    }
    
    return alerts;
  }
}

export const weatherService = new WeatherService();

// Utility functions
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(degrees / 22.5) % 16];
};

export const getUVIndexDescription = (uvIndex: number): { level: string; description: string } => {
  if (uvIndex <= 2) return { level: 'Low', description: 'Safe for outdoor activities' };
  if (uvIndex <= 5) return { level: 'Moderate', description: 'Take precautions during midday' };
  if (uvIndex <= 7) return { level: 'High', description: 'Protection required' };
  if (uvIndex <= 10) return { level: 'Very High', description: 'Extra protection needed' };
  return { level: 'Extreme', description: 'Avoid sun exposure' };
};