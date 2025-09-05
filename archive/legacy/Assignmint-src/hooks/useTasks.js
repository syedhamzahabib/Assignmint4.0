// src/hooks/useTasks.js
// Custom hook for managing task state and operations

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import TaskService from '../services/TaskService';

export const useTasks = (role) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    overdue: 0
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load tasks function
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await TaskService.getTasksByRole(role);
      if (response.success) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setError(error.message || 'Failed to load tasks');
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [role]);

  // Load stats function
  const loadStats = useCallback(async () => {
    try {
      const response = await TaskService.getTaskStats(role);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.log('Failed to load stats:', error);
      // Don't show error for stats as it's not critical
    }
  }, [role]);

  // Refresh function
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadTasks(), loadStats()]);
    setRefreshing(false);
  }, [loadTasks, loadStats]);

  // Submit task action
  const submitTaskAction = useCallback(async (taskId, action, data = {}) => {
    try {
      setActionLoading(true);
      
      const response = await TaskService.submitTaskAction(taskId, action, role, data);
      
      if (response.success) {
        // Update local task state if new status provided
        if (response.data.newStatus) {
          setTasks(prevTasks => 
            prevTasks.map(task => 
              task.id === taskId 
                ? { ...task, status: response.data.newStatus }
                : task
            )
          );
        }
        
        // Refresh tasks and stats
        await Promise.all([loadTasks(), loadStats()]);
        
        return response;
      }
    } catch (error) {
      console.error(`Task action ${action} failed:`, error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  }, [role, loadTasks, loadStats]);

  // Get task by ID
  const getTaskById = useCallback(async (taskId) => {
    try {
      const response = await TaskService.getTaskById(taskId, role);
      return response.data;
    } catch (error) {
      console.error('Failed to get task by ID:', error);
      throw error;
    }
  }, [role]);

  // Filter tasks by status
  const getTasksByStatus = useCallback((status) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  // Filter tasks by urgency
  const getTasksByUrgency = useCallback((urgency) => {
    return tasks.filter(task => task.urgency === urgency);
  }, [tasks]);

  // Search tasks
  const searchTasks = useCallback((query) => {
    if (!query.trim()) return tasks;
    
    const lowerQuery = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowerQuery) ||
      task.subject.toLowerCase().includes(lowerQuery) ||
      task.description?.toLowerCase().includes(lowerQuery) ||
      (task.expertName && task.expertName.toLowerCase().includes(lowerQuery)) ||
      (task.requesterName && task.requesterName.toLowerCase().includes(lowerQuery))
    );
  }, [tasks]);

  // Load data on mount and role change
  useEffect(() => {
    loadTasks();
    loadStats();
  }, [loadTasks, loadStats]);

  return {
    // State
    tasks,
    stats,
    loading,
    refreshing,
    actionLoading,
    error,
    
    // Actions
    loadTasks,
    loadStats,
    onRefresh,
    submitTaskAction,
    getTaskById,
    
    // Computed values
    getTasksByStatus,
    getTasksByUrgency,
    searchTasks,
    
    // Helper values
    hasActiveTasks: stats.active > 0,
    hasCompletedTasks: stats.completed > 0,
    hasOverdueTasks: stats.overdue > 0,
    isEmpty: tasks.length === 0 && !loading,
  };
};

export default useTasks;