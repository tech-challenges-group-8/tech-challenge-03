import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { AuthService } from '../../services/AuthService';

export const UserProfile: React.FC = () => {
  const { t } = useTranslation();
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundLight }]}>
      <View style={[styles.profile, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('auth.profile')}
        </Text>
        
        <View style={styles.infoSection}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t('profile.displayName')}
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {user?.displayName || t('profile.notSet')}
          </Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t('profile.email')}
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {user?.email}
          </Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t('profile.emailVerified')}
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {user?.emailVerified ? t('profile.yes') : t('profile.no')}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.error }]} 
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>
            {t('auth.logout')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profile: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
  },
  valueSmall: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  logoutButton: {
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
