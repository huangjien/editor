import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { SettingsScreen } from '../src/screens/SettingsScreen';
import { SettingsService } from '../src/services/SettingsService';
import { Settings } from '../src/state/models';
import { Alert } from 'react-native';

// Mock SettingsService
jest.mock('../src/services/SettingsService');

// Mock Alert
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Alert: {
    alert: jest.fn(),
  },
}));

describe('SettingsScreen', () => {
  const mockSettings = new Settings();
  mockSettings.githubToken = 'initial_token';
  mockSettings.githubRepoUrl = 'https://github.com/initial/repo';
  mockSettings.fontSize = 20;

  beforeEach(() => {
    jest.clearAllMocks();
    (SettingsService.getSettings as jest.Mock).mockResolvedValue(mockSettings);
    (SettingsService.saveSettings as jest.Mock).mockResolvedValue(undefined);
  });

  it('loads and displays settings correctly', async () => {
    const { getByDisplayValue } = render(<SettingsScreen />);
    await waitFor(() => {
      expect(getByDisplayValue('initial_token')).toBeTruthy();
      expect(getByDisplayValue('https://github.com/initial/repo')).toBeTruthy();
      expect(getByDisplayValue('20')).toBeTruthy();
    });
  });

  it('updates settings state on text input change', async () => {
    const { getByPlaceholderText } = render(<SettingsScreen />);
    const tokenInput = await waitFor(() =>
      getByPlaceholderText('Enter GitHub Personal Access Token'),
    );
    fireEvent.changeText(tokenInput, 'new_token');
    expect(tokenInput.props.value).toBe('new_token');
  });

  it('saves settings and shows success alert', async () => {
    const { getByText, getByPlaceholderText } = render(<SettingsScreen />);
    const tokenInput = await waitFor(() =>
      getByPlaceholderText('Enter GitHub Personal Access Token'),
    );
    fireEvent.changeText(tokenInput, 'new_token_to_save');

    getByText('Save Settings').press();

    await waitFor(() => {
      expect(SettingsService.saveSettings).toHaveBeenCalledWith({
        ...mockSettings,
        githubToken: 'new_token_to_save',
      });
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success',
        'Settings saved successfully!',
      );
    });
  });

  it('shows error alert if saving settings fails', async () => {
    (SettingsService.saveSettings as jest.Mock).mockRejectedValue(
      new Error('Save failed'),
    );
    const { getByText } = render(<SettingsScreen />);
    getByText('Save Settings').press();

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'Failed to save settings.',
      );
    });
  });

  it('shows error alert if loading settings fails', async () => {
    (SettingsService.getSettings as jest.Mock).mockRejectedValue(
      new Error('Load failed'),
    );
    render(<SettingsScreen />);
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'Failed to load settings.',
      );
    });
  });
});
