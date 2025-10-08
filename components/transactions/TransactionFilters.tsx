import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedInput } from '@/components/ui';
import { Colors, SPACING } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/hooks/useI18n';

interface TransactionFiltersProps {
  search: string;
  filterTipo: string | null;
  onSearchChange: (text: string) => void;
  onFilterChange: (filter: string | null) => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  search,
  filterTipo,
  onSearchChange,
  onFilterChange
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { t } = useI18n();

  return (
    <>
      {/* Search Filter */}
      <ThemedView style={styles.searchContainer}>
        <ThemedInput
          label=""
          placeholder={t('transactions.filterPlaceholder')}
          value={search}
          onChangeText={onSearchChange}
          style={styles.searchInput}
        />
      </ThemedView>

      {/* Type Filters */}
      <ThemedView style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterBtn, 
            { 
              backgroundColor: filterTipo === null ? colors.primary : colors.backgroundLight,
              borderColor: colors.border
            }
          ]}
          onPress={() => onFilterChange(null)}
        >
          <ThemedText 
            type="body2" 
            style={{ 
              color: filterTipo === null ? colors.background : colors.text 
            }}
          >
            {t('common.all')}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterBtn, 
            { 
              backgroundColor: filterTipo === "Deposito" ? colors.success : colors.backgroundLight,
              borderColor: colors.border
            }
          ]}
          onPress={() => onFilterChange("Deposito")}
        >
          <ThemedText 
            type="body2" 
            style={{ 
              color: filterTipo === "Deposito" ? colors.background : colors.text 
            }}
          >
            {t('transactions.deposits')}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterBtn, 
            { 
              backgroundColor: filterTipo === "Transferencia" ? colors.error : colors.backgroundLight,
              borderColor: colors.border
            }
          ]}
          onPress={() => onFilterChange("Transferencia")}
        >
          <ThemedText 
            type="body2" 
            style={{ 
              color: filterTipo === "Transferencia" ? colors.background : colors.text 
            }}
          >
            {t('transactions.transfers')}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: SPACING * 2,
    marginBottom: SPACING,
  },
  searchInput: {
    marginBottom: 0,
  },
  filterRow: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginBottom: SPACING,
    paddingHorizontal: SPACING * 2,
    gap: SPACING,
  },
  filterBtn: {
    flex: 1,
    padding: SPACING,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
});
