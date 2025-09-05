import { TaskMessage, CreateMessageRequest } from './messageModels';
import { db } from '../index';
import { logger } from '../utils/logger';

export class MessageService {
  private static instance: MessageService;

  private constructor() {}

  static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  // Get all messages for a specific task
  async getTaskMessages(taskId: string): Promise<TaskMessage[]> {
    try {
      const messagesSnapshot = await db
        .collection('taskMessages')
        .doc(taskId)
        .collection('messages')
        .orderBy('createdAt', 'asc')
        .get();

      return messagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()['createdAt'].toDate(),
      })) as TaskMessage[];
    } catch (error) {
      logger.error('Error getting task messages:', error);
      throw error;
    }
  }

  // Create a new message
  async createMessage(taskId: string, senderId: string, messageData: CreateMessageRequest): Promise<TaskMessage> {
    try {
      const messageRef = db
        .collection('taskMessages')
        .doc(taskId)
        .collection('messages')
        .doc();

      const message: Omit<TaskMessage, 'id'> = {
        taskId,
        senderId,
        text: messageData.text,
        createdAt: new Date(),
      };

      await messageRef.set(message);

      return {
        id: messageRef.id,
        ...message,
      };
    } catch (error) {
      logger.error('Error creating message:', error);
      throw error;
    }
  }

  // Delete a message (only by sender)
  async deleteMessage(messageId: string, userId: string): Promise<void> {
    try {
      // Find the message first to check ownership
      const messageSnapshot = await db
        .collectionGroup('messages')
        .where('__name__', '==', messageId)
        .get();

      if (messageSnapshot.empty) {
        throw new Error('Message not found');
      }

      const messageDoc = messageSnapshot.docs[0];
      if (!messageDoc) {
        throw new Error('Message not found');
      }

      const messageData = messageDoc.data();

      if (messageData['senderId'] !== userId) {
        throw new Error('Cannot delete message: not the sender');
      }

      await messageDoc.ref.delete();
    } catch (error) {
      logger.error('Error deleting message:', error);
      throw error;
    }
  }

  // Get message count for a task
  async getTaskMessageCount(taskId: string): Promise<number> {
    try {
      const snapshot = await db
        .collection('taskMessages')
        .doc(taskId)
        .collection('messages')
        .count()
        .get();

      return snapshot.data().count;
    } catch (error) {
      logger.error('Error getting message count:', error);
      return 0;
    }
  }
}

export default MessageService;
