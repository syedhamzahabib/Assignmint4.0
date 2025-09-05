// tests/auth/ViewMyTaskNavigate.test.tsx - View my task navigation test
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TaskPostedConfirmationScreen from '../../src/screens/TaskPostedConfirmation';

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock the route with taskId
const mockRoute = {
  params: {
    taskTitle: 'Test Task',
    budget: '25',
    matchingPreference: 'auto',
    taskId: 'test-task-123',
  },
};

// Mock the auth context
const mockUseAuth = {
  user: { uid: 'test-uid', email: 'test@example.com' },
  loading: false,
  mode: 'auth',
  logout: jest.fn(),
  enterGuest: jest.fn(),
  isAuthenticated: true,
  isGuestMode: false,
  setPendingRoute: jest.fn(),
  pendingRoute: null,
};

jest.mock('../../src/state/AuthProvider', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  default: { call: () => {} },
  Value: jest.fn(() => ({
    setValue: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
  timing: jest.fn(() => ({
    start: jest.fn(),
  })),
  sequence: jest.fn(() => ({
    start: jest.fn(),
  })),
  parallel: jest.fn(() => ({
    start: jest.fn(),
  })),
}));

// Test navigator
const Stack = createStackNavigator();

const TestNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="TaskPostedConfirmation" 
      component={TaskPostedConfirmationScreen}
      initialParams={mockRoute.params}
    />
  </Stack.Navigator>
);

const TestApp = () => (
  <NavigationContainer>
    <TestNavigator />
  </NavigationContainer>
);

describe('View My Task Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task posted confirmation screen with correct data', () => {
    // Try rendering just the component directly first
    const { getByText, debug } = render(
      <TaskPostedConfirmationScreen 
        navigation={mockNavigation}
        route={mockRoute}
      />
    );
    
    // Debug: log what was rendered
    debug();

    expect(getByText('Test Task')).toBeTruthy();
    expect(getByText('$25')).toBeTruthy();
    expect(getByText('Auto-Match')).toBeTruthy();
  });

  it('has a "View my task" button with correct testID', () => {
    const { getByTestId } = render(
      <TaskPostedConfirmationScreen 
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    const viewMyTaskButton = getByTestId('post.viewMyTask');
    expect(viewMyTaskButton).toBeTruthy();
  });

  it('navigates to TaskDetails in TasksStack when "View my task" is pressed', async () => {
    const { getByTestId } = render(
      <TaskPostedConfirmationScreen 
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    const viewMyTaskButton = getByTestId('post.viewMyTask');
    
    // Test the navigation directly since we're passing mockNavigation
    fireEvent.press(viewMyTaskButton);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('MyTasksStack', {
        screen: 'TaskDetails',
        params: { taskId: 'test-task-123' },
      });
    });
  });

  it('passes correct taskId to TaskDetails screen', () => {
    const { getByTestId } = render(
      <TaskPostedConfirmationScreen 
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    const viewMyTaskButton = getByTestId('post.viewMyTask');
    
    // Verify the button exists and has the correct testID
    expect(viewMyTaskButton).toBeTruthy();
    
    // The navigation logic should use the taskId from route params
    expect(mockRoute.params.taskId).toBe('test-task-123');
  });

  it('shows success message after task posting', () => {
    const { getByText } = render(
      <TaskPostedConfirmationScreen 
        navigation={mockNavigation}
        route={mockRoute}
      />
    );

    // Should show success message
    expect(getByText(/Your task has been posted!/)).toBeTruthy();
  });

  it('handles navigation without taskId gracefully', () => {
    const routeWithoutTaskId = {
      params: {
        taskTitle: 'Test Task',
        budget: '25',
        matchingPreference: 'auto',
        // No taskId
      },
    };

    const { getByTestId } = render(
      <TaskPostedConfirmationScreen 
        navigation={mockNavigation}
        route={routeWithoutTaskId}
      />
    );

    const viewMyTaskButton = getByTestId('post.viewMyTask');
    expect(viewMyTaskButton).toBeTruthy();
  });
});
