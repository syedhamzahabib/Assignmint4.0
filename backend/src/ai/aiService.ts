import OpenAI from 'openai';
import { db } from '../index';
import { logger } from '../utils/logger';
import { FieldValue } from 'firebase-admin/firestore';

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

export class AIService {
  private static instance: AIService;
  private openai: OpenAI;

  private constructor() {
    const apiKey = process.env['OPENAI_API_KEY'];
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required in environment variables');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Initialize a new chat session
  async createNewSession(userId: string): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const sessionData: Omit<ChatSession, 'id'> = {
      title: 'New Chat',
      subject: 'General',
      createdAt: new Date(),
      lastMessage: 'Session started',
      messageCount: 0,
      userId,
    };

    await db.collection('aiChats').doc(sessionId).set(sessionData);
    return sessionId;
  }

  // Load an existing chat session
  async loadSession(sessionId: string): Promise<AIMessage[]> {
    const messagesSnapshot = await db
      .collection('aiChats')
      .doc(sessionId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .get();

    return messagesSnapshot.docs.map(doc => ({
      ...doc.data(),
      timestamp: doc.data()['timestamp'].toDate(),
    })) as AIMessage[];
  }

  // Save message to current session
  async saveMessage(sessionId: string, message: AIMessage): Promise<void> {
    if (!sessionId) return;

    await db
      .collection('aiChats')
      .doc(sessionId)
      .collection('messages')
      .add({
        ...message,
        timestamp: new Date(),
      });

    // Update session metadata
    await db.collection('aiChats').doc(sessionId).update({
      lastMessage: message.text,
      messageCount: FieldValue.increment(1),
      subject: message.subject || 'General',
    });
  }

  // Enhanced subject detection using OpenAI
  async detectSubject(text: string): Promise<SubjectDetection> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert at categorizing academic questions and assignments. Analyze the given text and return a JSON response with:
            {
              "subject": "The main academic subject (e.g., Mathematics, Computer Science, English, Physics, Chemistry, Biology, History, Economics, Psychology)",
              "confidence": "Confidence score from 0.0 to 1.0",
              "topics": ["Array of 3-5 specific topics within the subject"],
              "keywords": ["Array of 5-10 relevant keywords from the text"]
            }
            
            Be precise and academic in your categorization.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.1,
        max_tokens: 200,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse JSON response
      const result = JSON.parse(content);
      return {
        subject: result.subject || 'General',
        confidence: result.confidence || 0.5,
        topics: result.topics || ['General Studies'],
        keywords: result.keywords || [],
      };
    } catch (error) {
      logger.error('Error detecting subject with OpenAI:', error);
      
      // Fallback to keyword-based detection
      return this.fallbackSubjectDetection(text);
    }
  }

  // Fallback subject detection using keywords
  private fallbackSubjectDetection(text: string): SubjectDetection {
    const lowerText = text.toLowerCase();
    const keywords = lowerText.split(' ').filter(word => word.length > 3);

    const subjectPatterns = {
      'Mathematics': {
        keywords: ['math', 'equation', 'algebra', 'calculus', 'derivative', 'integral', 'function', 'solve', 'formula', 'theorem', 'geometry', 'trigonometry', 'statistics', 'probability'],
        weight: 1.0,
      },
      'Computer Science': {
        keywords: ['code', 'programming', 'javascript', 'python', 'function', 'algorithm', 'data structure', 'database', 'api', 'web', 'app', 'software', 'debug', 'variable', 'loop'],
        weight: 1.0,
      },
      'English': {
        keywords: ['essay', 'write', 'paper', 'thesis', 'paragraph', 'argument', 'literature', 'poem', 'story', 'narrative', 'analysis', 'rhetoric', 'grammar', 'composition'],
        weight: 1.0,
      },
      'Physics': {
        keywords: ['physics', 'force', 'energy', 'motion', 'velocity', 'acceleration', 'gravity', 'wave', 'particle', 'quantum', 'mechanics', 'thermodynamics', 'electromagnetism'],
        weight: 1.0,
      },
      'Chemistry': {
        keywords: ['chemistry', 'molecule', 'reaction', 'element', 'compound', 'acid', 'base', 'organic', 'inorganic', 'stoichiometry', 'equilibrium', 'catalyst', 'solution'],
        weight: 1.0,
      },
      'Biology': {
        keywords: ['biology', 'cell', 'organism', 'evolution', 'dna', 'gene', 'protein', 'enzyme', 'ecosystem', 'species', 'photosynthesis', 'respiration', 'mitosis'],
        weight: 1.0,
      },
      'History': {
        keywords: ['history', 'war', 'civilization', 'ancient', 'period', 'empire', 'revolution', 'colonial', 'medieval', 'renaissance', 'industrial', 'world war'],
        weight: 1.0,
      },
      'Economics': {
        keywords: ['economics', 'market', 'supply', 'demand', 'price', 'inflation', 'gdp', 'trade', 'finance', 'investment', 'monetary', 'fiscal', 'policy'],
        weight: 0.9,
      },
      'Psychology': {
        keywords: ['psychology', 'behavior', 'mind', 'cognitive', 'therapy', 'mental', 'personality', 'social', 'developmental', 'clinical', 'neuroscience', 'consciousness'],
        weight: 0.9,
      },
    };

    let bestMatch = 'General';
    let bestScore = 0;

    for (const [subject, pattern] of Object.entries(subjectPatterns)) {
      let score = 0;
      for (const keyword of pattern.keywords) {
        if (lowerText.includes(keyword)) {
          score += pattern.weight;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = subject;
      }
    }

    return {
      subject: bestMatch,
      confidence: Math.min(bestScore / 3, 1.0),
      topics: [bestMatch],
      keywords: keywords.slice(0, 10),
    };
  }

  // Generate AI response using OpenAI
  async generateResponse(
    userInput: string,
    subject: string,
    explanationMode: boolean = true,
    conversationHistory: AIMessage[] = []
  ): Promise<string> {
    try {
      const systemPrompt = `You are an expert ${subject} tutor helping a student. Your role is to:

1. Break down complex problems into simple, understandable steps
2. Ask clarifying questions when the student's query is vague
3. Provide clear explanations with examples
4. Remember context from the conversation
5. Encourage critical thinking and problem-solving skills

${explanationMode ? 'Focus on explaining concepts clearly and step-by-step.' : 'Provide direct answers with brief explanations.'}

Be encouraging, patient, and educational. Use analogies when helpful.`;

      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.isUser ? 'user' as const : 'assistant' as const,
          content: msg.text
        })),
        { role: 'user' as const, content: userInput }
      ];

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 800,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return content;
    } catch (error) {
      logger.error('Error generating AI response:', error);
      return this.generateFallbackResponse(userInput, subject, explanationMode);
    }
  }

  // Fallback response when OpenAI fails
  private generateFallbackResponse(_userInput: string, subject: string, _explanationMode: boolean): string {
    return `I'm having trouble connecting to my AI service right now. However, I can see you're asking about ${subject}. 

Here are some general study tips:
• Break down complex problems into smaller parts
• Practice with examples
• Ask specific questions to clarify what you need help with
• Review related concepts you've already learned

Please try again in a moment, or feel free to rephrase your question more specifically.`;
  }

  // Process image with OCR (mock implementation)
  async processImage(_imageUri: string): Promise<OCRResult> {
    // TODO: Implement real OCR processing
    return {
      text: 'Sample text extracted from image',
      confidence: 0.85,
      language: 'en',
      subject: 'General',
    };
  }

  // Process document (mock implementation)
  async processDocument(_documentUri: string, _documentName: string): Promise<DocumentAnalysis> {
    // TODO: Implement real document processing
    return {
      content: 'Sample document content',
      subject: 'General',
      topics: ['General Studies'],
      summary: 'This is a sample document for testing purposes.',
      questions: ['What is the main topic?', 'How can I learn more?'],
    };
  }

  // Get user's chat sessions
  async getUserSessions(userId: string): Promise<ChatSession[]> {
    const sessionsSnapshot = await db
      .collection('aiChats')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return sessionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()['createdAt'].toDate(),
    })) as ChatSession[];
  }

  // Delete a chat session
  async deleteSession(sessionId: string): Promise<void> {
    // Delete all messages in the session
    const messagesSnapshot = await db
      .collection('aiChats')
      .doc(sessionId)
      .collection('messages')
      .get();

    const batch = db.batch();
    messagesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete the session document
    batch.delete(db.collection('aiChats').doc(sessionId));
    await batch.commit();
  }

  // Get conversation statistics
  getConversationStats(conversationHistory: AIMessage[]): {
    messageCount: number;
    averageLength: number;
    duration: number;
    subjects: string[];
  } {
    if (conversationHistory.length === 0) {
      return {
        messageCount: 0,
        averageLength: 0,
        duration: 0,
        subjects: [],
      };
    }

    const firstMessage = conversationHistory[0];
    const lastMessage = conversationHistory[conversationHistory.length - 1];

    if (!firstMessage || !lastMessage) {
      return {
        messageCount: conversationHistory.length,
        averageLength: 0,
        duration: 0,
        subjects: [],
      };
    }

    const duration = lastMessage.timestamp.getTime() - firstMessage.timestamp.getTime();
    const totalLength = conversationHistory.reduce((sum, msg) => sum + msg.text.length, 0);
    const averageLength = totalLength / conversationHistory.length;
    const subjects = [...new Set(conversationHistory.map(msg => msg.subject).filter(Boolean))];

    return {
      messageCount: conversationHistory.length,
      averageLength: Math.round(averageLength),
      duration: Math.round(duration / 1000), // Convert to seconds
      subjects: subjects as string[],
    };
  }
}

export default AIService;
