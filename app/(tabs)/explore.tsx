import { ThemedText } from "@/components/themed-text";
import { ThemedButton, ThemedInput } from "@/components/ui";
import { ThemedCurrencyInput } from "@/components/ui/ThemedCurrencyInput";
import { ThemedSelect } from "@/components/ui/ThemedSelect";
import { Colors, SPACING } from "@/constants/theme";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { pickAndUploadImage } from "@/services/firebase/pickAndUploadImage";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Transacao = {
  id: number;
  tipo: "Deposito" | "Transferencia";
  descricao: string;
  valor: number;
  dataCriacao: string;
  imagem?: string;
};

// 🔹 Mock inicial (poderia vir da API)
const MOCK_DATA: Transacao[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  tipo: i % 2 === 0 ? "Deposito" : "Transferencia",
  descricao: `Transação ${i + 1}`,
  valor: Math.floor(Math.random() * 1000) + 100,
  dataCriacao: "12/12/2024",
  imagem: i === 1 ? "https://picsum.photos/40" : undefined
}));

const NEW_TRANSACTION: Transacao = {
  id: 0,
  tipo: "Deposito",
  descricao: "",
  valor: 0,
  dataCriacao: "12/12/2024"
}

export default function TabTwoScreen() {
  const [data, setData] = useState<Transacao[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorDescricao, setErrorDescricao] = useState<string | null>(null);
  const [errorValor, setErrorValor] = useState<string | null>(null);
  const [filterTipo, setFilterTipo] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transacao | null>(null);
  const [selectedImagem, setSelectedImagem] = useState<string | undefined>(undefined);

  // Carrega + dados (simulando API com paginação)
  const loadMore = useCallback(() => {
    const perPage = 10;
    const nextData = MOCK_DATA.slice((page - 1) * perPage, page * perPage);
    setData((prev) => [...prev, ...nextData]);
    setPage((prev) => prev + 1);
  }, [page]);

  useEffect(() => {
    loadMore();
  }, []);

  const handleSalvar = async () => {
    setLoading(true);
    if(selectedTransaction){
      setTimeout(() => {
        if(selectedTransaction.descricao == null || selectedTransaction.descricao === ""){
          setErrorDescricao("Descricao Obrigatoria!");
          setLoading(false);
          return;
        }else{
          setErrorDescricao(null);
        }

        if(selectedTransaction.valor <= 0){
          setErrorValor("Valor precisa ser maior que zero!");
          setLoading(false);
          return;
        }else{
          setErrorValor(null);
        }

        if(selectedTransaction.id > 0){
          Alert.alert('Success', 'Atualizar');
        }else{
          Alert.alert('Success', 'Cadastrar');
        }

        setLoading(false);
      }, 2000);
    }else{
      Alert.alert('Error', 'Ocorreu um erro ao salvar a');
    }
  };

  async function handleUpload() {
    const url = await pickAndUploadImage();
    if (url) {
      console.log("Imagem salva no Firebase:", url);
      setSelectedTransaction((prev) => prev ? { ...prev, imagem: url || undefined } : null);
    }
  }

  const newTransaction = async () => {
    setSelectedTransaction(NEW_TRANSACTION);
  };

  // Aplica filtro
  const filteredData = data.filter((item) => {
    const matchSearch = item.descricao.toLowerCase().includes(search.toLowerCase());
    const matchTipo = filterTipo ? item.tipo === filterTipo : true;
    return matchSearch && matchTipo;
  });

  const renderItem = ({ item }: { item: Transacao }) => (
    <TouchableOpacity onPress={() => setSelectedTransaction(item)}>
      <View style={styles.card}>
        {/* Primeira linha -> descricao esquerda / tipo direita */}
        <View style={styles.box1}>
          <ThemedText type="h2">{item.descricao}</ThemedText>
          <ThemedText type="body2">{item.dataCriacao} - {item.tipo}</ThemedText>
        </View>

        {/* Segunda linha -> valor direita */}
        <View style={styles.box2}>
          <Text 
            style={[
              styles.valor,
              item.tipo === "Deposito" ? styles.valorPositivo : styles.valorNegativo
            ]}
          >
            R$ {item.valor.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      {/* 🔎 Filtro */}
      <TextInput
        style={styles.input}
        placeholder="Filtrar por descrição..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, filterTipo === null && styles.active]}
          onPress={() => setFilterTipo(null)}
        >
          <Text>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filterTipo === "Deposito" && styles.active]}
          onPress={() => setFilterTipo("Deposito")}
        >
          <Text>Depósitos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filterTipo === "Transferencia" && styles.active]}
          onPress={() => setFilterTipo("Transferencia")}
        >
          <Text>Transferências</Text>
        </TouchableOpacity>
      </View>

      {/* 📜 Lista com Scroll Infinito */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={<Text style={{ textAlign: "center", marginVertical: 10 }}>Carregando...</Text>}
      />
      
      {/* Modal para visualizar Transacao */}
      <Modal visible={!!selectedTransaction} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalContentForm}>
              <ThemedText type="h1">{(selectedTransaction && selectedTransaction.id > 0) ? "Editar" : "Cadastrar"} Transacao</ThemedText>
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
                    <View style={styles.boxVisualizarAnexoIcone}>
                      <Ionicons name="attach" size={40} color="#FFF" style={{ marginRight: 0 }} />  
                    </View>
                    <ThemedText type="body1" style={{ textAlign: "center" }}>Visualizar Comprovante</ThemedText>
                  </TouchableOpacity>
                ):(
                  <TouchableOpacity 
                    style={styles.boxVisualizarAnexo}
                    onPress={handleUpload}
                  >
                    <View style={styles.boxVisualizarAnexoIcone}>
                      <Ionicons name="attach" size={40} color="#FFF" style={{ marginRight: 0 }} />  
                    </View>
                    <ThemedText type="body1" style={{ textAlign: "center" }}>Cadastrar Comprovante</ThemedText>
                  </TouchableOpacity>
                )
              }
            </View>

            <View style={styles.rowModelButton}>
              <ThemedButton
                title="Salvar"
                onPress={handleSalvar}
                variant="primary"
                loading={loading}
                size="small"
              />
              
              <ThemedButton
                title="Voltar"
                onPress={() => {setSelectedTransaction(null); setErrorDescricao(null); setErrorValor(null);}}
                variant="secondary"
                size="small"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para visualizar imagem */}
      <Modal visible={!!selectedImagem} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedImagem && (
              <Image
                source={{ uri: selectedImagem }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
            <ThemedButton
              title="Fechar"
              onPress={() => setSelectedImagem(undefined)}
              variant="secondary"
              size="small"
            />
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={[styles.buttonAddTransaction, { backgroundColor: colors.success }]} onPress={newTransaction}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 55, backgroundColor: "#fff" },
  input: {
    borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 8, marginBottom: 10,
  },
  filterRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  filterBtn: {
    padding: 8, borderWidth: 1, borderRadius: 6, borderColor: "#aaa",
  },
  active: { backgroundColor: "#ddd" },
  sectionTitle: {
    marginBottom: SPACING,
  },
  card: {
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#fafafa",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  box1:{
    width: "70%",
  },
  box2:{
    width: "30%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  valor: {
    fontSize: 16,
    fontWeight: "bold",
    
  },
  valorPositivo: {
    color: "#2a9d8f",
  },
  valorNegativo: {
    color: "#9d2a2aff",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    width: "90%",
    height: "70%",
  },
  modalContentForm:{
    backgroundColor: "#FFF",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "93%",
  },
  boxVisualizarAnexo: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    width: 150,
  },
  boxVisualizarAnexoIcone: {
    backgroundColor: "#555",
    borderRadius: "100%",
    padding: 7
  },
  rowModelButton:{
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 5,
    gap: 10
  },
  modalImage: { width: "100%", height: "90%", borderRadius: 8 },
  buttonAddTransaction: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // sombra Android
  },
});
