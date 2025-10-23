import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ErrorScreenProps {
  errorCode: string;
  error?: Error;
  onRetry: () => void;
  onCopyDetails: () => void;
}

interface ErrorInfo {
  title: string;
  description: string;
  suggestions: string[];
}

const getErrorInfo = (errorCode: string): ErrorInfo => {
  switch (errorCode) {
    case 'E-AUTH-INIT':
      return {
        title: 'Authentication Error',
        description: 'Failed to initialize Firebase Authentication. Please check your internet connection and try again.',
        suggestions: [
          'Check your internet connection',
          'Verify Firebase configuration',
          'Restart the app'
        ]
      };
    case 'E-METRO-CONNECT':
      return {
        title: 'Connection Error',
        description: 'Unable to connect to Metro bundler. Please ensure Metro is running.',
        suggestions: [
          'Check if Metro bundler is running',
          'Restart Metro with: npx react-native start --reset-cache',
          'Check your network connection'
        ]
      };
    case 'E-RN-BUILD':
      return {
        title: 'Build Error',
        description: 'React Native build failed. This might be due to dependency conflicts or compilation issues.',
        suggestions: [
          'Clean and rebuild: cd ios && rm -rf Pods Podfile.lock && pod install',
          'Check for dependency conflicts',
          'Update React Native version'
        ]
      };
    case 'E-PLIST-MISSING':
      return {
        title: 'Configuration Error',
        description: 'GoogleService-Info.plist is missing or incorrectly configured.',
        suggestions: [
          'Verify GoogleService-Info.plist is in ios/ directory',
          'Check bundle ID matches Firebase project',
          'Ensure plist is added to Xcode project'
        ]
      };
    case 'E-NAV-ERROR':
      return {
        title: 'Navigation Error',
        description: 'Navigation system encountered an error.',
        suggestions: [
          'Restart the app',
          'Check navigation configuration',
          'Clear navigation state'
        ]
      };
    default:
      return {
        title: 'Something went wrong',
        description: 'An unexpected error occurred. Our team has been notified.',
        suggestions: [
          'Try restarting the app',
          'Check your internet connection',
          'Contact support if the issue persists'
        ]
      };
  }
};

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  errorCode,
  error,
  onRetry,
  onCopyDetails,
}) => {
  const errorInfo = getErrorInfo(errorCode);

  const handleReport = () => {
    Alert.alert(
      'Report Issue',
      'Thank you for your feedback. We\'ll look into this issue.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>⚠️</Text>
          <Text style={styles.title}>{errorInfo.title}</Text>
          <Text style={styles.errorCode}>Error Code: {errorCode}</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.description}>{errorInfo.description}</Text>
          
          <View style={styles.suggestions}>
            <Text style={styles.suggestionsTitle}>What you can try:</Text>
            {errorInfo.suggestions.map((suggestion, index) => (
              <Text key={index} style={styles.suggestion}>
                • {suggestion}
              </Text>
            ))}
          </View>

          {__DEV__ && error && (
            <View style={styles.debugInfo}>
              <Text style={styles.debugTitle}>Debug Information:</Text>
              <Text style={styles.debugText}>{error.message}</Text>
              {error.stack && (
                <Text style={styles.debugStack}>{error.stack}</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={onRetry}>
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={onCopyDetails}>
            <Text style={styles.secondaryButtonText}>Copy Details</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tertiaryButton} onPress={handleReport}>
            <Text style={styles.tertiaryButtonText}>Report Issue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorCode: {
    fontSize: 14,
    color: '#7f8c8d',
    fontFamily: 'monospace',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  body: {
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  suggestions: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  suggestion: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
    marginBottom: 4,
  },
  debugInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#6c757d',
    fontFamily: 'monospace',
  },
  debugStack: {
    fontSize: 10,
    color: '#6c757d',
    fontFamily: 'monospace',
    marginTop: 8,
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  secondaryButtonText: {
    color: '#34495e',
    fontSize: 16,
    fontWeight: '600',
  },
  tertiaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
  },
});
