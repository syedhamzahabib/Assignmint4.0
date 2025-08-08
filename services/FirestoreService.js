// services/FirestoreService.js - Enhanced with Connection Monitoring and Manual Match support
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  increment,
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import { db } from '../config/firebase';

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

  // Enhanced task creation with Manual Match support
  async createTask(taskData) {
    try {
      console.log('🔥 Creating task:', taskData);
      
      const taskDoc = {
        ...taskData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: taskData.matchingType === 'manual' ? 'awaiting_expert' : 'pending_assignment',
        viewCount: 0,
        applicantCount: 0,
        isActive: true,
        
        // Manual Match specific fields
        matchingType: taskData.matchingType || 'auto',
        isManualMatch: taskData.matchingType === 'manual',
        applicants: [],
        selectedExpertId: null,
        assignedAt: null,
        assignedExpertId: null,
        assignedExpertName: null,
        
        // Searchable fields for manual match feed
        searchKeywords: this.generateSearchKeywords(taskData),
        tags: taskData.tags || [],
      };

      const docRef = await addDoc(collection(db, this.COLLECTIONS.TASKS), taskDoc);
      
      console.log('✅ Task created with ID:', docRef.id);
      
      // If manual match, make it visible on the public feed
      if (taskData.matchingType === 'manual') {
        await this.updateTaskVisibility(docRef.id, true);
      }
      
      return {
        success: true,
        taskId: docRef.id,
        message: taskData.matchingType === 'manual' 
          ? 'Task posted to expert marketplace!' 
          : 'Task created and queued for auto-assignment!'
      };
    } catch (error) {
      console.error('❌ Error creating task:', error);
      return {
        success: false,
        message: 'Failed to create task: ' + error.message
      };
    }
  }

  // Get available manual match tasks for expert feed
  async getAvailableManualTasks(filters = {}) {
    try {
      console.log('🔍 Getting available manual tasks with filters:', filters);
      
      let q = query(
        collection(db, this.COLLECTIONS.TASKS),
        where('matchingType', '==', 'manual'),
        where('status', '==', 'awaiting_expert'),
        where('isActive', '==', true)
      );

      // Apply filters
      if (filters.subject && filters.subject !== 'all') {
        q = query(q, where('subject', '==', filters.subject));
      }
      
      if (filters.urgency && filters.urgency !== 'all') {
        q = query(q, where('urgency', '==', filters.urgency));
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_desc':
          q = query(q, orderBy('budgetAmount', 'desc'));
          break;
        case 'price_asc':
          q = query(q, orderBy('budgetAmount', 'asc'));
          break;
        case 'deadline_asc':
          q = query(q, orderBy('deadline', 'asc'));
          break;
        case 'recent':
        default:
          q = query(q, orderBy('createdAt', 'desc'));
          break;
      }

      // Apply limit
      q = query(q, limit(filters.limit || 20));

      const querySnapshot = await getDocs(q);
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

  // Expert accepts a manual match task
  async acceptManualTask(taskId, expertId, expertData) {
    try {
      console.log('🎯 Expert accepting manual task:', { taskId, expertId });
      
      return await runTransaction(db, async (transaction) => {
        const taskRef = doc(db, this.COLLECTIONS.TASKS, taskId);
        const taskDoc = await transaction.get(taskRef);
        
        if (!taskDoc.exists()) {
          throw new Error('Task not found');
        }
        
        const taskData = taskDoc.data();
        
        // Check if task is still available
        if (taskData.status !== 'awaiting_expert') {
          throw new Error('Task is no longer available');
        }
        
        if (taskData.assignedExpertId) {
          throw new Error('Task has already been assigned');
        }
        
        // Update task with expert assignment
        const updateData = {
          status: 'in_progress',
          assignedExpertId: expertId,
          assignedExpertName: expertData.name || 'Expert',
          assignedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isActive: false, // Remove from public feed
          
          // Expert details
          expertEmail: expertData.email,
          expertRating: expertData.rating || 5.0,
          expertCompletedTasks: expertData.completedTasks || 0,
          expertSpecialties: expertData.specialties || [],
        };
        
        transaction.update(taskRef, updateData);
        
        // Create notification for requester
        const notificationRef = doc(collection(db, this.COLLECTIONS.NOTIFICATIONS));
        transaction.set(notificationRef, {
          userId: taskData.requesterId,
          type: 'task_accepted',
          title: 'Expert Found!',
          message: `${expertData.name || 'An expert'} has accepted your task: "${taskData.title}"`,
          taskId: taskId,
          expertId: expertId,
          expertName: expertData.name,
          createdAt: serverTimestamp(),
          read: false
        });
        
        console.log('✅ Manual task accepted successfully');
        
        return {
          success: true,
          message: 'Task accepted successfully!',
          taskData: { ...taskData, ...updateData }
        };
      });
      
    } catch (error) {
      console.error('❌ Error accepting manual task:', error);
      return {
        success: false,
        message: error.message || 'Failed to accept task'
      };
    }
  }

  // Submit task delivery (works for both manual and auto tasks)
  async submitTaskDelivery(taskId, expertId, deliveryData) {
    try {
      console.log('📤 Submitting task delivery:', { taskId, expertId });
      
      return await runTransaction(db, async (transaction) => {
        const taskRef = doc(db, this.COLLECTIONS.TASKS, taskId);
        const taskDoc = await transaction.get(taskRef);
        
        if (!taskDoc.exists()) {
          throw new Error('Task not found');
        }
        
        const taskData = taskDoc.data();
        
        // Verify expert is assigned to this task
        if (taskData.assignedExpertId !== expertId) {
          throw new Error('You are not assigned to this task');
        }
        
        // Update task status
        const updateData = {
          status: 'pending_review',
          deliveredAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          delivery: {
            ...deliveryData,
            submittedAt: serverTimestamp(),
            submittedBy: expertId
          }
        };
        
        transaction.update(taskRef, updateData);
        
        // Create notification for requester
        const notificationRef = doc(collection(db, this.COLLECTIONS.NOTIFICATIONS));
        transaction.set(notificationRef, {
          userId: taskData.requesterId,
          type: 'task_delivered',
          title: 'Task Completed!',
          message: `Your task "${taskData.title}" has been completed and is ready for review.`,
          taskId: taskId,
          expertId: expertId,
          createdAt: serverTimestamp(),
          read: false
        });
        
        console.log('✅ Task delivery submitted successfully');
        
        return {
          success: true,
          message: 'Delivery submitted successfully!'
        };
      });
      
    } catch (error) {
      console.error('❌ Error submitting delivery:', error);
      return {
        success: false,
        message: error.message || 'Failed to submit delivery'
      };
    }
  }

  // Get tasks by user (enhanced for manual match)
  async getTasksByUser(userId, role = 'requester') {
    try {
      console.log(`🔍 Getting ${role} tasks for user:`, userId);
      
      const fieldName = role === 'requester' ? 'requesterId' : 'assignedExpertId';
      
      let q = query(
        collection(db, this.COLLECTIONS.TASKS),
        where(fieldName, '==', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
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
        if (taskData.assignedAt?.toDate) {
          taskData.assignedAt = taskData.assignedAt.toDate().toISOString();
        }
        if (taskData.deliveredAt?.toDate) {
          taskData.deliveredAt = taskData.deliveredAt.toDate().toISOString();
        }
        
        tasks.push(taskData);
      });
      
      console.log(`✅ Found ${tasks.length} ${role} tasks`);
      
      return {
        success: true,
        data: tasks
      };
    } catch (error) {
      console.error(`❌ Error getting ${role} tasks:`, error);
      return {
        success: false,
        message: `Failed to load ${role} tasks: ` + error.message,
        data: []
      };
    }
  }

  // Subscribe to user tasks (real-time updates)
  subscribeToUserTasks(userId, role, callback) {
    try {
      const fieldName = role === 'requester' ? 'requesterId' : 'assignedExpertId';
      
      const q = query(
        collection(db, this.COLLECTIONS.TASKS),
        where(fieldName, '==', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, 
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
            if (taskData.assignedAt?.toDate) {
              taskData.assignedAt = taskData.assignedAt.toDate().toISOString();
            }
            
            tasks.push(taskData);
          });
          
          console.log(`🔄 Real-time update: ${tasks.length} ${role} tasks`);
          
          callback({
            success: true,
            data: tasks
          });
        },
        (error) => {
          console.error(`❌ Real-time ${role} tasks error:`, error);
          this.notifyConnectionStatus(false);
          callback({
            success: false,
            message: `Failed to subscribe to ${role} tasks: ` + error.message,
            data: []
          });
        }
      );
      
      return unsubscribe;
    } catch (error) {
      console.error(`❌ Error setting up ${role} tasks subscription:`, error);
      this.notifyConnectionStatus(false);
      return null;
    }
  }

  // Subscribe to available manual tasks (real-time feed) with connection monitoring
  subscribeToManualTasks(filters, callback) {
    try {
      let q = query(
        collection(db, this.COLLECTIONS.TASKS),
        where('matchingType', '==', 'manual'),
        where('status', '==', 'awaiting_expert'),
        where('isActive', '==', true)
      );

      // Apply filters
      if (filters.subject && filters.subject !== 'all') {
        q = query(q, where('subject', '==', filters.subject));
      }
      
      // Apply sorting
      switch (filters.sortBy) {
        case 'recent':
        default:
          q = query(q, orderBy('createdAt', 'desc'));
          break;
      }

      q = query(q, limit(filters.limit || 20));

      const unsubscribe = onSnapshot(q,
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

  // Get single task by ID
  async getTaskById(taskId) {
    try {
      console.log('🔍 Getting task by ID:', taskId);
      
      const taskRef = doc(db, this.COLLECTIONS.TASKS, taskId);
      const taskDoc = await getDoc(taskRef);
      
      if (!taskDoc.exists()) {
        return {
          success: false,
          message: 'Task not found'
        };
      }
      
      const taskData = { id: taskDoc.id, ...taskDoc.data() };
      
      // Convert timestamps
      if (taskData.createdAt?.toDate) {
        taskData.createdAt = taskData.createdAt.toDate().toISOString();
      }
      if (taskData.deadline?.toDate) {
        taskData.deadline = taskData.deadline.toDate().toISOString();
      }
      if (taskData.assignedAt?.toDate) {
        taskData.assignedAt = taskData.assignedAt.toDate().toISOString();
      }
      
      // Increment view count for manual match tasks
      if (taskData.matchingType === 'manual' && taskData.status === 'awaiting_expert') {
        await updateDoc(taskRef, {
          viewCount: increment(1),
          updatedAt: serverTimestamp()
        });
        taskData.viewCount = (taskData.viewCount || 0) + 1;
      }
      
      console.log('✅ Task retrieved:', taskData.title);
      
      return {
        success: true,
        data: taskData
      };
    } catch (error) {
      console.error('❌ Error getting task:', error);
      return {
        success: false,
        message: 'Failed to get task: ' + error.message
      };
    }
  }

  // Task action handler (approve, dispute, cancel, etc.)
  async submitTaskAction(taskId, action, userRole, actionData = {}) {
    try {
      console.log('⚡ Submitting task action:', { taskId, action, userRole });
      
      return await runTransaction(db, async (transaction) => {
        const taskRef = doc(db, this.COLLECTIONS.TASKS, taskId);
        const taskDoc = await transaction.get(taskRef);
        
        if (!taskDoc.exists()) {
          throw new Error('Task not found');
        }
        
        const taskData = taskDoc.data();
        let updateData = {
          updatedAt: serverTimestamp()
        };
        
        let notificationData = null;
        
        switch (action) {
          case 'approve':
            if (userRole !== 'requester') {
              throw new Error('Only requester can approve tasks');
            }
            updateData.status = 'completed';
            updateData.completedAt = serverTimestamp();
            notificationData = {
              userId: taskData.assignedExpertId,
              type: 'task_approved',
              title: 'Task Approved!',
              message: `Your work on "${taskData.title}" has been approved!`,
              taskId: taskId
            };
            break;
            
          case 'dispute':
            if (userRole !== 'requester') {
              throw new Error('Only requester can dispute tasks');
            }
            updateData.status = 'disputed';
            updateData.disputedAt = serverTimestamp();
            updateData.disputeReason = actionData.reason || 'Quality issues';
            notificationData = {
              userId: taskData.assignedExpertId,
              type: 'task_disputed',
              title: 'Task Disputed',
              message: `Your work on "${taskData.title}" has been disputed. Please check the feedback.`,
              taskId: taskId
            };
            break;
            
          case 'cancel':
            if (userRole !== 'requester') {
              throw new Error('Only requester can cancel tasks');
            }
            updateData.status = 'cancelled';
            updateData.cancelledAt = serverTimestamp();
            updateData.cancelReason = actionData.reason || 'Cancelled by requester';
            
            // If manual match task is cancelled and not yet assigned, make it available again
            if (taskData.matchingType === 'manual' && !taskData.assignedExpertId) {
              updateData.isActive = true;
              updateData.status = 'awaiting_expert';
            } else if (taskData.assignedExpertId) {
              notificationData = {
                userId: taskData.assignedExpertId,
                type: 'task_cancelled',
                title: 'Task Cancelled',
                message: `The task "${taskData.title}" has been cancelled by the requester.`,
                taskId: taskId
              };
            }
            break;
            
          case 'request_revision':
            if (userRole !== 'requester') {
              throw new Error('Only requester can request revisions');
            }
            updateData.status = 'revision_requested';
            updateData.revisionRequestedAt = serverTimestamp();
            updateData.revisionNotes = actionData.notes || 'Please make revisions';
            notificationData = {
              userId: taskData.assignedExpertId,
              type: 'revision_requested',
              title: 'Revision Requested',
              message: `Revision requested for "${taskData.title}". Please check the feedback.`,
              taskId: taskId
            };
            break;
            
          default:
            throw new Error('Invalid action');
        }
        
        transaction.update(taskRef, updateData);
        
        // Create notification if needed
        if (notificationData) {
          const notificationRef = doc(collection(db, this.COLLECTIONS.NOTIFICATIONS));
          transaction.set(notificationRef, {
            ...notificationData,
            createdAt: serverTimestamp(),
            read: false
          });
        }
        
        console.log(`✅ Task action ${action} completed successfully`);
        
        return {
          success: true,
          message: `Task ${action} completed successfully!`
        };
      });
      
    } catch (error) {
      console.error('❌ Error submitting task action:', error);
      return {
        success: false,
        message: error.message || 'Failed to submit action'
      };
    }
  }

  // Update task visibility (for manual match feed)
  async updateTaskVisibility(taskId, isVisible) {
    try {
      const taskRef = doc(db, this.COLLECTIONS.TASKS, taskId);
      await updateDoc(taskRef, {
        isActive: isVisible,
        updatedAt: serverTimestamp()
      });
      
      return {
        success: true,
        message: `Task visibility updated`
      };
    } catch (error) {
      console.error('❌ Error updating task visibility:', error);
      return {
        success: false,
        message: 'Failed to update visibility: ' + error.message
      };
    }
  }

  // Generate search keywords for manual match tasks
  generateSearchKeywords(taskData) {
    const keywords = [];
    
    // Add title words
    if (taskData.title) {
      keywords.push(...taskData.title.toLowerCase().split(' '));
    }
    
    // Add subject
    if (taskData.subject) {
      keywords.push(taskData.subject.toLowerCase());
    }
    
    // Add description words
    if (taskData.description) {
      keywords.push(...taskData.description.toLowerCase().split(' ').slice(0, 10));
    }
    
    // Add tags
    if (taskData.tags) {
      keywords.push(...taskData.tags.map(tag => tag.toLowerCase()));
    }
    
    // Remove duplicates and empty strings
    return [...new Set(keywords.filter(word => word.length > 2))];
  }

  // Search manual tasks by keywords
  async searchManualTasks(searchQuery, filters = {}) {
    try {
      console.log('🔍 Searching manual tasks:', searchQuery);
      
      if (!searchQuery || searchQuery.trim().length < 2) {
        return this.getAvailableManualTasks(filters);
      }
      
      const keywords = searchQuery.toLowerCase().split(' ').filter(word => word.length > 1);
      
      let q = query(
        collection(db, this.COLLECTIONS.TASKS),
        where('matchingType', '==', 'manual'),
        where('status', '==', 'awaiting_expert'),
        where('isActive', '==', true),
        where('searchKeywords', 'array-contains-any', keywords),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      const querySnapshot = await getDocs(q);
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
      
      console.log(`✅ Found ${tasks.length} matching tasks`);
      
      return {
        success: true,
        data: tasks,
        count: tasks.length
      };
    } catch (error) {
      console.error('❌ Error searching tasks:', error);
      return {
        success: false,
        message: 'Search failed: ' + error.message,
        data: []
      };
    }
  }

  // Get user notifications
  async getUserNotifications(userId, limit = 20) {
    try {
      const q = query(
        collection(db, this.COLLECTIONS.NOTIFICATIONS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );
      
      const querySnapshot = await getDocs(q);
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

  // Mark notification as read
  async markNotificationRead(notificationId) {
    try {
      const notificationRef = doc(db, this.COLLECTIONS.NOTIFICATIONS, notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: serverTimestamp()
      });
      
      return {
        success: true,
        message: 'Notification marked as read'
      };
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      return {
        success: false,
        message: 'Failed to mark notification as read: ' + error.message
      };
    }
  }

  // Get manual match tasks (method for existing HomeScreen)
  async getManualMatchTasks(filters = {}) {
    try {
      console.log('🔍 Getting manual match tasks with filters:', filters);
      
      let q = query(
        collection(db, this.COLLECTIONS.TASKS),
        where('matchingType', '==', 'manual'),
        where('status', '==', 'awaiting_expert'),
        where('isActive', '==', true)
      );

      // Apply filters
      if (filters.subject && filters.subject !== 'all') {
        q = query(q, where('subject', '==', filters.subject));
      }
      
      if (filters.urgency && filters.urgency !== 'all') {
        q = query(q, where('urgency', '==', filters.urgency));
      }

      // Apply sorting
      q = query(q, orderBy('createdAt', 'desc'), limit(20));

      const querySnapshot = await getDocs(q);
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

      console.log(`✅ Found ${tasks.length} manual match tasks`);
      
      return {
        success: true,
        data: tasks,
        count: tasks.length
      };
    } catch (error) {
      console.error('❌ Error getting manual match tasks:', error);
      return {
        success: false,
        message: 'Failed to load tasks: ' + error.message,
        data: []
      };
    }
  }

  // Subscribe to manual match tasks (for existing HomeScreen)
  subscribeToManualMatchTasks(callback) {
    try {
      console.log('🔄 Setting up manual match tasks subscription...');
      
      const q = query(
        collection(db, this.COLLECTIONS.TASKS),
        where('matchingType', '==', 'manual'),
        where('status', '==', 'awaiting_expert'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      const unsubscribe = onSnapshot(q,
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
      
      return await runTransaction(db, async (transaction) => {
        const taskRef = doc(db, this.COLLECTIONS.TASKS, taskId);
        const taskDoc = await transaction.get(taskRef);
        
        if (!taskDoc.exists()) {
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
          assignedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isActive: false, // Remove from public feed
        };
        
        transaction.update(taskRef, updateData);
        
        // Create notification for requester
        const notificationRef = doc(collection(db, this.COLLECTIONS.NOTIFICATIONS));
        transaction.set(notificationRef, {
          userId: taskData.requesterId,
          type: 'task_accepted',
          title: 'Expert Found!',
          message: `${expertName} has accepted your task: "${taskData.title}"`,
          taskId: taskId,
          expertId: expertId,
          expertName: expertName,
          createdAt: serverTimestamp(),
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

  // Increment task views (for existing HomeScreen)
  async incrementTaskViews(taskId) {
    try {
      const taskRef = doc(db, this.COLLECTIONS.TASKS, taskId);
      await updateDoc(taskRef, {
        viewCount: increment(1),
        lastViewedAt: serverTimestamp()
      });
      
      console.log(`👁️ Incremented view count for task: ${taskId}`);
      
      return {
        success: true,
        message: 'View count updated'
      };
    } catch (error) {
      console.error('❌ Error incrementing view count:', error);
      return {
        success: false,
        message: 'Failed to update view count'
      };
    }
  }

  // Get task statistics
  async getTaskStats(userId, role = 'requester') {
    try {
      const fieldName = role === 'requester' ? 'requesterId' : 'assignedExpertId';
      
      const q = query(
        collection(db, this.COLLECTIONS.TASKS),
        where(fieldName, '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
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
}

// Export singleton instance
const firestoreService = new FirestoreService();
export default firestoreService;
