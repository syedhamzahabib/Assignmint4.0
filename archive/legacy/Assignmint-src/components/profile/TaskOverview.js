// components/profile/TaskOverview.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskOverview = ({ stats }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>📈 Task Overview</Text>
      
      <View style={styles.taskOverview}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewNumber}>{stats.completedTasks}</Text>
          <Text style={styles.overviewLabel}>Completed</Text>
          <Text style={styles.overviewPercent}>
            {Math.round((stats.completedTasks / stats.tasksPosted) * 100)}%
          </Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewNumber}>{stats.cancelledTasks}</Text>
          <Text style={styles.overviewLabel}>Cancelled</Text>
          <Text style={styles.overviewPercent}>
            {Math.round((stats.cancelledTasks / stats.tasksPosted) * 100)}%
          </Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewNumber}>{stats.disputedTasks}</Text>
          <Text style={styles.overviewLabel}>Disputed</Text>
          <Text style={styles.overviewPercent}>
            {Math.round((stats.disputedTasks / stats.tasksPosted) * 100)}%
          </Text>
        </View>
      </View>
      
      {/* Recent Activity */}
      <View style={styles.recentActivity}>
        <Text style={styles.activityTitle}>Recent Activity</Text>
        {stats.recentActivity.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={styles.activityDot} />
            <View style={styles.activityContent}>
              <Text style={styles.activityAction}>{activity.action}</Text>
              <Text style={styles.activityTask}>{activity.task}</Text>
              <Text style={styles.activityDate}>{activity.date}</Text>
            </View>
          </View>
        ))}
      </View>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  taskOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  overviewCard: {
    alignItems: 'center',
    flex: 1,
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2e7d32',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
  },
  overviewPercent: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  recentActivity: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2e7d32',
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTask: {
    fontSize: 13,
    color: '#2e7d32',
    fontWeight: '600',
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default TaskOverview;