// src/services/LegacyTasksAPI.js
// Bridge service to maintain compatibility with existing TasksAPI

const LegacyTasksAPI = {
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  async getTasksByRole(role) {
    await this.delay(500 + Math.random() * 500);
    
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
        postedDate: '2025-05-20',
        description: 'Need help with derivatives and integrals for calculus homework.',
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
        subject: 'Coding',
        price: '$30',
        urgency: 'high',
        progress: 100,
        postedDate: '2025-05-19',
        description: 'Python script debugging with pandas and error handling.',
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
        subject: 'Writing',
        price: '$15',
        urgency: 'low',
        progress: 100,
        postedDate: '2025-05-18',
        description: 'Well-researched essay about American Civil War causes.',
        estimatedHours: 4,
        expertRating: 4.7,
        expertCompletedTasks: 156,
        rating: 5,
        feedback: 'Excellent work! Very thorough research.'
      },
      {
        id: 'req_4',
        title: 'Design a logo for student group',
        dueDate: '2025-05-26',
        status: 'awaiting_expert',
        expertName: null,
        subject: 'Design',
        price: '$18',
        urgency: 'medium',
        progress: 0,
        postedDate: '2025-05-21',
        description: 'Modern logo design for computer science club.',
        estimatedHours: 5,
        applicants: 12,
        views: 45
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
        urgency: 'medium',
        acceptedDate: '2025-05-20',
        description: 'Technical document translation with software terminology.',
        estimatedHours: 4,
        requesterRating: 4.6
      },
      {
        id: 'exp_2',
        title: 'Build basic website in HTML/CSS',
        dueDate: '2025-05-28',
        status: 'delivered',
        requesterName: 'Maria Garcia',
        subject: 'Coding',
        price: '$40',
        progress: 100,
        urgency: 'low',
        acceptedDate: '2025-05-19',
        description: 'Responsive portfolio website with contact form.',
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
        subject: 'Chemistry',
        price: '$25',
        progress: 85,
        urgency: 'high',
        acceptedDate: '2025-05-17',
        description: 'Organic chemistry lab results analysis and conclusions.',
        estimatedHours: 6,
        requesterRating: 4.2,
        revisionNotes: 'Analysis incomplete, missing calculations.'
      },
    ];

    return {
      success: true,
      data: role === 'requester' ? requesterTasks : expertTasks,
    };
  },

  async getTaskStats(role) {
    await this.delay(200);
    
    const response = await this.getTasksByRole(role);
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
    };
    
    return {
      success: true,
      data: stats
    };
  },

  async submitTaskAction(taskId, action, role) {
    await this.delay(800);
    
    const messages = {
      review: 'Task approved successfully! Payment has been released to the expert.',
      dispute: 'Dispute filed successfully. Our team will review within 24 hours.',
      cancel: 'Task cancelled successfully. Refund will be processed within 24 hours.',
      upload: 'Files uploaded successfully! The requester will be notified to review.',
      edit: 'Task updated successfully. Changes are now live.',
    };

    return {
      success: true,
      message: messages[action] || 'Action completed successfully',
      data: { taskId, action, newStatus: 'updated' }
    };
  }
};

export default LegacyTasksAPI;