import { useCallback, useState } from "react";
import {
  db,
  likePost as fbLikePost,
  deletePost as fbDeletePost,
} from "./firebase";
import { auth } from "./firebase";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

export default function usePost(initialPost) {
  const [post, setPost] = useState(initialPost);
  const [loading, setLoading] = useState(false);

  const canEdit = !!(
    auth &&
    auth.currentUser &&
    post &&
    auth.currentUser.uid === post.authorId
  );

  const like = useCallback(
    async (toggleOn) => {
      if (!post || !post.id) return;
      setLoading(true);
      try {
        // toggleOn true => +1, false => -1
        const delta = toggleOn ? 1 : -1;
        await fbLikePost(post.id, delta);
        setPost((p) => ({ ...p, likes: (p.likes || 0) + delta }));
      } finally {
        setLoading(false);
      }
    },
    [post]
  );

  const edit = useCallback(
    async (updates) => {
      if (!canEdit) throw new Error("Not authorized to edit this post");
      setLoading(true);
      try {
        const d = doc(db, "posts", post.id);
        await updateDoc(d, {
          ...updates,
          // optional: update updatedAt
          updatedAt: serverTimestamp(),
        });
        setPost((p) => ({ ...p, ...updates }));
      } finally {
        setLoading(false);
      }
    },
    [canEdit, post]
  );

  const remove = useCallback(async () => {
    if (!post || !post.id) return;
    if (!canEdit) throw new Error("Not authorized to delete this post");
    setLoading(true);
    try {
      await fbDeletePost(post.id);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [canEdit, post]);

  const notifyOwner = useCallback(
    async (message = "Someone reacted to your post") => {
      if (!post || !post.id) return;
      if (!auth || !auth.currentUser)
        throw new Error("Must be logged in to notify");
      if (auth.currentUser.uid === post.authorId) {
        // don't notify yourself
        return;
      }

      const payload = {
        toUserId: post.authorId,
        fromUserId: auth.currentUser.uid,
        postId: post.id,
        message,
        createdAt: serverTimestamp(),
        read: false,
      };

      await addDoc(collection(db, "notifications"), payload);
    },
    [post]
  );

  return {
    post,
    setPost,
    loading,
    canEdit,
    like,
    edit,
    remove,
    notifyOwner,
  };
}
