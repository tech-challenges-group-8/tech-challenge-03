import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, SPACING } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/hooks/useI18n';
import { Transacao } from '@/services/firebase/transacoes';

import { RecentTransactionItem } from './RecentTransactionItem';

interface RecentTransactionsProps {
  transactions: Transacao[];
  loading?: boolean;
  scaleAnim: Animated.Value;
  onViewAllPress?: () => void;
  onTransactionPress?: (transaction: Transacao) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  loading = false,
  scaleAnim,
  onViewAllPress,
  onTransactionPress
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { t } = useI18n();

  return (
    <Animated.View style={[
      styles.section,
      {
        transform: [{ scale: scaleAnim }]
      }
    ]}>
      <ThemedView style={styles.sectionHeader}>
        <ThemedText type="h2" style={{ color: colors.text }}>
          {t('dashboard.recentTransactions')}
        </ThemedText>
        {onViewAllPress && (
          <TouchableOpacity onPress={onViewAllPress}>
            <ThemedText type="body2" style={{ color: colors.primary }}>
              {t('common.viewAll')}
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      <ThemedView style={styles.transactionsList}>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <TouchableOpacity 
              key={transaction.id || index}
              onPress={() => onTransactionPress?.(transaction)}
              activeOpacity={0.7}
            >
              <RecentTransactionItem
                transaction={transaction}
                index={index}
                loading={loading}
              />
            </TouchableOpacity>
          ))
        ) : (
          <ThemedView style={styles.emptyState}>
            <Ionicons name="document-outline" size={48} color={colors.textDisabled} />
            <ThemedText type="body1" style={{ color: colors.textSecondary, marginTop: SPACING }}>
              {t('dashboard.noTransactionsFound')}
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: SPACING * 2,
    paddingHorizontal: SPACING * 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING,
  },
  transactionsList: {
    gap: SPACING / 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING * 3,
  },
});
