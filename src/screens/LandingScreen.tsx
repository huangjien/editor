import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

export const LandingScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { isDark } = useTheme();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Staggered animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const navigationItems = [
    {
      title: t('common.chapters'),
      subtitle: 'Explore your stories',
      icon: 'library-outline',
      route: 'Index',
      gradient: isDark
        ? 'from-primary-600 to-primary-700'
        : 'from-primary-500 to-primary-600',
    },
    {
      title: t('common.settings'),
      subtitle: 'Customize your experience',
      icon: 'settings-outline',
      route: 'Settings',
      gradient: isDark
        ? 'from-secondary-600 to-secondary-700'
        : 'from-secondary-500 to-secondary-600',
    },
    {
      title: t('common.about'),
      subtitle: 'Learn more about the app',
      icon: 'information-circle-outline',
      route: 'About',
      gradient: isDark
        ? 'from-neutral-600 to-neutral-700'
        : 'from-neutral-500 to-neutral-600',
    },
  ];

  return (
    <View className={`flex-1 ${isDark ? 'bg-dark-50' : 'bg-neutral-50'}`}>
      {/* Hero Section */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
        className="px-6 py-16"
      >
        <View className="items-center">
          <View
            className={`w-24 h-24 rounded-3xl mb-8 items-center justify-center ${
              isDark ? 'bg-primary-600' : 'bg-primary-500'
            } shadow-lg`}
          >
            <Icon name="library-outline" size={48} color="white" />
          </View>

          <Text
            className={`text-4xl font-bold text-center mb-6 ${
              isDark ? 'text-dark-900' : 'text-neutral-900'
            }`}
          >
            Welcome to Editor
          </Text>

          <Text
            className={`text-lg text-center leading-7 max-w-sm ${
              isDark ? 'text-dark-600' : 'text-neutral-600'
            }`}
          >
            Your personal reading companion with powerful features for an
            enhanced experience.
          </Text>
        </View>

        {/* Navigation Cards */}
        <View className="w-full max-w-sm mx-auto mt-12 space-y-4">
          {navigationItems.map((item, _index) => (
            <TouchableOpacity
              key={item.route}
              className={`
                p-6 rounded-2xl border
                ${
                  isDark
                    ? 'bg-dark-100 border-dark-200 active:bg-dark-200'
                    : 'bg-white border-neutral-200 active:bg-neutral-50'
                }
                shadow-soft
              `}
              onPress={() => navigation.navigate(item.route as never)}
              style={styles.touchableButton}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${
                    isDark ? 'bg-primary-600' : 'bg-primary-500'
                  }`}
                >
                  <Icon name={item.icon} size={24} color="white" />
                </View>

                <View className="flex-1">
                  <Text
                    className={`text-lg font-semibold mb-1 ${
                      isDark ? 'text-dark-900' : 'text-neutral-900'
                    }`}
                  >
                    {item.title}
                  </Text>
                  <Text
                    className={`text-sm ${
                      isDark ? 'text-dark-600' : 'text-neutral-600'
                    }`}
                  >
                    {item.subtitle}
                  </Text>
                </View>

                <Icon
                  name="chevron-forward"
                  size={20}
                  color={isDark ? '#a1a1aa' : '#737373'}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Footer */}
      <View className="pb-8 px-8">
        <Text
          className={`text-center text-sm ${
            isDark ? 'text-dark-500' : 'text-neutral-500'
          }`}
        >
          Crafted with care for readers everywhere
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  touchableButton: {
    transform: [{ scale: 1 }],
  },
});
