// src/utils/taskHelpers.js
// Utility functions for task-related operations

// Get subject color based on subject name
export const getSubjectColor = (subject) => {
  if (!subject) return '#9e9e9e';
  
  const colors = {
    'math': '#3f51b5',
    'coding': '#00796b',
    'writing': '#d84315',
    'design': '#6a1b9a',
    'language': '#00838f',
    'chemistry': '#f57f17',
    'physics': '#1976d2',
    'business': '#388e3c',
    'psychology': '#7b1fa2',
    'statistics': '#c62828',
    'science': '#1976d2',
    'biology': '#689f38',
    'history': '#5d4037',
    'engineering': '#455a64',
    'art': '#e91e63'
  };
  
  return colors[subject.toLowerCase()] || '#9e9e9e';
};

// Get status display information
export const getStatusInfo = (status) => {
  const statusMap = {
    // Requester statuses
    'in_progress': { text: '🔄 In Progress', color: '#2196f3', bgColor: '#e3f2fd' },
    'pending_review': { text: '⏳ Pending Review', color: '#ff9800', bgColor: '#fff3e0' },
    'completed': { text: '✅ Completed', color: '#4caf50', bgColor: '#e8f5e8' },
    'awaiting_expert': { text: '👀 Finding Expert', color: '#9c27b0', bgColor: '#f3e5f5' },
    'disputed': { text: '⚠️ Disputed', color: '#f44336', bgColor: '#ffebee' },
    'cancelled': { text: '❌ Cancelled', color: '#757575', bgColor: '#f5f5f5' },
    
    // Expert statuses
    'working': { text: '🔨 Working', color: '#2196f3', bgColor: '#e3f2fd' },
    'delivered': { text: '📤 Delivered', color: '#ff9800', bgColor: '#fff3e0' },
    'payment_received': { text: '💰 Payment Received', color: '#4caf50', bgColor: '#e8f5e8' },
    'revision_requested': { text: '🔄 Revision Requested', color: '#ff5722', bgColor: '#fbe9e7' },
  };
  
  return statusMap[status] || { text: status, color: '#757575', bgColor: '#f5f5f5' };
};

// Get urgency styling
export const getUrgencyStyle = (urgency) => {
  const styles = {
    'high': { backgroundColor: '#ffebee', color: '#f44336', icon: '🔥' },
    'medium': { backgroundColor: '#fff3e0', color: '#ff9800', icon: '⚡' },
    'low': { backgroundColor: '#e8f5e8', color: '#4caf50', icon: '🌱' }
  };
  
  return styles[urgency] || { backgroundColor: '#f5f5f5', color: '#757575', icon: '📋' };
};

// Calculate days left until due date
export const calculateDaysLeft = (dueDate) => {
  if (!dueDate) return { text: 'No due date', isNormal: true };
  
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true };
  if (diffDays === 0) return { text: 'Due today', isUrgent: true };
  if (diffDays === 1) return { text: '1 day left', isUrgent: true };
  return { text: `${diffDays} days left`, isNormal: true };
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

// Format relative date (e.g., "2 days ago", "in 3 days")
export const formatRelativeDate = (dateString) => {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
};

// Get file icon based on file type
export const getFileIcon = (type) => {
  const icons = {
    'pdf': '📄',
    'image': '🖼️',
    'jpg': '🖼️',
    'png': '🖼️',
    'jpeg': '🖼️',
    'document': '📝',
    'docx': '📝',
    'doc': '📝',
    'excel': '📊',
    'xlsx': '📊',
    'xls': '📊',
    'python': '💻',
    'js': '💻',
    'javascript': '💻',
    'html': '💻',
    'css': '💻',
    'csv': '📈',
    'text': '📃',
    'txt': '📃',
    'archive': '📦',
    'zip': '📦',
    'rar': '📦',
    'design': '🎨',
    'figma': '🎨',
    'sketch': '🎨',
    'markdown': '📋',
    'md': '📋'
  };
  
  return icons[type?.toLowerCase()] || '📎';
};

// Calculate task completion percentage
export const calculateProgress = (task) => {
  if (!task) return 0;
  
  const statusProgress = {
    'awaiting_expert': 0,
    'in_progress': 25,
    'working': 50,
    'delivered': 75,
    'pending_review': 90,
    'completed': 100,
    'payment_received': 100,
    'cancelled': 0,
    'disputed': 50,
    'revision_requested': 60
  };
  
  return statusProgress[task.status] || 0;
};

// Get task priority based on urgency and due date
export const getTaskPriority = (task) => {
  if (!task) return 'low';
  
  const daysLeft = calculateDaysLeft(task.dueDate);
  
  if (task.urgency === 'high' || daysLeft.isOverdue) return 'critical';
  if (task.urgency === 'medium' || daysLeft.isUrgent) return 'high';
  if (task.urgency === 'low') return 'medium';
  
  return 'low';
};

// Sort tasks by priority
export const sortTasksByPriority = (tasks) => {
  const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
  
  return [...tasks].sort((a, b) => {
    const aPriority = getTaskPriority(a);
    const bPriority = getTaskPriority(b);
    
    return priorityOrder[aPriority] - priorityOrder[bPriority];
  });
};

// Sort tasks by due date
export const sortTasksByDueDate = (tasks, ascending = true) => {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate || '9999-12-31');
    const dateB = new Date(b.dueDate || '9999-12-31');
    
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Sort tasks by price
export const sortTasksByPrice = (tasks, ascending = false) => {
  return [...tasks].sort((a, b) => {
    const priceA = parseFloat(a.price?.replace('$', '') || '0');
    const priceB = parseFloat(b.price?.replace('$', '') || '0');
    
    return ascending ? priceA - priceB : priceB - priceA;
  });
};

// Filter tasks by multiple criteria
export const filterTasks = (tasks, filters = {}) => {
  if (!tasks || tasks.length === 0) return [];
  
  let filtered = [...tasks];
  
  // Filter by status
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(task => task.status === filters.status);
  }
  
  // Filter by subject
  if (filters.subject && filters.subject !== 'all') {
    filtered = filtered.filter(task => 
      task.subject?.toLowerCase() === filters.subject.toLowerCase()
    );
  }
  
  // Filter by urgency
  if (filters.urgency && filters.urgency !== 'all') {
    filtered = filtered.filter(task => task.urgency === filters.urgency);
  }
  
  // Filter by price range
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(task => {
      const price = parseFloat(task.price?.replace('$', '') || '0');
      return price >= filters.minPrice;
    });
  }
  
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(task => {
      const price = parseFloat(task.price?.replace('$', '') || '0');
      return price <= filters.maxPrice;
    });
  }
  
  // Filter by search query
  if (filters.search && filters.search.trim()) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(task =>
      task.title?.toLowerCase().includes(query) ||
      task.subject?.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      task.expertName?.toLowerCase().includes(query) ||
      task.requesterName?.toLowerCase().includes(query)
    );
  }
  
  return filtered;
};

// Get task statistics
export const getTaskStatistics = (tasks) => {
  if (!tasks || tasks.length === 0) {
    return {
      total: 0,
      byStatus: {},
      bySubject: {},
      byUrgency: {},
      averagePrice: 0,
      totalValue: 0
    };
  }
  
  const stats = {
    total: tasks.length,
    byStatus: {},
    bySubject: {},
    byUrgency: {},
    averagePrice: 0,
    totalValue: 0
  };
  
  let totalValue = 0;
  
  tasks.forEach(task => {
    // Count by status
    stats.byStatus[task.status] = (stats.byStatus[task.status] || 0) + 1;
    
    // Count by subject
    if (task.subject) {
      stats.bySubject[task.subject] = (stats.bySubject[task.subject] || 0) + 1;
    }
    
    // Count by urgency
    if (task.urgency) {
      stats.byUrgency[task.urgency] = (stats.byUrgency[task.urgency] || 0) + 1;
    }
    
    // Calculate total value
    const price = parseFloat(task.price?.replace('$', '') || '0');
    totalValue += price;
  });
  
  stats.totalValue = totalValue;
  stats.averagePrice = tasks.length > 0 ? totalValue / tasks.length : 0;
  
  return stats;
};

// Validate task data
export const validateTaskData = (task) => {
  const errors = [];
  
  if (!task.title || task.title.trim().length < 5) {
    errors.push('Title must be at least 5 characters long');
  }
  
  if (!task.subject) {
    errors.push('Subject is required');
  }
  
  if (!task.description || task.description.trim().length < 20) {
    errors.push('Description must be at least 20 characters long');
  }
  
  if (!task.price || parseFloat(task.price.replace('$', '')) <= 0) {
    errors.push('Price must be greater than $0');
  }
  
  if (!task.dueDate) {
    errors.push('Due date is required');
  } else {
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    if (dueDate <= now) {
      errors.push('Due date must be in the future');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// NEW: Get tag color for task tags (used in TaskContentSection)
export const getTagColor = (tag) => {
  if (!tag) return '#9e9e9e';
  
  // Generate a consistent color based on tag name
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#3f51b5', '#00796b', '#d84315', '#6a1b9a', '#00838f',
    '#f57f17', '#1976d2', '#388e3c', '#7b1fa2', '#c62828'
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

// NEW: Format file size for display (used in UploadDeliveryScreen and FilePicker)
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// NEW: Get relative time string (used in ManualMatchTaskCard)
export const getRelativeTime = (timestamp) => {
  if (!timestamp) return 'Unknown time';
  
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now - time;
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return time.toLocaleDateString();
};

// NEW: Check if task is overdue (used in TaskStatusSection)
export const isTaskOverdue = (task) => {
  if (!task.dueDate) return false;
  
  const now = new Date();
  const due = new Date(task.dueDate);
  
  return due < now && !['completed', 'payment_received', 'cancelled'].includes(task.status);
};

// NEW: Format currency (used in TaskInfoSection)
export const formatCurrency = (amount, currency = 'USD') => {
  if (typeof amount === 'string') {
    // If already formatted (e.g., "$25"), return as is
    if (amount.startsWith('$')) return amount;
    amount = parseFloat(amount);
  }
  
  if (isNaN(amount)) return '$0';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Export all functions as default for backward compatibility
export default {
  getSubjectColor,
  getStatusInfo,
  getUrgencyStyle,
  calculateDaysLeft,
  formatDate,
  formatRelativeDate,
  getFileIcon,
  calculateProgress,
  getTaskPriority,
  sortTasksByPriority,
  sortTasksByDueDate,
  sortTasksByPrice,
  filterTasks,
  getTaskStatistics,
  validateTaskData,
  // NEW FUNCTIONS ADDED:
  getTagColor,
  formatFileSize,
  getRelativeTime,
  isTaskOverdue,
  formatCurrency
};