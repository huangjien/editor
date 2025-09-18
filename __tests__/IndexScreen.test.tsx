import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { IndexScreen } from '../src/screens/IndexScreen';
import { SettingsService } from '../src/services/SettingsService';
import { GitHubService } from '../src/services/GitHubService';
import { useNavigation } from '@react-navigation/native';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

// Mock services
jest.mock('../src/services/SettingsService');
jest.mock('../src/services/GitHubService');

describe('IndexScreen', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    (SettingsService.getSettings as jest.Mock).mockResolvedValue({
      githubToken: 'test_token',
      githubRepoUrl: 'https://github.com/test/repo',
      githubRepoBranch: 'main',
      contentFolderPath: 'chapters',
    });
    (GitHubService.fetchChapterList as jest.Mock).mockResolvedValue([
      { id: '1', title: 'Chapter 1' },
      { id: '2', title: 'Chapter 2' },
    ]);
  });

  it('renders loading indicator initially', () => {
    const { getByText } = render(<IndexScreen />);
    expect(getByText('Loading chapters...')).toBeTruthy();
  });

  it('renders chapter list after fetching', async () => {
    const { getByText } = render(<IndexScreen />);
    await waitFor(() => expect(getByText('Chapter 1')).toBeTruthy());
    expect(getByText('Chapter 2')).toBeTruthy();
  });

  it('shows message if no chapters found', async () => {
    (GitHubService.fetchChapterList as jest.Mock).mockResolvedValue([]);
    const { getByText } = render(<IndexScreen />);
    await waitFor(() =>
      expect(getByText('No chapters found. Check your settings.')).toBeTruthy(),
    );
  });

  it('navigates to Content screen on chapter press', async () => {
    const { getByText } = render(<IndexScreen />);
    await waitFor(() => expect(getByText('Chapter 1')).toBeTruthy());
    getByText('Chapter 1').press();
    expect(mockNavigate).toHaveBeenCalledWith('Content', {
      chapterId: '1',
      chapterTitle: 'Chapter 1',
    });
  });

  it('shows alert if settings are missing', async () => {
    (SettingsService.getSettings as jest.Mock).mockResolvedValue({
      githubToken: '',
      githubRepoUrl: '',
      githubRepoBranch: '',
      contentFolderPath: '',
    });
    const { getByText } = render(<IndexScreen />);
    await waitFor(() =>
      expect(getByText('Configuration Missing')).toBeTruthy(),
    );
  });
});
