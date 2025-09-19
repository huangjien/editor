import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SettingsService } from '../services/SettingsService';
import { GitHubService } from '../services/GitHubService';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/Ionicons';
// import TrackPlayer, {
//   usePlaybackState,
//   State,
// } from 'react-native-track-player';
import { playChapter } from '../services/trackPlayerService';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

type ContentScreenRouteParams = {
  chapterId: string;
  chapterTitle: string;
};

export const ContentScreen = () => {
  const route =
    useRoute<RouteProp<Record<string, ContentScreenRouteParams>, 'Content'>>();
  const { chapterId, chapterTitle } = route.params;
  // const playbackState = usePlaybackState();
  const playbackState = { state: 'stopped' }; // Stub for disabled TrackPlayer
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const [chapterContent, setChapterContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [speechRate, setSpeechRate] = useState(1.0);
  const currentSpeechPosition = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Store TTS event handler references for proper cleanup
  const ttsStartHandler = useCallback(() => setIsPlaying(true), []);
  const ttsFinishHandler = useCallback(() => setIsPlaying(false), []);
  const ttsCancelHandler = useCallback(() => setIsPlaying(false), []);
  const ttsProgressHandler = useCallback(
    (event: {
      utteranceId: string | number;
      location: number;
      length: number;
    }) => {
      currentSpeechPosition.current = event.location;
    },
    [],
  );

  const saveReadingPosition = useCallback(
    async (offset: number) => {
      try {
        const currentSettings = await SettingsService.getSettings();
        currentSettings.currentChapterId = chapterId;
        currentSettings.currentReadingOffset = offset;
        await SettingsService.saveSettings(currentSettings);
      } catch (error) {
        console.error('Error saving reading position:', error);
      }
    },
    [chapterId],
  );

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const settings = await SettingsService.getSettings();
        if (
          !settings.githubToken ||
          !settings.githubRepoUrl ||
          !settings.githubRepoBranch
        ) {
          Alert.alert(
            t('common.configuration_missing'),
            t('common.configure_github_settings'),
          );
          setIsLoading(false);
          return;
        }
        const fetchedContent = await GitHubService.fetchChapterContent(
          settings.githubToken,
          settings.githubRepoUrl,
          settings.githubRepoBranch,
          chapterId,
        );
        setChapterContent(fetchedContent);

        // Initialize TTS with settings
        Tts.setDefaultLanguage('en-US'); // Default, can be made configurable
        Tts.setDefaultRate(settings.playSpeed);

        Tts.addEventListener('tts-start', ttsStartHandler);
        Tts.addEventListener('tts-finish', ttsFinishHandler);
        Tts.addEventListener('tts-cancel', ttsCancelHandler);
        Tts.addEventListener('tts-progress', ttsProgressHandler);

        // Restore reading position
        if (
          settings.currentChapterId === chapterId &&
          settings.currentReadingOffset !== undefined
        ) {
          // This needs to be done after layout, so we use a timeout or onLayout
          setTimeout(() => {
            scrollViewRef.current?.scrollTo({
              y: settings.currentReadingOffset,
              animated: false,
            });
          }, 100);
        }
      } catch (error) {
        console.error('Failed to fetch chapter content:', error);
        Alert.alert(
          t('common.error'),
          t('common.failed_to_fetch_chapter_content'),
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();

    return () => {
      Tts.stop();
      Tts.removeEventListener('tts-start', ttsStartHandler);
      Tts.removeEventListener('tts-finish', ttsFinishHandler);
      Tts.removeEventListener('tts-cancel', ttsCancelHandler);
      Tts.removeEventListener('tts-progress', ttsProgressHandler);
    };
  }, [
    chapterId,
    saveReadingPosition,
    t,
    ttsStartHandler,
    ttsFinishHandler,
    ttsCancelHandler,
    ttsProgressHandler,
  ]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    saveReadingPosition(event.nativeEvent.contentOffset.y);
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      Tts.pause();
      // await TrackPlayer.pause(); // Disabled TrackPlayer
      // Save current reading position when pausing
      // Note: We'll rely on the scroll event handler to track position
    } else {
      Tts.speak(chapterContent.substring(currentSpeechPosition.current));
      await playChapter(chapterId, chapterTitle, chapterContent);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = useCallback(() => {
    Tts.stop();
    setIsPlaying(false);
    currentSpeechPosition.current = 0;
  }, []);

  const handleSpeedToggle = useCallback(() => {
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(speechRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const newRate = speeds[nextIndex];
    setSpeechRate(newRate);
    // Set speech rate for future TTS calls
    Tts.setDefaultRate(newRate);
  }, [speechRate]);

  const handleNextChapter = useCallback(() => {
    // For now, we'll just show an alert since we don't have multiple chapters
    // In a real app, this would navigate to the next chapter
    Alert.alert(t('content.info'), t('content.nextChapterNotAvailable'));
  }, [t]);

  const handlePreviousChapter = useCallback(() => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      Tts.stop();
      setIsPlaying(false);
      currentSpeechPosition.current = 0;
    }
  }, [currentChapter]);

  const getPlayPauseButtonText = () => {
    if (
      playbackState.state === 'playing' ||
      playbackState.state === 'buffering'
    ) {
      return t('common.pause');
    } else {
      return t('common.play');
    }
  };

  if (isLoading) {
    return (
      <View
        className={`flex-1 items-center justify-center ${
          isDark ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        <ActivityIndicator
          size="large"
          color={isDark ? '#60a5fa' : '#0000ff'}
        />
        <Text className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('common.loading_chapter')}
        </Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <View
        className={`flex-row justify-between items-center p-4 ${
          isDark ? 'bg-blue-600' : 'bg-blue-500'
        }`}
      >
        <Text className="text-white text-lg font-bold">{chapterTitle}</Text>
        <TouchableOpacity
          onPress={handlePlayPause}
          className={`px-4 py-2 rounded ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <Text
            className={`font-semibold ${
              isDark ? 'text-blue-400' : 'text-blue-500'
            }`}
          >
            {getPlayPauseButtonText()}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1 pt-4 pr-4 pb-4 pl-8"
      >
        <Text
          className={`text-base leading-6 ${
            isDark ? 'text-gray-200' : 'text-gray-800'
          }`}
        >
          {chapterContent}
        </Text>
      </ScrollView>
      {/* TTS Controls */}
      <View
        className={`p-4 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        {/* Main Media Controls */}
        <View className="flex-row justify-center items-center mb-4 space-x-4">
          {/* Previous Chapter */}
          <TouchableOpacity
            onPress={handlePreviousChapter}
            className={`p-3 rounded-full ${
              isDark ? 'bg-blue-600' : 'bg-blue-500'
            }`}
          >
            <Icon name="play-skip-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Stop */}
          <TouchableOpacity
            onPress={handleStop}
            className={`p-3 rounded-full ${
              isDark ? 'bg-red-600' : 'bg-red-500'
            }`}
          >
            <Icon name="stop" size={24} color="white" />
          </TouchableOpacity>

          {/* Play/Pause */}
          <TouchableOpacity
            onPress={handlePlayPause}
            className={`p-4 rounded-full ${
              isDark ? 'bg-blue-700' : 'bg-blue-600'
            }`}
          >
            <Icon name={isPlaying ? 'pause' : 'play'} size={32} color="white" />
          </TouchableOpacity>

          {/* Next Chapter */}
          <TouchableOpacity
            onPress={handleNextChapter}
            className={`p-3 rounded-full ${
              isDark ? 'bg-blue-600' : 'bg-blue-500'
            }`}
          >
            <Icon name="play-skip-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Speed Control */}
        <View className="flex-row justify-center items-center mt-2">
          <TouchableOpacity
            onPress={handleSpeedToggle}
            className={`px-4 py-2 rounded ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}
          >
            <Text
              className={`font-medium ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              {t('content.speed')}: {speechRate}x
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
