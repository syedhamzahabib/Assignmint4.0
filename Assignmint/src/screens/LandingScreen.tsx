import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon, { Icons } from '../components/common/Icon';
import { COLORS } from '../constants';

const LandingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleGuestMode = () => {
    navigation.navigate('MainTabs');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name={Icons.logo} size={48} color={COLORS.primary} />
          <Text style={styles.appName}>AssignMint</Text>
          <Text style={styles.tagline}>Assignment Help Marketplace</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Choose AssignMint?</Text>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Icon name={Icons.people} size={24} color={COLORS.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Expert Help</Text>
              <Text style={styles.featureDescription}>
                Connect with qualified experts in various subjects
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Icon name={Icons.flash} size={24} color={COLORS.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Quick Delivery</Text>
              <Text style={styles.featureDescription}>
                Get your assignments completed on time, every time
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Icon name={Icons.shield} size={24} color={COLORS.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Secure Payments</Text>
              <Text style={styles.featureDescription}>
                Safe and secure payment processing
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Icon name={Icons.chat} size={24} color={COLORS.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Direct Communication</Text>
              <Text style={styles.featureDescription}>
                Chat directly with experts for better collaboration
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Trusted by Students</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5K+</Text>
              <Text style={styles.statLabel}>Experts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50K+</Text>
              <Text style={styles.statLabel}>Tasks</Text>
            </View>
          </View>
        </View>

        {/* Testimonials */}
        <View style={styles.testimonialsSection}>
          <Text style={styles.sectionTitle}>What Students Say</Text>
          
          <View style={styles.testimonialCard}>
            <Text style={styles.testimonialText}>
              "AssignMint helped me ace my business case study. The expert was incredibly knowledgeable and delivered exactly what I needed."
            </Text>
            <View style={styles.testimonialAuthor}>
              <Text style={styles.authorName}>- Sarah M.</Text>
              <Text style={styles.authorSubject}>Business Student</Text>
            </View>
          </View>

          <View style={styles.testimonialCard}>
            <Text style={styles.testimonialText}>
              "I was struggling with my coding assignment, but the expert here helped me understand the concepts and complete it perfectly."
            </Text>
            <View style={styles.testimonialAuthor}>
              <Text style={styles.authorName}>- Mike R.</Text>
              <Text style={styles.authorSubject}>Computer Science</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={handleLogin}>
          <Text style={styles.secondaryButtonText}>I already have an account</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.guestButton} onPress={handleGuestMode}>
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  testimonialsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  testimonialCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  testimonialText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    alignItems: 'flex-end',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  authorSubject: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  guestButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  guestButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});

export default LandingScreen;
