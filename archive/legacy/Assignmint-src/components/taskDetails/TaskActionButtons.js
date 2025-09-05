// components/taskDetails/TaskActionButtons.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const TaskActionButtons = ({ 
  task, 
  isRequester, 
  isExpert, 
  currentUser,
  actionLoading,
  onAction,
  onNavigation 
}) => {
  if (!task) return null;

  const handleActionWithConfirmation = (action, title, message, actionData = {}) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => onAction(action, actionData),
          style: action === 'cancel' || action === 'dispute' ? 'destructive' : 'default'
        }
      ]
    );
  };

  const renderRequesterActions = () => {
    switch (task.status) {
      case 'pending_review':
        return (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleActionWithConfirmation(
                'approve',
                '✅ Approve Task',
                `Approve "${task.title}" and release payment to ${task.assignedExpertName || 'the expert'}?`
              )}
              disabled={actionLoading}
            >
              <Text style={styles.actionButtonText}>✅ Approve & Pay</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.disputeButton]}
              onPress={() => handleActionWithConfirmation(
                'dispute',
                '🚩 File Dispute',
                `File a dispute for "${task.title}"? This will pause payment and start a review process.`
              )}
              disabled={actionLoading}
            >
              <Text style={styles.actionButtonText}>🚩 Dispute</Text>
            </TouchableOpacity>
          </View>
        );
        
      case 'in_progress':
      case 'working':
        return (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleActionWithConfirmation(
                'cancel',
                '❌ Cancel Task',
                `Cancel "${task.title}"? This action cannot be undone. Refund will be processed within 24 hours.`
              )}
              disabled={actionLoading}
            >
              <Text style={styles.actionButtonText}>❌ Cancel Task</Text>
            </TouchableOpacity>
          </View>
        );
        
      case 'awaiting_expert':
        return (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={() => Alert.alert('Edit Task', 'Task editing feature coming soon!')}
              disabled={actionLoading}
            >
              <Text style={styles.actionButtonText}>✏️ Edit Task</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleActionWithConfirmation(
                'cancel',
                '❌ Cancel Task',
                `Cancel "${task.title}"? Since no expert is assigned yet, you'll receive a full refund.`
              )}
              disabled={actionLoading}
            >
              <Text style={styles.actionButtonText}>❌ Cancel</Text>
            </TouchableOpacity>
          </View>
        );
        
      case 'delivered':
        return (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleActionWithConfirmation(
                'approve',
                '✅ Approve Delivery',
                `Approve the delivered work for "${task.title}" and release payment?`
              )}
              disabled={actionLoading}
            >
              <Text style={styles.actionButtonText}>✅ Approve</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.revisionButton]}
              onPress={() => handleActionWithConfirmation(
                'request_revision',
                '🔄 Request Revision',
                `Request revisions for "${task.title}"? The expert will be notified about needed changes.`
              )}
              disabled={actionLoading}
            >
              <Text style={styles.actionButtonText}>🔄 Revision</Text>
            </TouchableOpacity>
          </View>
        );
        
      default:
        return null;
    }
  };

  const renderExpertActions = () => {
    // Check if expert can accept this manual match task
    if (task.matchingType === 'manual' && task.status === 'awaiting_expert' && !task.assignedExpertId) {
      return (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleActionWithConfirmation(
              'accept',
              '🎯 Accept Manual Match Task',
              `Accept "${task.title}"?\n\nPrice: ${task.price}\nRequester: ${task.requesterName || 'Unknown'}\nDeadline: ${task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}\n\nOnce accepted, you'll be assigned and can start working immediately.`
            )}
            disabled={actionLoading}
          >
            <Text style={styles.actionButtonText}>🎯 Accept Task</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Actions for assigned expert
    switch (task.status) {
      case 'working':
      case 'in_progress':
        return (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.uploadButton]}
              onPress={() => onAction('upload')}
              disabled={actionLoading}
            >
              <Text style={styles.actionButtonText}>📤 Upload Delivery</Text>
            </TouchableOpacity>
          </View>
        );
        
      case 'revision_requested':
        return (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.uploadButton]}
              onPress={() => onAction('upload')}
              disabled={actionLoading}
            >
              <Text style={styles.actionButtonText}>🔄 Submit Revision</Text>
            </TouchableOpacity>
          </View>
        );
        
      default:
        return null;
    }
  };

  const renderActionButtons = () => {
    if (isRequester) {
      return renderRequesterActions();
    } else if (isExpert) {
      return renderExpertActions();
    }
    return null;
  };

  const actionButtons = renderActionButtons();

  if (!actionButtons) {
    return null;
  }

  return (
    <View style={styles.container}>
      {actionButtons}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  approveButton: { 
    backgroundColor: '#4caf50' 
  },
  disputeButton: { 
    backgroundColor: '#ff5722' 
  },
  cancelButton: { 
    backgroundColor: '#f44336' 
  },
  editButton: { 
    backgroundColor: '#ff9800' 
  },
  uploadButton: { 
    backgroundColor: '#2e7d32' 
  },
  acceptButton: { 
    backgroundColor: '#2196f3' 
  },
  revisionButton: { 
    backgroundColor: '#ff9800' 
  },
});

export default TaskActionButtons;