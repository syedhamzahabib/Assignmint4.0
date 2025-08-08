import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS } from '../../constants';

interface TaskActionButtonsProps {
  task: {
    id: string;
    status: string;
    budget: string;
  };
  userRole: string;
  onAccept?: () => void;
  onBid?: () => void;
  onMessage?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
  onDispute?: () => void;
}

const TaskActionButtons: React.FC<TaskActionButtonsProps> = ({
  task,
  userRole,
  onAccept,
  onBid,
  onMessage,
  onCancel,
  onComplete,
  onDispute,
}) => {
  const handleAccept = () => {
    Alert.alert(
      'Accept Task',
      `Are you sure you want to accept this task for ${task.budget}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Accept', onPress: onAccept },
      ]
    );
  };

  const handleBid = () => {
    Alert.alert(
      'Place Bid',
      'You will be able to set your bid amount and message.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: onBid },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Task',
      'Are you sure you want to cancel this task? This action cannot be undone.',
      [
        { text: 'Keep Task', style: 'cancel' },
        { text: 'Cancel Task', style: 'destructive', onPress: onCancel },
      ]
    );
  };

  const handleComplete = () => {
    Alert.alert(
      'Complete Task',
      'Are you sure you want to mark this task as completed?',
      [
        { text: 'Not Yet', style: 'cancel' },
        { text: 'Complete', onPress: onComplete },
      ]
    );
  };

  const handleDispute = () => {
    Alert.alert(
      'Open Dispute',
      'Opening a dispute will pause the task and involve our support team.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Dispute', style: 'destructive', onPress: onDispute },
      ]
    );
  };

  // Render different buttons based on user role and task status
  const renderActionButtons = () => {
    if (userRole === 'expert') {
      // Expert view
      switch (task.status) {
        case 'open':
          return (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleBid}
              >
                <Text style={styles.primaryButtonText}>💼 Place Bid</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onMessage}
              >
                <Text style={styles.secondaryButtonText}>💬 Message</Text>
              </TouchableOpacity>
            </View>
          );
        
        case 'in_progress':
          return (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleComplete}
              >
                <Text style={styles.primaryButtonText}>✅ Complete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onMessage}
              >
                <Text style={styles.secondaryButtonText}>💬 Message</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.dangerButton]}
                onPress={handleDispute}
              >
                <Text style={styles.dangerButtonText}>⚠️ Dispute</Text>
              </TouchableOpacity>
            </View>
          );
        
        default:
          return (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onMessage}
              >
                <Text style={styles.secondaryButtonText}>💬 Message</Text>
              </TouchableOpacity>
            </View>
          );
      }
    } else {
      // Requester view
      switch (task.status) {
        case 'open':
          return (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onMessage}
              >
                <Text style={styles.secondaryButtonText}>💬 Message</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.dangerButton]}
                onPress={handleCancel}
              >
                <Text style={styles.dangerButtonText}>❌ Cancel</Text>
              </TouchableOpacity>
            </View>
          );
        
        case 'in_progress':
          return (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onMessage}
              >
                <Text style={styles.secondaryButtonText}>💬 Message</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.dangerButton]}
                onPress={handleDispute}
              >
                <Text style={styles.dangerButtonText}>⚠️ Dispute</Text>
              </TouchableOpacity>
            </View>
          );
        
        case 'completed':
          return (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.successButton]}
                onPress={onAccept}
              >
                <Text style={styles.successButtonText}>✅ Accept & Pay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onMessage}
              >
                <Text style={styles.secondaryButtonText}>💬 Message</Text>
              </TouchableOpacity>
            </View>
          );
        
        default:
          return (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onMessage}
              >
                <Text style={styles.secondaryButtonText}>💬 Message</Text>
              </TouchableOpacity>
            </View>
          );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Actions</Text>
      {renderActionButtons()}
      
      {/* Status Info */}
      <View style={styles.statusInfo}>
        <Text style={styles.statusInfoText}>
          {task.status === 'open' && userRole === 'expert' && 'Place a bid to get started'}
          {task.status === 'open' && userRole === 'requester' && 'Wait for expert bids'}
          {task.status === 'in_progress' && 'Task is currently being worked on'}
          {task.status === 'completed' && userRole === 'requester' && 'Review and accept the work'}
          {task.status === 'completed' && userRole === 'expert' && 'Waiting for requester approval'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.surface,
  },
  secondaryButton: {
    backgroundColor: COLORS.lightGray,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  successButton: {
    backgroundColor: COLORS.success,
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.surface,
  },
  dangerButton: {
    backgroundColor: COLORS.error,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.surface,
  },
  statusInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
  },
  statusInfoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default TaskActionButtons; 