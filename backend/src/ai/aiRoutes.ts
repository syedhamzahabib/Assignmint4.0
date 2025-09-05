import express from 'express';
import { body, validationResult } from 'express-validator';
import AIService from './aiService';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../utils/auth';

const router = express.Router();
const aiService = AIService.getInstance();

// Middleware to validate user ID from auth
const validateUserId = (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction): void => {
  if (!req.user || !req.user.uid) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }
  req.userId = req.user.uid;
  next();
};

// Create a new chat session
router.post('/sessions', validateUserId, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User ID not set' });
    }
    
    const sessionId = await aiService.createNewSession(req.userId);
    
    return res.status(201).json({
      success: true,
      sessionId,
      message: 'Chat session created successfully'
    });
  } catch (error) {
    logger.error('Error creating chat session:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create chat session'
    });
  }
});

// Get user's chat sessions
router.get('/sessions', validateUserId, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User ID not set' });
    }
    
    const sessions = await aiService.getUserSessions(req.userId);
    
    return res.json({
      success: true,
      sessions
    });
  } catch (error) {
    logger.error('Error loading chat sessions:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to load chat sessions'
    });
  }
});

// Load a specific chat session
router.get('/sessions/:sessionId', validateUserId, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    const messages = await aiService.loadSession(sessionId);
    
    return res.json({
      success: true,
      messages
    });
  } catch (error) {
    logger.error('Error loading session:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to load chat session'
    });
  }
});

// Delete a chat session
router.delete('/sessions/:sessionId', validateUserId, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    await aiService.deleteSession(sessionId);
    
    return res.json({
      success: true,
      message: 'Chat session deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting session:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete chat session'
    });
  }
});

// Send a message and get AI response
router.post('/chat', validateUserId, [
  body('message').isString().trim().isLength({ min: 1, max: 2000 }),
  body('sessionId').optional().isString(),
  body('explanationMode').optional().isBoolean(),
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { message, sessionId, explanationMode = true } = req.body;
    
    // Detect subject from user message
    const subjectDetection = await aiService.detectSubject(message);
    
    // Create user message object
    const userMessage = {
      id: Date.now().toString(),
      text: message.trim(),
      isUser: true,
      timestamp: new Date(),
      subject: subjectDetection.subject,
    };

    // Save user message if session exists
    if (sessionId) {
      await aiService.saveMessage(sessionId, userMessage);
    }

    // Generate AI response
    const aiResponse = await aiService.generateResponse(
      message, 
      subjectDetection.subject, 
      explanationMode,
      sessionId ? await aiService.loadSession(sessionId) : []
    );

    // Create AI message object
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      isUser: false,
      timestamp: new Date(),
      subject: subjectDetection.subject || 'General',
    };

    // Save AI message if session exists
    if (sessionId) {
      await aiService.saveMessage(sessionId, aiMessage);
    }

    return res.json({
      success: true,
      userMessage,
      aiMessage,
      subjectDetection,
      sessionId
    });

  } catch (error) {
    logger.error('Error in chat endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process chat message'
    });
  }
});

// Process image with OCR
router.post('/process-image', validateUserId, [
  body('imageUri').isString().trim().isLength({ min: 1 }),
  body('sessionId').optional().isString(),
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { imageUri, sessionId } = req.body;
    
    // Process image with OCR
    const ocrResult = await aiService.processImage(imageUri);
    
    // Create AI message with OCR result
    const aiMessage = {
      id: Date.now().toString(),
      text: `I found this text in your image:\n\n"${ocrResult.text}"\n\n**Detected Subject:** ${ocrResult.subject || 'General'}\n\nHow can I help you with this?`,
      isUser: false,
      timestamp: new Date(),
      subject: ocrResult.subject || 'General',
      attachments: [{
        type: 'image' as const,
        uri: imageUri,
        name: 'Uploaded Image',
      }],
    };

    // Save message if session exists
    if (sessionId) {
      await aiService.saveMessage(sessionId, aiMessage);
    }

    return res.json({
      success: true,
      ocrResult,
      aiMessage,
      sessionId
    });

  } catch (error) {
    logger.error('Error processing image:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process image'
    });
  }
});

// Process document
router.post('/process-document', validateUserId, [
  body('documentUri').isString().trim().isLength({ min: 1 }),
  body('documentName').isString().trim().isLength({ min: 1 }),
  body('sessionId').optional().isString(),
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { documentUri, documentName, sessionId } = req.body;
    
    // Process document
    const documentAnalysis = await aiService.processDocument(documentUri, documentName);
    
    // Create AI message with document analysis
    const aiMessage = {
      id: Date.now().toString(),
      text: `I've analyzed your document "${documentName}":\n\n**Subject:** ${documentAnalysis.subject}\n**Summary:** ${documentAnalysis.summary}\n\n**Key Topics:** ${documentAnalysis.topics.join(', ')}\n\n**Questions I can help with:**\n${documentAnalysis.questions.map(q => `• ${q}`).join('\n')}\n\nWhat would you like to know about this document?`,
      isUser: false,
      timestamp: new Date(),
      subject: documentAnalysis.subject,
      attachments: [{
        type: 'pdf' as const,
        uri: documentUri,
        name: documentName,
      }],
    };

    // Save message if session exists
    if (sessionId) {
      await aiService.saveMessage(sessionId, aiMessage);
    }

    return res.json({
      success: true,
      documentAnalysis,
      aiMessage,
      sessionId
    });

  } catch (error) {
    logger.error('Error processing document:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process document'
    });
  }
});

// Detect subject from text
router.post('/detect-subject', validateUserId, [
  body('text').isString().trim().isLength({ min: 1, max: 2000 }),
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { text } = req.body;
    
    // Detect subject
    const subjectDetection = await aiService.detectSubject(text);
    
    return res.json({
      success: true,
      subjectDetection
    });

  } catch (error) {
    logger.error('Error detecting subject:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to detect subject'
    });
  }
});

// Health check for AI service
router.get('/health', async (_req: express.Request, res: express.Response) => {
  try {
    // Test OpenAI connection with a simple request
    await aiService.detectSubject('test message');
    
    return res.json({
      success: true,
      status: 'healthy',
      openai: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('AI service health check failed:', error);
    return res.status(503).json({
      success: false,
      status: 'unhealthy',
      openai: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
