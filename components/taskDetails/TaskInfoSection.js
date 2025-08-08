// components/taskDetails/TaskInfoSection.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getSubjectColor, getUrgencyStyle } from '../../utils/taskHelpers';

const TaskInfoSection = ({ task, isManualMatch = false }) => {
  const subjectColor = getSubjectColor(task.subject);
  const urgencyStyle = getUrgencyStyle(task.urgency);

  return (
    <View style={styles.section}>
      <View style={styles.titleHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.subjectBadge, { backgroundColor: subjectColor }]}>
              <Text style={styles.subjectText}>{task.subject}</Text>
            </View>
            {task.urgency && (
              <View style={[styles.urgencyBadge, { backgroundColor: urgencyStyle.backgroundColor }]}>
                <Text style={[styles.urgencyText, { color: urgencyStyle.color }]}>
                  {urgencyStyle.icon} {task.urgency.toUpperCase()}
                </Text>
              </View>
            )}
            {isManualMatch && (
              <View style={styles.manualMatchBadge}>
                <Text style={styles.manualMatchText}>🎯 MANUAL MATCH</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{task.price}</Text>
          <Text style={styles.priceLabel}>Total Budget</Text>
        </View>
      </View>

      {/* Additional Info */}
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>📅 Posted:</Text>
          <Text style={styles.infoValue}>
            {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Unknown'}
          </Text>
        </View>
        
        {task.estimatedHours && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>⏱️ Estimated:</Text>
            <Text style={styles.infoValue}>{task.estimatedHours} hours</Text>
          </View>
        )}
        
        {task.aiLevel && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>🤖 AI Level:</Text>
            <Text style={styles.infoValue}>
              {task.aiLevel === 'none' ? 'No AI' : 
               task.aiLevel === 'partial' ? `${task.aiPercentage}% AI` : 
               'Full AI'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
    lineHeight: 28,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  urgencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  manualMatchBadge: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  manualMatchText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2e7d32',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  infoGrid: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#111',
    fontWeight: '600',
  },
});

export default TaskInfoSection;