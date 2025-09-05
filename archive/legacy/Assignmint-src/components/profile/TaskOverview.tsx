// components/profile/TaskOverview.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../constants';

interface TaskOverviewProps {
  tasks: any[];
  onTaskPress: (task: any) => void;
  onViewAll: () => void;
}

const TaskOverview: React.FC<TaskOverviewProps> = ({ tasks, onTaskPress, onViewAll }) => {
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
            key={task.id || index}
            style={styles.taskItem}
            onPress={() => onTaskPress(task)}
          >
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskStatus}>{task.status}</Text>
            <Text style={styles.taskPrice}>${task.price}</Text>
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
  taskTitle: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  taskStatus: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginHorizontal: 8,
  },
  taskPrice: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
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

export default TaskOverview;
