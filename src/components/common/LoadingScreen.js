// components/common/LoadingScreen.js - Fixed imports
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
} from 'react-native';

// Define constants directly to avoid import issues
const COLORS = {
  primary: '#2e7d32',
  white: '#ffffff',
  black: '#000000',
  gray50: '#fafafa',
  gray200: '#eeeeee',
  gray400: '#bdbdbd',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  background: '#f4f5f9',
  cardBackground: '#ffffff',
  error: '#f44336',
  success: '#4caf50',
};

const FONTS = {
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    title: 28,
  },
  weights: {
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

const LoadingScreen = ({ 
  message = 'Loading...', 
  submessage,
  color = COLORS.primary,
  size = 'large',
  showAnimation = true,
  style,
  fullScreen = true 
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    if (showAnimation) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [fadeAnim, scaleAnim, showAnimation]);

  const Container = fullScreen ? View : React.Fragment;
  const containerStyle = fullScreen ? [styles.fullScreen, style] : style;

  return (
    <Container style={containerStyle}>
      <Animated.View 
        style={[
          styles.container,
          !fullScreen && styles.inlineContainer,
          showAnimation && {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.loadingContent}>
          {/* Activity Indicator */}
          <ActivityIndicator 
            size={size} 
            color={color} 
            style={styles.spinner}
          />
          
          {/* Main Message */}
          <Text style={[styles.message, { color }]}>
            {message}
          </Text>
          
          {/* Sub Message */}
          {submessage && (
            <Text style={styles.submessage}>
              {submessage}
            </Text>
          )}
          
          {/* Loading Dots Animation */}
          <LoadingDots color={color} />
        </View>
      </Animated.View>
    </Container>
  );
};

// Animated loading dots component
const LoadingDots = ({ color }) => {
  const dot1Anim = React.useRef(new Animated.Value(0)).current;
  const dot2Anim = React.useRef(new Animated.Value(0)).current;
  const dot3Anim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const createDotAnimation = (animValue, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      createDotAnimation(dot1Anim, 0),
      createDotAnimation(dot2Anim, 200),
      createDotAnimation(dot3Anim, 400),
    ]).start();
  }, [dot1Anim, dot2Anim, dot3Anim]);

  return (
    <View style={styles.dotsContainer}>
      {[dot1Anim, dot2Anim, dot3Anim].map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: color },
            {
              opacity: anim,
              transform: [
                {
                  scale: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

// Skeleton loader component for content placeholders
export const SkeletonLoader = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4,
  style 
}) => {
  const pulseAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: COLORS.gray200,
          opacity: pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 0.7],
          }),
        },
        style,
      ]}
    />
  );
};

// Card skeleton for loading task cards
export const TaskCardSkeleton = () => (
  <View style={styles.skeletonCard}>
    <View style={styles.skeletonHeader}>
      <SkeletonLoader width="60%" height={16} />
      <SkeletonLoader width="20%" height={16} />
    </View>
    <SkeletonLoader width="80%" height={12} style={{ marginBottom: SPACING.sm }} />
    <SkeletonLoader width="40%" height={12} style={{ marginBottom: SPACING.md }} />
    <View style={styles.skeletonFooter}>
      <SkeletonLoader width="30%" height={24} borderRadius={12} />
      <SkeletonLoader width="25%" height={24} borderRadius={12} />
    </View>
  </View>
);

// Multiple task cards skeleton
export const TaskListSkeleton = ({ count = 3 }) => (
  <View>
    {Array.from({ length: count }).map((_, index) => (
      <TaskCardSkeleton key={index} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  inlineContainer: {
    flex: 0,
    paddingVertical: SPACING.xl,
  },
  loadingContent: {
    alignItems: 'center',
    maxWidth: 280,
  },
  spinner: {
    marginBottom: SPACING.lg,
  },
  message: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  submessage: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray600,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  // Skeleton styles
  skeletonCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  skeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default LoadingScreen;

// ─────────────────────────────────────────────────────────────────────────────
// Add this new component at the bottom of the file:
//
// Action loading component for buttons and forms
export const ActionLoadingOverlay = ({ 
  visible, 
  message = 'Processing...', 
  submessage,
  progress,
  onCancel 
}) => {
  if (!visible) return null;

  return (
    <View style={actionStyles.overlay}>
      <View style={actionStyles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        
        <Text style={actionStyles.message}>{message}</Text>
        
        {submessage && (
          <Text style={actionStyles.submessage}>{submessage}</Text>
        )}
        
        {typeof progress === 'number' && (
          <View style={actionStyles.progressContainer}>
            <View style={actionStyles.progressBar}>
              <View 
                style={[
                  actionStyles.progressFill, 
                  { width: `${Math.min(100, Math.max(0, progress))}%` }
                ]} 
              />
            </View>
            <Text style={actionStyles.progressText}>{Math.round(progress)}%</Text>
          </View>
        )}
        
        {onCancel && (
          <TouchableOpacity style={actionStyles.cancelButton} onPress={onCancel}>
            <Text style={actionStyles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const actionStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.xl,
    alignItems: 'center',
    minWidth: 200,
    maxWidth: 300,
    shadowColor: COLORS.black,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  message: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray800,
    textAlign: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  submessage: {
    fontSize: FONTS.sizes.md,
    color: COLORS.gray600,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  progressContainer: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray600,
    textAlign: 'center',
    fontWeight: FONTS.weights.medium,
  },
  cancelButton: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray300,
  },
  cancelButtonText: {
    color: COLORS.gray700,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
  },
});
