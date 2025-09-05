# Firebase Authentication Setup Guide

## Prerequisites

1. **Firebase Project**: Create a new project at [Firebase Console](https://console.firebase.google.com/)
2. **React Native CLI**: Ensure you're using React Native CLI (not Expo)
3. **Dependencies**: All required packages are already installed

## Step 1: Firebase Console Configuration

### 1.1 Enable Authentication
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Ensure **Email link (passwordless sign-in)** is disabled for now

### 1.2 Create Firestore Database
1. Go to **Firestore Database** > **Create database**
2. Choose **Start in test mode** (we'll add security rules later)
3. Select a location close to your users

### 1.3 Create Realtime Database (Optional)
1. Go to **Realtime Database** > **Create database**
2. Choose **Start in test mode**
3. Select a location

### 1.4 Create Storage Bucket
1. Go to **Storage** > **Get started**
2. Choose **Start in test mode**
3. Select a location

## Step 2: Update Firebase Configuration

Replace the placeholder values in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: 'YOUR_ACTUAL_API_KEY',
  authDomain: 'YOUR_ACTUAL_PROJECT.firebaseapp.com',
  projectId: 'YOUR_ACTUAL_PROJECT_ID',
  storageBucket: 'YOUR_ACTUAL_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_ACTUAL_SENDER_ID',
  appId: 'YOUR_ACTUAL_APP_ID',
  databaseURL: 'https://YOUR_ACTUAL_PROJECT_ID-default-rtdb.firebaseio.com',
};
```

**To find these values:**
1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click on your app or create a new one
4. Copy the config values

## Step 3: Apply Security Rules

### 3.1 Firestore Rules
Go to **Firestore Database** > **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, create, update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
  }
}
```

### 3.2 Realtime Database Rules
Go to **Realtime Database** > **Rules** and paste:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

### 3.3 Storage Rules
Go to **Storage** > **Rules** and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{uid}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## Step 4: Test the Implementation

### 4.1 Sign Up Flow
1. Run the app
2. Navigate to Sign Up screen
3. Fill out the form with a new email
4. Submit and check:
   - Firebase Auth: User appears in Authentication > Users
   - Firestore: Document created in `users/{uid}`
   - Realtime Database: Profile data in `users/{uid}/profile`
   - Storage: File created in `users/{uid}/hello.bin`

### 4.2 Login Flow
1. Use the credentials from signup
2. Should authenticate and navigate to Home
3. Check debug info shows "Mode: auth | user@email.com"

### 4.3 Guest Mode
1. On Login screen, tap "Continue as Guest"
2. Should navigate to Home
3. Check debug info shows "Mode: guest | Guest Mode"
4. Guest banner should appear

### 4.4 Protected Actions
1. In guest mode, try to access restricted features
2. Should see "Guest Mode Limited" prompt
3. Options: "Maybe Later" or "Sign In"

### 4.5 Persistence Test
1. Kill the app completely
2. Relaunch
3. Should maintain login state or guest mode

## Step 5: Troubleshooting

### Common Issues

#### "Firebase App named '[DEFAULT]' already exists"
- This is normal and handled by the code
- The app will use the existing instance

#### "Email/password sign up is not enabled"
- Go to Firebase Console > Authentication > Sign-in method
- Enable Email/Password provider

#### "Permission denied" errors
- Check that security rules are applied correctly
- Ensure rules are published (not just saved)

#### AsyncStorage persistence not working
- Verify `@react-native-async-storage/async-storage` is installed
- Check iOS pods are installed: `cd ios && pod install`

### Debug Information

The app shows debug info at the top of Home screen:
- **Mode**: Shows current auth mode ('auth', 'guest', or 'None')
- **User**: Shows authenticated user email or 'Guest Mode'

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. reCAPTCHA Error: `_getRecaptchaConfig is not a function`

**Problem**: This error occurs when Firebase tries to use reCAPTCHA features that aren't supported in React Native.

**Solutions**:
1. **Check Firebase Console Settings**:
   - Go to Firebase Console → Authentication → Settings → Advanced
   - Ensure "reCAPTCHA Enterprise" is **DISABLED**
   - If you see "reCAPTCHA v3" enabled, disable it temporarily

2. **Update Firebase Configuration**:
   - Make sure you're using the latest Firebase JS SDK
   - Check that all configuration values are correct
   - Ensure no emulator connections are active

3. **Clear App Cache**:
   ```bash
   # iOS
   npx react-native run-ios --reset-cache
   
   # Android  
   npx react-native run-android --reset-cache
   ```

4. **Check Firebase Project Settings**:
   - Verify Email/Password authentication is enabled
   - Ensure no custom authentication providers are interfering
   - Check that the project is not in a restricted region

#### 2. Firebase Not Initializing

**Problem**: Firebase services fail to initialize or show configuration errors.

**Solutions**:
1. **Verify Configuration Values**:
   - Check that all placeholder values in `src/lib/firebase.ts` are replaced
   - Ensure API keys and project IDs match exactly
   - Verify the project is active and not suspended

2. **Check Network Connectivity**:
   - Ensure the device/simulator has internet access
   - Check if your network blocks Firebase domains
   - Try using a different network (mobile data vs WiFi)

3. **Verify Firebase Project Status**:
   - Check Firebase Console for any service disruptions
   - Ensure billing is not suspended
   - Verify the project is not in maintenance mode

#### 3. Authentication State Not Persisting

**Problem**: Users are logged out after app restart or navigation.

**Solutions**:
1. **Check AsyncStorage Permissions**:
   - Ensure the app has storage permissions
   - Verify AsyncStorage is properly imported
   - Check for any storage quota issues

2. **Verify Auth State Listener**:
   - Check console logs for auth state changes
   - Ensure `onAuthStateChanged` is properly set up
   - Verify the listener is not being removed prematurely

#### 4. Guest Mode Not Working

**Problem**: "Continue as Guest" button doesn't function properly.

**Solutions**:
1. **Check AsyncStorage Implementation**:
   - Verify `assignmint.guestMode` key is being set
   - Check for any AsyncStorage errors in console
   - Ensure guest mode state is properly managed

2. **Verify Navigation Flow**:
   - Check that `RootNavigator` properly handles guest mode
   - Ensure guest mode doesn't conflict with auth state
   - Verify the navigation structure supports guest mode

### Debug Commands

Run these commands to help diagnose issues:

```bash
# Check Firebase configuration
npx tsc --noEmit src/lib/firebase.ts

# Test Firebase connection
# (This will run automatically when you try to sign up)

# Check for missing dependencies
npm ls firebase @react-native-async-storage/async-storage

# Verify React Native setup
npx react-native doctor
```

### Console Logs to Watch For

When testing, look for these console messages:

**✅ Success Indicators**:
```
🚀 Initializing new Firebase app...
✅ Firebase app initialized successfully
✅ Firebase Auth initialized
✅ Firebase Firestore initialized
✅ Firebase Realtime Database initialized
✅ Firebase Storage initialized
🎉 All Firebase services initialized successfully
🧪 Testing Firebase connection...
✅ Firebase connection test passed
```

**❌ Error Indicators**:
```
❌ Missing Firebase configuration fields: [apiKey, projectId]
❌ Failed to initialize Firebase app: [error]
❌ Firebase initialization error: [error]
❌ Firebase connection test failed: [error]
```

### Emergency Fallback

If Firebase continues to fail, you can temporarily disable it:

1. **Comment out Firebase imports** in affected files
2. **Use mock authentication** temporarily
3. **Focus on UI/UX testing** while resolving Firebase issues
4. **Check Firebase project settings** in the console

### Getting Help

1. **Firebase Console**: Check project status and settings
2. **Firebase Documentation**: Review React Native setup guides
3. **Community Support**: Firebase community forums
4. **Project Logs**: Check Firebase project logs for errors

---

## 🚀 Next Steps

After resolving any issues:

1. **Test Authentication Flow**: Sign up, login, logout
2. **Verify Guest Mode**: Test limited functionality
3. **Check Persistence**: Restart app to verify auth state
4. **Test Protected Actions**: Verify guest mode restrictions
5. **Monitor Console**: Watch for any remaining errors

## 📱 Production Considerations

1. **Environment Variables**: Move Firebase config to environment files
2. **Error Monitoring**: Implement proper error tracking
3. **Analytics**: Add authentication event tracking
4. **Security Rules**: Review and test security rules thoroughly
5. **Performance**: Monitor Firebase usage and costs
