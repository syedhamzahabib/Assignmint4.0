import { MigrationService, Migration, MigrationRecord } from '../../src/migrations/migrationService';

describe('MigrationService', () => {
  let migrationService: MigrationService;
  let mockFirestore: any;
  let mockCollection: any;
  let mockDoc: any;
  let mockBatch: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockDoc = {
      get: jest.fn(),
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    
    mockCollection = {
      doc: jest.fn(() => mockDoc),
      where: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          limit: jest.fn(() => ({
            get: jest.fn(),
          })),
        })),
      })),
      orderBy: jest.fn(() => ({
        limit: jest.fn(() => ({
          get: jest.fn(),
        })),
      })),
      limit: jest.fn(() => ({
        get: jest.fn(),
      })),
      get: jest.fn(),
    };
    
    mockBatch = {
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      commit: jest.fn(),
    };
    
    mockFirestore = {
      collection: jest.fn(() => mockCollection),
      batch: jest.fn(() => mockBatch),
    };
    
    // Mock the Firestore instance
    (migrationService as any).db = mockFirestore;
    
    migrationService = new MigrationService();
  });

  describe('constructor', () => {
    it('should initialize with empty migrations and history', () => {
      expect(migrationService['migrations']).toEqual(new Map());
      expect(migrationService['migrationHistory']).toEqual([]);
    });

    it('should register default migrations', () => {
      expect(migrationService['migrations'].size).toBeGreaterThan(0);
      expect(migrationService['migrations'].has('user_subscriptions')).toBe(true);
      expect(migrationService['migrations'].has('task_payments')).toBe(true);
    });
  });

  describe('registerMigration', () => {
    const mockMigration: Migration = {
      id: 'test_migration',
      name: 'Test Migration',
      version: 1,
      dependencies: [],
      up: jest.fn(),
      down: jest.fn(),
      validate: jest.fn(),
    };

    it('should register a new migration', () => {
      migrationService.registerMigration(mockMigration);
      
      expect(migrationService['migrations'].get('test_migration')).toBe(mockMigration);
    });

    it('should overwrite existing migration with same ID', () => {
      const newMigration = { ...mockMigration, name: 'Updated Test Migration' };
      
      migrationService.registerMigration(mockMigration);
      migrationService.registerMigration(newMigration);
      
      expect(migrationService['migrations'].get('test_migration')).toBe(newMigration);
    });

    it('should validate migration before registration', () => {
      const invalidMigration = { ...mockMigration, id: '' };
      
      expect(() => migrationService.registerMigration(invalidMigration)).toThrow('Invalid migration');
    });
  });

  describe('getMigrationHistory', () => {
    beforeEach(() => {
      // Mock migration history data
      const mockHistoryData = {
        docs: [
          {
            id: 'migration-1',
            data: () => ({
              id: 'user_subscriptions',
              name: 'User Subscriptions Migration',
              version: 1,
              appliedAt: new Date('2024-01-01'),
              executionTime: 100,
              status: 'success',
            }),
          },
          {
            id: 'migration-2',
            data: () => ({
              id: 'task_payments',
              name: 'Task Payments Migration',
              version: 2,
              appliedAt: new Date('2024-01-02'),
              executionTime: 150,
              status: 'success',
            }),
          },
        ],
      };
      
      mockCollection.get.mockResolvedValue(mockHistoryData);
    });

    it('should return migration history from Firestore', async () => {
      const history = await migrationService.getMigrationHistory();
      
      expect(mockCollection.get).toHaveBeenCalled();
      expect(history).toHaveLength(2);
      expect(history[0].id).toBe('user_subscriptions');
      expect(history[1].id).toBe('task_payments');
    });

    it('should handle empty history gracefully', async () => {
      mockCollection.get.mockResolvedValue({ docs: [] });
      
      const history = await migrationService.getMigrationHistory();
      
      expect(history).toHaveLength(0);
    });

    it('should handle Firestore errors gracefully', async () => {
      mockCollection.get.mockRejectedValue(new Error('Firestore error'));
      
      await expect(migrationService.getMigrationHistory()).rejects.toThrow('Firestore error');
    });
  });

  describe('getPendingMigrations', () => {
    beforeEach(() => {
      // Mock existing migrations
      migrationService['migrations'].set('migration_1', {
        id: 'migration_1',
        name: 'Migration 1',
        version: 1,
        dependencies: [],
        up: jest.fn(),
        down: jest.fn(),
        validate: jest.fn(),
      });
      
      migrationService['migrations'].set('migration_2', {
        id: 'migration_2',
        name: 'Migration 2',
        version: 2,
        dependencies: ['migration_1'],
        up: jest.fn(),
        down: jest.fn(),
        validate: jest.fn(),
      });
    });

    it('should return migrations that have not been applied', async () => {
      // Mock empty history
      mockCollection.get.mockResolvedValue({ docs: [] });
      
      const pending = await migrationService.getPendingMigrations();
      
      expect(pending).toHaveLength(2);
      expect(pending[0].id).toBe('migration_1');
      expect(pending[1].id).toBe('migration_2');
    });

    it('should respect migration dependencies', async () => {
      // Mock partial history
      mockCollection.get.mockResolvedValue({
        docs: [
          {
            id: 'migration-1',
            data: () => ({
              id: 'migration_1',
              version: 1,
              status: 'success',
            }),
          },
        ],
      });
      
      const pending = await migrationService.getPendingMigrations();
      
      expect(pending).toHaveLength(1);
      expect(pending[0].id).toBe('migration_2');
    });

    it('should filter out failed migrations', async () => {
      // Mock history with failed migration
      mockCollection.get.mockResolvedValue({
        docs: [
          {
            id: 'migration-1',
            data: () => ({
              id: 'migration_1',
              version: 1,
              status: 'failed',
            }),
          },
        ],
      });
      
      const pending = await migrationService.getPendingMigrations();
      
      expect(pending).toHaveLength(2); // Both should be pending since first failed
    });
  });

  describe('migrate', () => {
    const mockMigration: Migration = {
      id: 'test_migration',
      name: 'Test Migration',
      version: 1,
      dependencies: [],
      up: jest.fn().mockResolvedValue({ success: true }),
      down: jest.fn().mockResolvedValue({ success: true }),
      validate: jest.fn().mockReturnValue(true),
    };

    beforeEach(() => {
      migrationService['migrations'].set('test_migration', mockMigration);
      mockCollection.get.mockResolvedValue({ docs: [] }); // No existing history
    });

    it('should run migration successfully', async () => {
      const startTime = Date.now();
      
      const result = await migrationService.migrate('test_migration');
      
      expect(result.success).toBe(true);
      expect(mockMigration.up).toHaveBeenCalled();
      expect(mockBatch.set).toHaveBeenCalled();
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it('should handle migration validation failure', async () => {
      mockMigration.validate.mockReturnValue(false);
      
      const result = await migrationService.migrate('test_migration');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Validation failed');
      expect(mockMigration.up).not.toHaveBeenCalled();
    });

    it('should handle migration execution failure', async () => {
      mockMigration.up.mockRejectedValue(new Error('Migration failed'));
      
      const result = await migrationService.migrate('test_migration');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Migration failed');
      expect(mockBatch.set).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ status: 'failed' })
      );
    });

    it('should check dependencies before running migration', async () => {
      const dependentMigration: Migration = {
        id: 'dependent_migration',
        name: 'Dependent Migration',
        version: 2,
        dependencies: ['test_migration'],
        up: jest.fn().mockResolvedValue({ success: true }),
        down: jest.fn().mockResolvedValue({ success: true }),
        validate: jest.fn().mockReturnValue(true),
      };
      
      migrationService['migrations'].set('dependent_migration', dependentMigration);
      
      const result = await migrationService.migrate('dependent_migration');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Dependencies not met');
    });
  });

  describe('rollback', () => {
    const mockMigration: Migration = {
      id: 'test_migration',
      name: 'Test Migration',
      version: 1,
      dependencies: [],
      up: jest.fn().mockResolvedValue({ success: true }),
      down: jest.fn().mockResolvedValue({ success: true }),
      validate: jest.fn().mockReturnValue(true),
    };

    beforeEach(() => {
      migrationService['migrations'].set('test_migration', mockMigration);
      
      // Mock existing migration in history
      mockCollection.get.mockResolvedValue({
        docs: [
          {
            id: 'migration-1',
            data: () => ({
              id: 'test_migration',
              version: 1,
              status: 'success',
            }),
          },
        ],
      });
    });

    it('should rollback migration successfully', async () => {
      const result = await migrationService.rollback('test_migration');
      
      expect(result.success).toBe(true);
      expect(mockMigration.down).toHaveBeenCalled();
      expect(mockBatch.update).toHaveBeenCalled();
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it('should handle rollback validation failure', async () => {
      mockMigration.validate.mockReturnValue(false);
      
      const result = await migrationService.rollback('test_migration');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Validation failed');
      expect(mockMigration.down).not.toHaveBeenCalled();
    });

    it('should handle rollback execution failure', async () => {
      mockMigration.down.mockRejectedValue(new Error('Rollback failed'));
      
      const result = await migrationService.rollback('test_migration');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Rollback failed');
    });

    it('should prevent rollback of non-existent migration', async () => {
      const result = await migrationService.rollback('non_existent');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Migration not found');
    });
  });

  describe('checkDependencies', () => {
    it('should return true when all dependencies are met', () => {
      const migration: Migration = {
        id: 'test_migration',
        name: 'Test Migration',
        version: 1,
        dependencies: ['dep_1', 'dep_2'],
        up: jest.fn(),
        down: jest.fn(),
        validate: jest.fn(),
      };
      
      // Mock successful dependency checks
      const appliedMigrations = ['dep_1', 'dep_2'];
      
      const result = migrationService.checkDependencies(migration, appliedMigrations);
      
      expect(result).toBe(true);
    });

    it('should return false when dependencies are not met', () => {
      const migration: Migration = {
        id: 'test_migration',
        name: 'Test Migration',
        version: 1,
        dependencies: ['dep_1', 'dep_2', 'dep_3'],
        up: jest.fn(),
        down: jest.fn(),
        validate: jest.fn(),
      };
      
      // Mock partial dependency checks
      const appliedMigrations = ['dep_1'];
      
      const result = migrationService.checkDependencies(migration, appliedMigrations);
      
      expect(result).toBe(false);
    });

    it('should handle migrations with no dependencies', () => {
      const migration: Migration = {
        id: 'test_migration',
        name: 'Test Migration',
        version: 1,
        dependencies: [],
        up: jest.fn(),
        down: jest.fn(),
        validate: jest.fn(),
      };
      
      const result = migrationService.checkDependencies(migration, []);
      
      expect(result).toBe(true);
    });
  });

  describe('getMigrationStatus', () => {
    it('should return migration status information', async () => {
      // Mock migration history
      mockCollection.get.mockResolvedValue({
        docs: [
          {
            id: 'migration-1',
            data: () => ({
              id: 'user_subscriptions',
              status: 'success',
              appliedAt: new Date('2024-01-01'),
            }),
          },
        ],
      });
      
      const status = await migrationService.getMigrationStatus('user_subscriptions');
      
      expect(status).toBeDefined();
      expect(status?.status).toBe('success');
    });

    it('should return null for non-existent migration', async () => {
      mockCollection.get.mockResolvedValue({ docs: [] });
      
      const status = await migrationService.getMigrationStatus('non_existent');
      
      expect(status).toBeNull();
    });
  });

  describe('createMigration', () => {
    it('should create a new migration with correct version', () => {
      const migration = migrationService.createMigration('new_migration', 'New Migration');
      
      expect(migration.id).toBe('new_migration');
      expect(migration.name).toBe('New Migration');
      expect(migration.version).toBeGreaterThan(0);
      expect(migration.dependencies).toEqual([]);
    });

    it('should increment version for subsequent migrations', () => {
      const migration1 = migrationService.createMigration('migration_1', 'Migration 1');
      const migration2 = migrationService.createMigration('migration_2', 'Migration 2');
      
      expect(migration2.version).toBe(migration1.version + 1);
    });
  });

  describe('getNextVersion', () => {
    it('should return next version number', () => {
      const nextVersion = migrationService.getNextVersion();
      
      expect(nextVersion).toBeGreaterThan(0);
    });

    it('should increment version on subsequent calls', () => {
      const version1 = migrationService.getNextVersion();
      const version2 = migrationService.getNextVersion();
      
      expect(version2).toBe(version1 + 1);
    });
  });

  describe('validateMigrations', () => {
    it('should validate all registered migrations', () => {
      const mockMigration: Migration = {
        id: 'test_migration',
        name: 'Test Migration',
        version: 1,
        dependencies: [],
        up: jest.fn(),
        down: jest.fn(),
        validate: jest.fn().mockReturnValue(true),
      };
      
      migrationService['migrations'].set('test_migration', mockMigration);
      
      const result = migrationService.validateMigrations();
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect validation errors', () => {
      const invalidMigration: Migration = {
        id: 'invalid_migration',
        name: '',
        version: -1,
        dependencies: ['non_existent'],
        up: jest.fn(),
        down: jest.fn(),
        validate: jest.fn().mockReturnValue(false),
      };
      
      migrationService['migrations'].set('invalid_migration', invalidMigration);
      
      const result = migrationService.validateMigrations();
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('default migrations', () => {
    it('should have user_subscriptions migration', () => {
      const migration = migrationService['migrations'].get('user_subscriptions');
      
      expect(migration).toBeDefined();
      expect(migration?.name).toContain('User Subscriptions');
      expect(migration?.dependencies).toEqual([]);
    });

    it('should have task_payments migration', () => {
      const migration = migrationService['migrations'].get('task_payments');
      
      expect(migration).toBeDefined();
      expect(migration?.name).toContain('Task Payments');
      expect(migration?.dependencies).toEqual(['user_subscriptions']);
    });

    it('should have task_events migration', () => {
      const migration = migrationService['migrations'].get('task_events');
      
      expect(migration).toBeDefined();
      expect(migration?.name).toContain('Task Events');
      expect(migration?.dependencies).toEqual(['task_payments']);
    });
  });
});
