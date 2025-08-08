import { useState, useCallback, useEffect, useRef } from 'react';
import AIService, { AIMessage, ChatSession, SubjectDetection } from '../services/AIService';

export interface UseAIChatReturn {
  // State
  messages: AIMessage[];
  isTyping: boolean;
  currentSubject: string;
  explanationMode: boolean;
  chatSessions: ChatSession[];
  currentSessionId: string | null;
  
  // Actions
  sendMessage: (text: string) => Promise<void>;
  processImage: (imageUri: string) => Promise<void>;
  processDocument: (documentUri: string, documentName: string) => Promise<void>;
  createNewChat: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  clearChat: () => void;
  toggleExplanationMode: () => void;
  
  // Utilities
  getConversationStats: () => { messageCount: number; subject: string; duration: number };
  detectSubject: (text: string) => Promise<SubjectDetection>;
}

export const useAIChat = (userId?: string): UseAIChatReturn => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      text: "Hi! I'm your AI study assistant\n\nI can help you with:\n\n• **Subject Detection** - I'll automatically identify what you're studying\n• **Photo Analysis** - Take a picture of your assignment\n• **Document Upload** - Upload PDFs or images\n• **Smart Explanations** - Get help understanding concepts\n• **Memory & Context** - I remember our conversations\n\nWhat would you like help with today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<string>('');
  const [explanationMode, setExplanationMode] = useState<boolean>(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const aiService = AIService.getInstance();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize chat sessions on mount
  useEffect(() => {
    if (userId) {
      loadUserSessions();
    }
  }, [userId]);

  const loadUserSessions = async () => {
    if (!userId) return;
    
    try {
      const sessions = await aiService.getUserSessions(userId);
      setChatSessions(sessions);
    } catch (error) {
      console.error('Error loading user sessions:', error);
    }
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    try {
      // Detect subject from user input
      const subjectDetection = await aiService.detectSubject(text);
      const detectedSubject = subjectDetection.subject;
      
      const userMessage: AIMessage = {
        id: Date.now().toString(),
        text: text.trim(),
        isUser: true,
        timestamp: new Date(),
        subject: detectedSubject,
      };

      setMessages(prev => [...prev, userMessage]);
      setCurrentSubject(detectedSubject);
      setIsTyping(true);

      // Save message to service
      await aiService.saveMessage(userMessage);

      // Generate AI response
      const aiResponse = await aiService.generateResponse(text, detectedSubject, explanationMode);
      
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        subject: detectedSubject,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI message to service
      await aiService.saveMessage(aiMessage);
      
      // Update chat sessions if this is a new session
      if (!currentSessionId && userId) {
        await loadUserSessions();
      }
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request was aborted');
        return;
      }
      
      console.error('Error generating AI response:', error);
      
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  }, [currentSessionId, userId, explanationMode]);

  const processImage = useCallback(async (imageUri: string) => {
    setIsTyping(true);
    
    try {
      const ocrResult = await aiService.processImage(imageUri);
      
      const imageMessage: AIMessage = {
        id: Date.now().toString(),
        text: `I found this text in your image:\n\n"${ocrResult.text}"\n\n**Detected Subject:** ${ocrResult.subject}\n\nHow can I help you with this?`,
        isUser: false,
        timestamp: new Date(),
        subject: ocrResult.subject,
        attachments: [{
          type: 'image',
          uri: imageUri,
          name: 'Uploaded Image'
        }]
      };
      
      setMessages(prev => [...prev, imageMessage]);
      setCurrentSubject(ocrResult.subject || '');
      
      // Save to service
      await aiService.saveMessage(imageMessage);
      
    } catch (error) {
      console.error('Error processing image:', error);
      
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I couldn't process the image. Please try again or type your question directly.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const processDocument = useCallback(async (documentUri: string, documentName: string) => {
    setIsTyping(true);
    
    try {
      const documentAnalysis = await aiService.processDocument(documentUri, documentName);
      
      const documentMessage: AIMessage = {
        id: Date.now().toString(),
        text: `I've analyzed your document "${documentName}":\n\n**Subject:** ${documentAnalysis.subject}\n**Summary:** ${documentAnalysis.summary}\n\n**Key Topics:** ${documentAnalysis.topics.join(', ')}\n\n**Questions I can help with:**\n${documentAnalysis.questions.map(q => `• ${q}`).join('\n')}\n\nWhat would you like to know about this document?`,
        isUser: false,
        timestamp: new Date(),
        subject: documentAnalysis.subject,
        attachments: [{
          type: 'pdf',
          uri: documentUri,
          name: documentName
        }]
      };
      
      setMessages(prev => [...prev, documentMessage]);
      setCurrentSubject(documentAnalysis.subject);
      
      // Save to service
      await aiService.saveMessage(documentMessage);
      
    } catch (error) {
      console.error('Error processing document:', error);
      
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I couldn't process the document. Please try again or type your question directly.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const createNewChat = useCallback(async () => {
    try {
      const sessionId = await aiService.createNewSession(userId);
      setCurrentSessionId(sessionId);
      
      setMessages([{
        id: '1',
        text: "Hi! I'm your AI study assistant\n\nI can help you with:\n\n• **Subject Detection** - I'll automatically identify what you're studying\n• **Photo Analysis** - Take a picture of your assignment\n• **Document Upload** - Upload PDFs or images\n• **Smart Explanations** - Get help understanding concepts\n• **Memory & Context** - I remember our conversations\n\nWhat would you like help with today?",
        isUser: false,
        timestamp: new Date(),
      }]);
      setCurrentSubject('');
      
      // Refresh sessions list
      if (userId) {
        await loadUserSessions();
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  }, [userId]);

  const loadSession = useCallback(async (sessionId: string) => {
    try {
      const sessionMessages = await aiService.loadSession(sessionId);
      setMessages(sessionMessages);
      setCurrentSessionId(sessionId);
      
      // Find the most recent subject from messages
      const lastMessageWithSubject = sessionMessages
        .filter(msg => msg.subject)
        .pop();
      
      if (lastMessageWithSubject) {
        setCurrentSubject(lastMessageWithSubject.subject!);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  }, []);

  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      await aiService.deleteSession(sessionId);
      
      // Remove from local state
      setChatSessions(prev => prev.filter(session => session.id !== sessionId));
      
      // If this was the current session, create a new one
      if (sessionId === currentSessionId) {
        await createNewChat();
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  }, [currentSessionId, createNewChat]);

  const clearChat = useCallback(() => {
    setMessages([{
      id: '1',
      text: "Hi! I'm your AI study assistant 🤖\n\nI can help you with:\n\n📚 **Subject Detection** - I'll automatically identify what you're studying\n📸 **Photo Analysis** - Take a picture of your assignment\n📄 **Document Upload** - Upload PDFs or images\n💬 **Smart Explanations** - Get help understanding concepts\n🧠 **Memory & Context** - I remember our conversations\n\nWhat would you like help with today?",
      isUser: false,
      timestamp: new Date(),
    }]);
    setCurrentSubject('');
    aiService.clearCurrentSession();
    setCurrentSessionId(null);
  }, []);

  const toggleExplanationMode = useCallback(() => {
    setExplanationMode(prev => !prev);
  }, []);

  const getConversationStats = useCallback(() => {
    return aiService.getConversationStats();
  }, []);

  const detectSubject = useCallback(async (text: string) => {
    return await aiService.detectSubject(text);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    messages,
    isTyping,
    currentSubject,
    explanationMode,
    chatSessions,
    currentSessionId,
    
    // Actions
    sendMessage,
    processImage,
    processDocument,
    createNewChat,
    loadSession,
    deleteSession,
    clearChat,
    toggleExplanationMode,
    
    // Utilities
    getConversationStats,
    detectSubject,
  };
};
