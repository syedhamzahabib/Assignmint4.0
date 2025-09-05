import { Alert } from 'react-native';

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
  userId?: string;
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
  private conversationHistory: AIMessage[] = [];
  private currentSessionId: string | null = null;

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Initialize a new chat session
  async createNewSession(userId?: string): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.currentSessionId = sessionId;
    this.conversationHistory = [];

    // TODO: Save to Firebase
    // await firebase.firestore().collection('aiChats').doc(sessionId).set({
    //   userId,
    //   createdAt: new Date(),
    //   subject: 'General',
    //   messageCount: 0,
    //   title: 'New Chat'
    // });

    return sessionId;
  }

  // Load an existing chat session
  async loadSession(sessionId: string): Promise<AIMessage[]> {
    this.currentSessionId = sessionId;

    // TODO: Load from Firebase
    // const sessionDoc = await firebase.firestore().collection('aiChats').doc(sessionId).get();
    // const messages = await firebase.firestore().collection('aiChats').doc(sessionId).collection('messages').get();

    // For now, return mock data
    return this.conversationHistory;
  }

  // Save message to current session
  async saveMessage(message: AIMessage): Promise<void> {
    this.conversationHistory.push(message);

    // Keep only last 50 messages for context
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-50);
    }

    // TODO: Save to Firebase
    // if (this.currentSessionId) {
    //   await firebase.firestore()
    //     .collection('aiChats')
    //     .doc(this.currentSessionId)
    //     .collection('messages')
    //     .add({
    //       ...message,
    //       timestamp: firebase.firestore.FieldValue.serverTimestamp()
    //   });
    // }
  }

  // Enhanced subject detection with confidence scoring
  async detectSubject(text: string): Promise<SubjectDetection> {
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
        keywords: ['psychology', 'behavior', 'cognitive', 'memory', 'learning', 'personality', 'therapy', 'mental', 'brain', 'neuron', 'consciousness', 'development'],
        weight: 0.9,
      },
    };

    let bestMatch = { subject: 'General', confidence: 0.3, topics: ['General Studies'], keywords: [] as string[] };

    for (const [subject, pattern] of Object.entries(subjectPatterns)) {
      const matches = keywords.filter(keyword =>
        pattern.keywords.some(patternKeyword => keyword.includes(patternKeyword))
      );

      const confidence = (matches.length / keywords.length) * pattern.weight;

      if (confidence > bestMatch.confidence) {
        bestMatch = {
          subject,
          confidence: Math.min(confidence, 1.0),
          topics: this.getTopicsForSubject(subject),
          keywords: matches,
        };
      }
    }

    return bestMatch;
  }

  private getTopicsForSubject(subject: string): string[] {
    const topicMap = {
      'Mathematics': ['Algebra', 'Calculus', 'Geometry', 'Statistics', 'Trigonometry'],
      'Computer Science': ['Programming', 'Algorithms', 'Web Development', 'Data Structures', 'Software Engineering'],
      'English': ['Writing', 'Literature', 'Composition', 'Rhetoric', 'Grammar'],
      'Physics': ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Quantum Physics', 'Waves'],
      'Chemistry': ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry', 'Analytical Chemistry'],
      'Biology': ['Cell Biology', 'Genetics', 'Ecology', 'Evolution', 'Anatomy'],
      'History': ['Ancient History', 'Medieval History', 'Modern History', 'World History', 'American History'],
      'Economics': ['Microeconomics', 'Macroeconomics', 'International Trade', 'Finance', 'Development'],
      'Psychology': ['Cognitive Psychology', 'Social Psychology', 'Developmental Psychology', 'Clinical Psychology', 'Neuroscience'],
    };

    return topicMap[subject as keyof typeof topicMap] || ['General Studies'];
  }

  // Generate contextual AI response
  async generateResponse(userInput: string, subject: string, explanationMode: boolean = true): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const context = this.getContext();
    const responseTemplates = this.getResponseTemplates(subject, explanationMode);

    // Select response based on context and subject
    const selectedResponse = this.selectBestResponse(userInput, responseTemplates, context);

    return selectedResponse;
  }

  private getResponseTemplates(subject: string, explanationMode: boolean) {
    const baseResponses = {
      'Mathematics': {
        explanation: [
          `I can help you with this ${subject.toLowerCase()} problem! Let me break it down step by step:\n\n1. **Identify the problem type**\n2. **Apply relevant formulas**\n3. **Solve systematically**\n4. **Verify your answer**\n\nWhat specific ${subject.toLowerCase()} concept are you working with?`,
          `Great ${subject.toLowerCase()} question! I'll help you understand the underlying principles and walk through the solution process.\n\nWould you like me to explain the theory first, or jump straight into solving?`,
        ],
        direct: [
          `Here's the solution to your ${subject.toLowerCase()} problem:\n\n[Solution steps would go here]\n\nThe answer is [result].`,
          `For this ${subject.toLowerCase()} problem, you need to [approach]. The solution is [result].`,
        ],
      },
      'Computer Science': {
        explanation: [
          `I can help you with your ${subject.toLowerCase()} problem! Let me analyze what you're trying to achieve.\n\n**What I can help with:**\n• Code review and debugging\n• Algorithm explanations\n• Best practices\n• Problem-solving approaches\n\nWhat programming language are you using?`,
          `Excellent ${subject.toLowerCase()} question! I'll help you understand the concepts and provide a clear solution.\n\nWould you like me to explain the logic first, or show you the code?`,
        ],
        direct: [
          'Here\'s the code solution:\n\n```javascript\n// Code would go here\n```\n\nThis approach [explanation].',
          'The solution involves [approach]. Here\'s the implementation: [code].',
        ],
      },
      'English': {
        explanation: [
          `I can help you with your ${subject.toLowerCase()} assignment! Let me guide you through the writing process:\n\n**Writing Framework:**\n1. **Planning** - Outline your ideas\n2. **Structure** - Organize your argument\n3. **Drafting** - Write with clarity\n4. **Revision** - Polish and refine\n\nWhat type of writing are you working on?`,
          `Great ${subject.toLowerCase()} question! I'll help you develop your ideas and craft a strong piece of writing.\n\nWould you like help with brainstorming, structure, or specific writing techniques?`,
        ],
        direct: [
          `Here's a structured approach to your ${subject.toLowerCase()} assignment:\n\n**Introduction:** [guidance]\n**Body:** [guidance]\n**Conclusion:** [guidance]`,
          `For this ${subject.toLowerCase()} assignment, focus on [key points]. Here's a suggested structure: [outline].`,
        ],
      },
    };

    const subjectResponses = baseResponses[subject as keyof typeof baseResponses] || baseResponses.English;
    return explanationMode ? subjectResponses.explanation : subjectResponses.direct;
  }

  private selectBestResponse(userInput: string, templates: string[], context: string): string {
    // Simple selection logic - in real implementation, this would use more sophisticated NLP
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('help') || lowerInput.includes('explain') || lowerInput.includes('how')) {
      return templates[0]; // More explanatory response
    } else if (lowerInput.includes('solve') || lowerInput.includes('answer') || lowerInput.includes('what is')) {
      return templates[1]; // More direct response
    }

    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Mock OCR processing
  async processImage(imageUri: string): Promise<OCRResult> {
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock extracted text based on common assignment types
    const mockTexts = [
      'Solve for x: 2x + 5 = 13',
      'Write an essay about climate change and its impact on global ecosystems',
      'Create a JavaScript function to sort an array of numbers in ascending order',
      'Explain the process of photosynthesis and its importance to plant life',
      'Calculate the derivative of f(x) = x² + 3x + 1 with respect to x',
      'Analyze the causes and effects of the Industrial Revolution in Europe',
      'Write a Python program to find the factorial of a given number',
      'Describe the structure and function of DNA in genetic inheritance',
    ];

    const selectedText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
    const subjectDetection = await this.detectSubject(selectedText);

    return {
      text: selectedText,
      confidence: 0.95,
      language: 'en',
      subject: subjectDetection.subject,
    };
  }

  // Mock PDF processing
  async processDocument(documentUri: string, documentName: string): Promise<DocumentAnalysis> {
    // Simulate document processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockContent = 'This document contains information about the assignment requirements and guidelines. It includes detailed instructions on formatting, content expectations, and evaluation criteria.';

    const subjectDetection = await this.detectSubject(mockContent);

    return {
      content: mockContent,
      subject: subjectDetection.subject,
      topics: subjectDetection.topics,
      summary: 'Document contains assignment guidelines and requirements for academic work.',
      questions: [
        'What are the main requirements?',
        'How should this be formatted?',
        'What is the expected length?',
        'What are the evaluation criteria?',
      ],
    };
  }

  // Get conversation context for AI
  getContext(): string {
    return this.conversationHistory
      .slice(-10) // Last 10 messages for context
      .map(msg => `${msg.isUser ? 'User' : 'AI'}: ${msg.text}`)
      .join('\n');
  }

  // Get user's chat sessions
  async getUserSessions(userId: string): Promise<ChatSession[]> {
    // TODO: Load from Firebase
    // const sessions = await firebase.firestore()
    //   .collection('aiChats')
    //   .where('userId', '==', userId)
    //   .orderBy('createdAt', 'desc')
    //   .get();

    // Mock data for now
    return [
      {
        id: '1',
        title: 'Math Help - Calculus',
        subject: 'Mathematics',
        createdAt: new Date(Date.now() - 86400000),
        lastMessage: 'Can you explain derivatives?',
        messageCount: 15,
        userId,
      },
      {
        id: '2',
        title: 'Essay Writing',
        subject: 'English',
        createdAt: new Date(Date.now() - 172800000),
        lastMessage: 'How do I structure my thesis?',
        messageCount: 8,
        userId,
      },
      {
        id: '3',
        title: 'JavaScript Programming',
        subject: 'Computer Science',
        createdAt: new Date(Date.now() - 259200000),
        lastMessage: 'How do I use async/await?',
        messageCount: 12,
        userId,
      },
    ];
  }

  // Delete a chat session
  async deleteSession(sessionId: string): Promise<void> {
    // TODO: Delete from Firebase
    // await firebase.firestore().collection('aiChats').doc(sessionId).delete();
    // await firebase.firestore().collection('aiChats').doc(sessionId).collection('messages').get()
    //   .then(snapshot => snapshot.docs.forEach(doc => doc.ref.delete()));

    console.log(`Session ${sessionId} deleted`);
  }

  // Clear current session
  clearCurrentSession(): void {
    this.conversationHistory = [];
    this.currentSessionId = null;
  }

  // Get current session ID
  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  // Get conversation statistics
  getConversationStats(): { messageCount: number; subject: string; duration: number } {
    if (this.conversationHistory.length === 0) {
      return { messageCount: 0, subject: 'General', duration: 0 };
    }

    const firstMessage = this.conversationHistory[0];
    const lastMessage = this.conversationHistory[this.conversationHistory.length - 1];
    const duration = lastMessage.timestamp.getTime() - firstMessage.timestamp.getTime();

    // Find most common subject
    const subjects = this.conversationHistory
      .filter(msg => msg.subject)
      .map(msg => msg.subject!);

    const subjectCounts = subjects.reduce((acc, subject) => {
      acc[subject] = (acc[subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonSubject = Object.entries(subjectCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'General';

    return {
      messageCount: this.conversationHistory.length,
      subject: mostCommonSubject,
      duration: Math.floor(duration / 1000), // Convert to seconds
    };
  }
}

export default AIService;
