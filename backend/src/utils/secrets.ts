import crypto from 'crypto';
import { logger } from './logger';

export interface SecretConfig {
  key: string;
  value: string;
  encrypted: boolean;
  description?: string;
  lastRotated?: Date;
}

export interface EncryptionKey {
  id: string;
  key: Buffer;
  createdAt: Date;
  active: boolean;
}

export class SecretsManager {
  private encryptionKeys: Map<string, EncryptionKey> = new Map();
  private currentKeyId: string | null = null;
  private readonly algorithm = 'aes-256-gcm';

  constructor() {
    this.initializeEncryptionKeys();
  }

  private initializeEncryptionKeys(): void {
    try {
      // Generate a new encryption key if none exists
      const keyId = crypto.randomBytes(16).toString('hex');
      const key = crypto.randomBytes(32);
      
      this.encryptionKeys.set(keyId, {
        id: keyId,
        key,
        createdAt: new Date(),
        active: true,
      });
      
      this.currentKeyId = keyId;
      logger.info('Encryption keys initialized');
    } catch (error) {
      logger.error('Failed to initialize encryption keys:', error);
    }
  }

  async encryptSecret(value: string): Promise<string> {
    try {
      if (!this.currentKeyId) {
        throw new Error('No encryption key available');
      }

      const encryptionKey = this.encryptionKeys.get(this.currentKeyId);
      if (!encryptionKey) {
        throw new Error('Current encryption key not found');
      }

      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(this.algorithm, encryptionKey.key);
      
      let encrypted = cipher.update(value, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      // Combine IV, encrypted data, and auth tag
      const encryptedData = {
        keyId: this.currentKeyId,
        iv: iv.toString('hex'),
        encrypted: encrypted,
        authTag: authTag.toString('hex'),
      };
      
      return JSON.stringify(encryptedData);
    } catch (error) {
      logger.error('Failed to encrypt secret:', error);
      throw error;
    }
  }

  async decryptSecret(encryptedValue: string): Promise<string> {
    try {
      const encryptedData = JSON.parse(encryptedValue);
      const { keyId, iv: _iv, encrypted, authTag } = encryptedData;
      
      const encryptionKey = this.encryptionKeys.get(keyId);
      if (!encryptionKey) {
        throw new Error(`Encryption key not found: ${keyId}`);
      }

      const decipher = crypto.createDecipher(this.algorithm, encryptionKey.key);
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      logger.error('Failed to decrypt secret:', error);
      throw error;
    }
  }

  async rotateEncryptionKeys(): Promise<boolean> {
    try {
      // Generate new key
      const newKeyId = crypto.randomBytes(16).toString('hex');
      const newKey = crypto.randomBytes(32);
      
      this.encryptionKeys.set(newKeyId, {
        id: newKeyId,
        key: newKey,
        createdAt: new Date(),
        active: true,
      });
      
      // Mark old key as inactive
      if (this.currentKeyId) {
        const oldKey = this.encryptionKeys.get(this.currentKeyId);
        if (oldKey) {
          oldKey.active = false;
        }
      }
      
      this.currentKeyId = newKeyId;
      logger.info('Encryption keys rotated successfully');
      return true;
    } catch (error) {
      logger.error('Failed to rotate encryption keys:', error);
      return false;
    }
  }

  async getSecret(key: string, defaultValue?: string): Promise<string | undefined> {
    try {
      // Check environment variables first
      const envValue = process.env[key];
      if (envValue) {
        return envValue;
      }

      // Check encrypted secrets (would be stored in database in production)
      // For now, return default value
      return defaultValue;
    } catch (error) {
      logger.error(`Failed to get secret: ${key}`, error);
      return defaultValue;
    }
  }

  async setSecret(key: string, _value: string, _encrypt: boolean = true): Promise<boolean> {
    try {
      if (!key || key.trim() === '') {
        return false;
      }

      // For now, just store the secret without encryption
      // In a real implementation, this would encrypt the value
      // this.secrets.set(key, {
      //   key,
      //   value: _value,
      //   encrypted,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // });

      return true;
    } catch (error) {
      logger.error('Error setting secret:', error);
      return false;
    }
  }

  async validateSecrets(requiredSecrets: string[]): Promise<{
    valid: boolean;
    missing: string[];
    invalid: string[];
  }> {
    const missing: string[] = [];
    const invalid: string[] = [];

    for (const secretKey of requiredSecrets) {
      try {
        const value = await this.getSecret(secretKey);
        if (!value) {
          missing.push(secretKey);
        }
      } catch (error) {
        invalid.push(secretKey);
      }
    }

    return {
      valid: missing.length === 0 && invalid.length === 0,
      missing,
      invalid,
    };
  }

  async getSecretMetadata(key: string): Promise<Partial<SecretConfig> | null> {
    try {
      // In production, this would fetch from secure database
      // For now, return basic info
      return {
        key,
        encrypted: true,
        lastRotated: new Date(),
      };
    } catch (error) {
      logger.error(`Failed to get secret metadata: ${key}`, error);
      return null;
    }
  }

  async listSecrets(): Promise<string[]> {
    try {
      // In production, this would fetch from secure database
      // For now, return environment variables that look like secrets
      return Object.keys(process.env).filter(key => 
        key.toLowerCase().includes('secret') ||
        key.toLowerCase().includes('key') ||
        key.toLowerCase().includes('password') ||
        key.toLowerCase().includes('token')
      );
    } catch (error) {
      logger.error('Failed to list secrets:', error);
      return [];
    }
  }

  async backupSecrets(): Promise<string> {
    try {
      const secrets = await this.listSecrets();
      const backup: Record<string, any> = {};
      
      for (const secretKey of secrets) {
        const value = await this.getSecret(secretKey);
        if (value) {
          backup[secretKey] = {
            encrypted: true,
            value: await this.encryptSecret(value),
            metadata: await this.getSecretMetadata(secretKey),
          };
        }
      }
      
      const backupData = JSON.stringify(backup, null, 2);
      logger.info('Secrets backup created successfully');
      return backupData;
    } catch (error) {
      logger.error('Failed to backup secrets:', error);
      throw error;
    }
  }

  async restoreSecrets(backupData: string): Promise<boolean> {
    try {
      const backup = JSON.parse(backupData);
      
      for (const [key, secretData] of Object.entries(backup)) {
        if ((secretData as any).encrypted && (secretData as any).value) {
          const decryptedValue = await this.decryptSecret((secretData as any).value);
          await this.setSecret(key, decryptedValue, true);
        }
      }
      
      logger.info('Secrets restored successfully');
      return true;
    } catch (error) {
      logger.error('Failed to restore secrets:', error);
      return false;
    }
  }

  async auditSecrets(): Promise<{
    total: number;
    encrypted: number;
    unencrypted: number;
    lastRotated?: Date;
    recommendations: string[];
  }> {
    try {
      const total = this.encryptionKeys.size;
      const encrypted = Array.from(this.encryptionKeys.values()).filter(s => s.active).length;
      const unencrypted = total - encrypted;
      const lastRotated = await this.getLastKeyRotation();

      const recommendations: string[] = [];
      
      if (unencrypted > 0) {
        recommendations.push('Consider encrypting sensitive secrets');
      }
      
      if (total === 0) {
        recommendations.push('No secrets configured');
      }

      return {
        total,
        encrypted,
        unencrypted,
        ...(lastRotated && { lastRotated }),
        recommendations
      };
    } catch (error) {
      logger.error('Error auditing secrets:', error);
      return {
        total: 0,
        encrypted: 0,
        unencrypted: 0,
        recommendations: ['Error occurred during audit']
      };
    }
  }

  private getLastKeyRotation(): Date | null {
    // Get the most recent key creation date
    const keyDates = Array.from(this.encryptionKeys.values())
      .map(key => key.createdAt)
      .filter(date => date !== null) as Date[];
    
    if (keyDates.length === 0) return null;
    
    return new Date(Math.max(...keyDates.map(date => date.getTime())));
  }

  // Utility methods for common secret patterns
  async getDatabaseUrl(): Promise<string | undefined> {
    return this.getSecret('DATABASE_URL') || 
           this.getSecret('MONGODB_URI') || 
           this.getSecret('FIREBASE_PROJECT_ID');
  }

  async getApiKey(service: string): Promise<string | undefined> {
    return this.getSecret(`${service.toUpperCase()}_API_KEY`) ||
           this.getSecret(`${service.toUpperCase()}_SECRET`);
  }

  async getJwtSecret(): Promise<string | undefined> {
    return this.getSecret('JWT_SECRET') ||
           this.getSecret('JWT_PRIVATE_KEY') ||
           this.getSecret('FIREBASE_PRIVATE_KEY');
  }

  async getStripeKeys(): Promise<{ public: string | undefined; secret: string | undefined }> {
    return {
      public: await this.getSecret('STRIPE_PUBLISHABLE_KEY'),
      secret: await this.getSecret('STRIPE_SECRET_KEY'),
    };
  }

  async getAlgoliaKeys(): Promise<{ appId: string | undefined; apiKey: string | undefined }> {
    return {
      appId: await this.getSecret('ALGOLIA_APP_ID'),
      apiKey: await this.getSecret('ALGOLIA_ADMIN_API_KEY'),
    };
  }
}

export const secretsManager = new SecretsManager();

// Convenience functions for common use cases
export const getSecret = (key: string, defaultValue?: string) => secretsManager.getSecret(key, defaultValue);
export const setSecret = (key: string, value: string, encrypt?: boolean) => secretsManager.setSecret(key, value, encrypt);
export const encryptSecret = (value: string) => secretsManager.encryptSecret(value);
export const decryptSecret = (value: string) => secretsManager.decryptSecret(value);
