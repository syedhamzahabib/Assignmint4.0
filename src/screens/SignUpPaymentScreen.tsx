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
import { analytics, ANALYTICS_EVENTS } from '../services/AnalyticsService';

interface SignUpPaymentScreenProps {
  navigation: any;
}

const SignUpPaymentScreen: React.FC<SignUpPaymentScreenProps> = ({ navigation }) => {
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const { user, upgradeFromGuest } = useAuthStore();

  const handleAddPaymentMethod = async () => {
    setIsAddingPayment(true);

    try {
      // Mock payment method addition
      await new Promise<void>(resolve => setTimeout(resolve, 2000));

      analytics.track(ANALYTICS_EVENTS.PAYMENT_METHOD_ADDED);

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
            text: 'Continue',
            onPress: () => {
              // Navigation will happen automatically when AppNavigator detects user state change
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add payment method. Please try again.');
    } finally {
      setIsAddingPayment(false);
    }
  };

  const handleSkipForNow = () => {
    analytics.track(ANALYTICS_EVENTS.PAYMENT_METHOD_SKIPPED);

    Alert.alert(
      'Skip Payment Method',
      'You can add a payment method anytime in your Profile → Payments section.',
      [
        {
          text: 'Skip for now',
          onPress: () => {
            // Navigation will happen automatically when AppNavigator detects user state change
          },
        },
        {
          text: 'Add payment method',
          onPress: handleAddPaymentMethod,
        },
      ]
    );
  };

  const handleBackToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToSignUp}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Setup</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="card-outline" size={64} color={COLORS.primary} />
          </View>

          <Text style={styles.title}>Add a payment method (optional)</Text>

          <Text style={styles.subtitle}>
            Add a payment method now to make it easier to pay for tasks, or skip and add one later.
          </Text>

          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.benefitText}>Faster payments when posting tasks</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.benefitText}>Secure and encrypted payment processing</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.benefitText}>Multiple payment options available</Text>
            </View>
          </View>

          {/* Info Note */}
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>
              You can add or update your payment method anytime in Profile → Payments.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, isAddingPayment && styles.disabledButton]}
            onPress={handleAddPaymentMethod}
            disabled={isAddingPayment}
            activeOpacity={0.8}
          >
            {isAddingPayment ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="card" size={20} color={COLORS.white} />
                <Text style={styles.primaryButtonText}>Add payment method</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSkipForNow}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Skip for now</Text>
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
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  benefitText: {
    marginLeft: 12,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 32,
  },
  infoText: {
    marginLeft: 8,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    flex: 1,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    textAlign: 'center',
  },
});

export default SignUpPaymentScreen;
