import { auth } from '../lib/firebase';

export interface AIMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  subject?: string;
  attachments?: Array<{
    type: 'image' | 'pdf' | 'document';
    uri: string;
    name: string;
  }>;
}

export interface ChatSession {
  id: string;
  title: string;
  subject: string;
  createdAt: Date;
  lastMessage: string;
  messageCount: number;
  userId: string;
}

export interface SubjectDetection {
  subject: string;
  confidence: number;
  topics: string[];
  keywords: string[];
}

export interface OCRResult {
  text: string;
  confidence: number;
  language: string;
  subject?: string;
}

export interface DocumentAnalysis {
  content: string;
  subject: string;
  topics: string[];
  summary: string;
  questions: string[];
}

export interface ChatResponse {
  success: boolean;
  userMessage: AIMessage;
  aiMessage: AIMessage;
  subjectDetection: SubjectDetection;
  sessionId?: string;
}

export interface SessionResponse {
  success: boolean;
  sessionId: string;
  message: string;
}

export interface SessionsResponse {
  success: boolean;
  sessions: ChatSession[];
}

export interface MessagesResponse {
  success: boolean;
  messages: AIMessage[];
}

export interface HealthResponse {
  success: boolean;
  status: string;
  openai: string;
  timestamp: string;
  error?: string;
}

class AIApiService {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    // Use environment variable or default to localhost for development
    this.baseUrl = 'http://localhost:3000'; // In React Native, use direct URL
  }

  private async getAuthToken(): Promise<string> {
    if (this.authToken) {
      return this.authToken;
    }

    const user = auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    this.authToken = await user.getIdToken();
    return this.authToken;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.baseUrl}/ai${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Create a new chat session
  async createNewSession(): Promise<string> {
    const response: SessionResponse = await this.makeRequest('/sessions', {
      method: 'POST',
    });

    if (!response.success) {
      throw new Error('Failed to create session');
    }

    return response.sessionId;
  }

  // Get user's chat sessions
  async getUserSessions(): Promise<ChatSession[]> {
    const response: SessionsResponse = await this.makeRequest('/sessions');
    
    if (!response.success) {
      throw new Error('Failed to load sessions');
    }

    return response.sessions.map(session => ({
      ...session,
      createdAt: new Date(session.createdAt),
    }));
  }

  // Load a specific chat session
  async loadSession(sessionId: string): Promise<AIMessage[]> {
    const response: MessagesResponse = await this.makeRequest(`/sessions/${sessionId}`);
    
    if (!response.success) {
      throw new Error('Failed to load session');
    }

    return response.messages.map(message => ({
      ...message,
      timestamp: new Date(message.timestamp),
    }));
  }

  // Delete a chat session
  async deleteSession(sessionId: string): Promise<void> {
    await this.makeRequest(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  // Send a message and get AI response
  async sendMessage(
    message: string,
    sessionId?: string,
    explanationMode: boolean = true
  ): Promise<ChatResponse> {
    const response: ChatResponse = await this.makeRequest('/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        sessionId,
        explanationMode,
      }),
    });

    if (!response.success) {
      throw new Error('Failed to send message');
    }

    // Convert timestamp strings to Date objects
    return {
      ...response,
      userMessage: {
        ...response.userMessage,
        timestamp: new Date(response.userMessage.timestamp),
      },
      aiMessage: {
        ...response.aiMessage,
        timestamp: new Date(response.aiMessage.timestamp),
      },
    };
  }

  // Process image with OCR
  async processImage(imageUri: string, sessionId?: string): Promise<{
    ocrResult: OCRResult;
    aiMessage: AIMessage;
  }> {
    const response = await this.makeRequest('/process-image', {
      method: 'POST',
      body: JSON.stringify({
        imageUri,
        sessionId,
      }),
    });

    const typedResponse = response as any;
    if (!typedResponse.success) {
      throw new Error('Failed to process image');
    }

    return {
      ocrResult: typedResponse.ocrResult,
      aiMessage: {
        ...typedResponse.aiMessage,
        timestamp: new Date(typedResponse.aiMessage.timestamp),
      },
    };
  }

  // Process document
  async processDocument(
    documentUri: string,
    documentName: string,
    sessionId?: string
  ): Promise<{
    documentAnalysis: DocumentAnalysis;
    aiMessage: AIMessage;
  }> {
    const response = await this.makeRequest('/process-document', {
      method: 'POST',
      body: JSON.stringify({
        documentUri,
        documentName,
        sessionId,
      }),
    });

    const typedResponse = response as any;
    if (!typedResponse.success) {
      throw new Error('Failed to process document');
    }

    return {
      documentAnalysis: typedResponse.documentAnalysis,
      aiMessage: {
        ...typedResponse.aiMessage,
        timestamp: new Date(typedResponse.aiMessage.timestamp),
      },
    };
  }

  // Detect subject from text
  async detectSubject(text: string): Promise<SubjectDetection> {
    const response = await this.makeRequest('/detect-subject', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });

    const typedResponse = response as any;
    if (!typedResponse.success) {
      throw new Error('Failed to detect subject');
    }

    return typedResponse.subjectDetection;
  }

  // Check AI service health
  async checkHealth(): Promise<HealthResponse> {
    return await this.makeRequest('/health');
  }

  // Test connection to backend
  async testConnection(): Promise<boolean> {
    try {
      const health = await this.checkHealth();
      return health.success && health.openai === 'connected';
    } catch (error) {
      console.error('AI service connection test failed:', error);
      return false;
    }
  }
}

export default AIApiService;
