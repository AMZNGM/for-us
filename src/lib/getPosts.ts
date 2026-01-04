import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";

interface Post {
  id: string;
  [key: string]: any;
}

export async function getPosts(): Promise<Post[]> {
  const q = query(collection(db, "posts"), orderBy("date", "desc"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
