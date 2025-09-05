import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS } from '../constants';
import { useAuthStore } from '../services/AuthStore';

interface PaymentsScreenProps {
  navigation: any;
}

const PaymentsScreen: React.FC<PaymentsScreenProps> = ({ navigation }) => {
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const { user, upgradeFromGuest } = useAuthStore();

  const handleAddPaymentMethod = async () => {
    setIsAddingPayment(true);

    try {
      // Mock payment method addition
      await new Promise<void>(resolve => setTimeout(resolve, 2000));

      // Update user with payment method
      if (user) {
        const updatedUser = { ...user, hasPaymentMethod: true };
        upgradeFromGuest(updatedUser);
      }

      Alert.alert(
        'Success',
        'Payment method added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add payment method. Please try again.');
    } finally {
      setIsAddingPayment(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payments</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="card-outline" size={64} color={COLORS.primary} />
          </View>

          <Text style={styles.title}>Payment Methods</Text>

          <Text style={styles.subtitle}>
            Add a payment method to make it easier to pay for tasks and manage your account.
          </Text>

          {/* Current Status */}
          <View style={styles.statusContainer}>
            <View style={styles.statusRow}>
              <Ionicons
                name={user?.hasPaymentMethod ? 'checkmark-circle' : 'alert-circle'}
                size={24}
                color={user?.hasPaymentMethod ? COLORS.success : COLORS.warning}
              />
              <Text style={styles.statusText}>
                {user?.hasPaymentMethod
                  ? 'Payment method added'
                  : 'No payment method added'
                }
              </Text>
            </View>
          </View>

          {/* Payment Options */}
          <View style={styles.optionsContainer}>
            <Text style={styles.sectionTitle}>Payment Options</Text>

            <View style={styles.optionItem}>
              <Ionicons name="card" size={20} color={COLORS.text} />
              <Text style={styles.optionText}>Credit/Debit Card</Text>
            </View>

            <View style={styles.optionItem}>
              <Ionicons name="logo-paypal" size={20} color={COLORS.text} />
              <Text style={styles.optionText}>PayPal</Text>
            </View>

            <View style={styles.optionItem}>
              <Ionicons name="logo-apple" size={20} color={COLORS.text} />
              <Text style={styles.optionText}>Apple Pay</Text>
            </View>

            <View style={styles.optionItem}>
              <Ionicons name="logo-google" size={20} color={COLORS.text} />
              <Text style={styles.optionText}>Google Pay</Text>
            </View>
          </View>

          {/* Security Note */}
          <View style={styles.securityContainer}>
            <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.success} />
            <Text style={styles.securityText}>
              All payment information is encrypted and securely stored
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.addButton, isAddingPayment && styles.disabledButton]}
            onPress={handleAddPaymentMethod}
            disabled={isAddingPayment}
            activeOpacity={0.8}
          >
            {isAddingPayment ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="add" size={20} color={COLORS.white} />
                <Text style={styles.addButtonText}>
                  {user?.hasPaymentMethod ? 'Update payment method' : 'Add payment method'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  statusContainer: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 32,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 12,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontWeight: FONTS.weights.medium,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionText: {
    marginLeft: 12,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  securityContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 32,
  },
  securityText: {
    marginLeft: 8,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    flex: 1,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    marginLeft: 8,
  },
});

export default PaymentsScreen;
