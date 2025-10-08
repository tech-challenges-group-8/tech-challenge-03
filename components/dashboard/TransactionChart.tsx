import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, SPACING } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/hooks/useI18n';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color: () => string;
    strokeWidth: number;
  }[];
}

interface TransactionChartProps {
  chartData: ChartData;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

const { width } = Dimensions.get('window');

export const TransactionChart: React.FC<TransactionChartProps> = ({
  chartData,
  fadeAnim,
  slideAnim
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { t } = useI18n();

  return (
    <Animated.View style={[
      styles.section,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }
    ]}>
      <ThemedView style={styles.sectionHeader}>
        <ThemedText type="h2" style={{ color: colors.text }}>
          {t('dashboard.chartTitle')}
        </ThemedText>
      </ThemedView>
      
      {/* Chart Legend */}
      <ThemedView style={styles.chartLegend}>
        <ThemedView style={styles.legendItem}>
          <ThemedView style={[styles.legendColor, { backgroundColor: colors.success }]} />
          <ThemedText type="body2" style={{ color: colors.text }}>
            {t('transactions.deposits')}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.legendItem}>
          <ThemedView style={[styles.legendColor, { backgroundColor: colors.error }]} />
          <ThemedText type="body2" style={{ color: colors.text }}>
            {t('transactions.transfers')}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.chartContainer}>
        {chartData.labels.length > 0 && chartData.datasets.length > 0 ? (
          <LineChart
            data={{
              labels: chartData.labels,
              datasets: chartData.datasets
            }}
            width={width - (SPACING * 4)}
            height={220}
            yAxisLabel="R$ "
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: colors.background,
              backgroundGradientFrom: colors.background,
              backgroundGradientTo: colors.backgroundLight,
              decimalPlaces: 0,
              color: (opacity = 1) => colors.textSecondary,
              labelColor: (opacity = 1) => colors.text,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        ) : (
          <ThemedView style={styles.chartEmptyState}>
            <Ionicons name="analytics-outline" size={48} color={colors.textDisabled} />
            <ThemedText type="body1" style={{ 
              color: colors.textSecondary, 
              marginTop: SPACING, 
              textAlign: 'center' 
            }}>
              {t('dashboard.chartEmptyState')}
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
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING * 2,
    marginBottom: SPACING,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING / 2,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: SPACING,
  },
  chartEmptyState: {
    alignItems: 'center',
    paddingVertical: SPACING * 2,
  },
});
