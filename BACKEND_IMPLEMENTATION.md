# AssignMint Backend Implementation

## Overview

This document describes the complete backend implementation for AssignMint, using Firebase Firestore, Cloud Functions, and FCM for a production-ready, real-time application.

## Architecture

### Core Services
- **Firestore**: Primary database for all app data
- **Cloud Functions**: Server-side logic and real-time triggers
- **FCM**: Push notifications
- **Stripe**: Payment processing (via Cloud Functions)
- **Firebase Auth**: User authentication

## Firestore Collections

### 1. Users Collection (`users/{userId}`)
```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'requester' | 'expert' | 'both';
  createdAt: Date;
  updatedAt: Date;
  trustScore: number;
  rating: number;
  totalReviews: number;
  tasksCompleted: number;
  tasksPosted: number;
  totalEarnings: number;
  badges: string[];
  isVerified: boolean;
  fcmToken?: string;
  paymentMethodId?: string;
  hasPaymentMethod: boolean;
  bankAccountId?: string;
  hasBankAccount: boolean;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    language: string;
  };
}
```

### 2. Tasks Collection (`tasks/{taskId}`)
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  price: number;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  urgency: 'low' | 'medium' | 'high';
  aiLevel: number;
  createdBy: string; // User ID
  createdByName: string;
  completedBy?: string; // User ID
  completedByName?: string;
  fileUrls: string[];
  tags: string[];
  specialInstructions?: string;
  estimatedHours?: number;
  matchingType: 'manual' | 'auto';
  applicants: string[]; // User IDs
  acceptedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}
```

### 3. Chats Collection (`chats/{chatId}`)
```typescript
interface Chat {
  id: string;
  taskId: string;
  taskTitle: string;
  participants: string[]; // User IDs
  participantNames: { [userId: string]: string };
  lastMessage?: {
    text: string;
    senderId: string;
    senderName: string;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

### 4. Messages Subcollection (`chats/{chatId}/messages/{messageId}`)
```typescript
interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  readBy: { [userId: string]: Date };
}
```

### 5. Notifications Collection (`notifications/{notificationId}`)
```typescript
interface Notification {
  id: string;
  userId: string;
  type: 'newTask' | 'taskAccepted' | 'messageReceived' | 'taskCompleted' | 'paymentReceived' | 'system';
  title: string;
  body: string;
  data?: { [key: string]: string };
  isRead: boolean;
  createdAt: Date;
  taskId?: string;
  chatId?: string;
  fromUserId?: string;
}
```

### 6. Wallets Collection (`wallets/{userId}`)
```typescript
interface Wallet {
  userId: string;
  balance: number; // Available balance in cents
  pendingBalance: number; // Pending balance in cents
  totalEarnings: number; // Total earnings in cents
  totalWithdrawn: number; // Total withdrawn in cents
  updatedAt: Date;
}
```

### 7. Transactions Collection (`transactions/{transactionId}`)
```typescript
interface Transaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number; // Amount in cents
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
  taskId?: string;
  stripeTransactionId?: string;
  paymentMethod?: string;
  metadata?: { [key: string]: string };
}
```

### 8. AI Sessions Collection (`aiSessions/{sessionId}`)
```typescript
interface AIChatSession {
  id: string;
  userId: string;
  subject?: string;
  messages: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    type: 'text' | 'image' | 'file';
    fileUrl?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

## Cloud Functions

### Real-time Triggers

#### 1. `onTaskCreated`
- **Trigger**: New task created in `tasks` collection
- **Action**: Send FCM notification to all users about new task
- **Purpose**: Real-time task feed updates

#### 2. `onTaskAccepted`
- **Trigger**: Task status changed from 'open' to 'in_progress'
- **Action**: 
  - Send FCM notification to task creator
  - Create notification document
- **Purpose**: Notify task creator when someone accepts their task

#### 3. `onTaskCompleted`
- **Trigger**: Task status changed from 'in_progress' to 'completed'
- **Action**:
  - Send FCM notification to task creator
  - Create notification document
  - Update user statistics (tasksCompleted, tasksPosted)
- **Purpose**: Notify completion and update user stats

#### 4. `onMessageSent`
- **Trigger**: New message created in `chats/{chatId}/messages`
- **Action**:
  - Send FCM notification to other chat participants
  - Create notification documents
- **Purpose**: Real-time messaging notifications

### HTTP Functions

#### 1. `sendTestNotification`
- **Method**: POST
- **Purpose**: Send test notifications for debugging
- **Body**: `{ userId, title, body, data }`

#### 2. `getUserStats`
- **Method**: GET
- **Purpose**: Get comprehensive user statistics
- **Query**: `?userId={userId}`

## Security Rules

### Key Security Principles
1. **Authentication Required**: All operations require authenticated users
2. **Ownership Validation**: Users can only access their own data
3. **Data Validation**: Strict validation of data structure and types
4. **Role-based Access**: Different access levels for different operations

### Collection-specific Rules

#### Users
- Users can only read/write their own profile
- Profile creation requires valid user data structure

#### Tasks
- Anyone can read tasks (for feed)
- Only task creator can create/delete tasks
- Task assignee can update status and completion fields

#### Chats & Messages
- Only chat participants can access chat data
- Only message sender can create messages
- Messages cannot be deleted (for audit trail)

#### Notifications
- Users can only access their own notifications
- Notifications can be marked as read

#### Wallets & Transactions
- Users can only access their own financial data
- Wallets and transactions cannot be deleted

## Real-time Features

### 1. Task Feed
- Uses `onSnapshot` for real-time updates
- Automatically updates when new tasks are posted
- Filters by status, subject, price range, etc.

### 2. Messaging
- Real-time message delivery via `onSnapshot`
- Automatic chat creation when users negotiate
- Message read receipts and typing indicators

### 3. Notifications
- Real-time notification updates
- FCM push notifications for immediate alerts
- In-app notification management

### 4. User Statistics
- Real-time updates when tasks are completed
- Automatic calculation of ratings and trust scores
- Live wallet balance updates

## Payment Integration

### Stripe Integration
- **Payment Methods**: Credit cards, bank accounts
- **Escrow System**: Hold payments until task completion
- **Payouts**: Transfer earnings to user bank accounts
- **Transaction History**: Complete audit trail

### Payment Flow
1. User posts task with budget
2. Payment held in escrow
3. Expert completes task
4. Payment released to expert
5. Transaction recorded in Firestore

## Environment Variables

### Required Environment Variables
```bash
# Firebase Configuration
FB_API_KEY=your-firebase-api-key
FB_AUTH_DOMAIN=your-project-id.firebaseapp.com
FB_PROJECT_ID=your-project-id
FB_STORAGE_BUCKET=your-project-id.appspot.com
FB_MESSAGING_SENDER_ID=your-messaging-sender-id
FB_APP_ID=your-firebase-app-id
FB_MEASUREMENT_ID=your-measurement-id

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google OAuth
GOOGLE_WEB_CLIENT_ID=your-google-web-client-id

# API Configuration
API_BASE_URL=http://localhost:3000
```

## Deployment

### 1. Firebase Setup
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init

# Deploy functions
firebase deploy --only functions

# Deploy security rules
firebase deploy --only firestore:rules
```

### 2. Environment Configuration
```bash
# Set environment variables
firebase functions:config:set stripe.secret_key="sk_test_..."
firebase functions:config:set stripe.webhook_secret="whsec_..."

# Deploy with config
firebase deploy --only functions
```

### 3. Firestore Indexes
Create the following indexes in Firebase Console:

#### Tasks Collection
- `status` (Ascending) + `createdAt` (Descending)
- `createdBy` (Ascending) + `createdAt` (Descending)
- `completedBy` (Ascending) + `createdAt` (Descending)
- `subject` (Ascending) + `createdAt` (Descending)
- `price` (Ascending) + `createdAt` (Descending)

#### Chats Collection
- `participants` (Array) + `updatedAt` (Descending)
- `taskId` (Ascending) + `isActive` (Ascending)

#### Messages Collection
- `chatId` (Ascending) + `timestamp` (Ascending)

#### Notifications Collection
- `userId` (Ascending) + `createdAt` (Descending)
- `userId` (Ascending) + `isRead` (Ascending) + `createdAt` (Descending)

## Performance Optimizations

### 1. Offline Support
- Firestore offline persistence enabled
- Local caching for better performance
- Optimistic updates for better UX

### 2. Query Optimization
- Composite indexes for complex queries
- Limit results to prevent large data transfers
- Pagination for large datasets

### 3. Real-time Optimization
- Selective subscriptions (only necessary data)
- Proper cleanup of listeners
- Debounced updates for frequently changing data

## Monitoring & Analytics

### 1. Firebase Analytics
- User engagement tracking
- Feature usage analytics
- Performance monitoring

### 2. Cloud Functions Logs
- Function execution logs
- Error tracking and alerting
- Performance metrics

### 3. Firestore Monitoring
- Database usage metrics
- Query performance
- Security rule violations

## Testing

### 1. Unit Tests
- Service layer testing
- Data validation testing
- Security rule testing

### 2. Integration Tests
- End-to-end user flows
- Real-time functionality testing
- Payment flow testing

### 3. Load Testing
- Concurrent user simulation
- Database performance under load
- Cloud Functions scaling

## Security Considerations

### 1. Data Protection
- All sensitive data encrypted in transit and at rest
- PII data handling compliance
- Secure API key management

### 2. Access Control
- Role-based permissions
- API rate limiting
- Input validation and sanitization

### 3. Payment Security
- PCI DSS compliance via Stripe
- Secure token handling
- Fraud detection and prevention

## Maintenance

### 1. Regular Updates
- Firebase SDK updates
- Security patches
- Performance optimizations

### 2. Monitoring
- Error rate monitoring
- Performance metrics tracking
- User feedback analysis

### 3. Backup & Recovery
- Automated Firestore backups
- Disaster recovery procedures
- Data migration strategies

This backend implementation provides a solid foundation for a production-ready, scalable application with real-time features, secure data handling, and comprehensive payment processing.
