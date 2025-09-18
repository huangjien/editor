import { SettingsService } from '../src/services/SettingsService';
import { Settings } from '../src/state/models';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('SettingsService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should save settings correctly', async () => {
    const settingsToSave = new Settings();
    settingsToSave.githubToken = 'test_token';
    settingsToSave.fontSize = 18;

    await SettingsService.saveSettings(settingsToSave);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'app_settings',
      JSON.stringify(settingsToSave),
    );
  });

  it('should retrieve default settings if none are saved', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const retrievedSettings = await SettingsService.getSettings();

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('app_settings');
    expect(retrievedSettings).toEqual(new Settings());
  });

  it('should retrieve saved settings correctly', async () => {
    const savedSettings = new Settings();
    savedSettings.githubToken = 'saved_token';
    savedSettings.playSpeed = 1.5;

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(savedSettings),
    );

    const retrievedSettings = await SettingsService.getSettings();

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('app_settings');
    expect(retrievedSettings).toEqual(savedSettings);
  });

  it('should handle errors during saveSettings', async () => {
    const error = new Error('AsyncStorage error');
    (AsyncStorage.setItem as jest.Mock).mockRejectedValue(error);

    const settingsToSave = new Settings();
    await expect(SettingsService.saveSettings(settingsToSave)).rejects.toThrow(
      'AsyncStorage error',
    );
    expect(console.error).toHaveBeenCalledWith('Error saving settings:', error);
  });

  it('should handle errors during getSettings', async () => {
    const error = new Error('AsyncStorage error');
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(error);

    await expect(SettingsService.getSettings()).rejects.toThrow(
      'AsyncStorage error',
    );
    expect(console.error).toHaveBeenCalledWith(
      'Error retrieving settings:',
      error,
    );
  });
});
