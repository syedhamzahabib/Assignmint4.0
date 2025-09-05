import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS } from '../../constants';
import { Task } from '../../data/mockData';
import Icon, { Icons } from '../common/Icon';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onAccept?: () => void;
  onBid?: () => void;
  showActions?: boolean;
  userRole?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onAccept,
  onBid,
  showActions = false,
  userRole = 'requester',
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

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return Icons.priority;
      case 'medium': return Icons.clock;
      case 'low': return Icons.calendar;
      default: return Icons.task;
    }
  };

  const getAILevelIcon = (aiLevel: string) => {
    switch (aiLevel) {
      case 'none': return Icons.user;
      case 'assisted': return Icons.ai;
      case 'enhanced': return Icons.brain;
      case 'ai_heavy': return Icons.chip;
      default: return Icons.user;
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

  const formatDeadline = (deadline: string) => {
    if (deadline.includes('days')) {
      const days = deadline.split(' ')[0];
      if (days === '1') {return 'Due tomorrow';}
      if (parseInt(days) <= 3) {return `Due in ${days} days`;}
      return `Due in ${days} days`;
    }
    return `Due: ${deadline}`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Header with status badge */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title} numberOfLines={2}>
            {task.title}
          </Text>
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Icon name={Icons.book} size={16} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{task.subject}</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name={getUrgencyIcon(task.urgency)} size={16} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{task.urgency}</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name={getAILevelIcon(task.aiLevel)} size={16} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{task.aiLevel.replace('_', ' ')}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
          <Text style={styles.statusText}>{getStatusText(task.status)}</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={3}>
        {task.description}
      </Text>

      {/* Budget and Deadline */}
      <View style={styles.infoRow}>
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetIcon}>💰</Text>
          <Text style={styles.budget}>{task.budget}</Text>
        </View>
        <View style={styles.deadlineContainer}>
          <Text style={styles.deadlineIcon}>⏰</Text>
          <Text style={styles.deadline}>{formatDeadline(task.deadline)}</Text>
        </View>
      </View>

      {/* User Information */}
      <View style={styles.userSection}>
        <View style={styles.requesterInfo}>
          <Text style={styles.userLabel}>Posted by:</Text>
          <Text style={styles.requesterName}>👤 {task.requesterName}</Text>
          <Text style={styles.rating}>⭐ {task.requesterRating}</Text>
        </View>

        {task.bids && (
          <View style={styles.bidsContainer}>
            <Text style={styles.bidsIcon}>📝</Text>
            <Text style={styles.bids}>{task.bids} bids</Text>
          </View>
        )}
      </View>

      {/* Expert Information (if assigned) */}
      {task.expertName && (
        <View style={styles.expertSection}>
          <Text style={styles.expertLabel}>Assigned to:</Text>
          <View style={styles.expertInfo}>
                          <Text style={styles.expertName}>{task.expertName}</Text>
            <Text style={styles.expertRating}>⭐ {task.expertRating}</Text>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      {showActions && userRole === 'expert' && task.status === 'open' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.bidButton}
            onPress={onBid}
          >
            <Text style={styles.bidButtonText}>Place Bid</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={onAccept}
          >
            <Text style={styles.acceptButtonText}>Accept Task</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {task.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
            {task.tags.length > 3 && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>+{task.tags.length - 3} more</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  metaInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metaIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.surface,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  budget: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  deadline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  requesterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  requesterName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  rating: {
    fontSize: 12,
    color: COLORS.warning,
    fontWeight: '500',
  },
  bidsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bidsIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  bids: {
    fontSize: 12,
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  expertSection: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  expertLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  expertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expertName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  expertRating: {
    fontSize: 12,
    color: COLORS.warning,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  bidButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  bidButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: COLORS.success,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.surface,
  },
  tagsContainer: {
    marginTop: 8,
  },
  tag: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});

export default TaskCard;
