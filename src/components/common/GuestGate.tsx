import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants';
import { useAuth } from '../../state/AuthProvider';
import { useRequireAuth } from '../../hooks/useRequireAuth';

interface GuestGateProps {
  children: React.ReactNode;
  action: string;
  navigation: any;
}

const GuestGate: React.FC<GuestGateProps> = ({ children, action, navigation }) => {
  const { user, mode, setPendingRoute } = useAuth();
  const isGuest = !user && mode === 'guest';

  const handleGatedAction = () => {
    // Store the intended action for post-auth redirect
    setPendingRoute('MainTabs', { action });
    // Navigate to login
    navigation.navigate('Login');
  };

  // If not guest, show children
  if (!isGuest) {
    return <>{children}</>;
  }

  // If guest, show gate
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconPlaceholder}>🔒</Text>
        </View>

        <Text style={styles.title}>Sign up to continue</Text>

        <Text style={styles.subtitle}>
          This feature requires an account. Sign up for free to access all features.
        </Text>

        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.benefitText}>Post tasks and get offers</Text>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.benefitText}>Chat with experts</Text>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.benefitText}>Save favorite tasks</Text>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.benefitText}>Manage payments securely</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGatedAction}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Sign up for free</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Continue browsing</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconPlaceholder: {
    fontSize: 60,
  },
  title: {
    fontSize: 28, // FONTS.sizes.xxl was removed, so using a default size
    fontWeight: 'bold', // FONTS.weights.bold was removed, so using a default weight
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16, // FONTS.sizes.md was removed, so using a default size
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  benefitsContainer: {
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  checkmark: {
    fontSize: 20,
    marginRight: 12,
  },
  benefitText: {
    marginLeft: 12,
    fontSize: 16, // FONTS.sizes.md was removed, so using a default size
    color: COLORS.text,
    lineHeight: 22,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  primaryButton: {
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
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18, // FONTS.sizes.lg was removed, so using a default size
    fontWeight: '600', // Fixed: 'semi-bold' is not valid, use '600' instead
    textAlign: 'center',
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
    fontSize: 18, // FONTS.sizes.lg was removed, so using a default size
    fontWeight: '600', // Fixed: 'semi-bold' is not valid, use '600' instead
    textAlign: 'center',
  },
});

export default GuestGate;
