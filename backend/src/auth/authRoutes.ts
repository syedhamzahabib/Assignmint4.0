import { Router } from 'express';
import { authController } from './authController';

const router = Router();

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.delete('/account', authController.deleteAccount);

export default router;
