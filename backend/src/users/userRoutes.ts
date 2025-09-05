import express from 'express';
import { body, query, validationResult } from 'express-validator';
import UserService from './userService';
import { authMiddleware } from '../utils/auth';
import { AuthenticatedRequest } from '../utils/auth';
import { logger } from '../utils/logger';

const router = express.Router();
const userService = UserService.getInstance();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get user profile by ID
router.get('/:userId', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }
    
    const profile = await userService.getUserProfile(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found'
      });
    }
    
    return res.json({
      success: true,
      profile
    });
  } catch (error) {
    logger.error('Error getting user profile:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get user profile'
    });
  }
});

// Get current user's profile
router.get('/me/profile', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const profile = await userService.getUserProfile(req.user!.uid);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found. Please complete your profile setup.'
      });
    }
    
    return res.json({
      success: true,
      profile
    });
  } catch (error) {
    logger.error('Error getting current user profile:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
});

// Update current user's profile
router.put('/me/profile', [
  body('displayName').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('avatar').optional().isString().trim(),
  body('bio').optional().isString().trim().isLength({ max: 500 }),
  body('subjects').optional().isArray(),
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

    const updates = req.body;
    const profile = await userService.updateUserProfile(req.user!.uid, updates);
    
    return res.json({
      success: true,
      profile
    });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile'
    });
  }
});

// Get current user's statistics
router.get('/me/stats', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const stats = await userService.getUserStats(req.user!.uid);
    
    return res.json({
      success: true,
      stats
    });
  } catch (error) {
    logger.error('Error getting user stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get user stats'
    });
  }
});

// Search users
router.get('/search', [
  query('q').optional().isString().trim(),
  query('subjects').optional().isString(),
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

    const query = req.query['q'] as string;
    const subjects = req.query['subjects'] ? (req.query['subjects'] as string).split(',') : undefined;
    
    const users = await userService.searchUsers(query, subjects);
    
    return res.json({
      success: true,
      users
    });
  } catch (error) {
    logger.error('Error searching users:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to search users'
    });
  }
});

// Get top rated users
router.get('/top-rated', [
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

    const limit = req.query['limit'] ? Number(req.query['limit']) : 10;
    const users = await userService.getTopRatedUsers(limit);
    
    return res.json({
      success: true,
      users
    });
  } catch (error) {
    logger.error('Error getting top rated users:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get top rated users'
    });
  }
});

// Delete current user's profile
router.delete('/me/profile', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    await userService.deleteUserProfile(req.user!.uid);
    
    return res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting user profile:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete profile'
    });
  }
});

export default router;
