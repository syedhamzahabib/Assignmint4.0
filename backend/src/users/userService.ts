import { db } from '../index';
import { UserProfile, UpdateProfileRequest, UserStats } from './userModels';
import { logger } from '../utils/logger';

export class UserService {
  private static instance: UserService;

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // Get user profile by ID
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        return null;
      }

      const data = userDoc.data();
      return {
        id: userDoc.id,
        ...data,
        createdAt: data!['createdAt'].toDate(),
        updatedAt: data!['updatedAt'].toDate(),
      } as UserProfile;
    } catch (error) {
      logger.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Create or update user profile
  async upsertUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const userRef = db.collection('users').doc(userId);
      
      const profile: Omit<UserProfile, 'id'> = {
        displayName: profileData.displayName || 'Anonymous User',
        avatar: profileData.avatar,
        bio: profileData.bio || '',
        subjects: profileData.subjects || [],
        avgRating: profileData.avgRating || 0,
        totalRatings: profileData.totalRatings || 0,
        completedTasks: profileData.completedTasks || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await userRef.set(profile, { merge: true });

      logger.info(`User profile upserted: ${userId}`);
      return {
        id: userId,
        ...profile,
      };
    } catch (error) {
      logger.error('Error upserting user profile:', error);
      throw error;
    }
  }

  // Update existing user profile
  async updateUserProfile(userId: string, updates: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const userRef = db.collection('users').doc(userId);
      
      const result = await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        
        if (!userDoc.exists) {
          throw new Error('User profile not found');
        }

        const currentProfile = userDoc.data() as UserProfile;
        const updatedProfile = {
          ...currentProfile,
          ...updates,
          updatedAt: new Date(),
        };

        transaction.update(userRef, updatedProfile as any);
        return updatedProfile;
      });

      logger.info(`User profile updated: ${userId}`);
      return result as UserProfile;
    } catch (error) {
      logger.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Get user statistics
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Get user profile for basic stats
      const profile = await this.getUserProfile(userId);
      if (!profile) {
        throw new Error('User profile not found');
      }

      // Get tasks posted by user
      const postedTasksSnapshot = await db
        .collection('tasks')
        .where('ownerId', '==', userId)
        .get();

      const postedTasks = postedTasksSnapshot.size;

      // Get tasks claimed by user
      const claimedTasksSnapshot = await db
        .collection('tasks')
        .where('expertId', '==', userId)
        .get();

      const claimedTasks = claimedTasksSnapshot.size;

      // Get completed tasks
      const completedTasksSnapshot = await db
        .collection('tasks')
        .where('expertId', '==', userId)
        .where('status', '==', 'completed')
        .get();

      const completedTasks = completedTasksSnapshot.size;

      // Calculate earnings (sum of completed task prices)
      let earnings = 0;
      completedTasksSnapshot.docs.forEach((doc: any) => {
        const task = doc.data();
        earnings += task.price || 0;
      });

      return {
        postedTasks,
        claimedTasks,
        completedTasks,
        earnings: Math.round(earnings * 100) / 100, // Round to 2 decimal places
        avgRating: profile.avgRating,
        totalRatings: profile.totalRatings,
      };
    } catch (error) {
      logger.error('Error getting user stats:', error);
      throw error;
    }
  }

  // Search users by name or subjects
  async searchUsers(query?: string, subjects?: string[]): Promise<UserProfile[]> {
    try {
      let userQuery: any = db.collection('users');
      
      if (query) {
        // Search by display name (case-insensitive)
        userQuery = userQuery.where('displayName', '>=', query)
                           .where('displayName', '<=', query + '\uf8ff');
      }
      
      if (subjects && subjects.length > 0) {
        // Search by subjects (array contains any)
        userQuery = userQuery.where('subjects', 'array-contains-any', subjects);
      }

      const snapshot = await userQuery.limit(20).get();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()['createdAt'].toDate(),
        updatedAt: doc.data()['updatedAt'].toDate(),
      })) as UserProfile[];
    } catch (error) {
      logger.error('Error searching users:', error);
      throw error;
    }
  }

  // Get top rated users
  async getTopRatedUsers(limit: number = 10): Promise<UserProfile[]> {
    try {
      const snapshot = await db
        .collection('users')
        .where('avgRating', '>', 0)
        .orderBy('avgRating', 'desc')
        .orderBy('totalRatings', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()['createdAt'].toDate(),
        updatedAt: doc.data()['updatedAt'].toDate(),
      })) as UserProfile[];
    } catch (error) {
      logger.error('Error getting top rated users:', error);
      throw error;
    }
  }

  // Delete user profile
  async deleteUserProfile(userId: string): Promise<void> {
    try {
      await db.collection('users').doc(userId).delete();
      
      logger.info(`User profile deleted: ${userId}`);
    } catch (error) {
      logger.error('Error deleting user profile:', error);
      throw error;
    }
  }
}

export default UserService;
