import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert } from 'react-native';
import { styled } from 'nativewind';
import { SettingsService } from '../services/SettingsService';
import { Settings } from '../state/models';
import { useTranslation } from 'react-i18next';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledButton = styled(Button);
const StyledScrollView = styled(ScrollView);

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
    <StyledScrollView className="flex-1 bg-white p-4">
      <StyledText className="text-2xl font-bold text-gray-800 mb-4">
        {t('common.settings')}
      </StyledText>

      <StyledView className="mb-4">
        <StyledText className="text-lg text-gray-700 mb-2">
          {t('common.github_token')}
        </StyledText>
        <StyledTextInput
          className="border border-gray-300 p-2 rounded-md text-gray-800"
          value={settings.githubToken}
          onChangeText={text => setSettings({ ...settings, githubToken: text })}
          placeholder={t('common.enter_github_token')}
          secureTextEntry
        />
      </StyledView>

      <StyledView className="mb-4">
        <StyledText className="text-lg text-gray-700 mb-2">
          {t('common.github_repo_url')}
        </StyledText>
        <StyledTextInput
          className="border border-gray-300 p-2 rounded-md text-gray-800"
          value={settings.githubRepoUrl}
          onChangeText={text =>
            setSettings({ ...settings, githubRepoUrl: text })
          }
          placeholder="e.g., https://github.com/owner/repo"
        />
      </StyledView>

      <StyledView className="mb-4">
        <StyledText className="text-lg text-gray-700 mb-2">
          {t('common.github_branch')}
        </StyledText>
        <StyledTextInput
          className="border border-gray-300 p-2 rounded-md text-gray-800"
          value={settings.githubRepoBranch}
          onChangeText={text =>
            setSettings({ ...settings, githubRepoBranch: text })
          }
          placeholder="e.g., main or master"
        />
      </StyledView>

      <StyledView className="mb-4">
        <StyledText className="text-lg text-gray-700 mb-2">
          {t('common.content_folder_path')}
        </StyledText>
        <StyledTextInput
          className="border border-gray-300 p-2 rounded-md text-gray-800"
          value={settings.contentFolderPath}
          onChangeText={text =>
            setSettings({ ...settings, contentFolderPath: text })
          }
          placeholder="e.g., novels/my-book"
        />
      </StyledView>

      <StyledView className="mb-4">
        <StyledText className="text-lg text-gray-700 mb-2">
          {t('common.display_font')}
        </StyledText>
        <StyledTextInput
          className="border border-gray-300 p-2 rounded-md text-gray-800"
          value={settings.displayFont}
          onChangeText={text => setSettings({ ...settings, displayFont: text })}
          placeholder="e.g., System, serif, monospace"
        />
      </StyledView>

      <StyledView className="mb-4">
        <StyledText className="text-lg text-gray-700 mb-2">
          {t('common.font_size')}: {settings.fontSize}
        </StyledText>
        <StyledTextInput
          className="border border-gray-300 p-2 rounded-md text-gray-800"
          value={String(settings.fontSize)}
          onChangeText={text =>
            setSettings({ ...settings, fontSize: Number(text) })
          }
          keyboardType="numeric"
        />
      </StyledView>

      <StyledView className="mb-4">
        <StyledText className="text-lg text-gray-700 mb-2">
          {t('common.play_speed')}: {settings.playSpeed}
        </StyledText>
        <StyledTextInput
          className="border border-gray-300 p-2 rounded-md text-gray-800"
          value={String(settings.playSpeed)}
          onChangeText={text =>
            setSettings({ ...settings, playSpeed: Number(text) })
          }
          keyboardType="numeric"
        />
      </StyledView>

      <StyledButton
        title={t('common.save_settings')}
        onPress={handleSaveSettings}
      />
    </StyledScrollView>
  );
};
