import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';

export const LandingScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { isDark } = useTheme();

  const dynamicStyles = createStyles(isDark);

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>{t('common.welcome')}</Text>
      <Text style={dynamicStyles.subtitle}>{t('common.journey_begins')}</Text>

      <View style={dynamicStyles.buttonContainer}>
        <TouchableOpacity
          style={dynamicStyles.button}
          onPress={() => navigation.navigate('Index' as never)}
        >
          <Text style={dynamicStyles.buttonText}>{t('common.chapters')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.button}
          onPress={() => navigation.navigate('Settings' as never)}
        >
          <Text style={dynamicStyles.buttonText}>{t('common.settings')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.button}
          onPress={() => navigation.navigate('About' as never)}
        >
          <Text style={dynamicStyles.buttonText}>{t('common.about')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#333',
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 18,
      color: isDark ? '#cccccc' : '#666',
      textAlign: 'center',
      marginBottom: 40,
    },
    buttonContainer: {
      width: '100%',
      maxWidth: 300,
    },
    button: {
      backgroundColor: isDark ? '#0056b3' : '#007AFF',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 8,
      marginBottom: 15,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });
