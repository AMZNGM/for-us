"use client";

import { useEffect, useState, use, useRef } from "react";
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
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import PostSection from "@/components/post-components/PostSection";
import CommentsSection from "@/components/post-components/CommentsSection";
import GlobalModal from "@/components/ui/GlobalModal";

export default function PostPage({ params }) {
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
  const resolvedParams = use(params);
  const postId = resolvedParams.id;
  const canEdit = !!(user && post && user.uid === post.authorId);

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

  if (loading) {
    return (
      <ProtectedRoute>
        <LoadingSkeleton />
      </ProtectedRoute>
    );
  }

  if (error || !post) {
    return (
      <ProtectedRoute>
        <div className="relative w-screen h-screen overflow-hidden bg-text flex justify-center items-center">
          <div className="absolute inset-0 w-full h-full border-8 border-gold max-md:border-4 pointer-events-none z-10" />

          <p className="text-red-600 text-2xl bg-gold rounded-2xl p-4 animate-bounce">
            {error || "Post not found"}
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="relative w-screen min-h-screen overflow-hidden bg-text text-bg">
        <div className="absolute inset-0 w-full h-full border-8 border-gold max-md:border-4 pointer-events-none z-10" />

        <div className="max-w-4xl mx-auto py-8 px-4 max-md:py-22">
          <PostSection
            post={post}
            editing={editing}
            setEditing={setEditing}
            draftTitle={draftTitle}
            setDraftTitle={setDraftTitle}
            draftText={draftText}
            setDraftText={setDraftText}
            draftDate={draftDate}
            setDraftDate={setDraftDate}
            canEdit={canEdit}
            handleSave={handleSave}
            handleDelete={handleDelete}
            handleCommentClick={handleCommentClick}
            setActiveImage={setActiveImage}
          />

          <CommentsSection
            postId={postId}
            comments={comments}
            newComment={newComment}
            setNewComment={setNewComment}
            handleAddComment={handleAddComment}
            handleReplyAdded={handleReplyAdded}
            commentInputRef={commentInputRef}
          />
        </div>
      </div>

      <GlobalModal activeImage={activeImage} setActiveImage={setActiveImage} />
    </ProtectedRoute>
  );
}
