import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

export const AboutScreen = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const features = [
    {
      icon: 'book-outline',
      title: 'Chapter Reading',
      description:
        'Read chapters from your GitHub repository with a clean, distraction-free interface.',
    },
    {
      icon: 'headset-outline',
      title: 'Audio Playback',
      description:
        'Listen to chapters with text-to-speech functionality and customizable playback speed.',
    },
    {
      icon: 'bluetooth-outline',
      title: 'Bluetooth Controls',
      description:
        'Control playback using your Bluetooth headphones or speakers.',
    },
    {
      icon: 'settings-outline',
      title: 'Customizable',
      description:
        'Personalize your reading experience with themes, fonts, and display settings.',
    },
  ];

  return (
    <View className={`flex-1 ${isDark ? 'bg-dark-50' : 'bg-neutral-50'}`}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center mb-16">
          <View
            className={`w-20 h-20 rounded-2xl mb-6 items-center justify-center ${
              isDark ? 'bg-primary-600' : 'bg-primary-500'
            }`}
          >
            <Icon name="information-circle-outline" size={40} color="white" />
          </View>

          <Text
            className={`text-3xl font-bold text-center mb-4 ${
              isDark ? 'text-dark-900' : 'text-neutral-900'
            }`}
          >
            {t('common.about')}
          </Text>

          <Text
            className={`text-lg text-center leading-7 max-w-sm ${
              isDark ? 'text-dark-600' : 'text-neutral-600'
            }`}
          >
            Your personal reading companion with powerful features for an
            enhanced reading experience.
          </Text>
        </View>

        {/* Features */}
        <View className="mb-8">
          <Text
            className={`text-xl font-semibold mb-6 ${
              isDark ? 'text-dark-900' : 'text-neutral-900'
            }`}
          >
            Features
          </Text>

          <View className="space-y-4">
            {features.map((feature, index) => (
              <View
                key={index}
                className={`p-6 rounded-2xl border ${
                  isDark
                    ? 'bg-dark-100 border-dark-200'
                    : 'bg-white border-neutral-200'
                } shadow-soft`}
              >
                <View className="flex-row items-start">
                  <View
                    className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${
                      isDark ? 'bg-primary-600' : 'bg-primary-500'
                    }`}
                  >
                    <Icon name={feature.icon} size={24} color="white" />
                  </View>

                  <View className="flex-1">
                    <Text
                      className={`text-lg font-semibold mb-2 ${
                        isDark ? 'text-dark-900' : 'text-neutral-900'
                      }`}
                    >
                      {feature.title}
                    </Text>
                    <Text
                      className={`text-sm leading-5 ${
                        isDark ? 'text-dark-600' : 'text-neutral-600'
                      }`}
                    >
                      {feature.description}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View
          className={`p-6 rounded-2xl border ${
            isDark
              ? 'bg-dark-100 border-dark-200'
              : 'bg-white border-neutral-200'
          } shadow-soft`}
        >
          <View className="items-center">
            <Text
              className={`text-lg font-semibold mb-2 ${
                isDark ? 'text-dark-900' : 'text-neutral-900'
              }`}
            >
              Editor
            </Text>
            <Text
              className={`text-sm mb-4 ${
                isDark ? 'text-dark-600' : 'text-neutral-600'
              }`}
            >
              {t('common.version')}: 1.0.0
            </Text>

            <TouchableOpacity
              className={`px-6 py-3 rounded-xl ${
                isDark ? 'bg-primary-600' : 'bg-primary-500'
              }`}
            >
              <View className="flex-row items-center">
                <Icon name="heart-outline" size={16} color="white" />
                <Text className="text-white text-sm font-medium ml-2">
                  Made with care
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 32,
  },
});
