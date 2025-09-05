import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants';

interface ScreenWrapperProps {
  children: ReactNode;
  screenName: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}

interface ScreenWrapperState {
  hasError: boolean;
  error: Error | null;
}

class ScreenWrapper extends React.Component<ScreenWrapperProps, ScreenWrapperState> {
  constructor(props: ScreenWrapperProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ScreenWrapperState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Screen Error in ${this.props.screenName}:`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleGoBack = () => {
    if (this.props.onGoBack) {
      this.props.onGoBack();
    }
  };

  renderErrorFallback = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>Screen Error</Text>
        <Text style={styles.subtitle}>
          {this.props.screenName} encountered an error and couldn't load properly.
        </Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>What happened:</Text>
          <Text style={styles.infoText}>• The screen component had an error</Text>
          <Text style={styles.infoText}>• This is isolated to just this screen</Text>
          <Text style={styles.infoText}>• The rest of the app is still working</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={this.handleRetry}>
            <Text style={styles.primaryButtonText}>🔄 Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={this.handleGoBack}>
            <Text style={styles.secondaryButtonText}>← Go Back</Text>
          </TouchableOpacity>
        </View>

        {__DEV__ && this.state.error && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>Debug Info (Development)</Text>
            <Text style={styles.debugText}>Error: {this.state.error.message}</Text>
            <Text style={styles.debugText}>Screen: {this.props.screenName}</Text>
          </View>
        )}
      </View>
    </View>
  );

  render() {
    if (this.state.hasError) {
      return this.renderErrorFallback();
    }

    return (
      <View style={styles.wrapper}>
        {this.props.children}
      </View>
    );
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
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  icon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  infoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    width: '100%',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.md,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
  debugContainer: {
    backgroundColor: COLORS.gray200,
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.xl,
    width: '100%',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  debugText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
});

export default ScreenWrapper;
