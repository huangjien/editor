// Jest setup file for React Native

// Mock i18n to return English translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => {
      const translations = {
        'common.welcome': 'Welcome to Modern Fleet App',
        'common.journey_begins': 'Your journey into novels begins here.',
        'common.about': 'About Modern Fleet App',
        'common.version': 'Version',
        'common.previous': 'Previous',
        'common.play': 'Play',
        'common.pause': 'Pause',
        'common.next': 'Next',
        'common.loading_chapter': 'Loading chapter...',
        'common.configuration_missing': 'Configuration Missing',
        'common.configure_github_settings':
          'Please configure GitHub settings in the Settings page.',
        'common.error': 'Error',
        'common.failed_to_fetch_chapter_content':
          'Failed to fetch chapter content. Check your GitHub settings and network connection.',
        'common.chapters': 'Chapters',
        'common.no_chapters_found': 'No chapters found',
        'common.loading': 'Loading...',
        'common.loading_chapters': 'Loading chapters...',
        'common.settings': 'Settings',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.github_token': 'GitHub Token',
        'common.github_repo_url': 'GitHub Repository URL',
        'common.github_repo_branch': 'GitHub Repository Branch',
        'common.content_folder_path': 'Content Folder Path',
        'common.play_speed': 'Play Speed',
        previous: 'Previous',
        play: 'Play',
        pause: 'Pause',
        next: 'Next',
        settings: 'Settings',
        chapters: 'Chapters',
        welcome: 'Welcome to Modern Fleet App',
        journey_begins: 'Your journey into novels begins here.',
        about: 'About Modern Fleet App',
        version: 'Version',
        save_settings: 'Save Settings',
        configuration_missing: 'Configuration Missing',
        configure_github_settings:
          'Please configure GitHub settings in the Settings page.',
        error: 'Error',
        failed_to_fetch_chapters:
          'Failed to fetch chapters. Check your GitHub settings and network connection.',
        loading_chapters: 'Loading chapters...',
        no_chapters_found: 'No chapters found. Check your settings.',
        loading_chapter: 'Loading chapter...',
        failed_to_fetch_chapter_content:
          'Failed to fetch chapter content. Check your GitHub settings and network connection.',
        success: 'Success',
        settings_saved_successfully: 'Settings saved successfully!',
        failed_to_save_settings: 'Failed to save settings.',
        failed_to_load_settings: 'Failed to load settings.',
        github_token: 'GitHub Token',
        enter_github_token: 'Enter GitHub Personal Access Token',
        github_repo_url: 'GitHub Repository URL',
        github_branch: 'GitHub Branch',
        content_folder_path: 'Content Folder Path',
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

// Mock React Native modules that don't work well in Jest environment
jest.mock('react-native-tts', () => ({
  __esModule: true,
  default: {
    speak: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn().mockResolvedValue(undefined),
    resume: jest.fn().mockResolvedValue(undefined),
    setDefaultLanguage: jest.fn().mockResolvedValue(undefined),
    setDefaultRate: jest.fn().mockResolvedValue(undefined),
    setDefaultPitch: jest.fn().mockResolvedValue(undefined),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

// Mock react-native-audio-pro
jest.mock('react-native-audio-pro', () => ({
  __esModule: true,
  AudioPro: {
    setupPlayer: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn().mockResolvedValue(undefined),
    add: jest.fn().mockResolvedValue(undefined),
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn().mockResolvedValue(undefined),
    skipToNext: jest.fn().mockResolvedValue(undefined),
    skipToPrevious: jest.fn().mockResolvedValue(undefined),
    seekTo: jest.fn().mockResolvedValue(undefined),
    getState: jest.fn().mockResolvedValue('stopped'),
    getTrack: jest.fn().mockResolvedValue(null),
    getProgress: jest.fn().mockResolvedValue({ position: 0, duration: 0 }),
    reset: jest.fn().mockResolvedValue(undefined),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  AudioProState: {
    None: 'none',
    Stopped: 'stopped',
    Paused: 'paused',
    Playing: 'playing',
    Ready: 'ready',
    Buffering: 'buffering',
    Connecting: 'connecting',
  },
  AudioProEventType: {
    PlaybackState: 'playback-state',
    PlaybackTrackChanged: 'playback-track-changed',
    PlaybackProgressUpdated: 'playback-progress-updated',
    PlaybackError: 'playback-error',
    PlaybackQueueEnded: 'playback-queue-ended',
  },
  AudioProContentType: {
    DASH: 'dash',
    HLS: 'hls',
    SmoothStreaming: 'smoothstreaming',
    OTHER: 'other',
  },
}));

jest.mock('react-native-biometrics', () => {
  const mockBiometrics = jest.fn().mockImplementation(() => ({
    isSensorAvailable: jest
      .fn()
      .mockResolvedValue({ available: true, biometryType: 'TouchID' }),
    createKeys: jest.fn(),
    biometricKeysExist: jest.fn(),
    deleteKeys: jest.fn(),
    createSignature: jest.fn(),
    simplePrompt: jest.fn().mockResolvedValue({ success: true }),
  }));

  return {
    __esModule: true,
    default: mockBiometrics,
    BiometryTypes: {
      TouchID: 'TouchID',
      FaceID: 'FaceID',
      Biometrics: 'Biometrics',
    },
  };
});

jest.mock('nativewind', () => ({
  styled: Component => Component,
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  useFocusEffect: jest.fn(),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

jest.mock('react-native-keychain', () => ({
  setInternetCredentials: jest.fn(),
  getInternetCredentials: jest.fn(),
  resetInternetCredentials: jest.fn(),
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock react-native-localize
jest.mock('react-native-localize', () => ({
  getLocales: jest.fn(() => [
    {
      countryCode: 'US',
      languageTag: 'en-US',
      languageCode: 'en',
      isRTL: false,
    },
  ]),
  getNumberFormatSettings: jest.fn(() => ({
    decimalSeparator: '.',
    groupingSeparator: ',',
  })),
  getCalendar: jest.fn(() => 'gregorian'),
  getCountry: jest.fn(() => 'US'),
  getCurrencies: jest.fn(() => ['USD']),
  getTemperatureUnit: jest.fn(() => 'fahrenheit'),
  getTimeZone: jest.fn(() => 'America/New_York'),
  uses24HourClock: jest.fn(() => false),
  usesMetricSystem: jest.fn(() => false),
  usesAutoDateAndTime: jest.fn(() => true),
  usesAutoTimeZone: jest.fn(() => true),
  findBestAvailableLanguage: jest.fn(() => ({
    languageTag: 'en-US',
    isRTL: false,
  })),
}));

// Silence the warning about act() wrapping
global.console = {
  ...console,
  warn: jest.fn(),
};
