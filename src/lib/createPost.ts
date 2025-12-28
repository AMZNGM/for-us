import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface User {
  uid: string;
  email: string;
}

interface CreatePostData {
  title: string;
  text: string;
  imageUrl?: string;
  user: User;
}

export const createPost = async ({
  title,
  text,
  imageUrl,
  user,
}: CreatePostData): Promise<string> => {
  const docRef = await addDoc(collection(db, "posts"), {
    title,
    text,
    imageUrl: imageUrl || "",
    authorId: user.uid,
    authorEmail: user.email,
    createdAt: Timestamp.now(),
    likes: 0,
  });
  return docRef.id;
};
