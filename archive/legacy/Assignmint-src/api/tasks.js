// Mock API service for tasks with realistic delays and error handling
import { mockRequesterTasks, mockExpertTasks } from './mockData';

// Simulate network delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random network failures (5% chance)
const shouldSimulateError = () => Math.random() < 0.05;

export const TasksAPI = {
  // Get tasks by role (requester or expert)
  async getTasksByRole(role, userId = 'user123') {
    console.log(`📡 API: Loading ${role} tasks...`);
    
    // Simulate network delay
    await delay(Math.random() * 1000 + 500); // 500-1500ms delay
    
    // Simulate occasional network errors
    if (shouldSimulateError()) {
      throw {
        success: false,
        error: 'Network Error',
        message: 'Failed to fetch tasks. Please check your connection.'
      };
    }
    
    try {
      const tasks = role === 'requester' ? mockRequesterTasks : mockExpertTasks;
      
      console.log(`✅ API: Loaded ${tasks.length} ${role} tasks`);
      
      return {
        success: true,
        data: tasks,
        total: tasks.length,
        message: 'Tasks fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ API Error:', error);
      throw {
        success: false,
        error: 'Data Error',
        message: 'Failed to process task data'
      };
    }
  },

  // Get single task by ID
  async getTaskById(taskId, role) {
    console.log(`📡 API: Loading task ${taskId}...`);
    
    await delay(Math.random() * 500 + 200); // 200-700ms delay
    
    if (shouldSimulateError()) {
      throw {
        success: false,
        error: 'Network Error',
        message: 'Failed to fetch task details'
      };
    }
    
    try {
      const tasks = role === 'requester' ? mockRequesterTasks : mockExpertTasks;
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      console.log(`✅ API: Loaded task "${task.title}"`);
      
      return {
        success: true,
        data: task,
        message: 'Task details fetched successfully'
      };
    } catch (error) {
      console.error('❌ API Error:', error);
      throw {
        success: false,
        error: 'Task Not Found',
        message: 'The requested task could not be found'
      };
    }
  },

  // Submit task action (approve, dispute, cancel, etc.)
  async submitTaskAction(taskId, action, role, data = {}) {
    console.log(`📡 API: Submitting ${action} for task ${taskId}...`);
    
    await delay(Math.random() * 800 + 400); // 400-1200ms delay
    
    if (shouldSimulateError()) {
      throw {
        success: false,
        error: 'Action Failed',
        message: 'Unable to process your request. Please try again.'
      };
    }
    
    try {
      // Mock response based on action
      const responses = {
        review: {
          message: 'Task approved successfully! Payment has been released to the expert.',
          newStatus: 'completed'
        },
        dispute: {
          message: 'Dispute filed successfully. Our team will review and contact you within 24 hours.',
          newStatus: 'disputed'
        },
        cancel: {
          message: 'Task cancelled successfully. Refund will be processed within 24 hours.',
          newStatus: 'cancelled'
        },
        upload: {
          message: 'Files uploaded successfully! The requester will be notified to review your work.',
          newStatus: 'pending_review'
        },
        edit: {
          message: 'Task updated successfully. Changes are now live.',
          newStatus: 'awaiting_expert'
        }
      };
      
      const response = responses[action] || {
        message: 'Action completed successfully',
        newStatus: 'updated'
      };
      
      console.log(`✅ API: ${action} completed for task ${taskId}`);
      
      return {
        success: true,
        data: {
          taskId,
          action,
          newStatus: response.newStatus,
          timestamp: new Date().toISOString(),
          ...data
        },
        message: response.message
      };
    } catch (error) {
      console.error('❌ API Error:', error);
      throw {
        success: false,
        error: 'Action Failed',
        message: 'Unable to complete the requested action'
      };
    }
  },

  // Get task statistics
  async getTaskStats(role, userId = 'user123') {
    console.log(`📡 API: Loading ${role} statistics...`);
    
    await delay(Math.random() * 300 + 100); // 100-400ms delay
    
    try {
      const tasks = role === 'requester' ? mockRequesterTasks : mockExpertTasks;
      
      const stats = {
        total: tasks.length,
        active: tasks.filter(t => 
          ['in_progress', 'working', 'pending_review', 'awaiting_expert'].includes(t.status)
        ).length,
        completed: tasks.filter(t => 
          ['completed', 'payment_received'].includes(t.status)
        ).length,
        overdue: tasks.filter(t => {
          const due = new Date(t.dueDate);
          const now = new Date();
          return due < now && !['completed', 'payment_received', 'cancelled'].includes(t.status);
        }).length,
        disputed: tasks.filter(t => t.status === 'disputed').length,
        totalEarnings: role === 'expert' ? 
          tasks.filter(t => t.status === 'payment_received')
               .reduce((sum, t) => sum + parseFloat(t.price.replace('$', '')), 0) : 0,
        averageRating: role === 'expert' ? 
          tasks.filter(t => t.rating).reduce((sum, t) => sum + t.rating, 0) / 
          tasks.filter(t => t.rating).length || 0 : 0
      };
      
      console.log(`✅ API: Loaded statistics for ${role}`);
      
      return {
        success: true,
        data: stats,
        message: 'Statistics fetched successfully'
      };
    } catch (error) {
      console.error('❌ API Error:', error);
      throw {
        success: false,
        error: 'Stats Error',
        message: 'Failed to load statistics'
      };
    }
  },

  // Search and filter tasks
  async searchTasks(role, filters = {}) {
    console.log(`📡 API: Searching ${role} tasks with filters:`, filters);
    
    await delay(Math.random() * 400 + 200); // 200-600ms delay
    
    try {
      let tasks = role === 'requester' ? [...mockRequesterTasks] : [...mockExpertTasks];
      
      // Apply search filter
      if (filters.search && filters.search.trim()) {
        const query = filters.search.toLowerCase();
        tasks = tasks.filter(task => 
          task.title.toLowerCase().includes(query) ||
          task.subject.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          (task.expertName && task.expertName.toLowerCase().includes(query)) ||
          (task.requesterName && task.requesterName.toLowerCase().includes(query))
        );
      }
      
      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        tasks = tasks.filter(task => task.status === filters.status);
      }
      
      // Apply urgency filter
      if (filters.urgency && filters.urgency !== 'all') {
        tasks = tasks.filter(task => task.urgency === filters.urgency);
      }
      
      // Apply sorting
      switch (filters.sortBy) {
        case 'due_date_asc':
          tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
          break;
        case 'due_date_desc':
          tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
          break;
        case 'price_asc':
          tasks.sort((a, b) => parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')));
          break;
        case 'price_desc':
          tasks.sort((a, b) => parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', '')));
          break;
        case 'recent':
          tasks.sort((a, b) => 
            new Date(b.postedDate || b.acceptedDate) - new Date(a.postedDate || a.acceptedDate)
          );
          break;
      }
      
      console.log(`✅ API: Found ${tasks.length} tasks matching filters`);
      
      return {
        success: true,
        data: tasks,
        total: tasks.length,
        filters: filters,
        message: 'Search completed successfully'
      };
    } catch (error) {
      console.error('❌ API Error:', error);
      throw {
        success: false,
        error: 'Search Error',
        message: 'Failed to search tasks'
      };
    }
  },

  // Upload file (mock)
  async uploadFile(file, taskId) {
    console.log(`📡 API: Uploading file ${file.name} for task ${taskId}...`);
    
    await delay(Math.random() * 2000 + 1000); // 1-3 second delay for file upload
    
    if (shouldSimulateError()) {
      throw {
        success: false,
        error: 'Upload Failed',
        message: 'File upload failed. Please check your connection and try again.'
      };
    }
    
    try {
      const uploadedFile = {
        id: `file_${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        taskId: taskId
      };
      
      console.log(`✅ API: File uploaded successfully: ${file.name}`);
      
      return {
        success: true,
        data: uploadedFile,
        message: 'File uploaded successfully'
      };
    } catch (error) {
      console.error('❌ API Error:', error);
      throw {
        success: false,
        error: 'Upload Error',
        message: 'Failed to upload file'
      };
    }
  }
};

// Export filter helpers
export const TaskFilters = {
  byStatus: (tasks, status) => {
    if (!status || status === 'all') return tasks;
    return tasks.filter(task => task.status === status);
  },

  byDueDate: (tasks, order = 'asc') => {
    return [...tasks].sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  },

  byPrice: (tasks, order = 'desc') => {
    return [...tasks].sort((a, b) => {
      const priceA = parseFloat(a.price.replace('$', ''));
      const priceB = parseFloat(b.price.replace('$', ''));
      return order === 'desc' ? priceB - priceA : priceA - priceB;
    });
  },

  byUrgency: (tasks, urgency) => {
    if (!urgency || urgency === 'all') return tasks;
    return tasks.filter(task => task.urgency === urgency);
  },

  search: (tasks, query) => {
    if (!query.trim()) return tasks;
    const lowerQuery = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowerQuery) ||
      task.subject.toLowerCase().includes(lowerQuery) ||
      task.description.toLowerCase().includes(lowerQuery) ||
      (task.expertName && task.expertName.toLowerCase().includes(lowerQuery)) ||
      (task.requesterName && task.requesterName.toLowerCase().includes(lowerQuery))
    );
  }
};