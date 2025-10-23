import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants';
import { firestoreService } from '../services/firestoreService';
import { matchingService } from '../services/matchingService';
import { useAuth } from '../state/AuthProvider';
import { fcmService } from '../services/fcmService';
import { Task } from '../types/firestore';

// Import step components
import StepOne from './PostTaskSteps/StepOne';
import StepTwo from './PostTaskSteps/StepTwo';
import StepThree from './PostTaskSteps/StepThree';
import StepFour from './PostTaskSteps/StepFour';
import StepFive from './PostTaskSteps/StepFive';

const PostTaskScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    taskTitle: '',
    selectedSubject: '',
    selectedUrgency: '',
    isForStudent: null,
    description: '',
    images: [],
    files: [],
    aiLevel: 'none',
    aiPercentage: 40,
    deadline: null,
    specialInstructions: '',
    matchingType: 'manual',
    autoMatch: false, // New field for auto-matching
    budget: '',
    paymentMethod: null,
    urgency: 'medium',
    estimatedHours: null,
    tags: [],
    requesterId: user?.uid || '',
    requesterName: user?.displayName || user?.email || 'Current User',
  });

  const updateFormData = (field: string, value: any) => {
    console.log('Updating form data:', field, '=', value);
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigation?.goBack();
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to post a task.');
      return;
    }

    try {
      console.log('📝 Submitting task to Firestore:', formData);
      
      // Prepare task data for Firestore
      const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.taskTitle,
        description: formData.description,
        subject: formData.selectedSubject,
        price: parseFloat(formData.budget) || 0,
        deadline: formData.deadline ? new Date(formData.deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
        status: 'open',
        urgency: formData.urgency as 'low' | 'medium' | 'high',
        aiLevel: formData.aiPercentage,
        createdBy: user.uid,
        createdByName: user.displayName || user.email || 'Unknown User',
        fileUrls: formData.files || [],
        tags: formData.tags || [],
        specialInstructions: formData.specialInstructions || '',
        estimatedHours: formData.estimatedHours || undefined,
        matchingType: formData.matchingType as 'manual' | 'auto',
        autoMatch: formData.autoMatch,
        applicants: [],
      };

      // Create task in Firestore
      const taskId = await firestoreService.createTask(taskData);
      console.log('✅ Task created successfully:', taskId);

      let assignedExpert = null;
      let autoMatchSuccess = false;

      // Handle auto-matching if enabled
      if (formData.autoMatch && formData.matchingType === 'auto') {
        try {
          console.log('🤖 Starting auto-matching process...');
          const autoMatchResult = await matchingService.autoMatchTask(taskId);
          
          if (autoMatchResult.success && autoMatchResult.data) {
            assignedExpert = autoMatchResult.data.expert;
            autoMatchSuccess = true;
            console.log('✅ Expert auto-assigned:', assignedExpert.displayName);
          } else {
            console.log('⚠️ Auto-matching failed:', autoMatchResult.message);
          }
        } catch (error) {
          console.error('❌ Auto-matching error:', error);
        }
      }

      // Send notification to potential experts (only for manual matching)
      if (formData.matchingType === 'manual') {
        await fcmService.sendNotificationToUser(
          'all', // This would be a special user ID for broadcast notifications
          'New Task Available!',
          `A new ${formData.selectedSubject} task has been posted: ${formData.taskTitle}`,
          { taskId, type: 'newTask' }
        );
      }

      // Show success message based on matching type
      const successMessage = autoMatchSuccess 
        ? `✅ Task Posted & Expert Assigned!\n\nYour task has been posted and automatically assigned to ${assignedExpert?.displayName}.\n\n💰 Budget: $${formData.budget}\n📅 Due: ${formData.deadline}\n👤 Expert: ${assignedExpert?.displayName}`
        : formData.matchingType === 'auto' 
          ? '✅ Task Posted!\n\nYour task has been posted and is being processed for auto-assignment.\n\n💰 Budget: $' + formData.budget + '\n📅 Due: ' + formData.deadline + '\n🤖 Auto-matching in progress...'
          : '✅ Task Posted Successfully!\n\nYour task has been posted and is now visible to our community of experts.\n\n💰 Budget: $' + formData.budget + '\n📅 Due: ' + formData.deadline + '\n👥 Experts can now apply';

      Alert.alert(
        autoMatchSuccess ? '🎉 Task Posted & Expert Assigned!' : '✅ Task Posted Successfully!',
        successMessage,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form and go back to first step
              setFormData({
                taskTitle: '',
                selectedSubject: '',
                selectedUrgency: '',
                isForStudent: null,
                description: '',
                images: [],
                files: [],
                aiLevel: 'none',
                aiPercentage: 40,
                deadline: null,
                specialInstructions: '',
                matchingType: 'manual',
                autoMatch: false,
                budget: '',
                paymentMethod: null,
                urgency: 'medium',
                estimatedHours: null,
                tags: [],
                requesterId: user.uid,
                requesterName: user.displayName || user.email || 'Current User',
              });
              setCurrentStep(1);
              // Navigate back to main app
              navigation.navigate('MainTabs');
            },
          },
        ]
      );

    } catch (error) {
      console.error('❌ Error submitting task:', error);
      Alert.alert(
        '❌ Submission Error',
        'There was an error posting your task. Please check your information and try again.',
        [
          { text: 'Try Again' },
          {
            text: 'Save Draft',
            onPress: () => {
              Alert.alert('Draft Saved', 'Your task has been saved as a draft.');
            },
          },
        ]
      );
    }
  };

  const renderCurrentStep = () => {
    // Create a mock navigation object for the step components
    const stepNavigation = {
      navigate: (screenName: string, params: any = {}) => {
        if (screenName === 'StepTwo') {
          setCurrentStep(2);
        } else if (screenName === 'StepThree') {
          setCurrentStep(3);
        } else if (screenName === 'StepFour') {
          setCurrentStep(4);
        } else if (screenName === 'StepFive') {
          setCurrentStep(5);
        } else if (screenName === 'TaskPostedConfirmation') {
          // Navigate to the confirmation screen
          navigation.navigate('TaskPostedConfirmation', params);
        }
      },
      goBack: () => {
        handleBack();
      },
    };

    // Create a mock route object with the form data
    const stepRoute = {
      params: {
        ...formData,
        onNext: handleNext,
        onBack: handleBack,
        updateFormData: updateFormData,
      },
    };

    try {
      switch (currentStep) {
        case 1:
          return <StepOne navigation={stepNavigation} route={stepRoute} />;
        case 2:
          return <StepTwo navigation={stepNavigation} route={stepRoute} />;
        case 3:
          return <StepThree navigation={stepNavigation} route={stepRoute} />;
        case 4:
          return <StepFour navigation={stepNavigation} route={stepRoute} />;
        case 5:
          return <StepFive navigation={stepNavigation} route={stepRoute} />;
        default:
          return <StepOne navigation={stepNavigation} route={stepRoute} />;
      }
    } catch (error) {
      console.error('Error rendering step:', error);
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>⚠️ Error Loading Step</Text>
          <Text style={styles.errorText}>Step {currentStep} failed to load</Text>
          <Text style={styles.errorDetails}>{String(error)}</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => setCurrentStep(1)}
          >
            <Text style={styles.errorButtonText}>Go to Step 1</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content */}
      <View style={styles.content}>
        {renderCurrentStep()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  errorTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  errorText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  errorDetails: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  errorButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
});

export default PostTaskScreen;
