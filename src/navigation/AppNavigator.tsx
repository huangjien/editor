import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import { LandingScreen } from '../screens/LandingScreen';
import { IndexScreen } from '../screens/IndexScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { ContentScreen } from '../screens/ContentScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { isDark } = useTheme();

  const screenOptions: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
    },
    headerTitleStyle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: isDark ? '#f9fafb' : '#111827',
    },
    headerTintColor: isDark ? '#f9fafb' : '#111827',
    headerBackVisible: true,
    animation: 'slide_from_right' as const,
    gestureEnabled: true,
    gestureDirection: 'horizontal' as const,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing" screenOptions={screenOptions}>
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Index"
          component={IndexScreen}
          options={{
            title: 'Chapters',
            headerLargeTitle: true,
            headerLargeTitleStyle: {
              fontSize: 32,
              fontWeight: '700',
              color: isDark ? '#f9fafb' : '#111827',
            },
          }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{
            title: 'About',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="Content"
          component={ContentScreen}
          options={({ route }) => ({
            title: route.params?.chapterTitle || 'Content',
            headerTitleStyle: {
              fontSize: 16,
              fontWeight: '600' as const,
              color: isDark ? '#f9fafb' : '#111827',
            },
          })}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
