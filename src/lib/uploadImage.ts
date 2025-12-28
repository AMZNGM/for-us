import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export const uploadImage = async (
  file: File,
  userId: string
): Promise<string> => {
  const imageRef = ref(storage, `posts/${userId}/${Date.now()}-${file.name}`);

  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
};
