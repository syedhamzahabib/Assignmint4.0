# Xcode Signing Configuration Fix

## Current Issue
Build failing with **error code 70** - this indicates a **signing/provisioning profile issue**.

## Manual Xcode Configuration Required

### Step 1: Open Xcode
```bash
open ios/Assignmint.xcworkspace
```

### Step 2: Configure Signing
1. **Select "Assignmint" target** in the project navigator (left sidebar)
2. **Click "Signing & Capabilities" tab** (top of main area)
3. **Enable "Automatically manage signing"** checkbox
4. **Select your Apple ID team** from the "Team" dropdown
   - Should show: "Your Name (Personal Team)" or similar
   - If not listed, add your Apple ID in Xcode → Preferences → Accounts

### Step 3: Add Capabilities
1. **Click "+ Capability"** button
2. **Add "Push Notifications"**
3. **Add "Background Modes"** → Check "Remote notifications"
4. **DO NOT add "Sign in with Apple"** (we disabled this for free account)

### Step 4: Verify Bundle ID
- **Bundle Identifier** should be: `com.assignmint.app`
- **Provisioning Profile** should show "Xcode Managed Profile"
- **Signing Certificate** should show your Apple ID

### Step 5: Build
1. **Select your iPhone** in the device dropdown (top toolbar)
2. **Click Play button (▶️)** or press `Cmd+R`
3. **Wait for build** to complete

## Troubleshooting Common Issues

### "No provisioning profile found"
1. **Xcode** → **Preferences** → **Accounts**
2. **Select your Apple ID** → **Download Manual Profiles**
3. **Return to project** → **Signing & Capabilities**
4. **Refresh** the team dropdown

### "Bundle identifier is not available"
1. **Change Bundle ID** to something unique like: `com.yourname.assignmint`
2. **Update Firebase** with new bundle ID
3. **Update GoogleService-Info.plist** with new bundle ID

### "Code signing error"
1. **Clean build folder**: `Product` → `Clean Build Folder`
2. **Reset signing**: Uncheck then re-check "Automatically manage signing"
3. **Select team** again from dropdown

## After Successful Xcode Configuration

Once Xcode is configured, you can use either method:

### Method 1: Xcode (Recommended)
- Select iPhone → Click Play button (▶️)

### Method 2: CLI
```bash
npx react-native run-ios --device "00008120-0009246214A0C01E"
```

## Expected Result
- ✅ App builds successfully
- ✅ App installs on iPhone
- ✅ App launches without crashes
- ✅ Ready for smoke testing

---

**Error Code 70**: Signing/Provisioning issue  
**Solution**: Manual Xcode configuration required  
**Status**: Waiting for Xcode setup
