// src/hooks/useMatching.ts - Custom hook for the matching system
import { useState, useEffect, useCallback } from 'react';
import { Task, ExpertUser, Invite } from '../types';
import inviteService from '../services/matching/inviteService';
import reservationService from '../services/matching/reservationService';
import { config } from '../config/environment';

export interface UseMatchingReturn {
  // Task matching
  triggerMatching: (taskId: string) => Promise<void>;
  getTaskMatchingStatus: (taskId: string) => Promise<any>;
  
  // Expert operations
  softClaimTask: (taskId: string, expertId: string) => Promise<boolean>;
  confirmTaskClaim: (taskId: string, expertId: string) => Promise<boolean>;
  getTaskReservation: (taskId: string) => Promise<any>;
  
  // Invites
  getExpertInvites: (expertId: string) => Promise<Invite[]>;
  updateInviteStatus: (inviteId: string, status: 'accepted' | 'declined', expertId: string) => Promise<void>;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Clear error
  clearError: () => void;
}

export const useMatching = (): UseMatchingReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const triggerMatching = useCallback(async (taskId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Import dynamically to avoid circular dependencies
      const { default: taskCreationTrigger } = await import('../services/matching/onTaskCreate');
      await taskCreationTrigger.manuallyTriggerMatching(taskId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to trigger matching';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTaskMatchingStatus = useCallback(async (taskId: string): Promise<any> => {
    try {
      const invites = await inviteService.getTaskInvites(taskId);
      const reservation = await reservationService.getTaskReservation(taskId);
      
      return {
        invites,
        reservation,
        totalInvites: invites.length,
        hasReservation: !!reservation,
        timeRemaining: reservation?.timeRemaining || 0,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get matching status';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const softClaimTask = useCallback(async (taskId: string, expertId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await reservationService.softClaim(taskId, expertId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to soft-claim task';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmTaskClaim = useCallback(async (taskId: string, expertId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await reservationService.confirmClaim(taskId, expertId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to confirm claim';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTaskReservation = useCallback(async (taskId: string): Promise<any> => {
    try {
      return await reservationService.getTaskReservation(taskId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get task reservation';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const getExpertInvites = useCallback(async (expertId: string): Promise<Invite[]> => {
    try {
      return await inviteService.getExpertInvites(expertId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get expert invites';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateInviteStatus = useCallback(async (
    inviteId: string, 
    status: 'accepted' | 'declined', 
    expertId: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await inviteService.updateInviteStatus(inviteId, status, expertId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update invite status';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    triggerMatching,
    getTaskMatchingStatus,
    softClaimTask,
    confirmTaskClaim,
    getTaskReservation,
    getExpertInvites,
    updateInviteStatus,
    isLoading,
    error,
    clearError,
  };
};

export default useMatching;
