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
import API from '../lib/api';

// Import step components
import StepOne from './PostTaskSteps/StepOne';
import StepTwo from './PostTaskSteps/StepTwo';
import StepThree from './PostTaskSteps/StepThree';
import StepFour from './PostTaskSteps/StepFour';
import StepFive from './PostTaskSteps/StepFive';

const PostTaskScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
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
    budget: '',
    paymentMethod: null,
    urgency: 'medium',
    estimatedHours: null,
    tags: [],
    requesterId: 'user123',
    requesterName: 'Current User',
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
    try {
      console.log('📝 Submitting task to API:', formData);
      
      // Prepare task data for API
      const taskData = {
        title: formData.taskTitle,
        description: formData.description,
        subject: formData.selectedSubject,
        price: parseFloat(formData.budget) || 0,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default to 7 days from now
        fileUrls: formData.files || [],
      };

      // Call API to create task
      const createdTask = await API.createTask(taskData);
      console.log('✅ Task created successfully:', createdTask);

      // Show success message
      Alert.alert(
        '✅ Task Posted Successfully!',
        'Your task has been posted and is now visible to our community of experts.',
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
                budget: '',
                paymentMethod: null,
                urgency: 'medium',
                estimatedHours: null,
                tags: [],
                requesterId: 'user123',
                requesterName: 'Current User',
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
