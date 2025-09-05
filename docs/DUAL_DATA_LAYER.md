# Dual Data Layer Implementation

This document explains how to use the dual data layer system in AssignMint, which allows switching between mock data and real Firestore data.

## Overview

The dual data layer system provides a seamless way to switch between mock data (for development/testing) and real Firestore data (for production) without changing application code.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Components    │    │ DataSourceManager│    │   DataSource    │
│   (Screens,    │───▶│   (Singleton)    │───▶│   Interface     │
│    Hooks)      │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                ┌─────────────────────────────────┐
                │                                 │
        ┌───────▼──────┐              ┌──────────▼─────────┐
        │MockDataSource│              │ FirestoreDataSource│
        │              │              │                    │
        │ - In-memory  │              │ - Real Firestore   │
        │ - Fast       │              │ - Persistent       │
        │ - No network │              │ - Network calls    │
        └──────────────┘              └────────────────────┘
```

## Components

### 1. DataSource Interface (`src/services/DataSource.ts`)
Defines the contract that all data sources must implement:
- Task operations (CRUD, claim, submit, accept, reject)
- User operations (profiles, ratings)
- Notification operations
- Message operations
- Search and filtering

### 2. MockDataSource (`src/services/MockDataSource.ts`)
Implements the DataSource interface using in-memory arrays:
- Uses data from `src/data/mockData.ts`
- Simulates network delays with `setTimeout`
- Perfect for development and testing
- No external dependencies

### 3. FirestoreDataSource (`src/services/FirestoreDataSource.ts`)
Implements the DataSource interface using real Firestore:
- Real-time data persistence
- Authentication and authorization
- Transaction support
- Production-ready

### 4. DataSourceManager (`src/services/DataSourceManager.ts`)
Singleton class that manages data source switching:
- Automatically selects data source on initialization
- Provides methods to switch between sources
- Handles connection testing

### 5. useDataSource Hook (`src/hooks/useDataSource.ts`)
React hook that provides data source access:
- Returns current data source instance
- Provides switching methods
- Shows connection status
- Handles loading states

## Usage

### Basic Usage

```typescript
import { useDataSource } from '../hooks/useDataSource';

const MyComponent = () => {
  const { dataSource, isUsingMock, connectionStatus } = useDataSource();

  const loadTasks = async () => {
    try {
      const tasks = await dataSource?.getTasks();
      // Use tasks...
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  return (
    <View>
      <Text>Using: {isUsingMock ? 'Mock' : 'Firestore'}</Text>
      <Text>Status: {connectionStatus}</Text>
      {/* Your component content */}
    </View>
  );
};
```

### Switching Data Sources

```typescript
const { switchToMock, switchToFirestore } = useDataSource();

// Switch to mock data
await switchToMock();

// Switch to Firestore
await switchToFirestore();
```

### Development Toggle

The `DataSourceToggle` component provides a UI for switching data sources during development:

```typescript
import { DataSourceToggle } from '../components/common/DataSourceToggle';

// Only shows in development mode
<DataSourceToggle />
```

## Configuration

### Environment Configuration

The system uses `src/config/environment.ts` to determine the default data source:

```typescript
// Default configuration
const defaultConfig: EnvironmentConfig = {
  USE_MOCK_DATA: false, // Default to Firestore
  // ... other config
};
```

### Runtime Configuration

You can switch data sources at runtime using the `useDataSource` hook:

```typescript
const { switchToMock, switchToFirestore } = useDataSource();

// Switch based on user preference or app state
if (userWantsMockData) {
  await switchToMock();
} else {
  await switchToFirestore();
}
```

## Benefits

### 1. Development
- Fast iteration without network calls
- Consistent data for testing
- No need for internet connection
- Easy to test edge cases

### 2. Testing
- Predictable data for unit tests
- No external dependencies
- Fast test execution
- Easy to mock specific scenarios

### 3. Production
- Real-time data persistence
- User authentication
- Scalable cloud infrastructure
- Offline support (with Firestore)

### 4. Flexibility
- Easy switching between sources
- Gradual migration from mock to real
- A/B testing capabilities
- Fallback mechanisms

## Best Practices

### 1. Always Use the Interface
```typescript
// ✅ Good - Use the interface
const { dataSource } = useDataSource();
const tasks = await dataSource?.getTasks();

// ❌ Bad - Don't import specific implementations directly
import { MockDataSource } from './MockDataSource';
const mockData = new MockDataSource();
```

### 2. Handle Connection Status
```typescript
const { connectionStatus, dataSource } = useDataSource();

if (connectionStatus === 'disconnected') {
  // Show offline message or fallback UI
  return <OfflineMessage />;
}

if (!dataSource) {
  // Show loading state
  return <LoadingSpinner />;
}
```

### 3. Test Both Data Sources
```typescript
// In your tests, test both implementations
describe('TaskService', () => {
  it('should work with mock data', async () => {
    // Test with MockDataSource
  });

  it('should work with Firestore', async () => {
    // Test with FirestoreDataSource
  });
});
```

### 4. Monitor Performance
```typescript
const { isUsingMock } = useDataSource();

// Log performance metrics
if (!isUsingMock) {
  console.time('firestore-operation');
  const result = await dataSource?.getTasks();
  console.timeEnd('firestore-operation');
}
```

## Troubleshooting

### Common Issues

1. **Data Source Not Initializing**
   - Check that `DataSourceManager.getInstance()` is called
   - Verify environment configuration
   - Check console for initialization errors

2. **Mock Data Not Working**
   - Ensure `USE_MOCK_DATA` is set to `true`
   - Check that mock data files are properly imported
   - Verify that `MockDataSource` implements all required methods

3. **Firestore Connection Issues**
   - Check Firebase configuration
   - Verify network connectivity
   - Check Firebase console for errors
   - Ensure proper authentication

4. **Type Errors**
   - Verify that all data sources implement the `DataSource` interface
   - Check that data structures match between mock and Firestore
   - Ensure proper TypeScript compilation

### Debug Mode

Enable debug logging by setting `ENABLE_LOGGING: true` in your environment configuration:

```typescript
const config: EnvironmentConfig = {
  ENABLE_LOGGING: true,
  // ... other config
};
```

## Migration Guide

### From Mock to Firestore

1. **Prepare Firestore**
   - Set up Firebase project
   - Configure Firestore rules
   - Set up authentication

2. **Update Configuration**
   - Set `USE_MOCK_DATA: false`
   - Configure Firebase credentials

3. **Test Gradually**
   - Start with read operations
   - Test write operations
   - Verify offline behavior

4. **Monitor Performance**
   - Track API response times
   - Monitor error rates
   - Check user experience

### From Firestore to Mock

1. **Set Configuration**
   - Set `USE_MOCK_DATA: true`
   - Update mock data if needed

2. **Test Functionality**
   - Verify all features work
   - Check data consistency
   - Test edge cases

## Future Enhancements

- **Hybrid Mode**: Use mock for some operations, Firestore for others
- **Data Synchronization**: Sync mock data with Firestore
- **Offline Support**: Enhanced offline capabilities
- **Performance Monitoring**: Built-in performance tracking
- **A/B Testing**: Easy switching for user testing
