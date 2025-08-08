import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants';

interface SimpleFallbackScreenProps {
  screenName: string;
  navigation?: any;
}

const SimpleFallbackScreen: React.FC<SimpleFallbackScreenProps> = ({
  screenName,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🚧</Text>
        <Text style={styles.title}>{screenName}</Text>
        <Text style={styles.subtitle}>
          This screen is coming soon!
        </Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>• Feature under development</Text>
          <Text style={styles.infoText}>• Check back later</Text>
          <Text style={styles.infoText}>• Use other tabs for now</Text>
        </View>

        {navigation && (
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>← Go Back</Text>
          </TouchableOpacity>
        )}
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
    maxWidth: 300,
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
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  button: {
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
  buttonText: {
    fontSize: 16,
    fontWeight: FONTS.weights.medium,
    color: COLORS.white,
  },
});

export default SimpleFallbackScreen; 