import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Assign color based on subject
const getTagColor = (subject) => {
  if (!subject) return '#9e9e9e';
  switch (subject.toLowerCase()) {
    case 'math': return '#3f51b5';
    case 'coding': return '#00796b';
    case 'writing': return '#d84315';
    case 'design': return '#6a1b9a';
    case 'language': return '#00838f';
    case 'chemistry': return '#f57f17';
    case 'physics': return '#1976d2';
    case 'business': return '#388e3c';
    case 'psychology': return '#7b1fa2';
    case 'statistics': return '#c62828';
    case 'science': return '#1976d2';
    default: return '#9e9e9e';
  }
};

// Calculate days left until due date
const calculateDaysLeft = (dueDate) => {
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

// Get status display info
const getStatusInfo = (status) => {
  const statusMap = {
    // Requester statuses
    in_progress: { text: '🔄 In Progress', color: '#2196f3', bgColor: '#e3f2fd' },
    pending_review: { text: '⏳ Pending Review', color: '#ff9800', bgColor: '#fff3e0' },
    completed: { text: '✅ Completed', color: '#4caf50', bgColor: '#e8f5e8' },
    awaiting_expert: { text: '👀 Finding Expert', color: '#9c27b0', bgColor: '#f3e5f5' },
    disputed: { text: '⚠️ Disputed', color: '#f44336', bgColor: '#ffebee' },
    cancelled: { text: '❌ Cancelled', color: '#757575', bgColor: '#f5f5f5' },
    
    // Expert statuses
    working: { text: '🔨 Working', color: '#2196f3', bgColor: '#e3f2fd' },
    delivered: { text: '📤 Delivered', color: '#ff9800', bgColor: '#fff3e0' },
    payment_received: { text: '💰 Payment Received', color: '#4caf50', bgColor: '#e8f5e8' },
    revision_requested: { text: '🔄 Revision Requested', color: '#ff5722', bgColor: '#fbe9e7' },
  };
  
  return statusMap[status] || { text: status, color: '#757575', bgColor: '#f5f5f5' };
};

const TaskCard = ({ 
  task, 
  isRequester = true, 
  onPress, 
  onActionPress 
}) => {
  // Safety checks
  if (!task) return null;
  
  const statusInfo = getStatusInfo(task.status);
  const daysLeftInfo = calculateDaysLeft(task.dueDate);
  
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress && onPress(task)}
      activeOpacity={0.7}
    >
      {/* Header with title and price */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            📌 {task.title || 'Untitled Task'}
          </Text>
          <View style={[styles.tag, { backgroundColor: getTagColor(task.subject) }]}>
            <Text style={styles.tagText}>{task.subject || 'General'}</Text>
          </View>
        </View>
        <Text style={styles.price}>{task.price || '$0'}</Text>
      </View>

      {/* Due date info */}
      <View style={styles.dueDateRow}>
        <Text style={styles.dueDateLabel}>📅 Due: </Text>
        <Text style={styles.dueDateText}>{task.dueDate || 'No date set'}</Text>
        <View style={[
          styles.daysLeftBadge,
          daysLeftInfo.isOverdue && styles.overdueBadge,
          daysLeftInfo.isUrgent && styles.urgentBadge,
          daysLeftInfo.isNormal && styles.normalBadge
        ]}>
          <Text style={[
            styles.daysLeftText,
            daysLeftInfo.isOverdue && styles.overdueText,
            daysLeftInfo.isUrgent && styles.urgentText,
            daysLeftInfo.isNormal && styles.normalText
          ]}>
            {daysLeftInfo.text}
          </Text>
        </View>
      </View>

      {/* Role-specific information */}
      <View style={styles.roleInfoRow}>
        {isRequester ? (
          <Text style={styles.roleInfo}>
            {task.expertName ? `👤 Expert: ${task.expertName}` : '👀 No expert assigned yet'}
          </Text>
        ) : (
          <Text style={styles.roleInfo}>
            👤 Requester: {task.requesterName || 'Unknown'}
          </Text>
        )}
      </View>

      {/* Progress bar for expert tasks */}
      {!isRequester && task.progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, task.progress))}%` }]} />
          </View>
          <Text style={styles.progressText}>{task.progress || 0}%</Text>
        </View>
      )}

      {/* Status */}
      <View style={styles.statusRow}>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
        </View>
      </View>

      {/* Quick action button */}
      {onActionPress && (
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.quickActionBtn}
            onPress={() => onActionPress(task)}
          >
            <Text style={styles.quickActionText}>⚡ Quick Actions</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Additional info tags */}
      {(task.urgency || task.estimatedHours) && (
        <View style={styles.tagsRow}>
          {task.urgency && (
            <View style={[styles.infoTag, getUrgencyStyle(task.urgency)]}>
              <Text style={[styles.infoTagText, getUrgencyTextStyle(task.urgency)]}>
                {getUrgencyIcon(task.urgency)} {task.urgency}
              </Text>
            </View>
          )}
          {task.estimatedHours && (
            <View style={styles.infoTag}>
              <Text style={styles.infoTagText}>⏱️ {task.estimatedHours}h</Text>
            </View>
          )}
        </View>
      )}

      {/* Tap indicator */}
      <View style={styles.tapIndicator}>
        <Text style={styles.tapIndicatorText}>👆 Tap for details</Text>
      </View>
    </TouchableOpacity>
  );
};

// Helper functions for urgency styling
const getUrgencyStyle = (urgency) => {
  switch (urgency) {
    case 'high': return { backgroundColor: '#ffebee' };
    case 'medium': return { backgroundColor: '#fff3e0' };
    case 'low': return { backgroundColor: '#e8f5e8' };
    default: return { backgroundColor: '#f5f5f5' };
  }
};

const getUrgencyTextStyle = (urgency) => {
  switch (urgency) {
    case 'high': return { color: '#f44336' };
    case 'medium': return { color: '#ff9800' };
    case 'low': return { color: '#4caf50' };
    default: return { color: '#757575' };
  }
};

const getUrgencyIcon = (urgency) => {
  switch (urgency) {
    case 'high': return '🔥';
    case 'medium': return '⚡';
    case 'low': return '🌱';
    default: return '📋';
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
    lineHeight: 22,
  },
  tag: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2e7d32',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dueDateLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  dueDateText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
    marginRight: 8,
  },
  daysLeftBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  normalBadge: {
    backgroundColor: '#e8f5e8',
  },
  urgentBadge: {
    backgroundColor: '#fff3e0',
  },
  overdueBadge: {
    backgroundColor: '#ffebee',
  },
  daysLeftText: {
    fontSize: 11,
    fontWeight: '600',
  },
  normalText: {
    color: '#4caf50',
  },
  urgentText: {
    color: '#ff9800',
  },
  overdueText: {
    color: '#f44336',
  },
  roleInfoRow: {
    marginBottom: 10,
  },
  roleInfo: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  statusRow: {
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionRow: {
    marginTop: 8,
    marginBottom: 8,
  },
  quickActionBtn: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 6,
    marginBottom: 8,
  },
  infoTag: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  infoTagText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  tapIndicator: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  tapIndicatorText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    fontStyle: 'italic',
  },
});

export default TaskCard;