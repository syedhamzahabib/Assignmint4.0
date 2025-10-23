// src/services/fcmService.ts
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import { firestoreService } from './firestoreService';
import { auth, messagingService } from '../lib/firebase';
import Config from 'react-native-config';

class FCMService {
  private fcmToken: string | null = null;

  async initialize(): Promise<void> {
    if (!messagingService) {
      console.log('⚠️ Firebase Messaging not available in React Native - use Expo Notifications instead');
      console.log('TODO: Integrate Expo Notifications for push notifications');
      return;
    }

    try {
      // Request permission for Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('FCM permission not granted');
          return;
        }
      }

      // Get FCM token
      const token = await getToken(messagingService, {
        vapidKey: Config.FB_VAPID_KEY || 'your-vapid-key', // You'll need to add this to your .env
      });
      this.fcmToken = token;
      console.log('FCM Token:', token);

      // Save token to user profile
      if (auth.currentUser) {
        await this.saveTokenToUser(auth.currentUser.uid, token);
      }

      // Set up message handlers
      this.setupMessageHandlers();
    } catch (error) {
      console.error('FCM initialization failed:', error);
    }
  }

  async saveTokenToUser(userId: string, token: string): Promise<void> {
    try {
      await firestoreService.updateUser(userId, {
        fcmToken: token,
      } as any);
      console.log('FCM token saved to user profile');
    } catch (error) {
      console.error('Failed to save FCM token:', error);
    }
  }

  async getToken(): Promise<string | null> {
    if (this.fcmToken) return this.fcmToken;
    
    if (!messagingService) return null;
    
    try {
      const token = await getToken(messagingService, {
        vapidKey: Config.FB_VAPID_KEY || 'your-vapid-key',
      });
      this.fcmToken = token;
      return token;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  }

  private setupMessageHandlers(): void {
    if (!messagingService) return;

    // Handle foreground messages
    onMessage(messagingService, (payload) => {
      console.log('Foreground message received:', payload);
      
      // Show local notification for foreground messages
      if (payload.notification) {
        Alert.alert(
          payload.notification.title || 'New Notification',
          payload.notification.body || '',
          [
            { text: 'OK', onPress: () => {} },
          ]
        );
      }
    });

    // Note: Background message handling and notification tap handling
    // are not available in the Web SDK. These would need to be handled
    // through service workers in a web environment or through native
    // notification handling in React Native.
    console.log('Message handlers set up (foreground only)');
  }

  private handleNotificationTap(remoteMessage: any): void {
    // Handle navigation based on notification data
    const data = remoteMessage.data;
    
    if (data?.taskId) {
      // Navigate to task details
      console.log('Navigate to task:', data.taskId);
    } else if (data?.chatId) {
      // Navigate to chat
      console.log('Navigate to chat:', data.chatId);
    }
  }

  async sendNotificationToUser(
    userId: string,
    title: string,
    body: string,
    data?: { [key: string]: string }
  ): Promise<void> {
    try {
      // This would typically be done via Cloud Functions
      // For now, we'll create a notification document
      await firestoreService.createNotification({
        userId,
        type: 'system',
        title,
        body,
        data,
        isRead: false,
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  async sendTaskNotification(
    userId: string,
    taskId: string,
    type: 'newTask' | 'taskAccepted' | 'taskCompleted',
    title: string,
    body: string
  ): Promise<void> {
    try {
      await firestoreService.createNotification({
        userId,
        type,
        title,
        body,
        taskId,
        isRead: false,
      });
    } catch (error) {
      console.error('Failed to send task notification:', error);
    }
  }

  async sendMessageNotification(
    userId: string,
    chatId: string,
    senderName: string,
    messageText: string
  ): Promise<void> {
    try {
      await firestoreService.createNotification({
        userId,
        type: 'messageReceived',
        title: `New message from ${senderName}`,
        body: messageText,
        chatId,
        isRead: false,
      });
    } catch (error) {
      console.error('Failed to send message notification:', error);
    }
  }
}

export const fcmService = new FCMService();
export default fcmService;
