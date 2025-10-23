# AssignMint Developer Onboarding Guide

**Welcome to AssignMint!** This guide will help you get up to speed on the project, integrate Firebase, and start contributing.

## 🚨 CRITICAL: Your Role & Platform Rules

**Your Role:**
You're helping with **Android app development** - specifically Firebase integration and notifications. The project will scale significantly, so we need robust, scalable Firebase frontend integration.

**Platform Rules (MUST FOLLOW):**
- ❌ **NEVER modify iOS files** (`ios/` folder, `Info.plist`, `Podfile`, etc.)
- ✅ **Only work on Android** (`android/` folder, Android-specific code)
- ✅ **Write cross-platform code** (works on both iOS/Android)
- ✅ **Test only on Android** (emulator or physical device)

**iOS vs Android Notifications:**
- **iOS**: Already configured with APNs + FCM - DON'T TOUCH
- **Android**: You will set up FCM from scratch
- Different permission systems, different native code
- Share JavaScript notification handling logic

**Your Main Responsibilities:**

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

---

## 1. What is AssignMint?

### Overview
AssignMint is a **mobile marketplace app** built with **React Native CLI (bare workflow)** that connects students who need help with assignments to other students (helpers/experts) who can assist them.

### Core Value Proposition
- **Students** post assignments they need help with, set a budget, and receive completed work
- **Helpers** browse available tasks, claim ones they can handle, and earn money
- **Platform** handles matching, communication, delivery, and secure payment via Stripe escrow

### The Main Flow
```
Post Task → Match with Helper → Deliver Work → Release Payment
```

1. **Post**: Student creates a task with details, deadline, and budget
2. **Match**: Helper claims the task (manual) or gets auto-matched (future feature)
3. **Deliver**: Helper submits completed work through the app
4. **Pay**: Student approves work, payment released via Stripe Connect

### Tech Stack
- **Frontend**: React Native 0.72.15 (CLI, bare workflow)
- **Backend**: Firebase (Auth, Firestore, Storage, Cloud Messaging)
- **Navigation**: React Navigation 7 (Stack + Bottom Tabs)
- **State**: Zustand + React Context
- **Payments**: Stripe React Native SDK
- **Platforms**: iOS (Xcode) + Android (Gradle)

---

## 2. Current App Structure

### Navigation Architecture

```
RootNavigator (App.tsx)
├── AuthNavigator (not authenticated)
│   ├── LandingScreen
│   ├── SignUpScreen
│   ├── LoginScreen
│   └── ForgotPasswordScreen
│
└── MainTabs (authenticated or guest mode)
    ├── HomeStack → HomeScreen (browse tasks)
    ├── PostStack → PostTaskScreen (create task)
    ├── MyTasksStack → MyTasksScreen (your tasks)
    ├── AIStack → AIAssistantScreen (AI helper)
    └── ProfileStack → ProfileScreen (settings, wallet)

Modal/Detail Screens (pushed on stacks):
├── TaskDetailsScreen
├── ChatThreadScreen
├── UploadDeliveryScreen
├── NotificationsScreen
├── WalletScreen
└── SettingsScreen + sub-screens
```

**Key Navigation Files:**
- `src/navigation/RootNavigator.tsx` - Top-level routing based on auth state
- `src/navigation/AppTabs.tsx` - Bottom tab navigation
- `src/navigation/stacks/*` - Individual stack navigators
- `src/navigation/types.ts` - TypeScript navigation types

### Major Screens

| Screen | Purpose | Data Source |
|--------|---------|-------------|
| `HomeScreen` | Browse available tasks, see notifications | Firestore `tasks` collection |
| `PostTaskScreen` | Multi-step wizard to post a new task | Creates in `tasks` collection |
| `MyTasksScreen` | View tasks you posted or claimed | Firestore queries filtered by user |
| `TaskDetailsScreen` | View task details, claim, chat, deliver | Single task document |
| `ChatThreadScreen` | Real-time messaging for a task | Firestore `chats/{chatId}/messages` |
| `ProfileScreen` | User profile, settings, wallet | Firestore `users/{uid}` |
| `WalletScreen` | View balance, transactions, withdrawals | Firestore `wallets`, `transactions` |

### Component Organization

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   ├── profile/          # Profile-specific components
│   ├── task/             # Task cards and task-related components
│   └── taskDetails/      # Task detail screen components
├── screens/              # Full screen components
├── navigation/           # Navigation configuration
├── services/             # Business logic and API services
├── lib/                  # Firebase initialization and utilities
├── state/                # Global state (AuthProvider, stores)
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
├── constants/            # App constants and theme
└── utils/                # Helper functions
```

### Service Layer

**Key Services:**
- `src/services/firestoreService.ts` - Firestore CRUD operations
- `src/services/taskService.ts` - Task-specific business logic
- `src/services/fcmService.ts` - Push notification handling
- `src/services/stripeService.ts` - Payment processing
- `src/state/AuthProvider.tsx` - Authentication state management

---

## 3. Firebase Integration - What's Needed

### Current Status
✅ **Configured** (iOS only):
- Firebase Auth (email/password)
- Firestore (partially)
- React Native Firebase packages installed
- `GoogleService-Info.plist` in iOS

⚠️ **Needs Work** (Android):
- Add `google-services.json` to Android
- Test Firebase Auth on Android
- Verify Firestore reads/writes on Android
- Set up Cloud Messaging for Android

### Key Firebase Modules

#### 1. Firebase Auth (`@react-native-firebase/auth`)
**Purpose**: User authentication (sign up, login, logout, password reset)

**Current Implementation**: `src/lib/firebase.ts`, `src/state/AuthProvider.tsx`

**What Works**:
- Email/password sign-up and login
- Auth state persistence
- Guest mode (no authentication)

**What You'll Do**:
- Verify it works on Android
- Ensure auth state syncs properly

#### 2. Firestore (`@react-native-firebase/firestore`)
**Purpose**: Real-time database for tasks, users, chats, notifications

**Current Implementation**: `src/services/firestoreService.ts`, `src/types/firestore.ts`

**Collections Defined**:
- `users` - User profiles and metadata
- `tasks` - Assignment tasks
- `chats` - Chat threads for tasks
- `messages` - Chat messages (subcollection)
- `notifications` - User notifications
- `wallets` - User wallet balances
- `transactions` - Payment transactions
- `aiSessions` - AI chat sessions

**What You'll Do**:
- Set up these collections in Firebase Console
- Add sample data for testing
- Create Firestore indexes for queries
- Test real-time listeners

#### 3. Cloud Storage (`@react-native-firebase/storage`)
**Purpose**: File uploads (assignment files, deliverables)

**Current Status**: Temporarily disabled (`src/lib/firebase.ts` line 40-42)

**What You'll Do** (later):
- Re-enable storage module
- Implement file upload/download
- Set up storage security rules

#### 4. Cloud Messaging (`@react-native-firebase/messaging`)
**Purpose**: Push notifications for task updates, messages, etc.

**Current Implementation**: `src/services/fcmService.ts`

**What You'll Do**:
- Configure FCM for Android
- Request notification permissions
- Handle foreground/background notifications
- Test notification delivery

---

## 4. Firebase Setup - Step by Step

### Prerequisites
- Firebase project created at [console.firebase.google.com](https://console.firebase.google.com)
- Project ID: `assignimt` (already configured in `src/config/firebase.config.ts`)

### Step 1: Android Configuration

#### A. Download google-services.json
1. Go to Firebase Console → Project Settings
2. Under "Your apps", find the Android app or add one:
   - Package name: `com.assignmint.app`
   - App nickname: AssignMint Android
3. Download `google-services.json`
4. Place it at: `android/app/google-services.json`

#### B. Verify Android Build Configuration
The `android/app/build.gradle` should already have:
```gradle
apply plugin: "com.android.application"
apply plugin: "com.google.gms.google-services"  // ← Add this if missing

android {
    namespace "com.assignmint.app"
    defaultConfig {
        applicationId "com.assignmint.app"
        // ...
    }
}

dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.0.0')
    // Other dependencies auto-linked by React Native
}
```

#### C. Verify Project-Level Gradle
Check `android/build.gradle`:
```gradle
buildscript {
    dependencies {
        classpath("com.google.gms:google-services:4.4.0")
    }
}
```

### Step 2: Enable Firebase Services

#### A. Firebase Authentication
1. Firebase Console → Authentication → Get Started
2. Enable "Email/Password" provider
3. Disable "Email link (passwordless sign-in)" for now

#### B. Firestore Database
1. Firebase Console → Firestore Database → Create database
2. **Start in TEST mode** (we'll add security rules later)
3. Choose location: `us-central1` or closest to users
4. Database will be empty initially

#### C. Cloud Storage
1. Firebase Console → Storage → Get Started
2. Start in TEST mode
3. Same location as Firestore

#### D. Cloud Messaging
1. Firebase Console → Cloud Messaging
2. For Android: No additional setup needed with `google-services.json`
3. For iOS: You'll handle the certificates (APNs) later

### Step 3: Set Up Firestore Collections

Run this script to initialize collections with sample data:

```javascript
// scripts/initializeFirestore.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initialize() {
  // Sample user
  await db.collection('users').doc('test-user-id').set({
    uid: 'test-user-id',
    email: 'test@assignmint.com',
    displayName: 'Test User',
    role: 'both',
    trustScore: 100,
    rating: 5.0,
    totalReviews: 0,
    tasksCompleted: 0,
    tasksPosted: 0,
    totalEarnings: 0,
    badges: [],
    isVerified: false,
    preferences: {
      notifications: true,
      emailUpdates: true,
      language: 'en'
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // Sample task
  await db.collection('tasks').add({
    title: 'Help with Calculus Homework',
    description: 'Need help solving derivatives',
    subject: 'Mathematics',
    price: 25.00,
    deadline: new Date('2025-12-31'),
    status: 'open',
    urgency: 'medium',
    aiLevel: 0,
    createdBy: 'test-user-id',
    createdByName: 'Test User',
    fileUrls: [],
    tags: ['calculus', 'math'],
    matchingType: 'manual',
    autoMatch: false,
    applicants: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log('✅ Firestore initialized with sample data');
}

initialize().catch(console.error);
```

### Step 4: Deploy Security Rules

Use the existing `firestore.rules` file:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

The rules ensure:
- Users can only access their own data
- Tasks are readable by all authenticated users
- Only task owners/assignees can modify tasks
- Messages require chat participation

### Step 5: Create Required Indexes

Firestore needs indexes for complex queries. Create these in Firebase Console:

**Tasks Collection:**
- Composite: `status` (Ascending) + `createdAt` (Descending)
- Composite: `status` (Ascending) + `price` (Ascending)
- Composite: `createdBy` (Ascending) + `status` (Ascending) + `createdAt` (Descending)

**Notifications Collection:**
- Composite: `userId` (Ascending) + `isRead` (Ascending) + `createdAt` (Descending)

Or use the `firestore.indexes.json` file:
```bash
firebase deploy --only firestore:indexes
```

### Step 6: Test Firebase Connection (ANDROID ONLY)

#### Test Auth:
```bash
# Start Android app (ONLY test on Android)
npx react-native run-android

# In app:
1. Go to Sign Up screen
2. Create test account: test2@assignmint.com / Password123!
3. Check Firebase Console → Authentication → Users (should appear)
```

#### Test Firestore:
```javascript
// Add to HomeScreen.tsx temporarily
import { db } from '../lib/firebase';

useEffect(() => {
  const testFirestore = async () => {
    try {
      const snapshot = await db().collection('tasks').limit(5).get();
      console.log('✅ Firestore working! Tasks:', snapshot.size);
    } catch (error) {
      console.error('❌ Firestore error:', error);
    }
  };
  testFirestore();
}, []);
```

#### ⚠️ ANDROID-ONLY Testing Rules:
- **DO NOT** run `npx react-native run-ios`
- **DO NOT** modify any files in `ios/` folder
- **DO NOT** run `pod install` or touch `Podfile`
- **ONLY** test on Android emulator or physical Android device
- **ONLY** modify Android-specific files when necessary

---

## 5. Recommended Firestore Schema

### Users Collection (`users/{uid}`)
```typescript
{
  uid: string;                    // Firebase Auth UID (document ID)
  email: string;                  // User email
  displayName: string;            // Full name
  photoURL?: string;              // Profile picture URL
  role: 'requester' | 'expert' | 'both';  // User role
  
  // Stats
  trustScore: number;             // 0-100 trust score
  rating: number;                 // Average rating (0-5)
  totalReviews: number;           // Number of reviews received
  tasksCompleted: number;         // Tasks completed as helper
  tasksPosted: number;            // Tasks posted as requester
  totalEarnings: number;          // Total earned in cents
  
  // Profile
  badges: string[];               // Achievement badges
  isVerified: boolean;            // Email verified
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    language: string;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Tasks Collection (`tasks/{taskId}`)
```typescript
{
  id: string;                     // Auto-generated task ID
  title: string;                  // "Help with Calculus"
  description: string;            // Detailed description
  subject: string;                // "Mathematics"
  price: number;                  // Payment amount (dollars)
  deadline: Timestamp;            // Task deadline
  
  // Status tracking
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  urgency: 'low' | 'medium' | 'high';
  aiLevel: number;                // 0-10 AI assistance level
  
  // User relationships
  createdBy: string;              // Requester UID
  createdByName: string;          // Requester name
  completedBy?: string;           // Helper UID
  completedByName?: string;       // Helper name
  
  // Files and details
  fileUrls: string[];             // Uploaded files
  tags: string[];                 // Search tags
  specialInstructions?: string;   // Extra notes
  estimatedHours?: number;        // Time estimate
  
  // Matching
  matchingType: 'manual' | 'auto';
  autoMatch: boolean;
  assignedExpert?: string;        // For auto-matching
  assignedExpertName?: string;
  applicants: string[];           // UIDs of interested helpers
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  acceptedAt?: Timestamp;
  completedAt?: Timestamp;
  cancelledAt?: Timestamp;
  cancellationReason?: string;
}
```

### Chats Collection (`chats/{chatId}`)
```typescript
{
  id: string;
  taskId: string;                 // Related task
  taskTitle: string;              // For display
  participants: string[];         // [requesterUID, helperUID]
  participantNames: {             // For quick display
    [userId: string]: string;
  };
  lastMessage?: {
    text: string;
    senderId: string;
    senderName: string;
    timestamp: Timestamp;
  };
  isActive: boolean;              // Chat still active
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Messages Subcollection (`chats/{chatId}/messages/{messageId}`)
```typescript
{
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Timestamp;
  type: 'text' | 'image' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  readBy: { [userId: string]: Timestamp };
}
```

### Wallets Collection (`wallets/{userId}`)
```typescript
{
  userId: string;                 // User UID
  balance: number;                // Available balance (cents)
  pendingBalance: number;         // In escrow (cents)
  totalEarnings: number;          // Lifetime earnings (cents)
  totalWithdrawn: number;         // Total withdrawn (cents)
  updatedAt: Timestamp;
}
```

### Transactions Collection (`transactions/{transactionId}`)
```typescript
{
  id: string;
  userId: string;                 // User involved
  type: 'credit' | 'debit';
  amount: number;                 // Amount in cents
  description: string;            // "Payment for Task XYZ"
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  taskId?: string;                // Related task
  stripeTransactionId?: string;   // Stripe reference
  paymentMethod?: string;         // "card", "bank_transfer"
  metadata?: { [key: string]: string };
  createdAt: Timestamp;
  completedAt?: Timestamp;
}
```

### Notifications Collection (`notifications/{notificationId}`)
```typescript
{
  id: string;
  userId: string;                 // Recipient
  type: 'newTask' | 'taskAccepted' | 'messageReceived' | 'taskCompleted' | 'paymentReceived' | 'system';
  title: string;
  body: string;
  data?: { [key: string]: string };  // For deep linking
  isRead: boolean;
  taskId?: string;
  chatId?: string;
  fromUserId?: string;
  createdAt: Timestamp;
}
```

---

## 6. React Native Bare Workflow Cautions

### What is "Bare Workflow"?
Unlike Expo (managed workflow), React Native CLI gives you direct access to native Android/iOS code. This means:
- ✅ Full control over native modules
- ✅ Can use any native library
- ⚠️ Must manage native dependencies yourself
- ⚠️ Platform-specific issues require native knowledge

### Android vs iOS Differences

#### Build Systems
| Aspect | Android | iOS |
|--------|---------|-----|
| Build tool | Gradle | Xcode / CocoaPods |
| Config files | `build.gradle`, `gradle.properties` | `Info.plist`, `Podfile` |
| Native language | Java/Kotlin | Objective-C/Swift |
| Permissions | `AndroidManifest.xml` | `Info.plist` |

#### Firebase Setup
- **Android**: Needs `google-services.json` + Gradle plugin
- **iOS**: Needs `GoogleService-Info.plist` + Pod installed (already done)

#### Push Notifications
- **Android**: Uses FCM directly, simpler setup
- **iOS**: Requires APNs certificate + entitlements (you'll handle this)

#### File Paths
- **Android**: Use `/` paths, case-sensitive
- **iOS**: Use `/` paths, case-insensitive

### Important Platform Checks

```javascript
import { Platform } from 'react-native';

// Check platform
if (Platform.OS === 'android') {
  // Android-specific code
} else if (Platform.OS === 'ios') {
  // iOS-specific code
}

// Platform-specific styles
const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,  // iOS status bar
  }
});

// Platform-specific values
const buttonColor = Platform.select({
  android: '#4CAF50',
  ios: '#007AFF',
  default: '#333'
});
```

### iOS-Specific Cautions ⚠️

**DO NOT**:
- ❌ Delete or modify `ios/Pods/` (regenerated by CocoaPods)
- ❌ Change `ios/Assignmint/Info.plist` without testing iOS build
- ❌ Modify `ios/Assignmint.xcodeproj/project.pbxproj` directly
- ❌ Run `pod install` unless necessary (iOS build works currently)

**If you need iOS changes**:
1. Discuss with the team lead first
2. Test on iOS simulator if possible
3. Document changes for iOS build

### Android-Specific Testing

**Always test on Android**:
```bash
# Clean build
cd android
./gradlew clean
cd ..

# Run on Android
npx react-native run-android

# Check logs
adb logcat | grep -E "ReactNative|Firebase|Assignmint"

# List devices
adb devices
```

### Common Bare Workflow Issues

#### 1. Native Module Linking
**Problem**: "null is not an object (evaluating 'NativeModules.Something')"

**Solution**: 
```bash
# Auto-link native modules
npx react-native-asset

# Rebuild
# Android
cd android && ./gradlew clean && cd .. && npx react-native run-android

# iOS (if needed later)
cd ios && pod install && cd .. && npx react-native run-ios
```

#### 2. Build Failures
**Problem**: Gradle or Xcode build fails

**Solution**:
```bash
# Clean everything
rm -rf node_modules
npm install

# Android
cd android && ./gradlew clean && cd ..

# iOS (if needed)
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

#### 3. Metro Bundler Cache
**Problem**: Old JavaScript code persists

**Solution**:
```bash
# Clear Metro cache
npx react-native start --reset-cache

# Clear everything
watchman watch-del-all
rm -rf $TMPDIR/react-*
```

---

## 7. Your First 3 Tasks

### Task 1: Verify Firebase Connection on Android ✅
**Goal**: Confirm Firebase Auth and Firestore work on Android

**Steps**:
1. Ensure `google-services.json` is at `android/app/google-services.json`
2. Run: `npx react-native run-android`
3. In the app, navigate to Sign Up screen
4. Create a test account: `android-test@assignmint.com` / `Password123!`
5. Check Firebase Console → Authentication → Users (should see new user)
6. Check Metro logs for: `✅ Firebase app initialized successfully`

**Expected Output**:
```
✅ Firebase app initialized successfully
✅ Firebase Auth initialized successfully
✅ Firestore initialized successfully
✓ User authenticated: android-test@assignmint.com
```

**Troubleshooting**:
- If login fails: Check `google-services.json` is correct
- If Firestore fails: Check security rules allow authenticated reads
- Build errors: Run `cd android && ./gradlew clean && cd ..`

---

### Task 2: Set Up Firestore Collections and Test Queries ✅
**Goal**: Create collections, add sample data, query from Android app

**Steps**:

#### A. Create Sample Data in Firebase Console
1. Go to Firestore Database
2. Create `tasks` collection:
   - Click "Start collection"
   - Collection ID: `tasks`
   - Add document with auto-generated ID:
   ```json
   {
     "title": "Help with React Native",
     "description": "Need help debugging Firebase",
     "subject": "Computer Science",
     "price": 30.00,
     "deadline": "2025-12-31T23:59:59Z",
     "status": "open",
     "urgency": "medium",
     "aiLevel": 0,
     "createdBy": "test-user-id",
     "createdByName": "Test User",
     "fileUrls": [],
     "tags": ["react-native", "firebase"],
     "matchingType": "manual",
     "autoMatch": false,
     "applicants": [],
     "createdAt": <Timestamp>,
     "updatedAt": <Timestamp>
   }
   ```

#### B. Test Query in App
Add this to `HomeScreen.tsx` temporarily:

```typescript
import { db } from '../lib/firebase';
import { useEffect, useState } from 'react';

const [testTasks, setTestTasks] = useState([]);

useEffect(() => {
  const testFirestore = async () => {
    try {
      console.log('🔍 Testing Firestore query...');
      
      const snapshot = await db()
        .collection('tasks')
        .where('status', '==', 'open')
        .limit(10)
        .get();
      
      console.log('✅ Query successful! Found', snapshot.size, 'tasks');
      
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setTestTasks(tasks);
      console.log('Tasks:', tasks);
    } catch (error) {
      console.error('❌ Firestore query error:', error);
    }
  };
  
  testFirestore();
}, []);

// In your JSX, display the count
<Text>Test: Found {testTasks.length} tasks in Firestore</Text>
```

#### C. Test Real-Time Listener
Add this to test real-time updates:

```typescript
useEffect(() => {
  console.log('🎧 Setting up real-time listener...');
  
  const unsubscribe = db()
    .collection('tasks')
    .where('status', '==', 'open')
    .onSnapshot(
      (snapshot) => {
        console.log('🔄 Real-time update! Tasks:', snapshot.size);
        const tasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTestTasks(tasks);
      },
      (error) => {
        console.error('❌ Listener error:', error);
      }
    );
  
  return () => unsubscribe();
}, []);
```

**Expected Output**:
```
🔍 Testing Firestore query...
✅ Query successful! Found 1 tasks
🎧 Setting up real-time listener...
🔄 Real-time update! Tasks: 1
Tasks: [{ id: "abc123", title: "Help with React Native", ... }]
```

**Success Criteria**:
- ✅ Can read tasks from Firestore
- ✅ Real-time listener fires on data changes
- ✅ No permission errors
- ✅ Data structure matches TypeScript types

---

### Task 3: Implement Basic Push Notification Setup for Android ✅
**Goal**: Request permissions, get FCM token, handle notifications

**⚠️ ANDROID-ONLY NOTIFICATION IMPLEMENTATION:**
- iOS notifications are already configured - DO NOT MODIFY
- You will implement Android FCM from scratch
- Code should be cross-platform but only test on Android

**Steps**:

#### A. Request Notification Permission (Android 13+)
Update `src/services/fcmService.ts`:

```typescript
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

async function requestUserPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      // Android 13+ requires runtime permission
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'AssignMint Notifications',
          message: 'Allow AssignMint to send you notifications about tasks and messages?',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // Android 12 and below don't need runtime permission
  }
  
  // iOS - DO NOT MODIFY (already configured)
  // Just return true to avoid breaking iOS
  return true;
}
```

#### B. Get FCM Token
```typescript
async function getFCMToken(): Promise<string | null> {
  try {
    const hasPermission = await requestUserPermission();
    
    if (!hasPermission) {
      console.log('❌ Notification permission denied');
      return null;
    }
    
    const token = await messaging().getToken();
    console.log('✅ FCM Token:', token);
    
    return token;
  } catch (error) {
    console.error('❌ Failed to get FCM token:', error);
    return null;
  }
}
```

#### C. Handle Foreground Notifications
```typescript
// In App.tsx or a service initialization
useEffect(() => {
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    console.log('📬 Foreground notification:', remoteMessage);
    
    // Show alert or local notification
    if (remoteMessage.notification) {
      Alert.alert(
        remoteMessage.notification.title || 'New Notification',
        remoteMessage.notification.body || '',
        [{ text: 'OK' }]
      );
    }
  });
  
  return unsubscribe;
}, []);
```

#### D. Handle Background/Quit State Notifications
Add to `index.js` (app entry point):

```javascript
import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('📬 Background notification:', remoteMessage);
});
```

#### E. Test Notifications
1. **Get Token**:
   - Run the app
   - Check logs for: `✅ FCM Token: [long string]`
   - Copy this token

2. **Send Test Notification via Firebase Console**:
   - Go to Firebase Console → Cloud Messaging
   - Click "Send your first message"
   - Title: "Test Notification"
   - Body: "This is a test from Firebase"
   - Click "Send test message"
   - Paste your FCM token
   - Click "Test"

3. **Verify**:
   - **App in foreground**: Should see Alert dialog
   - **App in background**: Should see system notification
   - **App quit**: Should see system notification, tapping opens app

**Expected Output**:
```
📲 Requesting notification permission...
✅ Permission granted
✅ FCM Token: dGhpcyBpcyBhIGZha2UgdG9rZW4...
📬 Foreground notification: { notification: { title: "Test", body: "..." } }
```

**Success Criteria**:
- ✅ Permission requested and granted
- ✅ FCM token retrieved and logged
- ✅ Foreground notifications show Alert
- ✅ Background notifications appear in system tray
- ✅ No crashes on Android

---

## 8. Development with Cursor & ChatGPT

### Using Cursor AI Effectively

#### What Cursor Can Do for You:
1. **Code Completion**: Type a few characters, Cursor suggests whole functions
2. **Explain Code**: Select code, ask Cursor "What does this do?"
3. **Refactor**: Select code, ask "Refactor this to be more readable"
4. **Generate Tests**: Ask "Write unit tests for this function"
5. **Fix Errors**: Paste error, ask "How do I fix this?"

#### Best Practices:

**1. Be Specific with Context**
❌ Bad: "How do I add a button?"
✅ Good: "How do I add a button in React Native that navigates to TaskDetailsScreen with taskId prop?"

**2. Reference Project Files**
✅ "Update `src/services/firestoreService.ts` to add a method that fetches tasks by subject"

**3. Ask for Explanations**
✅ "Explain how the `AuthProvider` in `src/state/AuthProvider.tsx` manages authentication state"

**4. Request TypeScript Types**
✅ "Generate TypeScript interface for a Firestore document in the `submissions` collection"

**5. Debug Step-by-Step**
✅ "This error happens when I try to query Firestore. Here's my code: [paste code]. What's wrong?"

#### Cursor Commands to Know:
- `Cmd/Ctrl + K` - Open Cursor command palette
- `Cmd/Ctrl + L` - Open chat sidebar
- `Cmd/Ctrl + I` - Inline edit with AI
- Select code → Right click → "Ask Cursor" - Context-aware help

---

### Using ChatGPT Effectively

#### What to Provide ChatGPT:

**Template for Firebase Questions:**
```
I'm working on AssignMint, a React Native app with Firebase.

Context:
- Using @react-native-firebase/firestore v17.5.0
- React Native 0.72.15 (bare workflow)
- Platform: Android

My goal: [What you want to achieve]

Current code: [Paste relevant code]

Error/Issue: [What's not working]

What I've tried: [What you've attempted]

Question: [Specific question]
```

**Example:**
```
I'm working on AssignMint, a React Native app with Firebase.

Context:
- Using @react-native-firebase/firestore v17.5.0
- React Native 0.72.15 (bare workflow)
- Platform: Android

My goal: Query all tasks where status is "open" and price is between $10-$50

Current code:
const snapshot = await db()
  .collection('tasks')
  .where('status', '==', 'open')
  .where('price', '>=', 10)
  .where('price', '<=', 50)
  .get();

Error/Issue: "Error: inequality field filters must all reference the same field"

What I've tried: Used separate where clauses, but getting error

Question: How do I query with multiple range filters in Firestore?
```

#### ChatGPT is Great For:

1. **Understanding Errors**
   - "What does this Firebase error mean: [error message]"
   - "Why am I getting 'permission denied' in Firestore?"

2. **Architecture Decisions**
   - "Should I use real-time listeners or one-time queries for the task feed?"
   - "Best way to structure Firestore for a marketplace app?"

3. **Code Examples**
   - "Show me how to implement pagination in Firestore with React Native"
   - "Example of real-time chat with Firestore subcollections"

4. **Best Practices**
   - "What's the best way to handle offline data in Firestore?"
   - "Security best practices for Firestore rules in a marketplace app"

5. **Debugging Strategies**
   - "My Android build fails with this error: [error]. How do I debug?"
   - "Firebase Auth works on iOS but not Android. Where should I check?"

---

### Project-Specific Context for AI

When asking questions, mention these key facts:

**About AssignMint:**
- Assignment help marketplace (students post tasks, helpers complete them)
- React Native CLI (bare workflow) - not Expo
- Firebase backend (Auth, Firestore, Cloud Messaging, Storage)
- Stripe for payments
- Both iOS and Android, but focus on Android right now

**Current State:**
- iOS Firebase setup is complete (don't modify)
- Android needs Firebase configuration
- Firestore schema is defined in `src/types/firestore.ts`
- Service layer in `src/services/`
- React Navigation 7 (stack + tabs)

**Common Issues to Mention:**
- "I'm using React Native Firebase (not Firebase JS SDK)"
- "This is bare workflow (not Expo)"
- "I need to test on Android physical device or emulator"

---

### Debugging Workflow with AI

#### 1. Read the Error
```bash
# Run app with full logs
npx react-native run-android

# Filter Firebase logs
adb logcat | grep Firebase
```

#### 2. Search the Error
- Google: "[error message] react native firebase"
- Check: React Native Firebase docs, GitHub issues

#### 3. Ask Cursor/ChatGPT
Provide:
- Full error message
- Code that caused it
- What you were trying to do

#### 4. Implement Solution
- Test the suggestion
- If it doesn't work, provide new error to AI
- Iterate until fixed

#### 5. Document the Fix
Add a comment:
```javascript
// Fixed: "Permission denied" error by updating Firestore rules
// See: https://stackoverflow.com/questions/...
```

---

### Common Questions & How to Ask Them

| What You Want | How to Ask Cursor/ChatGPT |
|---------------|---------------------------|
| Add new screen | "Create a new screen component called `SubmissionsScreen.tsx` that displays a list of submissions for a task. Use React Navigation types from `src/navigation/types.ts`" |
| Query Firestore | "Write a Firestore query to get all tasks where `status` is 'open', ordered by `deadline` ascending, with a limit of 20. Use React Native Firebase syntax" |
| Handle navigation | "In TaskDetailsScreen, add a button that navigates to ChatThreadScreen with params `{ chatId: string, taskId: string }`. Use TypeScript and React Navigation 7" |
| Debug error | "I'm getting this error when trying to upload a file: [error]. I'm using React Native Firebase Storage. Here's my code: [code]. What's wrong?" |
| Style component | "Make this task card component look more modern using React Native StyleSheet. Add shadows, rounded corners, and better spacing" |
| Add animation | "Add a fade-in animation when this list loads using React Native Animated API" |

---

## 9. Additional Resources

### Documentation
- **React Native**: https://reactnative.dev/docs/getting-started
- **React Native Firebase**: https://rnfirebase.io/
- **React Navigation**: https://reactnavigation.org/docs/getting-started
- **Stripe React Native**: https://stripe.com/docs/payments/accept-a-payment?platform=react-native

### Project Documentation
- `docs/SCREENS_MAP.md` - Complete navigation structure
- `docs/FIREBASE_SETUP.md` - Detailed Firebase setup guide
- `docs/CORE_FEATURES.md` - Feature documentation
- `docs/BACKEND_GUIDE.md` - Backend architecture
- `README.md` - Project overview and quick start

### Firebase Console
- **Project**: assignimt
- **Console**: https://console.firebase.google.com/project/assignimt
- **Authentication**: Check users here
- **Firestore**: Browse/edit data
- **Cloud Messaging**: Send test notifications

### Useful Commands
```bash
# Development
npm start                           # Start Metro bundler
npx react-native run-android        # Run on Android
npx react-native log-android        # View Android logs

# Debugging
adb devices                         # List connected devices
adb logcat | grep ReactNative       # Filter React Native logs
adb logcat | grep Firebase          # Filter Firebase logs
adb reverse tcp:8081 tcp:8081       # Connect to Metro from device

# Build
cd android && ./gradlew clean       # Clean Android build
cd android && ./gradlew assembleDebug  # Build debug APK

# Firebase
firebase login                      # Login to Firebase CLI
firebase deploy --only firestore:rules  # Deploy security rules
firebase emulators:start            # Start local emulators

# Maintenance
npm install                         # Install dependencies
npm run lint                        # Run ESLint
npm test                            # Run tests
```

---

## 10. Next Steps After Initial Setup

Once you've completed the first 3 tasks:

### Week 1-2: Core Integration
1. ✅ Complete Firebase Auth integration (sign up, login, logout)
2. ✅ Implement task fetching with real Firestore data
3. ✅ Create new task posting flow with Firestore writes
4. ✅ Test notifications for task updates

### Week 3-4: Features
1. Implement real-time chat with Firestore subcollections
2. Add task claiming and status updates
3. Build user profile screen with Firestore data
4. Implement file upload for task attachments (Storage)

### Week 5-6: Polish
1. Add error handling and loading states
2. Implement offline support (Firestore caching)
3. Add analytics and crash reporting
4. Performance optimization

---

## 11. Getting Help

### Internal Resources
- **Team Lead**: Hamza (iOS builds, overall architecture)
- **Code Reviews**: Submit PRs for review before merging
- **Documentation**: Check `docs/` folder first

### External Resources
- **React Native Firebase Discord**: https://discord.gg/react-native-firebase
- **Stack Overflow**: Tag questions with `react-native`, `firebase`, `firestore`
- **GitHub Issues**: Check https://github.com/invertase/react-native-firebase/issues

### When Stuck
1. Check error message carefully
2. Search Google/Stack Overflow
3. Ask Cursor/ChatGPT with full context
4. Check React Native Firebase docs
5. Ask team lead if still stuck

---

## Welcome to the Team! 🎉

You now have everything you need to start contributing to AssignMint. Remember:

- ✅ **Test on Android** - Your primary platform
- ✅ **Don't touch iOS** - Unless discussed with team lead
- ✅ **Ask questions** - Use Cursor, ChatGPT, or team lead
- ✅ **Document changes** - Add comments and update docs
- ✅ **Commit often** - Small, focused commits

**Your first goal**: Get Firebase working on Android and see real data in the app.

## 🚀 Project Growth & Scalability

**Important**: AssignMint will scale significantly. Your Firebase integration needs to be:

1. **Robust**: Handle thousands of users and tasks
2. **Scalable**: Real-time listeners that don't crash
3. **Efficient**: Optimized queries and caching
4. **Maintainable**: Clean, documented code

**Architecture Considerations:**
- Use Firestore subcollections for scalability (messages under chats)
- Implement proper error handling and retry logic
- Consider offline-first approach with Firestore caching
- Plan for real-time updates without overwhelming the client

**Code Organization for Scale:**
```
src/
├── services/
│   ├── firestoreService.ts      # Core Firestore operations
│   ├── fcmService.ts            # Shared notification logic
│   ├── fcmService.android.ts    # Android-specific (if needed)
│   └── taskService.ts           # Task-specific business logic
├── hooks/
│   ├── useTasks.ts              # Custom hooks for data fetching
│   ├── useAuth.ts               # Authentication hooks
│   └── useNotifications.ts      # Notification hooks
└── utils/
    ├── firestoreHelpers.ts      # Firestore utility functions
    └── notificationHelpers.ts   # Notification utilities
```

Good luck, and happy coding! 🚀

