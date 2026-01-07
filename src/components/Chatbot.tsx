import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Send, Bot, User, Lightbulb, HelpCircle, Loader2, Mic, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { VoiceChatbot } from "./VoiceChatbot";
import { useLanguage } from "../contexts/LanguageContext";
import { enhancedChatService } from "../services/chatServiceEnhanced";
import { toast } from "sonner@2.0.3";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'suggestion' | 'normal';
}

export function Chatbot() {
  const { t, language } = useLanguage();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('botGreeting'),
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    t('quickQuestion1'),
    t('quickQuestion2'),
    t('quickQuestion3'),
    t('quickQuestion4'),
    t('quickQuestion5'),
    t('quickQuestion6')
  ];

  // Update initial message when language changes
  useEffect(() => {
    setMessages([{
      id: '1',
      text: t('botGreeting'),
      sender: 'bot',
      timestamp: new Date(),
    }]);
  }, [language, t]);

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    try {
      // Use the enhanced chat service with comprehensive farming knowledge
      const response = await enhancedChatService.sendMessage(userMessage, language);
      return response;
    } catch (error) {
      console.error('Chat service error:', error);
      
      // Fallback to local responses if backend fails
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('गेहूं') || lowerMessage.includes('wheat')) {
        return t('wheatResponse');
      }
      
      if (lowerMessage.includes('मिट्टी') || lowerMessage.includes('soil')) {
        return t('soilResponse');
      }
      
      if (lowerMessage.includes('कीड़े') || lowerMessage.includes('बीमारी') || lowerMessage.includes('disease') || lowerMessage.includes('pest')) {
        return t('pestResponse');
      }
      
      if (lowerMessage.includes('भाव') || lowerMessage.includes('बाजार') || lowerMessage.includes('price') || lowerMessage.includes('market')) {
        return t('priceResponse');
      }
      
      if (lowerMessage.includes('जैविक') || lowerMessage.includes('खाद') || lowerMessage.includes('organic') || lowerMessage.includes('fertilizer')) {
        return t('organicResponse');
      }
      
      if (lowerMessage.includes('बारिश') || lowerMessage.includes('बाढ़') || lowerMessage.includes('rain') || lowerMessage.includes('flood')) {
        return t('rainResponse');
      }
      
      if (lowerMessage.includes('मौसम') || lowerMessage.includes('weather') || lowerMessage.includes('temperature') || lowerMessage.includes('climate')) {
        return "🌤️ **Weather Information:**\n\n📍 **Current Conditions**: Check the weather widget on your dashboard for real-time data\n🌡️ **Temperature**: Affects crop growth rate and water requirements\n💧 **Humidity**: High humidity increases disease risk\n🌬️ **Wind**: Strong winds can damage crops\n☔ **Rainfall**: Monitor for irrigation planning\n\n💡 **Weather-Based Farming Tips:**\n• High humidity (&gt;80%) = Monitor for fungal diseases\n• Temperature &gt;35°C = Increase irrigation frequency\n• Strong winds = Provide crop support\n• Good rainfall forecast = Adjust fertilizer timing\n\nUse our weather section for detailed forecasts and agricultural insights!";
      }

      // Default responses
      const defaultResponses = [
        t('defaultResponse1'),
        t('defaultResponse2'),
        t('defaultResponse3')
      ];
      
      return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const botResponseText = await generateBotResponse(text);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2>{t('aiAssistant')}</h2>
        <p className="text-muted-foreground">{t('askQuestions')}</p>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            {t('chat')}
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            {t('voiceAssistant')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="mt-6">
          <div className="space-y-6">
      {/* Quick Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            {t('quickQuestions')}
          </CardTitle>
          <CardDescription>{t('clickToAsk')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto py-3 px-3"
                onClick={() => handleQuickQuestion(question)}
              >
                <span className="text-xs line-clamp-2">{question}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              {t('chatWithKisanConnect')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="h-96 overflow-y-auto space-y-4 p-4 border rounded-lg bg-muted/20">
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
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-secondary text-secondary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white border rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('typeMessage')}
                className="flex-1"
              />
              <Button type="submit" disabled={!inputText.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {/* Tips */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="mb-1">💡 {t('tips')}</p>
                <ul className="space-y-1 text-xs">
                  <li>• {t('tipsCrop')}</li>
                  <li>• {t('tipsLocation')}</li>
                  <li>• {t('tipsSpecific')}</li>
                </ul>
              </div>
            </div>
        </CardContent>
      </Card>
        </div>
        </TabsContent>
        
        <TabsContent value="voice" className="mt-6">
          <div className="h-[600px] border rounded-lg overflow-hidden">
            <VoiceChatbot />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}