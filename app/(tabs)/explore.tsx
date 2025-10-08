import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  FloatingActionButton,
  ImageModal,
  TransactionCard,
  TransactionFilters,
  TransactionModal
} from "@/components/transactions";
import { PageTitle } from "@/components/ui";
import { auth } from "@/config/firebase";
import { Colors, SPACING } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { triggerDashboardRefresh } from "@/hooks/useDashboardRefresh";
import { useI18n } from "@/hooks/useI18n";
import { deleteImageByUrl, pickAndUploadImage } from "@/services/firebase/pickAndUploadImage";
import { addTransacao, deleteTransacao, getTransacoesPaginated, Transacao, updateTransacao } from "@/services/firebase/transacoes";

const NEW_TRANSACTION: Transacao = {
  userId: "",
  tipo: "Deposito",
  descricao: "",
  valor: 0,
  dataCriacao: new Date().toISOString(),
};

export default function TabTwoScreen() {
  const [data, setData] = useState<Transacao[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterTipo, setFilterTipo] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transacao | null>(null);
  const [selectedImagem, setSelectedImagem] = useState<string | undefined>(undefined);
  const [errorDescricao, setErrorDescricao] = useState<string | null>(null);
  const [errorValor, setErrorValor] = useState<string | null>(null);

  // 🆕 NOVO: Estado para rastrear o último documento carregado
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  // 🆕 NOVO: Estado para saber se não há mais dados para buscar
  const [hasMore, setHasMore] = useState(true);
  // Flag to prevent initial load from running multiple times
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const user = auth.currentUser;

  const PAGE_SIZE = 15; // Certifique-se de que está definida e importada

  // Wrap loadData in useCallback but manage dependencies properly
  const loadData = useCallback(async (refresh = false) => {
    if (!user) return;

    // Prevent concurrent calls
    if (loading) return;

    setLoading(true);

    try {
      let startAfterItem = null;
      
      if (refresh) {
        // Reset all states for refresh
        setData([]);
        setLastTransaction(null);
        setHasMore(true);
        startAfterItem = null;
      } else {
        // Use current lastTransaction state
        startAfterItem = lastTransaction;
        
        // If we know there's no more data, don't make the call
        if (!hasMore) {
          setLoading(false);
          return;
        }
      }

      const { transacoes, lastItem } = await getTransacoesPaginated(startAfterItem);

      // Determina se é a última página (usando PAGE_SIZE = 15)
      const isLastPage = transacoes.length < PAGE_SIZE;
      
      setHasMore(!isLastPage);

      if (transacoes.length > 0) {
        // Anexa os novos dados à lista
        if (refresh) {
          setData(transacoes);
        } else {
          setData((prevData) => [...prevData, ...transacoes]);
        }
        setLastTransaction(lastItem);
      } else if (refresh) {
        // If refresh returns no data, ensure we have empty state
        setData([]);
        setLastTransaction(null);
      }

    } catch (error) {
      console.error("Erro ao carregar dados paginados:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [user, lastTransaction, hasMore, loading]);

  // Initial load effect - only run once when user is available
  useEffect(() => {
    if (user && !initialLoadDone && !loading) {
      setInitialLoadDone(true);
      loadData(true);
    }
  }, [user, initialLoadDone, loading, loadData]);

  const handleSalvar = async () => {
    if (!selectedTransaction) return;

    if (!selectedTransaction.descricao) {
      setErrorDescricao("Descrição obrigatória");
      return;
    }
    if (selectedTransaction.valor <= 0) {
      setErrorValor("Valor precisa ser maior que zero");
      return;
    }

    setLoading(true);

    if (selectedTransaction.id) {
      try {
        await updateTransacao(selectedTransaction);
        // Trigger dashboard refresh when transaction is updated
        triggerDashboardRefresh();
      } catch (error) {
        console.error("Erro ao atualizar:", error);
        Alert.alert("Erro", "Não foi possível atualizar a transação.");
      }
    } else {
      try {
        await addTransacao(selectedTransaction);
        // Trigger dashboard refresh when new transaction is added
        triggerDashboardRefresh();
      } catch (error) {
        console.error("Erro ao cadastrar:", error);
        Alert.alert("Erro", "Não foi possível cadastrar a transação.");
      }
    }

    setLoading(false);
    setSelectedTransaction(null);
    setInitialLoadDone(false); // Reset to allow fresh data load
    await loadData(true);
  };

  async function handleUploadComprovante() {
    setLoading(true);
    const url = await pickAndUploadImage();
    if (!url) {
      setLoading(false);
      return;
    }


    if (selectedTransaction) {

      const updatedTransaction = { ...selectedTransaction, imagem: url };
      setSelectedTransaction(updatedTransaction);

      if (updatedTransaction.id) {

        try {
          await updateTransacao(updatedTransaction);
          // Trigger dashboard refresh when receipt is uploaded
          triggerDashboardRefresh();
          setInitialLoadDone(false); // Reset to allow fresh data load
          loadData(true);
          Alert.alert("Sucesso", "Comprovante cadastrado com sucesso!");
        } catch (error) {
          console.error("Erro ao atualizar:", error);
          Alert.alert("Erro", "Não foi possível atualizar a transação.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        Alert.alert("Sucesso", "Comprovante carregado com sucesso!");
      }
    }
  }


  function confirmDelete(transacao: Transacao) {
    Alert.alert(
      "Confirmar exclusão",
      "Deseja realmente excluir esta transação?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => handleDeleteTransaction(transacao) }
      ]
    );
  }

  async function handleDeleteTransaction(transacao: Transacao) {
    try {
      setLoading(true);
      await deleteTransacao(transacao.id!);
      if (transacao.imagem) {
        await deleteImageByUrl(transacao.imagem);
      }
      // Trigger dashboard refresh when transaction is deleted
      triggerDashboardRefresh();
      setSelectedTransaction(null);
      setInitialLoadDone(false); // Reset to allow fresh data load
      loadData(true);
      setLoading(false);
      Alert.alert("Sucesso", "Transação excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir:", error);
      Alert.alert("Erro", "Não foi possível excluir a transação.");
    }
  }

  function confirmDeleteComprovante(transacao: Transacao) {
    Alert.alert(
      "Confirmar exclusão",
      "Deseja realmente excluir este comprovante?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => handleDeleteComprovante(transacao) }
      ]
    );
  }

  async function handleDeleteComprovante(transacao: Transacao) {
    try {
      if (transacao && transacao.imagem) {
        await deleteImageByUrl(transacao.imagem);
        setSelectedImagem(undefined);
        const updatedTransaction = { ...transacao, imagem: "" };
        setSelectedTransaction(updatedTransaction);
        if (updatedTransaction.id) {
          await updateTransacao(updatedTransaction);
          // Trigger dashboard refresh when receipt is deleted
          triggerDashboardRefresh();
        }
        Alert.alert("Sucesso", "Comprovante excluído com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
      Alert.alert("Erro", "Não foi possível excluir a comprovante.");
    }
  }

  const newTransaction = () => {
    if (!user) {
      Alert.alert(t('messages.error'), t('transactions.userNotAuthenticated'));
      return;
    }
    setSelectedTransaction({ ...NEW_TRANSACTION, userId: user.uid });
  };

  // Modal helper functions
  const handleCloseModal = () => {
    setSelectedTransaction(null);
    setErrorDescricao(null);
    setErrorValor(null);
  };

  const handleTransactionChange = (field: string, value: any) => {
    setSelectedTransaction((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleUploadReceiptPress = () => {
    if (selectedTransaction?.imagem) {
      setSelectedImagem(selectedTransaction.imagem);
    } else {
      handleUploadComprovante();
    }
  };

  const handleCloseImageModal = () => {
    setSelectedImagem(undefined);
  };

  const handleDeleteReceiptPress = () => {
    if (selectedTransaction) {
      confirmDeleteComprovante(selectedTransaction);
    }
  };

  // Aplica filtro
  const filteredData = data.filter((item) => {
    const matchSearch = item.descricao.toLowerCase().includes(search.toLowerCase());
    const matchTipo = filterTipo ? item.tipo === filterTipo : true;
    return matchSearch && matchTipo;
  });

  const renderItem = ({ item }: { item: Transacao }) => (
    <TransactionCard 
      transaction={item} 
      onPress={setSelectedTransaction}
    />
  );

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { t } = useI18n();

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <PageTitle
        title={t('transactions.title')}
        subtitle={t('transactions.subtitle')}
      />

      {/* Filters */}
      <TransactionFilters
        search={search}
        filterTipo={filterTipo}
        onSearchChange={setSearch}
        onFilterChange={setFilterTipo}
      />

      {/* 📜 Lista com Scroll Infinito */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id ?? ""}
        renderItem={renderItem}
        // ⚠️ Só chama se NÃO estiver carregando e houver mais dados
        onEndReached={() => {
          if (!loading && hasMore) {
            loadData(false);
          }
        }}
        onEndReachedThreshold={0.2}

        // 🆕 NOVO: Indicador de carregamento no rodapé
        ListFooterComponent={
          loading && hasMore ? (
            <ThemedView style={styles.loadingFooter}>
              <ActivityIndicator
                size="small"
                color={colors.primary}
              />
            </ThemedView>
          ) : (
            // Mensagem para quando não há mais dados (opcional)
            <ThemedView style={styles.endMessage}>
              {data.length > 0 && !loading && !hasMore ? (
                <ThemedText type="body2" style={{ textAlign: "center", color: colors.textSecondary }}>
                  Fim da lista
                </ThemedText>
              ) : null}
            </ThemedView>
          )
        }
        // Opcional: Adicionar "Puxar para Atualizar" (Pull-to-Refresh)
        refreshing={loading && data.length === 0} // Mostra o loader de refresh se for o carregamento inicial
        onRefresh={() => {
          setInitialLoadDone(false); // Allow refresh to reset initial load flag
          loadData(true);
        }} // Puxa para recarregar tudo

      />

      {/* Transaction Modal */}
      <TransactionModal
        transaction={selectedTransaction}
        loading={loading}
        errorDescricao={errorDescricao}
        errorValor={errorValor}
        onClose={handleCloseModal}
        onSave={handleSalvar}
        onDelete={confirmDelete}
        onUploadReceipt={handleUploadReceiptPress}
        onTransactionChange={handleTransactionChange}
      />

      {/* Image Modal */}
      <ImageModal
        imageUri={selectedImagem}
        visible={!!selectedImagem}
        onClose={handleCloseImageModal}
        onDeleteReceipt={handleDeleteReceiptPress}
      />

      <FloatingActionButton onPress={newTransaction} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  loadingFooter: {
    paddingVertical: SPACING * 2,
    alignItems: 'center',
  },
  endMessage: {
    paddingVertical: SPACING,
  },
});
