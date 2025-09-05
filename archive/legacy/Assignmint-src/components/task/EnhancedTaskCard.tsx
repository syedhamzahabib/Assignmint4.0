// components/task/EnhancedTaskCard.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../constants';

interface Task {
  id: string;
  title: string;
  subject: string;
  status: string;
  price: number;
  deadline: string;
  expertName?: string;
  requesterName?: string;
  progress?: number;
  urgency: string;
}

interface EnhancedTaskCardProps {
  task: Task;
  onPress: () => void;
  role: string;
}

const EnhancedTaskCard: React.FC<EnhancedTaskCardProps> = ({ task, onPress, role }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return COLORS.success;
      case 'in_progress':
      case 'working':
        return COLORS.primary;
      case 'pending_review':
        return COLORS.warning;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return '🔄 In Progress';
      case 'working':
        return '⚡ Working';
      case 'pending_review':
        return '📋 Pending Review';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return COLORS.error;
      case 'medium':
        return COLORS.warning;
      case 'low':
        return COLORS.success;
      default:
        return COLORS.textSecondary;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {task.title}
          </Text>
          <Text style={styles.subject}>{task.subject}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${task.price}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text style={[styles.detailValue, { color: getStatusColor(task.status) }]}>
            {getStatusText(task.status)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Deadline:</Text>
          <Text style={styles.detailValue}>{task.deadline}</Text>
        </View>

        {role === 'requester' && task.expertName && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expert:</Text>
            <Text style={styles.detailValue}>{task.expertName}</Text>
          </View>
        )}

        {role === 'expert' && task.requesterName && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Requester:</Text>
            <Text style={styles.detailValue}>{task.requesterName}</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Priority:</Text>
          <Text style={[styles.detailValue, { color: getUrgencyColor(task.urgency) }]}>
            {task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)}
          </Text>
        </View>
      </View>

      {task.progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${task.progress}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{task.progress}% Complete</Text>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subject: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EnhancedTaskCard;
