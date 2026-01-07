import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Upload, Camera, FileImage, Loader2, CheckCircle, AlertTriangle, Lightbulb, Wifi, WifiOff, Play, Info, Cloud, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { diseaseService } from "../services/api";
import { WeatherWidget } from "./WeatherWidget";
import { DiseaseVerificationPanel } from "./DiseaseVerificationPanel";
import { toast } from "sonner@2.0.3";

interface DiseaseResult {
  disease: string;
  confidence: number;
  treatment: string;
  prevention: string;
  severity?: string;
}

export function DiseaseDetection() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showVerification, setShowVerification] = useState(false);

  // Check backend status
  const checkBackendStatus = async () => {
    setBackendStatus('checking');
    try {
      const response = await fetch('http://localhost:5000/health', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        setBackendStatus('online');
        toast.success("Real-time AI connected!");
      } else {
        setBackendStatus('offline');
      }
    } catch (error) {
      setBackendStatus('offline');
    }
  };

  // Check backend status on component mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const handleImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Clear previous results
    setResult(null);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    setLoading(true);
    try {
      const diseaseResult = await diseaseService.detectDisease(selectedImage);
      setResult(diseaseResult);
      
      if (diseaseResult.disease.toLowerCase().includes("healthy") || diseaseResult.severity === "none") {
        toast.success("Great news! Your plant appears healthy.");
      } else if (diseaseResult.severity === "severe") {
        toast.error(`Severe disease detected: ${diseaseResult.disease}`);
      } else {
        toast.warning(`Disease detected: ${diseaseResult.disease}`);
      }
    } catch (error) {
      toast.error("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getDiseaseIcon = (disease: string, severity?: string) => {
    if (disease.toLowerCase().includes("healthy") || severity === "none") {
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    }
    if (severity === "severe") {
      return <AlertTriangle className="h-6 w-6 text-red-600" />;
    }
    return <AlertTriangle className="h-6 w-6 text-orange-600" />;
  };

  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null;
    
    const severityConfig = {
      none: { color: "bg-green-100 text-green-800", label: "Healthy" },
      mild: { color: "bg-yellow-100 text-yellow-800", label: "Mild" },
      moderate: { color: "bg-orange-100 text-orange-800", label: "Moderate" },
      severe: { color: "bg-red-100 text-red-800", label: "Severe" },
      unknown: { color: "bg-gray-100 text-gray-800", label: "Unknown" }
    };
    
    const config = severityConfig[severity as keyof typeof severityConfig] || severityConfig.unknown;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2>{t('diseaseDetectionTitle')}</h2>
          {backendStatus === 'online' && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Wifi className="h-3 w-3 mr-1" />
              Live AI
            </Badge>
          )}
          {backendStatus === 'offline' && (
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              <WifiOff className="h-3 w-3 mr-1" />
              Demo Mode
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          {backendStatus === 'online' 
            ? "Real-time TensorFlow-powered disease detection" 
            : "Demo mode - Enable real AI detection below"
          }
        </p>
      </div>

      {/* Backend Setup Guide */}
      {backendStatus === 'offline' && (
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">Enable Real-Time AI Disease Detection:</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={checkBackendStatus}
                  disabled={backendStatus === 'checking'}
                  className="text-blue-600 border-blue-300 hover:bg-blue-100"
                >
                  {backendStatus === 'checking' ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Play className="h-3 w-3 mr-1" />
                  )}
                  Check Again
                </Button>
              </div>
              <div className="text-sm space-y-1">
                <p><strong>Easy Setup:</strong></p>
                <p>1. Place your <code className="bg-blue-100 px-1 rounded">leaf_disease_model.h5</code> file in the <code className="bg-blue-100 px-1 rounded">backend</code> folder</p>
                <p>2. Double-click: <code className="bg-blue-100 px-1 rounded">start_ai_backend.bat</code> (Windows) or run <code className="bg-blue-100 px-1 rounded">python start_ai_backend.py</code></p>
                <p>3. Wait for &quot;AI Backend is now running!&quot; message</p>
                <p>4. Click &quot;Check Again&quot; button above</p>
              </div>
              <p className="text-xs text-blue-600 mt-2">The app works perfectly in demo mode too!</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {backendStatus === 'online' && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <p className="font-medium">🎉 Real-time TensorFlow AI is active!</p>
            <p className="text-sm mt-1">Your images are being analyzed by the actual machine learning model with 16 disease classes.</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Disease Scan Endpoint Verification */}
      <Card className="border-purple-200">
        <CardHeader 
          className="cursor-pointer hover:bg-purple-50"
          onClick={() => setShowVerification(!showVerification)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              🔬 Endpoint Verification
            </CardTitle>
            {showVerification ? (
              <ChevronUp className="h-5 w-5 text-purple-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-purple-600" />
            )}
          </div>
          <CardDescription>Test /disease_scan endpoint health and response validation</CardDescription>
        </CardHeader>
        {showVerification && (
          <CardContent className="pt-0">
            <DiseaseVerificationPanel />
          </CardContent>
        )}
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Weather Impact on Disease Risk
          </CardTitle>
          <CardDescription>Current weather conditions affect disease likelihood</CardDescription>
        </CardHeader>
        <CardContent>
          <WeatherWidget compact={true} />
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Disease Risk Assessment:</strong> High humidity (&gt;80%) increases fungal disease risk. 
              Monitor crops closely during monsoon season and ensure proper drainage.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Image Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {t('uploadPlantImage')}
          </CardTitle>
          <CardDescription>Upload a clear photo of the affected plant leaf or area</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!imagePreview ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {t('dragDropImage')}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supports JPG, PNG files up to 5MB
                  </p>
                </div>
                <Button variant="outline" className="mx-auto">
                  <FileImage className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Plant preview"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImagePreview(null);
                    setSelectedImage(null);
                    setResult(null);
                  }}
                >
                  Remove
                </Button>
              </div>
              
              <div className="flex justify-center">
                <Button onClick={analyzeImage} disabled={loading} className="min-w-32">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      {t('analyzeImage')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getDiseaseIcon(result.disease, result.severity)}
              {t('analysisResults')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Disease Identification */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-semibold">{result.disease}</h3>
                  {getSeverityBadge(result.severity)}
                </div>
                <Badge 
                  variant="secondary" 
                  className={getConfidenceColor(result.confidence)}
                >
                  {result.confidence}% {t('confidence')}
                </Badge>
              </div>
              
              <Progress 
                value={result.confidence} 
                className="w-full h-2"
              />
            </div>

            {/* Treatment Section */}
            <div className="space-y-3">
              <h4 className="font-semibold text-green-700 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                {t('treatment')}
              </h4>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-800">{result.treatment}</p>
              </div>
            </div>

            {/* Prevention Section */}
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {t('prevention')}
              </h4>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-800">{result.prevention}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setImagePreview(null);
                  setSelectedImage(null);
                  setResult(null);
                }}
                className="flex-1"
              >
                Analyze Another Image
              </Button>
              <Button 
                onClick={() => {
                  // In a real app, this would save to user's history or generate a report
                  toast.success("Analysis saved to your history");
                }}
                className="flex-1"
              >
                Save Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips for Better Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Tips for Better Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              Take photos in good natural lighting
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              Focus on the affected area of the plant
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              Ensure the image is clear and not blurry
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              Include some healthy parts for comparison
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              Avoid shadows or extreme angles
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}