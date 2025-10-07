import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet
} from 'react-native';

import {
  ChartData,
  DashboardStats,
  RecentTransactions,
  StatsGrid,
  TransactionChart
} from '@/components/dashboard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PageTitle } from '@/components/ui';
import { auth } from '@/config/firebase';
import { Colors, SPACING } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/hooks/useI18n';
import { getTransacoesPaginated, Transacao } from '@/services/firebase/transacoes';

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
  const { t } = useI18n();

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

  // Handle navigation to transactions tab
  const handleViewAllTransactions = () => {
    // This would navigate to the transactions tab
    // You can implement router navigation here if needed
    console.log('Navigate to transactions tab');
  };

  const handleTransactionPress = (transaction: Transacao) => {
    // Handle transaction item press
    console.log('Transaction pressed:', transaction);
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText style={{ marginTop: SPACING, color: colors.textSecondary }}>
          {t('dashboard.loadingMessage')}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <PageTitle
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        animated={true}
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
      />

      {/* Stats Grid */}
      <StatsGrid stats={stats} loading={loading} />

      {/* Chart Section */}
      <TransactionChart 
        chartData={chartData} 
        fadeAnim={fadeAnim} 
        slideAnim={slideAnim} 
      />

      {/* Recent Transactions */}
      <RecentTransactions
        transactions={transactions}
        loading={loading}
        scaleAnim={scaleAnim}
        onViewAllPress={handleViewAllTransactions}
        onTransactionPress={handleTransactionPress}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
