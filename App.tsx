/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './global.css';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { AuthService } from './src/services/AuthService';
import { AppNavigator } from './src/navigation/AppNavigator';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './src/locales/i18n';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const authenticateUser = async () => {
      setIsLoadingAuth(true);
      const success = await AuthService.authenticate();
      setIsAuthenticated(success);
      setIsLoadingAuth(false);
    };
    authenticateUser();
  }, []);

  if (isLoadingAuth) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer} testID="loading_screen">
          <ActivityIndicator
            size="large"
            color="#0000ff"
            testID="loading_indicator"
          />
          <Text testID="loading_text">{t('authenticating')}</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer} testID="auth_failed_screen">
          <Text testID="auth_failed_text">{t('authentication_failed')}</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container} testID="main_app">
        <AppNavigator />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const WrappedApp = () => (
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
);

export default WrappedApp;
