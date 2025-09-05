// src/services/matching/devScheduler.ts - Development scheduler for background tasks
import { config } from '../../config/environment';

export class DevScheduler {
  private intervals: ReturnType<typeof setInterval>[] = [];
  private isRunning = false;

  /**
   * Start the development scheduler
   */
  start(): void {
    if (this.isRunning) return;
    
    console.log('🚀 Starting development scheduler...');
    this.isRunning = true;

    // Release expired reservations every 60 seconds
    const reservationInterval = setInterval(async () => {
      try {
        const { default: reservationService } = await import('./reservationService');
        const releasedCount = await reservationService.releaseIfExpired();
        if (releasedCount > 0) {
          console.log(`🕐 Released ${releasedCount} expired reservations`);
        }
      } catch (error) {
        console.error('Error in reservation cleanup:', error);
      }
    }, 60000); // 60 seconds

    // Process ring expansions every 60 seconds
    const expansionInterval = setInterval(async () => {
      try {
        const { default: expandRingService } = await import('./expandRing');
        const expandedCount = await expandRingService.processAllExpansions();
        if (expandedCount > 0) {
          console.log(`🔄 Processed ${expandedCount} ring expansions`);
        }
      } catch (error) {
        console.error('Error in ring expansion:', error);
      }
    }, 60000); // 60 seconds

    // In mock mode, use shorter intervals for testing
    if (config.USE_MOCK_DATA) {
      // Release reservations every 30 seconds in mock mode
      const mockReservationInterval = setInterval(async () => {
        try {
          const { default: reservationService } = await import('./reservationService');
          const releasedCount = await reservationService.releaseIfExpired();
          if (releasedCount > 0) {
            console.log(`🕐 MOCK MODE: Released ${releasedCount} expired reservations`);
          }
        } catch (error) {
          console.error('Error in mock reservation cleanup:', error);
        }
      }, 30000); // 30 seconds

      // Process expansions every 30 seconds in mock mode
      const mockExpansionInterval = setInterval(async () => {
        try {
          const { default: expandRingService } = await import('./expandRing');
          const expandedCount = await expandRingService.processAllExpansions();
          if (expandedCount > 0) {
            console.log(`🔄 MOCK MODE: Processed ${expandedCount} ring expansions`);
          }
        } catch (error) {
          console.error('Error in mock ring expansion:', error);
        }
      }, 30000); // 30 seconds

      this.intervals.push(mockReservationInterval, mockExpansionInterval);
    }

    this.intervals.push(reservationInterval, expansionInterval);
    
    console.log('✅ Development scheduler started');
  }

  /**
   * Stop the development scheduler
   */
  stop(): void {
    if (!this.isRunning) return;
    
    console.log('🛑 Stopping development scheduler...');
    
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    this.isRunning = false;
    
    console.log('✅ Development scheduler stopped');
  }

  /**
   * Check if scheduler is running
   */
  isActive(): boolean {
    return this.isRunning;
  }

  /**
   * Get scheduler status
   */
  getStatus(): { isRunning: boolean; intervalCount: number } {
    return {
      isRunning: this.isRunning,
      intervalCount: this.intervals.length,
    };
  }
}

export default new DevScheduler();
