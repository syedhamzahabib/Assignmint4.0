<!-- 07ccdae4-49c6-4cfb-92d7-4e2a2ab5c3a2 1ad53ab8-a0fd-46fd-88b6-8fe94698c9ad -->
# AssignMint Developer Onboarding Guide

## Overview

Create a detailed technical brief that covers:

1. **App Overview & Purpose**

- What AssignMint is and its core value proposition
- The main user flow: Post → Match → Deliver → Pay
- Target platforms (iOS and Android) with shared codebase

2. **Current App Structure**

- Navigation architecture (RootNavigator → Auth/MainTabs)
- Major screens and their purposes
- Component organization
- Service layer architecture

3. **Firebase Integration**

- Key Firebase modules (Auth, Firestore, Storage, Cloud Messaging)
- Current integration status
- Configuration files and setup

4. **Step-by-Step Firebase Setup**

- Firebase Console configuration
- Android-specific setup
- iOS considerations (existing setup)
- Environment variables and config files

5. **Recommended Firestore Schema**

- Users collection structure
- Tasks collection structure  
- Submissions and payments collections
- Indexes and security rules

6. **React Native Bare Workflow Cautions**

- Android vs iOS differences
- Native module considerations
- Build configuration differences
- Testing on both platforms

7. **First 3 Tasks**

- Verify Firebase connection on Android
- Set up Firestore collections and test queries
- Implement basic push notification setup for Android

8. **Development with Cursor & ChatGPT**

- How to use Cursor AI for code completion and refactoring
- Best practices for asking ChatGPT for help
- Project-specific context to provide
- Common debugging workflows

## Key Files to Reference

- `package.json` - Dependencies and scripts
- `App.tsx` - App entry point with Firebase initialization
- `src/lib/firebase.ts` - Firebase configuration
- `src/types/firestore.ts` - Database schema types
- `src/services/firestoreService.ts` - Firestore service layer
- `src/state/AuthProvider.tsx` - Authentication state management
- `src/navigation/*` - Navigation structure
- `android/app/build.gradle` - Android build configuration
- `firestore.rules` - Security rules
- `docs/FIREBASE_SETUP.md` - Existing Firebase setup guide

## Deliverable

A comprehensive markdown document that:

- Is easy to understand for someone new to the project
- Provides actionable steps with code examples
- Includes warnings about platform-specific issues
- Gives clear first tasks to get started
- Shows how to leverage AI tools effectively

## CRITICAL: New Developer Context

**Your Friend's Role:**

Helping with Android app development - specifically Firebase integration and notifications.

**Project Growth:**

AssignMint will scale significantly. Need robust, scalable Firebase frontend integration.

**Platform Rules:**

- ❌ **NEVER modify iOS files** (`ios/` folder, `Info.plist`, `Podfile`, etc.)
- ✅ **Only work on Android** (`android/` folder, Android-specific code)
- ✅ **Write cross-platform code** (works on both iOS/Android)
- ✅ **Test only on Android** (emulator or physical device)

**iOS vs Android Notifications:**

- **iOS**: Already configured with APNs + FCM - DON'T TOUCH
- **Android**: Your friend will set up FCM from scratch
- Different permission systems, different native code
- Share JavaScript notification handling logic

**Main Responsibilities:**

1. **Firebase Frontend Connection**

   - Replace mock data with real Firestore queries
   - Set up real-time listeners (tasks, chats, notifications)
   - Implement authentication flows on Android
   - Enable offline persistence

2. **Android Notifications (FCM)**

   - Add `google-services.json` to Android
   - Request permissions (Android 13+ requires runtime permission)
   - Handle foreground/background/quit state notifications
   - Deep link from notifications to app screens
   - Test thoroughly on Android

3. **Cross-Platform Code**

   - Use `Platform.OS` checks when needed
   - Keep business logic platform-agnostic
   - Only add platform-specific code when absolutely necessary
   - Document any platform differences

**Architecture for Scale:**

```
src/
├── services/
│   ├── fcmService.ts          # Shared notification logic
│   ├── fcmService.android.ts  # Android-specific (if needed)
│   ├── fcmService.ios.ts      # iOS-specific (don't create/modify)
│   └── firestoreService.ts    # Shared Firestore logic
```

### To-dos

- [ ] 