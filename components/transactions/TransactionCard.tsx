import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, SPACING } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Transacao } from '@/services/firebase/transacoes';
import { formatarData } from '@/utils/dateUtils';

interface TransactionCardProps {
  transaction: Transacao;
  onPress: (transaction: Transacao) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onPress
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity onPress={() => onPress(transaction)}>
      <ThemedView style={[
        styles.card, 
        { 
          backgroundColor: colors.background, 
          borderColor: colors.border 
        }
      ]}>
        {/* Transaction icon */}
        <ThemedView style={[
          styles.transactionIcon,
          { 
            backgroundColor: transaction.tipo === "Deposito" 
              ? colors.success + '20' 
              : colors.error + '20'
          }
        ]}>
          <Ionicons 
            name={transaction.tipo === "Deposito" ? "arrow-down" : "arrow-up"} 
            size={20} 
            color={transaction.tipo === "Deposito" ? colors.success : colors.error}
          />
        </ThemedView>

        {/* Transaction content */}
        <ThemedView style={styles.transactionContent}>
          <ThemedText type="h2" style={{ color: colors.text }}>
            {transaction.descricao}
          </ThemedText>
          <ThemedText type="body2" style={{ color: colors.textSecondary }}>
            {formatarData(transaction.dataCriacao)} - {transaction.tipo}
          </ThemedText>
        </ThemedView>

        {/* Transaction value */}
        <ThemedView style={styles.transactionValue}>
          <ThemedText
            type="body1"
            style={[
              styles.valor,
              { 
                color: transaction.tipo === "Deposito" ? colors.success : colors.error,
                fontWeight: 'bold'
              }
            ]}
          >
            {transaction.tipo === "Deposito" ? "+" : "-"}R$ {transaction.valor.toFixed(2)}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING,
    marginHorizontal: SPACING * 2,
    marginBottom: SPACING / 2,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING,
  },
  transactionContent: {
    flex: 1,
  },
  transactionValue: {
    alignItems: 'flex-end',
  },
  valor: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
