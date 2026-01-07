import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import WeatherAgentCard from "./WeatherAgentCard";
import ROICalculatorCard from "./ROICalculatorCard";
import CitrusAdvisorCard from "./CitrusAdvisorCard";
import TurIntercroppingCard from "./TurIntercroppingCard";
import SoilHealthTrackerCard from "./SoilHealthTrackerCard";
import GovernmentSchemeCard from "./GovernmentSchemeCard";
import VoiceInputCard from "./VoiceInputCard";
import MLChatbotCard from "./MLChatbotCard";
import CropDiaryCard from "./CropDiaryCard";
import FPODashboardCard from "./FPODashboardCard";
import { isOnline, registerServiceWorker, setupOfflineListener } from "../services/apiUtils";

export default function EnhancedDashboard() {
  const [online, setOnline] = useState(isOnline());
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Register service worker for offline support
    registerServiceWorker();

    // Setup online/offline listeners
    const cleanup = setupOfflineListener(
      () => setOnline(true),
      () => setOnline(false)
    );

    return cleanup;
  }, []);

  return (
    <div className="enhanced-dashboard p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-green-700">KisanConnect Smart Farming</h1>
            <p className="text-gray-600 mt-1">किसान कनेक्ट - एकात्मिक कृषि मंच / Integrated Farming Platform</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${online ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              <span className={`w-2 h-2 rounded-full ${online ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
              <span className="text-sm font-medium">{online ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Offline Alert */}
      {!online && (
        <Alert className="mb-4 border-yellow-500 bg-yellow-50">
          <AlertDescription>
            📶 You're currently offline. Some features may have limited functionality. Data will sync when you're back online.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-11 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="roi">ROI Calc</TabsTrigger>
          <TabsTrigger value="citrus">Citrus</TabsTrigger>
          <TabsTrigger value="intercrop">Intercrop</TabsTrigger>
          <TabsTrigger value="soil">Soil</TabsTrigger>
          <TabsTrigger value="schemes">Schemes</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
          <TabsTrigger value="diary">Diary</TabsTrigger>
          <TabsTrigger value="fpo">FPO</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle>Welcome to KisanConnect Enhanced Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                आपका स्वागत है! यह मंच विदर्भ क्षेत्र के किसानों के लिए विशेष रूप से डिज़ाइन किया गया है।
                / Welcome! This platform is specially designed for farmers in the Vidarbha region.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("weather")}>
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-2">🌤️</div>
                    <h3 className="font-semibold mb-1">Weather Forecast</h3>
                    <p className="text-sm text-gray-600">7-day weather & spray windows</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("roi")}>
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-2">💰</div>
                    <h3 className="font-semibold mb-1">ROI Calculator</h3>
                    <p className="text-sm text-gray-600">Compare crop profitability</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("citrus")}>
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-2">🍊</div>
                    <h3 className="font-semibold mb-1">Citrus Advisor</h3>
                    <p className="text-sm text-gray-600">Vidarbha Bahar system guide</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("intercrop")}>
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-2">🌾</div>
                    <h3 className="font-semibold mb-1">Intercropping</h3>
                    <p className="text-sm text-gray-600">Tur-Cotton planner</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("soil")}>
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-2">🌱</div>
                    <h3 className="font-semibold mb-1">Soil Health</h3>
                    <p className="text-sm text-gray-600">Track pH & organic inputs</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("schemes")}>
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-2">🏛️</div>
                    <h3 className="font-semibold mb-1">Govt Schemes</h3>
                    <p className="text-sm text-gray-600">Check eligibility</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("voice")}>
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-2">🎤</div>
                    <h3 className="font-semibold mb-1">Voice Input</h3>
                    <p className="text-sm text-gray-600">Speak in your language</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("chatbot")}>
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-2">🤖</div>
                    <h3 className="font-semibold mb-1">AI Chatbot</h3>
                    <p className="text-sm text-gray-600">Disease detection & advice</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("diary")}>
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-2">📔</div>
                    <h3 className="font-semibold mb-1">Crop Diary</h3>
                    <p className="text-sm text-gray-600">Track farm activities</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("fpo")}>
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-2">🤝</div>
                    <h3 className="font-semibold mb-1">FPO Dashboard</h3>
                    <p className="text-sm text-gray-600">Cooperative management</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-blue-700 mb-2">💡 Quick Tip</h4>
                <p className="text-sm">Use voice input for hands-free operation while working in the field!</p>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-green-700 mb-2">🌾 Season Alert</h4>
                <p className="text-sm">Kharif season planning: Check ROI calculator for best crop selection</p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-yellow-700 mb-2">📱 Offline Ready</h4>
                <p className="text-sm">All your data is saved locally. Works without internet!</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Feature Tabs */}
        <TabsContent value="weather"><WeatherAgentCard /></TabsContent>
        <TabsContent value="roi"><ROICalculatorCard /></TabsContent>
        <TabsContent value="citrus"><CitrusAdvisorCard /></TabsContent>
        <TabsContent value="intercrop"><TurIntercroppingCard /></TabsContent>
        <TabsContent value="soil"><SoilHealthTrackerCard /></TabsContent>
        <TabsContent value="schemes"><GovernmentSchemeCard /></TabsContent>
        <TabsContent value="voice"><VoiceInputCard /></TabsContent>
        <TabsContent value="chatbot"><MLChatbotCard /></TabsContent>
        <TabsContent value="diary"><CropDiaryCard /></TabsContent>
        <TabsContent value="fpo"><FPODashboardCard /></TabsContent>
      </Tabs>

      {/* Footer */}
      <Card className="mt-6 bg-gray-50">
        <CardContent className="pt-4 text-center text-sm text-gray-600">
          <p>KisanConnect Smart Farming Platform | Made for Vidarbha Farmers</p>
          <p className="mt-1">किसान कनेक्ट - विदर्भ के किसानों के लिए | 📞 Helpline: 1800-XXX-XXXX</p>
        </CardContent>
      </Card>
    </div>
  );
}
