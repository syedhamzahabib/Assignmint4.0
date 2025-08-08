// src/components/common/ErrorBoundary.js
// Error boundary component to catch and handle React errors gracefully

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    this.reportError(error, errorInfo);
  }

  reportError = (error, errorInfo) => {
    if (__DEV__) {
      console.error('Error reported to analytics:', {
        error: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }
    // You could send this data to a remote logging service here
  };

  handleRetry = () => {
    this.setState({ isRetrying: true });

    setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false,
      });
    }, 500);
  };

  // Added: Method for screen-specific error handling
  renderScreenError = () => {
    const { 
      title = 'Something went wrong', 
      subtitle = 'This screen encountered an error. Please try again.',
      showRetry = true,
      onRetry,
      onGoHome,
    } = this.props;

    return (
      <View style={[styles.container, styles.screenErrorContainer]}>
        <View style={styles.screenErrorContent}>
          <Text style={styles.errorIcon}>😵</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.buttonContainer}>
            {showRetry && (
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]}
                onPress={onRetry || this.handleRetry}
                disabled={this.state.isRetrying}
              >
                <Text style={[styles.buttonText, styles.primaryButtonText]}>
                  {this.state.isRetrying ? 'Retrying...' : '🔄 Try Again'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]}
              onPress={onGoHome || (() => console.log('Go to Home'))}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                🏠 Go Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  render() {
    if (this.state.hasError) {
      const { 
        title = 'Oops! Something went wrong', 
        subtitle = 'We apologize for the inconvenience. Please try again.',
        showDetails = __DEV__,
        onRetry,
        onGoHome,
      } = this.props;

      return (
        <View style={styles.container}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.errorIcon}>😵</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]}
                onPress={onRetry || this.handleRetry}
                disabled={this.state.isRetrying}
              >
                <Text style={[styles.buttonText, styles.primaryButtonText]}>
                  {this.state.isRetrying ? 'Retrying...' : '🔄 Try Again'}
                </Text>
              </TouchableOpacity>

              {onGoHome && (
                <TouchableOpacity 
                  style={[styles.button, styles.secondaryButton]}
                  onPress={onGoHome}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                    🏠 Go Home
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {showDetails && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.detailsTitle}>Error Details (Dev Mode)</Text>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error) => {
    console.error('Error caught by useErrorHandler:', error);
    setError(error);
  }, []);

  return {
    error,
    resetError,
    handleError,
  };
};

// Simple error fallback component
export const ErrorFallback = ({ 
  error, 
  onRetry, 
  title = 'Something went wrong',
  showError = false 
}) => (
  <View style={styles.fallbackContainer}>
    <Text style={styles.fallbackIcon}>😔</Text>
    <Text style={styles.fallbackTitle}>{title}</Text>
    {showError && error && (
      <Text style={styles.fallbackError}>{error.toString()}</Text>
    )}
    {onRetry && (
      <TouchableOpacity style={styles.fallbackButton} onPress={onRetry}>
        <Text style={styles.fallbackButtonText}>Try Again</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.title,
    fontWeight: FONTS.weights.bold,
    color: COLORS.gray800,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.gray600,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
    maxWidth: 280,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 280,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    color: COLORS.white,
  },
  secondaryButton: {
    backgroundColor: COLORS.gray100,
    borderWidth: 1,
    borderColor: COLORS.gray300,
  },
  secondaryButtonText: {
    color: COLORS.gray700,
  },
  errorDetails: {
    width: '100%',
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  detailsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.error,
    marginBottom: SPACING.md,
  },
  errorText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.error,
    fontFamily: 'monospace',
  },

  // Screen-specific error styles (added)
  screenErrorContainer: {
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenErrorContent: {
    alignItems: 'center',
    padding: SPACING.xl,
    maxWidth: 300,
  },

  // Fallback styles (unchanged)
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  fallbackIcon: {
    fontSize: 48,
    marginBottom: SPACING.lg,
  },
  fallbackTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.gray700,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  fallbackError: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    fontFamily: 'monospace',
  },
  fallbackButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  fallbackButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
});

export default ErrorBoundary;
