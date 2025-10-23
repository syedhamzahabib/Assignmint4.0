# AssignMint iOS Device Deployment Guide

## Overview
This guide will help you deploy the AssignMint iOS app to your physical iPhone for live testing of Google/Apple Sign-In, push notifications, and email verification.

## Prerequisites ✅
- ✅ Physical iPhone connected: "Syed Hamza's iPhone (18.6.2)"
- ✅ Xcode installed and workspace opened
- ✅ CocoaPods dependencies installed
- ✅ Firebase configuration files in place

## Step-by-Step Deployment Process

### 1. Device Setup ✅
Your iPhone "Syed Hamza's iPhone (18.6.2)" is already connected and detected by Xcode.

### 2. Xcode Configuration

#### 2.1 Open Xcode Workspace
```bash
open ios/Assignmint.xcworkspace
```

#### 2.2 Configure Signing & Capabilities
1. **Select the AssignMint target** in the project navigator
2. **Go to "Signing & Capabilities" tab**
3. **Enable "Automatically manage signing"**
4. **Select your Apple Developer Team** (use free provisioning if needed)
5. **Add required capabilities:**
   - Click "+ Capability" and add:
     - ~~**Sign in with Apple**~~ (DISABLED for free account compatibility)
     - **Push Notifications**
     - **Background Modes** → Enable "Remote notifications"

**Note:** Apple Sign-In has been temporarily disabled to work with free Apple Developer accounts. The UI shows "Coming Soon" instead.

#### 2.3 Verify Bundle Identifier
- Ensure Bundle Identifier is: `com.assignmint.app`
- This matches your Firebase configuration

### 3. Info.plist Configuration ✅
The following has been configured:

#### 3.1 URL Types (Google Sign-In)
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

#### 3.2 Privacy Usage Descriptions ✅
Added the following privacy keys:
- `NSLocationWhenInUseUsageDescription` - For nearby tasks
- `NSCameraUsageDescription` - For task attachments
- `NSPhotoLibraryUsageDescription` - For image selection
- `NSMicrophoneUsageDescription` - For audio notes

### 4. Build & Run

#### Option A: Using React Native CLI (Recommended)
```bash
cd /Users/hamza/Assignmint3
npx react-native run-ios --device "Syed Hamza's iPhone"
```

#### Option B: Using Xcode
1. **Select your iPhone** as the destination in Xcode
2. **Click the Play button (▶️)** or press `Cmd+R`
3. **Wait for build and installation** to complete

### 5. Testing Checklist

#### 5.1 App Installation ✅
- [ ] App installs successfully on device
- [ ] App launches without crashes
- [ ] App displays the main interface

#### 5.2 Email/Password Authentication
- [ ] Create new account with email/password
- [ ] Verify email verification is sent
- [ ] Sign in with existing credentials
- [ ] User state persists across app restarts

#### 5.3 Google Sign-In
- [ ] Tap "Sign in with Google" button
- [ ] Google OAuth flow opens in SafariViewController
- [ ] Complete authentication successfully
- [ ] Return to app with user signed in

#### 5.4 Apple Sign-In
- [ ] Tap "Sign in with Apple" button
- [ ] Apple Sign-In flow appears
- [ ] Complete authentication with Face ID/Touch ID
- [ ] Return to app with user signed in

#### 5.5 Push Notifications
- [ ] App requests notification permissions
- [ ] Device token appears in logs
- [ ] Test notification delivery (if backend is configured)

### 6. Troubleshooting

#### Common Issues & Solutions

##### 6.1 Signing Errors
**Problem:** "No matching provisioning profile found"
**Solution:**
1. Go to Xcode → Preferences → Accounts
2. Add your Apple ID
3. Download manual profiles
4. Or use "Automatically manage signing"

##### 6.2 Bundle Identifier Mismatch
**Problem:** "Bundle identifier doesn't match"
**Solution:**
1. Ensure Bundle ID is exactly: `com.assignmint.app`
2. Check Firebase project configuration
3. Verify GoogleService-Info.plist matches

##### 6.3 Google Sign-In Not Working
**Problem:** Google Sign-In fails or doesn't open
**Solution:**
1. Verify `REVERSED_CLIENT_ID` in Info.plist matches GoogleService-Info.plist
2. Check that GoogleService-Info.plist is added to Xcode project
3. Ensure device is registered in Google Cloud Console

##### 6.4 Apple Sign-In Not Working
**Problem:** Apple Sign-In button doesn't appear or fails
**Solution:**
1. Verify "Sign in with Apple" capability is enabled in Xcode
2. Check that bundle ID matches Apple Developer Portal
3. Ensure device is signed in with Apple ID

##### 6.5 Build Errors
**Problem:** Build fails with various errors
**Solution:**
```bash
# Clean and rebuild
cd ios
rm -rf build
rm -rf Pods
rm Podfile.lock
pod install
cd ..
npx react-native run-ios --device
```

### 7. Debug Commands

#### 7.1 Check Device Logs
```bash
# View app logs in real-time
xcrun simctl spawn booted log show --predicate 'process == "Assignmint"' --info --debug
```

#### 7.2 Clean Build
```bash
# Clean everything and rebuild
npx react-native run-ios --device --reset-cache
```

#### 7.3 Check Device Connection
```bash
# List connected devices
xcrun xctrace list devices
```

### 8. Production Considerations

#### 8.1 Apple Developer Portal
- Register your app's bundle ID: `com.assignmint.app`
- Enable "Sign in with Apple" capability
- Configure push notification certificates

#### 8.2 Google Cloud Console
- Add your iOS bundle ID to OAuth clients
- Configure authorized redirect URIs
- Enable required APIs

#### 8.3 Firebase Console
- Verify iOS app configuration
- Test authentication methods
- Configure push notification settings

### 9. Next Steps After Successful Deployment

1. **Test all authentication flows** thoroughly
2. **Verify push notifications** work correctly
3. **Test app functionality** on physical device
4. **Performance testing** on real hardware
5. **Prepare for TestFlight** submission if needed

## Support

If you encounter any issues during deployment:
1. Check the troubleshooting section above
2. Review Xcode build logs for specific errors
3. Verify all configuration files are correct
4. Ensure all dependencies are properly installed

---

**Last Updated:** January 2025
**iOS Version:** 18.6.2
**Xcode Version:** Latest
**React Native Version:** 0.79.5
