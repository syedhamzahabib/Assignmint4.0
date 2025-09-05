import { Rating, CreateRatingRequest, UserRatingSummary } from './ratingModels';
import { db } from '../index';
import { logger } from '../utils/logger';

export class RatingService {
  private static instance: RatingService;

  static getInstance(): RatingService {
    if (!RatingService.instance) {
      RatingService.instance = new RatingService();
    }
    return RatingService.instance;
  }

  // Create a new rating
  async createRating(
    taskId: string,
    fromUserId: string,
    toUserId: string,
    ratingData: CreateRatingRequest
  ): Promise<Rating> {
    try {
      // Validate rating range
      if (ratingData.rating < 1 || ratingData.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const ratingId = `rating_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const rating: Rating = {
        id: ratingId,
        taskId,
        fromUserId,
        toUserId,
        rating: ratingData.rating,
        comment: ratingData.comment,
        createdAt: new Date(),
      };

      await db.collection('ratings').doc(ratingId).set(rating);

      // Update user's average rating
      await this.updateUserRatingSummary(toUserId);

      logger.info(`Rating created: ${ratingId} from ${fromUserId} to ${toUserId}`);
      return rating;
    } catch (error) {
      logger.error('Error creating rating:', error);
      throw error;
    }
  }

  // Get all ratings for a specific user
  async getUserRatings(userId: string): Promise<Rating[]> {
    try {
      const ratingsSnapshot = await db
        .collection('ratings')
        .where('toUserId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      return ratingsSnapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data()['createdAt'].toDate(),
      })) as Rating[];
    } catch (error) {
      logger.error('Error getting user ratings:', error);
      throw error;
    }
  }

  // Get rating summary for a user
  async getUserRatingSummary(userId: string): Promise<UserRatingSummary> {
    try {
      const ratings = await this.getUserRatings(userId);
      
      if (ratings.length === 0) {
        return {
          averageRating: 0,
          totalRatings: 0,
          ratingDistribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
        };
      }

      const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / ratings.length;

      // Calculate rating distribution
      const distribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
      ratings.forEach(r => {
        distribution[r.rating.toString() as keyof typeof distribution]++;
      });

      return {
        averageRating: Math.round(avgRating * 100) / 100, // Round to 2 decimal places
        totalRatings: ratings.length,
        ratingDistribution: distribution,
      };
    } catch (error) {
      logger.error('Error getting user rating summary:', error);
      throw error;
    }
  }

  // Get ratings for a specific task
  async getTaskRatings(taskId: string): Promise<Rating[]> {
    try {
      const ratingsSnapshot = await db
        .collection('ratings')
        .where('taskId', '==', taskId)
        .orderBy('createdAt', 'desc')
        .get();

      return ratingsSnapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data()['createdAt'].toDate(),
      })) as Rating[];
    } catch (error) {
      logger.error('Error getting task ratings:', error);
      throw error;
    }
  }

  // Check if a user has already rated a task
  async hasUserRatedTask(taskId: string, userId: string): Promise<boolean> {
    try {
      const ratingSnapshot = await db
        .collection('ratings')
        .where('taskId', '==', taskId)
        .where('fromUserId', '==', userId)
        .limit(1)
        .get();

      return !ratingSnapshot.empty;
    } catch (error) {
      logger.error('Error checking if user rated task:', error);
      return false;
    }
  }

  // Delete a rating (only by creator)
  async deleteRating(ratingId: string, userId: string): Promise<void> {
    try {
      const ratingRef = db.collection('ratings').doc(ratingId);
      
      await db.runTransaction(async (transaction) => {
        const ratingDoc = await transaction.get(ratingRef);
        
        if (!ratingDoc.exists) {
          throw new Error('Rating not found');
        }

        const rating = ratingDoc.data() as Rating;
        
        if (rating.fromUserId !== userId) {
          throw new Error('Cannot delete rating: not the creator');
        }

        transaction.delete(ratingRef);
      });

      // Update user's average rating
      await this.updateUserRatingSummary(ratingId);

      logger.info(`Rating deleted: ${ratingId} by user: ${userId}`);
    } catch (error) {
      logger.error('Error deleting rating:', error);
      throw error;
    }
  }

  // Get a specific rating by ID
  async getRatingById(ratingId: string): Promise<Rating | null> {
    try {
      const ratingDoc = await db.collection('ratings').doc(ratingId).get();
      
      if (!ratingDoc.exists) {
        return null;
      }

      const data = ratingDoc.data();
      if (!data) {
        return null;
      }

      return {
        id: ratingDoc.id,
        ...data,
        createdAt: data['createdAt'].toDate(),
      } as Rating;
    } catch (error) {
      logger.error('Error getting rating by ID:', error);
      throw error;
    }
  }

  // Update user's rating summary in the users collection
  private async updateUserRatingSummary(userId: string): Promise<void> {
    try {
      const summary = await this.getUserRatingSummary(userId);
      
      await db.collection('users').doc(userId).update({
        avgRating: summary.averageRating,
        totalRatings: summary.totalRatings,
        ratingDistribution: summary.ratingDistribution,
        updatedAt: new Date(),
      });
    } catch (error) {
      logger.error('Error updating user rating summary:', error);
      // Don't throw here as this is a background update
    }
  }
}

export default RatingService;
