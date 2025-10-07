import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/config/firebase';
import { Colors, SPACING } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getTransacoesPaginated, Transacao } from '@/services/firebase/transacoes';
import { formatarData } from '@/utils/dateUtils';

interface DashboardStats {
  totalBalance: number;
  totalDeposits: number;
  totalTransfers: number;
  transactionCount: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color: () => string;
    strokeWidth: number;
  }[];
}

export default function HomeScreen() {
  const [transactions, setTransactions] = useState<Transacao[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    totalDeposits: 0,
    totalTransfers: 0,
    transactionCount: 0
  });
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  // Animation values
  const fadeAnim = useState(() => new Animated.Value(0))[0];
  const slideAnim = useState(() => new Animated.Value(50))[0];
  const scaleAnim = useState(() => new Animated.Value(0.8))[0];

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const user = auth.currentUser;

  const loadDashboardData = React.useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { transacoes } = await getTransacoesPaginated(null);
      
      // Calculate stats
      const totalDeposits = transacoes
        .filter(t => t.tipo === 'Deposito')
        .reduce((sum, t) => sum + t.valor, 0);
      
      const totalTransfers = transacoes
        .filter(t => t.tipo === 'Transferencia')
        .reduce((sum, t) => sum + t.valor, 0);
      
      const totalBalance = totalDeposits - totalTransfers;

      setStats({
        totalBalance,
        totalDeposits,
        totalTransfers,
        transactionCount: transacoes.length
      });

      // Prepare chart data - group by day and calculate daily totals
      const chartLabels: string[] = [];
      const depositData: number[] = [];
      const transferData: number[] = [];

      // Get last 7 days
      const today = new Date();
      const daysData = new Map<string, { deposits: number, transfers: number }>();

      // Initialize last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
        const label = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        
        daysData.set(dateStr, { deposits: 0, transfers: 0 });
        chartLabels.push(label);
      }

      // Aggregate transactions by day
      transacoes.forEach(transaction => {
        const transactionDate = new Date(transaction.dataCriacao).toISOString().split('T')[0];
        const dayData = daysData.get(transactionDate);
        
        if (dayData) {
          if (transaction.tipo === 'Deposito') {
            dayData.deposits += transaction.valor;
          } else {
            dayData.transfers += transaction.valor;
          }
        }
      });

      // Convert to chart format
      daysData.forEach((data) => {
        depositData.push(data.deposits);
        transferData.push(data.transfers);
      });

      setChartData({
        labels: chartLabels,
        datasets: [
          {
            data: depositData,
            color: () => colors.success, // Green for deposits
            strokeWidth: 3,
          },
          {
            data: transferData,
            color: () => colors.error, // Red for transfers
            strokeWidth: 3,
          }
        ]
      });

      // Show only recent transactions (last 5)
      setTransactions(transacoes.slice(0, 5));
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [user, colors.success, colors.error]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    // Start animations when data is loaded
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, fadeAnim, slideAnim, scaleAnim]);

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color, 
    delay = 0 
  }: { 
    title: string; 
    value: string; 
    icon: keyof typeof Ionicons.glyphMap; 
    color: string;
    delay?: number;
  }) => {
    const cardAnim = useState(() => new Animated.Value(0))[0];

    useEffect(() => {
      if (!loading) {
        Animated.timing(cardAnim, {
          toValue: 1,
          duration: 400,
          delay,
          useNativeDriver: true,
        }).start();
      }
    }, [delay, cardAnim]);

    return (
      <Animated.View style={[
        styles.statCard,
        { 
          backgroundColor: colors.backgroundLight,
          opacity: cardAnim,
          transform: [{
            translateY: cardAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0]
            })
          }]
        }
      ]}>
        <ThemedView style={[styles.statIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </ThemedView>
        <ThemedView style={styles.statContent}>
          <ThemedText type="body2" style={{ color: colors.textSecondary }}>
            {title}
          </ThemedText>
          <ThemedText type="h2" style={{ color: color }}>
            {value}
          </ThemedText>
        </ThemedView>
      </Animated.View>
    );
  };

  const RecentTransactionItem = ({ 
    transaction, 
    index 
  }: { 
    transaction: Transacao; 
    index: number 
  }) => {
    const itemAnim = useState(() => new Animated.Value(0))[0];

    useEffect(() => {
      if (!loading) {
        Animated.timing(itemAnim, {
          toValue: 1,
          duration: 300,
          delay: 100 + (index * 100),
          useNativeDriver: true,
        }).start();
      }
    }, [index, itemAnim]);

    return (
      <Animated.View style={[
        styles.transactionItem,
        { 
          backgroundColor: colors.background,
          opacity: itemAnim,
          transform: [{
            translateX: itemAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0]
            })
          }]
        }
      ]}>
        <ThemedView style={[
          styles.transactionIcon,
          { 
            backgroundColor: transaction.tipo === 'Deposito' 
              ? colors.success + '20' 
              : colors.error + '20' 
          }
        ]}>
          <Ionicons 
            name={transaction.tipo === 'Deposito' ? 'arrow-down' : 'arrow-up'} 
            size={20} 
            color={transaction.tipo === 'Deposito' ? colors.success : colors.error}
          />
        </ThemedView>
        <ThemedView style={styles.transactionContent}>
          <ThemedText type="body1" numberOfLines={1}>
            {transaction.descricao}
          </ThemedText>
          <ThemedText type="body2" style={{ color: colors.textSecondary }}>
            {formatarData(transaction.dataCriacao)}
          </ThemedText>
        </ThemedView>
        <ThemedText 
          type="body1" 
          style={{ 
            color: transaction.tipo === 'Deposito' ? colors.success : colors.error,
            fontWeight: 'bold'
          }}
        >
          {transaction.tipo === 'Deposito' ? '+' : '-'}R$ {transaction.valor.toFixed(2)}
        </ThemedText>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText style={{ marginTop: SPACING, color: colors.textSecondary }}>
          Carregando dashboard...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.header}>
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}>
          <ThemedText type="title" style={{ color: colors.text }}>
            Dashboard
          </ThemedText>
          <ThemedText type="body1" style={{ color: colors.textSecondary, marginTop: 4 }}>
            Visão geral das suas transações
          </ThemedText>
        </Animated.View>
      </ThemedView>

      {/* Stats Grid */}
      <ThemedView style={styles.statsContainer}>
        <StatCard
          title="Saldo Total"
          value={`R$ ${stats.totalBalance.toFixed(2)}`}
          icon="wallet"
          color={stats.totalBalance >= 0 ? colors.success : colors.error}
          delay={0}
        />
        <StatCard
          title="Total Depósitos"
          value={`R$ ${stats.totalDeposits.toFixed(2)}`}
          icon="arrow-down"
          color={colors.success}
          delay={100}
        />
        <StatCard
          title="Total Transferências"
          value={`R$ ${stats.totalTransfers.toFixed(2)}`}
          icon="arrow-up"
          color={colors.error}
          delay={200}
        />
        <StatCard
          title="Transações"
          value={stats.transactionCount.toString()}
          icon="list"
          color={colors.primary}
          delay={300}
        />
      </ThemedView>

      {/* Chart Section */}
      <Animated.View style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="h2" style={{ color: colors.text }}>
            Transações - Últimos 7 Dias
          </ThemedText>
        </ThemedView>
        
        {/* Chart Legend */}
        <ThemedView style={styles.chartLegend}>
          <ThemedView style={styles.legendItem}>
            <ThemedView style={[styles.legendColor, { backgroundColor: colors.success }]} />
            <ThemedText type="body2" style={{ color: colors.text }}>Depósitos</ThemedText>
          </ThemedView>
          <ThemedView style={styles.legendItem}>
            <ThemedView style={[styles.legendColor, { backgroundColor: colors.error }]} />
            <ThemedText type="body2" style={{ color: colors.text }}>Transferências</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.chartContainer}>
          {chartData.labels.length > 0 && chartData.datasets.length > 0 ? (
            <LineChart
              data={{
                labels: chartData.labels,
                datasets: chartData.datasets
              }}
              width={width - (SPACING * 4)} // from react-native
              height={220}
              yAxisLabel="R$ "
              yAxisSuffix=""
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: colors.background,
                backgroundGradientFrom: colors.background,
                backgroundGradientTo: colors.backgroundLight,
                decimalPlaces: 0, // optional, defaults to 2dp
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
              <ThemedText type="body1" style={{ color: colors.textSecondary, marginTop: SPACING, textAlign: 'center' }}>
                Dados insuficientes para gerar gráfico
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </Animated.View>

      {/* Recent Transactions */}
      <Animated.View style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="h2" style={{ color: colors.text }}>
            Transações Recentes
          </ThemedText>
          <TouchableOpacity>
            <ThemedText type="body2" style={{ color: colors.primary }}>
              Ver todas
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.transactionsList}>
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <RecentTransactionItem
                key={transaction.id || index}
                transaction={transaction}
                index={index}
              />
            ))
          ) : (
            <ThemedView style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color={colors.textDisabled} />
              <ThemedText type="body1" style={{ color: colors.textSecondary, marginTop: SPACING }}>
                Nenhuma transação encontrada
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </Animated.View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  header: {
    padding: SPACING * 2,
    paddingBottom: SPACING,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING,
    gap: SPACING,
  },
  statCard: {
    width: (width - SPACING * 3) / 2,
    padding: SPACING * 1.5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING,
  },
  statContent: {
    flex: 1,
  },
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
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING,
    borderRadius: 8,
    marginBottom: SPACING / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING,
  },
  transactionContent: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING * 3,
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: SPACING,
  },
  chartEmptyState: {
    alignItems: 'center',
    paddingVertical: SPACING * 2,
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
});
