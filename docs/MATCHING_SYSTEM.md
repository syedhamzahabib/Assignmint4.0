# AssignMint Assisted Matching System

## Overview

The Assisted Matching System automatically connects task owners with qualified experts through a sophisticated scoring and invitation process. It implements a "rank → invite → soft-claim → expand ring" workflow to ensure efficient task assignment.

## Architecture

### Core Components

1. **Scoring Engine** (`src/utils/matching/score.ts`)
   - Calculates expert-task compatibility scores
   - Uses weighted signals: subject fit, price fit, deadline fit, rating, etc.
   - Fully unit-testable pure functions

2. **Invite Service** (`src/services/matching/inviteService.ts`)
   - Finds eligible experts by subject
   - Ranks experts using scoring algorithm
   - Creates and manages invites
   - Handles push notifications

3. **Reservation Service** (`src/services/matching/reservationService.ts`)
   - Manages soft-claims (15-minute reservations)
   - Handles claim confirmation
   - Auto-releases expired reservations

4. **Task Creation Trigger** (`src/services/matching/onTaskCreate.ts`)
   - Automatically triggers matching on new task creation
   - Sends initial wave of invites

5. **Expand Ring Service** (`src/services/matching/expandRing.ts`)
   - Expands invitation pool after initial wave
   - Implements progressive invitation strategy

6. **Development Scheduler** (`src/services/matching/devScheduler.ts`)
   - Runs background tasks in development
   - Handles reservation cleanup and ring expansion

### Data Models

#### Task
```typescript
interface Task {
  // ... existing fields ...
  status: 'open' | 'reserved' | 'claimed' | 'submitted' | 'completed';
  ownerId: string;
  price: number;
  deadlineISO: string;
  reservedBy?: string | null;
  reservedUntil?: Date | null;
  matching?: {
    invitedNow: number;
    nextWaveAt: Date;
  };
}
```

#### ExpertUser
```typescript
interface ExpertUser {
  uid: string;
  displayName: string;
  subjects: string[];
  minPrice?: number;
  maxPrice?: number;
  level: 'HS' | 'UG' | 'Grad';
  ratingAvg: number;
  ratingCount: number;
  acceptRate: number;
  medianResponseMins: number;
  completedBySubject: Record<string, number>;
}
```

#### Invite
```typescript
interface Invite {
  inviteId: string;
  taskId: string;
  expertId: string;
  sentAt: Date;
  respondedAt?: Date | null;
  status: 'sent' | 'accepted' | 'declined';
  lastScore: number;
}
```

## Workflow

### 1. Task Creation
- Owner creates task with status "open"
- System automatically finds eligible experts
- Ranks experts by compatibility score
- Sends invites to top 5 experts
- Sets next wave timer (15 minutes)

### 2. Expert Response
- Expert receives invite notification
- Can soft-claim task (15-minute reservation)
- Must confirm claim within reservation window
- If not confirmed, reservation auto-releases

### 3. Ring Expansion
- After 15 minutes, if task still open:
  - Expand to next 20 experts
  - After another 15 minutes: full broadcast
- Updates task.matching metadata

### 4. Task Assignment
- Expert confirms claim → task status = "claimed"
- Task assigned to expert permanently
- No more invites sent

## Scoring Algorithm

### Weights
- **Subject Fit**: 25% (expert has subject or completed 2+ tasks)
- **Price Fit**: 15% (within expert's range)
- **Deadline Fit**: 15% (can meet deadline)
- **Rating**: 15% (3.5-5.0 mapped to 0-1)
- **Accept Rate**: 10% (accepted/received ratio)
- **Response Speed**: 10% (median response time)
- **Level Match**: 5% (expert level compatibility)
- **Historical Success**: 5% (completed tasks in subject)

### Signal Calculations
All signals are normalized to 0-1 scale for consistent scoring.

## Security Rules

### Tasks
- Owners: full read/write access
- Experts: read open tasks, write soft-claims/confirmations
- System: update matching metadata

### Invites
- Experts: read own invites, update status
- System: create invites

### Users
- Users: read/write own profile
- Experts: read other expert profiles for matching

## Firestore Indexes

Required composite indexes for optimal performance:

1. `tasks(status asc, subject asc, createdAt desc)`
2. `tasks(status asc, reservedUntil asc)`
3. `invites(taskId asc, expertId asc)`
4. `users(subjects array-contains, ratingAvg asc, ratingCount asc)`
5. `tasks(matching.nextWaveAt asc, status asc)`
6. `tasks(reservedBy asc, status asc, reservedUntil asc)`

## Usage

### Basic Matching
```typescript
import { useMatching } from '../hooks/useMatching';

const { triggerMatching, softClaimTask } = useMatching();

// Trigger matching for a task
await triggerMatching(taskId);

// Expert soft-claims a task
await softClaimTask(taskId, expertId);
```

### Components
```typescript
import { 
  SoftClaimButton, 
  ConfirmClaimButton, 
  TaskMatchingBanner 
} from '../components/matching';

// Show matching status banner
<TaskMatchingBanner task={task} />

// Expert action buttons
<SoftClaimButton task={task} expertId={expertId} />
<ConfirmClaimButton task={task} expertId={expertId} />
```

### Services
```typescript
import { 
  InviteService, 
  ReservationService, 
  DevScheduler 
} from '../services/matching';

// Start development scheduler
DevScheduler.start();

// Get eligible experts
const experts = await InviteService.getEligibleExperts(task);
```

## Development

### Environment Configuration
Set `USE_MOCK_DATA=true` in environment config for testing:
- Shorter reservation windows (30s vs 60s)
- Fewer initial invites (3 vs 5)
- In-app banners instead of push notifications

### Testing
1. **Seed Data**: Run `npm run seed:matching` to create test experts and tasks
2. **Simulate Flow**: Create task → check invites → soft-claim → confirm
3. **Monitor Logs**: Watch console for matching system activity

### Mock Mode Features
- Manual matching trigger button
- Shorter intervals for faster testing
- Visual feedback for all operations

## Deployment

### Production Considerations
1. **Cloud Functions**: Migrate scheduler to Cloud Functions cron jobs
2. **Push Notifications**: Integrate with production push service
3. **Monitoring**: Add analytics and error tracking
4. **Rate Limiting**: Implement invite rate limits
5. **Caching**: Cache expert data for performance

### Index Deployment
Deploy Firestore indexes:
```bash
firebase deploy --only firestore:indexes
```

### Security Rules
Deploy security rules:
```bash
firebase deploy --only firestore:rules
```

## Troubleshooting

### Common Issues
1. **Index Errors**: Ensure all composite indexes are created
2. **Permission Denied**: Check Firestore security rules
3. **No Experts Found**: Verify expert data structure and subjects
4. **Matching Not Triggering**: Check task status and creation flow

### Debug Mode
Enable detailed logging in development:
```typescript
// Check scheduler status
console.log(DevScheduler.getStatus());

// Monitor matching activity
console.log('Matching system active:', DevScheduler.isActive());
```

## Future Enhancements

1. **AI-Powered Matching**: Use ML for better expert-task compatibility
2. **Dynamic Pricing**: Adjust task prices based on demand
3. **Expert Availability**: Real-time availability tracking
4. **Batch Processing**: Handle multiple tasks simultaneously
5. **Performance Optimization**: Implement caching and query optimization
