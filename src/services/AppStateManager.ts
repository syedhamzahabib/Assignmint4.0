// services/AppStateManager.ts

import { useState, useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';

// Mock API for tasks
const MockTasksAPI = {
  delay: (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms)),

  async getTasksByRole(role: string) {
    await this.delay(500);

    const requesterTasks = [
      {
        id: 'req_1',
        title: 'Solve 10 Calculus Problems',
        dueDate: '2025-05-25',
        status: 'in_progress',
        expertName: 'Sarah Chen',
        subject: 'Math',
        price: '$20',
        urgency: 'medium',
        progress: 65,
      },
      {
        id: 'req_2',
        title: 'Fix bugs in Python script',
        dueDate: '2025-05-22',
        status: 'pending_review',
        expertName: 'Alex Kumar',
        subject: 'Coding',
        price: '$30',
        urgency: 'high',
        progress: 100,
      },
    ];

    const expertTasks = [
      {
        id: 'exp_1',
        title: 'Translate English to Spanish document',
        dueDate: '2025-05-27',
        status: 'working',
        requesterName: 'John Smith',
        subject: 'Language',
        price: '$22',
        progress: 45,
      },
    ];

    return {
      success: true,
      data: role === 'requester' ? requesterTasks : expertTasks,
    };
  },

  async getTaskStats(role: string) {
    await this.delay(200);

    const response = await this.getTasksByRole(role);
    const tasks = response.data as any[];

    return {
      success: true,
      data: {
        total: tasks.length,
        active: tasks.filter((t: any) =>
          ['in_progress', 'working', 'pending_review'].includes(t.status)
        ).length,
        completed: tasks.filter((t: any) =>
          ['completed', 'payment_received'].includes(t.status)
        ).length,
        overdue: 0,
      },
    };
  },
};

interface AppState {
  // App State
  isInitialized: boolean;
  isLoading: boolean;

  // User State
  currentUser: any;
  userRole: string;

  // UI State
  activeTab: string;
  showWallet: boolean;
  walletParams: any;
  unreadNotifications: number;

  // Tasks State
  tasks: any[];
  taskStats: {
    total: number;
    active: number;
    completed: number;
    overdue: number;
  };

  // Loading States
  tasksLoading: boolean;
  actionLoading: boolean;
}

class AppStateManager {
  private state: AppState;
  private listeners: Set<(state: AppState) => void>;
  private initializePromise: Promise<void> | null;

  constructor() {
    this.state = {
      // App State
      isInitialized: false,
      isLoading: false,

      // User State
      currentUser: null,
      userRole: 'requester',

      // UI State
      activeTab: 'home',
      showWallet: false,
      walletParams: {},
      unreadNotifications: 3,

      // Tasks State
      tasks: [],
      taskStats: {
        total: 0,
        active: 0,
        completed: 0,
        overdue: 0,
      },

      // Loading States
      tasksLoading: false,
      actionLoading: false,
    };

    this.listeners = new Set();
    this.initializePromise = null;
  }

  // Subscribe to state changes
  subscribe(listener: (state: AppState) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Update state and notify listeners
  setState(updates: Partial<AppState>) {
    // Prevent unnecessary updates if state hasn't changed
    const hasChanges = Object.keys(updates).some(
      key => this.state[key as keyof AppState] !== updates[key as keyof AppState]
    );

    if (!hasChanges) {return;}

    this.state = { ...this.state, ...updates };
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }

  // Get current state
  getState(): AppState {
    return { ...this.state };
  }

  // Initialize app - prevent multiple calls
  initialize = async (): Promise<void> => {
    if (this.initializePromise) {
      return this.initializePromise;
    }

    this.initializePromise = this._doInitialize();
    return this.initializePromise;
  };

  private async _doInitialize(): Promise<void> {
    try {
      if (this.state.isInitialized) {
        return;
      }

      this.setState({ isLoading: true });

      // Load initial data in parallel
      await Promise.all([
        this.loadTasks(),
        this.loadTaskStats(),
      ]);

      this.setState({
        isInitialized: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('App initialization failed:', error);
      this.setState({
        isLoading: false,
        isInitialized: false,
      });
    } finally {
      this.initializePromise = null;
    }
  }

  // Load tasks
  loadTasks = async (): Promise<void> => {
    try {
      this.setState({ tasksLoading: true });

      const response = await MockTasksAPI.getTasksByRole(this.state.userRole);
      if (response.success) {
        this.setState({
          tasks: response.data,
          tasksLoading: false,
        });
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      this.setState({ tasksLoading: false });
    }
  };

  // Load task statistics
  loadTaskStats = async (): Promise<void> => {
    try {
      const response = await MockTasksAPI.getTaskStats(this.state.userRole);
      if (response.success) {
        this.setState({ taskStats: response.data });
      }
    } catch (error) {
      console.log('Failed to load task stats:', error);
    }
  };

  // Switch user role
  switchRole = async (newRole: string): Promise<void> => {
    if (newRole === this.state.userRole) {
      return;
    }

    this.setState({ userRole: newRole });
    await Promise.all([
      this.loadTasks(),
      this.loadTaskStats(),
    ]);
  };

  // Set user role (alias for switchRole)
  setUserRole = async (newRole: string): Promise<void> => {
    return this.switchRole(newRole);
  };

  // Handle tab change
  setActiveTab = (tabName: string): void => {
    if (tabName === this.state.activeTab) {
      return;
    }

    this.setState({ activeTab: tabName });

    // Load data based on active tab if needed
    if (tabName === 'tasks' && this.state.tasks.length === 0) {
      this.loadTasks();
      this.loadTaskStats();
    }
  };

  // Handle wallet navigation
  openWallet = (params: any = {}): void => {
    this.setState({
      showWallet: true,
      walletParams: params,
    });
  };

  closeWallet = (): void => {
    this.setState({
      showWallet: false,
      walletParams: {},
    });
  };

  // Refresh all data
  refreshData = async (): Promise<void> => {
    await Promise.all([
      this.loadTasks(),
      this.loadTaskStats(),
    ]);
  };
}

// Create singleton instance
const appStateManager = new AppStateManager();

// React hook for using app state with proper memoization
export const useAppState = () => {
  const [state, setState] = useState(() => appStateManager.getState());
  const stateRef = useRef(state);

  // Update ref when state changes to prevent stale closures
  stateRef.current = state;

  useEffect(() => {
    const unsubscribe = appStateManager.subscribe((newState) => {
      // Only update if state actually changed
      if (stateRef.current !== newState) {
        setState(newState);
      }
    });

    return unsubscribe;
  }, []);

  // Memoize action functions to prevent unnecessary re-renders
  const actions = useRef({
    initialize: appStateManager.initialize,
    loadTasks: appStateManager.loadTasks,
    loadTaskStats: appStateManager.loadTaskStats,
    switchRole: appStateManager.switchRole,
    setUserRole: appStateManager.setUserRole,
    setActiveTab: appStateManager.setActiveTab,
    openWallet: appStateManager.openWallet,
    closeWallet: appStateManager.closeWallet,
    refreshData: appStateManager.refreshData,
  });

  return {
    // State
    ...state,

    // Actions (memoized)
    ...actions.current,
  };
};

export default appStateManager;
