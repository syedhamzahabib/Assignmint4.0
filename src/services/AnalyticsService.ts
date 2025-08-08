// Analytics Service - Stub implementation
// Replace with actual analytics service (Firebase Analytics, Mixpanel, etc.)

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

class AnalyticsService {
  private isEnabled = true;

  track(eventName: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name: eventName,
      properties,
    };

    // Stub implementation - replace with actual analytics
    console.log('📊 Analytics Event:', event);
    
    // TODO: Implement actual analytics tracking
    // Example: Firebase Analytics
    // analytics().logEvent(eventName, properties);
  }

  setUserProperties(properties: Record<string, any>) {
    if (!this.isEnabled) return;
    
    console.log('👤 User Properties:', properties);
    
    // TODO: Implement actual user property setting
    // Example: Firebase Analytics
    // analytics().setUserProperties(properties);
  }

  setUserId(userId: string | null) {
    if (!this.isEnabled) return;
    
    console.log('🆔 User ID:', userId);
    
    // TODO: Implement actual user ID setting
    // Example: Firebase Analytics
    // if (userId) {
    //   analytics().setUserId(userId);
    // } else {
    //   analytics().setUserId(null);
    // }
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }
}

export const analytics = new AnalyticsService();

// Predefined events for consistency
export const ANALYTICS_EVENTS = {
  LANDING_VIEW: 'landing_view',
  GUEST_CONTINUE: 'guest_continue',
  SIGN_UP_START: 'sign_up_start',
  SIGN_UP_COMPLETE: 'sign_up_complete',
  GUEST_GATED_ACTION: 'guest_gated_action',
  POST_TEASER_VIEW: 'post_teaser_view',
  SIGN_IN_START: 'sign_in_start',
  SIGN_IN_COMPLETE: 'sign_in_complete',
  SIGN_OUT: 'sign_out',
  PAYMENT_METHOD_ADDED: 'payment_method_added',
  PAYMENT_METHOD_SKIPPED: 'payment_method_skipped',
  TASK_POSTED: 'task_posted',
  TASK_VIEWED: 'task_viewed',
  OFFER_MADE: 'offer_made',
  OFFER_ACCEPTED: 'offer_accepted',
  CHAT_STARTED: 'chat_started',
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied',
} as const;
