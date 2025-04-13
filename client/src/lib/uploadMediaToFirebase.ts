import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function uploadMedia(file: File, userId: string): Promise<string> {
  try {
    const path = `users/${userId}/social-media/${file.name}`;
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error("Error uploading media to Firebase:", error);
    throw new Error("Failed to upload media");
  }
}