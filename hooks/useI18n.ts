import { availableLanguages, languageMetadata, type Language } from '@/i18n/locales';
import { useTranslation } from 'react-i18next';

/**
 * Enhanced translation hook with additional utilities
 */
export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: Language) => {
    i18n.changeLanguage(language);
  };

  const getCurrentLanguage = (): Language => {
    return i18n.language as Language;
  };

  const getCurrentLanguageMetadata = () => {
    const currentLang = getCurrentLanguage();
    return languageMetadata[currentLang];
  };

  const getAvailableLanguages = () => {
    return availableLanguages;
  };

  const getAllLanguageMetadata = () => {
    return languageMetadata;
  };

  return {
    // Standard i18next
    t,
    i18n,
    
    // Enhanced utilities
    changeLanguage,
    getCurrentLanguage,
    getCurrentLanguageMetadata,
    getAvailableLanguages,
    getAllLanguageMetadata,
    
    // Helper creators
    hasTranslation: createHasTranslation(i18n),
    formatCurrency: createFormatCurrency(getCurrentLanguage()),
    formatDate: createFormatDate(getCurrentLanguage()),
  };
};

/**
 * Translation validation helper
 * Checks if a translation key exists in the current language
 */
export const createHasTranslation = (i18n: any) => (key: string, options?: { lng?: string }) => {
  return i18n.exists(key, options);
};

/**
 * Format currency with proper locale
 */
export const createFormatCurrency = (currentLanguage: Language) => (amount: number, currency = 'BRL') => {
  const locale = currentLanguage === 'pt' ? 'pt-BR' : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format date with proper locale
 */
export const createFormatDate = (currentLanguage: Language) => (date: Date, options?: Intl.DateTimeFormatOptions) => {
  const locale = currentLanguage === 'pt' ? 'pt-BR' : 'en-US';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date);
};
