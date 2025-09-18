import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert } from 'react-native';
import { SettingsService } from '../services/SettingsService';
import { Settings } from '../state/models';
import { useTranslation } from 'react-i18next';

export const SettingsScreen = () => {
  const [settings, setSettings] = useState<Settings>(new Settings());
  const { t } = useTranslation();

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

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        {t('common.settings')}
      </Text>

      <View className="mb-4">
        <Text className="text-lg text-gray-700 mb-2">
          {t('common.github_token')}
        </Text>
        <TextInput
          className="border border-gray-300 p-2 rounded-md text-gray-800"
          value={settings.githubToken}
          onChangeText={(text: string) =>
            setSettings({ ...settings, githubToken: text })
          }
          placeholder={t('common.enter_github_token')}
          secureTextEntry
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg text-gray-700 mb-2">
          {t('common.github_repo_url')}
        </Text>
        <TextInput
          className="border border-gray-300 p-2 rounded-md text-gray-800"
          value={settings.githubRepoUrl}
          onChangeText={(text: string) =>
            setSettings({ ...settings, githubRepoUrl: text })
          }
          placeholder="e.g., https://github.com/owner/repo"
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg text-gray-700 mb-2">
          {t('common.github_branch')}
        </Text>
        <TextInput
          className="border border-gray-300 p-2 rounded-md text-gray-800"
          value={settings.githubRepoBranch}
          onChangeText={(text: string) =>
            setSettings({ ...settings, githubRepoBranch: text })
          }
          placeholder="e.g., main or master"
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg text-gray-700 mb-2">
          {t('common.content_folder_path')}
        </Text>
        <TextInput
          className="border border-gray-300 p-2 rounded-md text-gray-800"
          value={settings.contentFolderPath}
          onChangeText={(text: string) =>
            setSettings({ ...settings, contentFolderPath: text })
          }
          placeholder="e.g., novels/my-book"
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg text-gray-700 mb-2">
          {t('common.display_font')}
        </Text>
        <TextInput
          className="border border-gray-300 p-2 rounded-md text-gray-800"
          value={settings.displayFont}
          onChangeText={(text: string) =>
            setSettings({ ...settings, displayFont: text })
          }
          placeholder="e.g., System, serif, monospace"
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg text-gray-700 mb-2">
          {t('common.font_size')}: {settings.fontSize}
        </Text>
        <TextInput
          className="border border-gray-300 p-2 rounded-md text-gray-800"
          value={String(settings.fontSize)}
          onChangeText={(text: string) =>
            setSettings({ ...settings, fontSize: Number(text) })
          }
          keyboardType="numeric"
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg text-gray-700 mb-2">
          {t('common.play_speed')}: {settings.playSpeed}
        </Text>
        <TextInput
          className="border border-gray-300 p-2 rounded-md text-gray-800"
          value={String(settings.playSpeed)}
          onChangeText={(text: string) =>
            setSettings({ ...settings, playSpeed: Number(text) })
          }
          keyboardType="numeric"
        />
      </View>

      <Button title={t('common.save_settings')} onPress={handleSaveSettings} />
    </ScrollView>
  );
};
