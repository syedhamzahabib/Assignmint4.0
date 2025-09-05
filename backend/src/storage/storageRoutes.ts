import express from 'express';
import { authMiddleware } from '../utils/auth';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Upload file
router.post('/upload', (_req, res) => {
  res.json({
    success: true,
    message: 'File upload endpoint'
  });
});

export default router;
