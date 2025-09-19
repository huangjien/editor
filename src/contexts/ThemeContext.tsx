import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import { SettingsService } from '../services/SettingsService';

type ThemeMode = 'system' | 'light' | 'dark';
type ActualTheme = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  actualTheme: ActualTheme;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  // Load theme preference from settings on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const settings = await SettingsService.getSettings();
        setThemeModeState(settings.theme);
      } catch (error) {
        console.log('Failed to load theme preference, using default');
      }
    };
    loadThemePreference();
  }, []);

  // Calculate actual theme based on mode and system preference
  const actualTheme: ActualTheme =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : themeMode === 'dark'
      ? 'dark'
      : 'light';

  const isDark = actualTheme === 'dark';

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      const settings = await SettingsService.getSettings();
      settings.theme = mode;
      await SettingsService.saveSettings(settings);
    } catch (error) {
      console.log('Failed to save theme preference');
    }
  };

  const value: ThemeContextType = {
    themeMode,
    actualTheme,
    setThemeMode,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
