import React, { useState } from 'react';
import { Alert, ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS } from '../constants';
import { analytics, ANALYTICS_EVENTS } from '../services/AnalyticsService';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, set } from 'firebase/database';
import { ref as storageRef, uploadString } from 'firebase/storage';
import { auth, db, database, storage } from '../lib/firebase';
import { ROUTES } from '../types/navigation';
import { mapAuthError } from '../utils/authError';

interface SignUpScreenProps {
  navigation: any;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSignUp = async () => {
    setError('');
    const e = email.trim().toLowerCase();
    
    // Validation
    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }
    
    if (!e || !password) {
      setError('Please fill all fields');
      return;
    }
    
    if (!e.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    analytics.track(ANALYTICS_EVENTS.SIGN_UP_START, { email: e });
    setIsLoading(true);
    
    try {
      console.log('🚀 Starting signup process with Firebase Web SDK...');
      console.log('📧 Email:', e);
      console.log('👤 Display Name:', displayName);
      console.log('🔐 Password length:', password.length);
      
      // 1) Native Firebase Auth - this must succeed
      console.log('📝 Creating Firebase user with Web SDK...');
      const cred = await createUserWithEmailAndPassword(auth, e, password);
      console.log('✅ Firebase user created:', cred.user.uid);
      
      // 2) Update profile with display name
      console.log('👤 Updating user profile...');
      await updateProfile(cred.user, { displayName });
      console.log('✅ Profile updated with display name');

      // 3) Firestore profile - this must succeed
      console.log('💾 Creating Firestore profile...');
      await setDoc(doc(db, 'users', cred.user.uid), {
        displayName,
        email: e,
        photoURL: cred.user.photoURL ?? null,
        role: 'user',
        stripeCustomerId: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      console.log('✅ Firestore profile created');

      // 4) Non-blocking operations (RTDB and Storage seeds)
      console.log('🌱 Starting non-blocking operations...');
      const nonBlockingOps = [
        set(ref(database, `users/${cred.user.uid}/profile`), {
          displayName,
          email: e,
          createdAt: Date.now(),
        }),
        uploadString(ref(storage, `users/${cred.user.uid}/hello.txt`), 'Hi', 'raw'),
      ];
      await Promise.allSettled(nonBlockingOps);
      console.log('✅ Non-blocking operations completed');

      analytics.track(ANALYTICS_EVENTS.SIGN_UP_COMPLETE, { email: e });
              // AuthProvider will handle navigation to Home automatically
      console.log('🎉 Signup completed successfully');
      
    } catch (err: any) {
      console.error('[AUTH] SIGNUP_ERROR', err);
      setError(mapAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLanding = () => {
    navigation.navigate(ROUTES.LANDING);
  };

  const handleSignIn = () => {
    navigation.navigate(ROUTES.LOGIN);
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
          <Text style={styles.headerTitle}>Create Account</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.title}>Join AssignMint</Text>
          <Text style={styles.subtitle}>
            Create your account to start posting tasks and connecting with experts
          </Text>

          {/* Display Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter your display name"
              autoCapitalize="words"
              autoCorrect={false}
              testID="signup.displayName"
            />
          </View>

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
              testID="signup.email"
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
                testID="signup.password"
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
            <Text style={styles.hint}>Must be at least 8 characters</Text>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                testID="signup.confirmPassword"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Error Display */}
          {error ? (
            <Text style={styles.errorText} testID="signup.error">
              {error}
            </Text>
          ) : null}

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signUpButton, (isLoading || !displayName.trim() || !email.trim() || !password || !confirmPassword) && styles.disabledButton]}
            onPress={handleSignUp}
            disabled={isLoading || !displayName.trim() || !email.trim() || !password || !confirmPassword}
            activeOpacity={0.8}
            testID="signup.submit"
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.signUpButtonText}>Create Account</Text>
            )}
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

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleSignIn} testID="auth.switchToLogin">
              <Text style={styles.signInLink}>Sign in</Text>
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
  hint: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  signUpButton: {
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
  signUpButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  signInText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  signInLink: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: FONTS.weights.semiBold,
  },
});

export default SignUpScreen;
