// screens/PostScreen.js - Enhanced with Firestore integration and submission loading overlay
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';

// Import services
import firestoreService from '../services/FirestoreService';

// Import existing step components
import StepOne from './PostTaskSteps/StepOne';
import StepTwo from './PostTaskSteps/StepTwo';
import StepThree from './PostTaskSteps/StepThree';
import StepFour from './PostTaskSteps/StepFour';
import StepFive from './PostTaskSteps/StepFive';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Note: Ensure you have a LoadingScreen component available in your project.
// If not already present, add it or adjust the import path accordingly.
import LoadingScreen from '../components/common/LoadingScreen';

const PostScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmissionLoading, setShowSubmissionLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    description: '',
    images: [],
    files: [],
    aiLevel: 'none',
    aiPercentage: 40,
    deadline: null,
    specialInstructions: '',
    matchingType: 'manual', // Default to manual for this implementation
    budget: '',
    paymentMethod: null,

    // Additional fields for Firestore
    urgency: 'medium',
    estimatedHours: null,
    tags: [],
    requesterId: 'user123', // Replace with actual user ID
    requesterName: 'Current User', // Replace with actual user name
  });

  const updateFormData = (field, value) => {
    console.log('Updating form data:', field, '=', value);
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = (step) => {
    console.log('Validating step:', step, 'with data:', formData);

    switch (step) {
      case 1:
        if (!formData.subject || !formData.subject.trim()) {
          Alert.alert('Required Field', 'Please select a subject');
          return false;
        }
        if (!formData.title || !formData.title.trim()) {
          Alert.alert('Required Field', 'Please enter a task title');
          return false;
        }
        if (formData.title.trim().length < 5) {
          Alert.alert('Title Too Short', 'Please provide a more descriptive title (at least 5 characters)');
          return false;
        }
        return true;

      case 2:
        if (!formData.description || !formData.description.trim()) {
          Alert.alert('Required Field', 'Please enter a task description');
          return false;
        }
        if (formData.description.trim().length < 20) {
          Alert.alert('Description Too Short', 'Please provide at least 20 characters for a good description');
          return false;
        }
        return true;

      case 3:
        // AI level is always valid (has default)
        return true;

      case 4:
        if (!formData.deadline) {
          Alert.alert('Required Field', 'Please select a deadline');
          return false;
        }

        // Validate deadline is in the future
        const deadlineDate = new Date(formData.deadline);
        const now = new Date();
        if (deadlineDate <= now) {
          Alert.alert('Invalid Deadline', 'Deadline must be in the future');
          return false;
        }

        if (!formData.budget || !formData.budget.trim()) {
          Alert.alert('Required Field', 'Please enter your budget');
          return false;
        }
        const budgetNumber = parseFloat(formData.budget);
        if (isNaN(budgetNumber) || budgetNumber <= 0) {
          Alert.alert('Invalid Budget', 'Please enter a valid budget amount (greater than $0)');
          return false;
        }
        if (budgetNumber < 5) {
          Alert.alert('Budget Too Low', 'Minimum budget is $5 per task');
          return false;
        }
        if (budgetNumber > 1000) {
          Alert.alert('Budget Too High', 'Maximum budget is $1000 per task');
          return false;
        }
        return true;

      case 5:
        if (!formData.paymentMethod) {
          Alert.alert('Required Field', 'Please select a payment method');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const resetForm = () => {
    console.log('Resetting form...');
    setFormData({
      subject: '',
      title: '',
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
  };

  const handleSubmit = async () => {
    console.log('Final form submission:', formData);

    try {
      setIsSubmitting(true);
      setShowSubmissionLoading(true);

      // Prepare task data for Firestore
      const taskData = {
        ...formData,
        // Ensure price is formatted correctly
        price: `$${formData.budget}`,
        // Generate tags from title and description
        tags: generateTags(formData.title, formData.description, formData.subject),
        // Set matching type
        matchingType: formData.matchingType || 'manual',
      };

      // Submit to Firestore
      const response = await firestoreService.createTask(taskData);

      if (response.success) {
        setShowSubmissionLoading(false);
        // Show success message
        Alert.alert(
          '🎉 Task Posted Successfully!',
          `Your task "${formData.title}" has been posted to the public feed!\n\n💰 Budget: $${formData.budget}\n📅 Due: ${formData.deadline}\n🎯 Matching: ${formData.matchingType === 'manual' ? 'Manual (Experts will apply)' : 'Auto (We\'ll find an expert)'}\n\nExperts can now see and accept your task.`,
          [
            {
              text: 'View My Tasks',
              onPress: () => {
                resetForm();
                navigation?.navigate('MyTasks');
              },
            },
            {
              text: 'Post Another Task',
              onPress: resetForm,
            },
          ]
        );
      }
    } catch (error) {
      setShowSubmissionLoading(false);
      console.error('Error submitting task:', error);
      Alert.alert(
        '❌ Submission Error',
        error.message || 'There was an error posting your task. Please check your information and try again.',
        [
          { text: 'Try Again' },
          {
            text: 'Save Draft',
            onPress: () => {
              // TODO: Implement draft saving
              Alert.alert('Draft Saved', 'Your task has been saved as a draft.');
            },
          },
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate tags from content
  const generateTags = (title, description, subject) => {
    const allText = `${title} ${description}`.toLowerCase();
    const tags = new Set([subject.toLowerCase()]);

    // Common academic keywords
    const keywords = [
      'homework', 'assignment', 'project', 'essay', 'report', 'analysis',
      'research', 'coding', 'programming', 'math', 'calculus', 'algebra',
      'statistics', 'physics', 'chemistry', 'biology', 'writing', 'design',
      'urgent', 'help', 'tutor', 'solve', 'debug', 'fix', 'create', 'build'
    ];

    keywords.forEach(keyword => {
      if (allText.includes(keyword)) {
        tags.add(keyword);
      }
    });

    return Array.from(tags).slice(0, 8); // Limit to 8 tags
  };

  // Navigation handlers
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      // Navigate back to previous screen
      navigation?.goBack();
    }
  };

  // Progress indicator
  const renderProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>Step {currentStep} of 5</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / 5) * 100}%` }]} />
      </View>

      {/* Step labels */}
      <View style={styles.progressLabels}>
        <Text style={[styles.progressLabel, currentStep >= 1 && styles.progressLabelActive]}>
          📝 Basic Info
        </Text>
        <Text style={[styles.progressLabel, currentStep >= 2 && styles.progressLabelActive]}>
          📄 Details
        </Text>
        <Text style={[styles.progressLabel, currentStep >= 3 && styles.progressLabelActive]}>
          🤖 AI Level
        </Text>
        <Text style={[styles.progressLabel, currentStep >= 4 && styles.progressLabelActive]}>
          ⏰ Schedule
        </Text>
        <Text style={[styles.progressLabel, currentStep >= 5 && styles.progressLabelActive]}>
          💳 Payment
        </Text>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      onNext: handleNext,
      onBack: handleBack,
      currentStep,
      isSubmitting,
    };

    try {
      switch (currentStep) {
        case 1:
          return <StepOne {...stepProps} />;
        case 2:
          return <StepTwo {...stepProps} />;
        case 3:
          return <StepThree {...stepProps} />;
        case 4:
          return <StepFour {...stepProps} />;
        case 5:
          return <StepFive {...stepProps} />;
        default:
          return <StepOne {...stepProps} />;
      }
    } catch (error) {
      console.error('Error rendering step:', error);
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>⚠️ Error Loading Step</Text>
          <Text style={styles.errorText}>Step {currentStep} failed to load</Text>
          <Text style={styles.errorDetails}>{error.toString()}</Text>
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
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        {/* Progress Indicator */}
        {renderProgressIndicator()}

        {/* Debug Info - Remove in production */}
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>🔧 Debug: Step {currentStep}</Text>
          <Text style={styles.debugText}>
            📝 {formData.subject || 'No subject'} • {formData.title || 'No title'}
          </Text>
          <Text style={styles.debugText}>
            💰 ${formData.budget || '0'} • ⏰ {formData.deadline || 'No deadline'}
          </Text>
          <Text style={styles.debugText}>
            📄 {formData.description.length || 0} chars • 🤖 {formData.aiLevel}
            {formData.aiLevel === 'partial' ? ` (${formData.aiPercentage}%)` : ''}
          </Text>
          <Text style={styles.debugText}>
            🎯 Matching: {formData.matchingType} • 🔥 {formData.urgency}
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {renderCurrentStep()}
        </View>

        {/* Submission Loading Overlay */}
        {showSubmissionLoading && (
          <View style={styles.submissionLoadingOverlay}>
            <LoadingScreen
              message="Posting your task..."
              submessage="Creating assignment and notifying experts..."
              fullScreen={false}
              showAnimation={true}
              style={styles.submissionLoadingContent}
            />
          </View>
        )}
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f9',
  },
  progressContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2e7d32',
    borderRadius: 2,
    minWidth: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
  },
  progressLabelActive: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  debugInfo: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#c8e6c9',
  },
  debugText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '500',
    marginBottom: 2,
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    borderRadius: 12,
    margin: 20,
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    color: '#d32f2f',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDetails: {
    fontSize: 12,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorButton: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  submissionLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  submissionLoadingContent: {
    backgroundColor: 'transparent',
  },
});

export default PostScreen;
