import { EmailService } from '../../src/email/emailService';

// Mock nodemailer
const mockTransporter = {
  sendMail: jest.fn(),
  verify: jest.fn()
};

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => mockTransporter)
}));

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    jest.clearAllMocks();
    emailService = new EmailService();
  });

  describe('constructor', () => {
    it('should initialize with SMTP configuration', () => {
      expect(emailService).toBeInstanceOf(EmailService);
    });

    it('should use environment variables for SMTP config', () => {
      const smtpConfig = {
        host: process.env['SMTP_HOST'],
        port: parseInt(process.env['SMTP_PORT'] || '587'),
        secure: false,
        auth: {
          user: process.env['SMTP_USER'],
          pass: process.env['SMTP_PASS'],
        }
      };

      expect(smtpConfig.host).toBeDefined();
      expect(smtpConfig.port).toBeDefined();
    });
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>',
        text: 'Test content'
      };

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id'
      });

      const result = await emailService.sendEmail(emailOptions);
      expect(result).toBe(true);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: expect.any(String),
        to: emailOptions.to,
        subject: emailOptions.subject,
        html: emailOptions.html,
        text: emailOptions.text
      });
    });

    it('should handle email sending failure', async () => {
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>',
        text: 'Test content'
      };

      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP connection failed'));

      const result = await emailService.sendEmail(emailOptions);
      expect(result).toBe(false);
    });

    it('should handle text-only emails', async () => {
      const textOnlyOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test content',
        html: '<p>Test content</p>'
      };

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id'
      });

      await emailService.sendEmail(textOnlyOptions);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: expect.any(String),
        to: textOnlyOptions.to,
        subject: textOnlyOptions.subject,
        html: textOnlyOptions.html,
        text: textOnlyOptions.text
      });
    });
  });

  describe('sendTaskNotification', () => {
    const mockUser = {
      uid: 'user123',
      displayName: 'Test User',
      email: 'test@example.com'
    };

    const mockTask = {
      id: 'task123',
      title: 'Test Task',
      description: 'Test Description'
    };

    it('should send task assignment notification', async () => {
      const type = 'assignment';
      
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id'
      });

      const result = await emailService.sendTaskNotification(mockUser.email, mockTask, type);
      expect(result).toBe(true);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: expect.any(String),
        to: mockUser.email,
        subject: expect.stringContaining('Task Assignment'),
        html: expect.stringContaining(mockTask.title),
        text: expect.stringContaining(mockTask.title)
      });
    });

    it('should send task completion notification', async () => {
      const type = 'completion';
      
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id'
      });

      const result = await emailService.sendTaskNotification(mockUser.email, mockTask, type);
      expect(result).toBe(true);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: expect.any(String),
        to: mockUser.email,
        subject: expect.stringContaining('Task Completed'),
        html: expect.stringContaining(mockTask.title),
        text: expect.stringContaining(mockTask.title)
      });
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email successfully', async () => {
      const email = 'newuser@example.com';
      const displayName = 'New User';
      
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id'
      });

      const result = await emailService.sendWelcomeEmail(email, displayName);
      expect(result).toBe(true);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: expect.any(String),
        to: email,
        subject: expect.stringContaining('Welcome'),
        html: expect.stringContaining(displayName),
        text: expect.stringContaining(displayName)
      });
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email successfully', async () => {
      const email = 'user@example.com';
      const resetToken = 'reset-token-123';
      
      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id'
      });

      const result = await emailService.sendPasswordResetEmail(email, resetToken);
      expect(result).toBe(true);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: expect.any(String),
        to: email,
        subject: expect.stringContaining('Password Reset'),
        html: expect.stringContaining(resetToken),
        text: expect.stringContaining(resetToken)
      });
    });
  });

  describe('sendBulkEmail', () => {
    it('should send bulk emails successfully', async () => {
      const recipients = ['user1@example.com', 'user2@example.com'];
      const subject = 'Bulk Test';
      const html = '<p>Bulk content</p>';
      const text = 'Bulk content';

      mockTransporter.sendMail.mockResolvedValue({
        messageId: 'test-message-id'
      });

      const result = await emailService.sendBulkEmail(recipients, subject, html, text);
      expect(result).toBe(true);

      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2);
    });

    it('should handle bulk email failure', async () => {
      const recipients = ['user1@example.com'];
      const subject = 'Bulk Test';
      const html = '<p>Bulk content</p>';
      const text = 'Bulk content';

      mockTransporter.sendMail.mockRejectedValue(new Error('Connection failed'));

      const result = await emailService.sendBulkEmail(recipients, subject, html, text);
      expect(result).toBe(false);
    });
  });

  describe('testConnection', () => {
    it('should test SMTP connection successfully', async () => {
      mockTransporter.verify.mockResolvedValue(true);

      const result = await emailService.testConnection();
      expect(result).toBe(true);
    });

    it('should handle connection test failure', async () => {
      mockTransporter.verify.mockRejectedValue(new Error('Connection failed'));

      const result = await emailService.testConnection();
      expect(result).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle missing SMTP configuration', async () => {
      delete process.env['SMTP_HOST'];
      delete process.env['SMTP_PORT'];

      const emailService = new EmailService();
      const emailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>',
        text: 'Test content'
      };

      const result = await emailService.sendEmail(emailOptions);
      expect(result).toBe(false);
    });

    it('should handle invalid email options', async () => {
      const invalidEmailOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test content'
      };

      const result = await emailService.sendEmail(invalidEmailOptions as any);
      expect(result).toBe(false);
    });
  });
});
