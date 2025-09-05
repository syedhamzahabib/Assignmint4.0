import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants';
import { useAuth } from '../../state/AuthProvider';

interface GuestModeBannerProps {
  onSignIn: () => void;
  onDismiss?: () => void;
  showDismiss?: boolean;
}

export const GuestModeBanner: React.FC<GuestModeBannerProps> = ({
  onSignIn,
  onDismiss,
  showDismiss = true,
}) => {
  const { isGuestMode } = useAuth();

  if (!isGuestMode) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Guest Mode</Text>
        <Text style={styles.message}>
          You're browsing in guest mode. Sign in to access all features like posting tasks, messaging, and payments.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.signInButton} onPress={onSignIn}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
          {showDismiss && onDismiss && (
            <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
              <Text style={styles.dismissButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  message: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  signInButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  signInButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semiBold,
  },
  dismissButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  dismissButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    textDecorationLine: 'underline',
  },
});
