import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SettingsService } from '../services/SettingsService';
import { GitHubService } from '../services/GitHubService';
import { Chapter } from '../state/models';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../contexts/ThemeContext';

export const IndexScreen = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchChapters = async () => {
      setIsLoading(true);
      try {
        const settings = await SettingsService.getSettings();
        if (
          !settings.githubToken ||
          !settings.githubRepoUrl ||
          !settings.githubRepoBranch ||
          !settings.contentFolderPath
        ) {
          Alert.alert(
            t('common.configuration_missing'),
            t('common.configure_github_settings'),
          );
          setIsLoading(false);
          return;
        }
        const fetchedChapters = await GitHubService.fetchChapterList(
          settings.githubToken,
          settings.githubRepoUrl,
          settings.githubRepoBranch,
          settings.contentFolderPath,
        );
        setChapters(fetchedChapters);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
        Alert.alert(t('common.error'), t('common.failed_to_fetch_chapters'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchChapters();
  }, [t]);

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
          {t('common.loading_chapters')}
        </Text>
      </View>
    );
  }

  return (
    <View
      className={`flex-1 pt-4 pr-4 pb-4 pl-8 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <Text
        className={`text-2xl font-bold mb-4 ${
          isDark ? 'text-gray-100' : 'text-gray-800'
        }`}
      >
        {t('common.chapters')}
      </Text>
      {chapters.length === 0 ? (
        <Text
          className={`text-center ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {t('common.no_chapters_found')}
        </Text>
      ) : (
        <FlatList
          data={chapters}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`p-4 border-b ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}
              onPress={() =>
                navigation.navigate('Content', {
                  chapterId: item.id,
                  chapterTitle: item.title,
                })
              }
            >
              <Text
                className={`text-lg ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};
