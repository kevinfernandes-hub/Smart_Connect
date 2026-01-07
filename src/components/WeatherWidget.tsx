import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { useLanguage } from "../contexts/LanguageContext";
import { weatherService, WeatherData, getWindDirection, getUVIndexDescription } from "../services/weatherApi";
import {
  Cloud,
  Sun,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Navigation,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  MapPin
} from "lucide-react";

interface WeatherWidgetProps {
  city?: string;
  lat?: number;
  lon?: number;
  showForecast?: boolean;
  compact?: boolean;
}

export function WeatherWidget({ 
  city, 
  lat = 19.0760, 
  lon = 72.8777, 
  showForecast = false,
  compact = false 
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { t } = useLanguage();

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let weatherData: WeatherData;
      if (city) {
        weatherData = await weatherService.getWeatherByCity(city);
      } else {
        weatherData = await weatherService.getCurrentWeather(lat, lon);
      }
      
      if (showForecast) {
        const forecast = await weatherService.getForecast(lat, lon);
        weatherData.forecast = forecast;
      }
      
      setWeather(weatherData);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    
    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city, lat, lon]);

  const getWeatherIcon = (description: string, large = false) => {
    const iconSize = large ? "h-12 w-12" : "h-6 w-6";
    const desc = description.toLowerCase();
    
    if (desc.includes('clear') || desc.includes('sunny')) {
      return <Sun className={`${iconSize} text-yellow-500`} />;
    } else if (desc.includes('cloud')) {
      return <Cloud className={`${iconSize} text-gray-500`} />;
    } else if (desc.includes('rain')) {
      return <CloudRain className={`${iconSize} text-blue-500`} />;
    } else {
      return <Sun className={`${iconSize} text-yellow-500`} />;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fair': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className={compact ? "p-4" : ""}>
        <CardHeader className={compact ? "p-0 pb-3" : ""}>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            {t('weather')}
          </CardTitle>
        </CardHeader>
        <CardContent className={compact ? "p-0" : ""}>
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className={compact ? "p-4" : ""}>
        <CardHeader className={compact ? "p-0 pb-3" : ""}>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            {t('weather')}
          </CardTitle>
        </CardHeader>
        <CardContent className={compact ? "p-0" : ""}>
          <div className="text-center py-4">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{error || 'Unable to load weather data'}</p>
            <Button variant="outline" size="sm" onClick={fetchWeather} className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { current, location, agricultural } = weather;
  const insights = weatherService.getAgriculturalInsights(weather);
  const uvInfo = getUVIndexDescription(current.uvIndex);

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{location.city}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchWeather}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon(current.description, true)}
            <div>
              <div className="text-2xl font-bold">{current.temperature}°C</div>
              <div className="text-sm text-muted-foreground">{current.description}</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Feels like</div>
            <div className="text-lg font-semibold">{current.feelsLike}°C</div>
            <Badge className={getConditionColor(agricultural.growingConditions)}>
              {agricultural.growingConditions}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t">
          <div className="text-center">
            <Droplets className="h-4 w-4 mx-auto text-blue-500" />
            <div className="text-xs text-muted-foreground">Humidity</div>
            <div className="text-sm font-medium">{current.humidity}%</div>
          </div>
          <div className="text-center">
            <Wind className="h-4 w-4 mx-auto text-gray-500" />
            <div className="text-xs text-muted-foreground">Wind</div>
            <div className="text-sm font-medium">{current.windSpeed} km/h</div>
          </div>
          <div className="text-center">
            <Gauge className="h-4 w-4 mx-auto text-green-500" />
            <div className="text-xs text-muted-foreground">UV Index</div>
            <div className="text-sm font-medium">{current.uvIndex}</div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Weather Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Current Weather
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <MapPin className="h-3 w-3 mr-1" />
                {location.city}
              </Badge>
              <Button variant="ghost" size="sm" onClick={fetchWeather}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Conditions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {getWeatherIcon(current.description, true)}
                <div>
                  <div className="text-3xl font-bold">{current.temperature}°C</div>
                  <div className="text-muted-foreground">{current.description}</div>
                  <div className="text-sm text-muted-foreground">
                    Feels like {current.feelsLike}°C
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Badge className={getConditionColor(agricultural.growingConditions)}>
                  Growing Conditions: {agricultural.growingConditions}
                </Badge>
                <Badge variant="outline">
                  Soil Moisture: {agricultural.soilMoisture}
                </Badge>
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Humidity</span>
                </div>
                <div className="text-lg font-semibold">{current.humidity}%</div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Wind className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Wind</span>
                </div>
                <div className="text-lg font-semibold">{current.windSpeed} km/h</div>
                <div className="text-xs text-muted-foreground">
                  {getWindDirection(current.windDirection)}
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Gauge className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Pressure</span>
                </div>
                <div className="text-lg font-semibold">{current.pressure} hPa</div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Sun className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">UV Index</span>
                </div>
                <div className="text-lg font-semibold">{current.uvIndex}</div>
                <div className="text-xs text-muted-foreground">{uvInfo.level}</div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Visibility</span>
                </div>
                <div className="text-lg font-semibold">{current.visibility} km</div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Thermometer className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium">Dew Point</span>
                </div>
                <div className="text-lg font-semibold">{current.dewPoint}°C</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agricultural Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Agricultural Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <div className="font-medium text-blue-600 mb-1">💧 Irrigation</div>
                <p className="text-sm">{insights.irrigation}</p>
              </div>
              <div>
                <div className="font-medium text-green-600 mb-1">🌱 Planting</div>
                <p className="text-sm">{insights.planting}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="font-medium text-orange-600 mb-1">🌾 Harvesting</div>
                <p className="text-sm">{insights.harvesting}</p>
              </div>
              <div>
                <div className="font-medium text-red-600 mb-1">🦠 Disease Risk</div>
                <p className="text-sm">{insights.disease}</p>
              </div>
            </div>
          </div>
          
          {agricultural.recommendations.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="font-medium mb-2">📋 Recommendations</div>
              <ul className="space-y-1">
                {agricultural.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {agricultural.alerts.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="font-medium mb-2 text-orange-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Alerts
              </div>
              <ul className="space-y-1">
                {agricultural.alerts.map((alert, index) => (
                  <li key={index} className="text-sm flex items-start gap-2 text-orange-700">
                    <span className="text-orange-600 mt-0.5">⚠</span>
                    {alert}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5-Day Forecast */}
      {showForecast && weather.forecast.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              5-Day Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {weather.forecast.map((day, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-3 text-center">
                  <div className="text-sm font-medium mb-2">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(day.description)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-semibold">{day.tempMax}°</span>
                      <span className="text-xs text-muted-foreground">{day.tempMin}°</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{day.description}</div>
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <Droplets className="h-3 w-3 text-blue-500" />
                      {day.humidity}%
                    </div>
                    {day.precipitation > 0 && (
                      <div className="text-xs text-blue-600">
                        {day.precipitation}mm rain
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Last Updated */}
      <div className="text-xs text-muted-foreground text-center">
        Last updated: {lastUpdated.toLocaleString()}
      </div>
    </div>
  );
}