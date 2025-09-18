import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export const LandingScreen = () => {
  const { t } = useTranslation();
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-3xl font-bold text-blue-600">
        {t('common.welcome')}
      </Text>
      <Text className="mt-4 text-lg text-gray-700">
        {t('common.journey_begins')}
      </Text>
    </View>
  );
};
