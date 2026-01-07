// Chatbot Module Exports
export { classifyIntent, detectLanguage, extractCrops } from './intentClassifier';
export type { Intent, DetectedLanguage, ClassificationResult } from './intentClassifier';

export { generateResponse } from './responseGenerator';

export {
  createNewSession,
  loadSession,
  saveSession,
  clearSession,
  addMessage,
  updateFarmContext,
  updateCropContext,
  updateProblemContext,
  parseFarmSize,
  hasFarmSize,
  getContextSummary
} from './conversationMemory';
export type { ConversationMemory, FarmContext, CropContext, ProblemContext } from './conversationMemory';

export {
  sendChatMessage,
  fetchWeather,
  fetchMandiPrices,
  detectDisease,
  formatWeatherForChat,
  formatMandiPricesForChat,
  formatDiseaseResultForChat,
  isAuthenticated,
  mockApi
} from './apiIntegration';
export type { WeatherData, MandiPrice, DiseaseDetectionResult, ChatApiResponse } from './apiIntegration';

// SIH Model Integration Exports
export {
  generateSIHModelResponse,
  parseMlModelResponse,
  getCurrentSeason,
  getFollowUpQuestion
} from './sihModelIntegration';
export type { SIHDiseaseLabel, SIHModelResult } from './sihModelIntegration';

export { kisanChatService } from './kisanChatService';
export type { ChatMessage, ChatServiceState } from './kisanChatService';
