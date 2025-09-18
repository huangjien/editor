import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import { useTranslation } from 'react-i18next';

const StyledView = styled(View);
const StyledText = styled(Text);

export const LandingScreen = () => {
  const { t } = useTranslation();
  return (
    <StyledView className="flex-1 items-center justify-center bg-gray-100">
      <StyledText className="text-3xl font-bold text-blue-600">
        {t('common.welcome')}
      </StyledText>
      <StyledText className="mt-4 text-lg text-gray-700">
        {t('common.journey_begins')}
      </StyledText>
    </StyledView>
  );
};
