# AssignMint iPhone Deployment & Smoke Test Guide

## Prerequisites ✅
- ✅ iPhone "Syed Hamza's iPhone (18.6.2)" connected
- ✅ Xcode workspace ready
- ✅ Apple Sign-In disabled for free account compatibility
- ✅ Google Sign-In enabled for testing

## Step 1: Xcode Setup

### 1.1 Open Xcode Workspace
```bash
open ios/Assignmint.xcworkspace
```

### 1.2 Configure Signing & Capabilities
1. **Select AssignMint target** in the project navigator
2. **Go to "Signing & Capabilities" tab**
3. **Verify/Configure:**
   - ✅ **"Automatically manage signing"** is enabled
   - ✅ **Team** = Your Apple ID personal team (free)
   - ✅ **Bundle Identifier** = `com.assignmint.app`

### 1.3 Add Required Capabilities
Click **"+ Capability"** and add:
- ✅ **Push Notifications**
- ✅ **Background Modes** → Enable "Remote notifications"
- ❌ **DO NOT add "Sign in with Apple"** (disabled for free account)

### 1.4 Verify Configuration
- **Provisioning Profile**: Should show "Xcode Managed Profile"
- **Signing Certificate**: Should show your Apple ID
- **No red error messages** in the capabilities section

## Step 2: Build to Device

### Option A: Using Xcode (Recommended)
1. **Select your iPhone** in the device dropdown (top toolbar)
2. **Click the Play button (▶️)** or press `Cmd+R`
3. **Wait for build** to complete (may take 2-3 minutes first time)
4. **App will install and launch** automatically

### Option B: Using CLI
```bash
cd /Users/hamza/Assignmint3
npx react-native run-ios --device "Syed Hamza's iPhone"
```

**Note**: If device name has special characters, use device ID:
```bash
npx react-native run-ios --device "00008120-0009246214A0C01E"
```

## Step 3: Smoke Test Checklist

### 3.1 App Launch ✅
- [ ] App installs successfully on iPhone
- [ ] App launches without crashes
- [ ] Splash screen appears briefly
- [ ] Main interface loads

### 3.2 Navigation Test ✅
- [ ] **Home Screen**: Loads without errors
- [ ] **Post Task**: Navigate to task creation screen
- [ ] **My Tasks**: View user's tasks (may be empty initially)
- [ ] **Profile**: Access profile screen
- [ ] **Back Navigation**: All screens can navigate back properly

### 3.3 Authentication Tests

#### Email/Password Authentication ✅
- [ ] **Sign Up Flow**:
  - [ ] Tap "Sign up" or "Create Account"
  - [ ] Fill in display name, email, password
  - [ ] Submit form successfully
  - [ ] Check email for verification link
  - [ ] Click verification link in email
  - [ ] Return to app and sign in
- [ ] **Sign In Flow**:
  - [ ] Enter verified email/password
  - [ ] Successfully sign in
  - [ ] Navigate to authenticated screens

#### Google Sign-In ✅
- [ ] **Google Button**: Tap "Continue with Google"
- [ ] **SafariViewController**: Opens Google OAuth flow
- [ ] **Authentication**: Complete Google login
- [ ] **Return to App**: Successfully authenticated
- [ ] **User Data**: Profile shows Google account info

#### Apple Sign-In 🚧
- [ ] **Button Display**: Shows "Sign in with Apple (Coming Soon)"
- [ ] **No Crashes**: Button is disabled but doesn't cause errors
- [ ] **Visual Feedback**: Button appears disabled/grayed out

### 3.4 Profile & Data Tests ✅
- [ ] **Profile Screen**: Loads user information
- [ ] **Fallback Data**: Shows placeholders if Firestore data not ready
- [ ] **Settings**: Access to app settings/preferences
- [ ] **Sign Out**: Successfully sign out and return to login

### 3.5 Push Notifications ⚠️
- [ ] **Permission Request**: App requests notification permission
- [ ] **Device Token**: Check Xcode console for device token log
- [ ] **Note**: May be limited with free provisioning profile

## Step 4: Troubleshooting

### 4.1 Build Failures

#### "No provisioning profile found"
**Solution:**
1. **Xcode** → **Preferences** → **Accounts**
2. **Select your Apple ID** → **Download Manual Profiles**
3. **Return to project** → **Signing & Capabilities**
4. **Refresh** the provisioning profile dropdown
5. **Clean build folder**: `Product` → `Clean Build Folder`

#### "Bundle identifier doesn't match"
**Solution:**
1. **Verify Bundle ID** in Xcode: `com.assignmint.app`
2. **Check Firebase Console**: Ensure iOS app bundle ID matches
3. **Update GoogleService-Info.plist**: Verify `BUNDLE_ID` matches

#### "Code signing error"
**Solution:**
1. **Reset signing**: Uncheck "Automatically manage signing"
2. **Re-enable**: Check "Automatically manage signing" again
3. **Select team**: Choose your Apple ID personal team
4. **Clean and rebuild**

### 4.2 Runtime Issues

#### Google Sign-In Fails
**Check:**
1. **REVERSED_CLIENT_ID** in `Info.plist` matches `GoogleService-Info.plist`
2. **GoogleService-Info.plist** is added to Xcode project
3. **Device is registered** in Google Cloud Console

#### App Crashes on Launch
**Debug:**
1. **Check Xcode console** for error messages
2. **Verify all dependencies** are installed: `cd ios && pod install`
3. **Clean build**: `Product` → `Clean Build Folder`

#### Navigation Issues
**Check:**
1. **Navigation stack** is properly configured
2. **Screen components** are imported correctly
3. **Route names** match navigation definitions

## Step 5: Success Criteria

### ✅ Deployment Success
- [ ] App builds without errors
- [ ] App installs on iPhone
- [ ] App launches successfully
- [ ] No crashes during basic navigation

### ✅ Authentication Success
- [ ] Email/password signup and login works
- [ ] Google Sign-In completes successfully
- [ ] Apple Sign-In shows "Coming Soon" (no crashes)
- [ ] User can sign out and sign back in

### ✅ Core Features Success
- [ ] All main screens load without errors
- [ ] Navigation between screens works
- [ ] Profile data loads (or shows appropriate fallbacks)
- [ ] Push notification permission is requested

## Step 6: Next Steps After Successful Deployment

1. **Test on different network conditions** (WiFi vs Cellular)
2. **Test app performance** with longer usage sessions
3. **Verify data persistence** across app restarts
4. **Test edge cases** (network disconnection, etc.)
5. **Prepare for TestFlight** submission if needed

## Debug Commands

### View Device Logs
```bash
# Real-time app logs
xcrun simctl spawn booted log show --predicate 'process == "Assignmint"' --info --debug
```

### Clean Build
```bash
# Clean everything and rebuild
npx react-native run-ios --device --reset-cache
```

### Check Dependencies
```bash
# Verify pods are installed
cd ios && pod install
```

---

**Device**: Syed Hamza's iPhone (18.6.2)  
**Bundle ID**: com.assignmint.app  
**Status**: Ready for deployment  
**Last Updated**: January 2025
