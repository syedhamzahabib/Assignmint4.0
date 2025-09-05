import express from 'express';
import { authMiddleware } from '../utils/auth';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get analytics dashboard
router.get('/dashboard', (_req, res) => {
  res.json({
    success: true,
    message: 'Analytics dashboard would be returned here'
  });
});

export default router;
