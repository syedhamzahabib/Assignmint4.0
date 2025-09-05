// src/services/matching/inviteService.ts - Service for managing task invites to experts
import { collection, query, where, getDocs, getDoc, addDoc, writeBatch, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Task, ExpertUser, Invite } from '../../types';
import { getEligibleExperts, rankExperts } from '../../utils/matching/score';
import { config } from '../../config/environment';

export class InviteService {
  private db = firestore();
  private useMock = config.USE_MOCK_DATA;
  
  // Test injection seam
  private static __testDataSource: any | null = null;
  private getDS() { return InviteService.__testDataSource ?? this.db; }

  /**
   * Get eligible experts for a task based on subject and basic criteria
   */
  async getEligibleExperts(task: Task): Promise<ExpertUser[]> {
    try {
      // Query experts by subject
      const usersRef = collection(this.getDS(), 'users');
      const usersQuery = query(
        usersRef,
        where('subjects', 'array-contains', task.subject),
        where('ratingAvg', '>=', 3.0),
        where('ratingCount', '>=', 3)
      );
      const snapshot = await getDocs(usersQuery);

      const experts: ExpertUser[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        experts.push({
          uid: doc.id,
          displayName: data.displayName || 'Unknown Expert',
          subjects: data.subjects || [],
          minPrice: data.minPrice,
          maxPrice: data.maxPrice,
          level: data.level || 'UG',
          ratingAvg: data.ratingAvg || 0,
          ratingCount: data.ratingCount || 0,
          acceptRate: data.acceptRate || 0.5,
          medianResponseMins: data.medianResponseMins || 60,
          completedBySubject: data.completedBySubject || {},
        });
      });

      return experts;
    } catch (error) {
      console.error('Error getting eligible experts:', error);
      throw error;
    }
  }

  /**
   * Rank experts for a specific task using the scoring algorithm
   */
  async rankExperts(task: Task, experts: ExpertUser[]) {
    return rankExperts(task, experts);
  }

  /**
   * Create invites for the top experts and send notifications
   */
  async writeInvites(
    taskId: string,
    topExperts: Array<{ expert: ExpertUser; score: number }>,
    maxInvites: number = 5
  ): Promise<Invite[]> {
    try {
      const invites: Invite[] = [];
      const batch = writeBatch(this.getDS());
      const now = new Date();

      // Limit to maxInvites
      const expertsToInvite = topExperts.slice(0, maxInvites);

      for (const { expert, score } of expertsToInvite) {
        const inviteRef = doc(collection(this.getDS(), 'invites'));
        const invite: Omit<Invite, 'inviteId'> = {
          taskId,
          expertId: expert.uid,
          sentAt: now,
          respondedAt: null,
          status: 'sent',
          lastScore: score,
        };

        batch.set(inviteRef, invite);
        invites.push({
          inviteId: inviteRef.id,
          ...invite,
        });
      }

      // Update task with matching metadata
      const taskRef = doc(this.getDS(), 'tasks', taskId);
      const nextWaveAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes from now
      
              batch.update(taskRef, {
          matching: {
            invitedNow: expertsToInvite.length,
            nextWaveAt: nextWaveAt,
          },
        });

      await batch.commit();

      // Send push notifications (if enabled and not in mock mode)
      if (!this.useMock && config.ENABLE_PUSH_NOTIFICATIONS) {
        await this.sendPushNotifications(invites);
      }

      console.log(`Created ${invites.length} invites for task ${taskId}`);
      return invites;
    } catch (error) {
      console.error('Error writing invites:', error);
      throw error;
    }
  }

  /**
   * Send push notifications for invites
   */
  private async sendPushNotifications(invites: Invite[]): Promise<void> {
    try {
      // This would integrate with your existing push notification system
      // For now, we'll just log the notifications
      for (const invite of invites) {
        console.log(`Sending push notification to expert ${invite.expertId} for task ${invite.taskId}`);
        
        // TODO: Integrate with existing push notification service
        // await pushService.sendNotification({
        //   userId: invite.expertId,
        //   title: 'New Task Invite',
        //   body: 'You have a new task invite!',
        //   data: { taskId: invite.taskId, inviteId: invite.inviteId }
        // });
      }
    } catch (error) {
      console.warn('Failed to send push notifications:', error);
      // Don't throw - push notifications are not critical for the core flow
    }
  }

  /**
   * Get invites for a specific expert
   */
  async getExpertInvites(expertId: string): Promise<Invite[]> {
    try {
      const invitesRef = collection(this.getDS(), 'invites');
      const invitesQuery = query(
        invitesRef,
        where('expertId', '==', expertId),
        where('status', '==', 'sent')
      );
      const snapshot = await getDocs(invitesQuery);

      return snapshot.docs.map(doc => ({
        inviteId: doc.id,
        ...doc.data(),
        sentAt: doc.data().sentAt instanceof Date ? doc.data().sentAt : new Date(),
        respondedAt: doc.data().respondedAt instanceof Date ? doc.data().respondedAt : null,
      })) as Invite[];
    } catch (error) {
      console.error('Error getting expert invites:', error);
      throw error;
    }
  }

  /**
   * Update invite status when expert responds
   */
  async updateInviteStatus(
    inviteId: string,
    status: 'accepted' | 'declined',
    expertId: string
  ): Promise<void> {
    try {
      const inviteRef = doc(this.getDS(), 'invites', inviteId);
      const inviteDoc = await getDoc(inviteRef);

      if (!inviteDoc.exists()) {
        throw new Error('Invite not found');
      }

      const inviteData = inviteDoc.data();
      if (inviteData?.expertId !== expertId) {
        throw new Error('Unauthorized to update this invite');
      }

      await updateDoc(inviteRef, {
        status,
        respondedAt: serverTimestamp(),
      });

      console.log(`Updated invite ${inviteId} status to ${status}`);
    } catch (error) {
      console.error('Error updating invite status:', error);
      throw error;
    }
  }

  /**
   * Get all invites for a specific task
   */
  async getTaskInvites(taskId: string): Promise<Invite[]> {
    try {
            const invitesRef = collection(this.getDS(), 'invites');
      const invitesQuery = query(
        invitesRef,
        where('taskId', '==', taskId)
      );
      const snapshot = await getDocs(invitesQuery);

      return snapshot.docs.map(doc => ({
        inviteId: doc.id,
        ...doc.data(),
        sentAt: doc.data().sentAt instanceof Date ? doc.data().sentAt : new Date(),
        respondedAt: doc.data().respondedAt instanceof Date ? doc.data().respondedAt : null,
      })) as Invite[];
    } catch (error) {
      console.error('Error getting task invites:', error);
      throw error;
    }
  }
}

export default new InviteService();

// Test injection seam
export function __setTestDataSource(ds: any) { 
  (InviteService as any).__testDataSource = ds; 
}
