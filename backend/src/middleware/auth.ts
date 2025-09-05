import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../utils/auth';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  // In a real implementation, you would verify the JWT token here
  // For now, we'll just add the user info to the request
  (req as AuthenticatedRequest).user = {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User'
  };

  next();
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;
    
    if (!user) {
      res.status(403).json({ error: 'User not authenticated' });
      return;
    }

    // For now, we'll assume admin role for testing
    if (!allowedRoles.includes('admin')) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};
