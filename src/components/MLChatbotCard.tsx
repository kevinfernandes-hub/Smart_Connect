import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { VoiceInputButton } from "./VoiceInputCard";

interface DiseaseTemplate {
  disease: string;
  crop: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  severity: "Low" | "Medium" | "High";
}

const diseaseTemplates: Record<string, DiseaseTemplate> = {
  "Leaf Blight": {
    disease: "Leaf Blight",
    crop: "Multiple crops",
    symptoms: ["Brown spots on leaves", "Wilting", "Yellowing of leaf margins"],
    treatment: ["Apply Mancozeb 75% WP @ 2g/liter", "Remove infected leaves", "Spray copper oxychloride"],
    prevention: ["Use disease-free seeds", "Maintain proper spacing", "Avoid overhead irrigation"],
    severity: "High"
  },
  "Powdery Mildew": {
    disease: "Powdery Mildew",
    crop: "Multiple crops",
    symptoms: ["White powdery coating on leaves", "Stunted growth", "Leaf curling"],
    treatment: ["Spray Sulfur 80% WP @ 2-3g/liter", "Apply wettable sulfur", "Use systemic fungicides"],
    prevention: ["Ensure good air circulation", "Avoid excess nitrogen", "Remove infected plant parts"],
    severity: "Medium"
  },
  "Bacterial Blight": {
    disease: "Bacterial Blight",
    crop: "Cotton, Rice",
    symptoms: ["Water-soaked lesions", "Angular leaf spots", "Bacterial ooze"],
    treatment: ["Spray Streptocycline @ 0.5g/liter", "Apply copper-based bactericides", "Remove infected plants"],
    prevention: ["Use certified seeds", "Crop rotation", "Avoid working in wet conditions"],
    severity: "High"
  },
  "Root Rot": {
    disease: "Root Rot",
    crop: "Multiple crops",
    symptoms: ["Wilting despite adequate water", "Discolored roots", "Stunted growth"],
    treatment: ["Improve drainage", "Apply Carbendazim @ 1g/liter", "Reduce watering"],
    prevention: ["Ensure proper drainage", "Avoid overwatering", "Use raised beds"],
    severity: "High"
  },
  "Fruit Borer": {
    disease: "Fruit Borer",
    crop: "Cotton, Tomato, Brinjal",
    symptoms: ["Holes in fruits", "Larvae visible", "Fruit drop"],
    treatment: ["Spray Chlorantraniliprole @ 0.4ml/liter", "Use pheromone traps", "Apply NPV"],
    prevention: ["Regular monitoring", "Remove damaged fruits", "Use light traps"],
    severity: "High"
  },
  "Aphids": {
    disease: "Aphids",
    crop: "Multiple crops",
    symptoms: ["Curled leaves", "Sticky honeydew", "Yellowing"],
    treatment: ["Spray Imidacloprid @ 0.5ml/liter", "Use neem oil", "Apply soap solution"],
    prevention: ["Encourage natural predators", "Use yellow sticky traps", "Maintain plant health"],
    severity: "Medium"
  }
};

interface ChatbotMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  template?: DiseaseTemplate;
}

export default function MLChatbotCard() {
  const [messages, setMessages] = useState<ChatbotMessage[]>([
    {
      id: "1",
      text: "नमस्ते! मैं आपकी फसल की समस्याओं में मदद करूंगा। / Hello! I'll help you with your crop problems.",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load messages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chatbotMessages");
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })));
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem("chatbotMessages", JSON.stringify(messages));
  }, [messages]);

  const detectDiseaseFromText = (text: string): string | null => {
    const lowerText = text.toLowerCase();
    
    // Check for disease keywords
    for (const [key, template] of Object.entries(diseaseTemplates)) {
      if (lowerText.includes(key.toLowerCase())) {
        return key;
      }
      // Check symptoms
      for (const symptom of template.symptoms) {
        if (lowerText.includes(symptom.toLowerCase())) {
          return key;
        }
      }
    }
    
    // Check for common Hindi/Marathi terms
    if (lowerText.includes("पत्ते") || lowerText.includes("पाने") || lowerText.includes("leaf")) {
      if (lowerText.includes("धब्बे") || lowerText.includes("डाग") || lowerText.includes("spot")) {
        return "Leaf Blight";
      }
      if (lowerText.includes("सफेद") || lowerText.includes("पांढरा") || lowerText.includes("white")) {
        return "Powdery Mildew";
      }
    }
    
    if (lowerText.includes("फल") || lowerText.includes("fruit") || lowerText.includes("बोंडा")) {
      return "Fruit Borer";
    }
    
    if (lowerText.includes("कीड़े") || lowerText.includes("किडा") || lowerText.includes("insect") || lowerText.includes("aphid")) {
      return "Aphids";
    }
    
    return null;
  };

  const generateBotResponse = (userText: string): { text: string; template?: DiseaseTemplate } => {
    const detectedDisease = detectDiseaseFromText(userText);
    
    if (detectedDisease && diseaseTemplates[detectedDisease]) {
      const template = diseaseTemplates[detectedDisease];
      const response = `मैंने पहचान लिया कि यह ${template.disease} हो सकता है। / I've identified this could be ${template.disease}.\n\nगंभीरता / Severity: ${template.severity}\n\nमैं आपको विस्तृत जानकारी नीचे दे रहा हूं। / I'm providing detailed information below.`;
      
      return { text: response, template };
    }
    
    // Generic responses based on keywords
    if (userText.toLowerCase().includes("मौसम") || userText.toLowerCase().includes("weather")) {
      return { text: "कृपया मौसम जानकारी के लिए मौसम विजेट देखें। / Please check the weather widget for forecast information." };
    }
    
    if (userText.toLowerCase().includes("कीमत") || userText.toLowerCase().includes("price") || userText.toLowerCase().includes("भाव")) {
      return { text: "बाजार की कीमतों के लिए मार्केट एनालिसिस सेक्शन देखें। / Check the Market Analysis section for current prices." };
    }
    
    if (userText.toLowerCase().includes("बीमारी") || userText.toLowerCase().includes("disease") || userText.toLowerCase().includes("रोग")) {
      return { text: "कृपया बीमारी के लक्षण बताएं जैसे: पत्तों पर धब्बे, पीलापन, मुरझाना आदि। / Please describe disease symptoms like: spots on leaves, yellowing, wilting, etc." };
    }
    
    return { text: "मैं आपकी मदद के लिए यहां हूं। कृपया अपनी फसल की समस्या विस्तार से बताएं। / I'm here to help. Please describe your crop problem in detail." };
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: ChatbotMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const { text, template } = generateBotResponse(input);
      
      const botMessage: ChatbotMessage = {
        id: (Date.now() + 1).toString(),
        text,
        sender: "bot",
        timestamp: new Date(),
        template
      };
      
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript);
  };

  const loadTemplate = (diseaseKey: string) => {
    const template = diseaseTemplates[diseaseKey];
    if (template) {
      const text = `मुझे ${template.disease} के बारे में जानकारी चाहिए / Tell me about ${template.disease}`;
      setInput(text);
      handleSend();
    }
  };

  return (
    <Card className="ml-chatbot-card">
      <CardHeader>
        <CardTitle>🤖 AI Chatbot with Disease Detection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Disease Templates */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Quick Disease Templates:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.keys(diseaseTemplates).map(key => (
              <Button
                key={key}
                size="sm"
                variant="outline"
                onClick={() => loadTemplate(key)}
                className="text-xs"
              >
                {key}
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-gray-50 space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white border'} rounded-lg p-3 shadow`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                {msg.template && (
                  <Card className="mt-3 bg-yellow-50 border-yellow-200">
                    <CardContent className="pt-3 space-y-2">
                      <div>
                        <h5 className="font-semibold text-xs mb-1">लक्षण / Symptoms:</h5>
                        <ul className="text-xs space-y-1">
                          {msg.template.symptoms.map((s, i) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-xs mb-1">उपचार / Treatment:</h5>
                        <ul className="text-xs space-y-1">
                          {msg.template.treatment.map((t, i) => (
                            <li key={i}>• {t}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-xs mb-1">बचाव / Prevention:</h5>
                        <ul className="text-xs space-y-1">
                          {msg.template.prevention.map((p, i) => (
                            <li key={i}>• {p}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <p className="text-xs mt-1 opacity-70">{msg.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-lg p-3">
                <p className="text-sm animate-pulse">Typing...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="अपनी समस्या बताएं / Describe your problem..."
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <div className="flex flex-col gap-2">
              <VoiceInputButton onTranscript={handleVoiceTranscript} language="hi-IN" />
              <Button onClick={handleSend} disabled={!input.trim() || loading}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
