import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants';

interface FallbackScreenProps {
  screenName: string;
  error?: string;
  onGoBack?: () => void;
  onRetry?: () => void;
}

const FallbackScreen: React.FC<FallbackScreenProps> = ({
  screenName,
  error,
  onGoBack,
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🚧</Text>
        <Text style={styles.title}>Screen Not Available</Text>
        <Text style={styles.subtitle}>
          {screenName} isn't working right now.
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error Details:</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>What you can do:</Text>
          <Text style={styles.infoText}>• Try going back to the previous screen</Text>
          <Text style={styles.infoText}>• Check if the screen is under maintenance</Text>
          <Text style={styles.infoText}>• Contact support if the problem persists</Text>
        </View>

        <View style={styles.buttonContainer}>
          {onRetry && (
            <TouchableOpacity style={styles.primaryButton} onPress={onRetry}>
              <Text style={styles.primaryButtonText}>🔄 Try Again</Text>
            </TouchableOpacity>
          )}

          {onGoBack && (
            <TouchableOpacity style={styles.secondaryButton} onPress={onGoBack}>
              <Text style={styles.secondaryButtonText}>← Go Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.large,
    backgroundColor: COLORS.background,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  icon: {
    fontSize: 64,
    marginBottom: SPACING.medium,
  },
  title: {
    fontSize: 24,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.small,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.large,
  },
  errorContainer: {
    backgroundColor: COLORS.error + '15',
    borderRadius: 12,
    padding: SPACING.medium,
    marginBottom: SPACING.large,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: FONTS.weights.medium,
    color: COLORS.error,
    marginBottom: SPACING.small,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  infoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.medium,
    marginBottom: SPACING.large,
    width: '100%',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    marginBottom: SPACING.small,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.medium,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.large,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: FONTS.weights.medium,
    color: COLORS.white,
  },
  secondaryButton: {
    backgroundColor: COLORS.gray100,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.large,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray300,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
  },
});

export default FallbackScreen;
