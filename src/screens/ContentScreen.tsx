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
  StyleSheet,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SettingsService } from '../services/SettingsService';
import { GitHubService } from '../services/GitHubService';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/Ionicons';
import { AudioProState } from 'react-native-audio-pro';
import {
  playChapter,
  togglePlayback,
  stopPlayback,
  skipToNext,
  skipToPrevious,
  initializeTrackPlayerService,
} from '../services/trackPlayerService';
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
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const [chapterContent, setChapterContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackState, _setPlaybackState] = useState<{ state: AudioProState }>(
    { state: AudioProState.IDLE },
  );
  const [_currentChapter, _setCurrentChapter] = useState(0);
  const [speechRate, setSpeechRate] = useState(1.0);
  const currentSpeechPosition = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const isMountedRef = useRef(true);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Store TTS event handler references for proper cleanup
  const ttsStartHandler = useCallback(() => {
    if (isMountedRef.current) {
      setIsPlaying(true);
    }
  }, []);

  const ttsFinishHandler = useCallback(() => {
    if (isMountedRef.current) {
      setIsPlaying(false);
    }
  }, []);

  const ttsCancelHandler = useCallback(() => {
    if (isMountedRef.current) {
      setIsPlaying(false);
    }
  }, []);

  const ttsProgressHandler = useCallback(
    (event: {
      utteranceId: string | number;
      location: number;
      length: number;
    }) => {
      if (isMountedRef.current) {
        currentSpeechPosition.current = event.location;
      }
    },
    [],
  );

  const saveReadingPosition = useCallback(
    async (offset: number) => {
      if (!isMountedRef.current) return;

      try {
        const currentSettings = await SettingsService.getSettings();
        if (!isMountedRef.current) return; // Check again after async operation

        currentSettings.currentChapterId = chapterId;
        currentSettings.currentReadingOffset = offset;
        await SettingsService.saveSettings(currentSettings);
      } catch (error) {
        // Only log error if component is still mounted
        if (isMountedRef.current) {
          console.error('Error saving reading position:', error);
        }
      }
    },
    [chapterId],
  );

  // Initialize TrackPlayer service
  useEffect(() => {
    const initializeService = async () => {
      try {
        await initializeTrackPlayerService();
      } catch (error) {
        console.error('Failed to initialize TrackPlayer service:', error);
      }
    };

    initializeService();
  }, []);

  // Update isPlaying state based on AudioPro state
  useEffect(() => {
    setIsPlaying(playbackState.state === AudioProState.PLAYING);
  }, [playbackState.state]);

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
          scrollTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current && scrollViewRef.current) {
              scrollViewRef.current.scrollTo({
                y: settings.currentReadingOffset,
                animated: false,
              });
            }
          }, 100);
        }
      } catch (error) {
        console.error('Failed to fetch chapter content:', error);
        if (isMountedRef.current) {
          Alert.alert(
            t('common.error'),
            t('common.failed_to_fetch_chapter_content'),
          );
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };
    fetchContent();

    return () => {
      // Mark component as unmounted
      isMountedRef.current = false;

      // Clear any pending timeouts
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }

      // Stop TTS and audio playback
      try {
        Tts.stop();
        stopPlayback().catch(() => {
          // Ignore errors during cleanup
        });
      } catch (error) {
        // Ignore errors during cleanup
        console.warn('Error during TTS cleanup:', error);
      }

      // Clean up TTS event listeners
      try {
        Tts.removeEventListener('tts-start', ttsStartHandler);
        Tts.removeEventListener('tts-finish', ttsFinishHandler);
        Tts.removeEventListener('tts-cancel', ttsCancelHandler);
        Tts.removeEventListener('tts-progress', ttsProgressHandler);
      } catch (error) {
        // Ignore errors during cleanup
        console.warn('Error removing TTS listeners:', error);
      }
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
    if (!isMountedRef.current) return;

    try {
      saveReadingPosition(event.nativeEvent.contentOffset.y);
    } catch (error) {
      // Ignore errors during scroll handling if component is unmounted
      if (isMountedRef.current) {
        console.warn('Error handling scroll:', error);
      }
    }
  };

  const handlePlayPause = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      if (playbackState.state === AudioProState.PLAYING) {
        await togglePlayback();
      } else {
        // If not playing, start playing the chapter
        if (
          playbackState.state === AudioProState.IDLE ||
          playbackState.state === AudioProState.STOPPED
        ) {
          const chapter = {
            id: chapterId,
            title: chapterTitle,
            audioUrl: `tts://${chapterContent}`, // Using TTS URL format
          };
          await playChapter(chapter);
        } else {
          await togglePlayback();
        }
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      Alert.alert(t('content.error'), t('content.playbackError'));
    }
  }, [playbackState.state, chapterId, chapterTitle, chapterContent, t]);

  const handleStop = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      await stopPlayback();
      currentSpeechPosition.current = 0;
    } catch (error) {
      console.error('Error stopping playback:', error);
    }
  }, []);

  const handleSpeedToggle = useCallback(() => {
    if (!isMountedRef.current) return;

    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(speechRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const newRate = speeds[nextIndex];
    setSpeechRate(newRate);
    // Set speech rate for future TTS calls
    Tts.setDefaultRate(newRate);
  }, [speechRate]);

  const handleNextChapter = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      await skipToNext();
    } catch (error) {
      console.error('Error skipping to next:', error);
      // Fallback: show alert if no next chapter
      Alert.alert(t('content.info'), t('content.nextChapterNotAvailable'));
    }
  }, [t]);

  const handlePreviousChapter = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      await skipToPrevious();
    } catch (error) {
      console.error('Error skipping to previous:', error);
      // Fallback: show alert if no previous chapter
      Alert.alert(t('content.info'), t('content.previousChapterNotAvailable'));
    }
  }, [t]);

  const getPlayPauseButtonText = () => {
    if (
      playbackState.state === AudioProState.PLAYING ||
      playbackState.state === AudioProState.LOADING
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
          isDark ? 'bg-neutral-950' : 'bg-neutral-50'
        }`}
      >
        <View
          className={`p-6 rounded-2xl ${
            isDark ? 'bg-neutral-900' : 'bg-white'
          } shadow-lg`}
        >
          <ActivityIndicator
            size="large"
            color={isDark ? '#3b82f6' : '#1d4ed8'}
          />
          <Text
            className={`mt-4 text-center font-medium ${
              isDark ? 'text-neutral-300' : 'text-neutral-600'
            }`}
          >
            {t('common.loading_chapter')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-neutral-950' : 'bg-neutral-50'}`}>
      {/* Modern Header */}
      <View
        className={`px-6 py-4 ${
          isDark ? 'bg-neutral-900/95' : 'bg-white/95'
        } backdrop-blur-sm border-b ${
          isDark ? 'border-neutral-800' : 'border-neutral-200'
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <Text
              className={`text-lg font-semibold ${
                isDark ? 'text-neutral-100' : 'text-neutral-900'
              }`}
              numberOfLines={2}
            >
              {chapterTitle}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handlePlayPause}
            className={`px-4 py-2 rounded-xl ${
              isDark
                ? 'bg-primary-600 hover:bg-primary-700'
                : 'bg-primary-500 hover:bg-primary-600'
            } shadow-sm`}
            accessibilityRole="button"
            accessibilityLabel={getPlayPauseButtonText()}
            accessibilityHint={
              isPlaying ? t('content.pauseHint') : t('content.playHint')
            }
          >
            <Text className="text-white font-medium">
              {getPlayPauseButtonText()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Area */}
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View
          className={`rounded-2xl p-6 ${
            isDark ? 'bg-neutral-900' : 'bg-white'
          } shadow-sm`}
        >
          <Text
            className={`text-lg leading-relaxed ${
              isDark ? 'text-neutral-200' : 'text-neutral-800'
            } font-reading`}
            style={styles.textContent}
          >
            {chapterContent}
          </Text>
        </View>
      </ScrollView>

      {/* Modern Media Controls */}
      <View
        className={`px-6 py-6 ${
          isDark ? 'bg-neutral-900/95' : 'bg-white/95'
        } backdrop-blur-sm border-t ${
          isDark ? 'border-neutral-800' : 'border-neutral-200'
        }`}
      >
        {/* Main Controls */}
        <View className="flex-row justify-center items-center mb-6">
          {/* Previous Chapter */}
          <TouchableOpacity
            onPress={handlePreviousChapter}
            className={`p-3 rounded-full mx-2 ${
              isDark
                ? 'bg-neutral-800 hover:bg-neutral-700'
                : 'bg-neutral-100 hover:bg-neutral-200'
            } shadow-sm`}
            accessibilityRole="button"
            accessibilityLabel={t('content.previousChapter')}
            accessibilityHint={t('content.previousChapterHint')}
          >
            <Icon
              name="play-skip-back"
              size={20}
              color={isDark ? '#a3a3a3' : '#525252'}
            />
          </TouchableOpacity>

          {/* Stop */}
          <TouchableOpacity
            onPress={handleStop}
            className={`p-3 rounded-full mx-2 ${
              isDark
                ? 'bg-red-600/20 hover:bg-red-600/30'
                : 'bg-red-50 hover:bg-red-100'
            } shadow-sm`}
            accessibilityRole="button"
            accessibilityLabel={t('common.stop')}
            accessibilityHint={t('content.stopHint')}
          >
            <Icon
              name="stop"
              size={20}
              color={isDark ? '#ef4444' : '#dc2626'}
            />
          </TouchableOpacity>

          {/* Play/Pause - Main Button */}
          <TouchableOpacity
            onPress={handlePlayPause}
            className={`p-5 rounded-full mx-4 ${
              isDark
                ? 'bg-primary-600 hover:bg-primary-700'
                : 'bg-primary-500 hover:bg-primary-600'
            } shadow-lg`}
            accessibilityRole="button"
            accessibilityLabel={
              isPlaying ? t('common.pause') : t('common.play')
            }
            accessibilityHint={
              isPlaying ? t('content.pauseHint') : t('content.playHint')
            }
          >
            <Icon
              name={isPlaying ? 'pause' : 'play'}
              size={28}
              color="#ffffff"
            />
          </TouchableOpacity>

          {/* Next Chapter */}
          <TouchableOpacity
            onPress={handleNextChapter}
            className={`p-3 rounded-full mx-2 ${
              isDark
                ? 'bg-neutral-800 hover:bg-neutral-700'
                : 'bg-neutral-100 hover:bg-neutral-200'
            } shadow-sm`}
            accessibilityRole="button"
            accessibilityLabel={t('content.nextChapter')}
            accessibilityHint={t('content.nextChapterHint')}
          >
            <Icon
              name="play-skip-forward"
              size={20}
              color={isDark ? '#a3a3a3' : '#525252'}
            />
          </TouchableOpacity>
        </View>

        {/* Speed Control */}
        <View className="flex-row justify-center items-center">
          <TouchableOpacity
            onPress={handleSpeedToggle}
            className={`px-6 py-3 rounded-xl ${
              isDark
                ? 'bg-neutral-800 hover:bg-neutral-700'
                : 'bg-neutral-100 hover:bg-neutral-200'
            } shadow-sm`}
            accessibilityRole="button"
            accessibilityLabel={t('content.playbackSpeed', {
              speed: speechRate,
            })}
            accessibilityHint={t('content.speedToggleHint')}
          >
            <View className="flex-row items-center">
              <Icon
                name="speedometer-outline"
                size={16}
                color={isDark ? '#a3a3a3' : '#525252'}
              />
              <Text
                className={`ml-2 font-medium ${
                  isDark ? 'text-neutral-300' : 'text-neutral-700'
                }`}
              >
                {speechRate}x
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  textContent: {
    lineHeight: 32,
  },
});
