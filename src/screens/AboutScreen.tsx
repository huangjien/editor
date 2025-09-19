import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

export const AboutScreen = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  return (
    <View
      className={`flex-1 items-center justify-center p-4 ${
        isDark ? 'bg-gray-900' : 'bg-gray-100'
      }`}
    >
      <Text
        className={`text-3xl font-bold mb-4 ${
          isDark ? 'text-blue-400' : 'text-blue-600'
        }`}
      >
        {t('common.about')}
      </Text>
      <Text
        className={`text-base text-center ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        This app allows you to read and listen to novel chapters from your
        specified GitHub repository. Enjoy a seamless reading and listening
        experience with customizable settings and Bluetooth controls.
      </Text>
      <Text
        className={`mt-8 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
      >
        {t('common.version')}: 1.0.0
      </Text>
    </View>
  );
};
