# AssignMint Screen Analysis Report

## Overview
This report provides a comprehensive breakdown of each screen/page in the AssignMint React Native app, detailing their current functionality, data sources, and backend dependencies. This analysis will serve as the foundation for designing a complete production backend.

## Screen-by-Screen Analysis

### 1. **Home Screen** (`src/screens/HomeScreen.tsx`)

**Current Functionality:**
- Displays feed of available tasks
- Search functionality for tasks
- Task cards with details (title, description, price, deadline, urgency, AI level)
- Action buttons: Accept, Negotiate, View Details
- Social buttons: Like, Comment, Share
- Navigation to Notifications and Messages
- Pull-to-refresh functionality

**Data Sources:**
- **Primary:** API calls to `/api/tasks` endpoint
- **Authentication:** Uses `session.getCurrentUser()` and `session.signIn()` for dev authentication
- **Mock Data:** Hardcoded user info and task display logic

**Backend Dependencies:**
- `API.getTasks()` - Fetches task feed
- `API.createTask()` - For task creation (referenced but not used directly)
- Firebase Auth for user authentication
- Session management for user state

**Actions Available:**
- Accept task (shows alert - not implemented)
- Negotiate (navigates to ChatThread with mock data)
- View task details (navigates to TaskDetails screen)
- Search tasks (local filtering)
- Refresh task feed
- Navigate to notifications/messages

**Issues Identified:**
- Uses hardcoded dev authentication instead of proper auth flow
- Accept/Negotiate actions are not connected to backend
- Social features (like, comment, share) are not implemented

---

### 2. **Post Task Screen** (`src/screens/PostTaskScreen.tsx`)

**Current Functionality:**
- Multi-step task creation flow (5 steps)
- Form data collection across steps
- Task submission to backend
- Navigation between steps
- Error handling and validation

**Data Sources:**
- **Form State:** Local state management
- **API:** `API.createTask()` for task submission
- **Mock Data:** Hardcoded user info (requesterId, requesterName)

**Backend Dependencies:**
- `API.createTask()` - Creates new task
- Task validation and processing
- File upload handling (referenced but not fully implemented)

**Actions Available:**
- Create task with full form data
- Navigate between steps
- Save draft (alert only - not implemented)
- Submit task to backend
- Reset form after successful submission

**Issues Identified:**
- File upload functionality not fully implemented
- Draft saving not connected to backend
- Hardcoded user information

---

### 3. **My Tasks Screen** (`src/screens/MyTasksScreen.tsx`)

**Current Functionality:**
- Displays user's posted tasks
- Task filtering (All, Active, In Progress, Completed)
- Task statistics display
- Task status management
- Pull-to-refresh functionality

**Data Sources:**
- **Primary:** API calls to `/api/my/tasks` endpoint
- **Local State:** Filtering and display logic
- **Mock Data:** Hardcoded task status mapping

**Backend Dependencies:**
- `API.getMyTasks()` - Fetches user's tasks
- Task status updates
- Task statistics calculation

**Actions Available:**
- View task details
- Filter tasks by status
- Refresh task list
- View task statistics

**Issues Identified:**
- Task actions (edit, cancel, review) are not implemented
- No real-time updates for task status changes
- Statistics are calculated locally, not from backend

---

### 4. **Profile Screen** (`src/screens/ProfileScreen.tsx`)

**Current Functionality:**
- User profile display with stats
- Tabbed interface (Overview, Activity, Reviews, Wallet)
- User statistics and badges
- Recent activity display
- Reviews and ratings
- Wallet information
- Settings navigation

**Data Sources:**
- **Mock Data:** All user data is hardcoded
- **Local State:** Tab management and display logic
- **Firebase Auth:** User authentication state

**Backend Dependencies:**
- User profile data
- Activity history
- Reviews and ratings
- Wallet/transaction data
- Statistics and analytics

**Actions Available:**
- Navigate to settings
- View wallet details
- View analytics
- Sign out
- Switch between guest/user mode (dev only)

**Issues Identified:**
- **All data is mock/hardcoded** - No real backend integration
- No real user profile management
- No actual wallet/transaction data
- No real activity tracking

---

### 5. **AI Assistant Screen** (`src/screens/AIAssistantScreen.tsx`)

**Current Functionality:**
- AI chat interface
- Message history
- File attachment support
- Chat session management
- Connection status checking

**Data Sources:**
- **AI Service:** `AIApiService` for AI communication
- **Local State:** Message history and session management
- **Mock Data:** User ID and session data

**Backend Dependencies:**
- AI service API
- Chat session storage
- File processing service
- Message history storage

**Actions Available:**
- Send messages to AI
- Attach files and documents
- Create new chat sessions
- Load previous sessions
- Clear chat history

**Issues Identified:**
- AI service connection not fully implemented
- No persistent chat history storage
- File processing not connected to backend

---

### 6. **Authentication Screens**

#### **Login Screen** (`src/screens/LoginScreen.tsx`)
**Current Functionality:**
- Email/password authentication
- Google/Apple sign-in (disabled on simulator)
- Guest mode entry
- Form validation and error handling

**Data Sources:**
- **Firebase Auth:** Primary authentication
- **Local State:** Form data and validation
- **Mock Data:** Error messages and validation

**Backend Dependencies:**
- Firebase Authentication
- Google/Apple OAuth services
- User session management

**Actions Available:**
- Sign in with email/password
- Sign in with Google (device only)
- Sign in with Apple (device only)
- Enter guest mode
- Navigate to sign up/forgot password

#### **Sign Up Screen** (Referenced but not analyzed)
**Backend Dependencies:**
- User registration
- Email verification
- Profile creation

---

### 7. **Communication Screens**

#### **Chat Screen** (`src/screens/ChatScreen.tsx`)
**Current Functionality:**
- Chat list display
- Search functionality
- Mock chat data

**Data Sources:**
- **Mock Data:** All chat data is hardcoded
- **Local State:** Search and display logic

**Backend Dependencies:**
- Real-time messaging service
- Chat history storage
- User presence tracking
- Message notifications

**Issues Identified:**
- **All data is mock** - No real messaging backend

#### **Chat Thread Screen** (Referenced but not analyzed)
**Backend Dependencies:**
- Real-time message delivery
- Message history
- File sharing
- Typing indicators

#### **Messages Screen** (Referenced but not analyzed)
**Backend Dependencies:**
- Message list management
- Notification handling

#### **Notifications Screen** (Referenced but not analyzed)
**Backend Dependencies:**
- Push notification service
- Notification history
- Real-time updates

---

### 8. **Wallet Screen** (`src/screens/WalletScreen.tsx`)

**Current Functionality:**
- Balance display
- Transaction history
- Payment methods
- Quick actions

**Data Sources:**
- **Mock Data:** All wallet data is hardcoded
- **Local State:** Display logic

**Backend Dependencies:**
- Payment processing
- Transaction history
- Balance management
- Withdrawal processing

**Actions Available:**
- View balance and transactions
- Withdraw funds (not implemented)
- Add payment methods (not implemented)
- View transaction details

**Issues Identified:**
- **All data is mock** - No real payment backend
- No actual payment processing
- No real transaction history

---

### 9. **Settings Screens** (Referenced but not analyzed)

**Backend Dependencies:**
- User preferences storage
- Notification settings
- Account management
- Privacy settings

---

## Backend Dependencies Summary

### **Currently Implemented:**
1. **Basic API Structure** (`src/lib/api.ts`)
   - HTTP client with authentication
   - Basic CRUD operations for tasks
   - Environment-based configuration

2. **Firebase Authentication**
   - User authentication
   - Session management
   - Guest mode support

3. **Task Management**
   - Task creation (`POST /api/tasks`)
   - Task fetching (`GET /api/tasks`, `GET /api/my/tasks`)
   - Basic task data structure

### **Missing Backend Features:**

#### **Critical (Required for MVP):**
1. **User Management**
   - User profiles and preferences
   - User statistics and ratings
   - User verification and trust scores

2. **Real-time Communication**
   - WebSocket or similar for chat
   - Message history storage
   - Push notifications

3. **Payment System**
   - Payment processing
   - Wallet management
   - Transaction history
   - Withdrawal processing

4. **Task Management**
   - Task status updates
   - Task assignment
   - Task completion workflow
   - File upload handling

5. **AI Integration**
   - AI service API
   - Chat session storage
   - File processing

#### **Important (Required for Full Features):**
1. **Analytics and Reporting**
   - User analytics
   - Task analytics
   - Financial reporting

2. **Notification System**
   - Push notifications
   - Email notifications
   - In-app notifications

3. **File Management**
   - File upload and storage
   - File processing
   - Document management

4. **Search and Filtering**
   - Advanced search
   - Task filtering
   - User search

## Recommendations for Backend Design

### **Phase 1: Core Backend (MVP)**
1. **User Management Service**
   - User profiles and authentication
   - User preferences and settings
   - User statistics and ratings

2. **Task Management Service**
   - Task CRUD operations
   - Task status management
   - Task assignment workflow
   - File upload handling

3. **Communication Service**
   - Real-time messaging
   - Chat history storage
   - Push notifications

4. **Payment Service**
   - Payment processing
   - Wallet management
   - Transaction history

### **Phase 2: Advanced Features**
1. **AI Service Integration**
2. **Analytics and Reporting**
3. **Advanced Search and Filtering**
4. **Notification Management**

### **Phase 3: Scale and Optimize**
1. **Performance optimization**
2. **Advanced analytics**
3. **Machine learning features**
4. **Advanced payment features**

## Conclusion

The AssignMint app has a solid frontend structure with well-defined screens and user flows. However, most screens currently rely on mock data and lack proper backend integration. The primary focus should be on implementing the core backend services for user management, task management, communication, and payments to create a fully functional MVP.

The app's architecture is well-suited for a microservices backend approach, with clear separation of concerns between different functional areas. The existing API structure provides a good foundation for building out the full backend implementation.
