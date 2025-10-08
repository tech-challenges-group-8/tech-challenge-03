import React from 'react';
import { Alert, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/ui';
import { Colors, SPACING } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/hooks/useI18n';
import { AuthService } from '@/services/AuthService';
import { formatarData } from '@/utils/dateUtils';
import { ProfileInfoCard } from './ProfileInfoCard';

export const UserProfile: React.FC = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      Alert.alert(t('messages.success'), t('messages.loggedOutSuccessfully'));
    } catch (error: any) {
      Alert.alert(t('messages.error'), error.message);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView
        style={[styles.profile, { backgroundColor: colors.background }]}
      >
        <ProfileInfoCard
          label={t("profile.displayName")}
          value={user?.displayName || t("profile.notSet")}
        />

        <ProfileInfoCard
          label={t("profile.email")}
          value={user?.email || t("profile.notProvided")}
        />

        <ProfileInfoCard
          label={t("profile.emailVerified")}
          value={user?.emailVerified ? t("profile.yes") : t("profile.no")}
        />

        <ProfileInfoCard
          label={t("profile.accountCreated")}
          value={
            user?.metadata?.creationTime
              ? formatarData(user.metadata.creationTime)
              : t("profile.notProvided")
          }
        />

        <ProfileInfoCard
          label={t("profile.lastAccess")}
          value={
            user?.metadata?.lastSignInTime
              ? formatarData(user.metadata.lastSignInTime)
              : t("profile.notProvided")
          }
          isLast={true}
        />
      </ThemedView>

      <ThemedView
        style={[styles.logoutSection, { backgroundColor: colors.background }]}
      >
        <ThemedButton
          title={t("auth.logout")}
          onPress={handleLogout}
          variant="delete"
          size="large"
        />
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profile: {
    margin: SPACING,
    padding: SPACING * 1.5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutSection: {
    margin: SPACING,
    padding: SPACING * 1.5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoSection: {
    marginBottom: SPACING,
    paddingBottom: SPACING,
    borderBottomWidth: 1,
  },
  value: {
    fontWeight: '600',
    marginTop: 4,
  },
});
