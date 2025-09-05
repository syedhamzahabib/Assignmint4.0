import { SecretsManager } from '../../src/utils/secrets';

// Mock crypto module
const mockCrypto = {
  randomBytes: jest.fn(),
  createCipher: jest.fn(),
  createDecipher: jest.fn(),
  randomFillSync: jest.fn()
};

jest.mock('crypto', () => mockCrypto);

describe('SecretsManager', () => {
  let secretsManager: SecretsManager;

  beforeEach(() => {
    jest.clearAllMocks();
    secretsManager = new SecretsManager();
  });

  describe('constructor', () => {
    it('should initialize with default encryption key', () => {
      const newManager = new SecretsManager();
      expect(newManager).toBeInstanceOf(SecretsManager);
    });
  });

  describe('setSecret', () => {
    it('should store a secret', async () => {
      const key = 'test_key';
      const value = 'test_value';

      const result = await secretsManager.setSecret(key, value);
      expect(result).toBe(true);
    });

    it('should store a secret with metadata', async () => {
      const key = 'test_key';
      const value = 'test_value';
      const metadata = { description: 'Test secret' };

      const result = await secretsManager.setSecret(key, value, metadata);
      expect(result).toBe(true);
    });

    it('should update existing secret', async () => {
      const key = 'test_key';
      const value1 = 'value1';
      const value2 = 'value2';

      await secretsManager.setSecret(key, value1);
      const result = await secretsManager.setSecret(key, value2);
      expect(result).toBe(true);
    });
  });

  describe('getSecret', () => {
    it('should retrieve a stored secret', async () => {
      const key = 'test_key';
      const value = 'test_value';

      await secretsManager.setSecret(key, value);
      const result = await secretsManager.getSecret(key);
      expect(result).toBe(value);
    });

    it('should return null for non-existent secret', async () => {
      const result = await secretsManager.getSecret('non_existent');
      expect(result).toBeNull();
    });
  });

  describe('getSecretMetadata', () => {
    it('should return secret metadata', async () => {
      const key = 'test_key';
      const value = 'test_value';
      const metadata = { description: 'Test secret' };

      await secretsManager.setSecret(key, value, metadata);
      const result = await secretsManager.getSecretMetadata(key);
      expect(result).toEqual(metadata);
    });

    it('should return null for non-existent secret', async () => {
      const result = await secretsManager.getSecretMetadata('non_existent');
      expect(result).toBeNull();
    });
  });

  describe('rotateEncryptionKeys', () => {
    it('should rotate encryption keys successfully', async () => {
      const result = await secretsManager.rotateEncryptionKeys();
      expect(result).toBe(true);
    });

    it('should handle key rotation failure', async () => {
      mockCrypto.randomFillSync.mockImplementation(() => {
        throw new Error('Random generation failed');
      });

      const result = await secretsManager.rotateEncryptionKeys();
      expect(result).toBe(false);
    });
  });

  describe('validateSecrets', () => {
    it('should validate all secrets are present', async () => {
      const requiredSecrets = ['database_url', 'api_key'];
      
      await secretsManager.setSecret('database_url', 'db://localhost');
      await secretsManager.setSecret('api_key', 'key123');

      const result = await secretsManager.validateSecrets(requiredSecrets);
      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });

    it('should identify missing secrets', async () => {
      const requiredSecrets = ['database_url', 'api_key'];
      
      await secretsManager.setSecret('database_url', 'db://localhost');

      const result = await secretsManager.validateSecrets(requiredSecrets);
      expect(result.valid).toBe(false);
      expect(result.missing).toContain('api_key');
    });

    it('should handle empty required secrets list', async () => {
      const result = await secretsManager.validateSecrets([]);
      expect(result.valid).toBe(true);
      expect(result.missing).toHaveLength(0);
    });
  });

  describe('auditSecrets', () => {
    it('should audit secrets and provide recommendations', async () => {
      await secretsManager.setSecret('database_url', 'db://localhost');
      await secretsManager.setSecret('api_key', 'key123');

      const result = await secretsManager.auditSecrets();
      expect(result.total).toBe(2);
      expect(result.recommendations).toBeInstanceOf(Array);
    });
  });

  describe('backup and restore', () => {
    it('should create and restore backup successfully', async () => {
      await secretsManager.setSecret('key1', 'value1');
      await secretsManager.setSecret('key2', 'value2');

      const backup = await secretsManager.createBackup();
      expect(backup).toBeDefined();

      // Clear secrets
      const result = await secretsManager.restoreFromBackup(backup);
      expect(result).toBe(true);
    });

    it('should handle invalid backup format', async () => {
      const invalidBackup = 'invalid_backup_data';
      const result = await secretsManager.restoreFromBackup(invalidBackup);
      expect(result).toBe(false);
    });

    it('should handle encryption key mismatch during restore', async () => {
      const backup = 'valid_backup_data';
      const result = await secretsManager.restoreFromBackup(backup);
      expect(result).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should check if secret exists', async () => {
      const key = 'test_key';
      
      expect(await secretsManager.hasSecret(key)).toBe(false);
      
      await secretsManager.setSecret(key, 'test_value');
      expect(await secretsManager.hasSecret(key)).toBe(true);
    });

    it('should get all secret keys', async () => {
      await secretsManager.setSecret('key1', 'value1');
      await secretsManager.setSecret('key2', 'value2');

      const keys = await secretsManager.getAllSecretKeys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
    });

    it('should get webhook secret', async () => {
      const result = await secretsManager.getWebhookSecret();
      expect(result).toBeDefined();
    });

    it('should handle webhook secret generation failure', async () => {
      const result = await secretsManager.getWebhookSecret();
      expect(result).toBeDefined();
    });
  });

  describe('validation', () => {
    it('should validate secret key format', async () => {
      const result = await secretsManager.setSecret('', 'value');
      expect(result).toBe(false);
    });

    it('should validate secret value is not empty', async () => {
      const result = await secretsManager.setSecret('key', '');
      expect(result).toBe(false);
    });
  });
});
