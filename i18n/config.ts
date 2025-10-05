import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import * as locales from './locales';

// Translations
const resources = {
  pt: {
    translation: locales.pt,
  },
  en: {
    translation: locales.en,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // Default language is Portuguese
    fallbackLng: 'en', // Fallback to English
    debug: __DEV__, // Enable debug in development
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
