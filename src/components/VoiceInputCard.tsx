import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
}

export function VoiceInputButton({ onTranscript, language = "hi-IN" }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = language;

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [language, onTranscript]);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  if (!isSupported) {
    return (
      <Alert>
        <AlertDescription>
          Voice input is not supported in your browser. Please use Chrome or Edge.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Button
      onClick={isListening ? stopListening : startListening}
      className={`${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
    >
      {isListening ? (
        <>
          <span className="animate-pulse mr-2">🎤</span>
          Listening...
        </>
      ) : (
        <>
          <span className="mr-2">🎤</span>
          Speak
        </>
      )}
    </Button>
  );
}

export default function VoiceInputCard() {
  const [transcript, setTranscript] = useState("");
  const [language, setLanguage] = useState("hi-IN");
  const [history, setHistory] = useState<string[]>([]);

  const handleTranscript = (text: string) => {
    setTranscript(text);
    setHistory([text, ...history].slice(0, 10)); // Keep last 10
  };

  const languageOptions = [
    { code: "hi-IN", name: "हिन्दी (Hindi)" },
    { code: "mr-IN", name: "मराठी (Marathi)" },
    { code: "en-IN", name: "English" },
    { code: "gu-IN", name: "ગુજરાતી (Gujarati)" },
    { code: "pa-IN", name: "ਪੰਜਾਬੀ (Punjabi)" },
    { code: "ta-IN", name: "தமிழ் (Tamil)" },
    { code: "te-IN", name: "తెలుగు (Telugu)" },
    { code: "kn-IN", name: "ಕನ್ನಡ (Kannada)" },
  ];

  return (
    <Card className="voice-input-card">
      <CardHeader>
        <CardTitle>🎤 Voice Input Support</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Language</label>
          <select 
            className="w-full p-2 border rounded"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languageOptions.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-center py-4">
          <VoiceInputButton onTranscript={handleTranscript} language={language} />
        </div>

        {transcript && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4">
              <h4 className="font-semibold text-sm mb-2">Latest Transcript:</h4>
              <p className="text-lg">{transcript}</p>
            </CardContent>
          </Card>
        )}

        <div>
          <h4 className="font-semibold text-sm mb-2">Voice Commands History</h4>
          {history.length === 0 ? (
            <p className="text-sm text-gray-500">No voice inputs yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.map((item, idx) => (
                <Card key={idx} className="bg-gray-50">
                  <CardContent className="pt-3 pb-3">
                    <p className="text-sm">{item}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Card className="bg-blue-50">
          <CardContent className="pt-3 text-sm">
            <h4 className="font-semibold mb-2">Tips for Better Voice Recognition:</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Speak clearly and at a moderate pace</li>
              <li>Use voice in a quiet environment</li>
              <li>Allow microphone access when prompted</li>
              <li>Works best with Chrome and Edge browsers</li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
