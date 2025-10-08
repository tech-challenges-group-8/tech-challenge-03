import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, SPACING } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Transacao } from '@/services/firebase/transacoes';
import { formatarData } from '@/utils/dateUtils';

interface RecentTransactionItemProps {
  transaction: Transacao;
  index: number;
  loading?: boolean;
  onPress?: (transaction: Transacao) => void;
}

export const RecentTransactionItem: React.FC<RecentTransactionItemProps> = ({ 
  transaction, 
  index,
  loading = false,
  onPress
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
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
  }, [index, itemAnim, loading]);

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

const styles = StyleSheet.create({
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
});
