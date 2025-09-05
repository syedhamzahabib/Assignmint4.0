import express from 'express';
import { body, validationResult } from 'express-validator';
import { opsDashboard } from './opsDashboard';
import { AuthenticatedRequest } from '../utils/auth';
import { logger } from '../utils/logger';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();

// Get dashboard data
router.get('/dashboard', async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const dashboardData = await opsDashboard.getDashboardData();
    
    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    logger.error('Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get system health
router.get('/health', async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const currentHealth = await opsDashboard.getDashboardData();
    
    res.json({
      success: true,
      health: currentHealth.currentHealth,
    });
  } catch (error) {
    logger.error('Error getting system health:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get system metrics
router.get('/metrics', async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const metrics = await opsDashboard.getSystemMetrics();
    
    res.json({
      success: true,
      metrics,
    });
  } catch (error) {
    logger.error('Error getting system metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get alerts
router.get('/alerts', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const dashboardData = await opsDashboard.getDashboardData();
    const { acknowledged } = req.query;
    
    let alerts = dashboardData.alerts;
    
    if (acknowledged === 'false') {
      alerts = alerts.filter(alert => !alert.acknowledged);
    } else if (acknowledged === 'true') {
      alerts = alerts.filter(alert => alert.acknowledged);
    }
    
    res.json({
      success: true,
      alerts,
      count: alerts.length,
    });
  } catch (error) {
    logger.error('Error getting alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Acknowledge alert
router.post('/alerts/:alertId/acknowledge', [
  authenticateToken,
  authorizeRole(['admin', 'operator'])
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { alertId } = req.params;
    
    if (!alertId) {
      return res.status(400).json({ error: 'Alert ID is required' });
    }

    const result = opsDashboard.acknowledgeAlert(alertId);
    
    if (result.success) {
      return res.json({ message: 'Alert acknowledged successfully' });
    } else {
      return res.status(400).json({ error: result.error || 'Failed to acknowledge alert' });
    }
  } catch (error) {
    logger.error('Error acknowledging alert:', error);
    return res.status(500).json({ error: 'Failed to acknowledge alert' });
  }
});

// Create alert
router.post('/alerts', [
  body('level').isIn(['info', 'warning', 'error', 'critical']).withMessage('Valid alert level is required'),
  body('message').notEmpty().withMessage('Alert message is required'),
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

    const { level, message } = req.body;
    
    const alert = await opsDashboard.createAlert(level, message, level);
    const alertId = alert.id;
    
    return res.json({
      success: true,
      message: 'Alert created successfully',
      alertId,
    });
  } catch (error) {
    logger.error('Error creating alert:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Start monitoring
router.post('/monitoring/start', [
  authenticateToken,
  authorizeRole(['admin'])
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { interval = 300000 } = req.body; // Default to 5 minutes
    
    await opsDashboard.startMonitoring(interval);
    
    return res.json({ message: 'Monitoring started successfully' });
  } catch (error) {
    logger.error('Error starting monitoring:', error);
    return res.status(500).json({ error: 'Failed to start monitoring' });
  }
});

// Stop monitoring
router.post('/monitoring/stop', [
  authenticateToken,
  authorizeRole(['admin'])
], async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    opsDashboard.stopMonitoring();
    
    return res.json({ message: 'Monitoring stopped successfully' });
  } catch (error) {
    logger.error('Error stopping monitoring:', error);
    return res.status(500).json({ error: 'Failed to stop monitoring' });
  }
});

// Get monitoring status
router.get('/monitoring/status', async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const dashboardData = await opsDashboard.getDashboardData();
    
    return res.json({
      success: true,
      status: {
        monitoring: true, // This would come from the dashboard in a real implementation
        healthCheckInterval: dashboardData.config.healthCheckInterval,
        lastHealthCheck: dashboardData.currentHealth.timestamp,
        alertsEnabled: dashboardData.config.notificationEmails.length > 0,
        notificationEmails: dashboardData.config.notificationEmails.length,
      },
    });
  } catch (error) {
    logger.error('Error getting monitoring status:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Update dashboard configuration
router.put('/config', [
  body('healthCheckInterval').optional().isNumeric().withMessage('Health check interval must be a number'),
  body('alertThresholds.responseTime').optional().isNumeric().withMessage('Response time threshold must be a number'),
  body('alertThresholds.errorRate').optional().isNumeric().withMessage('Error rate threshold must be a number'),
  body('alertThresholds.cpuUsage').optional().isNumeric().withMessage('CPU usage threshold must be a number'),
  body('alertThresholds.memoryUsage').optional().isNumeric().withMessage('Memory usage threshold must be a number'),
  body('notificationEmails').optional().isArray().withMessage('Notification emails must be an array'),
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

    const config = req.body;
    
    const result = opsDashboard.updateConfig(config);
    
    if (result.success) {
      return res.json({
        success: true,
        message: 'Configuration updated successfully',
        config,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to update configuration',
      });
    }
  } catch (error) {
    logger.error('Error updating configuration:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Export health report
router.post('/reports/health', [
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
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

    const { startDate, endDate } = req.body;
    
    const report = opsDashboard.exportHealthReport(
      new Date(startDate),
      new Date(endDate)
    );
    
    return res.json({
      success: true,
      message: 'Health report generated successfully',
      report,
      period: { startDate, endDate },
    });
  } catch (error) {
    logger.error('Error generating health report:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get service status
router.get('/services/status', async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const dashboardData = await opsDashboard.getDashboardData();
    
    return res.json({
      success: true,
      services: dashboardData.currentHealth.services.map(service => ({
        name: service.name,
        status: service.status,
        responseTime: service.responseTime,
        lastCheck: service.lastCheck,
        error: service.error,
      })),
    });
  } catch (error) {
    logger.error('Error getting service status:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get database status
router.get('/database/status', async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const dashboardData = await opsDashboard.getDashboardData();
    
    return res.json({
      success: true,
      database: {
        status: dashboardData.currentHealth.database.status,
        collections: dashboardData.currentHealth.database.collections,
        totalDocuments: dashboardData.currentHealth.database.totalDocuments,
        errors: dashboardData.currentHealth.database.errors,
      },
    });
  } catch (error) {
    logger.error('Error getting database status:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get performance metrics
router.get('/performance/metrics', async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const dashboardData = await opsDashboard.getDashboardData();
    
    return res.json({
      success: true,
      performance: dashboardData.currentHealth.performance,
    });
  } catch (error) {
    logger.error('Error getting performance metrics:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get operations summary
router.get('/summary', async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const dashboardData = await opsDashboard.getDashboardData();
    const metrics = await opsDashboard.getSystemMetrics();
    
    const summary = {
      system: {
        status: dashboardData.currentHealth.status,
        uptime: metrics.uptime,
        lastHealthCheck: dashboardData.currentHealth.timestamp,
      },
      services: {
        total: dashboardData.currentHealth.services.length,
        healthy: dashboardData.currentHealth.services.filter(s => s.status === 'healthy').length,
        degraded: dashboardData.currentHealth.services.filter(s => s.status === 'degraded').length,
        unhealthy: dashboardData.currentHealth.services.filter(s => s.status === 'unhealthy').length,
      },
      alerts: {
        total: dashboardData.alerts.length,
        unacknowledged: dashboardData.alerts.filter(a => !a.acknowledged).length,
        critical: dashboardData.alerts.filter(a => a.level === 'critical').length,
      },
      performance: {
        cpuUsage: dashboardData.currentHealth.performance.cpuUsage,
        memoryUsage: dashboardData.currentHealth.performance.memoryUsage,
        errorRate: dashboardData.currentHealth.performance.errorRate,
      },
      database: {
        status: dashboardData.currentHealth.database.status,
        totalDocuments: dashboardData.currentHealth.database.totalDocuments,
        collections: dashboardData.currentHealth.database.collections.length,
      },
    };
    
    return res.json({
      success: true,
      summary,
    });
  } catch (error) {
    logger.error('Error getting operations summary:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

router.get('/health/check', [
  authenticateToken,
  authorizeRole(['admin', 'operator'])
], async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const healthStatus = await opsDashboard.checkAllServices();
    
    return res.json({
      data: {
        timestamp: new Date(),
        services: healthStatus,
        overall: opsDashboard.getOverallHealth()
      }
    });
  } catch (error) {
    logger.error('Error checking health status:', error);
    return res.status(500).json({ error: 'Failed to check health status' });
  }
});

export default router;
