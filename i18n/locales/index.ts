// Export all locales for easy management
export { default as en } from './en.json';
export { default as pt } from './pt.json';

// Available languages
export const availableLanguages = ['pt', 'en'] as const;
export type Language = typeof availableLanguages[number];

// Language metadata
export const languageMetadata = {
  pt: {
    name: 'Português',
    nativeName: 'Português (Brasil)',
    flag: '🇧🇷',
    code: 'pt',
  },
  en: {
    name: 'English',
    nativeName: 'English (US)',
    flag: '🇺🇸',
    code: 'en',
  },
} as const;
