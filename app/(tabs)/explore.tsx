import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedButton, ThemedInput } from "@/components/ui";
import { ThemedCurrencyInput } from "@/components/ui/ThemedCurrencyInput";
import { ThemedSelect } from "@/components/ui/ThemedSelect";
import { auth } from "@/config/firebase";
import { Colors, SPACING } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { deleteImageByUrl, pickAndUploadImage } from "@/services/firebase/pickAndUploadImage";
import { addTransacao, deleteTransacao, getTransacoesPaginated, Transacao, updateTransacao } from "@/services/firebase/transacoes";
import { formatarData } from "@/utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

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
      } catch (error) {
        console.error("Erro ao atualizar:", error);
        Alert.alert("Erro", "Não foi possível atualizar a transação.");
      }
    } else {
      try {
        await addTransacao(selectedTransaction);
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
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }
    setSelectedTransaction({ ...NEW_TRANSACTION, userId: user.uid });
  };

  // Aplica filtro
  const filteredData = data.filter((item) => {
    const matchSearch = item.descricao.toLowerCase().includes(search.toLowerCase());
    const matchTipo = filterTipo ? item.tipo === filterTipo : true;
    return matchSearch && matchTipo;
  });

  const renderItem = ({ item }: { item: Transacao }) => (
    <TouchableOpacity onPress={() => setSelectedTransaction(item)}>
      <ThemedView style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
        {/* Transaction icon */}
        <ThemedView style={[
          styles.transactionIcon,
          { 
            backgroundColor: item.tipo === "Deposito" ? colors.success + '20' : colors.error + '20'
          }
        ]}>
          <Ionicons 
            name={item.tipo === "Deposito" ? "arrow-down" : "arrow-up"} 
            size={20} 
            color={item.tipo === "Deposito" ? colors.success : colors.error}
          />
        </ThemedView>

        {/* Transaction content */}
        <ThemedView style={styles.transactionContent}>
          <ThemedText type="h2" style={{ color: colors.text }}>{item.descricao}</ThemedText>
          <ThemedText type="body2" style={{ color: colors.textSecondary }}>
            {formatarData(item.dataCriacao)} - {item.tipo}
          </ThemedText>
        </ThemedView>

        {/* Transaction value */}
        <ThemedView style={styles.transactionValue}>
          <ThemedText
            type="body1"
            style={[
              styles.valor,
              { 
                color: item.tipo === "Deposito" ? colors.success : colors.error,
                fontWeight: 'bold'
              }
            ]}
          >
            {item.tipo === "Deposito" ? "+" : "-"}R$ {item.valor.toFixed(2)}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={{ color: colors.text }}>
          Transações
        </ThemedText>
        <ThemedText type="body1" style={{ color: colors.textSecondary, marginTop: 4 }}>
          Gerencie suas transações financeiras
        </ThemedText>
      </ThemedView>

      {/* 🔎 Filtro */}
      <ThemedView style={styles.searchContainer}>
        <ThemedInput
          label=""
          placeholder="Filtrar por descrição..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </ThemedView>

      <ThemedView style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterBtn, 
            { 
              backgroundColor: filterTipo === null ? colors.primary : colors.backgroundLight,
              borderColor: colors.border
            }
          ]}
          onPress={() => setFilterTipo(null)}
        >
          <ThemedText 
            type="body2" 
            style={{ 
              color: filterTipo === null ? colors.background : colors.text 
            }}
          >
            Todos
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
          onPress={() => setFilterTipo("Deposito")}
        >
          <ThemedText 
            type="body2" 
            style={{ 
              color: filterTipo === "Deposito" ? colors.background : colors.text 
            }}
          >
            Depósitos
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
          onPress={() => setFilterTipo("Transferencia")}
        >
          <ThemedText 
            type="body2" 
            style={{ 
              color: filterTipo === "Transferencia" ? colors.background : colors.text 
            }}
          >
            Transferências
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

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

      {/* Modal para visualizar Transacao */}
      <Modal visible={!!selectedTransaction} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          )}
          <ThemedView style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <ThemedView style={[styles.modalContentForm, { backgroundColor: colors.background }]}>
              <ThemedText type="h1" style={{ color: colors.text, marginBottom: SPACING * 2 }}>
                {(selectedTransaction && selectedTransaction.id != null) ? "Editar" : "Cadastrar"} Transação
              </ThemedText>
              <ThemedInput
                label="Descricao"
                placeholder="Informar Descricao"
                value={selectedTransaction?.descricao}
                onChangeText={(text) =>
                  setSelectedTransaction((prev) => prev ? { ...prev, descricao: text } : null)
                }
                error={errorDescricao || ""}
              />
              <ThemedSelect
                label="Tipo de Transação"
                value={selectedTransaction?.tipo || "Deposito"}
                onValueChange={(tipo) =>
                  setSelectedTransaction((prev) =>
                    prev
                      ? {
                        ...prev,
                        tipo: tipo === "Deposito" ? "Deposito" : "Transferencia",
                      }
                      : null
                  )
                }
                options={[
                  { label: "Depósito", value: "Deposito" },
                  { label: "Transferência", value: "Transferencia" },
                ]}
              />

              <ThemedCurrencyInput
                label="Valor"
                value={selectedTransaction?.valor || 0}
                onChangeValue={(valor) =>
                  setSelectedTransaction((prev) => prev ? { ...prev, valor: valor || 0 } : null)
                }
                error={errorValor || ""}
              />

              {
                selectedTransaction?.imagem ?
                  (
                    <TouchableOpacity
                      style={styles.boxVisualizarAnexo}
                      onPress={() => setSelectedImagem(selectedTransaction.imagem)}
                    >
                      <ThemedView style={[styles.boxVisualizarAnexoIcone, { backgroundColor: colors.primary }]}>
                        <Ionicons name="attach" size={40} color="#FFF" style={{ marginRight: 0 }} />
                      </ThemedView>
                      <ThemedText type="body1" style={{ textAlign: "center", color: colors.text }}>
                        Visualizar Comprovante
                      </ThemedText>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.boxVisualizarAnexo}
                      onPress={handleUploadComprovante}
                    >
                      <ThemedView style={[styles.boxVisualizarAnexoIcone, { backgroundColor: colors.primary }]}>
                        <Ionicons name="attach" size={40} color="#FFF" style={{ marginRight: 0 }} />
                      </ThemedView>
                      <ThemedText type="body1" style={{ textAlign: "center", color: colors.text }}>
                        Cadastrar Comprovante
                      </ThemedText>
                    </TouchableOpacity>
                  )
              }
            </ThemedView>

            <ThemedView style={styles.rowModelButton}>
              <ThemedButton
                title="Salvar"
                onPress={handleSalvar}
                variant="primary"
                size="small"
              />

              {selectedTransaction?.id && (
                <ThemedButton
                  title="Excluir"
                  onPress={() => confirmDelete(selectedTransaction!)}
                  variant="delete"
                  size="small"
                />
              )}

              <ThemedButton
                title="Voltar"
                onPress={() => { setSelectedTransaction(null); setErrorDescricao(null); setErrorValor(null); }}
                variant="secondary"
                size="small"
              />
            </ThemedView>
          </ThemedView>
        </View>
      </Modal>

      {/* Modal para visualizar imagem */}
      <Modal visible={!!selectedImagem} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { backgroundColor: colors.background }]}>
            {selectedImagem && (
              <Image
                source={{ uri: selectedImagem }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
            <ThemedView style={styles.imageModalButtons}>
              <ThemedButton
                title="Fechar"
                onPress={() => setSelectedImagem(undefined)}
                variant="secondary"
                size="small"
              />
              <ThemedButton
                title="Excluir Comprovante"
                onPress={() => confirmDeleteComprovante(selectedTransaction!)}
                variant="delete"
                size="small"
              />
            </ThemedView>
          </ThemedView>
        </View>
      </Modal>

      <TouchableOpacity style={[styles.buttonAddTransaction, { backgroundColor: colors.success }]} onPress={newTransaction}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 50, 
  },
  header: {
    padding: SPACING * 2,
    paddingBottom: SPACING,
  },
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
  loadingFooter: {
    paddingVertical: SPACING * 2,
    alignItems: 'center',
  },
  endMessage: {
    paddingVertical: SPACING,
  },
  sectionTitle: {
    marginBottom: SPACING,
  },
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
  // Modal
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowModelButton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING,
    marginTop: SPACING,
  },
  modalImage: { width: "100%", height: "90%", borderRadius: 8 },
  buttonAddTransaction: {
    position: "absolute",
    bottom: SPACING * 3,
    right: SPACING * 3,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // Posiciona sobre todo o modal
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo escuro semi-transparente para focar no spinner
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Garante que o spinner fique acima de todo o conteúdo
  },
  imageModalButtons: {
    flexDirection: 'row',
    gap: SPACING,
    marginTop: SPACING,
  },
});
