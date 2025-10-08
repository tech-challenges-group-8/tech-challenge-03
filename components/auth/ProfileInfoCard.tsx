import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, SPACING } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ProfileInfoCardProps {
  label: string;
  value: string;
  isLast?: boolean;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  label,
  value,
  isLast = false
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <ThemedView style={[
      styles.infoSection,
      !isLast && { 
        borderBottomWidth: 1, 
        borderBottomColor: colors.border + '30' 
      }
    ]}>
      <ThemedText type="body2" style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </ThemedText>
      <ThemedText type="body1" style={[styles.value, { color: colors.text }]}>
        {value}
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  infoSection: {
    paddingVertical: SPACING * 1.5,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: SPACING / 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
});
