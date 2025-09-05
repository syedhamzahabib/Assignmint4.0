// tests/auth/SignUpScreen.test.tsx - SignUpScreen component tests

// Mock the auth error utility first
const mockMapAuthError = jest.fn();
jest.mock('../../src/utils/authError', () => ({
  mapAuthError: mockMapAuthError,
}));

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SignUpScreen from '../../src/screens/SignUpScreen';

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
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
  sendEmailVerification: jest.fn(),
}));

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

// Mock Firebase Database
jest.mock('firebase/database', () => ({
  ref: jest.fn(),
  set: jest.fn(),
}));

// Mock Firebase Storage
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadString: jest.fn(),
}));

const mockCreateUserWithEmailAndPassword = jest.requireMock('firebase/auth').createUserWithEmailAndPassword;
const mockUpdateProfile = jest.requireMock('firebase/auth').updateProfile;
const mockSendEmailVerification = jest.requireMock('firebase/auth').sendEmailVerification;

const mockDoc = jest.requireMock('firebase/firestore').doc;
const mockSetDoc = jest.requireMock('firebase/firestore').setDoc;
const mockServerTimestamp = jest.requireMock('firebase/firestore').serverTimestamp;

const mockRef = jest.requireMock('firebase/database').ref;
const mockSet = jest.requireMock('firebase/database').set;

const mockStorageRef = jest.requireMock('firebase/storage').ref;
const mockUploadString = jest.requireMock('firebase/storage').uploadString;



describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMapAuthError.mockReturnValue('Test error message');
  });

  it('renders correctly with all form fields', () => {
    const { getByTestId } = render(
      <SignUpScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    expect(getByTestId('signup.displayName')).toBeTruthy();
    expect(getByTestId('signup.email')).toBeTruthy();
    expect(getByTestId('signup.password')).toBeTruthy();
    expect(getByTestId('signup.submit')).toBeTruthy();
  });

  it('shows validation error for invalid email', async () => {
    const { getByTestId, getByText } = render(
      <SignUpScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    const displayNameInput = getByTestId('signup.displayName');
    const emailInput = getByTestId('signup.email');
    const passwordInput = getByTestId('signup.password');
    const confirmPasswordInput = getByTestId('signup.confirmPassword');
    const submitButton = getByTestId('signup.submit');

    // Fill display name first
    fireEvent.changeText(displayNameInput, 'Test User');
    // Fill required fields first
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    // Enter invalid email
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText(/Please enter a valid email address/)).toBeTruthy();
    });
  });

  it('shows validation error for weak password', async () => {
    const { getByTestId, getByText } = render(
      <SignUpScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    const displayNameInput = getByTestId('signup.displayName');
    const emailInput = getByTestId('signup.email');
    const passwordInput = getByTestId('signup.password');
    const submitButton = getByTestId('signup.submit');

    // Fill required fields first
    fireEvent.changeText(displayNameInput, 'Test User');
    fireEvent.changeText(emailInput, 'test@example.com');
    // Enter weak password
    fireEvent.changeText(passwordInput, '123');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText(/Password must be at least 6 characters long/)).toBeTruthy();
    });
  });

  it('shows validation error for empty name', async () => {
    const { getByTestId, getByText } = render(
      <SignUpScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    const submitButton = getByTestId('signup.submit');

    // Submit without entering name
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText(/Display name is required/)).toBeTruthy();
    });
  });

  it('handles successful sign up', async () => {
    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: 'test-uid', email: 'test@example.com' },
    });
    mockUpdateProfile.mockResolvedValueOnce(undefined);
    
    // Mock Firestore
    mockDoc.mockReturnValue('mock-doc-ref');
    mockSetDoc.mockResolvedValueOnce(undefined);
    mockServerTimestamp.mockReturnValue('mock-timestamp');
    
    // Mock Database
    mockRef.mockReturnValue('mock-db-ref');
    mockSet.mockResolvedValueOnce(undefined);
    
    // Mock Storage
    mockStorageRef.mockReturnValue('mock-storage-ref');
    mockUploadString.mockResolvedValueOnce(undefined);
    
    mockSendEmailVerification.mockResolvedValueOnce(undefined);

    const { getByTestId } = render(
      <SignUpScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    const nameInput = getByTestId('signup.displayName');
    const emailInput = getByTestId('signup.email');
    const passwordInput = getByTestId('signup.password');
    const confirmPasswordInput = getByTestId('signup.confirmPassword');
    const submitButton = getByTestId('signup.submit');

    // Fill form with valid data
    fireEvent.changeText(nameInput, 'Test User');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');

    // Submit form
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        'password123'
      );
    });

    // Note: SignUpScreen doesn't call sendEmailVerification
    // The test passes if we reach this point without errors
  });

  it('handles Firebase auth errors gracefully', async () => {
    const mockError = {
      code: 'auth/email-already-in-use',
      message: 'Email already in use',
    };

    mockCreateUserWithEmailAndPassword.mockRejectedValueOnce(mockError);
    mockMapAuthError.mockReturnValueOnce('An account with this email already exists. Please sign in instead.');
    
    // Mock Firestore
    mockDoc.mockReturnValue('mock-doc-ref');
    mockSetDoc.mockResolvedValueOnce(undefined);
    mockServerTimestamp.mockReturnValue('mock-timestamp');
    
    // Mock Database
    mockRef.mockReturnValue('mock-db-ref');
    mockSet.mockResolvedValueOnce(undefined);
    
    // Mock Storage
    mockStorageRef.mockReturnValue('mock-storage-ref');
    mockUploadString.mockResolvedValueOnce(undefined);

    const { getByTestId, getByText } = render(
      <SignUpScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    const nameInput = getByTestId('signup.displayName');
    const emailInput = getByTestId('signup.email');
    const passwordInput = getByTestId('signup.password');
    const confirmPasswordInput = getByTestId('signup.confirmPassword');
    const submitButton = getByTestId('signup.submit');

    // Fill form with valid data
    fireEvent.changeText(nameInput, 'Test User');
    fireEvent.changeText(emailInput, 'existing@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');

    // Submit form
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockMapAuthError).toHaveBeenCalledWith(mockError);
    });

    await waitFor(() => {
      expect(getByText('An account with this email already exists. Please sign in instead.')).toBeTruthy();
    });
  });

  it('navigates to login screen when login link is pressed', () => {
    const { getByTestId } = render(
      <SignUpScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    const loginLink = getByTestId('auth.switchToLogin');
    fireEvent.press(loginLink);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });
});
