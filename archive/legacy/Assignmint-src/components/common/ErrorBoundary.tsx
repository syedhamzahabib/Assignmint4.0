import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error for debugging
    this.logError(error, errorInfo);
  }

  logError = (error: Error, errorInfo: ErrorInfo) => {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: 'React Native',
    };

    console.error('📋 Error Details:', JSON.stringify(errorDetails, null, 2));
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    if (!error) {return;}

    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
    };

    Alert.alert(
      'Report Error',
      'Error details have been logged. You can copy them from the console for debugging.',
      [
        { text: 'OK', style: 'default' },
        { text: 'Copy Details', onPress: () => this.copyErrorDetails(errorReport) },
      ]
    );
  };

  copyErrorDetails = (errorReport: any) => {
    const details = JSON.stringify(errorReport, null, 2);
    // In a real app, you'd use a clipboard library
    console.log('📋 Error details to copy:', details);
    Alert.alert('Copied', 'Error details copied to console');
  };

  isFirebaseError = (error: Error): boolean => {
    const firebaseErrorKeywords = [
      'firebase',
      'auth',
      'firestore',
      'collection',
      'document',
      'permission',
      'network',
      'timeout',
    ];

    const errorMessage = error.message.toLowerCase();
    return firebaseErrorKeywords.some(keyword => errorMessage.includes(keyword));
  };

  renderFirebaseFallback = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🔥</Text>
        <Text style={styles.title}>Connection Issue</Text>
        <Text style={styles.subtitle}>
          We're having trouble connecting to our services right now.
        </Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>What you can do:</Text>
          <Text style={styles.infoText}>• Check your internet connection</Text>
          <Text style={styles.infoText}>• Try refreshing the app</Text>
          <Text style={styles.infoText}>• Come back in a few minutes</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={this.handleRetry}>
            <Text style={styles.primaryButtonText}>🔄 Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={this.handleReportError}>
            <Text style={styles.secondaryButtonText}>📧 Report Issue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  renderGenericFallback = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.subtitle}>
          We encountered an unexpected error. Don't worry, it's not your fault!
        </Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Try these steps:</Text>
          <Text style={styles.infoText}>• Restart the app</Text>
          <Text style={styles.infoText}>• Check for updates</Text>
          <Text style={styles.infoText}>• Contact support if the problem persists</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={this.handleRetry}>
            <Text style={styles.primaryButtonText}>🔄 Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={this.handleReportError}>
            <Text style={styles.secondaryButtonText}>📧 Report Issue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  renderDebugInfo = () => {
    const { error, errorInfo } = this.state;
    if (!__DEV__) {return null;}

    return (
      <ScrollView style={styles.debugContainer}>
        <Text style={styles.debugTitle}>Debug Information (Development Only)</Text>
        <Text style={styles.debugText}>Error: {error?.message}</Text>
        <Text style={styles.debugText}>Stack: {error?.stack}</Text>
        <Text style={styles.debugText}>Component: {errorInfo?.componentStack}</Text>
      </ScrollView>
    );
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Use Firebase-specific fallback for Firebase errors
      if (error && this.isFirebaseError(error)) {
        return (
          <View style={styles.wrapper}>
            {this.renderFirebaseFallback()}
            {this.renderDebugInfo()}
          </View>
        );
      }

      // Use generic fallback for other errors
      return (
        <View style={styles.wrapper}>
          {this.renderGenericFallback()}
          {this.renderDebugInfo()}
        </View>
      );
    }

    return children;
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.large,
    backgroundColor: COLORS.background,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  icon: {
    fontSize: 64,
    marginBottom: SPACING.medium,
  },
  title: {
    fontSize: 24,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.small,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.large,
  },
  infoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.medium,
    marginBottom: SPACING.large,
    width: '100%',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.small,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.medium,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.large,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: FONTS.weights.medium,
    color: COLORS.white,
  },
  secondaryButton: {
    backgroundColor: COLORS.gray100,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.large,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray300,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
  },
  debugContainer: {
    backgroundColor: COLORS.gray100,
    padding: SPACING.medium,
    margin: SPACING.medium,
    borderRadius: 8,
    maxHeight: 200,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.small,
  },
  debugText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    marginBottom: SPACING.xs,
  },
});

export default ErrorBoundary;
