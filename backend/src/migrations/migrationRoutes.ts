import express from 'express';
import { MigrationService } from './migrationService';
import { AuthenticatedRequest } from '../utils/auth';
import { logger } from '../utils/logger';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();
const migrationService = new MigrationService();

// Get migration history
router.get('/history', [
  authenticateToken,
  authorizeRole(['admin', 'developer'])
], async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const history = await migrationService.getMigrationHistory();
    return res.json({ data: history });
  } catch (error) {
    logger.error('Error fetching migration history:', error);
    return res.status(500).json({ error: 'Failed to fetch migration history' });
  }
});

// Get migration details
router.get('/:migrationId', [
  authenticateToken,
  authorizeRole(['admin', 'developer'])
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { migrationId } = req.params;
    if (!migrationId) {
      return res.status(400).json({ error: 'Migration ID is required' });
    }

    const migration = await migrationService.getMigration(migrationId);
    if (!migration) {
      return res.status(404).json({ error: 'Migration not found' });
    }

    return res.json({ data: migration });
  } catch (error) {
    logger.error('Error fetching migration:', error);
    return res.status(500).json({ error: 'Failed to fetch migration' });
  }
});

// Test specific migration
router.post('/:migrationId/test', [
  authenticateToken,
  authorizeRole(['admin', 'developer'])
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { migrationId } = req.params;
    if (!migrationId) {
      return res.status(400).json({ error: 'Migration ID is required' });
    }

    const result = await migrationService.testMigration(migrationId);
    return res.json({ data: result });
  } catch (error) {
    logger.error('Error testing migration:', error);
    return res.status(400).json({ error: 'Failed to test migration' });
  }
});

// Apply migration
router.post('/:migrationId/apply', [
  authenticateToken,
  authorizeRole(['admin'])
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { migrationId } = req.params;

    if (!migrationId) {
      return res.status(400).json({ error: 'Migration ID is required' });
    }

    const result = await migrationService.migrate(parseInt(migrationId));
    
    if (result.success > 0) {
      return res.json({ 
        message: 'Migration applied successfully',
        data: result
      });
    } else {
      return res.status(400).json({ 
        error: 'Migration failed',
        data: result
      });
    }
  } catch (error) {
    logger.error('Error applying migration:', error);
    return res.status(500).json({ error: 'Failed to apply migration' });
  }
});

// Rollback migration
router.post('/:migrationId/rollback', [
  authenticateToken,
  authorizeRole(['admin'])
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { migrationId } = req.params;

    if (!migrationId) {
      return res.status(400).json({ error: 'Migration ID is required' });
    }

    const result = await migrationService.rollback(parseInt(migrationId));
    
    if (result.success > 0) {
      return res.json({ 
        message: 'Rollback completed successfully',
        data: result
      });
    } else {
      return res.status(400).json({ 
        error: 'Rollback failed',
        data: result
      });
    }
  } catch (error) {
    logger.error('Error rolling back migration:', error);
    return res.status(500).json({ error: 'Failed to rollback migration' });
  }
});

// Get migration status overview
router.get('/status/overview', [
  authenticateToken,
  authorizeRole(['admin', 'developer'])
], async (_req: AuthenticatedRequest, res: express.Response) => {
  try {
    const status = await migrationService.getMigrationStatus();
    const pending = await migrationService.getPendingMigrations();

    return res.json({
      data: {
        status,
        pending: pending.length,
        recent: 0, // Placeholder for now
        lastCheck: new Date()
      }
    });
  } catch (error) {
    logger.error('Error fetching migration overview:', error);
    return res.status(500).json({ error: 'Failed to fetch migration overview' });
  }
});

export default router;
