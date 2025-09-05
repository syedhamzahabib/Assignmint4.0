// src/services/matching/expandRing.ts - Service for expanding expert invitation pool
import firestore from '@react-native-firebase/firestore';
import { Task, ExpertUser } from '../../types';
import inviteService from './inviteService';
import { config } from '../../config/environment';

export class ExpandRingService {
  private db = firestore();
  private useMock = config.USE_MOCK_DATA;
  
  // Test injection seam
  private static __testDataSource: any | null = null;
  private getDS() { return ExpandRingService.__testDataSource ?? this.db; }

  /**
   * Check if it's time to expand the invitation ring for a task
   */
  async checkAndExpandRing(taskId: string): Promise<boolean> {
    try {
      const taskRef = this.getDS().collection('tasks').doc(taskId);
      const taskDoc = await taskRef.get();
      
      if (!taskDoc.exists) {
        return false;
      }

      const taskData = taskDoc.data() as Task;
      
      // Only expand for open or reserved tasks
      if (taskData.status !== 'open' && taskData.status !== 'reserved') {
        return false;
      }

      // Check if it's time for next wave
      if (!taskData.matching?.nextWaveAt) {
        return false;
      }

      const nextWaveAt = taskData.matching.nextWaveAt instanceof Date ? taskData.matching.nextWaveAt : (taskData.matching.nextWaveAt as any)?.toDate?.() || new Date();
      const now = new Date();
      
      if (now < nextWaveAt) {
        return false;
      }

      // Determine which wave to send
      const invitedCount = taskData.matching.invitedNow || 0;
      
      if (invitedCount < 5) {
        // First wave - invite next 20 experts
        await this.expandToNextWave(taskId, 20);
      } else if (invitedCount < 25) {
        // Second wave - invite next batch
        await this.expandToNextWave(taskId, 50);
      } else {
        // Full broadcast to all verified experts
        await this.fullBroadcast(taskId);
      }

      return true;
    } catch (error) {
      console.error(`Error checking expand ring for task ${taskId}:`, error);
      return false;
    }
  }

  /**
   * Expand to next wave of experts
   */
  private async expandToNextWave(taskId: string, additionalInvites: number): Promise<void> {
    try {
      console.log(`Expanding ring for task ${taskId} - inviting ${additionalInvites} more experts`);

      // Get the task to determine subject
      const taskRef = this.getDS().collection('tasks').doc(taskId);
      const taskDoc = await taskRef.get();
      const taskData = taskDoc.data() as Task;

      // Get eligible experts (excluding already invited ones)
      const eligibleExperts = await this.getEligibleExpertsExcludingInvited(taskId, taskData.subject);
      
      if (eligibleExperts.length === 0) {
        console.log(`No additional eligible experts found for task ${taskId}`);
        return;
      }

      // Rank and invite top experts
      const rankedExperts = await inviteService.rankExperts(taskData, eligibleExperts);
      const expertsToInvite = rankedExperts.slice(0, additionalInvites);

      if (expertsToInvite.length > 0) {
        const invites = await inviteService.writeInvites(taskId, expertsToInvite, additionalInvites);
        
        // Update task with new wave info
        const now = new Date();
        const nextWaveAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes from now
        
        await taskRef.update({
          'matching.invitedNow': firestore.FieldValue.increment(invites.length),
          'matching.nextWaveAt': firestore.Timestamp.fromDate(nextWaveAt),
        });

        console.log(`Expanded ring for task ${taskId}: sent ${invites.length} additional invites`);
        
        if (this.useMock) {
          this.showMockExpansionBanner(taskData.title, invites.length);
        }
      }
    } catch (error) {
      console.error(`Error expanding ring for task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Full broadcast to all verified experts
   */
  private async fullBroadcast(taskId: string): Promise<void> {
    try {
      console.log(`Full broadcast for task ${taskId}`);

      // Get the task
      const taskRef = this.getDS().collection('tasks').doc(taskId);
      const taskDoc = await taskRef.get();
      const taskData = taskDoc.data() as Task;

      // Get all eligible experts (excluding already invited ones)
      const eligibleExperts = await this.getEligibleExpertsExcludingInvited(taskId, taskData.subject);
      
      if (eligibleExperts.length === 0) {
        console.log(`No additional eligible experts found for full broadcast of task ${taskId}`);
        return;
      }

      // Rank and invite all remaining experts
      const rankedExperts = await inviteService.rankExperts(taskData, eligibleExperts);
      
      if (rankedExperts.length > 0) {
        const invites = await inviteService.writeInvites(taskId, rankedExperts, rankedExperts.length);
        
        // Update task - no more waves needed
        await taskRef.update({
          'matching.invitedNow': firestore.FieldValue.increment(invites.length),
          'matching.nextWaveAt': null,
        });

        console.log(`Full broadcast for task ${taskId}: sent ${invites.length} additional invites`);
        
        if (this.useMock) {
          this.showMockFullBroadcastBanner(taskData.title, invites.length);
        }
      }
    } catch (error) {
      console.error(`Error in full broadcast for task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Get eligible experts excluding already invited ones
   */
  private async getEligibleExpertsExcludingInvited(taskId: string, subject: string): Promise<ExpertUser[]> {
    try {
      // Get already invited expert IDs
      const invitesSnapshot = await this.getDS()
        .collection('invites')
        .where('taskId', '==', taskId)
        .get();

      const invitedExpertIds = new Set<string>();
      invitesSnapshot.forEach(doc => {
        invitedExpertIds.add(doc.data().expertId);
      });

      // Get eligible experts
      const eligibleExperts = await inviteService.getEligibleExperts({ subject } as Task);
      
      // Filter out already invited experts
      return eligibleExperts.filter(expert => !invitedExpertIds.has(expert.uid));
    } catch (error) {
      console.error('Error getting eligible experts excluding invited:', error);
      return [];
    }
  }

  /**
   * Show mock mode expansion banner
   */
  private showMockExpansionBanner(taskTitle: string, inviteCount: number): void {
    console.log(`🎯 MOCK MODE: Expanded ring for "${taskTitle}" - sent ${inviteCount} additional invites`);
    console.log(`   Next wave scheduled in 15 minutes`);
  }

  /**
   * Show mock mode full broadcast banner
   */
  private showMockFullBroadcastBanner(taskTitle: string, inviteCount: number): void {
    console.log(`🎯 MOCK MODE: Full broadcast for "${taskTitle}" - sent ${inviteCount} additional invites`);
    console.log(`   All eligible experts have been notified`);
  }

  /**
   * Process all tasks that need ring expansion
   */
  async processAllExpansions(): Promise<number> {
    try {
      const now = firestore.Timestamp.now();
      
      // Find tasks that need expansion
      const snapshot = await this.getDS()
        .collection('tasks')
        .where('matching.nextWaveAt', '<=', now)
        .where('status', 'in', ['open', 'reserved'])
        .get();

      if (snapshot.empty) {
        return 0;
      }

      let processedCount = 0;
      
      for (const doc of snapshot.docs) {
        try {
          const expanded = await this.checkAndExpandRing(doc.id);
          if (expanded) {
            processedCount++;
          }
        } catch (error) {
          console.error(`Error processing expansion for task ${doc.id}:`, error);
        }
      }

      console.log(`Processed ${processedCount} ring expansions`);
      return processedCount;
    } catch (error) {
      console.error('Error processing all expansions:', error);
      return 0;
    }
  }
}

export default new ExpandRingService();

// Test injection seam
export function __setTestDataSource(ds: any) { 
  (ExpandRingService as any).__testDataSource = ds; 
}
