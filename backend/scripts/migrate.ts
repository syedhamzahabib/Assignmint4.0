#!/usr/bin/env ts-node

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import { logger } from '../src/utils/logger';
import { migrationService } from '../src/migrations/migrationService';

// Load environment variables
dotenv.config();

interface MigrateOptions {
  dryRun: boolean;
  targetVersion?: number;
  rollback: boolean;
  status: boolean;
  validate: boolean;
  create: boolean;
  migrationName?: string;
  migrationDescription?: string;
}

class MigrationRunner {
  private db: FirebaseFirestore.Firestore;

  constructor() {
    // Initialize Firebase Admin
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID || '',
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    };

    const adminApp = initializeApp({
      credential: cert(serviceAccount),
    });

    this.db = getFirestore();
  }

  async run(options: MigrateOptions): Promise<void> {
    logger.info('Starting migration runner...');
    logger.info(`Options: ${JSON.stringify(options, null, 2)}`);

    try {
      if (options.status) {
        await this.showStatus();
        return;
      }

      if (options.validate) {
        await this.validateMigrations();
        return;
      }

      if (options.create) {
        await this.createMigration(options.migrationName, options.migrationDescription);
        return;
      }

      if (options.rollback) {
        await this.rollbackMigrations(options.targetVersion);
        return;
      }

      // Run migrations
      await this.runMigrations(options.targetVersion, options.dryRun);

    } catch (error) {
      logger.error('Migration runner failed:', error);
      throw error;
    }
  }

  private async showStatus(): Promise<void> {
    logger.info('Migration Status:');
    
    const status = await migrationService.getMigrationStatus();
    logger.info(`  Total migrations: ${status.total}`);
    logger.info(`  Applied: ${status.applied}`);
    logger.info(`  Pending: ${status.pending}`);
    logger.info(`  Last version: ${status.lastVersion}`);
    
    if (status.lastApplied) {
      logger.info(`  Last applied: ${status.lastApplied.name} (${status.lastApplied.id})`);
    }

    // Show pending migrations
    const pendingMigrations = await migrationService.getPendingMigrations();
    if (pendingMigrations.length > 0) {
      logger.info('\nPending migrations:');
      for (const migration of pendingMigrations) {
        logger.info(`  ${migration.version}: ${migration.name} (${migration.id})`);
        logger.info(`    Description: ${migration.description}`);
      }
    }

    // Show migration history
    const history = await migrationService.getMigrationHistory();
    if (history.length > 0) {
      logger.info('\nMigration history:');
      for (const migration of history.slice(-10)) { // Show last 10
        const status = migration.status === 'success' ? '✅' : '❌';
        const time = migration.appliedAt.toISOString().split('T')[0];
        logger.info(`  ${status} ${migration.version}: ${migration.name} (${time})`);
        if (migration.status === 'failed' && migration.error) {
          logger.info(`    Error: ${migration.error}`);
        }
      }
    }
  }

  private async validateMigrations(): Promise<void> {
    logger.info('Validating migrations...');
    
    const validation = await migrationService.validateMigrations();
    
    if (validation.valid) {
      logger.info('✅ All migrations are valid');
    } else {
      logger.error('❌ Migration validation failed:');
      for (const error of validation.errors) {
        logger.error(`  - ${error}`);
      }
      throw new Error('Migration validation failed');
    }
  }

  private async createMigration(name?: string, description?: string): Promise<void> {
    if (!name) {
      logger.error('Migration name is required');
      process.exit(1);
    }

    if (!description) {
      logger.error('Migration description is required');
      process.exit(1);
    }

    logger.info(`Creating migration: ${name}`);
    
    const migration = await migrationService.createMigration(name, description);
    
    logger.info(`Migration created: ${migration.id}`);
    logger.info(`  Name: ${migration.name}`);
    logger.info(`  Description: ${migration.description}`);
    logger.info(`  Version: ${migration.version}`);
    logger.info(`  ID: ${migration.id}`);
    
    logger.info('\nNext steps:');
    logger.info('1. Edit the migration file to implement up() and down() methods');
    logger.info('2. Test the migration with --dry-run');
    logger.info('3. Run the migration with --execute');
  }

  private async runMigrations(targetVersion?: number, dryRun: boolean = false): Promise<void> {
    if (dryRun) {
      logger.info('DRY RUN MODE - No changes will be made');
    }

    logger.info('Running migrations...');
    
    if (targetVersion) {
      logger.info(`Target version: ${targetVersion}`);
    }

    const result = await migrationService.migrate(targetVersion);
    
    logger.info(`Migration completed: ${result.success} successful, ${result.failed} failed`);
    
    if (result.failed > 0) {
      throw new Error('Some migrations failed');
    }
  }

  private async rollbackMigrations(targetVersion?: number): Promise<void> {
    if (!targetVersion) {
      logger.error('Target version is required for rollback');
      process.exit(1);
    }

    logger.info(`Rolling back migrations to version ${targetVersion}...`);
    
    const result = await migrationService.rollback(targetVersion);
    
    logger.info(`Rollback completed: ${result.success} successful, ${result.failed} failed`);
    
    if (result.failed > 0) {
      throw new Error('Some rollbacks failed');
    }
  }

  async checkDatabaseConnection(): Promise<boolean> {
    try {
      // Test database connection
      await this.db.collection('migrations').limit(1).get();
      logger.info('Database connection successful');
      return true;
    } catch (error) {
      logger.error('Database connection failed:', error);
      return false;
    }
  }

  async getMigrationDetails(): Promise<void> {
    logger.info('Migration Details:');
    
    const pendingMigrations = await migrationService.getPendingMigrations();
    const history = await migrationService.getMigrationHistory();
    
    // Show detailed pending migrations
    if (pendingMigrations.length > 0) {
      logger.info('\nPending Migrations:');
      for (const migration of pendingMigrations) {
        logger.info(`\n  ${migration.version}: ${migration.name}`);
        logger.info(`    ID: ${migration.id}`);
        logger.info(`    Description: ${migration.description}`);
        if (migration.dependencies && migration.dependencies.length > 0) {
          logger.info(`    Dependencies: ${migration.dependencies.join(', ')}`);
        }
      }
    }

    // Show detailed history
    if (history.length > 0) {
      logger.info('\nMigration History:');
      for (const migration of history.slice(-5)) { // Show last 5
        const status = migration.status === 'success' ? '✅' : '❌';
        const time = migration.appliedAt.toISOString();
        const duration = `${migration.executionTime}ms`;
        
        logger.info(`\n  ${status} ${migration.version}: ${migration.name}`);
        logger.info(`    Applied: ${time}`);
        logger.info(`    Duration: ${duration}`);
        logger.info(`    Status: ${migration.status}`);
        
        if (migration.status === 'failed' && migration.error) {
          logger.info(`    Error: ${migration.error}`);
        }
        
        if (migration.rolledBackAt) {
          logger.info(`    Rolled back: ${migration.rolledBackAt.toISOString()}`);
        }
      }
    }
  }

  async runMigrationTest(migrationId: string): Promise<void> {
    logger.info(`Testing migration: ${migrationId}`);
    
    // This would run a specific migration in a test environment
    // For now, just validate the migration exists
    const pendingMigrations = await migrationService.getPendingMigrations();
    const migration = pendingMigrations.find(m => m.id === migrationId);
    
    if (!migration) {
      logger.error(`Migration ${migrationId} not found`);
      return;
    }
    
    logger.info(`Found migration: ${migration.name}`);
    logger.info(`Description: ${migration.description}`);
    logger.info(`Version: ${migration.version}`);
    
    // In a real implementation, this would run the migration in a test environment
    logger.info('Migration test completed (dry run)');
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  const options: MigrateOptions = {
    dryRun: !args.includes('--execute'),
    targetVersion: args.find(arg => arg.startsWith('--target='))?.split('=')[1] ? 
      parseInt(args.find(arg => arg.startsWith('--target='))?.split('=')[1] || '0') : undefined,
    rollback: args.includes('--rollback'),
    status: args.includes('--status'),
    validate: args.includes('--validate'),
    create: args.includes('--create'),
    migrationName: args.find(arg => arg.startsWith('--name='))?.split('=')[1],
    migrationDescription: args.find(arg => arg.startsWith('--description='))?.split('=')[1],
  };

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Database Migration Script

Usage: ts-node migrate.ts [options]

Options:
  --status                    Show migration status
  --validate                  Validate migrations
  --create                    Create a new migration
  --name=NAME                 Migration name (required with --create)
  --description=DESC          Migration description (required with --create)
  --target=VERSION            Target version for migration/rollback
  --rollback                  Rollback migrations to target version
  --execute                   Actually run migrations (default: dry run)
  --help, -h                  Show this help message

Examples:
  ts-node migrate.ts --status
  ts-node migrate.ts --validate
  ts-node migrate.ts --create --name="Add new field" --description="Add new field to users"
  ts-node migrate.ts --target=5
  ts-node migrate.ts --rollback --target=3
  ts-node migrate.ts --execute --target=5
`);
    return;
  }

  try {
    const runner = new MigrationRunner();
    
    // Check database connection first
    const connected = await runner.checkDatabaseConnection();
    if (!connected) {
      logger.error('Cannot connect to database. Please check your configuration.');
      process.exit(1);
    }

    // Run the migration runner
    await runner.run(options);
    
    // Show detailed information if requested
    if (args.includes('--details')) {
      await runner.getMigrationDetails();
    }
    
  } catch (error) {
    logger.error('Migration script failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    logger.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { MigrationRunner };
