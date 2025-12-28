import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const deletePost = async (postId: string) => {
  await deleteDoc(doc(db, "posts", postId));
};
