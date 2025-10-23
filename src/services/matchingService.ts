// src/services/matchingService.ts - Frontend auto-matching service
import { auth } from '../lib/firebase';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

export interface Expert {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'expert' | 'both';
  rating: number;
  totalReviews: number;
  tasksCompleted: number;
  trustScore: number;
  isVerified: boolean;
  subjects: string[];
  hourlyRate?: number;
  availability: 'available' | 'busy' | 'offline';
  lastActive: Date;
}

export interface MatchingResult {
  expert: Expert | null;
  confidence: number;
  reason: string;
  alternatives: Expert[];
}

export interface AutoMatchResult {
  success: boolean;
  message: string;
  data?: {
    expert: Expert;
    confidence: number;
    reason: string;
  };
  alternatives?: Expert[];
}

class MatchingService {
  private async getAuthToken(): Promise<string | null> {
    try {
      const user = auth();
      if (!user) return null;
      
      const token = await user.getIdToken();
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Find the best expert for a specific task
   */
  async findExpertForTask(taskId: string): Promise<MatchingResult> {
    try {
      console.log(`🔍 Finding expert for task: ${taskId}`);
      
      const result = await this.makeRequest(`/matching/find-expert/${taskId}`, {
        method: 'POST',
      });

      return result.data;
    } catch (error) {
      console.error('Error finding expert:', error);
      return {
        expert: null,
        confidence: 0,
        reason: 'Error occurred during matching process',
        alternatives: []
      };
    }
  }

  /**
   * Assign an expert to a task (for auto-matching)
   */
  async assignExpertToTask(taskId: string, expertId: string): Promise<boolean> {
    try {
      console.log(`👤 Assigning expert ${expertId} to task ${taskId}`);
      
      const result = await this.makeRequest(`/matching/assign-expert/${taskId}`, {
        method: 'POST',
        body: JSON.stringify({ expertId }),
      });

      return result.success;
    } catch (error) {
      console.error('Error assigning expert:', error);
      return false;
    }
  }

  /**
   * Get available experts for a specific subject
   */
  async getAvailableExperts(subject: string, limit: number = 10): Promise<Expert[]> {
    try {
      console.log(`👥 Getting available experts for subject: ${subject}`);
      
      const result = await this.makeRequest(`/matching/available-experts?subject=${encodeURIComponent(subject)}&limit=${limit}`);
      
      return result.data;
    } catch (error) {
      console.error('Error getting available experts:', error);
      return [];
    }
  }

  /**
   * Complete auto-matching flow: find and assign expert
   */
  async autoMatchTask(taskId: string): Promise<AutoMatchResult> {
    try {
      console.log(`🤖 Starting auto-matching for task: ${taskId}`);
      
      const result = await this.makeRequest(`/matching/auto-match/${taskId}`, {
        method: 'POST',
      });

      return result;
    } catch (error) {
      console.error('Error in auto-matching:', error);
      return {
        success: false,
        message: 'Auto-matching failed due to an error'
      };
    }
  }

  /**
   * Get ML-powered expert recommendations
   */
  async getMLRecommendations(taskFeatures: any, availableExperts: Expert[]): Promise<any[]> {
    try {
      console.log('🧠 Getting ML recommendations');
      
      const result = await this.makeRequest('/matching/ml-recommendations', {
        method: 'POST',
        body: JSON.stringify({
          taskFeatures,
          availableExperts
        }),
      });

      return result.data;
    } catch (error) {
      console.error('Error getting ML recommendations:', error);
      return [];
    }
  }
}

export const matchingService = new MatchingService();
