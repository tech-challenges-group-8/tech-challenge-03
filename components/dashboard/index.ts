export { RecentTransactionItem } from './RecentTransactionItem';
export { RecentTransactions } from './RecentTransactions';
export { StatCard } from './StatCard';
export { StatsGrid } from './StatsGrid';
export { TransactionChart } from './TransactionChart';

// Export types
export interface DashboardStats {
  totalBalance: number;
  totalDeposits: number;
  totalTransfers: number;
  transactionCount: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color: () => string;
    strokeWidth: number;
  }[];
}
