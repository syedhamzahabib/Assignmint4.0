import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { COLORS } from '../../constants';

interface NetworkStatusProps {
  onStatusChange?: (isConnected: boolean) => void;
}

export const useConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isRealTime, setIsRealTime] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const updateConnectionStatus = (connected: boolean) => {
    setIsConnected(connected);
  };

  const markDataUpdate = () => {
    setLastUpdate(new Date());
  };

  return {
    isConnected,
    isRealTime,
    lastUpdate,
    updateConnectionStatus,
    markDataUpdate,
  };
};

const NetworkStatus: React.FC<NetworkStatusProps> = ({ onStatusChange }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [showStatus, setShowStatus] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Simulate network status monitoring
    const checkConnection = () => {
      // In a real app, you would check actual network connectivity
      const connected = Math.random() > 0.1; // 90% chance of being connected
      setIsConnected(connected);
      onStatusChange?.(connected);
      
      if (!connected) {
        setShowStatus(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowStatus(false));
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [fadeAnim, onStatusChange]);

  if (!showStatus) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.statusBar}>
        <Text style={styles.statusIcon}>📡</Text>
        <Text style={styles.statusText}>
          {isConnected ? 'Connected' : 'No Internet Connection'}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  statusBar: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statusText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NetworkStatus; 