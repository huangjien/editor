import { device, element, by, expect } from 'detox';

describe('First Time Setup', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show welcome screen on first launch', async () => {
    await expect(element(by.id('welcome_screen'))).toBeVisible();
  });

  it('should navigate to settings and allow input', async () => {
    // This test will initially fail as the UI is not yet implemented
    await element(by.id('navigate_to_settings_button')).tap();
    await expect(element(by.id('settings_screen'))).toBeVisible();
    await element(by.id('github_token_input')).typeText('test_token');
    await expect(element(by.id('github_token_input'))).toHaveText('test_token');
  });
});
