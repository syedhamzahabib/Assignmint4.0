import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { COLORS } from '../../constants';

// Enhanced payment methods
const PAYMENT_METHODS = [
  {
    id: 'credit_card',
    label: '💳 Credit Card',
    value: 'credit_card',
    description: 'Visa, Mastercard, American Express',
    icon: '💳',
  },
  {
    id: 'debit_card',
    label: '💳 Debit Card',
    value: 'debit_card',
    description: 'Direct bank account payment',
    icon: '💳',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    value: 'paypal',
    description: 'PayPal account or guest checkout',
    icon: 'PayPal',
  },
  {
    id: 'apple_pay',
    label: 'Apple Pay',
    value: 'apple_pay',
    description: 'Quick and secure Apple Pay',
    icon: '🍎',
  },
  {
    id: 'google_pay',
    label: 'Google Pay',
    value: 'google_pay',
    description: 'Fast Google Pay checkout',
    icon: 'G',
  },
];

interface StepFiveProps {
  formData: {
    subject: string;
    title: string;
    description: string;
    specialInstructions: string;
    aiLevel: string;
    aiPercentage: number;
    deadline: string | null;
    urgency: string;
    budget: string;
    paymentMethod: string | null;
  };
  updateFormData: (field: string, value: any) => void;
  onSubmit: () => void;
}

const StepFive: React.FC<StepFiveProps> = ({ formData, updateFormData, onSubmit }) => {
  const [showCustomBudgetModal, setShowCustomBudgetModal] = useState(false);
  const [customBudget, setCustomBudget] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);

  const budgetSuggestions = [
    {
      value: '$25',
      label: 'Basic',
      description: 'Simple tasks, quick turnaround',
      icon: '💰',
      features: ['Basic quality', 'Standard delivery', 'Simple tasks'],
    },
    {
      value: '$50',
      label: 'Standard',
      description: 'Most common tasks',
      icon: '💵',
      features: ['Good quality', 'Reliable delivery', 'Most task types'],
    },
    {
      value: '$100',
      label: 'Premium',
      description: 'Complex tasks, high quality',
      icon: '💎',
      features: ['High quality', 'Fast delivery', 'Complex tasks'],
    },
    {
      value: '$150',
      label: 'Expert',
      description: 'Specialized work, top experts',
      icon: '👑',
      features: ['Expert quality', 'Priority delivery', 'Specialized work'],
    },
    {
      value: 'custom',
      label: 'Custom',
      description: 'Set your own budget',
      icon: '🎯',
      features: ['Flexible pricing', 'Custom requirements', 'Negotiable'],
    },
  ];

  const calculateEstimatedPrice = () => {
    let basePrice = 50; // Standard price

    // Adjust based on AI level
    switch (formData.aiLevel) {
      case 'none': basePrice *= 1.0; break;
      case 'assisted': basePrice *= 0.9; break;
      case 'enhanced': basePrice *= 0.8; break;
      case 'ai_heavy': basePrice *= 0.7; break;
    }

    // Adjust based on urgency
    switch (formData.urgency) {
      case 'high': basePrice *= 1.2; break;
      case 'medium': basePrice *= 1.0; break;
      case 'low': basePrice *= 0.9; break;
    }

    // Adjust based on deadline
    if (formData.deadline === '1_day') {basePrice *= 1.3;}
    else if (formData.deadline === '2_days') {basePrice *= 1.15;}
    else if (formData.deadline === '1_week') {basePrice *= 0.95;}
    else if (formData.deadline === '2_weeks') {basePrice *= 0.85;}

    return Math.round(basePrice);
  };

  const handleCustomBudgetSubmit = () => {
    if (customBudget.trim()) {
      const amount = customBudget.replace(/[^0-9]/g, '');
      if (parseInt(amount) >= 10) {
        updateFormData('budget', `$${amount}`);
        setShowCustomBudgetModal(false);
        setCustomBudget('');
      } else {
        Alert.alert('Invalid Amount', 'Please enter an amount of $10 or more.');
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.budget || formData.budget.trim() === '') {
      Alert.alert('Required Field', 'Please set a budget for your task.');
      return;
    }

    if (!formData.paymentMethod) {
      Alert.alert('Required Field', 'Please select a payment method.');
      return;
    }

    setShowReviewModal(true);
  };

  const confirmSubmit = () => {
    setShowReviewModal(false);
    onSubmit();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Post Task (5/5)</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>💰 Budget & Review</Text>
          <Text style={styles.welcomeText}>
            Set your budget, choose payment method, and review your task before posting.
          </Text>
        </View>

        {/* Budget Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>💰 Budget *</Text>
          <Text style={styles.subtitle}>
            Choose your budget range or set a custom amount
          </Text>

          <View style={styles.budgetOptions}>
            {budgetSuggestions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.budgetCard,
                  formData.budget === option.value && styles.selectedBudgetCard,
                ]}
                onPress={() => {
                  if (option.value === 'custom') {
                    setShowCustomBudgetModal(true);
                  } else {
                    updateFormData('budget', option.value);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.budgetHeader}>
                  <View style={styles.budgetLeft}>
                    <Text style={styles.budgetIcon}>{option.icon}</Text>
                    <View style={styles.budgetText}>
                      <Text
                        style={[
                          styles.budgetAmount,
                          formData.budget === option.value && styles.selectedBudgetAmount,
                        ]}
                      >
                        {option.value}
                      </Text>
                      <Text
                        style={[
                          styles.budgetLabel,
                          formData.budget === option.value && styles.selectedBudgetLabel,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </View>
                  {formData.budget === option.value && (
                    <Text style={styles.selectedIcon}>✓</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.budgetDescription,
                    formData.budget === option.value && styles.selectedBudgetDescription,
                  ]}
                >
                  {option.description}
                </Text>
                <View style={styles.budgetFeatures}>
                  {option.features.map((feature, index) => (
                    <Text key={index} style={styles.budgetFeature}>• {feature}</Text>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Estimate */}
          <View style={styles.priceEstimateSection}>
            <Text style={styles.priceEstimateTitle}>💡 Estimated Price</Text>
            <Text style={styles.priceEstimateValue}>${calculateEstimatedPrice()}</Text>
            <Text style={styles.priceEstimateNote}>
              Based on your selections (AI level, urgency, deadline)
            </Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.label}>💳 Payment Method *</Text>
          <Text style={styles.subtitle}>
            Select your preferred payment method
          </Text>

          <View style={styles.paymentOptions}>
            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentCard,
                  formData.paymentMethod === method.value && styles.selectedPaymentCard,
                ]}
                onPress={() => updateFormData('paymentMethod', method.value)}
                activeOpacity={0.7}
              >
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentLeft}>
                    <Text style={styles.paymentIcon}>{method.icon}</Text>
                    <View style={styles.paymentText}>
                      <Text
                        style={[
                          styles.paymentLabel,
                          formData.paymentMethod === method.value && styles.selectedPaymentLabel,
                        ]}
                      >
                        {method.label}
                      </Text>
                      <Text
                        style={[
                          styles.paymentDescription,
                          formData.paymentMethod === method.value && styles.selectedPaymentDescription,
                        ]}
                      >
                        {method.description}
                      </Text>
                    </View>
                  </View>
                  {formData.paymentMethod === method.value && (
                    <Text style={styles.selectedIcon}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Review & Post Task</Text>
          </TouchableOpacity>
          <Text style={styles.submitNote}>
            You'll be able to review all details before confirming
          </Text>
        </View>
      </ScrollView>

      {/* Custom Budget Modal */}
      <Modal
        visible={showCustomBudgetModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCustomBudgetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Custom Budget</Text>
              <TouchableOpacity
                onPress={() => setShowCustomBudgetModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalSubtitle}>
                Enter your custom budget amount (minimum $10)
              </Text>

              <View style={styles.customBudgetInput}>
                <Text style={styles.customBudgetLabel}>Budget Amount:</Text>
                <TextInput
                  style={styles.customBudgetTextInput}
                  value={customBudget}
                  onChangeText={setCustomBudget}
                  placeholder="$50"
                  placeholderTextColor={COLORS.textSecondary}
                  keyboardType="numeric"
                  autoFocus
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCustomBudgetSubmit}
              >
                <Text style={styles.submitButtonText}>Set Budget</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Review Modal */}
      <Modal
        visible={showReviewModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.reviewModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Review Your Task</Text>
              <TouchableOpacity
                onPress={() => setShowReviewModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.reviewContent}>
              <View style={styles.reviewSection}>
                <Text style={styles.reviewSectionTitle}>📝 Task Details</Text>
                <Text style={styles.reviewField}>Subject: {formData.subject}</Text>
                <Text style={styles.reviewField}>Title: {formData.title}</Text>
                <Text style={styles.reviewField}>Description: {formData.description.substring(0, 100)}...</Text>
              </View>

              <View style={styles.reviewSection}>
                <Text style={styles.reviewSectionTitle}>🤖 AI Settings</Text>
                <Text style={styles.reviewField}>AI Level: {formData.aiLevel}</Text>
                {formData.aiLevel !== 'none' && (
                  <Text style={styles.reviewField}>AI Percentage: {formData.aiPercentage}%</Text>
                )}
              </View>

              <View style={styles.reviewSection}>
                <Text style={styles.reviewSectionTitle}>⏰ Timeline</Text>
                <Text style={styles.reviewField}>Deadline: {formData.deadline}</Text>
                <Text style={styles.reviewField}>Urgency: {formData.urgency}</Text>
              </View>

              <View style={styles.reviewSection}>
                <Text style={styles.reviewSectionTitle}>💰 Payment</Text>
                <Text style={styles.reviewField}>Budget: {formData.budget}</Text>
                <Text style={styles.reviewField}>Payment: {formData.paymentMethod}</Text>
              </View>
            </ScrollView>

            <View style={styles.reviewActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowReviewModal(false)}
              >
                <Text style={styles.cancelButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmSubmit}
              >
                <Text style={styles.confirmButtonText}>Post Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  budgetOptions: {
    gap: 12,
  },
  budgetCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  selectedBudgetCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightGray,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  budgetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  budgetIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  budgetText: {
    flex: 1,
  },
  budgetAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  selectedBudgetAmount: {
    color: COLORS.primary,
  },
  budgetLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectedBudgetLabel: {
    color: COLORS.primary,
  },
  budgetDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  selectedBudgetDescription: {
    color: COLORS.primary,
  },
  budgetFeatures: {
    marginTop: 8,
  },
  budgetFeature: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  priceEstimateSection: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  priceEstimateTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  priceEstimateValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  priceEstimateNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  paymentOptions: {
    gap: 12,
  },
  paymentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  selectedPaymentCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightGray,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentText: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  selectedPaymentLabel: {
    color: COLORS.primary,
  },
  paymentDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  selectedPaymentDescription: {
    color: COLORS.primary,
  },
  selectedIcon: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  submitSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    color: COLORS.surface,
    fontWeight: '600',
  },
  submitNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  reviewModalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  modalBody: {
    alignItems: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  customBudgetInput: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 20,
  },
  customBudgetLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  customBudgetTextInput: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '500',
  },
  reviewContent: {
    padding: 20,
  },
  reviewSection: {
    marginBottom: 20,
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  reviewField: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  reviewActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    color: COLORS.surface,
    fontWeight: '600',
  },
});

export default StepFive;
