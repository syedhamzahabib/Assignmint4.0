import { db } from '../index';
import { Notification, NotificationType, CreateNotificationRequest, NotificationListResponse } from './notificationModels';
import { logger } from '../utils/logger';

export class NotificationService {
  private static instance: NotificationService;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Create a notification
  async createNotification(userId: string, notificationData: CreateNotificationRequest): Promise<Notification> {
    try {
      const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const notification: Notification = {
        id: notificationId,
        userId,
        type: notificationData.type,
        taskId: notificationData.taskId || '',
        message: notificationData.message,
        read: false,
        createdAt: new Date(),
      };

      await db.collection('notifications').doc(notificationId).set(notification);

      logger.info(`Notification created: ${notificationId} for user: ${userId}`);
      return notification;
    } catch (error) {
      logger.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  // Get user's notifications with pagination
  async getUserNotifications(
    userId: string, 
    page: number = 1, 
    limit: number = 20,
    unreadOnly: boolean = false
  ): Promise<NotificationListResponse> {
    try {
      let query = db.collection('notifications').where('userId', '==', userId);
      
      if (unreadOnly) {
        query = query.where('read', '==', false);
      }

      const snapshot = await query
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset((page - 1) * limit)
        .get();

      const totalSnapshot = await query.count().get();
      const unreadSnapshot = await db
        .collection('notifications')
        .where('userId', '==', userId)
        .where('read', '==', false)
        .count()
        .get();

      const notifications = snapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data()['createdAt'].toDate(),
      })) as Notification[];

      return {
        notifications,
        total: totalSnapshot.data().count,
        unreadCount: unreadSnapshot.data().count,
      };
    } catch (error) {
      logger.error('Error getting user notifications:', error);
      throw new Error('Failed to get notifications');
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      const notificationRef = db.collection('notifications').doc(notificationId);
      
      await db.runTransaction(async (transaction) => {
        const notificationDoc = await transaction.get(notificationRef);
        
        if (!notificationDoc.exists) {
          throw new Error('Notification not found');
        }

        const notification = notificationDoc.data() as Notification;
        
        if (notification.userId !== userId) {
          throw new Error('Cannot mark notification as read for another user');
        }

        transaction.update(notificationRef, { read: true });
      });

      logger.info(`Notification marked as read: ${notificationId} by user: ${userId}`);
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      const batch = db.batch();
      
      const unreadNotifications = await db
        .collection('notifications')
        .where('userId', '==', userId)
        .where('read', '==', false)
        .get();

      unreadNotifications.docs.forEach(doc => {
        batch.update(doc.ref, { read: true });
      });

      await batch.commit();

      logger.info(`All notifications marked as read for user: ${userId}`);
    } catch (error) {
      logger.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete a notification
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    try {
      const notificationRef = db.collection('notifications').doc(notificationId);
      
      await db.runTransaction(async (transaction) => {
        const notificationDoc = await transaction.get(notificationRef);
        
        if (!notificationDoc.exists) {
          throw new Error('Notification not found');
        }

        const notification = notificationDoc.data() as Notification;
        
        if (notification.userId !== userId) {
          throw new Error('Cannot delete notification for another user');
        }

        transaction.delete(notificationRef);
      });

      logger.info(`Notification deleted: ${notificationId} by user: ${userId}`);
    } catch (error) {
      logger.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Delete all notifications for a user
  async deleteAllUserNotifications(userId: string): Promise<void> {
    try {
      const batch = db.batch();
      
      const userNotifications = await db
        .collection('notifications')
        .where('userId', '==', userId)
        .get();

      userNotifications.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      logger.info(`All notifications deleted for user: ${userId}`);
    } catch (error) {
      logger.error('Error deleting all user notifications:', error);
      throw error;
    }
  }

  // Helper function to create task-related notifications
  async createTaskNotification(
    userId: string,
    type: NotificationType,
    taskId: string,
    message: string
  ): Promise<Notification> {
    return this.createNotification(userId, {
      type,
      taskId,
      message,
    });
  }

  // Helper function to create system notifications
  async createSystemNotification(
    userId: string,
    message: string
  ): Promise<Notification> {
    return this.createNotification(userId, {
      type: 'system_message',
      message,
    });
  }

  // Get notification count for a user
  async getNotificationCount(userId: string, unreadOnly: boolean = false): Promise<number> {
    try {
      let query = db.collection('notifications').where('userId', '==', userId);
      
      if (unreadOnly) {
        query = query.where('read', '==', false);
      }

      const snapshot = await query.count().get();
      return snapshot.data().count;
    } catch (error) {
      logger.error('Error getting notification count:', error);
      return 0;
    }
  }
}

export default NotificationService;
