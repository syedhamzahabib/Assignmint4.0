// components/common/NetworkStatus.js - Fixed imports
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

// Define constants directly
const COLORS = {
  error: '#f44336',
  white: '#ffffff',
  black: '#000000',
};

const FONTS = {
  sizes: {
    sm: 12,
    md: 14,
  },
  weights: {
    semiBold: '600',
  },
};

const SPACING = {
  sm: 8,
  md: 12,
  lg: 16,
};

const NetworkStatus = ({ onStatusChange }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [slideAnim] = useState(new Animated.Value(-50));

  useEffect(() => {
    // Mock network status check - replace with actual network monitoring
    const checkConnection = () => {
      // For now, assume always online
      // In a real app, you'd use @react-native-community/netinfo
      const online = true;
      
      if (online !== isOnline) {
        setIsOnline(online);
        onStatusChange?.(online);
        
        if (!online) {
          // Show offline banner
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        } else {
          // Hide offline banner after a delay
          setTimeout(() => {
            Animated.timing(slideAnim, {
              toValue: -50,
              duration: 300,
              useNativeDriver: true,
            }).start();
          }, 2000);
        }
      }
    };

    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, [isOnline, slideAnim, onStatusChange]);

  if (isOnline) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <Text style={styles.icon}>📶❌</Text>
      <Text style={styles.text}>You're offline</Text>
      <Text style={styles.subtext}>Some features may not work</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.error,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    zIndex: 1000,
    shadowColor: COLORS.black,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  text: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    marginRight: SPACING.sm,
  },
  subtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: FONTS.sizes.sm,
  },
});

export default NetworkStatus;