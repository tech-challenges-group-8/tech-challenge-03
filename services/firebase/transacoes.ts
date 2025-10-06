import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where
} from "firebase/firestore";
import { auth, db } from "../../config/firebase"; // sua config do firebase

export type Transacao = {
  id?: string; // Agora é string pois vem do Firestore
  userId: string;
  tipo: "Deposito" | "Transferencia";
  descricao: string;
  valor: number;
  dataCriacao: string;
  imagem?: string;
};

// 🔹 Pega todas as transações
export async function getTransacoes(): Promise<Transacao[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");

    const q = query(
        collection(db, "transacoes"),
        where("userId", "==", user.uid),
        orderBy("dataCriacao", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data()),
    })) as Transacao[];
}

// 🔹 Adiciona nova transação
export async function addTransacao(transacao: Omit<Transacao, "id">) {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");

    const ref = await addDoc(collection(db, "transacoes"), {
        ...transacao,
        userId: user.uid,
        dataCriacao: new Date().toISOString(),
    });
    return ref.id;
}

// 🔹 Atualiza transação
export async function updateTransacao(transacao: Transacao) {
    if (transacao.id) {
        const ref = doc(db, "transacoes", transacao.id);
        await updateDoc(ref, transacao);
    }else{
        throw new Error("Transacoes nao contem um id para atualizar.");
    }
}

// 🔹 Exclui transação
export async function deleteTransacao(id: string) {
  const ref = doc(db, "transacoes", id);
  await deleteDoc(ref);
}
