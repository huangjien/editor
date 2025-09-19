import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SettingsService } from '../services/SettingsService';
import { Settings } from '../state/models';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

export const SettingsScreen = () => {
  const [settings, setSettings] = useState<Settings>(new Settings());
  const { t } = useTranslation();
  const { themeMode, setThemeMode, isDark } = useTheme();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await SettingsService.getSettings();
        setSettings(savedSettings);
      } catch (error) {
        Alert.alert(t('common.error'), t('common.failed_to_load_settings'));
      }
    };
    loadSettings();
  }, [t]);

  const handleSaveSettings = async () => {
    try {
      await SettingsService.saveSettings(settings);
      Alert.alert(t('common.success'), t('common.settings_saved_successfully'));
    } catch (error) {
      Alert.alert(t('common.error'), t('common.failed_to_save_settings'));
    }
  };

  const themeOptions: Array<{
    value: 'system' | 'light' | 'dark';
    label: string;
  }> = [
    { value: 'system', label: t('common.theme_system') },
    { value: 'light', label: t('common.theme_light') },
    { value: 'dark', label: t('common.theme_dark') },
  ];

  return (
    <ScrollView className={`flex-1 p-4 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <Text
        className={`text-2xl font-bold mb-4 ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}
      >
        {t('common.settings')}
      </Text>

      <View className="mb-4">
        <Text
          className={`text-lg mb-2 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          {t('common.theme')}
        </Text>
        <View className="flex-row space-x-2">
          {themeOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              className={`px-4 py-2 rounded-md border ${
                themeMode === option.value
                  ? isDark
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-blue-500 border-blue-500'
                  : isDark
                  ? 'bg-gray-800 border-gray-600'
                  : 'bg-gray-100 border-gray-300'
              }`}
              onPress={() => setThemeMode(option.value)}
            >
              <Text
                className={`${
                  themeMode === option.value
                    ? 'text-white'
                    : isDark
                    ? 'text-gray-200'
                    : 'text-gray-700'
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="mb-4">
        <Text
          className={`text-lg mb-2 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          {t('common.github_token')}
        </Text>
        <TextInput
          className={`border p-2 rounded-md ${
            isDark
              ? 'border-gray-600 bg-gray-800 text-white'
              : 'border-gray-300 bg-white text-gray-800'
          }`}
          value={settings.githubToken}
          onChangeText={(text: string) =>
            setSettings({ ...settings, githubToken: text })
          }
          placeholder={t('common.enter_github_token')}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          secureTextEntry
        />
      </View>

      <View className="mb-4">
        <Text
          className={`text-lg mb-2 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          {t('common.github_repo_url')}
        </Text>
        <TextInput
          className={`border p-2 rounded-md ${
            isDark
              ? 'border-gray-600 bg-gray-800 text-white'
              : 'border-gray-300 bg-white text-gray-800'
          }`}
          value={settings.githubRepoUrl}
          onChangeText={(text: string) =>
            setSettings({ ...settings, githubRepoUrl: text })
          }
          placeholder="e.g., https://github.com/owner/repo"
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        />
      </View>

      <View className="mb-4">
        <Text
          className={`text-lg mb-2 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          {t('common.github_branch')}
        </Text>
        <TextInput
          className={`border p-2 rounded-md ${
            isDark
              ? 'border-gray-600 bg-gray-800 text-white'
              : 'border-gray-300 bg-white text-gray-800'
          }`}
          value={settings.githubRepoBranch}
          onChangeText={(text: string) =>
            setSettings({ ...settings, githubRepoBranch: text })
          }
          placeholder="e.g., main or master"
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        />
      </View>

      <View className="mb-4">
        <Text
          className={`text-lg mb-2 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          {t('common.content_folder_path')}
        </Text>
        <TextInput
          className={`border p-2 rounded-md ${
            isDark
              ? 'border-gray-600 bg-gray-800 text-white'
              : 'border-gray-300 bg-white text-gray-800'
          }`}
          value={settings.contentFolderPath}
          onChangeText={(text: string) =>
            setSettings({ ...settings, contentFolderPath: text })
          }
          placeholder="e.g., novels/my-book"
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        />
      </View>

      <View className="mb-4">
        <Text
          className={`text-lg mb-2 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          {t('common.display_font')}
        </Text>
        <TextInput
          className={`border p-2 rounded-md ${
            isDark
              ? 'border-gray-600 bg-gray-800 text-white'
              : 'border-gray-300 bg-white text-gray-800'
          }`}
          value={settings.displayFont}
          onChangeText={(text: string) =>
            setSettings({ ...settings, displayFont: text })
          }
          placeholder="e.g., System, serif, monospace"
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        />
      </View>

      <View className="mb-4">
        <Text
          className={`text-lg mb-2 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          {t('common.font_size')}: {settings.fontSize}
        </Text>
        <TextInput
          className={`border p-2 rounded-md ${
            isDark
              ? 'border-gray-600 bg-gray-800 text-white'
              : 'border-gray-300 bg-white text-gray-800'
          }`}
          value={String(settings.fontSize)}
          onChangeText={(text: string) =>
            setSettings({ ...settings, fontSize: Number(text) })
          }
          keyboardType="numeric"
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        />
      </View>

      <View className="mb-4">
        <Text
          className={`text-lg mb-2 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          {t('common.play_speed')}: {settings.playSpeed}
        </Text>
        <TextInput
          className={`border p-2 rounded-md ${
            isDark
              ? 'border-gray-600 bg-gray-800 text-white'
              : 'border-gray-300 bg-white text-gray-800'
          }`}
          value={String(settings.playSpeed)}
          onChangeText={(text: string) =>
            setSettings({ ...settings, playSpeed: Number(text) })
          }
          keyboardType="numeric"
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        />
      </View>

      <TouchableOpacity
        className={`p-3 rounded-md ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
        onPress={handleSaveSettings}
      >
        <Text className="text-white text-center text-lg">
          {t('common.save_settings')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
