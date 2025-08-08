import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from 'react-native';
import { COLORS } from '../../constants';

interface LoadingScreenProps {
  message?: string;
  visible?: boolean;
}

interface ActionLoadingOverlayProps {
  message?: string;
  visible?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading...",
  visible = true 
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.loadingCard}>
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.subtitle}>Please wait while we load your content</Text>
      </View>
    </View>
  );
};

export const ActionLoadingOverlay: React.FC<ActionLoadingOverlayProps> = ({ 
  message = "Processing...",
  visible = false 
}) => {
  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlayContainer}>
        <View style={styles.overlayCard}>
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
          <Text style={styles.overlayMessage}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  loadingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 200,
  },
  spinnerContainer: {
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  overlayCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 150,
  },
  overlayMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default LoadingScreen; 