import express from 'express';
import { body, validationResult } from 'express-validator';
import { emailService } from './emailService';
import { AuthenticatedRequest } from '../utils/auth';
import { logger } from '../utils/logger';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();

// Send email
router.post('/send', [
  authenticateToken,
  body('to').isEmail(),
  body('subject').isString().notEmpty(),
  body('html').isString().notEmpty(),
  body('text').optional().isString()
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { to, subject, html, text } = req.body;
    const result = await emailService.sendEmail({ to, subject, html, text: text || html });

    if (result) {
      return res.json({ message: 'Email sent successfully' });
    } else {
      return res.status(400).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    logger.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

// Send task notification email
router.post('/task-notification', [
  body('to').isEmail().withMessage('Valid email address is required'),
  body('taskTitle').notEmpty().withMessage('Task title is required'),
  body('notificationType').isIn(['claimed', 'submitted', 'accepted', 'rejected']).withMessage('Valid notification type is required'),
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

    const { to, taskTitle, notificationType } = req.body;

    const success = await emailService.sendTaskNotification(
      to,
      taskTitle,
      notificationType
    );

    if (success) {
      return res.json({
        success: true,
        message: 'Task notification email sent successfully',
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Failed to send task notification email',
      });
    }
  } catch (error) {
    logger.error('Error sending task notification email:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Send welcome email
router.post('/welcome', [
  body('to').isEmail().withMessage('Valid email address is required'),
  body('displayName').notEmpty().withMessage('Display name is required'),
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

    const { to, displayName } = req.body;

    const success = await emailService.sendWelcomeEmail(to, displayName);

    if (success) {
      return res.json({
        success: true,
        message: 'Welcome email sent successfully',
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Failed to send welcome email',
      });
    }
  } catch (error) {
    logger.error('Error sending welcome email:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Send password reset email
router.post('/password-reset', [
  body('to').isEmail().withMessage('Valid email address is required'),
  body('resetToken').notEmpty().withMessage('Reset token is required'),
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

    const { to, resetToken } = req.body;

    const success = await emailService.sendPasswordResetEmail(to, resetToken);

    if (success) {
      return res.json({
        success: true,
        message: 'Password reset email sent successfully',
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Failed to send password reset email',
      });
    }
  } catch (error) {
    logger.error('Error sending password reset email:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Verify email service connection
router.get('/verify', async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const connected = await emailService.verifyConnection();
    
    return res.json({
      success: true,
      connected,
      message: connected ? 'Email service is connected' : 'Email service connection failed',
    });
  } catch (error) {
    logger.error('Error verifying email service:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get email service status
router.get('/status', async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const connected = await emailService.verifyConnection();
    
    return res.json({
      success: true,
      status: {
        connected,
        timestamp: new Date().toISOString(),
        service: 'SMTP',
        host: process.env['SMTP_HOST'] || 'Not configured',
        port: process.env['SMTP_PORT'] || 'Not configured',
        user: process.env['SMTP_USER'] ? 'Configured' : 'Not configured',
        from: process.env['SMTP_FROM'] || 'Not configured',
      },
    });
  } catch (error) {
    logger.error('Error getting email service status:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

router.post('/template', [
  authenticateToken,
  body('to').isEmail(),
  body('template').isString().notEmpty(),
  body('data').isObject()
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { to, template, data } = req.body;
    
    // Simple template processing - in a real app, you'd use a proper templating engine
    let html = '';
    let subject = '';
    
    switch (template) {
      case 'welcome':
        html = `<h1>Welcome to AssignMint, ${data.name}!</h1><p>We're excited to have you on board.</p>`;
        subject = 'Welcome to AssignMint!';
        break;
      case 'task_assigned':
        html = `<h2>Task Assigned: ${data.taskTitle}</h2><p>You have been assigned a new task.</p>`;
        subject = `Task Assigned: ${data.taskTitle}`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid template type' });
    }

    const result = await emailService.sendEmail({ to, subject, html, text: html });
    
    if (result) {
      return res.json({ message: 'Template email sent successfully' });
    } else {
      return res.status(400).json({ error: 'Failed to send template email' });
    }
  } catch (error) {
    logger.error('Error sending template email:', error);
    return res.status(500).json({ error: 'Failed to send template email' });
  }
});

router.post('/bulk', [
  authenticateToken,
  authorizeRole(['admin']),
  body('recipients').isArray({ min: 1 }),
  body('subject').isString().notEmpty(),
  body('html').isString().notEmpty(),
  body('text').optional().isString()
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipients, subject, html, text } = req.body;
    const result = await emailService.sendBulkEmail(recipients, subject, html, text || html);
    
    if (result) {
      return res.json({ message: 'Bulk emails sent successfully' });
    } else {
      return res.status(400).json({ error: 'Failed to send bulk emails' });
    }
  } catch (error) {
    logger.error('Error sending bulk emails:', error);
    return res.status(500).json({ error: 'Failed to send bulk emails' });
  }
});

export default router;
