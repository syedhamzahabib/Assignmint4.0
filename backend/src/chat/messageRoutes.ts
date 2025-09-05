import express from 'express';
import { body, validationResult } from 'express-validator';
import MessageService from './messageService';
import { authMiddleware } from '../utils/auth';
import { AuthenticatedRequest } from '../utils/auth';
import { logger } from '../utils/logger';

const router = express.Router();
const messageService = MessageService.getInstance();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get messages for a specific task
router.get('/:taskId', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }
    
    const messages = await messageService.getTaskMessages(taskId);
    
    return res.json({
      success: true,
      messages
    });
  } catch (error) {
    logger.error('Error getting task messages:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get task messages'
    });
  }
});

// Create a new message
router.post('/:taskId', [
  body('text').isString().trim().isLength({ min: 1, max: 1000 }),
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

    const { taskId } = req.params;
    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }
    
    const { text } = {
      text: req.body.text
    };
    
    const message = await messageService.createMessage(taskId, req.user!.uid, { text });
    
    return res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    logger.error('Error creating message:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create message'
    });
  }
});

// Delete a message
router.delete('/:messageId', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { messageId } = req.params;
    if (!messageId) {
      return res.status(400).json({
        success: false,
        error: 'Message ID is required'
      });
    }
    
    await messageService.deleteMessage(messageId, req.user!.uid);
    
    return res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting message:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete message'
    });
  }
});

export default router;
