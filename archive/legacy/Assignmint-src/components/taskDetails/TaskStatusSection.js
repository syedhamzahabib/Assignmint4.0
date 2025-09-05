// components/taskDetails/TaskStatusSection.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStatusInfo, calculateDaysLeft } from '../../utils/taskHelpers';

const TaskStatusSection = ({ task, isRequester, progress }) => {
  const statusInfo = getStatusInfo(task.status);
  const daysLeftInfo = calculateDaysLeft(task.deadline);

  return (
    <View style={styles.section}>
      <View style={styles.statusRow}>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
        </View>
        
        <View style={[
          styles.dueDateBadge,
          daysLeftInfo.isOverdue && styles.overdueBadge,
          daysLeftInfo.isUrgent && styles.urgentBadge,
          daysLeftInfo.isNormal && styles.normalBadge
        ]}>
          <Text style={[
            styles.dueDateText,
            daysLeftInfo.isOverdue && styles.overdueText,
            daysLeftInfo.isUrgent && styles.urgentText,
            daysLeftInfo.isNormal && styles.normalText
          ]}>
            📅 Due {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No date'} • {daysLeftInfo.text}
          </Text>
        </View>
      </View>
      
      {/* Progress bar for expert tasks */}
      {!isRequester && typeof progress === 'number' && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressValue}>{progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, progress))}%` }]} />
          </View>
        </View>
      )}

      {/* Manual Match Status Info */}
      {task.matchingType === 'manual' && (
        <View style={styles.manualMatchInfo}>
          <Text style={styles.manualMatchTitle}>🎯 Manual Match Details</Text>
          <View style={styles.manualMatchDetails}>
            <Text style={styles.manualMatchText}>
              • This task was posted on the expert marketplace
            </Text>
            <Text style={styles.manualMatchText}>
              • {isRequester ? 'You chose the expert from applicants' : 'You were selected from multiple experts'}
            </Text>
            {task.viewCount && (
              <Text style={styles.manualMatchText}>
                • Viewed by {task.viewCount} expert{task.viewCount !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dueDateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flex: 1,
    marginLeft: 8,
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
  dueDateText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
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
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 4,
  },
  manualMatchInfo: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  manualMatchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: 8,
  },
  manualMatchDetails: {
    gap: 4,
  },
  manualMatchText: {
    fontSize: 12,
    color: '#1976d2',
    lineHeight: 16,
  },
});

export default TaskStatusSection;