import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export const AboutScreen = () => {
  const { t } = useTranslation();
  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-4">
      <Text className="text-3xl font-bold text-blue-600 mb-4">
        {t('common.about')}
      </Text>
      <Text className="text-base text-gray-700 text-center">
        This app allows you to read and listen to novel chapters from your
        specified GitHub repository. Enjoy a seamless reading and listening
        experience with customizable settings and Bluetooth controls.
      </Text>
      <Text className="mt-8 text-sm text-gray-500">
        {t('common.version')}: 1.0.0
      </Text>
    </View>
  );
};
