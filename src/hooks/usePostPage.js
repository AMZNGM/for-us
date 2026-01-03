import { useEffect, useState, useRef } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { deletePost } from "@/lib/deletePost";
import { useAlert } from "@/lib/AlertContext";

export function usePostPage(postId) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editing, setEditing] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDate, setDraftDate] = useState("");
  const [activeImage, setActiveImage] = useState(null);
  const commentInputRef = useRef(null);
  const alert = useAlert();
  const user = auth.currentUser;
  const canEdit = !!(user && post && user.uid === post.authorId);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = doc(db, "posts", postId);
        const postSnapshot = await getDoc(postDoc);

        if (postSnapshot.exists()) {
          const postData = { id: postSnapshot.id, ...postSnapshot.data() };
          setPost(postData);
          setDraftTitle(postData.title || "");
          setDraftText(postData.text || "");
        } else {
          setError("Post not found");
        }
      } catch (err) {
        setError("Failed to load post");
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // Real-time comments subscription
  useEffect(() => {
    const commentsQuery = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    });

    return unsubscribe;
  }, [postId]);

  const handleCommentClick = () => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        text: newComment.trim(),
        authorId: auth.currentUser.uid,
        authorEmail: auth.currentUser.email,
        authorName: auth.currentUser.displayName || auth.currentUser.email,
        authorAvatar: auth.currentUser.photoURL,
        createdAt: Timestamp.now(),
      });

      if (post && post.authorId && post.authorId !== auth.currentUser.uid) {
        try {
          const { createCommentNotification } = await import(
            "@/lib/notifications"
          );
          await createCommentNotification(
            postId,
            post.authorId,
            auth.currentUser
          );
        } catch (notifError) {
          console.error("Failed to create comment notification:", notifError);
        }
      }

      setNewComment("");
      alert?.show && alert.show("Comment added successfully! 🚨", "success");
    } catch (err) {
      console.error("Error adding comment:", err);
      const { show } = alert;
      show && show("Failed to add comment", "error");
    }
  };

  const handleSave = async () => {
    if (!canEdit) {
      const { show } = alert;
      show && show("Not authorized to edit this post", "error");
      return;
    }

    try {
      const postDoc = doc(db, "posts", post.id);
      await updateDoc(postDoc, {
        title: draftTitle,
        text: draftText,
        date: draftDate,
        updatedAt: serverTimestamp(),
      });

      setPost((prev) => ({
        ...prev,
        title: draftTitle,
        text: draftText,
        date: draftDate,
      }));
      setEditing(false);
    } catch (err) {
      console.error("Edit failed", err);
      const { show } = alert;
      show && show(`Edit failed: ${err.message || err}`, "error");
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Delete this post?");
    if (!confirm) return;

    await deletePost(post.id);
  };

  const handleReplyAdded = () => {};

  return {
    // State
    loading,
    error,
    post,
    comments,
    newComment,
    editing,
    draftText,
    draftTitle,
    draftDate,
    activeImage,
    commentInputRef,
    user,
    canEdit,

    // Actions
    setNewComment,
    setEditing,
    setDraftText,
    setDraftTitle,
    setDraftDate,
    setActiveImage,
    handleCommentClick,
    handleAddComment,
    handleSave,
    handleDelete,
    handleReplyAdded,
  };
}
