import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants';

interface PlaceholderScreenProps {
  screenName: string;
  navigation?: any;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  screenName,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🚧</Text>
        <Text style={styles.title}>{screenName}</Text>
        <Text style={styles.subtitle}>
          This screen is under development.
        </Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Coming Soon:</Text>
          <Text style={styles.infoText}>• Full functionality</Text>
          <Text style={styles.infoText}>• Beautiful UI</Text>
          <Text style={styles.infoText}>• Complete features</Text>
        </View>

        <View style={styles.buttonContainer}>
          {navigation && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.primaryButtonText}>← Go Back</Text>
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
});

export default PlaceholderScreen;
