import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
  Animated,
  StyleSheet,
} from 'react-native';
import { SettingsService } from '../services/SettingsService';
import { GitHubService } from '../services/GitHubService';
import { Chapter } from '../state/models';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

export const IndexScreen = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const fetchChapters = useCallback(
    async (showRefreshIndicator = false) => {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

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
        setIsRefreshing(false);
      }
    },
    [t],
  );

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  const onRefresh = () => {
    fetchChapters(true);
  };

  const renderChapterCard = ({
    item,
    index,
  }: {
    item: Chapter;
    index: number;
  }) => {
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.animatedContainer,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <TouchableOpacity
          className={`
            mx-4 mb-4 p-6 rounded-2xl border
            ${
              isDark
                ? 'bg-dark-100 border-dark-200 active:bg-dark-200'
                : 'bg-white border-neutral-200 active:bg-neutral-50'
            }
            shadow-soft
          `}
          onPress={() =>
            navigation.navigate('Content', {
              chapterId: item.id,
              chapterTitle: item.title,
            })
          }
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <Text
                className={`text-lg font-semibold mb-2 leading-6 ${
                  isDark ? 'text-dark-900' : 'text-neutral-900'
                }`}
              >
                {item.title}
              </Text>
              <Text
                className={`text-sm ${
                  isDark ? 'text-dark-600' : 'text-neutral-600'
                }`}
              >
                Chapter {index + 1}
              </Text>
            </View>

            <View
              className={`w-10 h-10 rounded-xl items-center justify-center ${
                isDark ? 'bg-primary-600' : 'bg-primary-500'
              }`}
            >
              <Icon name="chevron-forward" size={20} color="white" />
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-8">
      <View
        className={`w-20 h-20 rounded-2xl items-center justify-center mb-6 ${
          isDark ? 'bg-dark-200' : 'bg-neutral-200'
        }`}
      >
        <Icon
          name="library-outline"
          size={32}
          color={isDark ? '#a1a1aa' : '#737373'}
        />
      </View>

      <Text
        className={`text-xl font-semibold text-center mb-3 ${
          isDark ? 'text-dark-800' : 'text-neutral-800'
        }`}
      >
        No Chapters Found
      </Text>

      <Text
        className={`text-center leading-6 ${
          isDark ? 'text-dark-600' : 'text-neutral-600'
        }`}
      >
        {t('common.no_chapters_found')}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View
        className={`flex-1 items-center justify-center ${
          isDark ? 'bg-dark-50' : 'bg-neutral-50'
        }`}
      >
        <View
          className={`w-16 h-16 rounded-2xl items-center justify-center mb-6 ${
            isDark ? 'bg-primary-600' : 'bg-primary-500'
          }`}
        >
          <ActivityIndicator size="large" color="white" />
        </View>

        <Text
          className={`text-lg font-medium ${
            isDark ? 'text-dark-800' : 'text-neutral-800'
          }`}
        >
          {t('common.loading_chapters')}
        </Text>

        <Text
          className={`mt-2 text-center ${
            isDark ? 'text-dark-600' : 'text-neutral-600'
          }`}
        >
          Please wait while we fetch your content
        </Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${isDark ? 'bg-dark-50' : 'bg-neutral-50'}`}>
      {/* Header */}
      <View className="px-6 pt-8 pb-4">
        <Text
          className={`text-3xl font-bold mb-4 ${
            isDark ? 'text-dark-900' : 'text-neutral-900'
          }`}
        >
          {t('index.title')}
        </Text>

        <Text
          className={`text-base mt-3 ${
            isDark ? 'text-dark-600' : 'text-neutral-600'
          }`}
        >
          {t('index.subtitle')}
        </Text>
      </View>

      {/* Content */}
      {chapters.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={chapters}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => renderChapterCard({ item, index })}
          contentContainerStyle={styles.flatListContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={isDark ? '#6366f1' : '#4f46e5'}
              colors={[isDark ? '#6366f1' : '#4f46e5']}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    // Base container for animated view
  },
  flatListContainer: {
    paddingBottom: 20,
  },
});
