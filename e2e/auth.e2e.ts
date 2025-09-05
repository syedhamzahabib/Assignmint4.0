// e2e/auth.e2e.ts - Authentication E2E tests
import { device, element, by, expect } from 'detox';
import { genEmail, pw, waitForElement, tapElement, typeText, expectElementVisible } from './helpers';

describe('Authentication Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should sign up a new user and navigate to home', async () => {
    const testEmail = genEmail();
    
    // Wait for auth screen to load
    await waitForElement('auth.switchToSignUp');
    
    // Navigate to sign up
    await tapElement('auth.switchToSignUp');
    
    // Fill sign up form
    await typeText('signup.displayName', 'E2E Test User');
    await typeText('signup.email', testEmail);
    await typeText('signup.password', pw);
    
    // Submit form
    await tapElement('signup.submit');
    
    // Wait for navigation to home (should see tab bar)
    await waitForElement('tab.home');
    await expectElementVisible('tab.home');
    
    // Verify we're on the home tab
    await expect(element(by.id('tab.home'))).toBeVisible();
  });

  it('should sign out and return to login screen', async () => {
    // First sign in (assuming previous test created user)
    const testEmail = genEmail();
    
    // Navigate to login
    await waitForElement('auth.switchToSignUp');
    await tapElement('auth.switchToSignUp');
    
    // Fill login form
    await typeText('login.email', testEmail);
    await typeText('login.password', pw);
    
    // Submit form
    await tapElement('login.submit');
    
    // Wait for home to load
    await waitForElement('tab.home');
    
    // Navigate to profile and sign out
    await tapElement('tab.profile');
    await waitForElement('settings.signout');
    await tapElement('settings.signout');
    
    // Should return to login screen
    await waitForElement('login.email');
    await expectElementVisible('login.email');
  });

  it('should handle login with existing credentials', async () => {
    // Create a user first
    const testEmail = genEmail();
    
    // Sign up
    await waitForElement('auth.switchToSignUp');
    await tapElement('auth.switchToSignUp');
    await typeText('signup.displayName', 'E2E Test User');
    await typeText('signup.email', testEmail);
    await typeText('signup.password', pw);
    await tapElement('signup.submit');
    
    // Wait for home
    await waitForElement('tab.home');
    
    // Sign out
    await tapElement('tab.profile');
    await waitForElement('settings.signout');
    await tapElement('settings.signout');
    
    // Sign back in
    await waitForElement('login.email');
    await typeText('login.email', testEmail);
    await typeText('login.password', pw);
    await tapElement('login.submit');
    
    // Should be back on home
    await waitForElement('tab.home');
    await expectElementVisible('tab.home');
  });

  it('should show validation errors for invalid inputs', async () => {
    // Navigate to sign up
    await waitForElement('auth.switchToSignUp');
    await tapElement('auth.switchToSignUp');
    
    // Try to submit without filling form
    await tapElement('signup.submit');
    
    // Should show validation errors
    await expect(element(by.text(/Name is required/))).toBeVisible();
  });
});
