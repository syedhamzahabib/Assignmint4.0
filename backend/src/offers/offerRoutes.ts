import express from 'express';
import { authMiddleware } from '../utils/auth';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all offers
router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Offers list would be returned here'
  });
});

// Create a new offer
router.post('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Offer creation endpoint'
  });
});

export default router;
