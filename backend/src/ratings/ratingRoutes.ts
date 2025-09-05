import express from 'express';
import { body, validationResult } from 'express-validator';
import RatingService from './ratingService';
import { authMiddleware } from '../utils/auth';
import { AuthenticatedRequest } from '../utils/auth';
import { logger } from '../utils/logger';

const router = express.Router();
const ratingService = RatingService.getInstance();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create a rating for a task
router.post('/tasks/:taskId', [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').isString().trim().isLength({ min: 1, max: 500 }),
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
    
    const { rating, comment } = req.body;
    
    // Check if user has already rated this task
    const hasRated = await ratingService.hasUserRatedTask(taskId, req.user!.uid);
    if (hasRated) {
      return res.status(400).json({
        success: false,
        error: 'You have already rated this task'
      });
    }

    // For now, we'll need to get the task to determine who to rate
    // In a real implementation, you might want to pass the toUserId in the request
    // or determine it from the task status
    const toUserId = req.body.toUserId; // This should be the expert who completed the task
    
    if (!toUserId) {
      return res.status(400).json({
        success: false,
        error: 'toUserId is required'
      });
    }

    const ratingResult = await ratingService.createRating(taskId, req.user!.uid, toUserId, {
      rating,
      comment
    });
    
    return res.status(201).json({
      success: true,
      rating: ratingResult
    });
  } catch (error) {
    logger.error('Error creating rating:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create rating'
    });
  }
});

// Get ratings for a specific user
router.get('/users/:userId', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }
    
    const ratings = await ratingService.getUserRatings(userId);
    
    return res.json({
      success: true,
      ratings
    });
  } catch (error) {
    logger.error('Error getting user ratings:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get user ratings'
    });
  }
});

// Get rating summary for a user
router.get('/users/:userId/summary', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }
    
    const summary = await ratingService.getUserRatingSummary(userId);
    
    return res.json({
      success: true,
      summary
    });
  } catch (error) {
    logger.error('Error getting user rating summary:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get user rating summary'
    });
  }
});

// Get ratings for a specific task
router.get('/tasks/:taskId', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }
    
    const ratings = await ratingService.getTaskRatings(taskId);
    
    return res.json({
      success: true,
      ratings
    });
  } catch (error) {
    logger.error('Error getting task ratings:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get task ratings'
    });
  }
});

// Delete a rating
router.delete('/:ratingId', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { ratingId } = req.params;
    if (!ratingId) {
      return res.status(400).json({
        success: false,
        error: 'Rating ID is required'
      });
    }
    
    await ratingService.deleteRating(ratingId, req.user!.uid);
    
    return res.json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting rating:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete rating'
    });
  }
});

export default router;
