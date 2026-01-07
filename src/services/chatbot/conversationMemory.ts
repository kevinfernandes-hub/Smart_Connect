// Conversation Memory Context for KisanConnect Chatbot
// Maintains conversation state across messages

export interface FarmContext {
  state?: string;
  district?: string;
  farmSize?: {
    value: number;
    unit: 'acre' | 'hectare' | 'bigha' | 'guntha';
  };
  soilType?: string;
  irrigationType?: 'drip' | 'sprinkler' | 'flood' | 'canal' | 'rainfed' | 'borewell';
  farmingType?: 'organic' | 'chemical' | 'mixed';
}

export interface CropContext {
  currentCrop?: string;
  cropStage?: 'sowing' | 'vegetative' | 'flowering' | 'maturity' | 'harvest';
  season?: 'kharif' | 'rabi' | 'zaid';
  sowingDate?: Date;
  variety?: string;
}

export interface ProblemContext {
  activeProblem?: string;
  diseaseDetected?: string;
  diseaseConfidence?: number;
  pestDetected?: string;
  symptomDescription?: string;
  affectedArea?: number; // percentage
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  entities?: Record<string, string[]>;
}

export interface ConversationMemory {
  sessionId: string;
  userId?: string;
  startTime: Date;
  lastActivity: Date;
  language: 'en' | 'hi' | 'mr';
  farm: FarmContext;
  crop: CropContext;
  problem: ProblemContext;
  messages: ConversationMessage[];
  pendingQuestions: string[];
  awaitingInput?: 'farm_size' | 'crop_name' | 'location' | 'problem_details' | 'confirmation';
}

// Session duration in milliseconds (24 hours)
const SESSION_DURATION = 24 * 60 * 60 * 1000;

// Maximum messages to keep in memory for context
const MAX_CONTEXT_MESSAGES = 20;

// Storage key for localStorage
const STORAGE_KEY = 'kisanconnect_chat_session';

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `kc_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Create a new conversation memory instance
 */
export function createNewSession(language: 'en' | 'hi' | 'mr' = 'en', userId?: string): ConversationMemory {
  return {
    sessionId: generateSessionId(),
    userId,
    startTime: new Date(),
    lastActivity: new Date(),
    language,
    farm: {},
    crop: {},
    problem: {},
    messages: [],
    pendingQuestions: []
  };
}

/**
 * Load session from localStorage
 */
export function loadSession(): ConversationMemory | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const session: ConversationMemory = JSON.parse(stored);
    
    // Check if session is expired
    const lastActivity = new Date(session.lastActivity);
    if (Date.now() - lastActivity.getTime() > SESSION_DURATION) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
    // Convert date strings back to Date objects
    session.startTime = new Date(session.startTime);
    session.lastActivity = new Date(session.lastActivity);
    session.messages = session.messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
    
    if (session.crop.sowingDate) {
      session.crop.sowingDate = new Date(session.crop.sowingDate);
    }
    
    return session;
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
}

/**
 * Save session to localStorage
 */
export function saveSession(session: ConversationMemory): void {
  try {
    session.lastActivity = new Date();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

/**
 * Clear the current session
 */
export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Add a message to the conversation
 */
export function addMessage(
  session: ConversationMemory,
  role: 'user' | 'assistant',
  content: string,
  intent?: string,
  entities?: Record<string, string[]>
): ConversationMemory {
  const message: ConversationMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    role,
    content,
    timestamp: new Date(),
    intent,
    entities
  };
  
  const updatedMessages = [...session.messages, message];
  
  // Keep only last N messages for context
  const trimmedMessages = updatedMessages.slice(-MAX_CONTEXT_MESSAGES);
  
  return {
    ...session,
    messages: trimmedMessages,
    lastActivity: new Date()
  };
}

/**
 * Update farm context from extracted entities
 */
export function updateFarmContext(
  session: ConversationMemory,
  updates: Partial<FarmContext>
): ConversationMemory {
  return {
    ...session,
    farm: {
      ...session.farm,
      ...updates
    },
    lastActivity: new Date()
  };
}

/**
 * Update crop context from extracted entities
 */
export function updateCropContext(
  session: ConversationMemory,
  updates: Partial<CropContext>
): ConversationMemory {
  return {
    ...session,
    crop: {
      ...session.crop,
      ...updates
    },
    lastActivity: new Date()
  };
}

/**
 * Update problem context (e.g., from disease detection)
 */
export function updateProblemContext(
  session: ConversationMemory,
  updates: Partial<ProblemContext>
): ConversationMemory {
  return {
    ...session,
    problem: {
      ...session.problem,
      ...updates
    },
    lastActivity: new Date()
  };
}

/**
 * Set awaiting input state
 */
export function setAwaitingInput(
  session: ConversationMemory,
  inputType: ConversationMemory['awaitingInput']
): ConversationMemory {
  return {
    ...session,
    awaitingInput: inputType,
    lastActivity: new Date()
  };
}

/**
 * Clear awaiting input state
 */
export function clearAwaitingInput(session: ConversationMemory): ConversationMemory {
  return {
    ...session,
    awaitingInput: undefined,
    lastActivity: new Date()
  };
}

/**
 * Add a pending question to ask the user
 */
export function addPendingQuestion(
  session: ConversationMemory,
  question: string
): ConversationMemory {
  return {
    ...session,
    pendingQuestions: [...session.pendingQuestions, question],
    lastActivity: new Date()
  };
}

/**
 * Get and remove the next pending question
 */
export function popPendingQuestion(session: ConversationMemory): {
  session: ConversationMemory;
  question: string | null;
} {
  if (session.pendingQuestions.length === 0) {
    return { session, question: null };
  }
  
  const [question, ...remaining] = session.pendingQuestions;
  return {
    session: {
      ...session,
      pendingQuestions: remaining,
      lastActivity: new Date()
    },
    question
  };
}

/**
 * Get recent conversation context for response generation
 */
export function getRecentContext(session: ConversationMemory, count: number = 5): string {
  const recentMessages = session.messages.slice(-count);
  return recentMessages
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');
}

/**
 * Get a summary of the current context for debugging/display
 */
export function getContextSummary(session: ConversationMemory): string {
  const parts: string[] = [];
  
  if (session.farm.state) parts.push(`Location: ${session.farm.state}`);
  if (session.farm.farmSize) parts.push(`Farm: ${session.farm.farmSize.value} ${session.farm.farmSize.unit}`);
  if (session.farm.irrigationType) parts.push(`Irrigation: ${session.farm.irrigationType}`);
  if (session.farm.farmingType) parts.push(`Type: ${session.farm.farmingType}`);
  if (session.crop.currentCrop) parts.push(`Crop: ${session.crop.currentCrop}`);
  if (session.crop.season) parts.push(`Season: ${session.crop.season}`);
  if (session.crop.cropStage) parts.push(`Stage: ${session.crop.cropStage}`);
  if (session.problem.diseaseDetected) parts.push(`Disease: ${session.problem.diseaseDetected}`);
  
  return parts.join(' | ') || 'No context yet';
}

/**
 * Parse farm size from user input
 */
export function parseFarmSize(input: string): FarmContext['farmSize'] | null {
  const lowerInput = input.toLowerCase();
  
  // Match patterns like "5 acre", "2.5 hectare", "10 bigha", etc.
  const patterns = [
    { regex: /(\d+(?:\.\d+)?)\s*(?:acre|एकड़|ekad|akar)/i, unit: 'acre' as const },
    { regex: /(\d+(?:\.\d+)?)\s*(?:hectare|हेक्टेयर|hektar|hectar)/i, unit: 'hectare' as const },
    { regex: /(\d+(?:\.\d+)?)\s*(?:bigha|बीघा|beegha)/i, unit: 'bigha' as const },
    { regex: /(\d+(?:\.\d+)?)\s*(?:guntha|गुंठा|gunta)/i, unit: 'guntha' as const },
  ];
  
  for (const { regex, unit } of patterns) {
    const match = lowerInput.match(regex);
    if (match) {
      return {
        value: parseFloat(match[1]),
        unit
      };
    }
  }
  
  // Try just a number (default to acre)
  const numberMatch = lowerInput.match(/^(\d+(?:\.\d+)?)\s*$/);
  if (numberMatch) {
    return {
      value: parseFloat(numberMatch[1]),
      unit: 'acre'
    };
  }
  
  return null;
}

/**
 * Check if farm size is known
 */
export function hasFarmSize(session: ConversationMemory): boolean {
  return session.farm.farmSize !== undefined;
}

/**
 * Convert farm size to hectares for standardized calculations
 */
export function getFarmSizeInHectares(farmSize: FarmContext['farmSize']): number | null {
  if (!farmSize) return null;
  
  const conversions: Record<string, number> = {
    acre: 0.4047,
    hectare: 1,
    bigha: 0.25, // Varies by region, using common value
    guntha: 0.01012,
  };
  
  return farmSize.value * (conversions[farmSize.unit] || 1);
}

export default {
  createNewSession,
  loadSession,
  saveSession,
  clearSession,
  addMessage,
  updateFarmContext,
  updateCropContext,
  updateProblemContext,
  setAwaitingInput,
  clearAwaitingInput,
  addPendingQuestion,
  popPendingQuestion,
  getRecentContext,
  getContextSummary,
  parseFarmSize,
  hasFarmSize,
  getFarmSizeInHectares
};
