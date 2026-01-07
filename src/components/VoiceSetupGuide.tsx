import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Shield, 
  Mic, 
  Globe, 
  AlertCircle, 
  CheckCircle, 
  Info,
  ExternalLink,
  Smartphone,
  Monitor
} from "lucide-react";

interface VoiceSetupGuideProps {
  isSecure: boolean;
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'checking';
  onRequestPermission: () => Promise<void>;
}

export function VoiceSetupGuide({ isSecure, permissionStatus, onRequestPermission }: VoiceSetupGuideProps) {
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

  return (
    <div className="space-y-4">
      {/* Main Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Assistant Setup
          </CardTitle>
          <CardDescription>
            Configure your browser for voice features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Security Status */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className={`h-5 w-5 ${isSecure ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className="font-medium">Secure Connection</p>
                <p className="text-sm text-muted-foreground">
                  {isSecure ? 'HTTPS connection detected' : 'HTTP connection (not secure)'}
                </p>
              </div>
            </div>
            <Badge variant={isSecure ? "default" : "destructive"}>
              {isSecure ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
              {isSecure ? 'Secure' : 'Not Secure'}
            </Badge>
          </div>

          {/* Permission Status */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mic className={`h-5 w-5 ${
                permissionStatus === 'granted' ? 'text-green-600' : 
                permissionStatus === 'denied' ? 'text-red-600' : 'text-orange-600'
              }`} />
              <div>
                <p className="font-medium">Microphone Permission</p>
                <p className="text-sm text-muted-foreground">
                  {permissionStatus === 'granted' && 'Microphone access granted'}
                  {permissionStatus === 'denied' && 'Microphone access denied'}
                  {permissionStatus === 'prompt' && 'Permission needed'}
                  {permissionStatus === 'checking' && 'Checking permissions...'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={
                permissionStatus === 'granted' ? "default" : 
                permissionStatus === 'denied' ? "destructive" : "secondary"
              }>
                {permissionStatus === 'granted' && <CheckCircle className="h-3 w-3 mr-1" />}
                {permissionStatus === 'denied' && <AlertCircle className="h-3 w-3 mr-1" />}
                {permissionStatus === 'prompt' && <Info className="h-3 w-3 mr-1" />}
                {permissionStatus.charAt(0).toUpperCase() + permissionStatus.slice(1)}
              </Badge>
              {permissionStatus === 'prompt' && (
                <Button size="sm" onClick={onRequestPermission}>
                  Grant Access
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues and Solutions */}
      {(!isSecure || permissionStatus === 'denied') && (
        <div className="space-y-3">
          {/* HTTPS Issue */}
          {!isSecure && (
            <Alert className="border-red-200 bg-red-50">
              <Shield className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="space-y-2">
                  <p className="font-medium">HTTPS Required for Voice Features</p>
                  <p className="text-sm">Modern browsers require secure connections for microphone access.</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>For Development:</strong></p>
                    <ul className="list-disc ml-4 space-y-1">
                      <li>Access via <code className="bg-red-100 px-1 rounded">localhost</code> or <code className="bg-red-100 px-1 rounded">127.0.0.1</code></li>
                      <li>Use a development server with HTTPS</li>
                    </ul>
                    <p><strong>For Production:</strong></p>
                    <ul className="list-disc ml-4 space-y-1">
                      <li>Deploy to a platform with SSL (Vercel, Netlify, etc.)</li>
                      <li>Use a custom domain with SSL certificate</li>
                    </ul>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Permission Denied Issue */}
          {permissionStatus === 'denied' && (
            <Alert className="border-orange-200 bg-orange-50">
              <Mic className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="space-y-2">
                  <p className="font-medium">Microphone Access Blocked</p>
                  <p className="text-sm">To enable voice chat, you need to allow microphone access:</p>
                  
                  {/* Browser-specific instructions */}
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <Monitor className="h-3 w-3" />
                        Chrome/Edge/Safari:
                      </p>
                      <ol className="list-decimal ml-4 space-y-1">
                        <li>Look for the microphone icon in the address bar</li>
                        <li>Click it and select "Allow"</li>
                        <li>Refresh the page</li>
                      </ol>
                    </div>
                    
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <Smartphone className="h-3 w-3" />
                        Mobile Browsers:
                      </p>
                      <ol className="list-decimal ml-4 space-y-1">
                        <li>Go to browser settings</li>
                        <li>Find site permissions or privacy settings</li>
                        <li>Allow microphone for this site</li>
                        <li>Refresh the page</li>
                      </ol>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-orange-200">
                    <p className="text-xs text-orange-600">
                      If you continue to have issues, try clearing your browser cache and cookies for this site.
                    </p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Success State */}
      {isSecure && permissionStatus === 'granted' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="space-y-2">
              <p className="font-medium">🎉 Voice Assistant Ready!</p>
              <p className="text-sm">Your browser is properly configured for voice features.</p>
              <ul className="text-sm mt-2 space-y-1">
                <li>✅ Secure HTTPS connection</li>
                <li>✅ Microphone access granted</li>
                <li>✅ Speech recognition supported</li>
                <li>✅ Text-to-speech supported</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Helpful Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tips for Better Voice Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium">Clear Speech</p>
              <p className="text-muted-foreground">Speak clearly and at a normal pace for better recognition</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium">Quiet Environment</p>
              <p className="text-muted-foreground">Use in a quiet environment for best results</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium">Language Selection</p>
              <p className="text-muted-foreground">Make sure the correct language is selected for better accuracy</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium">Browser Compatibility</p>
              <p className="text-muted-foreground">Works best in Chrome, Edge, and Safari. Limited support in Firefox.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}