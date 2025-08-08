import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

const StepFive = ({ formData, updateFormData, onNext, onBack, currentStep }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Mock payment methods - you can make this dynamic later
  const paymentMethods = [
    { id: '1', name: 'Visa •••• 4242', icon: '💳' },
    { id: '2', name: 'Mastercard •••• 8888', icon: '💳' },
    { id: '3', name: 'PayPal', icon: '🅿️' },
  ];

  const formatAILevel = () => {
    switch (formData.aiLevel) {
      case 'none':
        return 'No AI (Human only)';
      case 'partial':
        return `Partial AI (${formData.aiPercentage}%)`;
      case 'full':
        return 'Full AI (100%)';
      default:
        return 'No AI';
    }
  };

  const formatUrgency = () => {
    switch (formData.urgency) {
      case 'high':
        return '🔥 High Priority';
      case 'medium':
        return '⚡ Medium Priority';
      case 'low':
        return '🌱 Low Priority';
      default:
        return '⚡ Medium Priority';
    }
  };

  const formatMatchingType = () => {
    return formData.matchingType === 'manual' 
      ? '🎯 Manual Match (You choose expert)'
      : '⚡ Auto-match (We assign expert)';
  };

  const calculateTotal = () => {
    const budget = parseFloat(formData.budget) || 0;
    const serviceFee = budget * 0.05; // 5% service fee
    return {
      budget,
      serviceFee,
      total: budget + serviceFee,
    };
  };

  const { budget, serviceFee, total } = calculateTotal();

  const selectPaymentMethod = (method) => {
    if (selectedPayment?.id === method.id) {
      setSelectedPayment(null);
      updateFormData('paymentMethod', null);
    } else {
      setSelectedPayment(method);
      updateFormData('paymentMethod', method);
    }
  };

  const handleConfirm = () => {
    if (!selectedPayment) {
      Alert.alert('Payment Required', 'Please select a payment method');
      return;
    }
    onNext();
  };

  // Create a simple navigation object for wallet access
  const navigation = {
    navigate: (screenName, params = {}) => {
      if (screenName === 'Wallet') {
        Alert.alert(
          '💰 Wallet Integration',
          'This would open the wallet screen to add payment methods.\n\nFor now, this is a demo - you can select from the mock payment methods above.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm & Post Task</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Task Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>📋 Task Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subject:</Text>
            <Text style={styles.summaryValue}>{formData.subject}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Title:</Text>
            <Text style={styles.summaryValue}>{formData.title}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Due:</Text>
            <Text style={styles.summaryValue}>{formData.deadline}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Priority:</Text>
            <Text style={styles.summaryValue}>{formatUrgency()}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>AI Level:</Text>
            <Text style={styles.summaryValue}>{formatAILevel()}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.cardTitle}>🖊️ Description</Text>
          <Text style={styles.descriptionText}>{formData.description}</Text>
          
          {formData.specialInstructions && (
            <>
              <Text style={styles.instructionsLabel}>Special Instructions:</Text>
              <Text style={styles.instructionsText}>{formData.specialInstructions}</Text>
            </>
          )}
        </View>

        {/* ENHANCED Manual Match Information */}
        <View style={styles.matchingCard}>
          <Text style={styles.cardTitle}>🎯 Expert Matching</Text>
          
          <View style={styles.matchingTypeContainer}>
            <Text style={styles.matchingType}>{formatMatchingType()}</Text>
            {formData.matchingType === 'manual' && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>RECOMMENDED</Text>
              </View>
            )}
          </View>
          
          {formData.matchingType === 'manual' ? (
            <View style={styles.manualMatchDetails}>
              <Text style={styles.detailsTitle}>📈 What happens next:</Text>
              <View style={styles.detailsStep}>
                <Text style={styles.stepIcon}>🌐</Text>
                <Text style={styles.stepText}>Your task goes live on the expert marketplace</Text>
              </View>
              <View style={styles.detailsStep}>
                <Text style={styles.stepIcon}>👥</Text>
                <Text style={styles.stepText}>Qualified experts will view and apply to your task</Text>
              </View>
              <View style={styles.detailsStep}>
                <Text style={styles.stepIcon}>⭐</Text>
                <Text style={styles.stepText}>You review expert profiles and choose the best one</Text>
              </View>
              <View style={styles.detailsStep}>
                <Text style={styles.stepIcon}>🚀</Text>
                <Text style={styles.stepText}>Selected expert starts working on your task</Text>
              </View>
              
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>✨ Benefits of Manual Match:</Text>
                <Text style={styles.benefitsText}>
                  • See expert ratings & reviews{'\n'}
                  • Compare multiple candidates{'\n'}
                  • Choose based on expertise{'\n'}
                  • More control over selection
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.autoMatchDetails}>
              <Text style={styles.detailsTitle}>⚡ Auto-match process:</Text>
              <Text style={styles.autoMatchText}>
                We'll automatically assign the most qualified expert based on their skills, 
                availability, and past performance. Assignment typically happens within 1-2 hours.
              </Text>
            </View>
          )}
        </View>

        {/* Additional Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>📄 Additional Details</Text>
          
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>📎 Files:</Text>
            <Text style={styles.detailValue}>
              {formData.files?.length > 0 ? `${formData.files.length} files attached` : 'None'}
            </Text>
          </View>
          
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>🖼️ Images:</Text>
            <Text style={styles.detailValue}>
              {formData.images?.length > 0 ? `${formData.images.length} images attached` : 'None'}
            </Text>
          </View>
          
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>⏱️ Estimated Time:</Text>
            <Text style={styles.detailValue}>
              {formData.estimatedHours ? `${formData.estimatedHours} hours` : 'Not specified'}
            </Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentCard}>
          <Text style={styles.cardTitle}>💳 Payment Method</Text>
          <Text style={styles.paymentSubtitle}>Select one (tap to change)</Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption,
                selectedPayment?.id === method.id && styles.selectedPayment
              ]}
              onPress={() => selectPaymentMethod(method)}
            >
              <Text style={styles.paymentIcon}>{method.icon}</Text>
              <Text style={styles.paymentName}>{method.name}</Text>
              {selectedPayment?.id === method.id && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}

          {/* WALLET INTEGRATION - No Payment Methods Fallback */}
          {paymentMethods.length === 0 && (
            <View style={styles.noPaymentMethodsCard}>
              <Text style={styles.noPaymentIcon}>💳</Text>
              <Text style={styles.noPaymentTitle}>No Payment Methods</Text>
              <Text style={styles.noPaymentText}>
                Add a payment method to your wallet to complete task posting
              </Text>
              <TouchableOpacity 
                style={styles.addWalletButton}
                onPress={() => navigation.navigate('Wallet', { 
                  fromPostTask: true,
                  action: 'addPayment' 
                })}
              >
                <Text style={styles.addWalletButtonText}>Add Payment Wallet →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Cost Breakdown */}
        <View style={styles.costCard}>
          <Text style={styles.cardTitle}>💰 Cost Breakdown</Text>
          
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Task Budget</Text>
            <Text style={styles.costValue}>${budget.toFixed(2)}</Text>
          </View>
          
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Service Fee (5%)</Text>
            <Text style={styles.costValue}>${serviceFee.toFixed(2)}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Escrow Notice */}
        <View style={styles.escrowNotice}>
          <Text style={styles.escrowIcon}>🔒</Text>
          <Text style={styles.escrowText}>
            Your funds are held securely and only released when the task is completed
          </Text>
        </View>

        {/* Final Manual Match Promise */}
        {formData.matchingType === 'manual' && (
          <View style={styles.finalPromise}>
            <Text style={styles.promiseIcon}>🎯</Text>
            <Text style={styles.promiseTitle}>Manual Match Promise</Text>
            <Text style={styles.promiseText}>
              You'll have full control over expert selection. Review profiles, 
              ratings, and choose the expert you trust most for your task.
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.confirmButton,
            !selectedPayment && styles.disabledButton
          ]} 
          onPress={handleConfirm}
          disabled={!selectedPayment}
        >
          <Text style={styles.confirmButtonText}>
            {formData.matchingType === 'manual' 
              ? `🎯 Post to Expert Feed (${total.toFixed(2)})`
              : `⚡ Confirm & Auto-Assign (${total.toFixed(2)})`
            }
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f5f9' },
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
  backButton: { fontSize: 16, color: '#2e7d32', fontWeight: '500' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111' },
  headerRight: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 100 },
  bottomSpacer: { height: 20 },
  
  // Card styles
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 12 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 14, color: '#666', flex: 1 },
  summaryValue: {
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  
  // Description card
  descriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  descriptionText: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 8 },
  instructionsLabel: { fontSize: 14, fontWeight: '600', color: '#666', marginTop: 8, marginBottom: 4 },
  instructionsText: { fontSize: 14, color: '#333', fontStyle: 'italic' },
  
  // ENHANCED Matching card styles
  matchingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#2e7d32',
    shadowColor: '#2e7d32',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  matchingTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  matchingType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e7d32',
  },
  recommendedBadge: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  
  // Manual match details
  manualMatchDetails: {
    backgroundColor: '#f8fff8',
    borderRadius: 8,
    padding: 12,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 12,
  },
  detailsStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  stepText: {
    fontSize: 13,
    color: '#2e7d32',
    flex: 1,
    lineHeight: 18,
  },
  benefitsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e8f5e8',
  },
  benefitsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 6,
  },
  benefitsText: {
    fontSize: 12,
    color: '#2e7d32',
    lineHeight: 16,
  },
  
  // Auto match details
  autoMatchDetails: {
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
    padding: 12,
  },
  autoMatchText: {
    fontSize: 13,
    color: '#1976d2',
    lineHeight: 18,
  },
  
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  detailSection: { marginBottom: 12 },
  detailLabel: { fontSize: 14, color: '#666', marginBottom: 4 },
  detailValue: { fontSize: 15, color: '#111', fontWeight: '500' },
  
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  paymentSubtitle: { fontSize: 12, color: '#666', marginBottom: 12, fontStyle: 'italic' },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    marginBottom: 8,
  },
  selectedPayment: {
    borderColor: '#2e7d32',
    backgroundColor: '#f8fff8',
  },
  paymentIcon: { fontSize: 20, marginRight: 12 },
  paymentName: { fontSize: 16, color: '#333', flex: 1 },
  checkmark: { fontSize: 18, color: '#2e7d32', fontWeight: 'bold' },

  // NEW WALLET INTEGRATION STYLES
  noPaymentMethodsCard: {
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff9800',
    borderStyle: 'dashed',
    marginTop: 16,
  },
  noPaymentIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  noPaymentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e65100',
    marginBottom: 8,
    textAlign: 'center',
  },
  noPaymentText: {
    fontSize: 14,
    color: '#e65100',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  addWalletButton: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#ff9800',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  addWalletButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  costCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  costLabel: { fontSize: 14, color: '#666' },
  costValue: { fontSize: 14, color: '#111', fontWeight: '500' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  totalLabel: { fontSize: 16, color: '#111', fontWeight: '700' },
  totalValue: { fontSize: 16, color: '#2e7d32', fontWeight: '700' },
  
  escrowNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fff8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  escrowIcon: { fontSize: 20, marginRight: 8 },
  escrowText: { fontSize: 12, color: '#2e7d32', flex: 1 },
  
  // Final promise for manual match
  finalPromise: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
    marginBottom: 20,
  },
  promiseIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  promiseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: 8,
    textAlign: 'center',
  },
  promiseText: {
    fontSize: 14,
    color: '#1976d2',
    textAlign: 'center',
    lineHeight: 20,
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
  confirmButton: {
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
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default StepFive;