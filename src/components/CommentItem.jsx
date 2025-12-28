"use client";

import React, { useState } from "react";
import { auth, updateComment, deleteComment } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CommentLikeButton from "./CommentLikeButton";
import { createReplyNotification } from "@/lib/notifications";
import { useAlert } from "@/lib/AlertContext";

export default function CommentItem({ postId, comment, onReplyAdded }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.text || "");
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const canEdit = !!(
    auth.currentUser &&
    comment &&
    auth.currentUser.uid === comment.authorId
  );
  const alertHook = useAlert();

  async function save() {
    try {
      await updateComment(postId, comment.id, { text });
      setEditing(false);
    } catch (err) {
      console.error("update comment", err);
      const { show } = alertHook;
      show && show("Failed to save comment", "error");
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this comment?")) return;
    try {
      await deleteComment(postId, comment.id);
    } catch (err) {
      console.error("delete comment", err);
      const { show } = alertHook;
      show && show("Failed to delete comment", "error");
    }
  }

  async function handleReply(e) {
    e.preventDefault();
    if (!replyText.trim() || !auth.currentUser) return;

    try {
      // Create reply as a subcomment
      await addDoc(collection(db, "posts", postId, "comments"), {
        text: replyText.trim(),
        authorId: auth.currentUser.uid,
        authorEmail: auth.currentUser.email,
        authorName: auth.currentUser.displayName || auth.currentUser.email,
        createdAt: Timestamp.now(),
        parentCommentId: comment.id, // Link to parent comment
      });

      // Create notification for parent comment author (if not replying to own comment)
      if (comment.authorId && comment.authorId !== auth.currentUser.uid) {
        try {
          await createReplyNotification(
            postId,
            comment.authorId,
            auth.currentUser
          );
        } catch (notifError) {
          console.error("Failed to create reply notification:", notifError);
          // Don't fail the reply operation if notification fails
        }
      }

      setReplyText("");
      setReplying(false);

      // Callback to refresh comments
      if (onReplyAdded) {
        onReplyAdded();
      }
    } catch (err) {
      console.error("Error adding reply:", err);
      const { show } = alertHook;
      show && show("Failed to add reply", "error");
    }
  }

  return (
    <div className="flex space-x-3">
      <div className="w-8 h-8 bg-gray-300 rounded-full shrink-0"></div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium text-gray-900">
              {comment.authorName || comment.authorEmail || "Anonymous"}
            </p>
            {editing ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
              />
            ) : (
              <p className="text-gray-800">{comment.text}</p>
            )}
          </div>
          <div className="ml-4 flex flex-col items-end gap-2">
            <CommentLikeButton
              postId={postId}
              commentId={comment.id}
              commentAuthorId={comment.authorId}
            />
            <button
              onClick={() => setReplying(!replying)}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              {replying ? "Cancel" : "Reply"}
            </button>
            {canEdit && (
              <div className="flex flex-col gap-1">
                {editing ? (
                  <button onClick={save} className="text-sm text-green-500">
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-sm text-blue-500"
                  >
                    Edit
                  </button>
                )}
                <button onClick={handleDelete} className="text-sm text-red-500">
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {comment.createdAt?.toDate
            ? comment.createdAt.toDate().toLocaleString()
            : ""}
        </p>

        {/* Reply Form */}
        {replying && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <form onSubmit={handleReply} className="space-y-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                rows={2}
                placeholder="Write a reply..."
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Reply
                </button>
                <button
                  type="button"
                  onClick={() => setReplying(false)}
                  className="px-3 py-1 border text-sm rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
