import { Request, Response } from 'express';
import { auth, db } from '../index';
import { AuthenticatedRequest } from '../utils/auth';
import { logger } from '../utils/logger';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, displayName, userType } = req.body;

      if (!email || !password || !userType) {
        res.status(400).json({ error: 'Email, password, and userType are required' });
        return;
      }

      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
        displayName,
      });

      // Create user profile in Firestore
      const userProfile = {
        uid: userRecord.uid,
        email,
        displayName,
        userType, // 'client' or 'expert'
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: {
          bio: '',
          skills: [],
          rating: 0,
          completedTasks: 0,
        },
      };

      await db.collection('users').doc(userRecord.uid).set(userProfile);

      logger.info('User registered successfully:', { uid: userRecord.uid, email });

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          uid: userRecord.uid,
          email,
          displayName,
          userType,
        },
      });
    } catch (error) {
      logger.error('Registration error:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Registration failed' });
      }
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      // Firebase handles authentication
      // In a real implementation, you would verify credentials
      // For now, we'll return a success response
      res.json({
        message: 'Login successful',
        // In production, you would return a JWT token here
      });
    } catch (error) {
      logger.error('Login error:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Login failed' });
      }
    }
  },

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const userDoc = await db.collection('users').doc(req.user.uid).get();

      if (!userDoc.exists) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        user: userDoc.data(),
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to get profile' });
      }
    }
  },

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { displayName, bio, skills } = req.body;
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (displayName) {updateData.displayName = displayName;}
      if (bio !== undefined) {updateData['profile.bio'] = bio;}
      if (skills) {updateData['profile.skills'] = skills;}

      await db.collection('users').doc(req.user.uid).update(updateData);

      logger.info('Profile updated successfully:', { uid: req.user.uid });

      res.json({
        message: 'Profile updated successfully',
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update profile' });
      }
    }
  },

  async deleteAccount(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Delete user from Firebase Auth
      await auth.deleteUser(req.user.uid);

      // Delete user data from Firestore
      await db.collection('users').doc(req.user.uid).delete();

      logger.info('Account deleted successfully:', { uid: req.user.uid });

      res.json({
        message: 'Account deleted successfully',
      });
    } catch (error) {
      logger.error('Delete account error:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to delete account' });
      }
    }
  },
};
