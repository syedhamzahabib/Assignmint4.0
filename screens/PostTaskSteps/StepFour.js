import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const StepFour = ({ formData, updateFormData, onNext, onBack, currentStep }) => {
  const setQuickDeadline = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const deadline = `${date.toDateString()} at 11:59 PM`;
    updateFormData('deadline', deadline);
  };

  const toggleMatchingType = (type) => {
    updateFormData('matchingType', type);
  };

  const setUrgencyLevel = (urgency) => {
    updateFormData('urgency', urgency);
  };

  const getDeadlineButtonStyle = (days) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    const targetDeadline = `${targetDate.toDateString()} at 11:59 PM`;
    
    return formData.deadline === targetDeadline ? styles.selectedDeadlineButton : styles.quickButton;
  };

  const getDeadlineButtonTextStyle = (days) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    const targetDeadline = `${targetDate.toDateString()} at 11:59 PM`;
    
    return formData.deadline === targetDeadline ? styles.selectedDeadlineButtonText : styles.quickButtonText;
  };

  const getUrgencyStyle = (urgencyLevel) => {
    return formData.urgency === urgencyLevel ? styles.selectedUrgencyButton : styles.urgencyButton;
  };

  const getUrgencyTextStyle = (urgencyLevel) => {
    return formData.urgency === urgencyLevel ? styles.selectedUrgencyButtonText : styles.urgencyButtonText;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header - Fixed with better spacing */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Post Task (4/5)</Text>
        
        <View style={styles.headerRight} />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Quick Deadline Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>⏰ Set Deadline</Text>
          <Text style={styles.subtitle}>
            When do you need this task completed?
          </Text>
          
          {formData.deadline && (
            <View style={styles.currentDeadlineContainer}>
              <Text style={styles.currentDeadlineLabel}>Selected:</Text>
              <Text style={styles.currentDeadline}>{formData.deadline}</Text>
            </View>
          )}
          
          <View style={styles.quickButtons}>
            <TouchableOpacity 
              style={getDeadlineButtonStyle(1)}
              onPress={() => setQuickDeadline(1)}
              activeOpacity={0.7}
            >
              <Text style={getDeadlineButtonTextStyle(1)}>📅 Tomorrow</Text>
              <Text style={styles.quickButtonSubtext}>24 hours</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={getDeadlineButtonStyle(3)}
              onPress={() => setQuickDeadline(3)}
              activeOpacity={0.7}
            >
              <Text style={getDeadlineButtonTextStyle(3)}>📅 3 Days</Text>
              <Text style={styles.quickButtonSubtext}>72 hours</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={getDeadlineButtonStyle(7)}
              onPress={() => setQuickDeadline(7)}
              activeOpacity={0.7}
            >
              <Text style={getDeadlineButtonTextStyle(7)}>📅 1 Week</Text>
              <Text style={styles.quickButtonSubtext}>7 days</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.customDeadlineContainer}>
            <TouchableOpacity 
              style={styles.customDeadlineButton}
              onPress={() => {
                Alert.alert(
                  'Custom Deadline',
                  'Custom date picker would open here. For now, using quick options above.',
                  [{ text: 'OK' }]
                );
              }}
            >
              <Text style={styles.customDeadlineText}>📅 Choose Custom Date</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Urgency Level Section - NEW */}
        <View style={styles.section}>
          <Text style={styles.label}>🔥 Priority Level</Text>
          <Text style={styles.subtitle}>
            How urgent is this task? This helps experts understand the importance.
          </Text>
          
          <View style={styles.urgencyContainer}>
            <TouchableOpacity
              style={getUrgencyStyle('high')}
              onPress={() => setUrgencyLevel('high')}
              activeOpacity={0.7}
            >
              <Text style={styles.urgencyIcon}>🔥</Text>
              <View style={styles.urgencyTextContainer}>
                <Text style={getUrgencyTextStyle('high')}>High Priority</Text>
                <Text style={styles.urgencySubtext}>Rush job - urgent deadline</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={getUrgencyStyle('medium')}
              onPress={() => setUrgencyLevel('medium')}
              activeOpacity={0.7}
            >
              <Text style={styles.urgencyIcon}>⚡</Text>
              <View style={styles.urgencyTextContainer}>
                <Text style={getUrgencyTextStyle('medium')}>Medium Priority</Text>
                <Text style={styles.urgencySubtext}>Standard timeline</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={getUrgencyStyle('low')}
              onPress={() => setUrgencyLevel('low')}
              activeOpacity={0.7}
            >
              <Text style={styles.urgencyIcon}>🌱</Text>
              <View style={styles.urgencyTextContainer}>
                <Text style={getUrgencyTextStyle('low')}>Low Priority</Text>
                <Text style={styles.urgencySubtext}>Flexible timeline</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Budget Section */}
        <View style={styles.section}>
          <Text style={styles.label}>💰 Your Budget</Text>
          <Text style={styles.subtitle}>
            How much are you willing to pay for this task?
          </Text>
          
          <View style={styles.budgetContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.budgetInput}
              placeholder="40"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={formData.budget}
              onChangeText={(text) => {
                // Only allow numbers and decimal point
                const cleanText = text.replace(/[^0-9.]/g, '');
                // Prevent multiple decimal points
                const parts = cleanText.split('.');
                if (parts.length > 2) {
                  return;
                }
                updateFormData('budget', cleanText);
              }}
              maxLength={6}
            />
          </View>
          
          <View style={styles.budgetTips}>
            <Text style={styles.budgetTipsTitle}>💡 Budget Tips:</Text>
            <Text style={styles.budgetTipsText}>
              • Most tasks: $15-50{'\n'}
              • Complex projects: $50-200{'\n'}
              • Quick questions: $5-15{'\n'}
              • Rush jobs: +50% premium
            </Text>
          </View>
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
          <Text style={styles.label}>📑 Special Instructions (Optional)</Text>
          <Text style={styles.subtitle}>
            Any specific requirements or formatting preferences?
          </Text>
          
          <TextInput
            style={styles.instructionsInput}
            placeholder="Example: Please show all work step by step, use APA format, include sources..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={formData.specialInstructions}
            onChangeText={(text) => updateFormData('specialInstructions', text)}
            maxLength={500}
          />
          <Text style={styles.charCount}>{formData.specialInstructions.length}/500</Text>
        </View>

        {/* ENHANCED Expert Matching - Manual Match Focus */}
        <View style={styles.section}>
          <Text style={styles.label}>🎯 Expert Matching System</Text>
          <Text style={styles.subtitle}>
            Choose how experts will find and accept your task
          </Text>
          
          <View style={styles.matchingContainer}>
            {/* Manual Match - FEATURED */}
            <TouchableOpacity
              style={[
                styles.matchingOption,
                styles.featuredOption,
                formData.matchingType === 'manual' && styles.selectedMatching,
              ]}
              onPress={() => toggleMatchingType('manual')}
              activeOpacity={0.7}
            >
              <View style={styles.matchingHeader}>
                <Text style={styles.matchingIcon}>🎯</Text>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>RECOMMENDED</Text>
                </View>
              </View>
              <View style={styles.matchingTextContainer}>
                <Text style={[
                  styles.matchingText,
                  formData.matchingType === 'manual' && styles.selectedMatchingText,
                ]}>
                  Manual Match
                </Text>
                <Text style={styles.matchingSubtext}>
                  You choose the best expert
                </Text>
                <Text style={styles.matchingDescription}>
                  • See expert profiles & ratings{'\n'}
                  • Compare multiple applicants{'\n'}
                  • Choose who you trust most{'\n'}
                  • More control over selection
                </Text>
              </View>
            </TouchableOpacity>

            {/* Auto Match - Secondary option */}
            <TouchableOpacity
              style={[
                styles.matchingOption,
                formData.matchingType === 'auto' && styles.selectedMatching,
              ]}
              onPress={() => toggleMatchingType('auto')}
              activeOpacity={0.7}
            >
              <Text style={styles.matchingIcon}>⚡</Text>
              <View style={styles.matchingTextContainer}>
                <Text style={[
                  styles.matchingText,
                  formData.matchingType === 'auto' && styles.selectedMatchingText,
                ]}>
                  Auto-match
                </Text>
                <Text style={styles.matchingSubtext}>
                  Fast & automatic
                </Text>
                <Text style={styles.matchingDescription}>
                  • We assign the best available expert{'\n'}
                  • Faster task assignment{'\n'}
                  • Based on skills & availability{'\n'}
                  • Good for simple tasks
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.matchingExplanation}>
            <Text style={styles.explanationText}>
              {formData.matchingType === 'manual' 
                ? '🎯 Your task will appear on the public feed where experts can view and apply. You\'ll review applications and choose your preferred expert.'
                : '⚡ We\'ll automatically assign the most suitable expert based on their skills, ratings, and availability. Assignment typically happens within 1-2 hours.'
              }
            </Text>
          </View>
        </View>

        {/* Manual Match Additional Info */}
        {formData.matchingType === 'manual' && (
          <View style={styles.section}>
            <View style={styles.manualMatchInfo}>
              <Text style={styles.manualMatchTitle}>📋 What happens with Manual Match?</Text>
              
              <View style={styles.processStep}>
                <Text style={styles.stepNumber}>1</Text>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Task goes live on expert feed</Text>
                  <Text style={styles.stepText}>Experts browse and find your task</Text>
                </View>
              </View>
              
              <View style={styles.processStep}>
                <Text style={styles.stepNumber}>2</Text>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Experts apply to your task</Text>
                  <Text style={styles.stepText}>You'll see their profiles and ratings</Text>
                </View>
              </View>
              
              <View style={styles.processStep}>
                <Text style={styles.stepNumber}>3</Text>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>You choose the best expert</Text>
                  <Text style={styles.stepText}>Select based on experience and reviews</Text>
                </View>
              </View>
              
              <View style={styles.processStep}>
                <Text style={styles.stepNumber}>4</Text>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Expert starts working</Text>
                  <Text style={styles.stepText}>Payment is held securely until completion</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>📋 Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Deadline:</Text>
            <Text style={styles.summaryValue}>{formData.deadline || 'Not set'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Priority:</Text>
            <Text style={styles.summaryValue}>
              {formData.urgency === 'high' ? '🔥 High Priority' : 
               formData.urgency === 'medium' ? '⚡ Medium Priority' : 
               '🌱 Low Priority'}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Budget:</Text>
            <Text style={styles.summaryValue}>${formData.budget || '0'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Matching:</Text>
            <Text style={styles.summaryValue}>
              {formData.matchingType === 'manual' ? '🎯 Manual Match' : '⚡ Auto-match'}
            </Text>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Next Button */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.nextButton,
            (!formData.deadline || !formData.budget) && styles.disabledButton
          ]} 
          onPress={onNext}
          disabled={!formData.deadline || !formData.budget}
        >
          <Text style={styles.nextButtonText}>
            {(!formData.deadline || !formData.budget) 
              ? 'Complete Required Fields' 
              : 'Review & Confirm →'
            }
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f4f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    flex: 1,
  },
  backButtonText: {
    fontSize: 16, 
    color: '#2e7d32', 
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
    flex: 2,
  },
  headerRight: { 
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 18,
  },
  currentDeadlineContainer: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  currentDeadlineLabel: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '600',
    marginBottom: 2,
  },
  currentDeadline: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '500',
  },
  quickButtons: {
    gap: 12,
    marginBottom: 16,
  },
  quickButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  selectedDeadlineButton: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#2e7d32',
    shadowColor: '#2e7d32',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  quickButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 2,
  },
  selectedDeadlineButtonText: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '700',
    marginBottom: 2,
  },
  quickButtonSubtext: {
    fontSize: 12,
    color: '#666',
  },
  customDeadlineContainer: {
    marginTop: 8,
  },
  customDeadlineButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
  },
  customDeadlineText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // NEW - Urgency styles
  urgencyContainer: {
    gap: 12,
  },
  urgencyButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  selectedUrgencyButton: {
    backgroundColor: '#f8fff8',
    borderColor: '#2e7d32',
    shadowColor: '#2e7d32',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  urgencyIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  urgencyTextContainer: {
    flex: 1,
  },
  urgencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  selectedUrgencyButtonText: {
    color: '#2e7d32',
    fontWeight: '700',
  },
  urgencySubtext: {
    fontSize: 12,
    color: '#666',
  },
  
  budgetContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2e7d32',
    marginRight: 8,
  },
  budgetInput: {
    flex: 1,
    padding: 16,
    fontSize: 18,
    color: '#111',
    fontWeight: '600',
  },
  budgetTips: {
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  budgetTipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 6,
  },
  budgetTipsText: {
    fontSize: 12,
    color: '#e65100',
    lineHeight: 16,
  },
  instructionsInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    color: '#111',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
  },
  matchingContainer: {
    gap: 12,
    marginBottom: 12,
  },
  matchingOption: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  featuredOption: {
    borderColor: '#2e7d32',
    backgroundColor: '#f8fff8',
  },
  selectedMatching: {
    borderColor: '#2e7d32',
    backgroundColor: '#f8fff8',
    shadowColor: '#2e7d32',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  matchingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchingIcon: {
    fontSize: 24,
  },
  featuredBadge: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  matchingTextContainer: {
    alignItems: 'flex-start',
  },
  matchingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  selectedMatchingText: {
    color: '#2e7d32',
  },
  matchingSubtext: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  matchingDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  matchingExplanation: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  explanationText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    textAlign: 'center',
  },
  
  // Manual Match Process Info
  manualMatchInfo: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  manualMatchTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: 16,
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196f3',
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 2,
  },
  stepText: {
    fontSize: 12,
    color: '#1976d2',
    lineHeight: 16,
  },
  
  summarySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f4f5f9',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  nextButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#2e7d32',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default StepFour;