// src/services/matching/reservationService.ts - Service for managing task reservations and claims
import firestore from '@react-native-firebase/firestore';
import { Task } from '../../types';
import { config } from '../../config/environment';

export class ReservationService {
  private db = firestore();
  private useMock = config.USE_MOCK_DATA;
  
  // Test injection seam
  private static __testDataSource: any | null = null;
  private getDS() { return ReservationService.__testDataSource ?? this.db; }

  /**
   * Soft-claim a task (reserve it for 15 minutes)
   */
  async softClaim(taskId: string, expertId: string): Promise<boolean> {
    try {
      const taskRef = this.getDS().collection('tasks').doc(taskId);
      
      // Use transaction to ensure atomicity
      const result = await this.getDS().runTransaction(async (transaction) => {
        const taskDoc = await transaction.get(taskRef);
        
        if (!taskDoc.exists) {
          throw new Error('Task not found');
        }

        const taskData = taskDoc.data() as Task;
        
        // Check if task is still open
        if (taskData.status !== 'open') {
          throw new Error(`Task is not open (status: ${taskData.status})`);
        }

        // Check if expert already has max concurrent reservations (3)
        const currentReservations = await this.getExpertReservationCount(expertId);
        if (currentReservations >= 3) {
          throw new Error('Maximum concurrent reservations reached (3)');
        }

        // Set reservation
        const now = new Date();
        const reservedUntil = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
        
        transaction.update(taskRef, {
          status: 'reserved',
          reservedBy: expertId,
          reservedUntil: firestore.Timestamp.fromDate(reservedUntil),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

        return true;
      });

      console.log(`Task ${taskId} soft-claimed by expert ${expertId}`);
      return result;
    } catch (error) {
      console.error(`Error soft-claiming task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Confirm a soft-claim (convert reservation to claimed)
   */
  async confirmClaim(taskId: string, expertId: string): Promise<boolean> {
    try {
      const taskRef = this.getDS().collection('tasks').doc(taskId);
      
      const result = await this.getDS().runTransaction(async (transaction) => {
        const taskDoc = await transaction.get(taskRef);
        
        if (!taskDoc.exists) {
          throw new Error('Task not found');
        }

        const taskData = taskDoc.data() as Task;
        
        // Check if task is reserved by this expert
        if (taskData.status !== 'reserved' || taskData.reservedBy !== expertId) {
          throw new Error('Task is not reserved by this expert');
        }

        // Check if reservation is still valid
        const now = new Date();
        const reservedUntil = taskData.reservedUntil instanceof Date ? taskData.reservedUntil : (taskData.reservedUntil as any)?.toDate?.() || new Date(0);
        
        if (now > reservedUntil) {
          throw new Error('Reservation has expired');
        }

        // Convert to claimed
        transaction.update(taskRef, {
          status: 'claimed',
          expertId: expertId,
          reservedBy: null,
          reservedUntil: null,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

        return true;
      });

      console.log(`Task ${taskId} confirmed by expert ${expertId}`);
      return result;
    } catch (error) {
      console.error(`Error confirming claim for task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Release expired reservations
   */
  async releaseIfExpired(): Promise<number> {
    try {
      const now = firestore.Timestamp.now();
      
      // Find tasks with expired reservations
      const snapshot = await this.getDS()
        .collection('tasks')
        .where('status', '==', 'reserved')
        .where('reservedUntil', '<', now)
        .get();

      if (snapshot.empty) {
        return 0;
      }

      const batch = this.getDS().batch();
      let releasedCount = 0;

      snapshot.forEach(doc => {
        batch.update(doc.ref, {
          status: 'open',
          reservedBy: null,
          reservedUntil: null,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
        releasedCount++;
      });

      await batch.commit();
      console.log(`Released ${releasedCount} expired reservations`);

      return releasedCount;
    } catch (error) {
      console.error('Error releasing expired reservations:', error);
      throw error;
    }
  }

  /**
   * Get count of current reservations for an expert
   */
  private async getExpertReservationCount(expertId: string): Promise<number> {
    try {
      const now = firestore.Timestamp.now();
      
      const snapshot = await this.getDS()
        .collection('tasks')
        .where('reservedBy', '==', expertId)
        .where('status', '==', 'reserved')
        .where('reservedUntil', '>', now)
        .get();

      return snapshot.size;
    } catch (error) {
      console.error('Error getting expert reservation count:', error);
      return 0;
    }
  }

  /**
   * Get reservation details for a task
   */
  async getTaskReservation(taskId: string): Promise<{
    reservedBy: string | null;
    reservedUntil: Date | null;
    timeRemaining: number; // milliseconds
  } | null> {
    try {
      const taskDoc = await this.getDS().collection('tasks').doc(taskId).get();
      
      if (!taskDoc.exists) {
        return null;
      }

      const taskData = taskDoc.data() as Task;
      
      if (taskData.status !== 'reserved') {
        return null;
      }

      const now = new Date();
      const reservedUntil = taskData.reservedUntil instanceof Date ? taskData.reservedUntil : (taskData.reservedUntil as any)?.toDate?.() || new Date(0);
      const timeRemaining = Math.max(0, reservedUntil.getTime() - now.getTime());

      return {
        reservedBy: taskData.reservedBy || null,
        reservedUntil: taskData.reservedUntil instanceof Date ? taskData.reservedUntil : (taskData.reservedUntil as any)?.toDate?.() || null,
        timeRemaining,
      };
    } catch (error) {
      console.error(`Error getting reservation for task ${taskId}:`, error);
      return null;
    }
  }

  /**
   * Cancel a reservation (for testing or admin purposes)
   */
  async cancelReservation(taskId: string, expertId: string): Promise<boolean> {
    try {
      const taskRef = this.getDS().collection('tasks').doc(taskId);
      
      const result = await this.getDS().runTransaction(async (transaction) => {
        const taskDoc = await transaction.get(taskRef);
        
        if (!taskDoc.exists) {
          throw new Error('Task not found');
        }

        const taskData = taskDoc.data() as Task;
        
        // Check if task is reserved by this expert
        if (taskData.status !== 'reserved' || taskData.reservedBy !== expertId) {
          throw new Error('Task is not reserved by this expert');
        }

        // Release reservation
        transaction.update(taskRef, {
          status: 'open',
          reservedBy: null,
          reservedUntil: null,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

        return true;
      });

      console.log(`Reservation cancelled for task ${taskId} by expert ${expertId}`);
      return result;
    } catch (error) {
      console.error(`Error cancelling reservation for task ${taskId}:`, error);
      throw error;
    }
  }
}

export default new ReservationService();

// Test injection seam
export function __setTestDataSource(ds: any) { 
  (ReservationService as any).__testDataSource = ds; 
}
