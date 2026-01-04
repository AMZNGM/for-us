import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useCommentCount(postId) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!postId) return;

    const commentsQuery = query(collection(db, "posts", postId, "comments"));

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      setCount(snapshot.size);
    });

    return unsubscribe;
  }, [postId]);

  return count;
}
