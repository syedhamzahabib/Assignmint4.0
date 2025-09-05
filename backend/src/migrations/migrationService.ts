import { logger } from '../utils/logger';
import { db } from '../index';

export interface Migration {
  id: string;
  name: string;
  description: string;
  version: number;
  up: () => Promise<void>;
  down: () => Promise<void>;
  dependencies?: string[];
}

export interface MigrationRecord {
  id: string;
  name: string;
  version: number;
  appliedAt: Date;
  executionTime: number;
  status: 'success' | 'failed';
  error?: string;
}

export interface MigrationStatus {
  total: number;
  applied: number;
  pending: number;
  lastApplied?: MigrationRecord;
  lastVersion: number;
}

export class MigrationService {
  private migrations: Map<string, Migration> = new Map();
  private collectionName = 'migrations';

  constructor() {
    this.registerDefaultMigrations();
  }

  private registerDefaultMigrations(): void {
    // Migration 1: Add user subscription fields
    this.registerMigration({
      id: '001_add_user_subscription_fields',
      name: 'Add User Subscription Fields',
      description: 'Add subscription-related fields to users collection',
      version: 1,
      up: async () => {
        const usersSnapshot = await db.collection('users').get();
        const batch = db.batch();
        
        for (const doc of usersSnapshot.docs) {
          const userData = doc.data();
          if (!userData.hasOwnProperty('subscriptionStatus')) {
            batch.update(doc.ref, {
              subscriptionStatus: 'free',
              subscriptionId: null,
              planId: null,
              updatedAt: new Date(),
            });
          }
        }
        
        await batch.commit();
        logger.info('Migration 001: Added subscription fields to users');
      },
      down: async () => {
        // Note: This migration doesn't remove fields as it's not safe
        logger.warn('Migration 001: Cannot safely remove subscription fields');
      },
    });

    // Migration 2: Add task payment fields
    this.registerMigration({
      id: '002_add_task_payment_fields',
      name: 'Add Task Payment Fields',
      description: 'Add payment-related fields to tasks collection',
      version: 2,
      up: async () => {
        const tasksSnapshot = await db.collection('tasks').get();
        const batch = db.batch();
        
        for (const doc of tasksSnapshot.docs) {
          const taskData = doc.data();
          if (!taskData.hasOwnProperty('paymentStatus')) {
            batch.update(doc.ref, {
              paymentStatus: 'pending',
              paymentMethod: null,
              amount: (taskData as any).price || 0,
              paidAt: null,
              updatedAt: new Date(),
            });
          }
        }
        
        await batch.commit();
        logger.info('Migration 002: Added payment fields to tasks');
      },
      down: async () => {
        logger.warn('Migration 002: Cannot safely remove payment fields');
      },
    });

    // Migration 3: Add task events collection
    this.registerMigration({
      id: '003_create_task_events_collection',
      name: 'Create Task Events Collection',
      description: 'Create taskEvents collection for audit trail',
      version: 3,
      up: async () => {
        // Create a sample event to ensure collection exists
        await db.collection('taskEvents').add({
          id: 'migration_sample',
          taskId: 'migration_sample',
          type: 'migration',
          userId: 'system',
          message: 'Collection created by migration',
          metadata: { migration: '003' },
          createdAt: new Date(),
        });
        
        // Remove the sample event
        const sampleDoc = await db.collection('taskEvents').where('id', '==', 'migration_sample').get();
        if (!sampleDoc.empty) {
          if (sampleDoc.docs[0]) {
            await sampleDoc.docs[0].ref.delete();
          }
        }
        
        logger.info('Migration 003: Created taskEvents collection');
      },
      down: async () => {
        // Note: This would delete all task events, which is dangerous
        logger.warn('Migration 003: Cannot safely remove taskEvents collection');
      },
    });

    // Migration 4: Add user rating aggregation
    this.registerMigration({
      id: '004_add_user_rating_aggregation',
      name: 'Add User Rating Aggregation',
      description: 'Add rating aggregation fields to users collection',
      version: 4,
      up: async () => {
        const usersSnapshot = await db.collection('users').get();
        const batch = db.batch();
        
        for (const doc of usersSnapshot.docs) {
          const userData = doc.data();
          if (!userData.hasOwnProperty('ratingDistribution')) {
            batch.update(doc.ref, {
              ratingDistribution: {
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0,
              },
              updatedAt: new Date(),
            });
          }
        }
        
        await batch.commit();
        logger.info('Migration 004: Added rating distribution to users');
      },
      down: async () => {
        logger.warn('Migration 004: Cannot safely remove rating distribution');
      },
    });

    // Migration 5: Add search indexing
    this.registerMigration({
      id: '005_add_search_indexing',
      name: 'Add Search Indexing',
      description: 'Add search-related fields for better indexing',
      version: 5,
      up: async () => {
        const tasksSnapshot = await db.collection('tasks').get();
        const batch = db.batch();
        
        for (const doc of tasksSnapshot.docs) {
          const taskData = doc.data();
          if (!taskData.hasOwnProperty('searchTags')) {
            const tags = [
              (taskData as any).subject,
              (taskData as any).title.toLowerCase(),
              ...((taskData as any).tags || []),
            ].filter(Boolean);
            
            batch.update(doc.ref, {
              searchTags: tags,
              indexedAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }
        
        await batch.commit();
        logger.info('Migration 005: Added search tags to tasks');
      },
      down: async () => {
        logger.warn('Migration 005: Cannot safely remove search tags');
      },
    });
  }

  registerMigration(migration: Migration): void {
    this.migrations.set(migration.id, migration);
    logger.info(`Migration registered: ${migration.name} (${migration.id})`);
  }

  async getAppliedMigrations(): Promise<MigrationRecord[]> {
    try {
      const snapshot = await db.collection(this.collectionName).orderBy('version', 'asc').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as MigrationRecord[];
    } catch (error) {
      logger.error('Error fetching applied migrations:', error);
      return [];
    }
  }

  async getMigrationHistory(): Promise<MigrationRecord[]> {
    const appliedMigrations = await this.getAppliedMigrations();
    
    return appliedMigrations
      .filter((m: any) => m.status === 'success')
      .map((migration: any) => ({
        id: migration.id,
        version: migration.version,
        name: migration.name,
        appliedAt: migration.appliedAt,
        duration: migration.duration,
        executionTime: migration.executionTime || 0,
        status: 'success' as const
      }));
  }

  async getPendingMigrations(): Promise<Migration[]> {
    try {
      const appliedMigrations = await this.getAppliedMigrations();
      const appliedIds = new Set(appliedMigrations.map((m: any) => m.id));
      
      return Array.from(this.migrations.values())
        .filter(migration => !appliedIds.has(migration.id))
        .sort((a, b) => a.version - b.version);
    } catch (error) {
      logger.error('Error fetching pending migrations:', error);
      return [];
    }
  }

  async migrate(targetVersion?: number): Promise<{ success: number; failed: number }> {
    try {
      const pendingMigrations = await this.getPendingMigrations();
      
      if (pendingMigrations.length === 0) {
        logger.info('No pending migrations');
        return { success: 0, failed: 0 };
      }

      let successCount = 0;
      let failedCount = 0;

      for (const migration of pendingMigrations) {
        // Check if we've reached the target version
        if (targetVersion && migration.version > targetVersion) {
          break;
        }

        try {
          const startTime = Date.now();
          
          // Check dependencies
          if (migration.dependencies) {
            const dependencyCheck = await this.checkDependencies(migration.dependencies);
            if (!dependencyCheck.success) {
              throw new Error(`Dependencies not met: ${dependencyCheck.missing.join(', ')}`);
            }
          }

          // Execute migration
          await migration.up();
          
          const executionTime = Date.now() - startTime;
          
          // Record successful migration
          await db.collection(this.collectionName).add({
            id: migration.id,
            name: migration.name,
            version: migration.version,
            appliedAt: new Date(),
            executionTime,
            status: 'success',
          });

          logger.info(`Migration applied successfully: ${migration.name} (${migration.id})`);
          successCount++;
          
        } catch (error) {
          const executionTime = Date.now();
          
          // Record failed migration
          await db.collection(this.collectionName).add({
            id: migration.id,
            name: migration.name,
            version: migration.version,
            appliedAt: new Date(),
            executionTime,
            status: 'failed',
            error: error instanceof Error ? error.message : String(error),
          });

          logger.error(`Migration failed: ${migration.name} (${migration.id})`, error);
          failedCount++;
          
          // Stop migration on failure
          break;
        }
      }

      logger.info(`Migration completed: ${successCount} successful, ${failedCount} failed`);
      return { success: successCount, failed: failedCount };
      
    } catch (error) {
      logger.error('Error during migration:', error);
      return { success: 0, failed: 1 };
    }
  }

  async rollback(targetVersion: number): Promise<{ success: number; failed: number }> {
    try {
      const appliedMigrations = await this.getAppliedMigrations();
      const migrationsToRollback = appliedMigrations
        .filter((m: any) => m.version > targetVersion)
        .sort((a: any, b: any) => b.version - a.version); // Reverse order for rollback

      let success = 0;
      let failed = 0;

      for (const migrationRecord of migrationsToRollback) {
        try {
          const migration = this.migrations.get(migrationRecord.id);
          if (!migration) {
            logger.warn(`Migration ${migrationRecord.id} not found in migrations list`);
            failed++;
            continue;
          }

          await migration.down();
          await db.collection(this.collectionName).doc(migrationRecord.id).delete();
          success++;
          logger.info(`Successfully rolled back migration: ${migration.id}`);
        } catch (error) {
          logger.error(`Failed to rollback migration ${migrationRecord.id}:`, error);
          failed++;
        }
      }

      return { success, failed };
    } catch (error) {
      logger.error('Error during rollback:', error);
      return { success: 0, failed: 1 };
    }
  }

  private async checkDependencies(dependencies: string[]): Promise<{ success: boolean; missing: string[] }> {
    try {
      const appliedMigrations = await this.getAppliedMigrations();
      const appliedIds = new Set(appliedMigrations.map((m: any) => m.id));
      
      const missing = dependencies.filter(dep => !appliedIds.has(dep));
      
      return {
        success: missing.length === 0,
        missing
      };
    } catch (error) {
      logger.error('Error checking dependencies:', error);
      return { success: false, missing: dependencies };
    }
  }

  async getMigrationStatus(): Promise<MigrationStatus> {
    const appliedMigrations = await this.getAppliedMigrations();
    const pendingMigrations = await this.getPendingMigrations();
    const lastApplied = appliedMigrations.length > 0 ? appliedMigrations[appliedMigrations.length - 1] : undefined;

    return {
      total: this.migrations.size,
      applied: appliedMigrations.length,
      pending: pendingMigrations.length,
      ...(lastApplied && { lastApplied }),
      lastVersion: appliedMigrations.length > 0 ? appliedMigrations[0]?.version || 0 : 0
    };
  }

  async getMigration(migrationId: string): Promise<Migration | null> {
    try {
      const migration = this.migrations.get(migrationId);
      return migration || null;
    } catch (error) {
      logger.error('Error getting migration:', error);
      return null;
    }
  }

  async testMigration(migrationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const migration = this.migrations.get(migrationId);
      if (!migration) {
        return { success: false, error: 'Migration not found' };
      }

      // In a real implementation, this would run the migration in a test environment
      // For now, just validate the migration structure
      if (!migration.up || !migration.down) {
        return { success: false, error: 'Invalid migration structure' };
      }

      return { success: true };
    } catch (error) {
      logger.error('Error testing migration:', error);
      return { success: false, error: 'Migration test failed' };
    }
  }

  async createMigration(name: string, description: string): Promise<Migration> {
    const version = await this.getNextVersion();
    const id = `${version.toString().padStart(3, '0')}_${name.toLowerCase().replace(/\s+/g, '_')}`;
    
    const migration: Migration = {
      id,
      name,
      description,
      version,
      up: async () => {
        logger.info(`Executing migration: ${name}`);
        // Override this method with actual migration logic
      },
      down: async () => {
        logger.info(`Rolling back migration: ${name}`);
        // Override this method with actual rollback logic
      },
    };

    this.registerMigration(migration);
    return migration;
  }

  private async getNextVersion(): Promise<number> {
    const status = await this.getMigrationStatus();
    return status.lastVersion + 1;
  }

  async validateMigrations(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    // Check for duplicate versions
    const versions = Array.from(this.migrations.values()).map(m => m.version);
    const duplicateVersions = versions.filter((v, i) => versions.indexOf(v) !== i);
    
    if (duplicateVersions.length > 0) {
      errors.push(`Duplicate migration versions found: ${duplicateVersions.join(', ')}`);
    }

    // Check for circular dependencies
    for (const migration of this.migrations.values()) {
      if (migration.dependencies) {
        const circularCheck = this.checkCircularDependencies(migration.id, new Set());
        if (circularCheck.hasCircular) {
          errors.push(`Circular dependency detected in migration: ${migration.id}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private checkCircularDependencies(migrationId: string, visited: Set<string>): { hasCircular: boolean; path: string[] } {
    if (visited.has(migrationId)) {
      return { hasCircular: true, path: Array.from(visited) };
    }

    const migration = this.migrations.get(migrationId);
    if (!migration || !migration.dependencies) {
      return { hasCircular: false, path: [] };
    }

    visited.add(migrationId);
    
    for (const dep of migration.dependencies) {
      const result = this.checkCircularDependencies(dep, new Set(visited));
      if (result.hasCircular) {
        return result;
      }
    }

    visited.delete(migrationId);
    return { hasCircular: false, path: [] };
  }
}

export const migrationService = new MigrationService();
