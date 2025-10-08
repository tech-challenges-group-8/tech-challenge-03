import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { UserProfile } from '@/components/auth/UserProfile';
import { PageTitle } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/hooks/useI18n';

export default function ProfileTab() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { t } = useI18n();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <PageTitle
        title={t('auth.profile')}
        subtitle={t('profile.manageAccount')}
      />
      <UserProfile />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
