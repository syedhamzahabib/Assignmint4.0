// e2e/post_and_view_task.e2e.ts - Post task and view E2E tests
import { device, element, by, expect } from 'detox';
import { genEmail, pw, waitForElement, tapElement, typeText, expectElementVisible } from './helpers';

describe('Post Task and View Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should post a task and navigate to view it', async () => {
    const testEmail = genEmail();
    
    // Sign up first
    await waitForElement('auth.switchToSignUp');
    await tapElement('auth.switchToSignUp');
    await typeText('signup.displayName', 'E2E Task Poster');
    await typeText('signup.email', testEmail);
    await typeText('signup.password', pw);
    await tapElement('signup.submit');
    
    // Wait for home to load
    await waitForElement('tab.home');
    
    // Navigate to post tab
    await tapElement('tab.post');
    await waitForElement('post.title');
    
    // Fill post form
    await typeText('post.title', 'E2E Test Task');
    await typeText('post.subject', 'Mathematics');
    await typeText('post.price', '25');
    await typeText('post.deadline', '2024-12-31');
    
    // Submit post
    await tapElement('post.submit');
    
    // Wait for success confirmation
    await waitForElement('post.success');
    await expectElementVisible('post.success');
    
    // Tap "View my task" button
    await waitForElement('post.viewMyTask');
    await tapElement('post.viewMyTask');
    
    // Should navigate to task details
    await waitForElement('taskDetails.screen');
    await expectElementVisible('taskDetails.screen');
    
    // Verify task details are displayed
    await expect(element(by.text('E2E Test Task'))).toBeVisible();
    await expect(element(by.text('Mathematics'))).toBeVisible();
    await expect(element(by.text('$25'))).toBeVisible();
  });

  it('should handle task posting with minimal required fields', async () => {
    const testEmail = genEmail();
    
    // Sign up
    await waitForElement('auth.switchToSignUp');
    await tapElement('auth.switchToSignUp');
    await typeText('signup.displayName', 'E2E Minimal Poster');
    await typeText('signup.email', testEmail);
    await typeText('signup.password', pw);
    await tapElement('signup.submit');
    
    // Wait for home
    await waitForElement('tab.home');
    
    // Navigate to post
    await tapElement('tab.post');
    await waitForElement('post.title');
    
    // Fill only required fields
    await typeText('post.title', 'Minimal Task');
    await typeText('post.subject', 'Physics');
    await typeText('post.price', '15');
    
    // Submit
    await tapElement('post.submit');
    
    // Should succeed
    await waitForElement('post.success');
    
    // View task
    await waitForElement('post.viewMyTask');
    await tapElement('post.viewMyTask');
    
    // Should show task details
    await waitForElement('taskDetails.screen');
    await expect(element(by.text('Minimal Task'))).toBeVisible();
  });

  it('should show validation errors for incomplete post form', async () => {
    const testEmail = genEmail();
    
    // Sign up
    await waitForElement('auth.switchToSignUp');
    await tapElement('auth.switchToSignUp');
    await typeText('signup.displayName', 'E2E Validator');
    await typeText('signup.email', testEmail);
    await typeText('signup.password', pw);
    await tapElement('signup.submit');
    
    // Wait for home
    await waitForElement('tab.home');
    
    // Navigate to post
    await tapElement('tab.post');
    await waitForElement('post.title');
    
    // Try to submit without filling form
    await tapElement('post.submit');
    
    // Should show validation errors
    await expect(element(by.text(/Title is required/))).toBeVisible();
  });

  it('should navigate back from task details to post confirmation', async () => {
    const testEmail = genEmail();
    
    // Sign up and post task
    await waitForElement('auth.switchToSignUp');
    await tapElement('auth.switchToSignUp');
    await typeText('signup.displayName', 'E2E Navigator');
    await typeText('signup.email', testEmail);
    await typeText('signup.password', pw);
    await tapElement('signup.submit');
    
    await waitForElement('tab.home');
    await tapElement('tab.post');
    await waitForElement('post.title');
    
    await typeText('post.title', 'Navigation Test Task');
    await typeText('post.subject', 'Chemistry');
    await typeText('post.price', '30');
    await tapElement('post.submit');
    
    await waitForElement('post.success');
    await tapElement('post.viewMyTask');
    
    await waitForElement('taskDetails.screen');
    
    // Navigate back (should go to post confirmation)
    await device.pressBack();
    
    // Should be back on post confirmation
    await waitForElement('post.success');
    await expectElementVisible('post.success');
  });
});
