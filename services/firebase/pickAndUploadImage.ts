import * as ImagePicker from "expo-image-picker";
//import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getStorage } from "firebase/storage";
import app from "../../config/firebase";

const storage = getStorage(app);

export async function pickAndUploadImage(): Promise<string | null> {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permissão para acessar a galeria é necessária!");
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return null;

    return "https://picsum.photos/40";
    // const asset = result.assets[0];
    // const uri = asset.uri;

    // // nome único
    // const safeName = (asset.fileName || "upload").replace(/\s+/g, "_");
    // const filename = `images/${Date.now()}-${safeName}`;
    // const storageRef = ref(storage, filename);

    // // no React Native, fetch(uri).blob() funciona melhor que tentar ArrayBuffer
    // const response = await fetch(uri);
    // const blob = await response.blob();

    // await uploadBytes(storageRef, blob);
    // const downloadUrl = await getDownloadURL(storageRef);

    // return downloadUrl;
  } catch (error) {
    console.error("Erro ao carregar imagem:", error);
    return null;
  }
}
