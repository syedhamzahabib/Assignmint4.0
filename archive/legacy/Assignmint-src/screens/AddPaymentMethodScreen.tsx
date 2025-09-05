import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const AddPaymentMethodScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [paymentType, setPaymentType] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentTypes = [
    { key: 'card', label: 'Credit/Debit Card', icon: '💳' },
    { key: 'bank', label: 'Bank Account', icon: '🏦' },
    { key: 'paypal', label: 'PayPal', icon: '📱' },
  ];

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleSubmit = () => {
    if (!cardNumber.trim() || !expiryDate.trim() || !cvv.trim() || !cardholderName.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert('Invalid Card Number', 'Please enter a valid card number.');
      return;
    }

    if (expiryDate.length < 5) {
      Alert.alert('Invalid Expiry Date', 'Please enter a valid expiry date (MM/YY).');
      return;
    }

    if (cvv.length < 3) {
      Alert.alert('Invalid CVV', 'Please enter a valid CVV.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Payment Method Added',
        'Your payment method has been successfully added!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 2000);
  };

  const renderCardForm = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Card Information</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Card Number</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={(text) => setCardNumber(formatCardNumber(text))}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor="#8E8E93"
          keyboardType="numeric"
          maxLength={19}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Expiry Date</Text>
          <TextInput
            style={styles.input}
            value={expiryDate}
            onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
            placeholder="MM/YY"
            placeholderTextColor="#8E8E93"
            keyboardType="numeric"
            maxLength={5}
          />
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.inputLabel}>CVV</Text>
          <TextInput
            style={styles.input}
            value={cvv}
            onChangeText={setCvv}
            placeholder="123"
            placeholderTextColor="#8E8E93"
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          value={cardholderName}
          onChangeText={setCardholderName}
          placeholder="John Doe"
          placeholderTextColor="#8E8E93"
          autoCapitalize="words"
        />
      </View>
    </View>
  );

  const renderBankForm = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Bank Account Information</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Account Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your account number"
          placeholderTextColor="#8E8E93"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Routing Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your routing number"
          placeholderTextColor="#8E8E93"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Account Holder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          placeholderTextColor="#8E8E93"
          autoCapitalize="words"
        />
      </View>
    </View>
  );

  const renderPayPalForm = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>PayPal Information</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>PayPal Email</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@example.com"
          placeholderTextColor="#8E8E93"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          You'll be redirected to PayPal to complete the verification process.
        </Text>
      </View>
    </View>
  );

  const renderForm = () => {
    switch (paymentType) {
      case 'card':
        return renderCardForm();
      case 'bank':
        return renderBankForm();
      case 'paypal':
        return renderPayPalForm();
      default:
        return renderCardForm();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Payment Method</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Payment Type Selection */}
          <View style={styles.paymentTypeSection}>
            <Text style={styles.sectionTitle}>Payment Method Type</Text>
            <View style={styles.paymentTypeContainer}>
              {paymentTypes.map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.paymentTypeCard,
                    paymentType === type.key && styles.paymentTypeCardSelected,
                  ]}
                  onPress={() => setPaymentType(type.key)}
                >
                  <Text style={styles.paymentTypeIcon}>{type.icon}</Text>
                  <Text style={[
                    styles.paymentTypeLabel,
                    paymentType === type.key && styles.paymentTypeLabelSelected,
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Payment Form */}
          {renderForm()}

          {/* Default Payment Method Toggle */}
          <View style={styles.toggleSection}>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>Set as default payment method</Text>
              <TouchableOpacity
                style={[styles.toggle, isDefault && styles.toggleActive]}
                onPress={() => setIsDefault(!isDefault)}
              >
                <View style={[styles.toggleThumb, isDefault && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Security Notice */}
          <View style={styles.securitySection}>
            <View style={styles.securityCard}>
              <Text style={styles.securityIcon}>🔒</Text>
              <Text style={styles.securityTitle}>Secure & Encrypted</Text>
              <Text style={styles.securityText}>
                Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={[
              styles.submitButtonText,
              isSubmitting && styles.submitButtonTextDisabled,
            ]}>
              {isSubmitting ? 'Adding...' : 'Add Payment Method'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  paymentTypeSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  paymentTypeContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 12,
  },
  paymentTypeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  paymentTypeCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  paymentTypeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  paymentTypeLabel: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    fontWeight: '500',
  },
  paymentTypeLabelSelected: {
    color: '#007AFF',
  },
  formSection: {
    marginTop: 24,
  },
  inputGroup: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  toggleSection: {
    marginTop: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  toggle: {
    width: 51,
    height: 31,
    backgroundColor: '#E5E5EA',
    borderRadius: 16,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#007AFF',
  },
  toggleThumb: {
    width: 27,
    height: 27,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  securitySection: {
    marginTop: 24,
  },
  securityCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  securityIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#F0F8FF',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#007AFF',
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#8E8E93',
  },
});

export default AddPaymentMethodScreen;
