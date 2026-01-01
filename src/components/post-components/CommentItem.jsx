"use client";

import { useState } from "react";
import { auth, updateComment, deleteComment } from "@/lib/firebase";
import { useAlert } from "@/lib/AlertContext";
import CommentLikeButton from "@/components/post-components/CommentLikeButton";

export default function CommentItem({ postId, comment, onReplyClick }) {
  const alert = useAlert();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.text || "");
  const canEdit = !!(
    auth.currentUser &&
    comment &&
    auth.currentUser.uid === comment.authorId
  );

  async function handleSave() {
    try {
      setLoading(true);
      await updateComment(postId, comment.id, { text });
      setEditing(false);
      alert?.show && alert.show("Comment updated successfully! ✏️", "success");
    } catch (err) {
      console.error("update comment", err);
      alert?.show && alert.show("Failed to save comment", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this comment?")) return;
    try {
      await deleteComment(postId, comment.id);
      alert?.show && alert.show("Comment deleted successfully! 🗑️", "success");
    } catch (err) {
      console.error("delete comment", err);
      alert?.show && alert.show("Failed to delete comment", "error");
    }
  }

  return (
    <div className="relative bg-main/25 rounded-2xl shadow-2xs p-4">
      <div className="flex items-center gap-2">
        {comment.authorAvatar ? (
          <img
            src={comment.authorAvatar}
            alt="Author avatar"
            className="w-8 h-8 bg-gray-300 rounded-full object-cover"
            onError={(e) => {
              console.log("Avatar failed to load:", comment.authorAvatar);
              e.target.src = "/images/abdelrahman-avatar.webp";
            }}
          />
        ) : (
          <div className="w-8 h-8 bg-main rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {comment.authorName?.charAt(0)?.toUpperCase() || "A"}
            </span>
          </div>
        )}

        <p className="text-bg font-medium capitalize">
          {comment.authorName || "Hermosa without name here"}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="w-full space-y-2 mt-4">
          {editing ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              placeholder="bebbeeebe, add a comment..."
              className="w-full bg-main/15 border-3 border-bg/10 rounded-md focus:outline-none focus:border-main transition-colors px-3 py-2"
            />
          ) : (
            <p className="text-bg bg-main/15 rounded-2xl p-3">{comment.text}</p>
          )}

          <div className="flex justify-between gap-4">
            <div className="flex gap-4">
              <CommentLikeButton
                postId={postId}
                commentId={comment.id}
                commentAuthorId={comment.authorId}
              />

              <button
                onClick={() => onReplyClick && onReplyClick(comment.id)}
                className="flex justify-center items-center bg-main/25 text-blue-500 hover:text-blue-700 rounded-2xl cursor-pointer hover:bg-main/50 transition-colors p-2"
              >
                Reply
              </button>
            </div>

            {canEdit && (
              <div className="flex gap-4">
                {editing ? (
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`flex justify-center items-center bg-main/25 text-green-500 text-sm hover:text-blue-700 rounded-2xl cursor-pointer hover:bg-main/50 transition-colors p-2 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      "Save"
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex justify-center items-center bg-main/25 text-blue-500 text-sm hover:text-blue-700 rounded-2xl cursor-pointer hover:bg-main/50 transition-colors p-2"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={handleDelete}
                  className="flex justify-center items-center bg-main/25 text-red-500 text-sm hover:text-blue-700 rounded-2xl cursor-pointer hover:bg-main/50 transition-colors p-2"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-bg mt-4">
        {comment.createdAt?.toDate
          ? comment.createdAt.toDate().toLocaleString()
          : ""}
      </p>
    </div>
  );
}
