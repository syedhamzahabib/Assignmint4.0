// components/profile/expert/TaskHistory.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const TaskHistory = ({ taskHistory, onViewAllTasks, onTaskPress }) => {
  // Get subject color
  const getSubjectColor = (subject) => {
    const colors = {
      'Math': '#3f51b5',
      'Coding': '#00796b',
      'Writing': '#d84315',
      'Physics': '#1976d2',
      'Chemistry': '#f57f17',
      'Language': '#00838f',
      'Design': '#6a1b9a',
      'Business': '#388e3c',
      'Psychology': '#7b1fa2',
      'Statistics': '#c62828'
    };
    return colors[subject] || '#9e9e9e';
  };

  // Get status info
  const getStatusInfo = (status) => {
    const statusMap = {
      'completed': { text: '✅ Completed', color: '#4caf50', bgColor: '#e8f5e8' },
      'payment_received': { text: '💰 Paid', color: '#2e7d32', bgColor: '#e8f5e8' },
      'delivered': { text: '📤 Delivered', color: '#ff9800', bgColor: '#fff3e0' },
      'working': { text: '🔨 In Progress', color: '#2196f3', bgColor: '#e3f2fd' },
      'revision_requested': { text: '🔄 Revising', color: '#ff5722', bgColor: '#fbe9e7' },
    };
    return statusMap[status] || { text: status, color: '#666', bgColor: '#f5f5f5' };
  };

  // Format date
  const formatDate = (dateString) => {
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

  // Get rating stars
  const getRatingStars = (rating) => {
    if (!rating) return { text: 'Not rated', color: '#999' };
    return { 
      text: `★${'★'.repeat(Math.floor(rating) - 1)}${'☆'.repeat(5 - Math.floor(rating))} (${rating})`,
      color: '#ffc107'
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>📋 Recent Task History</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={onViewAllTasks}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {taskHistory && taskHistory.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {taskHistory.map((task, index) => {
            const statusInfo = getStatusInfo(task.status);
            const subjectColor = getSubjectColor(task.subject);
            
            return (
              <TouchableOpacity
                key={task.id || index}
                style={[styles.taskCard, { borderLeftColor: subjectColor }]}
                onPress={() => onTaskPress && onTaskPress(task)}
                activeOpacity={0.7}
              >
                {/* Task Header */}
                <View style={styles.taskHeader}>
                  <View style={[styles.subjectBadge, { backgroundColor: subjectColor }]}>
                    <Text style={styles.subjectText}>{task.subject}</Text>
                  </View>
                  <Text style={styles.taskPrice}>{task.price}</Text>
                </View>

                {/* Task Title */}
                <Text style={styles.taskTitle} numberOfLines={2}>
                  {task.title}
                </Text>

                {/* Requester */}
                <Text style={styles.requesterName}>
                  👤 {task.requesterName}
                </Text>

                {/* Status */}
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
                  <Text style={[styles.statusText, { color: statusInfo.color }]}>
                    {statusInfo.text}
                  </Text>
                </View>

                {/* Rating */}
                <View style={styles.ratingContainer}>
                  {task.rating ? (
                    <Text style={[styles.ratingText, { color: getRatingStars(task.rating).color }]}>
                      {getRatingStars(task.rating).text}
                    </Text>
                  ) : (
                    <Text style={styles.noRatingText}>Not rated yet</Text>
                  )}
                </View>

                {/* Date */}
                <Text style={styles.taskDate}>
                  {formatDate(task.completedDate || task.deliveredDate)}
                </Text>

                {/* Earnings */}
                <View style={styles.earningsContainer}>
                  <Text style={styles.earningsLabel}>Earned:</Text>
                  <Text style={styles.earningsAmount}>
                    ${(parseFloat(task.price.replace('$', '')) * 0.95).toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No Tasks Yet</Text>
          <Text style={styles.emptyText}>
            Start accepting tasks to build your expert profile and earn money!
          </Text>
          <TouchableOpacity style={styles.browseTasksButton}>
            <Text style={styles.browseTasksText}>Browse Available Tasks</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Quick Stats */}
      {taskHistory && taskHistory.length > 0 && (
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatNumber}>
              {taskHistory.filter(t => t.status === 'completed' || t.status === 'payment_received').length}
            </Text>
            <Text style={styles.quickStatLabel}>Completed</Text>
          </View>
          
          <View style={styles.quickStat}>
            <Text style={styles.quickStatNumber}>
              {taskHistory.filter(t => t.status === 'working').length}
            </Text>
            <Text style={styles.quickStatLabel}>In Progress</Text>
          </View>
          
          <View style={styles.quickStat}>
            <Text style={styles.quickStatNumber}>
              ${taskHistory.reduce((sum, task) => {
                if (task.status === 'payment_received' || task.status === 'completed') {
                  return sum + (parseFloat(task.price.replace('$', '')) * 0.95);
                }
                return sum;
              }, 0).toFixed(0)}
            </Text>
            <Text style={styles.quickStatLabel}>Total Earned</Text>
          </View>
          
          <View style={styles.quickStat}>
            <Text style={styles.quickStatNumber}>
              {(taskHistory.reduce((sum, task) => sum + (task.rating || 0), 0) / taskHistory.filter(t => t.rating).length || 0).toFixed(1)}
            </Text>
            <Text style={styles.quickStatLabel}>Avg Rating</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  viewAllButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewAllText: {
    color: '#2e7d32',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    paddingRight: 16,
  },
  taskCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 240,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  taskPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e7d32',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
    lineHeight: 18,
  },
  requesterName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  ratingContainer: {
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  noRatingText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  taskDate: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
  },
  earningsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  earningsLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  earningsAmount: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  browseTasksButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseTasksText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 2,
  },
  quickStatLabel: {
    fontSize: 10,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default TaskHistory;