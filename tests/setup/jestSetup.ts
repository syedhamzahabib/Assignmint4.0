// tests/setup/jestSetup.ts - Simple Jest setup for React Native testing
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

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

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Polyfill fetch
import 'whatwg-fetch';

// Mock the entire Firebase lib
jest.mock('../../src/lib/firebase', () => ({
  app: {},
  auth: {
    onAuthStateChanged: jest.fn(() => jest.fn()),
    signOut: jest.fn(() => Promise.resolve()),
  },
  db: {},
  database: {},
  storage: {},
}));

// Mock navigation - create simple mocks without requireActual
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    reset: jest.fn(),
    setOptions: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-navigation/stack', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    reset: jest.fn(),
    setOptions: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  createStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: ({ children }: { children: React.ReactNode }) => children,
  }),
}));

// Mock react-native core modules
jest.mock('react-native', () => ({
  View: ({ children, testID, ...props }: any) => {
    const React = require('react');
    return React.createElement('View', { testID, ...props }, children);
  },
  Text: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('Text', props, children);
  },
  Image: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('Image', props, children);
  },
  ScrollView: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('ScrollView', props, children);
  },
  FlatList: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('FlatList', props, children);
  },
  TouchableOpacity: ({ children, testID, onPress, ...props }: any) => {
    const React = require('react');
    return React.createElement('TouchableOpacity', { testID, onPress, ...props }, children);
  },
  TouchableHighlight: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('TouchableHighlight', props, children);
  },
  TextInput: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('TextInput', props, children);
  },
  Switch: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('Switch', props, children);
  },
  Slider: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('Slider', props, children);
  },
  Modal: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('Modal', props, children);
  },
  StatusBar: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('StatusBar', props, children);
  },
  SafeAreaView: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('SafeAreaView', props, children);
  },
  ActivityIndicator: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('ActivityIndicator', props, children);
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
  },
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios),
  },
  StyleSheet: {
    create: jest.fn((styles) => styles),
    flatten: jest.fn((style) => style),
  },
  Animated: {
    View: ({ children, style, ...props }: any) => {
      const React = require('react');
      return React.createElement('View', { style, ...props }, children);
    },
    timing: jest.fn(() => ({
      start: jest.fn(),
    })),
    sequence: jest.fn(() => ({
      start: jest.fn(),
    })),
    parallel: jest.fn(() => ({
      start: jest.fn(),
    })),
    Value: jest.fn(() => ({
      setValue: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  },
  Alert: {
    alert: jest.fn(),
  },
  Linking: {
    openURL: jest.fn(),
  },
}));

// Global test utilities
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};


