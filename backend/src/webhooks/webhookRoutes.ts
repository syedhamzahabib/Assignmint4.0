import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { webhookService } from './webhookService';
import { AuthenticatedRequest } from '../utils/auth';
import { logger } from '../utils/logger';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();

// Process webhook (no auth required for external services)
router.post('/process', [
  body('id').notEmpty().withMessage('Webhook ID is required'),
  body('type').notEmpty().withMessage('Webhook type is required'),
  body('data').notEmpty().withMessage('Webhook data is required'),
  body('timestamp').isNumeric().withMessage('Valid timestamp is required'),
], async (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { id, type, data, timestamp } = req.body;
    const signature = req.headers['x-webhook-signature'] as string;

    const payload = {
      id,
      type,
      data,
      timestamp,
    };

    const success = await webhookService.processWebhook(payload, signature);

    if (success) {
      return res.json({
        success: true,
        message: 'Webhook processed successfully',
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Failed to process webhook',
      });
    }
  } catch (error) {
    logger.error('Error processing webhook:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Stripe webhook endpoint
router.post('/stripe', [
  body('type').isString().notEmpty(),
  body('data').isObject()
], async (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const result = await webhookService.processStripeWebhook(req.body);
    
    if (result) {
      return res.status(200).json({ message: 'Webhook processed successfully' });
    } else {
      return res.status(400).json({ error: 'Failed to process webhook' });
    }
  } catch (error) {
    logger.error('Error processing Stripe webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Firebase webhook endpoint
router.post('/firebase', [
  body('id').notEmpty().withMessage('Webhook ID is required'),
  body('type').notEmpty().withMessage('Webhook type is required'),
  body('data').notEmpty().withMessage('Webhook data is required'),
], async (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { id, type, data } = req.body;
    
    const payload = {
      id,
      type,
      data,
      timestamp: Date.now(),
    };

    const success = await webhookService.processWebhook(payload);

    if (success) {
      return res.json({
        success: true,
        message: 'Firebase webhook processed successfully',
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Failed to process Firebase webhook',
      });
    }
  } catch (error) {
    logger.error('Error processing Firebase webhook:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get webhook history (admin only)
router.get('/history', [
  query('limit').optional().isInt({ min: 1, max: 1000 }),
  query('type').optional().isString(),
  query('status').optional().isIn(['success', 'failed', 'pending']),
  query('since').optional().isISO8601()
], async (req: express.Request, res: express.Response) => {
  try {
    const limit = parseInt(req.query['limit'] as string) || 100;

    const history = await webhookService.getWebhookHistory(limit);

    return res.json({
      success: true,
      data: history,
      count: history.length
    });
  } catch (error) {
    logger.error('Error fetching webhook history:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch webhook history'
    });
  }
});

// Retry failed webhooks (admin only)
router.post('/retry', [
  authenticateToken,
  authorizeRole(['admin'])
], async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const result = await webhookService.retryFailedWebhooks();
    
    if (result.retried > 0) {
      return res.json({
        message: 'Webhook retry completed',
        data: result
      });
    } else {
      return res.json({
        message: 'No failed webhooks to retry',
        data: result
      });
    }
  } catch (error) {
    logger.error('Error retrying webhooks:', error);
    return res.status(500).json({ error: 'Failed to retry webhooks' });
  }
});

// Get webhook statistics (admin only)
router.get('/stats', async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const webhooks = await webhookService.getWebhookHistory(1000);
    
    const stats = {
      total: webhooks.length,
      processed: webhooks.filter(w => w.processed).length,
      failed: webhooks.filter(w => !w.processed).length,
      byType: {} as Record<string, number>,
      recentFailures: webhooks
        .filter(w => !w.processed)
        .slice(0, 10)
        .map(w => ({
          id: w.id,
          type: w.type,
          timestamp: w.timestamp,
          error: w.error,
        })),
    };

    // Count by type
    webhooks.forEach(webhook => {
      stats.byType[webhook.type] = (stats.byType[webhook.type] || 0) + 1;
    });
    
    return res.json({
      success: true,
      stats,
    });
  } catch (error) {
    logger.error('Error getting webhook statistics:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Test webhook endpoint
router.post('/test', [
  body('type').notEmpty().withMessage('Webhook type is required'),
  body('data').notEmpty().withMessage('Test data is required'),
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { type, data } = req.body;
    
    const payload = {
      id: `test_${Date.now()}`,
      type,
      data,
      timestamp: Date.now(),
    };

    const success = await webhookService.processWebhook(payload);

    if (success) {
      return res.json({
        success: true,
        message: 'Test webhook processed successfully',
        payload,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Failed to process test webhook',
      });
    }
  } catch (error) {
    logger.error('Error processing test webhook:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get webhook configuration
router.get('/config', [
  authenticateToken,
  authorizeRole(['admin'])
], async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const config = {
      webhookUrl: process.env['WEBHOOK_URL'] || 'https://api.assignmint.com/webhooks',
      secret: process.env['WEBHOOK_SECRET'] ? '***' : undefined,
      maxRetries: 3,
      timeout: 30000
    };
    
    return res.json({ data: config });
  } catch (error) {
    logger.error('Error fetching webhook config:', error);
    return res.status(500).json({ error: 'Failed to fetch webhook config' });
  }
});

export default router;
