// services/FirestoreService.js - Simplified with Mock Data Support
import firestore from '@react-native-firebase/firestore';

// Mock data for development
const mockTasks = [
  {
    id: '1',
    title: 'Calculus Assignment Help',
    description: 'Need help with derivatives and integrals for my calculus homework. The assignment covers topics from Chapter 3-5 including chain rule, implicit differentiation, and applications of derivatives.',
    budget: 50,
    subject: 'Math',
    urgency: 'high',
    status: 'awaiting_expert',
    matchingType: 'manual',
    isActive: true,
    requesterId: 'user1',
    requesterName: 'John S.',
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 24,
    applicantCount: 3,
    tags: ['Calculus', 'Derivatives', 'Integrals'],
    aiLevel: 'assisted',
    isPublic: true,
  },
  {
    id: '2',
    title: 'Python Web Development',
    description: 'Build a Flask web application with user authentication and database integration.',
    budget: 120,
    subject: 'Coding',
    urgency: 'medium',
    status: 'awaiting_expert',
    matchingType: 'manual',
    isActive: true,
    requesterId: 'user2',
    requesterName: 'Sarah M.',
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 31,
    applicantCount: 5,
    tags: ['Python', 'Flask', 'Web Development'],
    aiLevel: 'enhanced',
    isPublic: true,
  },
  {
    id: '3',
    title: 'Research Paper Writing',
    description: 'World War II impact analysis - 2000 words with proper citations.',
    budget: 80,
    subject: 'History',
    urgency: 'low',
    status: 'awaiting_expert',
    matchingType: 'manual',
    isActive: true,
    requesterId: 'user3',
    requesterName: 'Mike R.',
    createdAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 18,
    applicantCount: 2,
    tags: ['History', 'Research', 'Citations'],
    aiLevel: 'none',
    isPublic: true,
  },
];

const mockNotifications = [
  {
    id: '1',
    type: 'task_accepted',
    title: 'Task Accepted',
    message: 'Sarah Chen has accepted your "Calculus Assignment Help" task',
    timestamp: '2 minutes ago',
    isRead: false,
    taskId: 'req_1',
    taskTitle: 'Calculus Assignment Help',
    expertName: 'Sarah Chen',
  },
  {
    id: '2',
    type: 'task_completed',
    title: 'Task Completed',
    message: 'Your "Python Web Development" task has been completed and is ready for review',
    timestamp: '1 hour ago',
    isRead: false,
    taskId: 'req_2',
    taskTitle: 'Python Web Development',
    expertName: 'Alex Kumar',
  },
];

class FirestoreService {
  // Collections
  COLLECTIONS = {
    TASKS: 'tasks',
    USERS: 'users',
    NOTIFICATIONS: 'notifications',
    REVIEWS: 'reviews',
    PAYMENTS: 'payments'
  };

  // Connection status tracking
  connectionListeners = new Set();
  isConnected = true;

  constructor() {
    // Check if we're using mock Firebase
    // Handle case where db might not be initialized yet
    const firebaseStatus = getFirebaseStatus();
    this.isMocked = firebaseStatus.isMocked || firestore?._type === 'mock-firestore';
    console.log(`🔧 FirestoreService initialized - Mocked: ${this.isMocked}`);
  }

  // Add connection listener
  addConnectionListener(callback) {
    this.connectionListeners.add(callback);
    return () => this.connectionListeners.delete(callback);
  }

  // Notify all listeners about connection status change
  notifyConnectionStatus(isConnected) {
    if (this.isConnected !== isConnected) {
      this.isConnected = isConnected;
      this.connectionListeners.forEach(callback => {
        try {
          callback(isConnected);
        } catch (error) {
          console.error('Connection listener error:', error);
        }
      });
    }
  }

  // Get available manual match tasks for expert feed
  async getAvailableManualTasks(filters = {}) {
    try {
      console.log('🔍 Getting available manual tasks with filters:', filters);
      
      if (this.isMocked) {
        // Return mock data
        let filteredTasks = mockTasks.filter(task => 
          task.status === 'awaiting_expert' && 
          task.matchingType === 'manual' && 
          task.isActive
        );

        // Apply filters
        if (filters.subject && filters.subject !== 'all') {
          filteredTasks = filteredTasks.filter(task => task.subject === filters.subject);
        }
        
        if (filters.urgency && filters.urgency !== 'all') {
          filteredTasks = filteredTasks.filter(task => task.urgency === filters.urgency);
        }

        // Apply sorting
        switch (filters.sortBy) {
          case 'price_desc':
            filteredTasks.sort((a, b) => b.budget - a.budget);
            break;
          case 'price_asc':
            filteredTasks.sort((a, b) => a.budget - b.budget);
            break;
          case 'deadline_asc':
            filteredTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
            break;
          case 'recent':
          default:
            filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        }

        // Apply limit
        if (filters.limit) {
          filteredTasks = filteredTasks.slice(0, filters.limit);
        }

        console.log(`✅ Found ${filteredTasks.length} available manual tasks (mock)`);
        
        return {
          success: true,
          data: filteredTasks,
          count: filteredTasks.length
        };
      }

      // Real Firebase implementation
      let q = firestore().collection(this.COLLECTIONS.TASKS)
        .where('matchingType', '==', 'manual')
        .where('status', '==', 'awaiting_expert')
        .where('isActive', '==', true);

      // Apply filters
      if (filters.subject && filters.subject !== 'all') {
        q = q.where('subject', '==', filters.subject);
      }
      
      if (filters.urgency && filters.urgency !== 'all') {
        q = q.where('urgency', '==', filters.urgency);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_desc':
          q = q.orderBy('budgetAmount', 'desc');
          break;
        case 'price_asc':
          q = q.orderBy('budgetAmount', 'asc');
          break;
        case 'deadline_asc':
          q = q.orderBy('deadline', 'asc');
          break;
        case 'recent':
        default:
          q = q.orderBy('createdAt', 'desc');
          break;
      }

      // Apply limit
      q = q.limit(filters.limit || 20);

      const querySnapshot = await q.get();
      const tasks = [];

      querySnapshot.forEach((doc) => {
        const taskData = { id: doc.id, ...doc.data() };
        
        // Convert Firestore timestamps
        if (taskData.createdAt?.toDate) {
          taskData.createdAt = taskData.createdAt.toDate().toISOString();
        }
        if (taskData.deadline?.toDate) {
          taskData.deadline = taskData.deadline.toDate().toISOString();
        }
        
        tasks.push(taskData);
      });

      console.log(`✅ Found ${tasks.length} available manual tasks`);
      
      return {
        success: true,
        data: tasks,
        count: tasks.length
      };
    } catch (error) {
      console.error('❌ Error getting manual tasks:', error);
      return {
        success: false,
        message: 'Failed to load available tasks: ' + error.message,
        data: []
      };
    }
  }

  // Subscribe to manual tasks (for old HomeScreen.js compatibility)
  subscribeToManualTasks(filters, callback) {
    try {
      console.log('🔄 Setting up manual tasks subscription...');
      
      if (this.isMocked) {
        // Return mock data immediately
        let filteredTasks = mockTasks.filter(task => 
          task.status === 'awaiting_expert' && 
          task.matchingType === 'manual' && 
          task.isActive
        );

        // Apply filters
        if (filters.subject && filters.subject !== 'all') {
          filteredTasks = filteredTasks.filter(task => task.subject === filters.subject);
        }
        
        if (filters.urgency && filters.urgency !== 'all') {
          filteredTasks = filteredTasks.filter(task => task.urgency === filters.urgency);
        }

        // Apply sorting
        filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Apply limit
        if (filters.limit) {
          filteredTasks = filteredTasks.slice(0, filters.limit);
        }
        
        callback({
          success: true,
          data: filteredTasks,
          count: filteredTasks.length
        });
        
        // Return a no-op unsubscribe function
        return () => {
          console.log('🔄 Manual tasks subscription cleaned up (mock)');
        };
      }

      // Real Firebase implementation
      let q = firestore().collection(this.COLLECTIONS.TASKS)
        .where('matchingType', '==', 'manual')
        .where('status', '==', 'awaiting_expert')
        .where('isActive', '==', true);

      // Apply filters
      if (filters.subject && filters.subject !== 'all') {
        q = q.where('subject', '==', filters.subject);
      }
      
      if (filters.urgency && filters.urgency !== 'all') {
        q = q.where('urgency', '==', filters.urgency);
      }

      // Apply sorting
      q = q.orderBy('createdAt', 'desc').limit(filters.limit || 20);

      const unsubscribe = q.onSnapshot(
        (querySnapshot) => {
          this.notifyConnectionStatus(true);

          const tasks = [];
          
          querySnapshot.forEach((doc) => {
            const taskData = { id: doc.id, ...doc.data() };
            
            // Convert timestamps
            if (taskData.createdAt?.toDate) {
              taskData.createdAt = taskData.createdAt.toDate().toISOString();
            }
            if (taskData.deadline?.toDate) {
              taskData.deadline = taskData.deadline.toDate().toISOString();
            }
            
            tasks.push(taskData);
          });
          
          console.log(`🔄 Real-time manual tasks update: ${tasks.length} tasks`);
          
          callback({
            success: true,
            data: tasks,
            count: tasks.length
          });
        },
        (error) => {
          console.error('❌ Real-time manual tasks error:', error);
          this.notifyConnectionStatus(false);
          callback({
            success: false,
            message: 'Failed to subscribe to manual tasks: ' + error.message,
            data: []
          });
        }
      );
      
      return unsubscribe;
    } catch (error) {
      console.error('❌ Error setting up manual tasks subscription:', error);
      this.notifyConnectionStatus(false);
      return null;
    }
  }

  // Get manual match tasks (method for existing HomeScreen)
  async getManualMatchTasks(filters = {}) {
    return this.getAvailableManualTasks(filters);
  }

  // Subscribe to manual match tasks (for existing HomeScreen)
  subscribeToManualMatchTasks(callback) {
    try {
      console.log('🔄 Setting up manual match tasks subscription...');
      
      if (this.isMocked) {
        // Return mock data immediately
        const mockData = mockTasks.filter(task => 
          task.status === 'awaiting_expert' && 
          task.matchingType === 'manual' && 
          task.isActive
        );
        
        callback({
          success: true,
          data: mockData,
          count: mockData.length
        });
        
        // Return a no-op unsubscribe function
        return () => {};
      }

      // Real Firebase implementation
      const q = firestore().collection(this.COLLECTIONS.TASKS)
        .where('matchingType', '==', 'manual')
        .where('status', '==', 'awaiting_expert')
        .where('isActive', '==', true)
        .orderBy('createdAt', 'desc')
        .limit(20);

      const unsubscribe = q.onSnapshot(
        (querySnapshot) => {
          this.notifyConnectionStatus(true);

          const tasks = [];
          
          querySnapshot.forEach((doc) => {
            const taskData = { id: doc.id, ...doc.data() };
            
            // Convert timestamps
            if (taskData.createdAt?.toDate) {
              taskData.createdAt = taskData.createdAt.toDate().toISOString();
            }
            if (taskData.deadline?.toDate) {
              taskData.deadline = taskData.deadline.toDate().toISOString();
            }
            
            tasks.push(taskData);
          });
          
          console.log(`🔄 Real-time manual match tasks update: ${tasks.length} tasks`);
          
          callback({
            success: true,
            data: tasks,
            count: tasks.length
          });
        },
        (error) => {
          console.error('❌ Real-time manual match tasks error:', error);
          this.notifyConnectionStatus(false);
          callback({
            success: false,
            message: 'Failed to subscribe to tasks: ' + error.message,
            data: []
          });
        }
      );
      
      return unsubscribe;
    } catch (error) {
      console.error('❌ Error setting up manual match tasks subscription:', error);
      this.notifyConnectionStatus(false);
      return null;
    }
  }

  // Accept task (for existing HomeScreen)
  async acceptTask(taskId, expertId, expertName) {
    try {
      console.log('🎯 Expert accepting task:', { taskId, expertId, expertName });
      
      if (this.isMocked) {
        // Mock implementation
        const task = mockTasks.find(t => t.id === taskId);
        if (!task) {
          return {
            success: false,
            message: 'Task not found'
          };
        }
        
        if (task.status !== 'awaiting_expert') {
          return {
            success: false,
            message: 'Task is no longer available'
          };
        }
        
        // Update task status
        task.status = 'working';
        task.assignedExpertId = expertId;
        task.assignedExpertName = expertName;
        task.assignedAt = new Date().toISOString();
        task.isActive = false;
        
        console.log('✅ Task accepted successfully (mock)');
        
        return {
          success: true,
          message: `Task "${task.title}" accepted successfully! You can now start working on it.`,
          taskData: task
        };
      }

      // Real Firebase implementation
      return await firestore().runTransaction(async (transaction) => {
        const taskRef = firestore().collection(this.COLLECTIONS.TASKS).doc(taskId);
        const taskDoc = await transaction.get(taskRef);
        
        if (!taskDoc.exists) {
          throw new Error('Task not found');
        }
        
        const taskData = taskDoc.data();
        
        // Check if task is still available
        if (taskData.status !== 'awaiting_expert') {
          throw new Error('Task is no longer available');
        }
        
        if (taskData.assignedExpertId) {
          throw new Error('Task has already been assigned to another expert');
        }
        
        // Update task with expert assignment
        const updateData = {
          status: 'working', // Use 'working' status for expert view
          assignedExpertId: expertId,
          assignedExpertName: expertName,
          assignedAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
          isActive: false, // Remove from public feed
        };
        
        transaction.update(taskRef, updateData);
        
        // Create notification for requester
        const notificationRef = firestore().collection(this.COLLECTIONS.NOTIFICATIONS).doc();
        transaction.set(notificationRef, {
          userId: taskData.requesterId,
          type: 'task_accepted',
          title: 'Expert Found!',
          message: `${expertName} has accepted your task: "${taskData.title}"`,
          taskId: taskId,
          expertId: expertId,
          expertName: expertName,
          createdAt: firestore.FieldValue.serverTimestamp(),
          read: false
        });
        
        console.log('✅ Task accepted successfully');
        
        return {
          success: true,
          message: `Task "${taskData.title}" accepted successfully! You can now start working on it.`,
          taskData: { ...taskData, ...updateData }
        };
      });
      
    } catch (error) {
      console.error('❌ Error accepting task:', error);
      return {
        success: false,
        message: error.message || 'Failed to accept task. Please try again.'
      };
    }
  }

  // Get user notifications
  async getUserNotifications(userId, limit = 20) {
    try {
      if (this.isMocked) {
        // Return mock notifications
        const notifications = mockNotifications.slice(0, limit);
        return {
          success: true,
          data: notifications
        };
      }

      // Real Firebase implementation
      const q = firestore().collection(this.COLLECTIONS.NOTIFICATIONS)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit);
      
      const querySnapshot = await q.get();
      const notifications = [];
      
      querySnapshot.forEach((doc) => {
        const notificationData = { id: doc.id, ...doc.data() };
        
        if (notificationData.createdAt?.toDate) {
          notificationData.createdAt = notificationData.createdAt.toDate().toISOString();
        }
        
        notifications.push(notificationData);
      });
      
      return {
        success: true,
        data: notifications
      };
    } catch (error) {
      console.error('❌ Error getting notifications:', error);
      return {
        success: false,
        message: 'Failed to get notifications: ' + error.message,
        data: []
      };
    }
  }

  // Get task statistics
  async getTaskStats(userId, role = 'requester') {
    try {
      if (this.isMocked) {
        // Return mock stats
        const stats = {
          total: 5,
          active: 2,
          completed: 3,
          cancelled: 0,
          disputed: 0,
          overdue: 0,
          manualMatch: 3,
          autoMatch: 2
        };
        
        return {
          success: true,
          data: stats
        };
      }

      // Real Firebase implementation
      const fieldName = role === 'requester' ? 'requesterId' : 'assignedExpertId';
      
      const q = firestore().collection(this.COLLECTIONS.TASKS)
        .where(fieldName, '==', userId);
      
      const querySnapshot = await q.get();
      const stats = {
        total: 0,
        active: 0,
        completed: 0,
        cancelled: 0,
        disputed: 0,
        overdue: 0,
        manualMatch: 0,
        autoMatch: 0
      };
      
      const now = new Date();
      
      querySnapshot.forEach((doc) => {
        const taskData = doc.data();
        stats.total++;
        
        // Count by status
        switch (taskData.status) {
          case 'in_progress':
          case 'working':
          case 'pending_review':
          case 'awaiting_expert':
            stats.active++;
            break;
          case 'completed':
          case 'payment_received':
            stats.completed++;
            break;
          case 'cancelled':
            stats.cancelled++;
            break;
          case 'disputed':
            stats.disputed++;
            break;
        }
        
        // Count overdue
        if (taskData.deadline?.toDate && taskData.deadline.toDate() < now) {
          if (!['completed', 'cancelled', 'payment_received'].includes(taskData.status)) {
            stats.overdue++;
          }
        }
        
        // Count by matching type
        if (taskData.matchingType === 'manual') {
          stats.manualMatch++;
        } else {
          stats.autoMatch++;
        }
      });
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('❌ Error getting task stats:', error);
      return {
        success: false,
        message: 'Failed to get task stats: ' + error.message,
        data: {
          total: 0,
          active: 0,
          completed: 0,
          cancelled: 0,
          disputed: 0,
          overdue: 0,
          manualMatch: 0,
          autoMatch: 0
        }
      };
    }
  }

  // Submit task action
  async submitTaskAction(taskId, action, userRole, actionData = {}) {
    try {
      console.log(`🔥 Submitting task action: ${action} for task: ${taskId}`);
      
      if (this.isMocked) {
        // Mock implementation
        const task = mockTasks.find(t => t.id === taskId);
        if (!task) {
          return {
            success: false,
            message: 'Task not found'
          };
        }
        
        // Simulate action processing
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('✅ Task action submitted successfully (mock)');
        
        return {
          success: true,
          message: `Action "${action}" completed successfully!`
        };
      }

      // Real Firebase implementation would go here
      return {
        success: false,
        message: 'Firebase not configured for task actions'
      };
    } catch (error) {
      console.error('❌ Error submitting task action:', error);
      return {
        success: false,
        message: 'Failed to submit task action: ' + error.message
      };
    }
  }

  // Subscribe to user tasks
  subscribeToUserTasks(userId, role, callback) {
    try {
      console.log(`🔥 Subscribing to ${role} tasks for user: ${userId}`);
      
      if (this.isMocked) {
        // Mock implementation - return mock data immediately
        const mockUserTasks = mockTasks.filter(task => {
          if (role === 'requester') {
            return task.requesterId === userId;
          } else {
            return task.expertId === userId;
          }
        });
        
        // Simulate async response
        setTimeout(() => {
          callback({
            success: true,
            data: mockUserTasks
          });
        }, 100);
        
        // Return unsubscribe function
        return () => {
          console.log(`🔥 Unsubscribed from ${role} tasks for user: ${userId}`);
        };
      }

      // Real Firebase implementation would go here
      callback({
        success: false,
        message: 'Firebase not configured for user task subscription'
      });
      
      return () => {};
    } catch (error) {
      console.error('❌ Error subscribing to user tasks:', error);
      callback({
        success: false,
        message: 'Failed to subscribe to user tasks: ' + error.message
      });
      return () => {};
    }
  }

  // Create task (simplified)
  async createTask(taskData) {
    try {
      console.log('🔥 Creating task:', taskData);
      
      if (this.isMocked) {
        // Mock implementation
        const newTask = {
          id: `task_${Date.now()}`,
          ...taskData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'awaiting_expert',
          viewCount: 0,
          applicantCount: 0,
          isActive: true,
          matchingType: taskData.matchingType || 'manual',
          isManualMatch: taskData.matchingType === 'manual',
        };
        
        mockTasks.push(newTask);
        
        console.log('✅ Task created successfully (mock)');
        
        return {
          success: true,
          taskId: newTask.id,
          message: 'Task posted to expert marketplace!'
        };
      }

      // Real Firebase implementation would go here
      return {
        success: false,
        message: 'Firebase not configured for task creation'
      };
    } catch (error) {
      console.error('❌ Error creating task:', error);
      return {
        success: false,
        message: 'Failed to create task: ' + error.message
      };
    }
  }
}

// Export singleton instance
const firestoreService = new FirestoreService();
export default firestoreService;
