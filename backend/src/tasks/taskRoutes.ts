import express from 'express';
import { body, query, validationResult } from 'express-validator';
import TaskService from './taskService';
import { authMiddleware } from '../utils/auth';
import { AuthenticatedRequest } from '../utils/auth';
import { logger } from '../utils/logger';

const router = express.Router();
const taskService = TaskService.getInstance();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all tasks with filters and pagination
router.get('/', [
  query('status').optional().isString(),
  query('subject').optional().isString(),
  query('priceMin').optional().isNumeric(),
  query('priceMax').optional().isNumeric(),
  query('sort').optional().isString(),
  query('page').optional().isNumeric(),
  query('limit').optional().isNumeric(),
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

    const filters = {
      status: req.query['status'] as any,
      subject: req.query['subject'] as string,
      priceMin: req.query['priceMin'] ? Number(req.query['priceMin']) : 0,
      priceMax: req.query['priceMax'] ? Number(req.query['priceMax']) : 999999,
      sort: req.query['sort'] as any,
      page: req.query['page'] ? Number(req.query['page']) : 1,
      limit: req.query['limit'] ? Number(req.query['limit']) : 20,
    };

    const result = await taskService.getTasks(filters);
    
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

// Create a new task
router.post('/', [
  body('title').isString().trim().isLength({ min: 1, max: 200 }),
  body('subject').isString().trim().isLength({ min: 1, max: 100 }),
  body('description').isString().trim().isLength({ min: 10, max: 2000 }),
  body('price').isNumeric().isFloat({ min: 0.01 }),
  body('deadline').isISO8601().toDate(),
  body('fileUrls').optional().isArray(),
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

    const taskData = req.body;
    const task = await taskService.createTask(req.user!.uid, taskData);
    
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

// Get task by ID
router.get('/:id', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }
    
    const task = await taskService.getTaskById(id);
    
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

// Update task
router.put('/:id', [
  body('title').optional().isString().trim().isLength({ min: 1, max: 200 }),
  body('subject').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().isString().trim().isLength({ min: 10, max: 2000 }),
  body('price').optional().isNumeric().isFloat({ min: 0.01 }),
  body('deadline').optional().isISO8601().toDate(),
  body('fileUrls').optional().isArray(),
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

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }
    
    const updates = req.body;
    const task = await taskService.updateTask(id, req.user!.uid, updates);
    
    return res.json({
      success: true,
      task
    });
  } catch (error) {
    logger.error('Error updating task:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update task'
    });
  }
});

// Delete task
router.delete('/:id', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }
    
    await taskService.deleteTask(id, req.user!.uid);
    
    return res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting task:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete task'
    });
  }
});

// Claim a task
router.post('/:id/claim', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }
    
    const task = await taskService.claimTask(id, req.user!.uid);
    
    return res.json({
      success: true,
      task
    });
  } catch (error) {
    logger.error('Error claiming task:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to claim task'
    });
  }
});

// Submit work for a task
router.post('/:id/submit', [
  body('message').isString().trim().isLength({ min: 1, max: 1000 }),
  body('fileUrls').optional().isArray(),
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

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }
    
    const { message, fileUrls = [] } = req.body;
    
    const task = await taskService.submitTask(id, req.user!.uid, {
      message,
      fileUrls,
    });
    
    return res.json({
      success: true,
      task
    });
  } catch (error) {
    logger.error('Error submitting task:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit task'
    });
  }
});

// Accept task submission
router.post('/:id/accept', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }
    
    const task = await taskService.acceptTask(id, req.user!.uid);
    
    return res.json({
      success: true,
      task
    });
  } catch (error) {
    logger.error('Error accepting task:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to accept task'
    });
  }
});

// Reject task submission
router.post('/:id/reject', [
  body('reason').isString().trim().isLength({ min: 1, max: 500 }),
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

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }
    
    const { reason } = req.body;
    
    const task = await taskService.rejectTask(id, req.user!.uid, reason);
    
    return res.json({
      success: true,
      task
    });
  } catch (error) {
    logger.error('Error rejecting task:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reject task'
    });
  }
});

// Get user's tasks
router.get('/user/:type', [
  query('type').isIn(['posted', 'claimed']),
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

    const { type } = req.params;
    if (!type) {
      return res.status(400).json({
        success: false,
        error: 'Task type is required'
      });
    }
    
    const tasks = await taskService.getUserTasks(req.user!.uid, type as 'posted' | 'claimed');
    
    return res.json({
      success: true,
      tasks
    });
  } catch (error) {
    logger.error('Error getting user tasks:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get user tasks'
    });
  }
});

// Get task events/history
router.get('/:id/events', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }
    
    const events = await taskService.getTaskEvents(id);
    
    return res.json({
      success: true,
      events
    });
  } catch (error) {
    logger.error('Error getting task events:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get task events'
    });
  }
});

export default router;
