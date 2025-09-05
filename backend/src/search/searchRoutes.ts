import express from 'express';
import { query, body } from 'express-validator';
import { searchService } from './searchService';
import { AuthenticatedRequest } from '../utils/auth';
import { logger } from '../utils/logger';
import { SearchFilters, SearchOptions } from './searchTypes';

const router = express.Router();

// Search tasks
router.post('/tasks', [
  body('query').isString().notEmpty(),
  body('filters').optional().isObject(),
  body('page').optional().isInt({ min: 1 }),
  body('limit').optional().isInt({ min: 1, max: 100 }),
  body('sortBy').optional().isString(),
  body('sortOrder').optional().isIn(['asc', 'desc'])
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { query, filters = {}, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.body;

    // Validate and transform filters
    const searchFilters: Partial<SearchFilters> = {};
    if (filters.subject) searchFilters.subject = filters.subject;
    if (filters.status) searchFilters.status = filters.status;
    if (filters.priceMin !== undefined) searchFilters.priceMin = filters.priceMin;
    if (filters.priceMax !== undefined) searchFilters.priceMax = filters.priceMax;
    if (filters.deadline) searchFilters.deadline = filters.deadline;
    if (filters.rating !== undefined) searchFilters.rating = filters.rating;
    if (filters.location) searchFilters.location = filters.location;

    const options: SearchOptions = {
      query,
      filters: searchFilters,
      page,
      limit,
      sortBy,
      sortOrder
    };

    const results = await searchService.searchTasks(options);
    
    res.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total: results.length
      }
    });
  } catch (error) {
    logger.error('Error searching tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
});

// Search users
router.post('/users', [
  body('query').isString().notEmpty(),
  body('filters').optional().isObject(),
  body('page').optional().isInt({ min: 1 }),
  body('limit').optional().isInt({ min: 1, max: 100 }),
  body('sortBy').optional().isString(),
  body('sortOrder').optional().isIn(['asc', 'desc'])
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { query, filters = {}, page = 1, limit = 20, sortBy = 'avgRating', sortOrder = 'desc' } = req.body;

    // Validate and transform filters
    const searchFilters: Partial<SearchFilters> = {};
    if (filters.subjects) searchFilters.subjects = Array.isArray(filters.subjects) ? filters.subjects : [filters.subjects];
    if (filters.rating !== undefined) searchFilters.rating = filters.rating;
    if (filters.location) searchFilters.location = filters.location;

    const options: SearchOptions = {
      query,
      filters: searchFilters,
      page,
      limit,
      sortBy,
      sortOrder
    };

    const results = await searchService.searchUsers(options);
    
    res.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total: results.length
      }
    });
  } catch (error) {
    logger.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
});

// Index a task
router.post('/index/task/:taskId', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { taskId } = req.params;
    const taskData = req.body;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }

    const success = await searchService.indexTask(taskId, taskData);
    
    if (success) {
      return res.json({
        success: true,
        message: 'Task indexed successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Failed to index task'
      });
    }
  } catch (error) {
    logger.error('Error indexing task:', error);
    return res.status(500).json({
      success: false,
      error: 'Indexing failed'
    });
  }
});

// Index a user
router.post('/index/user/:userId', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { userId } = req.params;
    const userData = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const success = await searchService.indexUser(userId, userData);
    
    if (success) {
      return res.json({
        success: true,
        message: 'User indexed successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Failed to index user'
      });
    }
  } catch (error) {
    logger.error('Error indexing user:', error);
    return res.status(500).json({
      success: false,
      error: 'Indexing failed'
    });
  }
});

// Remove task from index
router.delete('/index/task/:taskId', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }

    const success = await searchService.removeTask(taskId);
    
    if (success) {
      return res.json({
        success: true,
        message: 'Task removed from index successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Failed to remove task from index'
      });
    }
  } catch (error) {
    logger.error('Error removing task from index:', error);
    return res.status(500).json({
      success: false,
      error: 'Removal failed'
    });
  }
});

// Remove user from index
router.delete('/index/user/:userId', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const success = await searchService.removeUser(userId);
    
    if (success) {
      return res.json({
        success: true,
        message: 'User removed from index successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Failed to remove user from index'
      });
    }
  } catch (error) {
    logger.error('Error removing user from index:', error);
    return res.status(500).json({
      success: false,
      error: 'Removal failed'
    });
  }
});

// Reindex all data
router.post('/reindex', async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const result = await searchService.reindexAll();
    
    res.json({
      success: true,
      message: 'Reindexing completed successfully',
      result,
    });
  } catch (error) {
    logger.error('Error reindexing data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get search analytics
router.get('/analytics', async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const analytics = await searchService.getSearchAnalytics();
    
    res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    logger.error('Error getting search analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Get search suggestions
router.get('/suggestions', [
  query('q').isString().notEmpty(),
  query('type').optional().isIn(['tasks', 'users']),
  query('limit').optional().isInt({ min: 1, max: 10 })
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { q, type = 'tasks', limit = 5 } = req.query;
    
    let suggestions: string[] = [];
    
    if (type === 'tasks') {
      suggestions = await searchService.getTaskSuggestions(q as string, limit as number);
    } else if (type === 'users') {
      suggestions = await searchService.getUserSuggestions(q as string, limit as number);
    }
    
    return res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    logger.error('Error getting search suggestions:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get suggestions'
    });
  }
});

// Get search configuration
router.get('/config', async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    res.json({
      success: true,
      config: {
        provider: 'Algolia',
        appId: process.env['ALGOLIA_APP_ID'] ? 'Configured' : 'Not configured',
        apiKey: process.env['ALGOLIA_ADMIN_API_KEY'] ? 'Configured' : 'Not configured',
        indexes: ['tasks', 'users'],
        fallbackSearch: true,
        maxResults: 1000,
        supportedFilters: {
          tasks: ['subject', 'status', 'price', 'deadline', 'rating', 'location'],
          users: ['subjects', 'rating', 'location'],
        },
        supportedSorting: {
          tasks: ['deadline', 'price', 'rating', 'createdAt'],
          users: ['rating', 'completedTasks', 'createdAt'],
        },
      },
    });
  } catch (error) {
    logger.error('Error getting search configuration:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;
