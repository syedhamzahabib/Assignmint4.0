// components/profile/expert/TaskHistory.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../../constants';

interface TaskHistoryProps {
  tasks: any[];
  onTaskPress: (task: any) => void;
  onViewAll: () => void;
}

const TaskHistory: React.FC<TaskHistoryProps> = ({ tasks, onTaskPress, onViewAll }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Tasks</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {tasks.length > 0 ? (
        tasks.slice(0, 3).map((task, index) => (
          <TouchableOpacity
            key={task.name || index}
            style={styles.taskItem}
            onPress={() => onTaskPress(task)}
          >
            <View style={styles.taskInfo}>
              <Text style={styles.taskName}>{task.name}</Text>
              <Text style={styles.taskDetails}>
                {task.taskCount} tasks • ${task.totalEarned.toFixed(2)} earned
              </Text>
            </View>
            <Text style={styles.taskDate}>{task.lastTaskDate}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No recent tasks</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  taskDetails: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  taskDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyState: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default TaskHistory;
