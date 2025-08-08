// screens/TaskDetailsScreen.js - Enhanced with Manual Match support
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';

// Import services
import firestoreService from '../services/FirestoreService';

// Import modular components
import TaskDetailsHeader from '../components/taskDetails/TaskDetailsHeader';
import TaskInfoSection from '../components/taskDetails/TaskInfoSection';
import TaskStatusSection from '../components/taskDetails/TaskStatusSection';
import TaskPeopleSection from '../components/taskDetails/TaskPeopleSection';
import TaskContentSection from '../components/taskDetails/TaskContentSection';
import TaskAttachmentsSection from '../components/taskDetails/TaskAttachmentsSection';
import TaskNotesSection from '../components/taskDetails/TaskNotesSection';
import TaskActionButtons from '../components/taskDetails/TaskActionButtons';
import LoadingScreen from '../components/common/LoadingScreen';
import ErrorScreen from '../components/common/ErrorScreen';

// Import utilities
import { calculateProgress } from '../utils/taskHelpers';

const TaskDetailsScreen = ({ route, navigation }) => {
  // Safely destructure route params
  const params = route?.params || {};
  const { taskId, role = 'requester', task: initialTask, isManualMatch = false } = params;
  
  const [task, setTask] = useState(initialTask || null);
  const [loading, setLoading] = useState(!initialTask);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const isRequester = role === 'requester';
  const isExpert = role === 'expert';

  // Mock current user - replace with actual auth
  const currentUser = {
    id: isExpert ? 'expert123' : 'user123',
    name: isExpert ? 'Alex Johnson' : 'Current User',
    role: role
  };

  useEffect(() => {
    if (!initialTask && taskId) {
      loadTaskDetails();
    }
  }, [taskId, role]);

  // Load task details from Firestore
  const loadTaskDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`📡 Loading task details for ${taskId}...`);
      
      const response = await firestoreService.getTaskById(taskId);
      if (response.success) {
        setTask(response.data);
        console.log(`✅ Loaded task: ${response.data.title}`);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('❌ Failed to load task details:', error);
      setError('Failed to load task details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle task actions
  const handleTaskAction = async (action, actionData = {}) => {
    if (!task) return;
    
    try {
      setActionLoading(true);
      console.log(`🎬 Action: ${action} for task: ${task.title}`);
      
      let response;
      
      switch (action) {
        case 'accept':
          // Expert accepts manual match task
          response = await firestoreService.acceptManualTask(
            task.id,
            currentUser.id,
            currentUser
          );
          
          if (response.success) {
            // Update local task state
            setTask(prev => ({
              ...prev,
              status: 'working',
              assignedExpertId: currentUser.id,
              assignedExpertName: currentUser.name,
              assignedAt: new Date().toISOString()
            }));
            
            Alert.alert(
              '🎉 Task Accepted!',
              `You've successfully accepted "${task.title}"!\n\nYou can now start working on this task. The requester has been notified.`,
              [
                {
                  text: 'Start Working',
                  onPress: () => navigation.navigate('UploadDelivery', { task: { ...task, status: 'working' } })
                },
                {
                  text: 'View My Tasks',
                  onPress: () => navigation.navigate('MyTasks')
                },
                {
                  text: 'Continue Here',
                  style: 'cancel'
                }
              ]
            );
          }
          break;
          
        case 'upload':
          // Navigate to upload delivery
          navigation.navigate('UploadDelivery', { task });
          return;
          
        case 'approve':
          response = await firestoreService.submitTaskAction(
            task.id,
            'approve',
            role,
            actionData
          );
          
          if (response.success) {
            setTask(prev => ({ ...prev, status: 'completed' }));
            showSuccessAlert('✅ Task Approved!', 'Payment has been released to the expert.');
          }
          break;
          
        case 'dispute':
          response = await firestoreService.submitTaskAction(
            task.id,
            'dispute',
            role,
            actionData
          );
          
          if (response.success) {
            setTask(prev => ({ ...prev, status: 'disputed' }));
            showSuccessAlert('🚩 Dispute Filed', 'Our team will review within 24 hours.');
          }
          break;
          
        case 'cancel':
          response = await firestoreService.submitTaskAction(
            task.id,
            'cancel',
            role,
            actionData
          );
          
          if (response.success) {
            setTask(prev => ({ ...prev, status: 'cancelled' }));
            showSuccessAlert('❌ Task Cancelled', 'Task has been cancelled successfully.');
          }
          break;
          
        case 'request_revision':
          response = await firestoreService.submitTaskAction(
            task.id,
            'request_revision',
            role,
            actionData
          );
          
          if (response.success) {
            setTask(prev => ({ ...prev, status: 'revision_requested' }));
            showSuccessAlert('🔄 Revision Requested', 'Expert has been notified about the revision.');
          }
          break;
          
        default:
          Alert.alert('Action', `${action} for "${task.title}"`);
      }
      
      if (response && !response.success) {
        Alert.alert('Action Failed', response.message || 'Failed to complete action');
      }
      
    } catch (error) {
      console.error(`❌ ${action} failed:`, error);
      Alert.alert('Error', error.message || `Failed to ${action} task`);
    } finally {
      setActionLoading(false);
    }
  };

  // Show success alert
  const showSuccessAlert = (title, message) => {
    Alert.alert(title, message, [
      {
        text: 'OK',
        onPress: () => {
          // Optionally navigate back or refresh
          navigation.goBack();
        }
      }
    ]);
  };

  // Handle navigation actions
  const handleNavigation = (screen, params = {}) => {
    navigation.navigate(screen, params);
  };

  // Handle missing task
  if (!taskId && !initialTask) {
    return (
      <ErrorScreen
        icon="❌"
        title="Invalid Task"
        message="No task information provided."
        buttonText="Go Back"
        onButtonPress={() => navigation.goBack()}
      />
    );
  }

  // Handle loading state
  if (loading) {
    const loadingMessage = task 
      ? `Loading details for "${task.title}"...` 
      : "Loading task details...";
    
    const loadingSubmessage = isManualMatch 
      ? "Getting manual match assignment details..."
      : role === 'expert' 
        ? "Loading your assigned task information..."
        : "Loading your posted task status...";

    return (
      <LoadingScreen 
        message={loadingMessage}
        submessage={loadingSubmessage}
        showAnimation={true}
        size="large"
      />
    );
  }

  // Handle error state
  if (error || !task) {
    return (
      <ErrorScreen
        icon="❌"
        title="Task Not Found"
        message={error || "The requested task could not be found."}
        buttonText="Go Back"
        onButtonPress={() => navigation.goBack()}
        secondaryButtonText="Retry"
        onSecondaryButtonPress={loadTaskDetails}
      />
    );
  }

  // Calculate task progress
  const progress = calculateProgress(task);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <TaskDetailsHeader 
        onBack={() => navigation.goBack()}
        title="Task Details"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Task Information */}
        <TaskInfoSection 
          task={task}
          isManualMatch={isManualMatch || task.matchingType === 'manual'}
        />

        {/* Status and Progress */}
        <TaskStatusSection 
          task={task}
          isRequester={isRequester}
          progress={progress}
        />

        {/* People Involved */}
        <TaskPeopleSection 
          task={task}
          isRequester={isRequester}
        />

        {/* Task Content */}
        <TaskContentSection 
          task={task}
        />

        {/* Attachments */}
        {(task.attachments?.length > 0 || task.deliverables?.length > 0) && (
          <TaskAttachmentsSection 
            task={task}
          />
        )}

        {/* Notes and Feedback */}
        {(task.disputeReason || task.revisionNotes || task.feedback) && (
          <TaskNotesSection 
            task={task}
          />
        )}

        {/* Bottom spacing for fixed buttons */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Action Buttons */}
      <TaskActionButtons
        task={task}
        isRequester={isRequester}
        isExpert={isExpert}
        currentUser={currentUser}
        actionLoading={actionLoading}
        onAction={handleTaskAction}
        onNavigation={handleNavigation}
      />

      {/* Loading overlay */}
      {actionLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#2e7d32" />
            <Text style={styles.loadingText}>Processing action...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f9',
  },
  content: {
    flex: 1,
  },
  bottomSpacer: {
    height: 100,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    marginTop: 16,
    fontWeight: '500',
  },
});

export default TaskDetailsScreen;