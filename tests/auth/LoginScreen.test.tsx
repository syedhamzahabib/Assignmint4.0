// tests/auth/LoginScreen.test.tsx - LoginScreen component tests

// Mock the auth error utility first
const mockMapAuthError = jest.fn();
jest.mock('../../src/utils/authError', () => ({
  mapAuthError: mockMapAuthError,
}));

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../src/screens/LoginScreen';

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const mockRoute = {
  params: {},
};

// Mock the auth context
const mockUseAuth = {
  user: null,
  loading: false,
  mode: null,
  logout: jest.fn(),
  enterGuest: jest.fn(),
  isAuthenticated: false,
  isGuestMode: false,
  setPendingRoute: jest.fn(),
  pendingRoute: null,
};

jest.mock('../../src/state/AuthProvider', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

const mockSignInWithEmailAndPassword = jest.requireMock('firebase/auth').signInWithEmailAndPassword;



describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMapAuthError.mockReturnValue('Test error message');
  });

  it('renders correctly with all form fields', () => {
    const { getByTestId } = render(
      <LoginScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    expect(getByTestId('login.email')).toBeTruthy();
    expect(getByTestId('login.password')).toBeTruthy();
    expect(getByTestId('login.submit')).toBeTruthy();
  });

  it('shows validation error for invalid email', async () => {
    const { getByTestId, getByText } = render(
      <LoginScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    const emailInput = getByTestId('login.email');
    const passwordInput = getByTestId('login.password');
    const submitButton = getByTestId('login.submit');

    // Enter invalid email and password
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText(/Please enter a valid email address/)).toBeTruthy();
    });
  });

  it('shows validation error for empty password', async () => {
    const { getByTestId, getByText } = render(
      <LoginScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    const emailInput = getByTestId('login.email');
    const submitButton = getByTestId('login.submit');

    // Enter valid email but no password
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText(/Email and password are required/)).toBeTruthy();
    });
  });

  it('handles successful login', async () => {
    mockSignInWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: 'test-uid', email: 'test@example.com' },
    });

    const { getByTestId } = render(
      <LoginScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    const emailInput = getByTestId('login.email');
    const passwordInput = getByTestId('login.password');
    const submitButton = getByTestId('login.submit');

    // Fill form with valid data
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    // Submit form
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
    });
  });

  it('handles user-not-found error gracefully', async () => {
    const mockError = {
      code: 'auth/user-not-found',
      message: 'User not found',
    };

    mockSignInWithEmailAndPassword.mockRejectedValueOnce(mockError);
    mockMapAuthError.mockReturnValueOnce('No account found with this email. Please check your email or sign up.');

    const { getByTestId, getByText } = render(
      <LoginScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    const emailInput = getByTestId('login.email');
    const passwordInput = getByTestId('login.password');
    const submitButton = getByTestId('login.submit');

    // Fill form with valid data
    fireEvent.changeText(emailInput, 'nonexistent@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    // Submit form
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockMapAuthError).toHaveBeenCalledWith(mockError);
    });

    await waitFor(() => {
      expect(getByText('No account found with this email. Please check your email or sign up.')).toBeTruthy();
    });
  });

  it('handles wrong-password error gracefully', async () => {
    const mockError = {
      code: 'auth/wrong-password',
      message: 'Wrong password',
    };

    mockSignInWithEmailAndPassword.mockRejectedValueOnce(mockError);
    mockMapAuthError.mockReturnValueOnce('Incorrect password. Please try again.');

    const { getByTestId, getByText } = render(
      <LoginScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    const emailInput = getByTestId('login.email');
    const passwordInput = getByTestId('login.password');
    const submitButton = getByTestId('login.submit');

    // Fill form with valid data
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');

    // Submit form
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockMapAuthError).toHaveBeenCalledWith(mockError);
    });

    await waitFor(() => {
      expect(getByText('Incorrect password. Please try again.')).toBeTruthy();
    });
  });

  it('navigates to sign up screen when sign up link is pressed', () => {
    const { getByTestId } = render(
      <LoginScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    const signUpLink = getByTestId('auth.switchToSignUp');
    fireEvent.press(signUpLink);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('SignUp');
  });

  it('navigates to forgot password screen when forgot password link is pressed', () => {
    const { getByTestId } = render(
      <LoginScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    const forgotPasswordLink = getByTestId('login.forgotPassword');
    fireEvent.press(forgotPasswordLink);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('ForgotPassword');
  });
});
