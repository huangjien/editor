import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingScreen } from '../screens/LandingScreen';
import { IndexScreen } from '../screens/IndexScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { ContentScreen } from '../screens/ContentScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Index" component={IndexScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Content" component={ContentScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
