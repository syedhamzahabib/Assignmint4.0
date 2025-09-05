import express from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware } from '../utils/auth';
import { AuthenticatedRequest } from '../utils/auth';
import { logger } from '../utils/logger';
import DataSourceManager from '../data/DataSourceManager';

const router = express.Router();
const dataSourceManager = DataSourceManager.getInstance();

// Get messages for a specific task
router.get('/:taskId', async (req: express.Request, res: express.Response) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }

    const dataSource = dataSourceManager.getDataSource();
    const messages = await dataSource.getTaskMessages(taskId);
    
    return res.json({
      success: true,
      messages
    });
  } catch (error) {
    logger.error('Error getting task messages:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get messages'
    });
  }
});

// Create a new message (protected)
router.post('/:taskId', [
  authMiddleware,
  body('content').isString().trim().isLength({ min: 1, max: 1000 }),
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
    const { content } = req.body;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }

    const dataSource = dataSourceManager.getDataSource();
    const message = await dataSource.createMessage(taskId, req.user!.uid, content);
    
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

export default router;
