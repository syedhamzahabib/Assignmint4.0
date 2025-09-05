// components/TaskActionModal.tsx

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS } from '../constants';

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

interface TaskActionModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onAction: (action: string) => void;
}

const TaskActionModal: React.FC<TaskActionModalProps> = ({
  visible,
  task,
  onClose,
  onAction,
}) => {
  if (!task) {return null;}

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

  const getAvailableActions = () => {
    const actions = [];

    switch (task.status) {
      case 'open':
        actions.push(
          { id: 'accept', label: 'Accept Task', icon: '✅', color: COLORS.success },
          { id: 'message', label: 'Message Requester', icon: '💬', color: COLORS.primary },
          { id: 'report', label: 'Report Issue', icon: '🚨', color: COLORS.error }
        );
        break;
      case 'in_progress':
      case 'working':
        actions.push(
          { id: 'update', label: 'Update Progress', icon: '📝', color: COLORS.primary },
          { id: 'deliver', label: 'Deliver Work', icon: '📤', color: COLORS.success },
          { id: 'message', label: 'Message', icon: '💬', color: COLORS.primary },
          { id: 'request_extension', label: 'Request Extension', icon: '⏰', color: COLORS.warning }
        );
        break;
      case 'pending_review':
        actions.push(
          { id: 'approve', label: 'Approve Work', icon: '✅', color: COLORS.success },
          { id: 'request_revision', label: 'Request Revision', icon: '🔄', color: COLORS.warning },
          { id: 'message', label: 'Message Expert', icon: '💬', color: COLORS.primary }
        );
        break;
      case 'completed':
        actions.push(
          { id: 'rate', label: 'Rate & Review', icon: '⭐', color: COLORS.primary },
          { id: 'message', label: 'Message', icon: '💬', color: COLORS.primary },
          { id: 'rehire', label: 'Rehire Expert', icon: '🔄', color: COLORS.success }
        );
        break;
      default:
        actions.push(
          { id: 'message', label: 'Message', icon: '💬', color: COLORS.primary },
          { id: 'report', label: 'Report Issue', icon: '🚨', color: COLORS.error }
        );
    }

    return actions;
  };

  const availableActions = getAvailableActions();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Task Actions</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Task Info */}
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskSubject}>{task.subject}</Text>
            <View style={styles.taskDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[styles.detailValue, { color: getStatusColor(task.status) }]}>
                  {getStatusText(task.status)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Price:</Text>
                <Text style={styles.detailValue}>${task.price}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Deadline:</Text>
                <Text style={styles.detailValue}>{task.deadline}</Text>
              </View>
              {task.progress !== undefined && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Progress:</Text>
                  <Text style={styles.detailValue}>{task.progress}%</Text>
                </View>
              )}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Available Actions</Text>
            {availableActions.map(action => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionButton}
                onPress={() => onAction(action.id)}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <View style={[styles.actionIndicator, { backgroundColor: action.color }]} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  taskInfo: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  taskSubject: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  taskDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  actionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionLabel: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  actionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default TaskActionModal;
