// components/taskDetails/TaskContentSection.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskContentSection = ({ task }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📝 Description</Text>
      <Text style={styles.description}>{task.description}</Text>
      
      {/* Requirements */}
      {task.requirements && task.requirements.length > 0 && (
        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementsTitle}>✅ Requirements</Text>
          {task.requirements.map((requirement, index) => (
            <View key={index} style={styles.requirementItem}>
              <Text style={styles.requirementBullet}>•</Text>
              <Text style={styles.requirementText}>{requirement}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Special Instructions */}
      {task.specialInstructions && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>📋 Special Instructions</Text>
          <Text style={styles.instructionsText}>{task.specialInstructions}</Text>
        </View>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          <Text style={styles.tagsTitle}>🏷️ Tags</Text>
          <View style={styles.tagsRow}>
            {task.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 16,
  },
  requirementsContainer: {
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  requirementBullet: {
    fontSize: 16,
    color: '#2e7d32',
    marginRight: 8,
    fontWeight: 'bold',
    marginTop: 2,
  },
  requirementText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  instructionsContainer: {
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 6,
  },
  instructionsText: {
    fontSize: 14,
    color: '#e65100',
    lineHeight: 20,
  },
  tagsContainer: {
    marginTop: 8,
  },
  tagsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
});

export default TaskContentSection;