import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { availableLanguages, languageMetadata } from '@/i18n/locales';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <View style={styles.container}>
      {availableLanguages.map((lang) => {
        const isActive = i18n.language === lang;
        const metadata = languageMetadata[lang];
        
        return (
          <TouchableOpacity
            key={lang}
            style={[
              styles.button,
              {
                backgroundColor: isActive ? colors.primary : colors.backgroundLight,
                borderColor: colors.border,
              }
            ]}
            onPress={() => changeLanguage(lang)}
          >
            <Text style={[
              styles.buttonText,
              {
                color: isActive ? 'white' : colors.text
              }
            ]}>
              {metadata.flag} {metadata.code.toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
