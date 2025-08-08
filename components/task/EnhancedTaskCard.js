// src/components/task/EnhancedTaskCard.js
// Enhanced version of TaskCard with better modularity and features

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  getSubjectColor, 
  getStatusInfo, 
  getUrgencyStyle, 
  calculateDaysLeft,
  formatDate 
} from '../../utils/taskHelpers';

const EnhancedTaskCard = ({ 
  task, 
  onPress, 
  onAction, 
  isRequester = true, 
  isLoading = false,
  showActions = true,
  compact = false 
}) => {
  // Safety check
  if (!task) return null;

  const statusInfo = getStatusInfo(task.status);
  const urgencyStyle = getUrgencyStyle(task.urgency);
  const daysLeftInfo = calculateDaysLeft(task.dueDate);

  const renderActionButtons = () => {
    if (!showActions || !onAction) return null;

    if (isRequester) {
      switch (task.status) {
        case 'pending_review':
          return (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.approveBtn]}
                onPress={() => onAction('review', task)}
                disabled={isLoading}
              >
                <Text style={styles.actionBtnText}>✅ Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.disputeBtn]}
                onPress={() => onAction('dispute', task)}
                disabled={isLoading}
              >
                <Text style={styles.actionBtnText}>🚩 Dispute</Text>
              </TouchableOpacity>
            </View>
          );
        case 'in_progress':
          return (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.cancelBtn]}
                onPress={() => onAction('cancel', task)}
                disabled={isLoading}
              >
                <Text style={styles.actionBtnText}>❌ Cancel</Text>
              </TouchableOpacity>
            </View>
          );
        case 'awaiting_expert':
          return (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.editBtn]}
                onPress={() => onAction('edit', task)}
                disabled={isLoading}
              >
                <Text style={styles.actionBtnText}>🟨 Edit</Text>
              </TouchableOpacity>
            </View>
          );
        default:
          return null;
      }
    } else {
      // Expert actions
      switch (task.status) {
        case 'working':
          return (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.uploadBtn]}
                onPress={() => onAction('upload', task)}
                disabled={isLoading}
              >
                <Text style={styles.actionBtnText}>🟩 Upload</Text>
              </TouchableOpacity>
            </View>
          );
        case 'revision_requested':
          return (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.uploadBtn]}
                onPress={() => onAction('upload', task)}
                disabled={isLoading}
              >
                <Text style={styles.actionBtnText}>🔄 Revise</Text>
              </TouchableOpacity>
            </View>
          );
        default:
          return null;
      }
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, compact && styles.compactCard]} 
      onPress={() => onPress && onPress(task)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, compact && styles.compactTitle]} numberOfLines={compact ? 1 : 2}>
            📌 {task.title}
          </Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.subjectBadge, { backgroundColor: getSubjectColor(task.subject) }]}>
              <Text style={styles.subjectText}>{task.subject}</Text>
            </View>
            {task.urgency && !compact && (
              <View style={[styles.urgencyBadge, { backgroundColor: urgencyStyle.backgroundColor }]}>
                <Text style={[styles.urgencyText, { color: urgencyStyle.color }]}>
                  {urgencyStyle.icon} {task.urgency.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.price}>{task.price}</Text>
      </View>

      {/* Due Date */}
      {!compact && (
        <View style={styles.dueDateRow}>
          <Text style={styles.dueDateLabel}>📅 Due: {formatDate(task.dueDate)}</Text>
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
      )}

      {/* Progress for Expert tasks */}
      {!isRequester && task.progress !== undefined && !compact && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressValue}>{task.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, task.progress))}%` }]} />
          </View>
        </View>
      )}

      {/* Role Info */}
      <Text style={styles.roleInfo}>
        {isRequester 
          ? (task.expertName ? `👤 Expert: ${task.expertName}` : '👀 No expert assigned')
          : `👤 Requester: ${task.requesterName || 'Unknown'}`
        }
      </Text>

      {/* Status */}
      <View style={styles.statusRow}>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
        </View>
      </View>

      {/* Expert Rating */}
      {isRequester && task.expertRating && !compact && (
        <View style={styles.expertRating}>
          <Text style={styles.expertRatingText}>
            ⭐ {task.expertRating} • {task.expertCompletedTasks} completed
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      {renderActionButtons()}

      {/* Tap Indicator */}
      {!compact && (
        <View style={styles.tapIndicator}>
          <Text style={styles.tapIndicatorText}>👆 Tap for details</Text>
        </View>
      )}
    </TouchableOpacity>
  );
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
  compactCard: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
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
  compactTitle: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 18,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  subjectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  subjectText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '600',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dueDateLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  daysLeftBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 3,
  },
  roleInfo: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 10,
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
  expertRating: {
    marginBottom: 12,
  },
  expertRatingText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
  },
  approveBtn: { backgroundColor: '#4caf50' },
  disputeBtn: { backgroundColor: '#ff5722' },
  cancelBtn: { backgroundColor: '#f44336' },
  editBtn: { backgroundColor: '#ff9800' },
  uploadBtn: { backgroundColor: '#2e7d32' },
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

export default EnhancedTaskCard;