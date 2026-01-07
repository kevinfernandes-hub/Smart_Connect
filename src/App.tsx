import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { CropRecommendation } from "./components/CropRecommendation";
import { DiseaseDetection } from "./components/DiseaseDetection";
import { MarketAnalysis } from "./components/MarketAnalysis";
import { KisanChatbot } from "./components/KisanChatbot";
import { LoginPage } from "./components/LoginPage";
import { LanguageSelector } from "./components/LanguageSelector";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { 
  Home, 
  Sprout, 
  Search, 
  TrendingUp, 
  MessageCircle,
  Bell,
  User,
  LogOut
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

function AppContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { t } = useLanguage();
  const { user, logout, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Sprout className="h-12 w-12 text-green-600 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading Farm Advisor...</p>
        </div>
      </div>
    );
  }

  // Show login page if user is not authenticated
  if (!user) {
    return <LoginPage />;
  }

  const navigation = [
    { id: "dashboard", label: t('home'), icon: Home, shortLabel: t('home') },
    { id: "crops", label: t('crops'), icon: Sprout, shortLabel: t('crops') },
    { id: "disease", label: t('scan'), icon: Search, shortLabel: t('scan') },
    { id: "market", label: t('market'), icon: TrendingUp, shortLabel: t('market') },
    { id: "chat", label: t('chat'), icon: MessageCircle, shortLabel: t('chat') },
  ];

  const getPageTitle = () => {
    const page = navigation.find(nav => nav.id === activeTab);
    return page?.label || t('appName');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* App Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white sticky top-0 z-50 shadow-lg">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-white text-lg font-semibold">{t('appName')}</h1>
                <p className="text-green-100 text-xs">{getPageTitle()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-10 w-10">
                <div className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 border-2 border-white text-xs">
                    2
                  </Badge>
                </div>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 h-10 w-10"
                onClick={logout}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="pb-20"> {/* Add bottom padding for bottom nav */}
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "crops" && <CropRecommendation />}
          {activeTab === "disease" && <DiseaseDetection />}
          {activeTab === "market" && <MarketAnalysis />}
          {activeTab === "chat" && <KisanChatbot />}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 safe-area-pb">
        <div className="grid grid-cols-5 px-2 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-green-100 text-green-700 transform scale-105' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all ${
                  isActive ? 'bg-green-200' : ''
                }`}>
                  <Icon className={`h-5 w-5 transition-all ${
                    isActive ? 'text-green-700' : ''
                  }`} />
                </div>
                <span className={`text-xs mt-1 font-medium transition-all ${
                  isActive ? 'text-green-700' : 'text-muted-foreground'
                }`}>
                  {item.shortLabel}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-center" />
      </AuthProvider>
    </LanguageProvider>
  );
}
