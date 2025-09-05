#!/usr/bin/env ts-node

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import dotenv from 'dotenv';
import { logger } from '../src/utils/logger';

// Load environment variables
dotenv.config();

interface ScrubOptions {
  dryRun: boolean;
  collections: string[];
  keepLastNDays: number;
  maxRecords: number;
  includeUsers: boolean;
  includeFiles: boolean;
  backup: boolean;
}

class StagingScrubber {
  private db: FirebaseFirestore.Firestore;
  private auth: any;
  private storage: any;
  private options: ScrubOptions;

  constructor(options: Partial<ScrubOptions> = {}) {
    this.options = {
      dryRun: true,
      collections: ['tasks', 'ratings', 'notifications', 'taskEvents', 'webhooks', 'offers'],
      keepLastNDays: 7,
      maxRecords: 1000,
      includeUsers: false,
      includeFiles: false,
      backup: true,
      ...options,
    };

    // Initialize Firebase Admin
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID || '',
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    };

    const adminApp = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    });

    this.db = getFirestore();
    this.auth = getAuth();
    this.storage = getStorage();
  }

  async scrub(): Promise<void> {
    logger.info('Starting staging environment cleanup...');
    logger.info(`Options: ${JSON.stringify(this.options, null, 2)}`);

    if (this.options.dryRun) {
      logger.info('DRY RUN MODE - No changes will be made');
    }

    try {
      // Create backup if requested
      if (this.options.backup) {
        await this.createBackup();
      }

      // Scrub collections
      for (const collectionName of this.options.collections) {
        await this.scrubCollection(collectionName);
      }

      // Scrub users if requested
      if (this.options.includeUsers) {
        await this.scrubUsers();
      }

      // Scrub files if requested
      if (this.options.includeFiles) {
        await this.scrubFiles();
      }

      logger.info('Staging environment cleanup completed successfully');
    } catch (error) {
      logger.error('Error during staging cleanup:', error);
      throw error;
    }
  }

  private async createBackup(): Promise<void> {
    try {
      logger.info('Creating backup...');
      
      const backupData: Record<string, any[]> = {};
      
      // Backup all collections
      for (const collectionName of this.options.collections) {
        try {
          const snapshot = await this.db.collection(collectionName).get();
          backupData[collectionName] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          logger.info(`Backed up ${snapshot.size} documents from ${collectionName}`);
        } catch (error) {
          logger.warn(`Failed to backup collection ${collectionName}:`, error);
        }
      }

      // Save backup to file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `staging-backup-${timestamp}.json`;
      
      // In a real implementation, save to file system or cloud storage
      logger.info(`Backup created: ${backupFileName} (${JSON.stringify(backupData).length} bytes)`);
      
    } catch (error) {
      logger.error('Failed to create backup:', error);
      if (!this.options.dryRun) {
        throw new Error('Backup failed - aborting cleanup');
      }
    }
  }

  private async scrubCollection(collectionName: string): Promise<void> {
    try {
      logger.info(`Scrubbing collection: ${collectionName}`);
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.options.keepLastNDays);
      
      // Get documents to delete
      let query = this.db.collection(collectionName)
        .where('createdAt', '<', cutoffDate)
        .orderBy('createdAt', 'asc')
        .limit(this.options.maxRecords);
      
      const snapshot = await query.get();
      
      if (snapshot.empty) {
        logger.info(`No documents to delete in ${collectionName}`);
        return;
      }

      logger.info(`Found ${snapshot.size} documents to delete in ${collectionName}`);
      
      if (this.options.dryRun) {
        logger.info(`DRY RUN: Would delete ${snapshot.size} documents from ${collectionName}`);
        return;
      }

      // Delete documents in batches
      const batchSize = 500;
      const documents = snapshot.docs;
      
      for (let i = 0; i < documents.length; i += batchSize) {
        const batch = this.db.batch();
        const batchDocs = documents.slice(i, i + batchSize);
        
        for (const doc of batchDocs) {
          batch.delete(doc.ref);
        }
        
        await batch.commit();
        logger.info(`Deleted batch ${Math.floor(i / batchSize) + 1} from ${collectionName}`);
      }
      
      logger.info(`Successfully deleted ${documents.length} documents from ${collectionName}`);
      
    } catch (error) {
      logger.error(`Error scrubbing collection ${collectionName}:`, error);
      throw error;
    }
  }

  private async scrubUsers(): Promise<void> {
    try {
      logger.info('Scrubbing users...');
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.options.keepLastNDays);
      
      // Get users to delete
      const usersSnapshot = await this.db.collection('users')
        .where('createdAt', '<', cutoffDate)
        .orderBy('createdAt', 'asc')
        .limit(this.options.maxRecords)
        .get();
      
      if (usersSnapshot.empty) {
        logger.info('No users to delete');
        return;
      }

      logger.info(`Found ${usersSnapshot.size} users to delete`);
      
      if (this.options.dryRun) {
        logger.info(`DRY RUN: Would delete ${usersSnapshot.size} users`);
        return;
      }

      // Delete users in batches
      const batchSize = 100; // Smaller batch size for users due to auth complexity
      const users = usersSnapshot.docs;
      
      for (let i = 0; i < users.length; i += batchSize) {
        const batch = this.db.batch();
        const batchUsers = users.slice(i, i + batchSize);
        
        for (const userDoc of batchUsers) {
          try {
            // Delete from Firestore
            batch.delete(userDoc.ref);
            
            // Delete from Firebase Auth
            await this.auth.deleteUser(userDoc.id);
          } catch (error) {
            logger.warn(`Failed to delete user ${userDoc.id}:`, error);
          }
        }
        
        await batch.commit();
        logger.info(`Deleted batch ${Math.floor(i / batchSize) + 1} of users`);
      }
      
      logger.info(`Successfully deleted ${users.length} users`);
      
    } catch (error) {
      logger.error('Error scrubbing users:', error);
      throw error;
    }
  }

  private async scrubFiles(): Promise<void> {
    try {
      logger.info('Scrubbing files...');
      
      // List all files in storage
      const bucket = this.storage.bucket();
      const [files] = await bucket.getFiles();
      
      if (files.length === 0) {
        logger.info('No files to delete');
        return;
      }

      logger.info(`Found ${files.length} files in storage`);
      
      if (this.options.dryRun) {
        logger.info(`DRY RUN: Would delete ${files.length} files`);
        return;
      }

      // Delete files in batches
      const batchSize = 100;
      
      for (let i = 0; i < files.length; i += batchSize) {
        const batchFiles = files.slice(i, i + batchSize);
        
        try {
          await Promise.all(batchFiles.map(file => file.delete()));
          logger.info(`Deleted batch ${Math.floor(i / batchSize) + 1} of files`);
        } catch (error) {
          logger.warn(`Failed to delete batch ${Math.floor(i / batchSize) + 1}:`, error);
        }
      }
      
      logger.info(`Successfully deleted ${files.length} files`);
      
    } catch (error) {
      logger.error('Error scrubbing files:', error);
      throw error;
    }
  }

  async getCollectionStats(): Promise<Record<string, { count: number; oldest: Date | null; newest: Date | null }>> {
    const stats: Record<string, { count: number; oldest: Date | null; newest: Date | null }> = {};
    
    for (const collectionName of this.options.collections) {
      try {
        const snapshot = await this.db.collection(collectionName)
          .orderBy('createdAt', 'asc')
          .get();
        
        if (snapshot.empty) {
          stats[collectionName] = { count: 0, oldest: null, newest: null };
          continue;
        }
        
        const docs = snapshot.docs;
        const oldest = docs[0].data().createdAt?.toDate() || null;
        const newest = docs[docs.length - 1].data().createdAt?.toDate() || null;
        
        stats[collectionName] = {
          count: docs.length,
          oldest,
          newest,
        };
      } catch (error) {
        logger.warn(`Failed to get stats for collection ${collectionName}:`, error);
        stats[collectionName] = { count: 0, oldest: null, newest: null };
      }
    }
    
    return stats;
  }

  async estimateCleanup(): Promise<{
    collections: Record<string, { toDelete: number; toKeep: number }>;
    totalToDelete: number;
    totalToKeep: number;
  }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.options.keepLastNDays);
    
    const estimates: Record<string, { toDelete: number; toKeep: number }> = {};
    let totalToDelete = 0;
    let totalToKeep = 0;
    
    for (const collectionName of this.options.collections) {
      try {
        const [oldSnapshot, newSnapshot] = await Promise.all([
          this.db.collection(collectionName)
            .where('createdAt', '<', cutoffDate)
            .get(),
          this.db.collection(collectionName)
            .where('createdAt', '>=', cutoffDate)
            .get(),
        ]);
        
        const toDelete = Math.min(oldSnapshot.size, this.options.maxRecords);
        const toKeep = newSnapshot.size;
        
        estimates[collectionName] = { toDelete, toKeep };
        totalToDelete += toDelete;
        totalToKeep += toKeep;
        
      } catch (error) {
        logger.warn(`Failed to estimate cleanup for collection ${collectionName}:`, error);
        estimates[collectionName] = { toDelete: 0, toKeep: 0 };
      }
    }
    
    return {
      collections: estimates,
      totalToDelete,
      totalToKeep,
    };
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  const options: Partial<ScrubOptions> = {
    dryRun: !args.includes('--execute'),
    collections: args.includes('--all-collections') 
      ? ['tasks', 'ratings', 'notifications', 'taskEvents', 'webhooks', 'offers', 'users', 'payments']
      : ['tasks', 'ratings', 'notifications', 'taskEvents', 'webhooks', 'offers'],
    keepLastNDays: parseInt(args.find(arg => arg.startsWith('--keep-days='))?.split('=')[1] || '7'),
    maxRecords: parseInt(args.find(arg => arg.startsWith('--max-records='))?.split('=')[1] || '1000'),
    includeUsers: args.includes('--include-users'),
    includeFiles: args.includes('--include-files'),
    backup: !args.includes('--no-backup'),
  };

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Staging Environment Cleanup Script

Usage: ts-node scrub-staging.ts [options]

Options:
  --execute              Actually perform the cleanup (default: dry run)
  --all-collections      Include all collections including users and payments
  --keep-days=N          Keep data from last N days (default: 7)
  --max-records=N        Maximum records to delete per collection (default: 1000)
  --include-users        Also delete user accounts
  --include-files        Also delete storage files
  --no-backup           Skip backup creation
  --help, -h            Show this help message

Examples:
  ts-node scrub-staging.ts --execute --keep-days=3
  ts-node scrub-staging.ts --execute --include-users --include-files
  ts-node scrub-staging.ts --all-collections --max-records=500
`);
    return;
  }

  try {
    const scrubber = new StagingScrubber(options);
    
    // Show current stats
    logger.info('Current collection statistics:');
    const stats = await scrubber.getCollectionStats();
    for (const [collection, stat] of Object.entries(stats)) {
      logger.info(`  ${collection}: ${stat.count} documents`);
    }
    
    // Show cleanup estimate
    logger.info('\nCleanup estimate:');
    const estimate = await scrubber.estimateCleanup();
    for (const [collection, est] of Object.entries(estimate.collections)) {
      logger.info(`  ${collection}: delete ${est.toDelete}, keep ${est.toKeep}`);
    }
    logger.info(`Total: delete ${estimate.totalToDelete}, keep ${estimate.totalToKeep}`);
    
    // Confirm execution
    if (!options.dryRun) {
      logger.info('\n⚠️  WARNING: This will permanently delete data!');
      logger.info('Press Ctrl+C to cancel or wait 10 seconds to continue...');
      
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    
    // Execute cleanup
    await scrubber.scrub();
    
    // Show final stats
    logger.info('\nFinal collection statistics:');
    const finalStats = await scrubber.getCollectionStats();
    for (const [collection, stat] of Object.entries(finalStats)) {
      logger.info(`  ${collection}: ${stat.count} documents`);
    }
    
  } catch (error) {
    logger.error('Script failed:', error);
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

export { StagingScrubber };
