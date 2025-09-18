import { SettingsService } from '../src/services/SettingsService';
import { Settings } from '../src/state/models';

describe('SettingsService', () => {
  it('can be imported', () => {
    expect(SettingsService).toBeDefined();
  });

  it('should have required static methods', () => {
    expect(typeof SettingsService.saveSettings).toBe('function');
    expect(typeof SettingsService.getSettings).toBe('function');
  });

  it('should handle saveSettings method signature', () => {
    const method = SettingsService.saveSettings;
    expect(method.length).toBe(1); // Should accept 1 parameter (Settings object)
  });

  it('should handle getSettings method signature', () => {
    const method = SettingsService.getSettings;
    expect(method.length).toBe(0); // Should accept no parameters
  });

  it('should return Settings instance from getSettings', async () => {
    const settings = await SettingsService.getSettings();
    expect(settings).toBeInstanceOf(Settings);
  });
});
