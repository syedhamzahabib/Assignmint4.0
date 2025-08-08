import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, ICONS, ICON_SIZES } from '../../constants';
import { useAuthStore } from '../../services/AuthStore';
import { analytics, ANALYTICS_EVENTS } from '../../services/AnalyticsService';

interface GuestGateProps {
  children: React.ReactNode;
  action: string;
  navigation: any;
}

const GuestGate: React.FC<GuestGateProps> = ({ children, action, navigation }) => {
  const { user, mode, setPendingRoute } = useAuthStore();
  const isGuest = !user && mode === 'guest';

  const handleGatedAction = () => {
    analytics.track(ANALYTICS_EVENTS.GUEST_GATED_ACTION, { action });
    
    // Store the intended action for post-auth redirect
    setPendingRoute('MainTabs', { action });
    
    // Navigate to sign up
    navigation.navigate('SignUp');
  };

  if (!isGuest) {
    return <>{children}</>;
  }

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={ICONS.SHIELD} 
              size={ICON_SIZES.XXLARGE} 
              color={COLORS.primary} 
            />
          </View>

          <Text style={styles.title}>Sign up to continue</Text>
          
          <Text style={styles.subtitle}>
            This feature requires an account. Sign up for free to access all features.
          </Text>

          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <Ionicons name={ICONS.CHECKMARK} size={ICON_SIZES.MEDIUM} color={COLORS.success} />
              <Text style={styles.benefitText}>Post tasks and get offers</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Ionicons name={ICONS.CHECKMARK} size={ICON_SIZES.MEDIUM} color={COLORS.success} />
              <Text style={styles.benefitText}>Chat with experts</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Ionicons name={ICONS.CHECKMARK} size={ICON_SIZES.MEDIUM} color={COLORS.success} />
              <Text style={styles.benefitText}>Save favorite tasks</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Ionicons name={ICONS.CHECKMARK} size={ICON_SIZES.MEDIUM} color={COLORS.success} />
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
      </SafeAreaView>
    </Modal>
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
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
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
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    textAlign: 'center',
  },
});

export default GuestGate;
