import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants';

interface TaskPostedConfirmationProps {
  navigation: any;
  route: any;
}

const { width } = Dimensions.get('window');

const TaskPostedConfirmation: React.FC<TaskPostedConfirmationProps> = ({ navigation, route }) => {
  const { taskTitle, budget, matchingPreference } = route.params;

  const [checkmarkScale] = useState(new Animated.Value(0));
  const [confettiOpacity] = useState(new Animated.Value(0));
  const [contentOpacity] = useState(new Animated.Value(0));
  const [contentTranslateY] = useState(new Animated.Value(50));

  useEffect(() => {
    // Animate checkmark
    Animated.sequence([
      Animated.timing(checkmarkScale, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(checkmarkScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate confetti
    Animated.timing(confettiOpacity, {
      toValue: 1,
      duration: 500,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // Animate content
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getMatchingMessage = () => {
    if (matchingPreference === 'auto') {
      return "We'll notify you once an expert is matched!";
    } else {
      return "You'll have the chance to accept or reject the offer.";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background with gradient effect */}
      <View style={styles.background} />

      {/* Confetti Animation */}
      <Animated.View style={[styles.confettiContainer, { opacity: confettiOpacity }]}>
        {[...Array(20)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.confetti,
              {
                left: Math.random() * width,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][
                  Math.floor(Math.random() * 5)
                ],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Scrollable Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}
        >
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <Animated.View
              style={[
                styles.checkmarkContainer,
                {
                  transform: [{ scale: checkmarkScale }],
                },
              ]}
            >
              <View style={styles.checkmarkCircle}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            </Animated.View>
          </View>

          {/* Success Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.emoji}>🎉</Text>
            <Text style={styles.title}>Your task has been posted!</Text>
            <Text style={styles.subtitle}>{getMatchingMessage()}</Text>
          </View>

          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <Text style={styles.statusIconText}>🔍</Text>
            </View>
            <Text style={styles.statusText}>
              We're finding the best expert for your task. Hang tight!
            </Text>
          </View>

          {/* Mini Receipt Card */}
          <View style={styles.receiptCard}>
            <Text style={styles.receiptTitle}>Task Summary</Text>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Task:</Text>
              <Text style={styles.receiptValue}>{taskTitle}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Budget:</Text>
              <Text style={styles.receiptValue}>${budget}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Matching:</Text>
              <Text style={styles.receiptValue}>
                {matchingPreference === 'auto' ? 'Auto-Match' : 'Manual Review'}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('TaskDetails', { taskId: 'new' })}
            >
              <Text style={styles.actionButtonIcon}>🔍</Text>
              <Text style={styles.actionButtonText}>View My Task</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => Alert.alert('Notifications', 'Enable notifications functionality')}
            >
              <Text style={styles.actionButtonIcon}>🔔</Text>
              <Text style={styles.actionButtonText}>Turn on Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('MainTabs')}
            >
              <Text style={styles.actionButtonIcon}>🏠</Text>
              <Text style={styles.actionButtonText}>Return to Home</Text>
            </TouchableOpacity>
          </View>

          {/* Encouraging Message */}
          <View style={styles.encouragingMessage}>
            <Text style={styles.encouragingText}>Grab a snack. We've got this! 🍕</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary + '10',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  checkmarkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkmark: {
    fontSize: 40,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  statusCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  statusIconText: {
    fontSize: 24,
  },
  statusText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    flex: 1,
    lineHeight: 22,
  },
  receiptCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  receiptTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  receiptLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  receiptValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
  },
  actionButtons: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  actionButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  actionButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
  },
  encouragingMessage: {
    alignItems: 'center',
  },
  encouragingText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});

export default TaskPostedConfirmation; 