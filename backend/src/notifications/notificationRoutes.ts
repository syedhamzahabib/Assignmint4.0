import express from 'express';
import { query, validationResult } from 'express-validator';
import NotificationService from './notificationService';
import { authMiddleware } from '../utils/auth';
import { AuthenticatedRequest } from '../utils/auth';
import { logger } from '../utils/logger';

const router = express.Router();
const notificationService = NotificationService.getInstance();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get user's notifications
router.get('/', [
  query('page').optional().isNumeric(),
  query('limit').optional().isNumeric(),
  query('unreadOnly').optional().isBoolean(),
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

    const page = req.query['page'] ? Number(req.query['page']) : 1;
    const limit = req.query['limit'] ? Number(req.query['limit']) : 20;
    const unreadOnly = req.query['unreadOnly'] === 'true';

    const result = await notificationService.getUserNotifications(
      req.user!.uid, 
      page, 
      limit, 
      unreadOnly
    );
    
    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    logger.error('Error getting notifications:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get notifications'
    });
  }
});

// Get notification count
router.get('/count', [
  query('unreadOnly').optional().isBoolean(),
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

    const unreadOnly = req.query['unreadOnly'] === 'true';
    const count = await notificationService.getNotificationCount(req.user!.uid, unreadOnly);
    
    return res.json({
      success: true,
      count
    });
  } catch (error) {
    logger.error('Error getting notification count:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get notification count'
    });
  }
});

// Mark notification as read
router.put('/:notificationId/read', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { notificationId } = req.params;
    if (!notificationId) {
      return res.status(400).json({
        success: false,
        error: 'Notification ID is required'
      });
    }
    
    await notificationService.markNotificationAsRead(notificationId, req.user!.uid);
    
    return res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark notification as read'
    });
  }
});

// Mark all notifications as read
router.put('/read-all', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    await notificationService.markAllNotificationsAsRead(req.user!.uid);
    
    return res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    logger.error('Error marking all notifications as read:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to mark notifications as read'
    });
  }
});

// Delete a notification
router.delete('/:notificationId', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { notificationId } = req.params;
    if (!notificationId) {
      return res.status(400).json({
        success: false,
        error: 'Notification ID is required'
      });
    }
    
    await notificationService.deleteNotification(notificationId, req.user!.uid);
    
    return res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting notification:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete notification'
    });
  }
});

// Delete all notifications
router.delete('/', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    await notificationService.deleteAllUserNotifications(req.user!.uid);
    
    return res.json({
      success: true,
      message: 'All notifications deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting all notifications:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete notifications'
    });
  }
});

export default router;
