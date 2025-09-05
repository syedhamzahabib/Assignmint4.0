import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../constants';
import Icon, { Icons } from '../common/Icon';

interface TaskDetailsHeaderProps {
  task: {
    title: string;
    status: string;
    subject: string;
    budget: string;
  };
  onBack: () => void;
  onShare?: () => void;
}

const TaskDetailsHeader: React.FC<TaskDetailsHeaderProps> = ({
  task,
  onBack,
  onShare,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return COLORS.success;
      case 'in_progress': return COLORS.warning;
      case 'completed': return COLORS.primary;
      case 'cancelled': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status.replace('_', ' ');
    }
  };

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name={Icons.back} size={24} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            Task Details
          </Text>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Icon name={Icons.share} size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Task Info */}
      <View style={styles.taskInfo}>
        <Text style={styles.taskTitle} numberOfLines={2}>
          {task.title}
        </Text>

        <View style={styles.taskMeta}>
          <View style={styles.metaItem}>
            <Icon name={Icons.book} size={16} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{task.subject}</Text>
          </View>

          <View style={styles.metaItem}>
            <Icon name={Icons.money} size={16} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{task.budget}</Text>
          </View>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(task.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(task.status)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    fontSize: 16,
    color: COLORS.text,
  },
  taskInfo: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 26,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statusContainer: {
    marginLeft: 'auto',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.surface,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default TaskDetailsHeader;
