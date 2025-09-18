import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from '../state/models';

const SETTINGS_KEY = 'app_settings';

export class SettingsService {
  static async saveSettings(settings: Settings): Promise<void> {
    try {
      const jsonSettings = JSON.stringify(settings);
      await AsyncStorage.setItem(SETTINGS_KEY, jsonSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  static async getSettings(): Promise<Settings> {
    try {
      const jsonSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (jsonSettings) {
        const settingsData = JSON.parse(jsonSettings);
        // Reconstruct Settings object to ensure it has all methods/defaults if any were added later
        return Object.assign(new Settings(), settingsData);
      }
      return new Settings(); // Return default settings if none found
    } catch (error) {
      console.error('Error retrieving settings:', error);
      throw error;
    }
  }
}
