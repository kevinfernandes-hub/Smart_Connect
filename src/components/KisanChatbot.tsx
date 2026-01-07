// KisanConnect Production Chatbot Component
// Mobile-first, multilingual agricultural expert chatbot

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Send, 
  Bot, 
  User, 
  Camera, 
  Cloud, 
  TrendingUp, 
  Loader2, 
  Mic, 
  MicOff,
  RefreshCw,
  X,
  ChevronDown,
  Sprout,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';
import { kisanChatService, ChatMessage, DiseaseDetectionResult, mockApi, SIHDiseaseLabel } from '../services/chatbot';

// Quick action chips configuration
interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: { en: string; hi: string; mr: string };
  action: 'photo' | 'weather' | 'market' | 'reupload' | 'vidarbha_weather' | 'nagpur_mandi';
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'photo',
    icon: <Camera className="h-4 w-4" />,
    label: { en: 'Photo Upload', hi: 'फोटो अपलोड', mr: 'फोटो अपलोड' },
    action: 'photo'
  },
  {
    id: 'weather',
    icon: <Cloud className="h-4 w-4" />,
    label: { en: 'Weather', hi: 'मौसम', mr: 'हवामान' },
    action: 'weather'
  },
  {
    id: 'market',
    icon: <TrendingUp className="h-4 w-4" />,
    label: { en: 'Market Price', hi: 'बाजार भाव', mr: 'बाजारभाव' },
    action: 'market'
  }
];

// SIH-specific quick action chips for Vidarbha region
const SIH_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'reupload',
    icon: <RefreshCw className="h-4 w-4" />,
    label: { en: 'Re-upload Photo', hi: 'फोटो पुन्हा अपलोड', mr: 'फोटो पुन्हा अपलोड' },
    action: 'reupload'
  },
  {
    id: 'vidarbha_weather',
    icon: <Cloud className="h-4 w-4" />,
    label: { en: 'Vidarbha Weather', hi: 'विदर्भ मौसम', mr: 'विदर्भ हवामान' },
    action: 'vidarbha_weather'
  },
  {
    id: 'nagpur_mandi',
    icon: <TrendingUp className="h-4 w-4" />,
    label: { en: 'Nagpur Mandi', hi: 'नागपुर मंडी', mr: 'नागपूर मंडी' },
    action: 'nagpur_mandi'
  }
];

// SIH Disease label to action chip mapping
const SIH_FOLLOW_UP_CHIPS: Record<SIHDiseaseLabel, QuickAction[]> = {
  'Nitrogen_Deficiency': [
    {
      id: 'urea_dose',
      icon: <Sprout className="h-4 w-4" />,
      label: { en: 'Urea Dosage', hi: 'यूरिया मात्रा', mr: 'युरिया मात्रा' },
      action: 'market'
    },
    ...SIH_QUICK_ACTIONS
  ],
  'Aphid_Attack': [
    {
      id: 'organic_spray',
      icon: <Sprout className="h-4 w-4" />,
      label: { en: 'Organic Spray', hi: 'जैविक छिड़काव', mr: 'सेंद्रिय फवारणी' },
      action: 'market'
    },
    ...SIH_QUICK_ACTIONS
  ],
  'Fungal_Spot': [
    {
      id: 'fungicide',
      icon: <AlertCircle className="h-4 w-4" />,
      label: { en: 'Fungicide Info', hi: 'फफूंदनाशक', mr: 'बुरशीनाशक' },
      action: 'market'
    },
    ...SIH_QUICK_ACTIONS
  ],
  'Healthy': [
    ...QUICK_ACTIONS
  ],
  'Unknown': [
    ...SIH_QUICK_ACTIONS
  ]
};

// Format timestamp for display
function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Generate unique message ID
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export function KisanChatbot() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [lastSIHLabel, setLastSIHLabel] = useState<SIHDiseaseLabel | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  
  // Initialize with greeting message
  useEffect(() => {
    const greeting = getGreetingMessage();
    setMessages([{
      id: generateMessageId(),
      text: greeting,
      sender: 'bot',
      timestamp: new Date()
    }]);
  }, [language]);
  
  // Get greeting message based on language - SIH Edition for Vidarbha
  function getGreetingMessage(): string {
    const lang = language as 'en' | 'hi' | 'mr';
    const greetings = {
      en: '🙏 Namaste! I am your KisanConnect - Farm Advisor (SIH Edition).\n\n🌾 Specialized for Vidarbha Region - Cotton, Soybean, Tur dal\n\n📸 Upload crop photo → I detect: Nitrogen Deficiency, Aphid Attack, Fungal Spots\n\n💬 I understand Hindi, Marathi, and English!\n\n❓ Which crop are you growing? (cotton/soybean/tur)',
      hi: '🙏 नमस्ते! मैं आपका किसानकनेक्ट - फार्म एडवाइजर (SIH संस्करण) हूं।\n\n🌾 विदर्भ क्षेत्र विशेष - कपास, सोयाबीन, तूर दाल\n\n📸 फसल का फोटो भेजें → मैं पहचानता हूं: नाइट्रोजन की कमी, माहूं का प्रकोप, फफूंद\n\n💬 मैं हिंदी, मराठी, और अंग्रेजी समझता हूं!\n\n❓ आप कौन सी फसल उगा रहे हैं? (कपास/सोयाबीन/तूर)',
      mr: '🙏 नमस्कार! मी तुमचा किसानकनेक्ट - फार्म अॅडव्हायझर (SIH आवृत्ती) आहे.\n\n🌾 विदर्भ भागासाठी विशेष - कापूस, सोयाबीन, तूर\n\n📸 पिकाचा फोटो पाठवा → मी ओळखतो: नायट्रोजनची कमतरता, मावा कीड, बुरशी\n\n💬 मला हिंदी, मराठी, आणि इंग्रजी समजते!\n\n❓ तुम्ही कोणते पीक घेत आहात? (कापूस/सोयाबीन/तूर)'
    };
    return greetings[lang] || greetings.en;
  }
  
  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  // Handle scroll position for show/hide scroll button
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  }, []);
  
  // Send message handler
  const handleSendMessage = async () => {
    const trimmedText = inputText.trim();
    if (!trimmedText || isTyping) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      text: trimmedText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Add loading message
    const loadingId = generateMessageId();
    setMessages(prev => [...prev, {
      id: loadingId,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true
    }]);
    
    try {
      // Process message through the service
      const result = await kisanChatService.processMessage(trimmedText);
      
      // Replace loading message with actual response
      setMessages(prev => prev.map(msg => 
        msg.id === loadingId
          ? {
              id: msg.id,
              text: result.response,
              sender: 'bot' as const,
              timestamp: new Date(),
              intent: result.intent
            }
          : msg
      ));
    } catch (error) {
      console.error('Chat error:', error);
      
      // Show error toast
      toast.error(
        language === 'hi' ? 'कुछ गड़बड़ हुई। कृपया फिर से कोशिश करें।' :
        language === 'mr' ? 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.' :
        'Something went wrong. Please try again.',
        { duration: 4000 }
      );
      
      // Replace loading message with error
      setMessages(prev => prev.map(msg =>
        msg.id === loadingId
          ? {
              id: msg.id,
              text: language === 'hi' 
                ? '❌ कुछ गड़बड़ हुई। कृपया फिर से पूछें।'
                : language === 'mr'
                ? '❌ काहीतरी चूक झाली. कृपया पुन्हा विचारा.'
                : '❌ Something went wrong. Please ask again.',
              sender: 'bot' as const,
              timestamp: new Date(),
              isError: true
            }
          : msg
      ));
    } finally {
      setIsTyping(false);
    }
  };
  
  // Handle keyboard submit
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle quick action clicks
  const handleQuickAction = async (action: QuickAction['action']) => {
    switch (action) {
      case 'photo':
      case 'reupload':
        fileInputRef.current?.click();
        break;
        
      case 'weather':
        const weatherQuery = language === 'hi' 
          ? 'आज का मौसम कैसा है और खेती के लिए क्या सलाह है?'
          : language === 'mr'
          ? 'आजचे हवामान कसे आहे आणि शेतीसाठी काय सल्ला आहे?'
          : 'What is today\'s weather and farming advice?';
        setInputText(weatherQuery);
        break;
        
      case 'vidarbha_weather':
        const vidarbhaQuery = language === 'hi'
          ? 'विदर्भ क्षेत्र का आज का मौसम और कृषि सलाह बताइए'
          : language === 'mr'
          ? 'विदर्भ भागातील आजचे हवामान आणि शेती सल्ला सांगा'
          : 'Tell me today\'s weather and farming advice for Vidarbha region';
        setInputText(vidarbhaQuery);
        break;
        
      case 'nagpur_mandi':
        const nagpurQuery = language === 'hi'
          ? 'नागपुर मंडी में आज सोयाबीन और कपास का भाव क्या है?'
          : language === 'mr'
          ? 'नागपूर मंडीत आज सोयाबीन आणि कापसाचा भाव काय आहे?'
          : 'What are today\'s soybean and cotton prices at Nagpur mandi?';
        setInputText(nagpurQuery);
        break;
        
      case 'market':
        const marketQuery = language === 'hi'
          ? 'आज गेहूं और सोयाबीन का मंडी भाव क्या है?'
          : language === 'mr'
          ? 'आज गहू आणि सोयाबीनचा बाजारभाव काय आहे?'
          : 'What are today\'s wheat and soybean market prices?';
        setInputText(marketQuery);
        break;
    }
  };
  
  // Handle image upload for disease detection
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(
        language === 'hi' ? 'कृपया एक छवि फ़ाइल चुनें' :
        language === 'mr' ? 'कृपया एक प्रतिमा फाइल निवडा' :
        'Please select an image file'
      );
      return;
    }
    
    // Add user message indicating upload
    const uploadMessage: ChatMessage = {
      id: generateMessageId(),
      text: language === 'hi' 
        ? '📸 पौधे की तस्वीर भेजी...'
        : language === 'mr'
        ? '📸 रोपाचा फोटो पाठवला...'
        : '📸 Sent plant photo for analysis...',
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, uploadMessage]);
    setIsTyping(true);
    
    // Add loading message
    const loadingId = generateMessageId();
    setMessages(prev => [...prev, {
      id: loadingId,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true
    }]);
    
    try {
      // Simulate disease detection with SIH ML model labels
      // In production, this calls the actual ML model API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock SIH model result - randomly pick one of the 4 labels
      const sihLabels: SIHDiseaseLabel[] = ['Nitrogen_Deficiency', 'Aphid_Attack', 'Fungal_Spot', 'Healthy'];
      const randomLabel = sihLabels[Math.floor(Math.random() * sihLabels.length)];
      const confidence = 0.75 + Math.random() * 0.2; // 75-95% confidence
      
      // Process through SIH model integration
      const chatResult = kisanChatService.processSIHModelResult(randomLabel, confidence);
      
      // Store the SIH label for showing relevant quick action chips
      setLastSIHLabel(chatResult.sihLabel);
      
      // Replace loading message with result
      setMessages(prev => prev.map(msg =>
        msg.id === loadingId
          ? {
              id: msg.id,
              text: chatResult.response,
              sender: 'bot' as const,
              timestamp: new Date(),
              intent: 'disease_help'
            }
          : msg
      ));
      
      // Show SIH-specific toast based on detected label
      const labelToasts: Record<SIHDiseaseLabel, { en: string; hi: string; mr: string }> = {
        'Nitrogen_Deficiency': {
          en: '⚠️ Nitrogen deficiency detected!',
          hi: '⚠️ नाइट्रोजन की कमी पाई गई!',
          mr: '⚠️ नायट्रोजनची कमतरता आढळली!'
        },
        'Aphid_Attack': {
          en: '🐛 Aphid attack detected!',
          hi: '🐛 माहूं का प्रकोप पाया गया!',
          mr: '🐛 मावा कीडांचा हल्ला आढळला!'
        },
        'Fungal_Spot': {
          en: '🍄 Fungal infection detected!',
          hi: '🍄 फफूंद संक्रमण पाया गया!',
          mr: '🍄 बुरशीजन्य संसर्ग आढळला!'
        },
        'Healthy': {
          en: '✅ Plant is healthy!',
          hi: '✅ पौधा स्वस्थ है!',
          mr: '✅ रोप निरोगी आहे!'
        },
        'Unknown': {
          en: '🔍 Analysis complete',
          hi: '🔍 विश्लेषण पूर्ण',
          mr: '🔍 विश्लेषण पूर्ण'
        }
      };
      
      const toastMsg = labelToasts[chatResult.sihLabel];
      toast.success(
        language === 'hi' ? toastMsg.hi :
        language === 'mr' ? toastMsg.mr :
        toastMsg.en
      );
    } catch (error) {
      console.error('Disease detection error:', error);
      setLastSIHLabel(null);
      
      toast.error(
        language === 'hi' ? 'तस्वीर का विश्लेषण नहीं हो सका' :
        language === 'mr' ? 'फोटोचे विश्लेषण होऊ शकले नाही' :
        'Could not analyze the image'
      );
      
      setMessages(prev => prev.map(msg =>
        msg.id === loadingId
          ? {
              id: msg.id,
              text: language === 'hi'
                ? '❌ तस्वीर का विश्लेषण नहीं हो सका। कृपया साफ तस्वीर भेजें।'
                : language === 'mr'
                ? '❌ फोटोचे विश्लेषण होऊ शकले नाही. कृपया स्पष्ट फोटो पाठवा.'
                : '❌ Could not analyze the image. Please send a clearer photo.',
              sender: 'bot' as const,
              timestamp: new Date(),
              isError: true
            }
          : msg
      ));
    } finally {
      setIsTyping(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Voice input handler
  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error(
        language === 'hi' ? 'आपका ब्राउज़र वॉइस इनपुट का समर्थन नहीं करता' :
        language === 'mr' ? 'तुमचा ब्राउझर व्हॉइस इनपुट समर्थित नाही' :
        'Your browser does not support voice input'
      );
      return;
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error !== 'aborted') {
        toast.error(
          language === 'hi' ? 'वॉइस इनपुट विफल। कृपया फिर से कोशिश करें।' :
          language === 'mr' ? 'व्हॉइस इनपुट अयशस्वी. कृपया पुन्हा प्रयत्न करा.' :
          'Voice input failed. Please try again.'
        );
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };
  
  // Reset chat
  const handleResetChat = () => {
    kisanChatService.resetSession();
    setMessages([{
      id: generateMessageId(),
      text: getGreetingMessage(),
      sender: 'bot',
      timestamp: new Date()
    }]);
    toast.success(
      language === 'hi' ? 'चैट रीसेट हो गई' :
      language === 'mr' ? 'चॅट रीसेट झाली' :
      'Chat has been reset'
    );
  };
  
  // Get quick action label based on language
  const getQuickActionLabel = (action: QuickAction): string => {
    const lang = language as 'en' | 'hi' | 'mr';
    return action.label[lang] || action.label.en;
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] max-w-3xl mx-auto">
      {/* Chat Header - SIH Edition */}
      <Card className="rounded-b-none border-b-0">
        <CardHeader className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Sprout className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold text-base">
                  {language === 'hi' ? 'किसान सहायक (SIH)' : 
                   language === 'mr' ? 'शेतकरी सहाय्यक (SIH)' : 
                   'Farm Advisor (SIH)'}
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  {language === 'hi' ? 'विदर्भ क्षेत्र' : 
                   language === 'mr' ? 'विदर्भ भाग' : 
                   'Vidarbha Region'}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleResetChat}
              title={language === 'hi' ? 'नई चैट' : language === 'mr' ? 'नवीन चॅट' : 'New chat'}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>
      
      {/* Messages Area */}
      <Card className="flex-1 rounded-none border-y-0 overflow-hidden">
        <CardContent className="p-0 h-full relative">
          <ScrollArea 
            className="h-full px-4 py-2"
            ref={scrollAreaRef}
            onScrollCapture={handleScroll}
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-blue-100' 
                        : message.isError 
                        ? 'bg-red-100' 
                        : 'bg-green-100'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4 text-blue-600" />
                      ) : message.isError ? (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <Bot className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`rounded-2xl px-4 py-2.5 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : message.isError
                        ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}>
                      {message.isLoading ? (
                        <div className="flex items-center gap-2 py-1">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">
                            {language === 'hi' ? 'सोच रहा हूं...' :
                             language === 'mr' ? 'विचार करत आहे...' :
                             'Thinking...'}
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="text-sm whitespace-pre-wrap break-words">
                            {message.text}
                          </div>
                          <div className={`text-[10px] mt-1.5 ${
                            message.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                          }`}>
                            {formatTime(message.timestamp)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Scroll to bottom button */}
          {showScrollButton && (
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-4 right-4 rounded-full shadow-lg h-8 w-8"
              onClick={scrollToBottom}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
        </CardContent>
      </Card>
      
      {/* Quick Actions - Shows SIH-specific chips after disease detection */}
      <Card className="rounded-none border-y-0">
        <CardContent className="py-2 px-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {/* Show SIH-specific chips if we have a detected label, otherwise show default */}
            {(lastSIHLabel && SIH_FOLLOW_UP_CHIPS[lastSIHLabel] 
              ? SIH_FOLLOW_UP_CHIPS[lastSIHLabel] 
              : QUICK_ACTIONS
            ).map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className="flex-shrink-0 gap-1.5 h-8 text-xs"
                onClick={() => handleQuickAction(action.action)}
              >
                {action.icon}
                {getQuickActionLabel(action)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Input Area */}
      <Card className="rounded-t-none">
        <CardContent className="p-3">
          <div className="flex gap-2">
            {/* Voice Input Button */}
            <Button
              variant={isListening ? 'destructive' : 'outline'}
              size="icon"
              className="flex-shrink-0"
              onClick={toggleVoiceInput}
              title={language === 'hi' ? 'वॉइस इनपुट' : language === 'mr' ? 'व्हॉइस इनपुट' : 'Voice input'}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            
            {/* Text Input */}
            <div className="flex-1 relative">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isListening
                    ? (language === 'hi' ? 'सुन रहा हूं...' : 
                       language === 'mr' ? 'ऐकत आहे...' : 
                       'Listening...')
                    : (language === 'hi' ? 'अपना सवाल लिखें...' : 
                       language === 'mr' ? 'तुमचा प्रश्न लिहा...' : 
                       'Type your question...')
                }
                className="pr-10"
                disabled={isTyping}
              />
              {inputText && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setInputText('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {/* Send Button */}
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="flex-shrink-0 bg-green-600 hover:bg-green-700"
            >
              {isTyping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Voice listening indicator */}
          {isListening && (
            <div className="flex items-center justify-center gap-2 mt-2 py-2 bg-red-50 rounded-lg">
              <div className="flex gap-0.5">
                <span className="w-1 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse delay-75" />
                <span className="w-1 h-2 bg-red-500 rounded-full animate-pulse delay-150" />
                <span className="w-1 h-5 bg-red-500 rounded-full animate-pulse delay-75" />
                <span className="w-1 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
              <span className="text-sm text-red-600 font-medium">
                {language === 'hi' ? 'बोलें...' : 
                 language === 'mr' ? 'बोला...' : 
                 'Speak...'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}

export default KisanChatbot;
