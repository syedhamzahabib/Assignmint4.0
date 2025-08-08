import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants';

interface StepFiveProps {
  navigation: any;
  route: any;
}

const StepFive: React.FC<StepFiveProps> = ({ navigation, route }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('visa_1234');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const {
    taskTitle,
    selectedSubject,
    selectedUrgency,
    isForStudent,
    description = '', // Add default value
    selectedTemplate = '', // Add default value
    uploadedFiles = [], // Add default value
    aiRangeMin = 30, // Add default value
    aiRangeMax = 70, // Add default value
    aiTaskExplainer = true, // Add default value
    summaryOnDelivery = true, // Add default value
    budget = '0', // Add default value
    deadline = '', // Add default value
    deadlineTime = '', // Add default value
    matchingPreference = 'auto', // Add default value
  } = route.params;

  // Calculate AI level as average of range
  const aiLevel = Math.round((aiRangeMin + aiRangeMax) / 2);

  const paymentMethods = [
    { id: 'visa_1234', label: 'Visa ****1234', icon: '💳', type: 'Visa' },
    { id: 'mastercard_5678', label: 'Mastercard ****5678', icon: '💳', type: 'Mastercard' },
    { id: 'paypal', label: 'PayPal', icon: '📱', type: 'PayPal' },
  ];

  const handlePostTask = () => {
    if (!agreedToTerms) {
      Alert.alert('Terms Required', 'Please agree to the Terms of Service');
      return;
    }

    // Navigate to confirmation screen
    navigation.navigate('TaskPostedConfirmation', {
      taskTitle,
      budget,
      matchingPreference,
    });
  };

  const getSelectedPaymentMethod = () => {
    return paymentMethods.find(method => method.id === selectedPaymentMethod);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review & Payment</Text>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step 5 of 5</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
        </View>

        {/* Task Summary Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📋</Text>
            <Text style={styles.sectionTitle}>Task Summary</Text>
          </View>

          <View style={styles.summaryContainer}>
            {/* Basic Info */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subject:</Text>
              <Text style={styles.summaryValue}>{selectedSubject}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Title:</Text>
              <Text style={styles.summaryValue}>{taskTitle}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Deadline:</Text>
              <Text style={styles.summaryValue}>
                {deadline} {deadlineTime && `at ${deadlineTime}`}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Budget:</Text>
              <Text style={styles.summaryValue}>${budget}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>AI Level:</Text>
              <Text style={styles.summaryValue}>{aiLevel}%</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Matching:</Text>
              <Text style={styles.summaryValue}>
                {matchingPreference === 'auto' ? 'Auto-Match' : 'Manual Review'}
              </Text>
            </View>

            {/* Template */}
            {selectedTemplate && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Template:</Text>
                <Text style={styles.summaryValue}>{selectedTemplate}</Text>
              </View>
            )}

            {/* Files */}
            {uploadedFiles && uploadedFiles.length > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Files:</Text>
                <Text style={styles.summaryValue}>{uploadedFiles.length} attached</Text>
              </View>
            )}

            {/* AI Features */}
            {(aiTaskExplainer || summaryOnDelivery) && (
              <View style={styles.aiFeaturesContainer}>
                <Text style={styles.aiFeaturesTitle}>AI Features:</Text>
                {aiTaskExplainer && (
                  <Text style={styles.aiFeature}>• AI Task Explainer</Text>
                )}
                {summaryOnDelivery && (
                  <Text style={styles.aiFeature}>• Summary on Delivery</Text>
                )}
              </View>
            )}

            {/* Description Preview */}
            {description && (
              <View style={styles.descriptionPreview}>
                <Text style={styles.descriptionPreviewTitle}>Description Preview:</Text>
                <Text style={styles.descriptionPreviewText}>
                  {description.length > 100 ? `${description.substring(0, 100)}...` : description}
                </Text>
              </View>
            )}

            {/* Template Info */}
            {selectedTemplate && (
              <View style={styles.templateInfo}>
                <Text style={styles.templateInfoTitle}>Template:</Text>
                <Text style={styles.templateInfoText}>{selectedTemplate}</Text>
              </View>
            )}

            {/* Files Info */}
            {uploadedFiles && uploadedFiles.length > 0 && (
              <View style={styles.filesInfo}>
                <Text style={styles.filesInfoTitle}>Attached Files:</Text>
                <Text style={styles.filesInfoText}>{uploadedFiles.length} file(s)</Text>
              </View>
            )}
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Text style={styles.sectionSubtitle}>
            Choose how you'd like to pay
          </Text>

          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodOption,
                  selectedPaymentMethod === method.id && styles.paymentMethodSelected,
                ]}
                onPress={() => setSelectedPaymentMethod(method.id)}
              >
                <View style={styles.paymentMethodContent}>
                  <Text style={styles.paymentMethodIcon}>{method.icon}</Text>
                  <View style={styles.paymentMethodText}>
                    <Text style={styles.paymentMethodLabel}>{method.label}</Text>
                    <Text style={styles.paymentMethodType}>{method.type}</Text>
                  </View>
                </View>
                <View style={[
                  styles.paymentRadio,
                  selectedPaymentMethod === method.id && styles.paymentRadioSelected,
                ]}>
                  {selectedPaymentMethod === method.id && <View style={styles.paymentRadioDot} />}
                </View>
              </TouchableOpacity>
            ))}

            {/* Add New Card Button */}
            <TouchableOpacity
              style={styles.addCardButton}
              onPress={() => Alert.alert('Add Card', 'Add new payment method functionality')}
            >
              <Text style={styles.addCardIcon}>+</Text>
              <Text style={styles.addCardText}>Add New Card</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.section}>
          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.termsCheckbox}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <View style={styles.checkbox}>
                {agreedToTerms && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
              <View style={styles.termsText}>
                <Text style={styles.termsLabel}>
                  I agree to AssignMint's{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Task Budget:</Text>
            <Text style={styles.totalValue}>${budget}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Service Fee:</Text>
            <Text style={styles.totalValue}>${(budget * 0.10).toFixed(2)}</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabelBold}>Total:</Text>
            <Text style={styles.totalValueBold}>${(budget * 1.10).toFixed(2)}</Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoTitle}>What happens next?</Text>
          </View>
          <Text style={styles.infoText}>
            Once you post your task, we'll start matching you with qualified experts. 
            {matchingPreference === 'auto' 
              ? ' You\'ll be automatically matched with the best available expert.'
              : ' You\'ll receive applications from multiple experts to choose from.'
            }
          </Text>
        </View>

        {/* Spacer for bottom button */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Post Task Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.postButton, !agreedToTerms && styles.postButtonDisabled]}
          onPress={handlePostTask}
          disabled={!agreedToTerms}
        >
          <Text style={[styles.postButtonText, !agreedToTerms && styles.postButtonTextDisabled]}>
            Confirm & Post Task (${(budget * 1.10).toFixed(2)})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  stepIndicator: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  stepText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    color: COLORS.white,
  },
  progressContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.gray200,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  summaryContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textSecondary,
    flex: 1,
  },
  summaryValue: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    flex: 2,
    textAlign: 'right',
  },
  aiFeaturesContainer: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  aiFeaturesTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  aiFeature: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  descriptionPreview: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  descriptionPreviewTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  descriptionPreviewText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  paymentMethodsContainer: {
    gap: SPACING.sm,
  },
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  paymentMethodSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.gray100,
  },
  paymentMethodContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  paymentMethodText: {
    flex: 1,
  },
  paymentMethodLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  paymentMethodType: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  paymentRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentRadioSelected: {
    borderColor: COLORS.primary,
  },
  paymentRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  addCardIcon: {
    fontSize: 20,
    color: COLORS.primary,
    marginRight: SPACING.sm,
  },
  addCardText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.primary,
  },
  termsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  termsCheckbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  checkboxCheck: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold,
  },
  termsText: {
    flex: 1,
  },
  termsLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
  },
  totalSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  totalLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  totalValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
  },
  totalDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  totalLabelBold: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  totalValueBold: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  infoSection: {
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  infoTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  infoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  postButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: COLORS.gray300,
  },
  postButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
  postButtonTextDisabled: {
    color: COLORS.textSecondary,
  },
  templateInfo: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  templateInfoTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  templateInfoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  filesInfo: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  filesInfoTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  filesInfoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});

export default StepFive; 