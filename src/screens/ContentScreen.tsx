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
import TrackPlayer, {
  usePlaybackState,
  State,
} from 'react-native-track-player';
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
  const playbackState = usePlaybackState();
  const { t } = useTranslation();

  const [chapterContent, setChapterContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentSpeechPosition = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const contentTextRef = useRef<Text>(null);

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
        Tts.addEventListener('tts-progress', (event: any) => {
          currentSpeechPosition.current = event.charIndex;
        });

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
      Tts.removeEventListener('tts-progress', (event: any) => {
        currentSpeechPosition.current = event.charIndex;
      });
    };
  }, [chapterId, saveReadingPosition, t]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    saveReadingPosition(event.nativeEvent.contentOffset.y);
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      Tts.pause();
      await TrackPlayer.pause();
      const currentScrollView = scrollViewRef.current;
      if (currentScrollView) {
        saveReadingPosition((currentScrollView as any).contentOffset?.y || 0);
      }
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
      playbackState.state === State.Playing ||
      playbackState.state === State.Buffering
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
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        {chapterTitle}
      </Text>
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        onMomentumScrollEnd={handleScroll}
      >
        <Text ref={contentTextRef} className="text-base text-gray-700">
          {chapterContent}
        </Text>
      </ScrollView>
      <View className="flex-row justify-around items-center mt-4 p-2 bg-gray-200 rounded-lg">
        <TouchableOpacity onPress={handlePreviousChapter} className="p-2">
          <Text className="text-blue-600 text-lg">{t('common.previous')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePlayPause} className="p-2">
          <Text className="text-blue-600 text-lg">
            {getPlayPauseButtonText()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextChapter} className="p-2">
          <Text className="text-blue-600 text-lg">{t('common.next')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
