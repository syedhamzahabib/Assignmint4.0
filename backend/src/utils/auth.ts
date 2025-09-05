import { Request, Response, NextFunction } from 'express';
import { auth } from '../index';
import { logger } from './logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    displayName?: string | undefined;
    photoURL?: string | undefined;
  };
  userId?: string;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // If using mock data, skip Firebase auth
    if (process.env['MOCK_DATA'] === 'true') {
      // For mock mode, create a mock user
      req.user = {
        uid: 'mock-user-id',
        email: 'mock@example.com',
        displayName: 'Mock User',
        photoURL: 'https://via.placeholder.com/150'
      };
      next();
      return;
    }

    // Check if Firebase auth is available
    if (!auth) {
      res.status(500).json({ error: 'Authentication service not available' });
      return;
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      res.status(401).json({ error: 'Invalid token format' });
      return;
    }

    try {
      const decodedToken = await auth.verifyIdToken(token);
      
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        displayName: decodedToken['name'],
        photoURL: decodedToken['picture'],
      };

      logger.info(`User authenticated: ${req.user.uid} (${req.user.email})`);
      next();
    } catch (tokenError) {
      logger.error('Token verification failed:', tokenError);
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const adminMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Check if user has admin role
    const userRecord = await auth.getUser(req.user.uid);
    const customClaims = userRecord.customClaims;

    if (!customClaims || !customClaims['admin']) {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }

    next();
  } catch (error) {
    logger.error('Admin authentication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
