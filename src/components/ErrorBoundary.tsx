import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorScreen } from './ErrorScreen';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorCode?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorCode: this.getErrorCode(error)
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console and potentially to crash reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      errorCode: this.getErrorCode(error)
    });

    // Here you could send error to crash reporting service
    // Example: crashlytics().recordError(error);
  }

  private static getErrorCode(error: Error): string {
    const message = error.message.toLowerCase();
    
    // Firebase Auth errors
    if (message.includes('firebase') && message.includes('auth')) {
      return 'E-AUTH-INIT';
    }
    if (message.includes('network') || message.includes('connection')) {
      return 'E-METRO-CONNECT';
    }
    if (message.includes('bundle') || message.includes('javascript')) {
      return 'E-RN-BUILD';
    }
    if (message.includes('plist') || message.includes('google')) {
      return 'E-PLIST-MISSING';
    }
    if (message.includes('navigation')) {
      return 'E-NAV-ERROR';
    }
    
    return 'E-UNKNOWN';
  }

  private getErrorCode(error: Error): string {
    return ErrorBoundary.getErrorCode(error);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleCopyDetails = () => {
    const { error, errorInfo } = this.state;
    const details = `
Error: ${error?.message || 'Unknown error'}
Stack: ${error?.stack || 'No stack trace'}
Component Stack: ${errorInfo?.componentStack || 'No component stack'}
Timestamp: ${new Date().toISOString()}
    `.trim();
    
    // Copy to clipboard (you might want to use a library like @react-native-clipboard/clipboard)
    if (navigator.clipboard) {
      navigator.clipboard.writeText(details);
    } else {
      console.log('Error details:', details);
    }
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorScreen
          errorCode={this.state.errorCode || 'E-UNKNOWN'}
          error={this.state.error}
          onRetry={this.handleRetry}
          onCopyDetails={this.handleCopyDetails}
        />
      );
    }

    return this.props.children;
  }
}

// Global error handler setup
export const setupGlobalErrorHandling = () => {
  // Handle uncaught JavaScript errors
  const originalErrorHandler = ErrorUtils.getGlobalHandler();
  
  ErrorUtils.setGlobalHandler((error: Error, isFatal: boolean) => {
    console.error('Global error handler caught:', error, 'isFatal:', isFatal);
    
    // Log to crash reporting service
    // Example: crashlytics().recordError(error);
    
    // Call the original handler
    if (originalErrorHandler) {
      originalErrorHandler(error, isFatal);
    }
  });

  // Handle unhandled promise rejections
  if (typeof global !== 'undefined') {
    const originalUnhandledRejection = global.onunhandledrejection;
    
    global.onunhandledrejection = (event: any) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Log to crash reporting service
      // Example: crashlytics().recordError(event.reason);
      
      // Call the original handler
      if (originalUnhandledRejection) {
        originalUnhandledRejection(event);
      }
    };
  }
};
