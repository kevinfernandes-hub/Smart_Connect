// KisanConnect Chatbot Service - SIH Edition
// Main service orchestrating intent classification, response generation, and context management
// Specialized for Vidarbha region with SIH ML model integration

import { classifyIntent, ClassificationResult, DetectedLanguage } from './intentClassifier';
import { generateResponse } from './responseGenerator';
import {
  ConversationMemory,
  createNewSession,
  loadSession,
  saveSession,
  addMessage,
  updateFarmContext,
  updateCropContext,
  updateProblemContext,
  setAwaitingInput,
  clearAwaitingInput,
  parseFarmSize,
  hasFarmSize,
  getContextSummary
} from './conversationMemory';
import {
  fetchWeather,
  fetchMandiPrices,
  formatWeatherForChat,
  formatMandiPricesForChat,
  formatDiseaseResultForChat,
  DiseaseDetectionResult,
  mockApi
} from './apiIntegration';
import {
  generateSIHModelResponse,
  parseMlModelResponse,
  SIHDiseaseLabel,
  SIHModelResult
} from './sihModelIntegration';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  intent?: string;
  isLoading?: boolean;
  isError?: boolean;
}

export interface ChatServiceState {
  session: ConversationMemory;
  isProcessing: boolean;
  lastError?: string;
}

// Use offline mode for demo (no backend required)
const USE_OFFLINE_MODE = true;

class KisanChatService {
  private session: ConversationMemory;
  private isProcessing: boolean = false;
  
  constructor() {
    // Try to load existing session or create new one
    const existingSession = loadSession();
    this.session = existingSession || createNewSession('en');
  }
  
  /**
   * Get current session
   */
  getSession(): ConversationMemory {
    return this.session;
  }
  
  /**
   * Get session context summary
   */
  getContextSummary(): string {
    return getContextSummary(this.session);
  }
  
  /**
   * Set language for the session
   */
  setLanguage(lang: DetectedLanguage): void {
    this.session = {
      ...this.session,
      language: lang
    };
    saveSession(this.session);
  }
  
  /**
   * Clear session and start fresh
   */
  resetSession(): void {
    this.session = createNewSession(this.session.language);
    saveSession(this.session);
  }
  
  /**
   * Process user message and generate response
   */
  async processMessage(userMessage: string): Promise<{
    response: string;
    intent: string;
    language: DetectedLanguage;
    requiresAction?: 'weather' | 'market' | 'disease';
  }> {
    this.isProcessing = true;
    
    try {
      // Classify the intent
      const classification = classifyIntent(userMessage);
      
      // Update session language based on detected language
      if (classification.language !== this.session.language) {
        this.session = {
          ...this.session,
          language: classification.language
        };
      }
      
      // Check if we were awaiting specific input
      if (this.session.awaitingInput) {
        const handledResponse = await this.handleAwaitedInput(userMessage, classification);
        if (handledResponse) {
          return handledResponse;
        }
      }
      
      // Update context from extracted entities
      if (classification.entities.crops.length > 0) {
        this.session = updateCropContext(this.session, {
          currentCrop: classification.entities.crops[0]
        });
      }
      
      if (classification.entities.seasons.length > 0) {
        this.session = updateCropContext(this.session, {
          season: classification.entities.seasons[0] as 'kharif' | 'rabi' | 'zaid'
        });
      }
      
      if (classification.entities.states.length > 0) {
        this.session = updateFarmContext(this.session, {
          state: classification.entities.states[0]
        });
      }
      
      // Check if farm size is needed for chemical queries
      if (classification.requiresFarmSize && !hasFarmSize(this.session)) {
        this.session = setAwaitingInput(this.session, 'farm_size');
      }
      
      // Generate response
      const { response, followUp } = generateResponse(classification, this.session);
      
      // Combine response with follow-up question
      let fullResponse = response;
      if (followUp && classification.intent !== 'unknown') {
        fullResponse += `\n\n❓ ${followUp}`;
      }
      
      // Check for tool calls (weather, market prices)
      let requiresAction: 'weather' | 'market' | 'disease' | undefined;
      
      if (classification.intent === 'weather_advice' && this.session.farm.state) {
        requiresAction = 'weather';
        // Add weather data to response
        const weatherData = await this.fetchWeatherData(this.session.farm.state);
        if (weatherData) {
          fullResponse += `\n\n${weatherData}`;
        }
      }
      
      if (classification.intent === 'market_sell_advice' && classification.entities.crops.length > 0) {
        requiresAction = 'market';
        // Add market prices to response
        const priceData = await this.fetchMarketPrices(classification.entities.crops[0]);
        if (priceData) {
          fullResponse += `\n\n${priceData}`;
        }
      }
      
      // Add messages to session
      this.session = addMessage(this.session, 'user', userMessage, classification.intent, {
        crops: classification.entities.crops,
        seasons: classification.entities.seasons
      });
      this.session = addMessage(this.session, 'assistant', fullResponse);
      
      // Save session
      saveSession(this.session);
      
      return {
        response: fullResponse,
        intent: classification.intent,
        language: classification.language,
        requiresAction
      };
    } finally {
      this.isProcessing = false;
    }
  }
  
  /**
   * Handle input when we're awaiting specific information
   */
  private async handleAwaitedInput(
    userMessage: string,
    classification: ClassificationResult
  ): Promise<{ response: string; intent: string; language: DetectedLanguage } | null> {
    const lang = classification.language;
    
    if (this.session.awaitingInput === 'farm_size') {
      const farmSize = parseFarmSize(userMessage);
      
      if (farmSize) {
        this.session = updateFarmContext(this.session, { farmSize });
        this.session = clearAwaitingInput(this.session);
        
        // Now regenerate fertilizer response with farm size
        const { response, followUp } = generateResponse(
          { ...classification, intent: 'fertilizer_help' },
          this.session
        );
        
        let fullResponse = lang === 'hi'
          ? `✅ समझ गया - ${farmSize.value} ${farmSize.unit}\n\n${response}`
          : lang === 'mr'
          ? `✅ समजले - ${farmSize.value} ${farmSize.unit}\n\n${response}`
          : `✅ Got it - ${farmSize.value} ${farmSize.unit}\n\n${response}`;
        
        if (followUp) {
          fullResponse += `\n\n❓ ${followUp}`;
        }
        
        this.session = addMessage(this.session, 'user', userMessage);
        this.session = addMessage(this.session, 'assistant', fullResponse);
        saveSession(this.session);
        
        return {
          response: fullResponse,
          intent: 'fertilizer_help',
          language: lang
        };
      }
    }
    
    return null;
  }
  
  /**
   * Fetch weather data
   */
  private async fetchWeatherData(location: string): Promise<string | null> {
    try {
      if (USE_OFFLINE_MODE) {
        const weather = mockApi.weather();
        return formatWeatherForChat(weather, this.session.language);
      }
      
      const { data, error } = await fetchWeather(location);
      if (error || !data) {
        console.error('Weather fetch error:', error);
        return null;
      }
      
      return formatWeatherForChat(data, this.session.language);
    } catch (error) {
      console.error('Weather fetch error:', error);
      return null;
    }
  }
  
  /**
   * Fetch market prices
   */
  private async fetchMarketPrices(commodity: string): Promise<string | null> {
    try {
      if (USE_OFFLINE_MODE) {
        const prices = mockApi.mandiPrices(commodity);
        return formatMandiPricesForChat(prices, this.session.language);
      }
      
      const { data, error } = await fetchMandiPrices(commodity, this.session.farm.state);
      if (error || !data) {
        console.error('Market prices fetch error:', error);
        return null;
      }
      
      return formatMandiPricesForChat(data, this.session.language);
    } catch (error) {
      console.error('Market prices fetch error:', error);
      return null;
    }
  }
  
  /**
   * Handle disease detection result and continue chat from it
   * Integrated with SIH ML Model labels: Nitrogen_Deficiency, Aphid_Attack, Fungal_Spot, Healthy
   */
  processDiseaseDetection(result: DiseaseDetectionResult): {
    response: string;
    language: DetectedLanguage;
    sihLabel?: SIHDiseaseLabel;
  } {
    // Parse the ML model response to get SIH label
    const sihResult = parseMlModelResponse(result.disease, result.confidence);
    
    // Update problem context with disease detection result
    this.session = updateProblemContext(this.session, {
      diseaseDetected: sihResult.label,
      diseaseConfidence: sihResult.confidence
    });
    
    // Get farm size if available
    const farmSize = this.session.farm.farmSize;
    
    // Generate SIH-specific response
    const sihResponse = generateSIHModelResponse(
      sihResult,
      this.session.language,
      farmSize
    );
    
    // Add to messages
    this.session = addMessage(this.session, 'assistant', sihResponse, 'disease_help');
    saveSession(this.session);
    
    return {
      response: sihResponse,
      language: this.session.language,
      sihLabel: sihResult.label
    };
  }
  
  /**
   * Process SIH ML model result directly (for API integration)
   */
  processSIHModelResult(
    mlLabel: string,
    confidence: number
  ): {
    response: string;
    language: DetectedLanguage;
    sihLabel: SIHDiseaseLabel;
  } {
    const sihResult = parseMlModelResponse(mlLabel, confidence);
    
    // Update problem context
    this.session = updateProblemContext(this.session, {
      diseaseDetected: sihResult.label,
      diseaseConfidence: sihResult.confidence
    });
    
    const farmSize = this.session.farm.farmSize;
    
    const response = generateSIHModelResponse(
      sihResult,
      this.session.language,
      farmSize
    );
    
    this.session = addMessage(this.session, 'assistant', response, 'disease_help');
    saveSession(this.session);
    
    return {
      response,
      language: this.session.language,
      sihLabel: sihResult.label
    };
  }
  
  /**
   * Get processing status
   */
  isMessageProcessing(): boolean {
    return this.isProcessing;
  }
}

// Export singleton instance
export const kisanChatService = new KisanChatService();

export default kisanChatService;
