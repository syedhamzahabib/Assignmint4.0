import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants';

const subjects = [
  { id: 'math', label: 'Math', value: 'Math' },
  { id: 'coding', label: 'Coding', value: 'Coding' },
  { id: 'writing', label: 'Writing', value: 'Writing' },
  { id: 'design', label: 'Design', value: 'Design' },
  { id: 'language', label: 'Language', value: 'Language' },
  { id: 'science', label: 'Science', value: 'Science' },
  { id: 'business', label: 'Business', value: 'Business' },
  { id: 'chemistry', label: 'Chemistry', value: 'Chemistry' },
  { id: 'physics', label: 'Physics', value: 'Physics' },
  { id: 'psychology', label: 'Psychology', value: 'Psychology' },
  { id: 'history', label: 'History', value: 'History' },
  { id: 'other', label: 'Other', value: 'Other' },
];

const urgencyLevels = [
  { id: 'low', label: 'Low Priority', value: 'low', description: 'Due in 1+ weeks', color: COLORS.success },
  { id: 'medium', label: 'Medium Priority', value: 'medium', description: 'Due in 3-7 days', color: COLORS.warning },
  { id: 'high', label: 'High Priority', value: 'high', description: 'Due in 1-3 days', color: COLORS.error },
];

const aiLevels = [
  { id: 'none', label: 'No AI', value: 'none', description: 'Traditional human work', icon: 'user' },
  { id: 'assisted', label: 'AI Assisted', value: 'assisted', description: 'AI helps with research and drafting', icon: 'ai' },
  { id: 'enhanced', label: 'AI Enhanced', value: 'enhanced', description: 'AI generates content with human review', icon: 'brain' },
  { id: 'ai_heavy', label: 'AI Heavy', value: 'ai_heavy', description: 'Primarily AI with human oversight', icon: 'chip' },
];

const PostScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    budget: '',
    urgency: '',
    dueDate: '',
    estimatedHours: '',
    aiLevel: 'none',
    isPublic: true,
    tags: '',
    attachments: [],
  });

  const updateFormData = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep === 1 && !formData.subject) {
      Alert.alert('Error', 'Please select a subject');
      return;
    }
    if (currentStep === 2 && (!formData.title || !formData.description)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (currentStep === 3 && (!formData.budget || !formData.urgency)) {
      Alert.alert('Error', 'Please set budget and urgency level');
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, formData]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(() => {
    Alert.alert(
      'Post Task',
      'Are you sure you want to post this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Post Task',
          onPress: () => {
            Alert.alert(
              'Success!',
              'Your task has been posted successfully. Other users will be able to see and accept it.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // Reset form and go back to home
                    setFormData({
                      title: '',
                      description: '',
                      subject: '',
                      budget: '',
                      urgency: '',
                      dueDate: '',
                      estimatedHours: '',
                      aiLevel: 'none',
                      isPublic: true,
                      tags: '',
                      attachments: [],
                    });
                    setCurrentStep(1);
                    navigation.navigate('home');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  }, [navigation]);

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepIndicatorContainer}>
        {[1, 2, 3, 4].map(step => (
          <View key={step} style={styles.stepContainer}>
            <View style={[
              styles.stepCircle,
              step <= currentStep ? styles.activeStepCircle : styles.inactiveStepCircle,
            ]}>
              <Text style={[
                styles.stepNumber,
                step <= currentStep ? styles.activeStepNumber : styles.inactiveStepNumber,
              ]}>
                {step}
              </Text>
            </View>
            {step < 4 && (
              <View style={[
                styles.stepLine,
                step < currentStep ? styles.activeStepLine : styles.inactiveStepLine,
              ]} />
            )}
          </View>
        ))}
      </View>
      <Text style={styles.stepIndicatorText}>
        Step {currentStep} of 4
      </Text>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Choose Subject & Category</Text>
        <Text style={styles.stepSubtitle}>Select the subject area for your task</Text>
      </View>

      <View style={styles.subjectsGrid}>
        {subjects.map(subject => (
          <TouchableOpacity
            key={subject.id}
            style={[
              styles.subjectCard,
              formData.subject === subject.value && styles.selectedSubjectCard,
            ]}
            onPress={() => updateFormData('subject', subject.value)}
          >
            <Text style={styles.subjectIcon}>{subject.label.split(' ')[0]}</Text>
            <Text style={[
              styles.subjectLabel,
              formData.subject === subject.value && styles.selectedSubjectLabel,
            ]}>
              {subject.label.split(' ').slice(1).join(' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Task Details</Text>
        <Text style={styles.stepSubtitle}>Describe what you need help with</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Task Title *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Calculus Assignment Help"
          value={formData.title}
          onChangeText={(text) => updateFormData('title', text)}
          maxLength={100}
        />
        <Text style={styles.characterCount}>{formData.title.length}/100</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Description *</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="Describe your task in detail. Be specific about requirements, expectations, and any special instructions..."
          value={formData.description}
          onChangeText={(text) => updateFormData('description', text)}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
        <Text style={styles.characterCount}>{formData.description.length}/500</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Tags (optional)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., calculus, derivatives, integrals"
          value={formData.tags}
          onChangeText={(text) => updateFormData('tags', text)}
        />
        <Text style={styles.inputHint}>Separate tags with commas to help others find your task</Text>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Budget & Timeline</Text>
        <Text style={styles.stepSubtitle}>Set your budget and urgency level</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Budget (USD) *</Text>
        <View style={styles.budgetInput}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.budgetTextInput}
            placeholder="50"
            value={formData.budget}
            onChangeText={(text) => updateFormData('budget', text)}
            keyboardType="numeric"
          />
        </View>
        <Text style={styles.inputHint}>Set a fair budget to attract quality work</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Urgency Level *</Text>
        <View style={styles.urgencyOptions}>
          {urgencyLevels.map(urgency => (
            <TouchableOpacity
              key={urgency.id}
              style={[
                styles.urgencyCard,
                formData.urgency === urgency.value && styles.selectedUrgencyCard,
              ]}
              onPress={() => updateFormData('urgency', urgency.value)}
            >
              <View style={styles.urgencyHeader}>
                <Text style={styles.urgencyIcon}>{urgency.label.split(' ')[0]}</Text>
                <Text style={[
                  styles.urgencyLabel,
                  formData.urgency === urgency.value && styles.selectedUrgencyLabel,
                ]}>
                  {urgency.label.split(' ').slice(1).join(' ')}
                </Text>
              </View>
              <Text style={[
                styles.urgencyDescription,
                formData.urgency === urgency.value && styles.selectedUrgencyDescription,
              ]}>
                {urgency.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Estimated Hours</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., 3"
          value={formData.estimatedHours}
          onChangeText={(text) => updateFormData('estimatedHours', text)}
          keyboardType="numeric"
        />
        <Text style={styles.inputHint}>Optional: Help others understand the scope</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Due Date</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., 2025-01-25"
          value={formData.dueDate}
          onChangeText={(text) => updateFormData('dueDate', text)}
        />
        <Text style={styles.inputHint}>Optional: Set a deadline for completion</Text>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>AI Level & Privacy</Text>
        <Text style={styles.stepSubtitle}>Configure AI assistance and privacy settings</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>AI Assistance Level</Text>
        <View style={styles.aiLevelOptions}>
          {aiLevels.map(aiLevel => (
            <TouchableOpacity
              key={aiLevel.id}
              style={[
                styles.aiLevelCard,
                formData.aiLevel === aiLevel.value && styles.selectedAiLevelCard,
              ]}
              onPress={() => updateFormData('aiLevel', aiLevel.value)}
            >
              <View style={styles.aiLevelHeader}>
                <Text style={styles.aiLevelIcon}>{aiLevel.icon}</Text>
                <Text style={[
                  styles.aiLevelLabel,
                  formData.aiLevel === aiLevel.value && styles.selectedAiLevelLabel,
                ]}>
                  {aiLevel.label}
                </Text>
              </View>
              <Text style={[
                styles.aiLevelDescription,
                formData.aiLevel === aiLevel.value && styles.selectedAiLevelDescription,
              ]}>
                {aiLevel.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.switchContainer}>
          <Text style={styles.inputLabel}>Make Task Public</Text>
          <Switch
            value={formData.isPublic}
            onValueChange={(value) => updateFormData('isPublic', value)}
            trackColor={{ false: COLORS.gray200, true: COLORS.primary + '40' }}
            thumbColor={formData.isPublic ? COLORS.primary : COLORS.gray400}
          />
        </View>
        <Text style={styles.inputHint}>
          Public tasks are visible to all users. Private tasks are only visible to invited users.
        </Text>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Task Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Subject</Text>
            <Text style={styles.summaryValue}>{formData.subject || 'Not set'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Budget</Text>
            <Text style={styles.summaryValue}>{formData.budget ? `$${formData.budget}` : 'Not set'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Urgency</Text>
            <Text style={styles.summaryValue}>
              {urgencyLevels.find(u => u.value === formData.urgency)?.label || 'Not set'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>AI Level</Text>
            <Text style={styles.summaryValue}>
              {aiLevels.find(a => a.value === formData.aiLevel)?.label || 'No AI'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post New Task</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {renderCurrentStep()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={prevStep}
          >
            <Text style={styles.secondaryButtonText}>Previous</Text>
          </TouchableOpacity>
        )}

        {currentStep < 4 ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={nextStep}
          >
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSubmit}
          >
            <Text style={styles.primaryButtonText}>Post Task</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  placeholder: {
    width: 50,
  },
  stepIndicator: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStepCircle: {
    backgroundColor: COLORS.primary,
  },
  inactiveStepCircle: {
    backgroundColor: COLORS.gray200,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeStepNumber: {
    color: COLORS.white,
  },
  inactiveStepNumber: {
    color: COLORS.textSecondary,
  },
  stepLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  activeStepLine: {
    backgroundColor: COLORS.primary,
  },
  inactiveStepLine: {
    backgroundColor: COLORS.gray200,
  },
  stepIndicatorText: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subjectCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gray200,
  },
  selectedSubjectCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  subjectIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  subjectLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  selectedSubjectLabel: {
    color: COLORS.primary,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  textArea: {
    height: 120,
  },
  characterCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
  inputHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  budgetInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  currencySymbol: {
    fontSize: 18,
    color: COLORS.text,
    paddingHorizontal: 16,
    fontWeight: '600',
  },
  budgetTextInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  urgencyOptions: {
    gap: 12,
  },
  urgencyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.gray200,
  },
  selectedUrgencyCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  urgencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  urgencyIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  urgencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectedUrgencyLabel: {
    color: COLORS.primary,
  },
  urgencyDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  selectedUrgencyDescription: {
    color: COLORS.primary + '80',
  },
  aiLevelOptions: {
    gap: 12,
  },
  aiLevelCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.gray200,
  },
  selectedAiLevelCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  aiLevelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiLevelIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  aiLevelLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectedAiLevelLabel: {
    color: COLORS.primary,
  },
  aiLevelDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  selectedAiLevelDescription: {
    color: COLORS.primary + '80',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  summaryItem: {
    width: '50%',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  navigationButtons: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.gray200,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PostScreen;
