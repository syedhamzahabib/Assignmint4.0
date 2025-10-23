# Device Testing Guide for AssignMint

## Overview
This guide provides step-by-step instructions for testing Google Sign-In and Apple Sign-In on physical iOS devices.

## Prerequisites
- Physical iOS device (iPhone/iPad)
- Apple Developer Account
- Xcode installed on Mac
- Device registered in Apple Developer Portal

## 1. Google Sign-In Setup

### iOS Configuration
The following has been configured in `ios/Assignmint/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>REVERSED_CLIENT_ID</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>com.googleusercontent.apps.772572800538-v75af2ikfnkldobrpr4tlr6h76kbsmpp</string>
        </array>
    </dict>
</array>
```

### GoogleService-Info.plist
- ✅ File exists at `ios/GoogleService-Info (1).plist`
- ✅ Contains correct `REVERSED_CLIENT_ID`
- ✅ Contains correct `CLIENT_ID`

### Testing Steps
1. **Build and deploy to device:**
   ```bash
   npx react-native run-ios --device
   ```

2. **Test Google Sign-In:**
   - Tap "Sign in with Google" button
   - Should open Google OAuth flow
   - Complete authentication
   - Should return to app with user signed in

## 2. Apple Sign-In Setup

### Xcode Configuration Required
1. **Open Xcode project:**
   ```bash
   open ios/Assignmint.xcworkspace
   ```

2. **Enable Sign in with Apple capability:**
   - Select the Assignmint target
   - Go to "Signing & Capabilities" tab
   - Click "+ Capability"
   - Add "Sign in with Apple"

3. **Configure Apple Sign-In:**
   - In Apple Developer Portal, enable "Sign in with Apple" for your app
   - Add your app's bundle ID: `com.assignmint.app`

### Testing Steps
1. **Build and deploy to device:**
   ```bash
   npx react-native run-ios --device
   ```

2. **Test Apple Sign-In:**
   - Tap "Sign in with Apple" button
   - Should open Apple Sign-In flow
   - Complete authentication with Face ID/Touch ID
   - Should return to app with user signed in

## 3. Email/Password Authentication

### Simulator Testing (Already Working)
- ✅ Firebase Auth initialized
- ✅ Email/password signup/login works
- ✅ Uses Firebase web fallback in simulator

### Device Testing
1. **Build and deploy to device:**
   ```bash
   npx react-native run-ios --device
   ```

2. **Test Email/Password:**
   - Create new account with email/password
   - Sign in with existing credentials
   - Verify user state persists across app restarts

## 4. Troubleshooting

### Common Issues

#### Google Sign-In Not Working
- Verify `REVERSED_CLIENT_ID` in Info.plist matches GoogleService-Info.plist
- Check that GoogleService-Info.plist is added to Xcode project
- Ensure device is registered in Google Cloud Console

#### Apple Sign-In Not Working
- Verify "Sign in with Apple" capability is enabled in Xcode
- Check that bundle ID matches Apple Developer Portal
- Ensure device is signed in with Apple ID

#### Firebase Auth Errors
- Check that all environment variables are loaded correctly
- Verify Firebase project configuration
- Check network connectivity

### Debug Commands
```bash
# Check device logs
xcrun simctl spawn [DEVICE_ID] log show --predicate 'process == "Assignmint"' --info --debug

# Build for device
npx react-native run-ios --device

# Clean build
npx react-native run-ios --device --reset-cache
```

## 5. Environment Variables

### Required Variables (Already Configured)
- `FB_API_KEY` ✅
- `FB_AUTH_DOMAIN` ✅
- `FB_PROJECT_ID` ✅
- `FB_STORAGE_BUCKET` ✅
- `FB_MESSAGING_SENDER_ID` ✅
- `FB_APP_ID` ✅
- `GOOGLE_WEB_CLIENT_ID` ✅

### Optional Variables
- `FB_MEASUREMENT_ID` (for analytics)

## 6. Next Steps

1. **Test on physical device** using the steps above
2. **Implement Google Sign-In** in the authentication screens
3. **Implement Apple Sign-In** in the authentication screens
4. **Test all authentication flows** end-to-end
5. **Verify user state persistence** across app restarts

## 7. Production Considerations

- Update Firebase project settings for production
- Configure proper OAuth redirect URLs
- Test on multiple device types and iOS versions
- Implement proper error handling and user feedback
- Consider implementing biometric authentication for enhanced security
