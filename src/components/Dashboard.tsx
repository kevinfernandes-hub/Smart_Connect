import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Leaf, TrendingUp, AlertTriangle, MessageCircle, Shield, CloudSun, Mic } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { WeatherWidget } from "./WeatherWidget";
import { PriceTicker } from "./PriceTicker";
import { PWAInstallBanner } from "./PWAInstallBanner";

export function Dashboard() {
  const { t } = useLanguage();
  
  const stats = [
    {
      title: "Active Crops",
      value: "3",
      description: "Currently growing",
      icon: Leaf,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Market Trends",
      value: "+12%",
      description: "Wheat prices up",
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Disease Alerts",
      value: "2",
      description: "Require attention",
      icon: AlertTriangle,
      color: "bg-orange-100 text-orange-700",
    },
    {
      title: "Chat Sessions",
      value: "15",
      description: "This month",
      icon: MessageCircle,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  const recentRecommendations = [
    { crop: "Wheat", season: "Rabi", confidence: "98%" },
    { crop: "Rice", season: "Kharif", confidence: "92%" },
    { crop: "Sugarcane", season: "Annual", confidence: "85%" },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
        <div className="relative z-10">
          <h1 className="mb-1 text-white">{t('welcomeBack')}!</h1>
          <p className="text-green-100">Smart farming for Vidarbha — weather‑safe sprays, better ROI, local advice</p>
          <p className="text-green-100/90 text-xs mt-1">विदर्भासाठी स्मार्ट शेती — हवामान सुरक्षित फवारणी, अधिक नफा, स्थानिक मार्गदर्शन</p>
          <div className="mt-4 flex gap-2 flex-wrap">
            <Badge className="bg-white/20 text-white border-white/30"><CloudSun className="h-3 w-3 mr-1" /> Offline Ready</Badge>
            <Badge className="bg-white/20 text-white border-white/30"><Shield className="h-3 w-3 mr-1" /> Govt Schemes</Badge>
            <Badge className="bg-white/20 text-white border-white/30"><Mic className="h-3 w-3 mr-1" /> Voice Support</Badge>
          </div>
        </div>
        <div className="absolute right-4 top-4 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1630600968159-93fd2d5beca4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBhZ3JpY3VsdHVyZSUyMGNyb3BzJTIwZmllbGR8ZW58MXx8fHwxNzU4OTk3Njk3fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Farming"
            className="h-24 w-24 rounded-xl object-cover"
          />
        </div>
      </div>

      {/* PWA Install & Ticker */}
      <PWAInstallBanner />
      <PriceTicker />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">{stat.title}</CardTitle>
                <div className={`rounded-full p-2 ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-1">{stat.value}</div>
                <p className="text-muted-foreground text-xs">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weather Section */}
      <WeatherWidget compact={true} />

      {/* Value Props */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Increase Income</CardTitle>
            <CardDescription>Compare top 3 crops ROI quickly</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Get personalized profitability based on your acreage and prices.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reduce Risk</CardTitle>
            <CardDescription>Check PMFBY eligibility</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Protect against weather losses with low‑premium crop insurance.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Save Inputs</CardTitle>
            <CardDescription>Track soil pH & Jeevamrut</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Optimize fertilizer with soil health insights and organic practices.
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('recommendedCrops')}</CardTitle>
            <CardDescription>Your latest crop suggestions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentRecommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm">{rec.crop}</p>
                  <p className="text-muted-foreground text-xs">{rec.season} season</p>
                </div>
                <Badge variant="secondary">{rec.confidence}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
            <CardDescription>Today's farming insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm">Monitor soil moisture levels for optimal irrigation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-sm">Weather forecast shows rain next week - adjust pesticide schedule</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-orange-500"></div>
              <div>
                <p className="text-sm">Market prices for tomatoes are trending upward</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}