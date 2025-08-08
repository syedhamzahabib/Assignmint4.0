// components/taskDetails/TaskNotesSection.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskNotesSection = ({ task }) => {
  const hasNotes = task.disputeReason || task.revisionNotes || task.feedback;

  if (!hasNotes) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📋 Notes & Feedback</Text>
      
      {/* Dispute Reason */}
      {task.disputeReason && (
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>⚠️ Dispute Reason:</Text>
          <Text style={styles.noteText}>{task.disputeReason}</Text>
        </View>
      )}
      
      {/* Revision Notes */}
      {task.revisionNotes && (
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>🔄 Revision Notes:</Text>
          <Text style={styles.noteText}>{task.revisionNotes}</Text>
        </View>
      )}
      
      {/* Feedback with Rating */}
      {task.feedback && (
        <View style={styles.feedbackCard}>
          <Text style={styles.noteTitle}>⭐ Feedback:</Text>
          {task.rating && (
            <View style={styles.ratingRow}>
              <Text style={styles.ratingStars}>
                {'⭐'.repeat(task.rating)}{'☆'.repeat(5 - task.rating)}
              </Text>
              <Text style={styles.ratingNumber}>({task.rating}/5)</Text>
            </View>
          )}
          <Text style={styles.feedbackText}>{task.feedback}</Text>
        </View>
      )}

      {/* Delivery Message */}
      {task.delivery?.message && (
        <View style={styles.deliveryCard}>
          <Text style={styles.noteTitle}>📤 Delivery Message:</Text>
          <Text style={styles.noteText}>{task.delivery.message}</Text>
          {task.delivery.submittedAt && (
            <Text style={styles.deliveryTime}>
              Delivered: {new Date(task.delivery.submittedAt).toLocaleDateString()}
            </Text>
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
  noteCard: {
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  feedbackCard: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  deliveryCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 6,
  },
  noteText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingStars: {
    fontSize: 16,
    marginRight: 6,
  },
  ratingNumber: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  feedbackText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  deliveryTime: {
    fontSize: 12,
    color: '#1976d2',
    marginTop: 8,
    fontWeight: '500',
  },
});

export default TaskNotesSection;