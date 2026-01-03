"use client";

import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { createReplyNotification } from "@/lib/notifications";
import { useAlert } from "@/lib/AlertContext";
import CommentThread from "@/components/post-components/CommentThread";
import MainBtn from "@/components/ui/buttons/MainBtn";

export default function CommentsSection({
  postId,
  comments,
  newComment,
  setNewComment,
  handleAddComment,
  handleReplyAdded,
  commentInputRef,
}) {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const alert = useAlert();

  const mainComments = comments.filter((comment) => !comment.parentCommentId);

  const handleReplyClick = (commentId) => {
    setReplyingTo(commentId);
    setReplyText("");
  };

  const handleReplySubmit = async (e, parentCommentId) => {
    e.preventDefault();
    if (!replyText.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        text: replyText.trim(),
        authorId: auth.currentUser.uid,
        authorEmail: auth.currentUser.email,
        authorName: auth.currentUser.displayName || auth.currentUser.email,
        authorAvatar: auth.currentUser.photoURL,
        createdAt: Timestamp.now(),
        parentCommentId: parentCommentId,
      });

      const parentComment = comments.find((c) => c.id === parentCommentId);
      if (
        parentComment &&
        parentComment.authorId &&
        parentComment.authorId !== auth.currentUser.uid
      ) {
        try {
          await createReplyNotification(
            postId,
            parentComment.authorId,
            auth.currentUser
          );
        } catch (notifError) {
          console.error("Failed to create reply notification:", notifError);
        }
      }

      setReplyText("");
      setReplyingTo(null);
      alert?.show && alert.show("Reply added successfully! 💬", "success");

      if (handleReplyAdded) {
        handleReplyAdded();
      }
    } catch (err) {
      console.error("Error adding reply:", err);
      alert?.show && alert.show("Failed to add reply", "error");
    }
  };

  return (
    <div className="bg-text shadow rounded-2xl mt-8 p-8 max-md:p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-bg">
          Comments ({comments.length})
        </h3>
      </div>

      <div className="space-y-4 mb-6">
        {mainComments.length === 0 ? (
          <p className="text-bg text-center py-4"></p>
        ) : (
          mainComments.map((comment) => (
            <CommentThread
              key={comment.id}
              postId={postId}
              comment={comment}
              allComments={comments}
              onReplyAdded={handleReplyAdded}
              onReplyClick={handleReplyClick}
              replyingTo={replyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              handleReplySubmit={handleReplySubmit}
              setReplyingTo={setReplyingTo}
              level={0}
            />
          ))
        )}
      </div>

      <div className="border-t border-bg/30 pt-4">
        <form onSubmit={handleAddComment} className="space-y-2">
          <textarea
            ref={commentInputRef}
            onChange={(e) => setNewComment(e.target.value)}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            rows={9}
            required
            value={newComment}
            placeholder="bebbeeebe, Añadir un comentario..."
            className="w-full bg-main/15 border-3 border-bg/10 rounded-2xl focus:outline-none focus:border-main transition-colors px-3 py-2"
          />

          <MainBtn
            type="submit"
            disabled={!newComment.trim()}
            className="font-main rounded-2xl"
          >
            {!newComment.trim()
              ? "Write comment first Hermosa 🫶"
              : "lesgooooooo 🚀 add this comment"}
          </MainBtn>
        </form>
      </div>
    </div>
  );
}
