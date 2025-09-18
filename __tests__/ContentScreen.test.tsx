import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { ContentScreen } from '../src/screens/ContentScreen';
import { SettingsService } from '../src/services/SettingsService';
import { GitHubService } from '../src/services/GitHubService';
import { useRoute, useNavigation } from '@react-navigation/native';
import Tts from 'react-native-tts';
import TrackPlayer, {
  usePlaybackState,
  State,
} from 'react-native-track-player';

// Mock navigation and route
jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}));

// Mock services
jest.mock('../src/services/SettingsService');
jest.mock('../src/services/GitHubService');
jest.mock('../src/services/trackPlayerService', () => ({
  playChapter: jest.fn(),
  togglePlayback: jest.fn(),
}));

// Mock react-native-tts
jest.mock('react-native-tts', () => ({
  __esModule: true,
  default: {
    setDefaultLanguage: jest.fn(),
    setDefaultRate: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    speak: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
  },
}));

// Mock react-native-track-player
jest.mock('react-native-track-player', () => ({
  __esModule: true,
  default: {
    pause: jest.fn(),
    getCurrentTrack: jest.fn(),
  },
  usePlaybackState: jest.fn(),
  State: {
    Playing: 'playing',
    Paused: 'paused',
    Buffering: 'buffering',
    Stopped: 'stopped',
  },
}));

describe('ContentScreen', () => {
  const mockChapterId = 'chapters/test.md';
  const mockChapterTitle = 'Test Chapter';
  const mockChapterContent = 'This is test content.';
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useRoute as jest.Mock).mockReturnValue({
      params: { chapterId: mockChapterId, chapterTitle: mockChapterTitle },
    });
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    (SettingsService.getSettings as jest.Mock).mockResolvedValue({
      githubToken: 'test_token',
      githubRepoUrl: 'https://github.com/test/repo',
      githubRepoBranch: 'main',
      playSpeed: 1.0,
    });
    (GitHubService.fetchChapterContent as jest.Mock).mockResolvedValue(
      mockChapterContent,
    );
    (usePlaybackState as jest.Mock).mockReturnValue({ state: State.Paused });
    jest.clearAllMocks();
  });

  it('renders loading indicator initially', () => {
    (GitHubService.fetchChapterContent as jest.Mock).mockReturnValue(
      new Promise(() => {}),
    ); // Keep it loading
    const { getByText } = render(<ContentScreen />);
    expect(getByText('Loading chapter...')).toBeTruthy();
  });

  it('renders chapter content after fetching', async () => {
    const { getByText } = render(<ContentScreen />);
    await waitFor(() => expect(getByText(mockChapterTitle)).toBeTruthy());
    expect(getByText(mockChapterContent)).toBeTruthy();
  });

  it('calls TTS speak and TrackPlayer play on Play button press', async () => {
    const { getByText } = render(<ContentScreen />);
    await waitFor(() => expect(getByText('Play/Pause')).toBeTruthy());
    getByText('Play/Pause').press();
    expect(Tts.speak).toHaveBeenCalledWith(mockChapterContent);
    expect(TrackPlayer.pause).not.toHaveBeenCalled(); // Should not pause if not playing
  });

  it('calls TTS pause and TrackPlayer pause on Pause button press', async () => {
    (usePlaybackState as jest.Mock).mockReturnValue({ state: State.Playing });
    const { getByText } = render(<ContentScreen />);
    await waitFor(() => expect(getByText('Play/Pause')).toBeTruthy());
    getByText('Play/Pause').press();
    expect(Tts.pause).toHaveBeenCalled();
    expect(TrackPlayer.pause).toHaveBeenCalled();
  });

  it('calls Tts.stop on Next/Previous chapter press', async () => {
    const { getByText } = render(<ContentScreen />);
    await waitFor(() => expect(getByText('Next')).toBeTruthy());
    getByText('Next').press();
    expect(Tts.stop).toHaveBeenCalled();

    getByText('Previous').press();
    expect(Tts.stop).toHaveBeenCalledTimes(2);
  });
});
