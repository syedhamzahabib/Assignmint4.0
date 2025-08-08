// src/navigation/NavigationService.js
// Navigation service for centralized screen management

import { SCREEN_NAMES } from '../constants';

class NavigationService {
  constructor() {
    this.currentScreen = SCREEN_NAMES.HOME;
    this.navigationStack = [SCREEN_NAMES.HOME];
    this.listeners = [];
  }

  // Subscribe to navigation changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of navigation change
  notify(screenName, params = {}) {
    this.listeners.forEach(listener => {
      listener(screenName, params);
    });
  }

  // Navigate to a screen
  navigate(screenName, params = {}) {
    console.log(`🧭 Navigating to: ${screenName}`, params);
    
    if (this.currentScreen !== screenName) {
      this.navigationStack.push(screenName);
      this.currentScreen = screenName;
      this.notify(screenName, params);
    }
  }

  // Go back to previous screen
  goBack() {
    if (this.navigationStack.length > 1) {
      this.navigationStack.pop(); // Remove current screen
      const previousScreen = this.navigationStack[this.navigationStack.length - 1];
      this.currentScreen = previousScreen;
      console.log(`🧭 Going back to: ${previousScreen}`);
      this.notify(previousScreen);
    }
  }

  // Reset navigation to home
  reset() {
    this.currentScreen = SCREEN_NAMES.HOME;
    this.navigationStack = [SCREEN_NAMES.HOME];
    this.notify(SCREEN_NAMES.HOME);
  }

  // Get current screen
  getCurrentScreen() {
    return this.currentScreen;
  }

  // Check if can go back
  canGoBack() {
    return this.navigationStack.length > 1;
  }

  // Get navigation stack
  getStack() {
    return [...this.navigationStack];
  }
}

// Create singleton instance
const navigationService = new NavigationService();

// Navigation hook for React components
export const useNavigation = () => {
  const [currentScreen, setCurrentScreen] = React.useState(
    navigationService.getCurrentScreen()
  );

  React.useEffect(() => {
    const unsubscribe = navigationService.subscribe((screenName) => {
      setCurrentScreen(screenName);
    });

    return unsubscribe;
  }, []);

  return {
    currentScreen,
    navigate: navigationService.navigate.bind(navigationService),
    goBack: navigationService.goBack.bind(navigationService),
    reset: navigationService.reset.bind(navigationService),
    canGoBack: navigationService.canGoBack.bind(navigationService),
    getStack: navigationService.getStack.bind(navigationService),
  };
};

export default navigationService;