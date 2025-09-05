// e2e/helpers.ts - E2E test helpers
export const genEmail = (): string => `e2e_${Date.now()}@test.local`;
export const pw = 'Test1234';

export const waitForElement = async (testId: string, timeout = 10000): Promise<void> => {
  await element(by.id(testId)).waitForElement(timeout);
};

export const tapElement = async (testId: string): Promise<void> => {
  await element(by.id(testId)).tap();
};

export const typeText = async (testId: string, text: string): Promise<void> => {
  await element(by.id(testId)).typeText(text);
};

export const expectElementVisible = async (testId: string): Promise<void> => {
  await expect(element(by.id(testId))).toBeVisible();
};

export const expectElementNotVisible = async (testId: string): Promise<void> => {
  await expect(element(by.id(testId))).not.toBeVisible();
};
