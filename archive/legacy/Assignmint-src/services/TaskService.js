// src/services/TaskService.js
// Centralized service for all task-related API operations

const TaskService = {
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  async getTasksByRole(role, userId = 'user123') {
    console.log(`📡 TaskService: Loading ${role} tasks...`);
    
    await this.delay(500 + Math.random() * 500);
    
    // Simulate occasional network errors (2% chance)
    if (Math.random() < 0.02) {
      throw {
        success: false,
        error: 'Network Error',
        message: 'Failed to fetch tasks. Please check your connection.'
      };
    }
    
    try {
      const requesterTasks = [
        {
          id: 'req_1',
          title: 'Solve 10 Calculus Problems',
          dueDate: '2025-05-25',
          status: 'in_progress',
          expertName: 'Sarah Chen',
          expertId: 'exp_001',
          subject: 'Math',
          price: '$20',
          urgency: 'medium',
          progress: 65,
          postedDate: '2025-05-20',
          description: 'Need help with derivatives and integrals for my calculus homework.',
          estimatedHours: 3,
          expertRating: 4.8,
          expertCompletedTasks: 127
        },
        {
          id: 'req_2',
          title: 'Fix bugs in Python script',
          dueDate: '2025-05-22',
          status: 'pending_review',
          expertName: 'Alex Kumar',
          expertId: 'exp_002',
          subject: 'Coding',
          price: '$30',
          urgency: 'high',
          progress: 100,
          postedDate: '2025-05-19',
          description: 'Python script has some logic errors that need debugging.',
          estimatedHours: 2,
          expertRating: 4.9,
          expertCompletedTasks: 89
        },
        {
          id: 'req_3',
          title: 'Write 500-word essay on Civil War',
          dueDate: '2025-05-24',
          status: 'completed',
          expertName: 'Emily Rodriguez',
          expertId: 'exp_003',
          subject: 'Writing',
          price: '$15',
          urgency: 'low',
          progress: 100,
          postedDate: '2025-05-18',
          description: 'Need a well-researched essay about the American Civil War causes.',
          estimatedHours: 4,
          expertRating: 4.7,
          expertCompletedTasks: 156,
          rating: 5,
          feedback: 'Excellent work! Very thorough research and well-structured argument.'
        },
        {
          id: 'req_4',
          title: 'Design a logo for student group',
          dueDate: '2025-05-26',
          status: 'awaiting_expert',
          expertName: null,
          expertId: null,
          subject: 'Design',
          price: '$18',
          urgency: 'medium',
          progress: 0,
          postedDate: '2025-05-21',
          description: 'Looking for a modern logo design for our computer science club.',
          estimatedHours: 5,
          applicants: 12,
          views: 45
        }
      ];

      const expertTasks = [
        {
          id: 'exp_1',
          title: 'Translate English to Spanish document',
          dueDate: '2025-05-27',
          status: 'working',
          requesterName: 'John Smith',
          requesterId: 'req_001',
          subject: 'Language',
          price: '$22',
          progress: 45,
          urgency: 'medium',
          acceptedDate: '2025-05-20',
          description: 'Technical document translation from English to Spanish.',
          estimatedHours: 4,
          requesterRating: 4.6
        },
        {
          id: 'exp_2',
          title: 'Build basic website in HTML/CSS',
          dueDate: '2025-05-28',
          status: 'delivered',
          requesterName: 'Maria Garcia',
          requesterId: 'req_002',
          subject: 'Coding',
          price: '$40',
          progress: 100,
          urgency: 'low',
          acceptedDate: '2025-05-19',
          description: 'Create a responsive portfolio website using HTML, CSS, and JavaScript.',
          estimatedHours: 8,
          requesterRating: 4.8,
          deliveredDate: '2025-05-27'
        },
        {
          id: 'exp_3',
          title: 'Chemistry Lab Report Analysis',
          dueDate: '2025-05-24',
          status: 'revision_requested',
          requesterName: 'David Park',
          requesterId: 'req_003',
          subject: 'Chemistry',
          price: '$25',
          progress: 85,
          urgency: 'high',
          acceptedDate: '2025-05-17',
          description: 'Need analysis of organic chemistry lab results and conclusions.',
          estimatedHours: 6,
          requesterRating: 4.2,
          revisionNotes: 'Analysis was incomplete and missing some calculations.'
        }
      ];

      const tasks = role === 'requester' ? requesterTasks : expertTasks;
      
      console.log(`✅ TaskService: Loaded ${tasks.length} ${role} tasks`);
      
      return {
        success: true,
        data: tasks,
        total: tasks.length,
        message: 'Tasks fetched successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ TaskService Error:', error);
      throw {
        success: false,
        error: 'Data Error',
        message: 'Failed to process task data'
      };
    }
  },

  async getTaskById(taskId, role) {
    console.log(`📡 TaskService: Loading task ${taskId}...`);
    
    await this.delay(Math.random() * 500 + 200);
    
    if (Math.random() < 0.02) {
      throw {
        success: false,
        error: 'Network Error',
        message: 'Failed to fetch task details'
      };
    }
    
    try {
      const response = await this.getTasksByRole(role);
      const task = response.data.find(t => t.id === taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      console.log(`✅ TaskService: Loaded task "${task.title}"`);
      
      return {
        success: true,
        data: task,
        message: 'Task details fetched successfully'
      };
    } catch (error) {
      console.error('❌ TaskService Error:', error);
      throw {
        success: false,
        error: 'Task Not Found',
        message: 'The requested task could not be found'
      };
    }
  },

  async submitTaskAction(taskId, action, role, data = {}) {
    console.log(`📡 TaskService: Submitting ${action} for task ${taskId}...`);
    
    await this.delay(Math.random() * 800 + 400);
    
    if (Math.random() < 0.02) {
      throw {
        success: false,
        error: 'Action Failed',
        message: 'Unable to process your request. Please try again.'
      };
    }
    
    try {
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
      
      console.log(`✅ TaskService: ${action} completed for task ${taskId}`);
      
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
      console.error('❌ TaskService Error:', error);
      throw {
        success: false,
        error: 'Action Failed',
        message: 'Unable to complete the requested action'
      };
    }
  },

  async getTaskStats(role, userId = 'user123') {
    console.log(`📡 TaskService: Loading ${role} statistics...`);
    
    await this.delay(Math.random() * 300 + 100);
    
    try {
      const response = await this.getTasksByRole(role, userId);
      const tasks = response.data;
      
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
      
      console.log(`✅ TaskService: Loaded statistics for ${role}`);
      
      return {
        success: true,
        data: stats,
        message: 'Statistics fetched successfully'
      };
    } catch (error) {
      console.error('❌ TaskService Error:', error);
      throw {
        success: false,
        error: 'Stats Error',
        message: 'Failed to load statistics'
      };
    }
  }
};

export default TaskService;