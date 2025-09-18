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
// import TrackPlayer, {
//   usePlaybackState,
//   State,
// } from 'react-native-track-player';
import { playChapter } from '../services/trackPlayerService';
import { useTranslation } from 'react-i18next';

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

  const [chapterContent, setChapterContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentSpeechPosition = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);

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

        Tts.addEventListener('tts-start', () => setIsPlaying(true));
        Tts.addEventListener('tts-finish', () => setIsPlaying(false));
        Tts.addEventListener('tts-cancel', () => setIsPlaying(false));
        Tts.addEventListener(
          'tts-progress',
          (event: {
            utteranceId: string | number;
            location: number;
            length: number;
          }) => {
            currentSpeechPosition.current = event.location;
          },
        );

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
      Tts.removeEventListener('tts-start', () => setIsPlaying(true));
      Tts.removeEventListener('tts-finish', () => setIsPlaying(false));
      Tts.removeEventListener('tts-cancel', () => setIsPlaying(false));
      Tts.removeEventListener(
        'tts-progress',
        (event: {
          utteranceId: string | number;
          location: number;
          length: number;
        }) => {
          currentSpeechPosition.current = event.location;
        },
      );
    };
  }, [chapterId, saveReadingPosition, t]);

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

  const handleNextChapter = () => {
    Tts.stop();
    currentSpeechPosition.current = 0;
    saveReadingPosition(0); // Reset position for next chapter
    // Logic to navigate to the next chapter will go here
    // For now, we'll just log and expect navigation to be handled by AppNavigator
    console.log('Next Chapter button pressed');
  };

  const handlePreviousChapter = () => {
    Tts.stop();
    currentSpeechPosition.current = 0;
    saveReadingPosition(0); // Reset position for previous chapter
    // Logic to navigate to the previous chapter will go here
    console.log('Previous Chapter button pressed');
  };

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
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">
          {t('common.loading_chapter')}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row justify-between items-center p-4 bg-blue-500">
        <Text className="text-white text-lg font-bold">{chapterTitle}</Text>
        <TouchableOpacity
          onPress={handlePlayPause}
          className="bg-white px-4 py-2 rounded"
        >
          <Text className="text-blue-500 font-semibold">
            {getPlayPauseButtonText()}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1 p-4"
      >
        <Text className="text-base leading-6 text-gray-800">
          {chapterContent}
        </Text>
      </ScrollView>
      <View className="flex-row justify-between p-4 bg-gray-100">
        <TouchableOpacity
          onPress={handlePreviousChapter}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          <Text className="text-white font-semibold">
            {t('common.previous')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNextChapter}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          <Text className="text-white font-semibold">{t('common.next')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
