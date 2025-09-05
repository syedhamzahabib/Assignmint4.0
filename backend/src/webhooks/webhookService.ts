import crypto from 'crypto';
import { logger } from '../utils/logger';
import { db } from '../index';
// Firebase admin is used for Firestore operations

export interface WebhookPayload {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  signature?: string;
}

export interface WebhookHandler {
  type: string;
  handler: (payload: any) => Promise<void>;
}

export class WebhookService {
  private handlers: Map<string, WebhookHandler['handler']> = new Map();
  private secret: string;

  constructor() {
    this.secret = process.env['WEBHOOK_SECRET'] || 'default-webhook-secret';
    this.registerDefaultHandlers();
  }

  private registerDefaultHandlers(): void {
    // Stripe webhook handlers
    this.registerHandler('payment_intent.succeeded', this.handlePaymentSuccess.bind(this));
    this.registerHandler('payment_intent.payment_failed', this.handlePaymentFailure.bind(this));
    this.registerHandler('customer.subscription.created', this.handleSubscriptionCreated.bind(this));
    this.registerHandler('customer.subscription.deleted', this.handleSubscriptionDeleted.bind(this));

    // Firebase webhook handlers
    this.registerHandler('user.created', this.handleUserCreated.bind(this));
    this.registerHandler('user.deleted', this.handleUserDeleted.bind(this));

    // Custom webhook handlers
    this.registerHandler('task.completed', this.handleTaskCompleted.bind(this));
    this.registerHandler('rating.submitted', this.handleRatingSubmitted.bind(this));
  }

  registerHandler(type: string, handler: (payload: any) => Promise<void>): void {
    this.handlers.set(type, handler);
    logger.info(`Webhook handler registered for type: ${type}`);
  }

  async processWebhook(payload: WebhookPayload, signature?: string): Promise<boolean> {
    try {
      // Verify signature if provided
      if (signature && !this.verifySignature(payload, signature)) {
        logger.error('Webhook signature verification failed');
        return false;
      }

      // Store webhook for audit
      await this.storeWebhook(payload);

      // Process webhook
      const handler = this.handlers.get(payload.type);
      if (handler) {
        await handler(payload.data);
        logger.info(`Webhook processed successfully: ${payload.type}`);
        return true;
      } else {
        logger.warn(`No handler found for webhook type: ${payload.type}`);
        return false;
      }
    } catch (error) {
      logger.error('Error processing webhook:', error);
      return false;
    }
  }

  async processStripeWebhook(payload: any): Promise<boolean> {
    try {
      const { type, data } = payload;
      
      switch (type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(data);
          break;
        case 'payment_intent.failed':
          await this.handlePaymentFailure(data);
          break;
        case 'subscription.created':
          await this.handleSubscriptionCreated(data);
          break;
        case 'subscription.deleted':
          await this.handleSubscriptionDeleted(data);
          break;
        default:
          logger.warn(`Unknown Stripe webhook type: ${type}`);
          return false;
      }

      return true;
    } catch (error) {
      logger.error('Error processing Stripe webhook:', error);
      return false;
    }
  }

  private verifySignature(payload: WebhookPayload, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.secret)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  private async storeWebhook(payload: WebhookPayload): Promise<void> {
    try {
      await db.collection('webhooks').add({
        ...payload,
        processed: false,
        processedAt: null,
        createdAt: new Date(),
      });
    } catch (error) {
      logger.error('Failed to store webhook:', error);
    }
  }

  // Default webhook handlers
  private async handlePaymentSuccess(data: any): Promise<void> {
    try {
      const { taskId, amount, userId } = data;
      
      // Update task status to paid
      await db.collection('tasks').doc(taskId).update({
        paymentStatus: 'paid',
        paidAt: new Date(),
        amount: amount,
      });

      // Create payment record
      await db.collection('payments').add({
        taskId,
        userId,
        amount,
        status: 'completed',
        stripePaymentIntentId: data.id,
        createdAt: new Date(),
      });

      logger.info(`Payment success processed for task: ${taskId}`);
    } catch (error) {
      logger.error('Error handling payment success:', error);
    }
  }

  private async handlePaymentFailure(data: any): Promise<void> {
    try {
      const { taskId, userId, error } = data;
      
      // Update task payment status
      await db.collection('tasks').doc(taskId).update({
        paymentStatus: 'failed',
        paymentError: error.message,
        updatedAt: new Date(),
      });

      // Create payment failure record
      await db.collection('paymentFailures').add({
        taskId,
        userId,
        error: error.message,
        stripePaymentIntentId: data.id,
        createdAt: new Date(),
      });

      logger.info(`Payment failure processed for task: ${taskId}`);
    } catch (error) {
      logger.error('Error handling payment failure:', error);
    }
  }

  private async handleSubscriptionCreated(data: any): Promise<void> {
    try {
      const { customerId, subscriptionId, planId } = data;
      
      // Update user subscription status
      const userQuery = await db.collection('users').where('stripeCustomerId', '==', customerId).get();
      if (!userQuery.empty && userQuery.docs[0]) {
        const userId = userQuery.docs[0].id;
        await db.collection('users').doc(userId).update({
          subscriptionStatus: 'active',
          subscriptionId,
          planId,
          updatedAt: new Date(),
        });
      }

      logger.info(`Subscription created for customer: ${customerId}`);
    } catch (error) {
      logger.error('Error handling subscription created:', error);
    }
  }

  private async handleSubscriptionDeleted(data: any): Promise<void> {
    try {
      const { customerId } = data;
      
      // Update user subscription status
      const userQuery = await db.collection('users').where('stripeCustomerId', '==', customerId).get();
      if (!userQuery.empty && userQuery.docs[0]) {
        const userId = userQuery.docs[0].id;
        await db.collection('users').doc(userId).update({
          subscriptionStatus: 'cancelled',
          subscriptionId: null,
          planId: null,
          updatedAt: new Date(),
        });
      }

      logger.info(`Subscription deleted for customer: ${customerId}`);
    } catch (error) {
      logger.error('Error handling subscription deleted:', error);
    }
  }

  private async handleUserCreated(data: any): Promise<void> {
    try {
      const { uid, email, displayName } = data;
      
      // Create user profile
      await db.collection('users').doc(uid).set({
        uid,
        email,
        displayName,
        createdAt: new Date(),
        updatedAt: new Date(),
        subscriptionStatus: 'free',
        avgRating: 0,
        totalRatings: 0,
        completedTasks: 0,
      });

      logger.info(`User profile created for: ${uid}`);
    } catch (error) {
      logger.error('Error handling user created:', error);
    }
  }

  private async handleUserDeleted(data: any): Promise<void> {
    try {
      const { uid } = data;
      
      // Mark user as deleted (soft delete)
      await db.collection('users').doc(uid).update({
        deleted: true,
        deletedAt: new Date(),
        updatedAt: new Date(),
      });

      logger.info(`User marked as deleted: ${uid}`);
    } catch (error) {
      logger.error('Error handling user deleted:', error);
    }
  }

  private async handleTaskCompleted(data: any): Promise<void> {
    try {
      const { taskId, expertId } = data;
      
      // Update task status
      await db.collection('tasks').doc(taskId).update({
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date(),
      });

      // Update user statistics
      await db.collection('users').doc(expertId).update({
        completedTasks: (db as any).FieldValue.increment(1),
        updatedAt: new Date(),
      });

      logger.info(`Task completion processed: ${taskId}`);
    } catch (error) {
      logger.error('Error handling task completed:', error);
    }
  }

  private async handleRatingSubmitted(data: any): Promise<void> {
    try {
      const { toUserId, rating } = data;
      
      // Update user rating statistics
      const userRef = db.collection('users').doc(toUserId);
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        const userData = userDoc.data();
        const currentTotal = userData?.['totalRatings'] || 0;
        const currentAvg = userData?.['avgRating'] || 0;
        
        const newTotal = currentTotal + 1;
        const newAvg = ((currentAvg * currentTotal) + rating) / newTotal;
        
        await userRef.update({
          totalRatings: newTotal,
          avgRating: Math.round(newAvg * 100) / 100,
          updatedAt: new Date(),
        });
      }

      logger.info(`Rating processed for user: ${toUserId}`);
    } catch (error) {
      logger.error('Error handling rating submitted:', error);
    }
  }

  async getWebhookHistory(limit: number = 100): Promise<any[]> {
    try {
      const snapshot = await db
        .collection('webhooks')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      logger.error('Error fetching webhook history:', error);
      return [];
    }
  }

  async getWebhookStats(): Promise<{ total: number; processed: number; failed: number; byType: Record<string, number> }> {
    const history = await this.getWebhookHistory(1000);
    
    const stats = {
      total: history.length,
      processed: history.filter((w: any) => w.processed).length,
      failed: history.filter((w: any) => !w.processed).length,
      byType: {} as Record<string, number>,
    };

    // Count by type
    history.forEach((webhook: any) => {
      stats.byType[webhook.type] = (stats.byType[webhook.type] || 0) + 1;
    });
    
    return stats;
  }

  async retryFailedWebhooks(): Promise<{ retried: number; successful: number; failed: number }> {
    try {
      const snapshot = await db
        .collection('webhooks')
        .where('processed', '==', false)
        .get();
      
      let retryCount = 0;
      let successfulCount = 0;
      let failedCount = 0;
      
      for (const doc of snapshot.docs) {
        const webhook = doc.data();
        try {
          const success = await this.processWebhook(webhook as any);
          if (success) {
            await doc.ref.update({
              processed: true,
              processedAt: new Date(),
            });
            successfulCount++;
          } else {
            failedCount++;
          }
          retryCount++;
        } catch (error) {
          logger.error(`Failed to retry webhook ${doc.id}:`, error);
          failedCount++;
          retryCount++;
        }
      }
      
      logger.info(`Retried ${retryCount} failed webhooks: ${successfulCount} successful, ${failedCount} failed`);
      return { retried: retryCount, successful: successfulCount, failed: failedCount };
    } catch (error) {
      logger.error('Error retrying failed webhooks:', error);
      return { retried: 0, successful: 0, failed: 0 };
    }
  }

  // This method is now handled by the main processWebhook method

  // This method is now handled by the main processWebhook method

  // This method is now handled by the main processWebhook method
}

export const webhookService = new WebhookService();




