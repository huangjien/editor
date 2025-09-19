import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './en.json';
import zh from './zh.json';
import zhHant from './zh-Hant.json';
import de from './de.json';
import it from './it.json';
import fr from './fr.json';
import ru from './ru.json';
import es from './es.json';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
  'zh-Hant': { translation: zhHant },
  de: { translation: de },
  it: { translation: it },
  fr: { translation: fr },
  ru: { translation: ru },
  es: { translation: es },
};

const languageDetector = {
  type: 'languageDetector' as const,
  async: false, // Make it synchronous to avoid initialization issues
  detect: () => {
    const locales = RNLocalize.getLocales();
    if (locales.length > 0) {
      return locales[0].languageTag;
    }
    return 'en';
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

const initI18n = () => {
  return i18n
    .use(languageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources,
      fallbackLng: 'en',
      compatibilityJSON: 'v4',
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
      react: {
        useSuspense: false, // Disable suspense to prevent crashes
      },
    });
};

// Initialize immediately
initI18n();

export default i18n;
