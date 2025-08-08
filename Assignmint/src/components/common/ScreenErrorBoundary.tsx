import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants';

interface Props {
  children: ReactNode;
  screenName: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ScreenErrorBoundary extends Component<Props, State> {
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
    console.error(`🚨 Screen ErrorBoundary caught an error in ${this.props.screenName}:`, error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Log error for debugging
    this.logError(error, errorInfo);
  }

  logError = (error: Error, errorInfo: ErrorInfo) => {
    const errorDetails = {
      screenName: this.props.screenName,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: 'React Native',
    };

    console.error('📋 Screen Error Details:', JSON.stringify(errorDetails, null, 2));
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleGoBack = () => {
    if (this.props.onGoBack) {
      this.props.onGoBack();
    }
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
      'component',
      'registered',
    ];

    const errorMessage = error.message.toLowerCase();
    return firebaseErrorKeywords.some(keyword => errorMessage.includes(keyword));
  };

  isNavigationError = (error: Error): boolean => {
    const navigationErrorKeywords = [
      'navigation',
      'route',
      'screen',
      'tab',
      'onpress',
      'function',
    ];

    const errorMessage = error.message.toLowerCase();
    return navigationErrorKeywords.some(keyword => errorMessage.includes(keyword));
  };

  renderFirebaseFallback = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🔥</Text>
        <Text style={styles.title}>Service Unavailable</Text>
        <Text style={styles.subtitle}>
          {this.props.screenName} is having trouble connecting to our services.
        </Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>What you can do:</Text>
          <Text style={styles.infoText}>• Check your internet connection</Text>
          <Text style={styles.infoText}>• Try refreshing this screen</Text>
          <Text style={styles.infoText}>• Go back and try again later</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={this.handleRetry}>
            <Text style={styles.primaryButtonText}>🔄 Try Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={this.handleGoBack}>
            <Text style={styles.secondaryButtonText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  renderNavigationFallback = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🧭</Text>
        <Text style={styles.title}>Navigation Error</Text>
        <Text style={styles.subtitle}>
          There was a problem loading {this.props.screenName}.
        </Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>This might be due to:</Text>
          <Text style={styles.infoText}>• Missing screen configuration</Text>
          <Text style={styles.infoText}>• Navigation setup issue</Text>
          <Text style={styles.infoText}>• Screen component error</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={this.handleRetry}>
            <Text style={styles.primaryButtonText}>🔄 Reload Screen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={this.handleGoBack}>
            <Text style={styles.secondaryButtonText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  renderGenericFallback = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>Screen Not Working</Text>
        <Text style={styles.subtitle}>
          {this.props.screenName} encountered an unexpected error.
        </Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Error Details:</Text>
          <Text style={styles.infoText}>• {this.state.error?.message || 'Unknown error'}</Text>
          <Text style={styles.infoText}>• Screen: {this.props.screenName}</Text>
          <Text style={styles.infoText}>• Time: {new Date().toLocaleTimeString()}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={this.handleRetry}>
            <Text style={styles.primaryButtonText}>🔄 Try Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={this.handleGoBack}>
            <Text style={styles.secondaryButtonText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  renderDebugInfo = () => {
    const { error, errorInfo } = this.state;
    // Disable debug info in development to remove the overlay
    return null;
  };

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError && error) {
      // Only show error fallback for critical errors, not for normal issues
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('loading') || 
          errorMessage.includes('service unavailable') ||
          errorMessage.includes('is not a function') ||
          errorMessage.includes('subscribe')) {
        // Don't show error boundary for common development issues
        console.log('⚠️ Suppressing error boundary for:', error.message);
        return children;
      }

      let fallbackComponent;

      if (this.isFirebaseError(error)) {
        fallbackComponent = this.renderFirebaseFallback();
      } else if (this.isNavigationError(error)) {
        fallbackComponent = this.renderNavigationFallback();
      } else {
        fallbackComponent = this.renderGenericFallback();
      }

      return (
        <View style={styles.wrapper}>
          {fallbackComponent}
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
    color: COLORS.text,
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
    color: COLORS.text,
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
    color: COLORS.text,
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
    color: COLORS.text,
    marginBottom: SPACING.small,
  },
  debugText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    marginBottom: SPACING.xs,
  },
});

export default ScreenErrorBoundary; 