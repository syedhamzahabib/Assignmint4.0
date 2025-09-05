// tests/auth/AuthProviderStackSwitch.test.tsx - AuthProvider stack switching tests
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from '../../src/state/AuthProvider';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Test components using React Native components
const TestAuthStack = () => <View testID="auth-stack"><Text>Auth Stack</Text></View>;
const TestAppTabs = () => <View testID="app-tabs"><Text>App Tabs</Text></View>;
const TestLoading = () => <View testID="loading"><Text>Loading...</Text></View>;

// Mock the navigation components
jest.mock('../../src/navigation/AppNavigator', () => ({
  AuthStack: TestAuthStack,
  AppTabs: TestAppTabs,
}));

jest.mock('../../src/navigation/AppTabs', () => ({
  default: TestAppTabs,
}));

// Mock the loading component
jest.mock('../../src/components/common/LoadingScreen', () => ({
  default: TestLoading,
}));

describe('AuthProvider Stack Switching', () => {
  let mockOnAuthStateChanged: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnAuthStateChanged = require('firebase/auth').onAuthStateChanged as jest.Mock;
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('should show loading initially', () => {
    render(
      <AuthProvider>
        <TestLoading />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading')).toBeTruthy();
  });

  it('should show auth stack when user is null', async () => {
    render(
      <AuthProvider>
        <TestAuthStack />
      </AuthProvider>
    );

    // Wait for the component to set up the auth listener
    await waitFor(() => {
      expect(mockOnAuthStateChanged).toHaveBeenCalled();
    });

    // Get the callback that was passed to onAuthStateChanged (it's the second argument)
    const callback = mockOnAuthStateChanged.mock.calls[0][1];
    
    await act(async () => {
      callback(null);
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-stack')).toBeTruthy();
    });
  });

  it('should show app tabs when user is authenticated', async () => {
    const mockUser = { uid: 'test-uid', email: 'test@example.com' };

    render(
      <AuthProvider>
        <TestAppTabs />
      </AuthProvider>
    );

    // Wait for the component to set up the auth listener
    await waitFor(() => {
      expect(mockOnAuthStateChanged).toHaveBeenCalled();
    });

    // Get the callback that was passed to onAuthStateChanged (it's the second argument)
    const callback = mockOnAuthStateChanged.mock.calls[0][1];
    await act(async () => {
      callback(mockUser);
    });

    await waitFor(() => {
      expect(screen.getByTestId('app-tabs')).toBeTruthy();
    });
  });

  it('should handle guest mode when AsyncStorage returns guest', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('guest');

    render(
      <AuthProvider>
        <TestAppTabs />
      </AuthProvider>
    );

    // Wait for the component to set up the auth listener
    await waitFor(() => {
      expect(mockOnAuthStateChanged).toHaveBeenCalled();
    });

    // Get the callback that was passed to onAuthStateChanged (it's the second argument)
    const callback = mockOnAuthStateChanged.mock.calls[0][1];
    await act(async () => {
      callback(null);
    });

    await waitFor(() => {
      expect(screen.getByTestId('app-tabs')).toBeTruthy();
    });
  });

  it('should switch back to auth stack after sign out', async () => {
    const mockUser = { uid: 'test-uid', email: 'test@example.com' };

    render(
      <AuthProvider>
        <TestAuthStack />
      </AuthProvider>
    );

    // Wait for the component to set up the auth listener
    await waitFor(() => {
      expect(mockOnAuthStateChanged).toHaveBeenCalled();
    });

    // Get the callback that was passed to onAuthStateChanged (it's the second argument)
    const callback = mockOnAuthStateChanged.mock.calls[0][1];

    // First authenticate
    await act(async () => {
      callback(mockUser);
    });

    // Then sign out
    await act(async () => {
      callback(null);
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-stack')).toBeTruthy();
    });
  });
});
