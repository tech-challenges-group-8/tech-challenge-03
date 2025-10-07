import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton, ThemedInput } from '@/components/ui';
import { ThemedCurrencyInput } from '@/components/ui/ThemedCurrencyInput';
import { ThemedSelect } from '@/components/ui/ThemedSelect';
import { Colors, SPACING } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/hooks/useI18n';
import { Transacao } from '@/services/firebase/transacoes';

interface TransactionModalProps {
  transaction: Transacao | null;
  loading: boolean;
  errorDescricao: string | null;
  errorValor: string | null;
  onClose: () => void;
  onSave: () => void;
  onDelete: (transaction: Transacao) => void;
  onUploadReceipt: () => void;
  onTransactionChange: (field: string, value: any) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  loading,
  errorDescricao,
  errorValor,
  onClose,
  onSave,
  onDelete,
  onUploadReceipt,
  onTransactionChange
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { t } = useI18n();

  if (!transaction) return null;

  const isEditing = transaction.id != null;

  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}
        <ThemedView style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <ThemedView style={[styles.modalContentForm, { backgroundColor: colors.background }]}>
            <ThemedText type="h1" style={{ color: colors.text, marginBottom: SPACING * 2 }}>
              {isEditing ? t('transactions.editTitle') : t('transactions.createTitle')}
            </ThemedText>

            <ThemedInput
              label={t('transactions.description')}
              placeholder={t('transactions.descriptionPlaceholder')}
              value={transaction.descricao}
              onChangeText={(text) => onTransactionChange('descricao', text)}
              error={errorDescricao || ""}
            />

            <ThemedSelect
              label={t('transactions.type')}
              value={transaction.tipo || "Deposito"}
              onValueChange={(tipo) => onTransactionChange('tipo', tipo === "Deposito" ? "Deposito" : "Transferencia")}
              options={[
                { label: t('transactions.deposit'), value: "Deposito" },
                { label: t('transactions.transfer'), value: "Transferencia" },
              ]}
            />

            <ThemedCurrencyInput
              label={t('transactions.value')}
              value={transaction.valor || 0}
              onChangeValue={(valor) => onTransactionChange('valor', valor || 0)}
              error={errorValor || ""}
            />

            {/* Receipt Section */}
            {transaction.imagem ? (
              <TouchableOpacity
                style={styles.boxVisualizarAnexo}
                onPress={onUploadReceipt}
              >
                <ThemedView style={[styles.boxVisualizarAnexoIcone, { backgroundColor: colors.primary }]}>
                  <Ionicons name="attach" size={40} color="#FFF" style={{ marginRight: 0 }} />
                </ThemedView>
                <ThemedText type="body1" style={{ textAlign: "center", color: colors.text }}>
                  {t('transactions.viewReceipt')}
                </ThemedText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.boxVisualizarAnexo}
                onPress={onUploadReceipt}
              >
                <ThemedView style={[styles.boxVisualizarAnexoIcone, { backgroundColor: colors.primary }]}>
                  <Ionicons name="attach" size={40} color="#FFF" style={{ marginRight: 0 }} />
                </ThemedView>
                <ThemedText type="body1" style={{ textAlign: "center", color: colors.text }}>
                  {t('transactions.registerReceipt')}
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>

          <ThemedView style={styles.rowModelButton}>
            <ThemedButton
              title={t('common.save')}
              onPress={onSave}
              variant="primary"
              size="small"
            />

            {isEditing && (
              <ThemedButton
                title={t('common.delete')}
                onPress={() => onDelete(transaction)}
                variant="delete"
                size="small"
              />
            )}

            <ThemedButton
              title={t('common.back')}
              onPress={onClose}
              variant="secondary"
              size="small"
            />
          </ThemedView>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: SPACING * 2,
    borderRadius: 16,
    alignItems: "center",
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    height: "100%",
  },
  modalContentForm: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    flex: 1,
  },
  boxVisualizarAnexo: {
    flexDirection: "column",
    alignItems: "center",
    gap: SPACING,
    width: 150,
    marginVertical: SPACING,
  },
  boxVisualizarAnexoIcone: {
    borderRadius: 25,
    padding: SPACING,
    justifyContent: "center",
    alignItems: "center",
  },
  rowModelButton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING,
    marginTop: SPACING,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
