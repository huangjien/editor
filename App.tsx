/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { AuthService } from './src/services/AuthService';
import { AppNavigator } from './src/navigation/AppNavigator';
import i18n from './src/locales/i18n';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

function AppContent() {
  const { isDark } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const authenticateUser = async () => {
      setIsLoadingAuth(true);
      try {
        const success = await AuthService.authenticate();
        setIsAuthenticated(success);
      } catch (error) {
        console.error('Authentication failed:', error);
        setIsAuthenticated(false);
      }
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
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.container} testID="main_app">
        <AppNavigator />
      </View>
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </I18nextProvider>
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

export default App;
