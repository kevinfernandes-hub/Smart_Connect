import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Loader2, RefreshCw, Cloud } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { marketService } from "../services/api";
import { WeatherWidget } from "./WeatherWidget";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";

export function MarketAnalysis() {
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState("wheat");
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [currentPrices, setCurrentPrices] = useState<any[]>([]);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load market data on component mount and when crop/period changes
  useEffect(() => {
    loadMarketData();
  }, []);

  useEffect(() => {
    loadPriceHistory();
  }, [selectedCrop, selectedPeriod]);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      const prices = await marketService.getCurrentPrices();
      setCurrentPrices(prices);
    } catch (error) {
      toast.error("Failed to load market data");
    } finally {
      setLoading(false);
    }
  };

  const loadPriceHistory = async () => {
    try {
      const history = await marketService.getPriceHistory(selectedCrop, selectedPeriod);
      setPriceHistory(history);
    } catch (error) {
      console.error("Failed to load price history", error);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([loadMarketData(), loadPriceHistory()]);
    setRefreshing(false);
    toast.success("Market data refreshed");
  };

  // Static mock data for charts (keeping original structure)
  const staticPriceData: { [key: string]: Array<{ month: string; price: number; volume: number }> } = {
    wheat: [
      { month: "Jan", price: 2150, volume: 1200 },
      { month: "Feb", price: 2180, volume: 1350 },
      { month: "Mar", price: 2250, volume: 1400 },
      { month: "Apr", price: 2300, volume: 1250 },
      { month: "May", price: 2280, volume: 1100 },
      { month: "Jun", price: 2320, volume: 1300 },
    ],
    rice: [
      { month: "Jan", price: 1850, volume: 2200 },
      { month: "Feb", price: 1900, volume: 2150 },
      { month: "Mar", price: 1950, volume: 2300 },
      { month: "Apr", price: 2000, volume: 2400 },
      { month: "May", price: 1980, volume: 2100 },
      { month: "Jun", price: 2050, volume: 2350 },
    ],
    sugarcane: [
      { month: "Jan", price: 350, volume: 5200 },
      { month: "Feb", price: 360, volume: 5100 },
      { month: "Mar", price: 365, volume: 5400 },
      { month: "Apr", price: 370, volume: 5300 },
      { month: "May", price: 375, volume: 5000 },
      { month: "Jun", price: 380, volume: 5250 },
    ],
    cotton: [
      { month: "Jan", price: 7500, volume: 800 },
      { month: "Feb", price: 7650, volume: 850 },
      { month: "Mar", price: 7800, volume: 900 },
      { month: "Apr", price: 7950, volume: 820 },
      { month: "May", price: 7850, volume: 750 },
      { month: "Jun", price: 7900, volume: 880 },
    ],
    maize: [
      { month: "Jan", price: 1650, volume: 1800 },
      { month: "Feb", price: 1680, volume: 1750 },
      { month: "Mar", price: 1720, volume: 1900 },
      { month: "Apr", price: 1750, volume: 1850 },
      { month: "May", price: 1730, volume: 1700 },
      { month: "Jun", price: 1760, volume: 1820 },
    ],
    barley: [
      { month: "Jan", price: 1450, volume: 900 },
      { month: "Feb", price: 1480, volume: 950 },
      { month: "Mar", price: 1520, volume: 1000 },
      { month: "Apr", price: 1550, volume: 920 },
      { month: "May", price: 1530, volume: 880 },
      { month: "Jun", price: 1560, volume: 960 },
    ],
    jowar: [
      { month: "Jan", price: 2850, volume: 600 },
      { month: "Feb", price: 2900, volume: 620 },
      { month: "Mar", price: 2950, volume: 650 },
      { month: "Apr", price: 3000, volume: 630 },
      { month: "May", price: 2980, volume: 580 },
      { month: "Jun", price: 3020, volume: 640 },
    ],
    bajra: [
      { month: "Jan", price: 2200, volume: 700 },
      { month: "Feb", price: 2250, volume: 720 },
      { month: "Mar", price: 2300, volume: 750 },
      { month: "Apr", price: 2350, volume: 730 },
      { month: "May", price: 2320, volume: 680 },
      { month: "Jun", price: 2380, volume: 740 },
    ],
    ragi: [
      { month: "Jan", price: 3200, volume: 400 },
      { month: "Feb", price: 3250, volume: 420 },
      { month: "Mar", price: 3300, volume: 450 },
      { month: "Apr", price: 3350, volume: 430 },
      { month: "May", price: 3320, volume: 390 },
      { month: "Jun", price: 3380, volume: 440 },
    ],
    mustard: [
      { month: "Jan", price: 5200, volume: 800 },
      { month: "Feb", price: 5350, volume: 820 },
      { month: "Mar", price: 5500, volume: 850 },
      { month: "Apr", price: 5650, volume: 830 },
      { month: "May", price: 5580, volume: 780 },
      { month: "Jun", price: 5720, volume: 860 },
    ],
    sunflower: [
      { month: "Jan", price: 6200, volume: 600 },
      { month: "Feb", price: 6350, volume: 620 },
      { month: "Mar", price: 6500, volume: 650 },
      { month: "Apr", price: 6650, volume: 630 },
      { month: "May", price: 6580, volume: 580 },
      { month: "Jun", price: 6720, volume: 660 },
    ],
    groundnut: [
      { month: "Jan", price: 4800, volume: 1200 },
      { month: "Feb", price: 4950, volume: 1250 },
      { month: "Mar", price: 5100, volume: 1300 },
      { month: "Apr", price: 5250, volume: 1220 },
      { month: "May", price: 5180, volume: 1150 },
      { month: "Jun", price: 5320, volume: 1280 },
    ],
    soybean: [
      { month: "Jan", price: 3800, volume: 1500 },
      { month: "Feb", price: 3950, volume: 1550 },
      { month: "Mar", price: 4100, volume: 1600 },
      { month: "Apr", price: 4250, volume: 1520 },
      { month: "May", price: 4180, volume: 1450 },
      { month: "Jun", price: 4320, volume: 1580 },
    ],
    chickpea: [
      { month: "Jan", price: 4200, volume: 1000 },
      { month: "Feb", price: 4350, volume: 1050 },
      { month: "Mar", price: 4500, volume: 1100 },
      { month: "Apr", price: 4650, volume: 1020 },
      { month: "May", price: 4580, volume: 950 },
      { month: "Jun", price: 4720, volume: 1080 },
    ],
    lentil: [
      { month: "Jan", price: 5500, volume: 800 },
      { month: "Feb", price: 5650, volume: 820 },
      { month: "Mar", price: 5800, volume: 850 },
      { month: "Apr", price: 5950, volume: 830 },
      { month: "May", price: 5880, volume: 780 },
      { month: "Jun", price: 6020, volume: 860 },
    ],
    blackgram: [
      { month: "Jan", price: 6800, volume: 500 },
      { month: "Feb", price: 6950, volume: 520 },
      { month: "Mar", price: 7100, volume: 550 },
      { month: "Apr", price: 7250, volume: 530 },
      { month: "May", price: 7180, volume: 480 },
      { month: "Jun", price: 7320, volume: 560 },
    ],
    greengram: [
      { month: "Jan", price: 6200, volume: 600 },
      { month: "Feb", price: 6350, volume: 620 },
      { month: "Mar", price: 6500, volume: 650 },
      { month: "Apr", price: 6650, volume: 630 },
      { month: "May", price: 6580, volume: 580 },
      { month: "Jun", price: 6720, volume: 660 },
    ],
    pigeonpea: [
      { month: "Jan", price: 5800, volume: 700 },
      { month: "Feb", price: 5950, volume: 720 },
      { month: "Mar", price: 6100, volume: 750 },
      { month: "Apr", price: 6250, volume: 730 },
      { month: "May", price: 6180, volume: 680 },
      { month: "Jun", price: 6320, volume: 760 },
    ],
    sesame: [
      { month: "Jan", price: 8200, volume: 300 },
      { month: "Feb", price: 8350, volume: 320 },
      { month: "Mar", price: 8500, volume: 350 },
      { month: "Apr", price: 8650, volume: 330 },
      { month: "May", price: 8580, volume: 280 },
      { month: "Jun", price: 8720, volume: 360 },
    ],
    safflower: [
      { month: "Jan", price: 4500, volume: 400 },
      { month: "Feb", price: 4650, volume: 420 },
      { month: "Mar", price: 4800, volume: 450 },
      { month: "Apr", price: 4950, volume: 430 },
      { month: "May", price: 4880, volume: 380 },
      { month: "Jun", price: 5020, volume: 460 },
    ],
    castor: [
      { month: "Jan", price: 5600, volume: 600 },
      { month: "Feb", price: 5750, volume: 620 },
      { month: "Mar", price: 5900, volume: 650 },
      { month: "Apr", price: 6050, volume: 630 },
      { month: "May", price: 5980, volume: 580 },
      { month: "Jun", price: 6120, volume: 660 },
    ],
    turmeric: [
      { month: "Jan", price: 9200, volume: 500 },
      { month: "Feb", price: 9350, volume: 520 },
      { month: "Mar", price: 9500, volume: 550 },
      { month: "Apr", price: 9650, volume: 530 },
      { month: "May", price: 9580, volume: 480 },
      { month: "Jun", price: 9720, volume: 560 },
    ],
    cumin: [
      { month: "Jan", price: 25000, volume: 200 },
      { month: "Feb", price: 25500, volume: 220 },
      { month: "Mar", price: 26000, volume: 250 },
      { month: "Apr", price: 26500, volume: 230 },
      { month: "May", price: 26200, volume: 180 },
      { month: "Jun", price: 26800, volume: 260 },
    ],
    coriander: [
      { month: "Jan", price: 8500, volume: 400 },
      { month: "Feb", price: 8650, volume: 420 },
      { month: "Mar", price: 8800, volume: 450 },
      { month: "Apr", price: 8950, volume: 430 },
      { month: "May", price: 8880, volume: 380 },
      { month: "Jun", price: 9020, volume: 460 },
    ],
    fenugreek: [
      { month: "Jan", price: 3200, volume: 300 },
      { month: "Feb", price: 3350, volume: 320 },
      { month: "Mar", price: 3500, volume: 350 },
      { month: "Apr", price: 3650, volume: 330 },
      { month: "May", price: 3580, volume: 280 },
      { month: "Jun", price: 3720, volume: 360 },
    ],
    onion: [
      { month: "Jan", price: 2200, volume: 3000 },
      { month: "Feb", price: 2350, volume: 3200 },
      { month: "Mar", price: 2500, volume: 3500 },
      { month: "Apr", price: 2650, volume: 3300 },
      { month: "May", price: 2580, volume: 2800 },
      { month: "Jun", price: 2720, volume: 3600 },
    ],
    potato: [
      { month: "Jan", price: 1200, volume: 4000 },
      { month: "Feb", price: 1250, volume: 4200 },
      { month: "Mar", price: 1300, volume: 4500 },
      { month: "Apr", price: 1350, volume: 4300 },
      { month: "May", price: 1320, volume: 3800 },
      { month: "Jun", price: 1380, volume: 4600 },
    ],
    tomato: [
      { month: "Jan", price: 2800, volume: 2500 },
      { month: "Feb", price: 2950, volume: 2700 },
      { month: "Mar", price: 3100, volume: 3000 },
      { month: "Apr", price: 3250, volume: 2800 },
      { month: "May", price: 3180, volume: 2300 },
      { month: "Jun", price: 3320, volume: 3100 },
    ],
    chili: [
      { month: "Jan", price: 8200, volume: 800 },
      { month: "Feb", price: 8350, volume: 820 },
      { month: "Mar", price: 8500, volume: 850 },
      { month: "Apr", price: 8650, volume: 830 },
      { month: "May", price: 8580, volume: 780 },
      { month: "Jun", price: 8720, volume: 860 },
    ],
  };

  const marketShare = [
    { name: t('wheat'), value: 22, color: "#8884d8" },
    { name: t('rice'), value: 20, color: "#82ca9d" },
    { name: t('sugarcane'), value: 15, color: "#ffc658" },
    { name: t('cotton'), value: 12, color: "#ff7300" },
    { name: t('maize'), value: 8, color: "#8dd1e1" },
    { name: t('soybean'), value: 6, color: "#d084d0" },
    { name: t('groundnut'), value: 5, color: "#ffb347" },
    { name: t('mustard'), value: 4, color: "#87ceeb" },
    { name: t('chickpea'), value: 3, color: "#dda0dd" },
    { name: "Others", value: 5, color: "#f0e68c" },
  ];

  const getTranslatedCrops = () => {
    return currentPrices.map(item => ({
      ...item,
      crop: t(item.crop.toLowerCase()),
      demandLevel: t(item.change > 0 ? 'high' : item.change < -5 ? 'low' : 'moderate'),
      nextAction: item.change > 5 ? t('goodTimeToSell') : 
                 item.change > 0 ? t('holdForBetterPrices') : 
                 item.change > -5 ? t('steadyMarket') : t('waitForRecovery'),
      currentPrice: `₹${item.price}`,
      change: `${item.change > 0 ? '+' : ''}${item.change}%`,
      trend: item.trend
    }));
  };

  const currentData = priceHistory.length > 0 ? priceHistory : staticPriceData[selectedCrop] || staticPriceData.wheat;

  const getCropName = (cropKey: string) => {
    switch(cropKey) {
      case 'wheat': return t('wheat');
      case 'rice': return t('rice');
      case 'sugarcane': return t('sugarcane');
      case 'cotton': return t('cotton');
      case 'maize': return t('maize');
      case 'barley': return t('barley');
      case 'jowar': return t('jowar');
      case 'bajra': return t('bajra');
      case 'ragi': return t('ragi');
      case 'mustard': return t('mustard');
      case 'sunflower': return t('sunflower');
      case 'groundnut': return t('groundnut');
      case 'soybean': return t('soybean');
      case 'chickpea': return t('chickpea');
      case 'lentil': return t('lentil');
      case 'blackgram': return t('blackgram');
      case 'greengram': return t('greengram');
      case 'pigeonpea': return t('pigeonpea');
      case 'sesame': return t('sesame');
      case 'safflower': return t('safflower');
      case 'castor': return t('castor');
      case 'turmeric': return t('turmeric');
      case 'cumin': return t('cumin');
      case 'coriander': return t('coriander');
      case 'fenugreek': return t('fenugreek');
      case 'onion': return t('onion');
      case 'potato': return t('potato');
      case 'tomato': return t('tomato');
      case 'chili': return t('chili');
      default: return cropKey;
    }
  };

  const getPeriodName = (periodKey: string) => {
    switch(periodKey) {
      case '1month': return t('month1');
      case '3months': return t('month3');
      case '6months': return t('month6');
      case '1year': return t('year1');
      default: return periodKey;
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h2>{t('marketAnalysisTitle')}</h2>
          <p className="text-muted-foreground">{t('cropPricesAndTrends')}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshData}
          disabled={refreshing}
          className="ml-4"
        >
          {refreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedCrop} onValueChange={setSelectedCrop}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wheat">{t('wheat')}</SelectItem>
            <SelectItem value="rice">{t('rice')}</SelectItem>
            <SelectItem value="sugarcane">{t('sugarcane')}</SelectItem>
            <SelectItem value="cotton">{t('cotton')}</SelectItem>
            <SelectItem value="maize">{t('maize')}</SelectItem>
            <SelectItem value="barley">{t('barley')}</SelectItem>
            <SelectItem value="jowar">{t('jowar')}</SelectItem>
            <SelectItem value="bajra">{t('bajra')}</SelectItem>
            <SelectItem value="ragi">{t('ragi')}</SelectItem>
            <SelectItem value="mustard">{t('mustard')}</SelectItem>
            <SelectItem value="sunflower">{t('sunflower')}</SelectItem>
            <SelectItem value="groundnut">{t('groundnut')}</SelectItem>
            <SelectItem value="soybean">{t('soybean')}</SelectItem>
            <SelectItem value="chickpea">{t('chickpea')}</SelectItem>
            <SelectItem value="lentil">{t('lentil')}</SelectItem>
            <SelectItem value="blackgram">{t('blackgram')}</SelectItem>
            <SelectItem value="greengram">{t('greengram')}</SelectItem>
            <SelectItem value="pigeonpea">{t('pigeonpea')}</SelectItem>
            <SelectItem value="sesame">{t('sesame')}</SelectItem>
            <SelectItem value="safflower">{t('safflower')}</SelectItem>
            <SelectItem value="castor">{t('castor')}</SelectItem>
            <SelectItem value="turmeric">{t('turmeric')}</SelectItem>
            <SelectItem value="cumin">{t('cumin')}</SelectItem>
            <SelectItem value="coriander">{t('coriander')}</SelectItem>
            <SelectItem value="fenugreek">{t('fenugreek')}</SelectItem>
            <SelectItem value="onion">{t('onion')}</SelectItem>
            <SelectItem value="potato">{t('potato')}</SelectItem>
            <SelectItem value="tomato">{t('tomato')}</SelectItem>
            <SelectItem value="chili">{t('chili')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">{t('month1')}</SelectItem>
            <SelectItem value="3months">{t('month3')}</SelectItem>
            <SelectItem value="6months">{t('month6')}</SelectItem>
            <SelectItem value="1year">{t('year1')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Current Prices Overview */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {getTranslatedCrops().map((item, index) => (
            <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{item.crop}</CardTitle>
              <div className={`rounded-full p-1 ${item.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                {item.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-1">{item.currentPrice}</div>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {item.demandLevel}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{item.nextAction}</p>
            </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Price Trend Chart */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t('priceTrends')}
            </CardTitle>
            <CardDescription>
              {getCropName(selectedCrop)} {t('pricesOver')} {getPeriodName(selectedPeriod)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Price per quintal']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('tradingVolume')}</CardTitle>
            <CardDescription>{t('monthlyTradingVolumes')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} MT`, 'Volume']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="volume" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weather Impact on Markets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Weather Impact on Markets
          </CardTitle>
          <CardDescription>How current weather conditions affect crop prices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeatherWidget compact={true} />
            <div className="space-y-3">
              <h4 className="font-medium">Weather-Price Correlations</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span>Good monsoon forecast</span>
                  <Badge className="bg-green-100 text-green-700">Rice ↑</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <span>High temperature alert</span>
                  <Badge className="bg-orange-100 text-orange-700">Wheat ↑</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span>Extended dry spell</span>
                  <Badge className="bg-red-100 text-red-700">All crops ↑</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('marketShare')}</CardTitle>
            <CardDescription>{t('regionalCropDistribution')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={marketShare}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {marketShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {t('priceAlerts')}
            </CardTitle>
            <CardDescription>{t('recentPriceMovements')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <div>
                <p className="text-sm">{t('wheat')}</p>
                <p className="text-xs text-muted-foreground">{t('reachedTargetPrice')}</p>
              </div>
              <Badge className="bg-green-100 text-green-700">+8.2%</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <div>
                <p className="text-sm">{t('rice')}</p>
                <p className="text-xs text-muted-foreground">{t('strongUpwardTrend')}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-700">+11.1%</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
              <div>
                <p className="text-sm">{t('cotton')}</p>
                <p className="text-xs text-muted-foreground">{t('priceCorrection')}</p>
              </div>
              <Badge className="bg-orange-100 text-orange-700">-2.3%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('marketNews')}</CardTitle>
            <CardDescription>{t('latestUpdates')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-2 border-green-500 pl-3">
              <p className="text-sm">{t('govAnnounceMSP')}</p>
              <p className="text-xs text-muted-foreground">2 {t('hoursAgo')}</p>
            </div>
            <div className="border-l-2 border-blue-500 pl-3">
              <p className="text-sm">{t('exportDemandRice')}</p>
              <p className="text-xs text-muted-foreground">5 {t('hoursAgo')}</p>
            </div>
            <div className="border-l-2 border-orange-500 pl-3">
              <p className="text-sm">{t('weatherForecast')}</p>
              <p className="text-xs text-muted-foreground">1 {t('dayAgo')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}