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
  en: { translation: en.common },
  zh: { translation: zh.common },
  'zh-Hant': { translation: zhHant.common },
  de: { translation: de.common },
  it: { translation: it.common },
  fr: { translation: fr.common },
  ru: { translation: ru.common },
  es: { translation: es.common },
};

const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: (callback: (lang: string) => void) => {
    const locales = RNLocalize.getLocales();
    if (locales && locales.length > 0) {
      callback(locales[0].languageCode);
    } else {
      callback('en'); // Fallback if no locale is detected
    }
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector as any) // Cast to any due to custom languageDetector type
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
