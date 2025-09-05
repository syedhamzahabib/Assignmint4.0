import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env['SMTP_HOST'] || 'smtp.gmail.com',
      port: parseInt(process.env['SMTP_PORT'] || '587'),
      secure: false,
      auth: {
        user: process.env['SMTP_USER'] || '',
        pass: process.env['SMTP_PASS'] || '',
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: options.from || process.env['SMTP_FROM'] || 'noreply@assignmint.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.htmlToText(options.html),
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error('Failed to send email:', error);
      return false;
    }
  }

  async sendTaskNotification(
    to: string,
    taskTitle: string,
    notificationType: 'claimed' | 'submitted' | 'accepted' | 'rejected'
  ): Promise<boolean> {
    const templates = {
      claimed: {
        subject: 'Your task has been claimed!',
        html: `
          <h2>Great news! Your task has been claimed.</h2>
          <p><strong>Task:</strong> ${taskTitle}</p>
          <p>An expert is now working on your task. You'll be notified when they submit their work.</p>
          <p>Thank you for using AssignMint!</p>
        `,
      },
      submitted: {
        subject: 'Work submitted for your task',
        html: `
          <h2>Work has been submitted for your task!</h2>
          <p><strong>Task:</strong> ${taskTitle}</p>
          <p>Please review the submitted work and accept or reject it.</p>
          <p>Thank you for using AssignMint!</p>
        `,
      },
      accepted: {
        subject: 'Your work has been accepted!',
        html: `
          <h2>Congratulations! Your work has been accepted.</h2>
          <p><strong>Task:</strong> ${taskTitle}</p>
          <p>Great job! The student was satisfied with your work.</p>
          <p>Thank you for using AssignMint!</p>
        `,
      },
      rejected: {
        subject: 'Work needs revision',
        html: `
          <h2>Your work needs some revision.</h2>
          <p><strong>Task:</strong> ${taskTitle}</p>
          <p>Please review the feedback and submit an updated version.</p>
          <p>Thank you for using AssignMint!</p>
        `,
      },
    };

    const template = templates[notificationType];
    return this.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
    });
  }

  async sendWelcomeEmail(to: string, displayName: string): Promise<boolean> {
    const html = `
      <h2>Welcome to AssignMint, ${displayName}!</h2>
      <p>We're excited to have you on board. Here's what you can do:</p>
      <ul>
        <li>Post tasks and get help from experts</li>
        <li>Claim tasks and earn money</li>
        <li>Connect with other students and experts</li>
      </ul>
      <p>Get started by posting your first task or browsing available opportunities!</p>
      <p>Thank you for choosing AssignMint!</p>
    `;

    return this.sendEmail({
      to,
      subject: 'Welcome to AssignMint!',
      html,
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env['FRONTEND_URL']}/reset-password?token=${resetToken}`;
    const html = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your AssignMint account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `;

    return this.sendEmail({
      to,
      subject: 'Reset Your AssignMint Password',
      html,
    });
  }

  async sendBulkEmail(recipients: string[], subject: string, html: string, text?: string): Promise<boolean> {
    try {
      const promises = recipients.map(recipient => 
        this.sendEmail({
          to: recipient,
          subject,
          html,
          text: text || html,
        })
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(result => result === true).length;
      
      logger.info(`Bulk email sent: ${successCount}/${recipients.length} successful`);
      return successCount === recipients.length;
    } catch (error) {
      logger.error('Failed to send bulk email:', error);
      return false;
    }
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('Email service connection verified');
      return true;
    } catch (error) {
      logger.error('Email service connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
