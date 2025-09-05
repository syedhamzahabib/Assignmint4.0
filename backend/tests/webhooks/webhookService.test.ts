import { WebhookService } from '../../src/webhooks/webhookService';

// Mock Firebase Admin
const mockFirestore = {
  collection: jest.fn(),
  doc: jest.fn(),
  add: jest.fn(),
  update: jest.fn(),
  get: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn()
};

const mockCollection = {
  doc: jest.fn(),
  add: jest.fn(),
  get: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn()
};

const mockDoc = {
  get: jest.fn(),
  set: jest.fn(),
  update: jest.fn()
};

jest.mock('firebase-admin', () => ({
  firestore: () => mockFirestore
}));

describe('WebhookService', () => {
  let webhookService: WebhookService;

  beforeEach(() => {
    jest.clearAllMocks();
    webhookService = new WebhookService();
    
    mockFirestore.collection.mockReturnValue(mockCollection);
    mockCollection.doc.mockReturnValue(mockDoc);
    mockCollection.add.mockResolvedValue({ id: 'webhook-1' });
    mockDoc.get.mockResolvedValue({ exists: true, data: () => ({}) });
  });

  describe('registerHandler', () => {
    it('should register a webhook handler', () => {
      const eventType = 'payment.succeeded';
      const handler = {
        process: jest.fn().mockResolvedValue(true)
      };

      webhookService.registerHandler(eventType, handler);
      expect(webhookService['handlers'].has(eventType)).toBe(true);
    });

    it('should override existing handler', () => {
      const eventType = 'payment.succeeded';
      const handler1 = { process: jest.fn() };
      const handler2 = { process: jest.fn() };

      webhookService.registerHandler(eventType, handler1);
      webhookService.registerHandler(eventType, handler2);

      expect(webhookService['handlers'].get(eventType)).toBe(handler2);
    });
  });

  describe('processWebhook', () => {
    it('should process webhook successfully', async () => {
      const eventType = 'payment.succeeded';
      const payload = { amount: 100 };
      const handler = {
        process: jest.fn().mockResolvedValue(true)
      };

      webhookService.registerHandler(eventType, handler);

      const result = await webhookService.processWebhook(eventType, payload);
      expect(result).toBe(true);
      expect(handler.process).toHaveBeenCalledWith(payload);
    });

    it('should handle handler errors gracefully', async () => {
      const eventType = 'payment.succeeded';
      const payload = { amount: 100 };
      const handler = {
        process: jest.fn().mockRejectedValue(new Error('Handler error'))
      };

      webhookService.registerHandler(eventType, handler);

      const result = await webhookService.processWebhook(eventType, payload);
      expect(result).toBe(false);
    });

    it('should return false for unregistered event types', async () => {
      const result = await webhookService.processWebhook('unknown.event', {});
      expect(result).toBe(false);
    });
  });

  describe('retryFailedWebhooks', () => {
    it('should retry failed webhooks successfully', async () => {
      const failedWebhook = {
        id: 'webhook-1',
        eventType: 'payment.succeeded',
        payload: { amount: 100 },
        attempts: 1,
        lastAttempt: new Date(),
        nextRetry: new Date()
      };

      // Mock the failed webhooks collection
      const mockFailedWebhooks = new Map();
      mockFailedWebhooks.set('webhook-1', failedWebhook);
      
      // Mock the retry method to return success
      const mockRetryResult = { retried: 1, successful: 1, failed: 0 };
      jest.spyOn(webhookService as any, 'retryWebhook').mockResolvedValue(mockRetryResult);

      const result = await webhookService.retryFailedWebhooks();
      expect(result.retried).toBe(1);
      expect(result.successful).toBe(1);
      expect(result.failed).toBe(0);
    });

    it('should handle retry failures', async () => {
      const failedWebhook = {
        id: 'webhook-2',
        eventType: 'payment.succeeded',
        payload: { amount: 100 },
        attempts: 3,
        lastAttempt: new Date(),
        nextRetry: new Date()
      };

      // Mock the failed webhooks collection
      const mockFailedWebhooks = new Map();
      mockFailedWebhooks.set('webhook-2', failedWebhook);
      
      // Mock the retry method to return failure
      const mockRetryResult = { retried: 1, successful: 0, failed: 1 };
      jest.spyOn(webhookService as any, 'retryWebhook').mockResolvedValue(mockRetryResult);

      const result = await webhookService.retryFailedWebhooks();
      expect(result.retried).toBe(1);
      expect(result.successful).toBe(0);
      expect(result.failed).toBe(1);
    });
  });

  describe('processStripeWebhook', () => {
    it('should process Stripe payment succeeded webhook', async () => {
      const payload = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_123',
            amount: 1000,
            customer: 'cus_123'
          }
        }
      };

      const result = await webhookService.processStripeWebhook(payload);
      expect(result).toBe(true);
    });

    it('should process Stripe subscription created webhook', async () => {
      const payload = {
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_123',
            customer: 'cus_123',
            status: 'active'
          }
        }
      };

      const result = await webhookService.processStripeWebhook(payload);
      expect(result).toBe(true);
    });

    it('should process Stripe subscription updated webhook', async () => {
      const payload = {
        type: 'customer.subscription.updated',
        data: {
          object: {
            id: 'sub_123',
            customer: 'cus_123',
            status: 'past_due'
          }
        }
      };

      const result = await webhookService.processStripeWebhook(payload);
      expect(result).toBe(true);
    });

    it('should process Stripe subscription deleted webhook', async () => {
      const payload = {
        type: 'customer.subscription.deleted',
        data: {
          object: {
            id: 'sub_123',
            customer: 'cus_123',
            status: 'canceled'
          }
        }
      };

      const result = await webhookService.processStripeWebhook(payload);
      expect(result).toBe(true);
    });
  });

  describe('processTaskWebhook', () => {
    it('should process task assigned webhook', async () => {
      const payload = {
        type: 'task.assigned',
        data: {
          taskId: 'task_123',
          expertId: 'expert_123',
          ownerId: 'owner_123'
        }
      };

      const result = await webhookService.processTaskWebhook(payload);
      expect(result).toBe(true);
    });

    it('should process task completed webhook', async () => {
      const payload = {
        type: 'task.completed',
        data: {
          taskId: 'task_123',
          expertId: 'expert_123',
          ownerId: 'owner_123'
        }
      };

      const result = await webhookService.processTaskWebhook(payload);
      expect(result).toBe(true);
    });
  });

  describe('processRatingWebhook', () => {
    it('should process rating submitted webhook', async () => {
      const payload = {
        type: 'rating.submitted',
        data: {
          taskId: 'task_123',
          fromUserId: 'user_123',
          toUserId: 'expert_123',
          rating: 5
        }
      };

      // Mock user data
      const mockUserData = {
        totalRatings: 10,
        avgRating: 4.5
      };

      mockDoc.get.mockResolvedValue({
        exists: true,
        data: () => mockUserData
      });

      const result = await webhookService.processRatingWebhook(payload);
      expect(result).toBe(true);
    });
  });

  describe('getWebhookHistory', () => {
    it('should return webhook history', async () => {
      const mockHistory = [
        { id: 'webhook-1', eventType: 'payment.succeeded', status: 'success' },
        { id: 'webhook-2', eventType: 'payment.failed', status: 'failed' }
      ];

      mockCollection.get.mockResolvedValue({
        docs: mockHistory.map(item => ({ data: () => item, id: item.id }))
      });

      const history = await webhookService.getWebhookHistory();
      expect(history).toHaveLength(2);
    });
  });

  describe('getWebhookStats', () => {
    it('should return webhook statistics', async () => {
      const stats = webhookService.getWebhookStats();
      expect(stats).toBeDefined();
      expect(typeof stats.total).toBe('number');
      expect(typeof stats.successful).toBe('number');
      expect(typeof stats.failed).toBe('number');
    });
  });
});
