import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

export const WelcomeHeader: React.FC = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
        <Text style={styles.appIcon}>💰</Text>
      </View>
      <Text style={[styles.appName, { color: colors.text }]}>
        {t('welcome.appName')}
      </Text>
      <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
        {t('welcome.subtitle')}
      </Text>
      <Text style={[styles.loginPrompt, { color: colors.tabIconDefault }]}>
        {t('welcome.loginPrompt')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  appIcon: {
    fontSize: 40,
    color: 'white',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  loginPrompt: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
