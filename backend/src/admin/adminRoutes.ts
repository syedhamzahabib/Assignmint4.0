import express from 'express';
import { authMiddleware } from '../utils/auth';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all users (admin only)
router.get('/users', (_req, res) => {
  res.json({
    success: true,
    message: 'Admin endpoint - users list would be returned here'
  });
});

export default router;
