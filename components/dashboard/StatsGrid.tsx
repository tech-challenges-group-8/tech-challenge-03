import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { Colors, SPACING } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/hooks/useI18n';

import { StatCard } from './StatCard';

interface DashboardStats {
  totalBalance: number;
  totalDeposits: number;
  totalTransfers: number;
  transactionCount: number;
}

interface StatsGridProps {
  stats: DashboardStats;
  loading?: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, loading = false }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { t } = useI18n();

  return (
    <ThemedView style={styles.statsContainer}>
      <StatCard
        title={t('dashboard.totalBalance')}
        value={`R$ ${stats.totalBalance.toFixed(2)}`}
        icon="wallet"
        color={stats.totalBalance >= 0 ? colors.success : colors.error}
        delay={0}
        loading={loading}
      />
      <StatCard
        title={t('dashboard.totalDeposits')}
        value={`R$ ${stats.totalDeposits.toFixed(2)}`}
        icon="arrow-down"
        color={colors.success}
        delay={100}
        loading={loading}
      />
      <StatCard
        title={t('dashboard.totalTransfers')}
        value={`R$ ${stats.totalTransfers.toFixed(2)}`}
        icon="arrow-up"
        color={colors.error}
        delay={200}
        loading={loading}
      />
      <StatCard
        title={t('dashboard.transactionCount')}
        value={stats.transactionCount.toString()}
        icon="list"
        color={colors.primary}
        delay={300}
        loading={loading}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING,
    gap: SPACING,
  },
});
