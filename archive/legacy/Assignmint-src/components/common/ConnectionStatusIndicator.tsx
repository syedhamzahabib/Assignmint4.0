// components/common/ConnectionStatusIndicator.tsx

import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../constants';

interface ConnectionStatusProps {
  isConnected: boolean;
  isRealTime: boolean;
  lastUpdate: Date | null;
  onStatusChange?: (status: boolean) => void;
}

interface ConnectionContextType {
  isConnected: boolean;
  isRealTime: boolean;
  lastUpdate: Date | null;
  updateConnectionStatus: (status: boolean) => void;
  markDataUpdate: () => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const useConnectionStatus = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnectionStatus must be used within a ConnectionStatusProvider');
  }
  return context;
};

const ConnectionStatusIndicator: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isRealTime,
  lastUpdate,
  onStatusChange,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-50));

  useEffect(() => {
    if (!isConnected) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isConnected, fadeAnim, slideAnim]);

  if (isConnected) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⚠️</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>No Internet Connection</Text>
          <Text style={styles.subtitle}>
            Some features may be unavailable
          </Text>
        </View>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => onStatusChange?.(true)}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export const ConnectionStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isRealTime, setIsRealTime] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(new Date());

  const updateConnectionStatus = (status: boolean) => {
    setIsConnected(status);
    if (status) {
      setIsRealTime(true);
    }
  };

  const markDataUpdate = () => {
    setLastUpdate(new Date());
  };

  // Simulate connection monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional connection issues
      const shouldDisconnect = Math.random() < 0.01; // 1% chance
      if (shouldDisconnect && isConnected) {
        setIsConnected(false);
        setIsRealTime(false);
      } else if (!shouldDisconnect && !isConnected) {
        setIsConnected(true);
        setIsRealTime(true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const value: ConnectionContextType = {
    isConnected,
    isRealTime,
    lastUpdate,
    updateConnectionStatus,
    markDataUpdate,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
      <ConnectionStatusIndicator
        isConnected={isConnected}
        isRealTime={isRealTime}
        lastUpdate={lastUpdate}
        onStatusChange={updateConnectionStatus}
      />
    </ConnectionContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: COLORS.warning,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.surface,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.surface,
    opacity: 0.8,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.surface,
  },
});

export default ConnectionStatusIndicator;
