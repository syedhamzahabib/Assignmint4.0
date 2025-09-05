const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { authMiddleware } = require('../utils/auth');
const { logger } = require('../utils/logger');
const { DataSourceManager } = require('../data/DataSourceManager');

const router = express.Router();
const dataSourceManager = DataSourceManager.getInstance();

// Get all tasks with filters
router.get('/', [
  query('status').optional().isString(),
  query('subject').optional().isString(),
  query('q').optional().isString(),
  query('priceMin').optional().isNumeric(),
  query('priceMax').optional().isNumeric(),
  query('sort').optional().isString(),
  query('page').optional().isNumeric(),
  query('limit').optional().isNumeric(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const filters = {
      status: req.query['status'],
      subject: req.query['subject'],
      q: req.query['q'],
      priceMin: req.query['priceMin'] ? Number(req.query['priceMin']) : undefined,
      priceMax: req.query['priceMax'] ? Number(req.query['priceMax']) : undefined,
      sort: req.query['sort'],
      page: req.query['page'] ? Number(req.query['page']) : 1,
      limit: req.query['limit'] ? Number(req.query['limit']) : 20,
    };

    const dataSource = dataSourceManager.getDataSource();
    const result = await dataSource.getTasks(filters);
    
    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    logger.error('Error getting tasks:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get tasks'
    });
  }
});

// Get user's tasks (protected) - MUST come before /:id route
router.get('/my/tasks', [
  authMiddleware,
], async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const dataSource = dataSourceManager.getDataSource();
    const result = await dataSource.getUserTasks(req.user.uid);
    
    return res.json({
      success: true,
      tasks: result,
      total: result.length
    });
  } catch (error) {
    logger.error('Error getting user tasks:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get user tasks'
    });
  }
});

// Test endpoint for /my/tasks (no auth required for testing)
router.get('/my/tasks/test', async (_req, res) => {
  try {
    const dataSource = dataSourceManager.getDataSource();
    // Return tasks for a test user
    const result = await dataSource.getUserTasks('test-user-id');
    
    return res.json({
      success: true,
      tasks: result,
      total: result.length,
      message: 'Test endpoint - no auth required'
    });
  } catch (error) {
    logger.error('Error getting test user tasks:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get test user tasks'
    });
  }
});

// Create a new task (protected)
router.post('/', [
  authMiddleware,
  body('title').isString().trim().isLength({ min: 1, max: 200 }),
  body('subject').isString().trim().isLength({ min: 1, max: 100 }),
  body('description').isString().trim().isLength({ min: 10, max: 2000 }),
  body('price').isNumeric().isFloat({ min: 0.01 }),
  body('deadline').isISO8601().toDate(),
  body('fileUrls').optional().isArray(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const taskData = req.body;
    const dataSource = dataSourceManager.getDataSource();
    
    // Create task with authenticated user info
    const task = await dataSource.createTask(req.user.uid, taskData);
    
    logger.info(`Task created by user ${req.user.uid}: ${taskData.title}`);
    
    return res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    logger.error('Error creating task:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create task'
    });
  }
});

// Get task by ID (public) - MUST come after /my/tasks route
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }

    const dataSource = dataSourceManager.getDataSource();
    const task = await dataSource.getTaskById(id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    return res.json({
      success: true,
      task
    });
  } catch (error) {
    logger.error('Error getting task by ID:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get task'
    });
  }
});

module.exports = router;
