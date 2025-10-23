// src/services/matching/onTaskCreate.ts - Trigger for automatic expert matching on task creation
import { Task } from '../../types';
import inviteService from './inviteService';
import { config } from '../../config/environment';

export class TaskCreationTrigger {
  private useMock = config.USE_MOCK_DATA;

  /**
   * Handle new task creation - automatically find and invite experts
   */
  async onTaskCreated(task: Task): Promise<void> {
    try {
      console.log(`Task creation trigger: Processing new task ${task.id}`);

      // Only process open tasks
      if (task.status !== 'open') {
        console.log(`Task ${task.id} status is ${task.status}, skipping matching`);
        return;
      }

      // Get eligible experts
      const eligibleExperts = await inviteService.getEligibleExperts(task);
      console.log(`Found ${eligibleExperts.length} eligible experts for task ${task.id}`);

      if (eligibleExperts.length === 0) {
        console.log(`No eligible experts found for task ${task.id}`);
        return;
      }

      // Rank experts by score
      const rankedExperts = await inviteService.rankExperts(task, eligibleExperts);
      console.log(`Ranked ${rankedExperts.length} experts for task ${task.id}`);

      // Send invites to top experts (default: top 5)
      const maxInvites = this.useMock ? 3 : 5; // Fewer invites in mock mode for testing
      const topExperts = rankedExperts.slice(0, maxInvites);

      if (topExperts.length > 0) {
        const invites = await inviteService.writeInvites(task.id, topExperts, maxInvites);
        console.log(`Sent ${invites.length} invites for task ${task.id}`);

        // Show in-app banner if in mock mode
        if (this.useMock) {
          this.showMockBanner(task, invites.length);
        }
      } else {
        console.log(`No experts to invite for task ${task.id}`);
      }
    } catch (error) {
      console.error(`Error in task creation trigger for task ${task.id}:`, error);
      // Don't throw - this is a background process and shouldn't break task creation
    }
  }

  /**
   * Show in-app banner for mock mode
   */
  private showMockBanner(task: Task, inviteCount: number): void {
    // In a real app, this would use your notification system
    // For now, we'll just log it
    console.log(`🎯 MOCK MODE: Sent ${inviteCount} invites for task "${task.title}"`);
    console.log(`   Next wave scheduled in 15 minutes`);
    
    // TODO: Integrate with your existing notification/banner system
    // notificationService.showBanner({
    //   title: 'Task Matching',
    //   message: `Sent ${inviteCount} expert invites for "${task.title}"`,
    //   type: 'info'
    // });
  }

  /**
   * Manual trigger for testing (can be called from UI)
   */
  async manuallyTriggerMatching(taskId: string): Promise<void> {
    try {
      // Get the task
      const firestore = require('@react-native-firebase/firestore').default();
      const taskDoc = await firestore.collection('tasks').doc(taskId).get();
      
      if (!taskDoc.exists) {
        throw new Error('Task not found');
      }

      const taskData = taskDoc.data();
      const task: Task = {
        id: taskId,
        ...taskData,
        createdAt: taskData.createdAt?.toDate?.() || new Date(),
        deadline: taskData.deadline?.toDate?.() || new Date(),
        deadlineISO: taskData.deadlineISO || taskData.deadline?.toDate?.()?.toISOString() || new Date().toISOString(),
        price: taskData.price || taskData.budget || 0,
        ownerId: taskData.ownerId || taskData.requesterId || '',
      } as Task;

      await this.onTaskCreated(task);
    } catch (error) {
      console.error('Error in manual trigger:', error);
      throw error;
    }
  }
}

export default new TaskCreationTrigger();
