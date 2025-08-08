// components/taskDetails/TaskPeopleSection.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskPeopleSection = ({ task, isRequester }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>👥 People Involved</Text>
      
      {isRequester ? (
        <View style={styles.personCard}>
          <View style={styles.personHeader}>
            <Text style={styles.personRole}>Expert</Text>
            {task.expertRating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>⭐ {task.expertRating}</Text>
                <Text style={styles.completedTasks}>({task.expertCompletedTasks} completed)</Text>
              </View>
            )}
          </View>
          <Text style={styles.personName}>
            {task.assignedExpertName || 'No expert assigned yet'}
          </Text>
          {task.assignedAt && (
            <Text style={styles.assignedDate}>
              Assigned: {new Date(task.assignedAt).toLocaleDateString()}
            </Text>
          )}
          {task.matchingType === 'manual' && task.assignedExpertName && (
            <View style={styles.manualMatchNote}>
              <Text style={styles.manualMatchNoteText}>
                🎯 You selected this expert from the manual match applicants
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.personCard}>
          <View style={styles.personHeader}>
            <Text style={styles.personRole}>Requester</Text>
            {task.requesterRating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>⭐ {task.requesterRating}</Text>
              </View>
            )}
          </View>
          <Text style={styles.personName}>{task.requesterName || 'Anonymous'}</Text>
          {task.createdAt && (
            <Text style={styles.assignedDate}>
              Posted: {new Date(task.createdAt).toLocaleDateString()}
            </Text>
          )}
          {task.matchingType === 'manual' && (
            <View style={styles.manualMatchNote}>
              <Text style={styles.manualMatchNoteText}>
                🎯 You were selected for this manual match task
              </Text>
            </View>
          )}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  personCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  personHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  personRole: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#ff9800',
    fontWeight: '600',
  },
  completedTasks: {
    fontSize: 11,
    color: '#666',
  },
  personName: {
    fontSize: 16,
    color: '#111',
    fontWeight: '600',
    marginBottom: 4,
  },
  assignedDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  manualMatchNote: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2196f3',
  },
  manualMatchNoteText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
    lineHeight: 16,
  },
});

export default TaskPeopleSection;