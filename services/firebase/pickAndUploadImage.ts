import * as ImagePicker from "expo-image-picker";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../../config/firebase";

const storage = getStorage(app);

export async function pickAndUploadImage(): Promise<string | null> {
  try {
    // 🔸 Solicita permissão para acessar a galeria
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permissão para acessar a galeria é necessária!");
      return null;
    }

    // 🔸 Abre a galeria
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ compatível com SDK atual
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return null;

    const asset = result.assets[0];
    const uri = asset.uri;
    const mimeType = asset.mimeType || "image/jpeg";

    const safeName = (asset.fileName || "upload").replace(/\s+/g, "_");
    const filename = `images/${Date.now()}-${safeName}`;
    const storageRef = ref(storage, filename);

    const response = await fetch(uri);
    const blob = await response.blob();

    // 🔸 Adiciona metadados de tipo MIME
    const metadata = { contentType: mimeType };

    // 🔸 Faz upload pro Firebase
    await uploadBytes(storageRef, blob, metadata);

    const downloadUrl = await getDownloadURL(storageRef);
    console.log("📸 Imagem salva com sucesso:", downloadUrl);
    return downloadUrl;
  } catch (error: any) {
    console.error("❌ Erro ao carregar imagem:", error);
    return null;
  }
}

/**
 * Exclui um arquivo do Firebase Storage usando sua URL de Download completa.
 * @param fileUrl A URL de download completa da imagem a ser excluída.
 * @returns true se a exclusão foi bem-sucedida, false caso contrário.
 */
export async function deleteImageByUrl(fileUrl: string): Promise<boolean> {
  if (!fileUrl) {
      console.error("❌ URL do arquivo não fornecida.");
      return false;
  }

  try {
      // 1. Cria a referência do Storage a partir da URL
      // O Firebase consegue derivar o path (ex: 'images/1234-nome.jpg') a partir da URL de download.
      const fileRef = ref(storage, fileUrl);

      // 2. Executa a exclusão
      await deleteObject(fileRef);

      console.log("✅ Imagem excluída com sucesso:", fileUrl);
      return true;

  } catch (error: any) {
      // Se o erro for 404, o arquivo já foi excluído.
      if (error.code === 'storage/object-not-found') {
          console.warn("⚠️ Arquivo já excluído ou não encontrado no Storage.");
          return true; // Retorna true porque o estado desejado (ausência do arquivo) foi alcançado.
      }
      
      console.error("❌ Erro ao excluir imagem do Storage:", error);
      return false;
  }
}

export async function uploadTestImage() {
  try {
    console.log("storageBucket:", storage.app.options.storageBucket);
    const storageRef = ref(storage, `test/${Date.now()}.txt`);
    const blob = new Blob(["teste de upload"], { type: "text/plain" });
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    console.log("✅ Upload testado com sucesso:", url);
  } catch (error) {
    console.error("❌ Erro no teste de upload:", error);
  }
}