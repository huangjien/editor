import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SettingsService } from '../services/SettingsService';
import { Settings } from '../state/models';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

export const SettingsScreen = () => {
  const [settings, setSettings] = useState<Settings>(new Settings());
  const { t } = useTranslation();
  const { themeMode, setThemeMode, isDark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const saveButtonScale = useRef(new Animated.Value(1)).current;

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
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [t, fadeAnim]);

  const handleSaveSettings = async () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(saveButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(saveButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

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

  const renderFormField = (
    icon: string,
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    secureTextEntry = false,
    keyboardType: 'default' | 'numeric' = 'default',
  ) => (
    <View
      className={`mb-6 p-6 rounded-2xl ${
        isDark ? 'bg-neutral-900' : 'bg-white'
      } shadow-sm`}
    >
      <View className="flex-row items-center mb-3">
        <Icon name={icon} size={20} color={isDark ? '#3b82f6' : '#1d4ed8'} />
        <Text
          className={`ml-3 text-base font-medium ${
            isDark ? 'text-neutral-200' : 'text-neutral-800'
          }`}
        >
          {label}
        </Text>
      </View>
      <TextInput
        className={`p-4 rounded-xl border ${
          isDark
            ? 'border-neutral-700 bg-neutral-800 text-neutral-100'
            : 'border-neutral-200 bg-neutral-50 text-neutral-900'
        } text-base`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <View className={`flex-1 ${isDark ? 'bg-neutral-950' : 'bg-neutral-50'}`}>
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="mb-8">
            <Text
              className={`text-2xl font-bold ${
                isDark ? 'text-neutral-100' : 'text-neutral-900'
              }`}
            >
              Settings
            </Text>
            <Text
              className={`text-base mt-2 ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              Configure your reading experience
            </Text>
          </View>

          {/* Theme Selection */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <Icon
                name="color-palette-outline"
                size={24}
                color={isDark ? '#3b82f6' : '#1d4ed8'}
              />
              <Text
                className={`ml-3 text-lg font-semibold ${
                  isDark ? 'text-neutral-200' : 'text-neutral-800'
                }`}
              >
                {t('common.theme')}
              </Text>
            </View>
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

          {/* GitHub Configuration Section */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <Icon
                name="logo-github"
                size={24}
                color={isDark ? '#3b82f6' : '#1d4ed8'}
              />
              <Text
                className={`ml-3 text-lg font-semibold ${
                  isDark ? 'text-neutral-200' : 'text-neutral-800'
                }`}
              >
                GitHub Configuration
              </Text>
            </View>

            {renderFormField(
              'key-outline',
              t('common.github_token'),
              settings.githubToken,
              (text: string) => setSettings({ ...settings, githubToken: text }),
              t('common.enter_github_token'),
              true,
            )}

            {renderFormField(
              'link-outline',
              t('common.github_repo_url'),
              settings.githubRepoUrl,
              (text: string) =>
                setSettings({ ...settings, githubRepoUrl: text }),
              'e.g., https://github.com/owner/repo',
            )}

            {renderFormField(
              'git-branch-outline',
              t('common.github_branch'),
              settings.githubRepoBranch,
              (text: string) =>
                setSettings({ ...settings, githubRepoBranch: text }),
              'e.g., main or master',
            )}

            {renderFormField(
              'folder-outline',
              t('common.content_folder_path'),
              settings.contentFolderPath,
              (text: string) =>
                setSettings({ ...settings, contentFolderPath: text }),
              'e.g., novels/my-book',
            )}
          </View>

          {/* Reading Preferences Section */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <Icon
                name="book-outline"
                size={24}
                color={isDark ? '#3b82f6' : '#1d4ed8'}
              />
              <Text
                className={`ml-3 text-lg font-semibold ${
                  isDark ? 'text-neutral-200' : 'text-neutral-800'
                }`}
              >
                Reading Preferences
              </Text>
            </View>

            {renderFormField(
              'text-outline',
              t('common.display_font'),
              settings.displayFont,
              (text: string) => setSettings({ ...settings, displayFont: text }),
              'e.g., System, serif, monospace',
            )}

            {renderFormField(
              'resize-outline',
              `${t('common.font_size')}: ${settings.fontSize}`,
              String(settings.fontSize),
              (text: string) =>
                setSettings({ ...settings, fontSize: Number(text) }),
              'Font size',
              false,
              'numeric',
            )}

            {renderFormField(
              'speedometer-outline',
              `${t('common.play_speed')}: ${settings.playSpeed}`,
              String(settings.playSpeed),
              (text: string) =>
                setSettings({ ...settings, playSpeed: Number(text) }),
              'Playback speed',
              false,
              'numeric',
            )}
          </View>

          {/* Save Button */}
          <Animated.View style={{ transform: [{ scale: saveButtonScale }] }}>
            <TouchableOpacity
              className={`p-4 rounded-2xl ${
                isDark
                  ? 'bg-primary-600 hover:bg-primary-700'
                  : 'bg-primary-500 hover:bg-primary-600'
              } shadow-lg`}
              onPress={handleSaveSettings}
            >
              <View className="flex-row items-center justify-center">
                <Icon name="save-outline" size={20} color="#ffffff" />
                <Text className="text-white text-center text-lg font-medium ml-2">
                  {t('common.save_settings')}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
  },
  scrollContainer: {
    padding: 32,
  },
});
