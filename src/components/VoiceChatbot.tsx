import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  Play,
  Pause,
  RotateCcw,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Settings
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { enhancedChatService } from '../services/chatServiceEnhanced';
import { toast } from 'sonner@2.0.3';

interface VoiceMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  audioUrl?: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export function VoiceChatbot() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [synthSupported, setSynthSupported] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [volume, setVolume] = useState(0);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('checking');
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Language mapping for speech recognition
  const getLanguageCode = (lang: string): string => {
    const languageMap: { [key: string]: string } = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'pa': 'pa-IN',
      'bn': 'bn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN'
    };
    return languageMap[lang] || 'en-US';
  };

  // Add debug info
  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [`${new Date().toLocaleTimeString()}: ${info}`, ...prev.slice(0, 4)]);
  };

  // Check microphone permission
  const checkMicrophonePermission = async () => {
    try {
      addDebugInfo('Checking microphone permission...');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        addDebugInfo('MediaDevices API not supported');
        setMicPermission('denied');
        return;
      }

      addDebugInfo('MediaDevices API supported, requesting permission...');

      // Try to get permission using getUserMedia
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream immediately - we just needed to check permission
        stream.getTracks().forEach(track => track.stop());
        addDebugInfo('Microphone permission granted');
        setMicPermission('granted');
      } catch (error: any) {
        addDebugInfo(`Permission error: ${error.name} - ${error.message}`);
        
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setMicPermission('denied');
        } else if (error.name === 'NotFoundError') {
          setMicPermission('denied');
          toast.error(t('noMicrophoneFound') || 'No microphone found on this device.');
        } else {
          setMicPermission('denied');
          console.error('Microphone permission error:', error);
        }
      }
    } catch (error) {
      addDebugInfo(`General error: ${error}`);
      setMicPermission('denied');
      console.error('Error checking microphone permission:', error);
    }
  };

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check microphone permission first
    checkMicrophonePermission();

    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = getLanguageCode(language);
      
      recognition.onstart = () => {
        setIsListening(true);
        setCurrentTranscript('');
        startVolumeAnimation();
      };
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentTranscript(transcript);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        stopVolumeAnimation();
        if (currentTranscript.trim()) {
          handleVoiceInput(currentTranscript.trim());
        }
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        stopVolumeAnimation();
        
        if (event.error === 'not-allowed' || event.error === 'audio-capture') {
          setMicPermission('denied');
          setShowPermissionGuide(true);
          toast.error(t('microphonePermissionRequired') || 'Please enable microphone access to use voice features.');
        } else {
          const errorMessages: { [key: string]: string } = {
            'no-speech': t('noSpeechDetected') || 'No speech detected. Please try again.',
            'network': t('networkError') || 'Network error occurred.',
            'service-not-allowed': t('speechServiceError') || 'Speech service unavailable.',
            'bad-grammar': t('speechNotRecognized') || 'Speech not recognized. Please try again.'
          };
          
          toast.error(errorMessages[event.error] || t('speechError') || 'Speech recognition error');
        }
      };
      
      recognitionRef.current = recognition;
    }

    // Check for speech synthesis support
    if ('speechSynthesis' in window) {
      setSynthSupported(true);
      synthRef.current = window.speechSynthesis;
    }

    // Add welcome message
    const welcomeMessage: VoiceMessage = {
      id: '1',
      text: t('voiceBotGreeting') || 'Hello! I am your voice assistant. You can speak to me and I will help you with farming questions.',
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);

  }, [language, t, currentTranscript]);

  // Volume animation for visual feedback
  const startVolumeAnimation = () => {
    volumeIntervalRef.current = setInterval(() => {
      setVolume(prev => (prev + 1) % 5);
    }, 100);
  };

  const stopVolumeAnimation = () => {
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    setVolume(0);
  };

  // Handle voice input processing
  const handleVoiceInput = async (transcript: string) => {
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      text: transcript,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Get bot response using enhanced chat service
      const botResponseText = await enhancedChatService.sendMessage(transcript, language);
      
      const botMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Speak the response
      if (synthSupported) {
        speakText(botResponseText);
      }
      
    } catch (error) {
      console.error('Voice chat error:', error);
      const errorMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        text: t('voiceErrorResponse') || 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      if (synthSupported) {
        speakText(errorMessage.text);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Text-to-speech function
  const speakText = (text: string) => {
    if (!synthRef.current || isSpeaking) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageCode(language);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast.error(t('speechSynthesisError') || 'Speech synthesis error');
    };

    synthRef.current.speak(utterance);
  };

  // Request microphone permission
  const requestMicrophonePermission = async () => {
    setMicPermission('checking');
    await checkMicrophonePermission();
    if (micPermission !== 'granted') {
      setShowPermissionGuide(true);
    }
  };

  // Control functions
  const startListening = async () => {
    if (!recognitionRef.current || isListening || isProcessing) return;
    
    // Check permission before starting
    if (micPermission !== 'granted') {
      await requestMicrophonePermission();
      if (micPermission !== 'granted') {
        return;
      }
    }
    
    try {
      recognitionRef.current.lang = getLanguageCode(language);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      toast.error(t('microphoneStartError') || 'Failed to start microphone');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const clearMessages = () => {
    setMessages([{
      id: '1',
      text: t('voiceBotGreeting') || 'Hello! I am your voice assistant. You can speak to me and I will help you with farming questions.',
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      stopVolumeAnimation();
    };
  }, []);

  // Permission Guide Component
  const PermissionGuide = () => (
    <Alert className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-3">
          <p className="font-medium">{t('microphonePermissionRequired') || 'Microphone Permission Required'}</p>
          
          <div className="text-sm space-y-2">
            <p>{t('permissionInstructions') || 'To use voice features:'}</p>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-medium text-blue-800 mb-2">📱 {t('forMobile') || 'For Mobile Devices:'}</p>
              <ol className="list-decimal pl-4 space-y-1 text-blue-700">
                <li>{t('mobileStep1') || 'Look for camera/microphone icon next to the URL'}</li>
                <li>{t('mobileStep2') || 'Tap "Allow" or "Grant Permission"'}</li>
                <li>{t('mobileStep3') || 'Refresh the page'}</li>
              </ol>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="font-medium text-green-800 mb-2">💻 {t('forDesktop') || 'For Desktop Browsers:'}</p>
              <ol className="list-decimal pl-4 space-y-1 text-green-700">
                <li>{t('desktopStep1') || 'Click the microphone icon in the address bar'}</li>
                <li>{t('desktopStep2') || 'Select "Always allow" for this site'}</li>
                <li>{t('desktopStep3') || 'Reload the page if needed'}</li>
              </ol>
            </div>

            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-xs text-amber-700">
                <span className="font-medium">⚠️ {t('troubleshootingNote') || 'Still having issues?'}</span><br/>
                {t('clearCacheNote') || 'Try clearing your browser cache and cookies, then restart the browser.'}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">
                <span className="font-medium">🔒 {t('securityNote') || 'Security Note:'}</span><br/>
                {t('httpsRequired') || 'Voice features require HTTPS connection. Make sure the URL starts with "https://"'}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={requestMicrophonePermission} disabled={micPermission === 'checking'}>
              {micPermission === 'checking' ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  {t('checkingPermission') || 'Checking...'}
                </>
              ) : (
                t('tryAgain') || 'Try Again'
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowPermissionGuide(false)}>
              {t('close') || 'Close'}
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );

  // Show setup guide if there are major compatibility issues
  if (!speechSupported && !synthSupported) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t('voiceNotSupported') || 'Voice features are not supported in this browser. Please use Chrome, Edge, or Safari for the best experience.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show permission blocked screen
  if (micPermission === 'denied' && !showPermissionGuide) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <div className="rounded-full p-4 bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{t('microphoneBlocked') || 'Microphone Blocked'}</h3>
          <p className="text-muted-foreground max-w-md">
            {t('microphoneBlockedDesc') || 'To use voice chat, please enable microphone access in your browser settings.'}
          </p>
        </div>
        <div className="space-y-2">
          <Button onClick={() => setShowPermissionGuide(true)}>
            {t('showInstructions') || 'Show Instructions'}
          </Button>
          <Button variant="outline" onClick={requestMicrophonePermission}>
            {t('tryAgain') || 'Try Again'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">{t('voiceAssistant') || 'Voice Assistant'}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={speechSupported && micPermission === 'granted' ? 'default' : 'secondary'}>
              <Mic className="h-3 w-3 mr-1" />
              {speechSupported && micPermission === 'granted' ? t('micEnabled') || 'Mic Ready' : t('micDisabled') || 'Mic Blocked'}
            </Badge>
            <Badge variant={synthSupported ? 'default' : 'secondary'}>
              <Volume2 className="h-3 w-3 mr-1" />
              {synthSupported ? t('speakerEnabled') || 'Speaker' : t('speakerDisabled') || 'No Speaker'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Permission Guide */}
      {showPermissionGuide && (
        <div className="p-4 border-b">
          <PermissionGuide />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div className={`rounded-full p-2 ${
              message.sender === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}>
              {message.sender === 'user' ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>
            <div className={`max-w-[80%] ${
              message.sender === 'user' ? 'text-right' : 'text-left'
            }`}>
              <div className={`rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white border'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.text}</p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString()}
                </p>
                {message.sender === 'bot' && synthSupported && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => speakText(message.text)}
                    disabled={isSpeaking}
                  >
                    <Volume2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex items-start gap-3">
            <div className="rounded-full p-2 bg-secondary text-secondary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-white border rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  {t('processing') || 'Processing...'}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Current transcript display */}
      {isListening && currentTranscript && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-medium">{t('listening') || 'Listening'}:</span> {currentTranscript}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-center justify-center gap-4">
          {/* Microphone Button */}
          <div className="flex flex-col items-center">
            <Button
              size="lg"
              variant={isListening ? "destructive" : micPermission === 'granted' ? "default" : "secondary"}
              className={`h-16 w-16 rounded-full ${isListening ? 'animate-pulse' : ''}`}
              onClick={isListening ? stopListening : startListening}
              disabled={!speechSupported || isProcessing || micPermission === 'checking'}
            >
              {isListening ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
            <span className="text-xs mt-1 text-center">
              {isListening ? t('stopListening') || 'Stop' : 
               micPermission === 'granted' ? t('startListening') || 'Speak' :
               micPermission === 'checking' ? t('checking') || 'Checking...' :
               t('enableMic') || 'Enable Mic'}
            </span>
          </div>

          {/* Voice Animation */}
          {isListening && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`voice-wave bg-green-500 w-1 rounded-full ${
                    volume === i ? 'h-8' : 'h-2'
                  }`}
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    transition: 'height 0.2s ease-in-out'
                  }}
                />
              ))}
            </div>
          )}

          {/* Speaker Control */}
          <div className="flex flex-col items-center">
            <Button
              size="lg"
              variant={isSpeaking ? "secondary" : "outline"}
              className="h-16 w-16 rounded-full"
              onClick={isSpeaking ? stopSpeaking : () => {}}
              disabled={!synthSupported || !isSpeaking}
            >
              {isSpeaking ? (
                <VolumeX className="h-6 w-6" />
              ) : (
                <Volume2 className="h-6 w-6" />
              )}
            </Button>
            <span className="text-xs mt-1 text-center">
              {isSpeaking ? t('stopSpeaking') || 'Stop' : t('speaker') || 'Speaker'}
            </span>
          </div>

          {/* Clear Button */}
          <div className="flex flex-col items-center">
            <Button
              size="lg"
              variant="outline"
              className="h-16 w-16 rounded-full"
              onClick={clearMessages}
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
            <span className="text-xs mt-1 text-center">
              {t('clear') || 'Clear'}
            </span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-2">
            {isListening && (
              <Badge variant="default" className="animate-pulse">
                <Mic className="h-3 w-3 mr-1" />
                {t('listening') || 'Listening...'}
              </Badge>
            )}
            {isSpeaking && (
              <Badge variant="secondary">
                <Volume2 className="h-3 w-3 mr-1" />
                {t('speaking') || 'Speaking...'}
              </Badge>
            )}
            {isProcessing && (
              <Badge variant="outline">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                {t('processing') || 'Processing...'}
              </Badge>
            )}
            {!isListening && !isSpeaking && !isProcessing && (
              <Badge variant="outline">
                <CheckCircle className="h-3 w-3 mr-1" />
                {t('ready') || 'Ready'}
              </Badge>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            {t('voiceInstructions') || 'Tap the microphone to start speaking. Ask me about crops, diseases, weather, or market prices.'}
          </p>
        </div>
      </div>
    </div>
  );
}