import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../../constants';

// Enhanced urgency levels
const URGENCY_LEVELS = [
  { 
    id: 'high', 
    label: '🔥 High Priority', 
    value: 'high',
    description: 'Urgent - Need it ASAP',
    priceImpact: '+20% premium',
    color: COLORS.error
  },
  { 
    id: 'medium', 
    label: '⚡ Medium Priority', 
    value: 'medium',
    description: 'Standard timeline',
    priceImpact: 'Standard pricing',
    color: COLORS.warning
  },
  { 
    id: 'low', 
    label: '🌱 Low Priority', 
    value: 'low',
    description: 'Flexible timeline',
    priceImpact: '-10% discount',
    color: COLORS.success
  },
];

interface StepFourProps {
  formData: {
    deadline: string | null;
    urgency: string;
  };
  updateFormData: (field: string, value: any) => void;
}

const StepFour: React.FC<StepFourProps> = ({ formData, updateFormData }) => {
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [customDate, setCustomDate] = useState('');

  const deadlineOptions = [
    { 
      value: '1_day', 
      label: '1 Day', 
      description: 'Urgent - Need it tomorrow',
      icon: '🚨',
      priceImpact: '+30% premium'
    },
    { 
      value: '2_days', 
      label: '2 Days', 
      description: 'Quick turnaround',
      icon: '⚡',
      priceImpact: '+15% premium'
    },
    { 
      value: '3_days', 
      label: '3 Days', 
      description: 'Standard timeline',
      icon: '📅',
      priceImpact: 'Standard pricing'
    },
    { 
      value: '1_week', 
      label: '1 Week', 
      description: 'Comfortable timeline',
      icon: '📆',
      priceImpact: '-5% discount'
    },
    { 
      value: '2_weeks', 
      label: '2 Weeks', 
      description: 'Extended timeline',
      icon: '📊',
      priceImpact: '-15% discount'
    },
    { 
      value: 'custom', 
      label: 'Custom', 
      description: 'Set your own deadline',
      icon: '🎯',
      priceImpact: 'Variable'
    },
  ];

  const getSelectedDeadline = () => {
    return deadlineOptions.find(option => option.value === formData.deadline);
  };

  const getSelectedUrgency = () => {
    return URGENCY_LEVELS.find(urgency => urgency.value === formData.urgency);
  };

  const handleCustomDateSubmit = () => {
    if (customDate.trim()) {
      updateFormData('deadline', customDate);
      setShowCustomDateModal(false);
      setCustomDate('');
    }
  };

  const formatDeadline = (deadline: string) => {
    if (deadline === 'custom') {
      return formData.deadline === 'custom' ? 'Custom date set' : 'Set custom date';
    }
    return deadline;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
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
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>⏰ Deadline & Urgency</Text>
          <Text style={styles.welcomeText}>
            Set your deadline and urgency level. Faster deadlines and higher urgency may affect pricing.
          </Text>
        </View>

        {/* Deadline Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>📅 Deadline *</Text>
          <Text style={styles.subtitle}>
            Choose when you need the task completed
          </Text>
          
          <View style={styles.deadlineOptions}>
            {deadlineOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.deadlineCard,
                  formData.deadline === option.value && styles.selectedDeadlineCard,
                ]}
                onPress={() => {
                  if (option.value === 'custom') {
                    setShowCustomDateModal(true);
                  } else {
                    updateFormData('deadline', option.value);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.deadlineHeader}>
                  <View style={styles.deadlineLeft}>
                    <Text style={styles.deadlineIcon}>{option.icon}</Text>
                    <View style={styles.deadlineText}>
                      <Text
                        style={[
                          styles.deadlineLabel,
                          formData.deadline === option.value && styles.selectedDeadlineLabel,
                        ]}
                      >
                        {option.label}
                      </Text>
                      <Text
                        style={[
                          styles.deadlineDescription,
                          formData.deadline === option.value && styles.selectedDeadlineDescription,
                        ]}
                      >
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.deadlineRight}>
                    <Text
                      style={[
                        styles.deadlinePrice,
                        formData.deadline === option.value && styles.selectedDeadlinePrice,
                      ]}
                    >
                      {option.priceImpact}
                    </Text>
                    {formData.deadline === option.value && (
                      <Text style={styles.selectedIcon}>✓</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Urgency Level */}
        <View style={styles.section}>
          <Text style={styles.label}>🎯 Urgency Level</Text>
          <Text style={styles.subtitle}>
            Indicate how urgent this task is for you
          </Text>
          
          <View style={styles.urgencyOptions}>
            {URGENCY_LEVELS.map((urgency) => (
              <TouchableOpacity
                key={urgency.id}
                style={[
                  styles.urgencyCard,
                  formData.urgency === urgency.value && styles.selectedUrgencyCard,
                ]}
                onPress={() => updateFormData('urgency', urgency.value)}
                activeOpacity={0.7}
              >
                <View style={styles.urgencyHeader}>
                  <View style={styles.urgencyLeft}>
                    <Text style={styles.urgencyIcon}>{urgency.label.split(' ')[0]}</Text>
                    <View style={styles.urgencyText}>
                      <Text
                        style={[
                          styles.urgencyLabel,
                          formData.urgency === urgency.value && styles.selectedUrgencyLabel,
                        ]}
                      >
                        {urgency.label.split(' ').slice(1).join(' ')}
                      </Text>
                      <Text
                        style={[
                          styles.urgencyDescription,
                          formData.urgency === urgency.value && styles.selectedUrgencyDescription,
                        ]}
                      >
                        {urgency.description}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.urgencyRight}>
                    <Text
                      style={[
                        styles.urgencyPrice,
                        formData.urgency === urgency.value && styles.selectedUrgencyPrice,
                      ]}
                    >
                      {urgency.priceImpact}
                    </Text>
                    {formData.urgency === urgency.value && (
                      <Text style={styles.selectedIcon}>✓</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary */}
        {(formData.deadline || formData.urgency) && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>📋 Your Timeline</Text>
            <View style={styles.summaryCard}>
              {formData.deadline && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Deadline:</Text>
                  <Text style={styles.summaryValue}>
                    {getSelectedDeadline()?.label} ({getSelectedDeadline()?.priceImpact})
                  </Text>
                </View>
              )}
              {formData.urgency && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Urgency:</Text>
                  <Text style={styles.summaryValue}>
                    {getSelectedUrgency()?.label.split(' ').slice(1).join(' ')} ({getSelectedUrgency()?.priceImpact})
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Timeline Tips:</Text>
          <Text style={styles.tipText}>• Shorter deadlines may cost more due to urgency</Text>
          <Text style={styles.tipText}>• Longer timelines often get better pricing</Text>
          <Text style={styles.tipText}>• High urgency tasks are prioritized by experts</Text>
          <Text style={styles.tipText}>• Consider your actual needs vs. budget</Text>
          <Text style={styles.tipText}>• Custom deadlines allow for specific requirements</Text>
        </View>
      </ScrollView>

      {/* Custom Date Modal */}
      <Modal
        visible={showCustomDateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCustomDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Custom Deadline</Text>
              <TouchableOpacity
                onPress={() => setShowCustomDateModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalSubtitle}>
                Enter your custom deadline (e.g., "3 days", "1 week", "Dec 15")
              </Text>
              
              <View style={styles.customDateInput}>
                <Text style={styles.customDateLabel}>Custom Deadline:</Text>
                <Text style={styles.customDateValue}>
                  {customDate || 'Enter deadline...'}
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCustomDateSubmit}
              >
                <Text style={styles.submitButtonText}>Set Deadline</Text>
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
  deadlineOptions: {
    gap: 12,
  },
  deadlineCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  selectedDeadlineCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightGray,
  },
  deadlineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deadlineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deadlineIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  deadlineText: {
    flex: 1,
  },
  deadlineLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  selectedDeadlineLabel: {
    color: COLORS.primary,
  },
  deadlineDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  selectedDeadlineDescription: {
    color: COLORS.primary,
  },
  deadlineRight: {
    alignItems: 'flex-end',
  },
  deadlinePrice: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  selectedDeadlinePrice: {
    color: COLORS.primary,
  },
  urgencyOptions: {
    gap: 12,
  },
  urgencyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  selectedUrgencyCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightGray,
  },
  urgencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  urgencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  urgencyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  urgencyText: {
    flex: 1,
  },
  urgencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  selectedUrgencyLabel: {
    color: COLORS.primary,
  },
  urgencyDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  selectedUrgencyDescription: {
    color: COLORS.primary,
  },
  urgencyRight: {
    alignItems: 'flex-end',
  },
  urgencyPrice: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  selectedUrgencyPrice: {
    color: COLORS.primary,
  },
  selectedIcon: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  summarySection: {
    marginBottom: 25,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  tipsSection: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
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
  customDateInput: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 20,
  },
  customDateLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  customDateValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  submitButtonText: {
    fontSize: 16,
    color: COLORS.surface,
    fontWeight: '600',
  },
});

export default StepFour; 