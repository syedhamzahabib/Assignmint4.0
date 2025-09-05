import React, { useState } from 'react';
import { Alert, ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS } from '../constants';
import { analytics, ANALYTICS_EVENTS } from '../services/AnalyticsService';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../state/AuthProvider';
import { ROUTES } from '../types/navigation';
import { mapAuthError } from '../utils/authError';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { enterGuest } = useAuth();

  const handleSignIn = async () => {
    setError('');
    const e = email.trim().toLowerCase();
    
    // Validation
    if (!e || !password) {
      setError('Email and password are required');
      return;
    }
    
    if (!e.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, e, password);
      analytics.track(ANALYTICS_EVENTS.SIGN_IN_COMPLETE, { email: e });
      console.log('✅ Login completed successfully');
      // AuthProvider will handle navigation to Home automatically
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      setError(mapAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLanding = () => {
    navigation.navigate(ROUTES.LANDING);
  };

  const handleSignUp = () => {
    navigation.navigate(ROUTES.SIGN_UP);
  };

  const handleForgotPassword = () => {
    navigation.navigate(ROUTES.FORGOT_PASSWORD);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToLanding}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign In</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to your account to continue
          </Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              testID="login.email"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                testID="login.password"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Error Display */}
          {error ? (
            <Text style={styles.errorText} testID="login.error">
              {error}
            </Text>
          ) : null}

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={handleForgotPassword}
            testID="login.forgotPassword"
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.signInButton, (isLoading || !email.trim() || !password) && styles.disabledButton]}
            onPress={handleSignIn}
            disabled={isLoading || !email.trim() || !password}
            activeOpacity={0.8}
            testID="login.submit"
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Continue as Guest Button */}
          <TouchableOpacity
            style={styles.guestButton}
            onPress={async () => {
              try {
                console.log('🔄 Entering guest mode...');
                await enterGuest();
                console.log('✅ Guest mode entered successfully');
                // Navigate to home after entering guest mode
                // AuthProvider will handle navigation to Home automatically
              } catch (error) {
                console.error('❌ Failed to enter guest mode:', error);
                Alert.alert('Error', 'Failed to enter guest mode. Please try again.');
              }
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* OAuth Buttons */}
          <TouchableOpacity style={styles.oauthButton} disabled>
            <Ionicons name="logo-google" size={20} color={COLORS.text} />
            <Text style={styles.oauthButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.oauthButton} disabled>
            <Ionicons name="logo-apple" size={20} color={COLORS.text} />
            <Text style={styles.oauthButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp} testID="auth.switchToSignUp">
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  form: {
    flex: 1,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: 32,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  eyeButton: {
    padding: 12,
  },
  errorText: {
    color: COLORS.error || '#FF3B30',
    fontSize: FONTS.sizes.sm,
    marginBottom: 16,
    textAlign: 'center',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
    textAlign: 'center',
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  guestButtonText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
    opacity: 0.5,
  },
  oauthButtonText: {
    marginLeft: 8,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontWeight: FONTS.weights.medium,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  signUpText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  signUpLink: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: FONTS.weights.semiBold,
  },
});

export default LoginScreen;
