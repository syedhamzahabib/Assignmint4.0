// components/common/ConnectionStatusIndicator.js - Fixed imports
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';

// Define colors and spacing directly to avoid import issues
const COLORS = {
  error: '#f44336',
  success: '#4caf50',
  primary: '#2e7d32',
  black: '#000000',
  white: '#ffffff',
  gray600: '#757575',
};

const FONTS = {
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
  },
  weights: {
    medium: '500',
    semiBold: '600',
  },
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

const ConnectionStatusIndicator = ({ 
  isConnected = true,
  isRealTime = false,
  lastUpdate,
  onRefresh,
  compact = false,
  style 
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  
  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    // Pulse animation for real-time indicator
    if (isRealTime && isConnected) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.7,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      
      return () => pulse.stop();
    }
  }, [isRealTime, isConnected, fadeAnim, pulseAnim]);

  const getStatusInfo = () => {
    if (!isConnected) {
      return {
        icon: '📶❌',
        text: 'Offline',
        color: COLORS.error,
        bgColor: '#ffebee',
        borderColor: COLORS.error,
      };
    }
    
    if (isRealTime) {
      return {
        icon: '🟢',
        text: 'Live',
        color: COLORS.success,
        bgColor: '#e8f5e8',
        borderColor: COLORS.success,
      };
    }
    
    return {
      icon: '🔄',
      text: 'Connected',
      color: COLORS.primary,
      bgColor: '#e3f2fd',
      borderColor: COLORS.primary,
    };
  };

  const statusInfo = getStatusInfo();
  
  const formatLastUpdate = () => {
    if (!lastUpdate) return '';
    
    const now = new Date();
    const updateTime = new Date(lastUpdate);
    const diffMs = now - updateTime;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    
    if (diffSeconds < 30) return 'Just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    return updateTime.toLocaleTimeString();
  };

  if (compact) {
    return (
      <Animated.View 
        style={[
          styles.compactContainer,
          { backgroundColor: statusInfo.bgColor, borderColor: statusInfo.borderColor },
          { opacity: fadeAnim },
          style
        ]}
      >
        <Animated.Text 
          style={[
            styles.compactIcon,
            { opacity: isRealTime && isConnected ? pulseAnim : 1 }
          ]}
        >
          {statusInfo.icon}
        </Animated.Text>
        <Text style={[styles.compactText, { color: statusInfo.color }]}>
          {statusInfo.text}
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      style={[
        styles.container,
        { backgroundColor: statusInfo.bgColor, borderColor: statusInfo.borderColor },
        { opacity: fadeAnim },
        style
      ]}
    >
      <View style={styles.statusRow}>
        <Animated.Text 
          style={[
            styles.statusIcon,
            { opacity: isRealTime && isConnected ? pulseAnim : 1 }
          ]}
        >
          {statusInfo.icon}
        </Animated.Text>
        
        <View style={styles.statusInfo}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
          {lastUpdate && (
            <Text style={styles.lastUpdateText}>
              Updated {formatLastUpdate()}
            </Text>
          )}
        </View>
        
        {onRefresh && !isRealTime && (
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={onRefresh}
          >
            <Text style={styles.refreshIcon}>🔄</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {isRealTime && isConnected && (
        <View style={styles.realTimeIndicator}>
          <Text style={styles.realTimeText}>
            📡 Real-time updates active
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

// Hook for connection status management
export const useConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isRealTime, setIsRealTime] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const updateConnectionStatus = (connected, realTime = false) => {
    setIsConnected(connected);
    setIsRealTime(realTime);
    if (connected) {
      setLastUpdate(new Date().toISOString());
    }
  };
  
  const markDataUpdate = () => {
    setLastUpdate(new Date().toISOString());
  };
  
  return {
    isConnected,
    isRealTime,
    lastUpdate,
    updateConnectionStatus,
    markDataUpdate,
  };
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    shadowColor: COLORS.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    gap: SPACING.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statusIcon: {
    fontSize: 16,
  },
  compactIcon: {
    fontSize: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: 2,
  },
  compactText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semiBold,
  },
  lastUpdateText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.gray600,
  },
  refreshButton: {
    padding: SPACING.xs,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  refreshIcon: {
    fontSize: 14,
  },
  realTimeIndicator: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  realTimeText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.success,
    fontWeight: FONTS.weights.medium,
    textAlign: 'center',
  },
});

export default ConnectionStatusIndicator;
