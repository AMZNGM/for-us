"use client";

import React, { useState } from "react";
import PostLikeButton from "@/components/PostLikeButton";
import usePost from "@/lib/usePost";
import { auth } from "@/lib/firebase";
import { useAlert } from "@/lib/AlertContext";

export default function PostCard({ post: initialPost, onOpen }) {
  const { post, like, canEdit, edit, remove, notifyOwner, setPost } =
    usePost(initialPost);
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(post?.title || "");
  const [draftText, setDraftText] = useState(post?.text || "");
  const [liked, setLiked] = useState(false);
  const alertHook = useAlert();

  if (!post) return null;

  const handleLike = async (next) => {
    try {
      await like(next);
      setLiked(next);
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleSave = async () => {
    try {
      await edit({ title: draftTitle, text: draftText });
      setEditing(false);
    } catch (err) {
      console.error("Edit failed", err);
      const { show } = alertHook;
      show && show(`Edit failed: ${err.message || err}`, "error");
    }
  };

  const handleNotify = async () => {
    try {
      await notifyOwner(
        `${
          auth.currentUser?.displayName || auth.currentUser?.email
        } sent a notification about your post`
      );
      const { show } = alertHook;
      show && show("Notified post owner", "success");
    } catch (err) {
      console.error("Notify failed", err);
      const { show } = alertHook;
      show && show("Notify failed", "error");
    }
  };

  return (
    <article
      className="post-card"
      style={{ cursor: onOpen ? "pointer" : "default" }}
    >
      {post.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.imageUrl}
          alt={post.title || "post image"}
          className="post-card__image"
        />
      )}

      <div className="post-card__body">
        {editing ? (
          <div>
            <input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="mb-2 w-full"
            />
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              rows={4}
              className="w-full"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="post-card__title">{post.title}</h3>
            {post.text && <p className="post-card__excerpt">{post.text}</p>}
          </>
        )}

        <div
          className="post-card__meta mt-3"
          style={{ display: "flex", gap: 12, alignItems: "center" }}
        >
          {/* <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <PostPostLikeButton
              postId={post.id}
              initialCount={post.likes || 0}
            />
          </div> */}

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {canEdit && (
              <>
                <button
                  onClick={() => setEditing((s) => !s)}
                  className="px-2 py-1 border rounded"
                >
                  {editing ? "Editing" : "Edit"}
                </button>
                <button
                  onClick={async () => {
                    if (confirm("Delete this post?")) {
                      await remove();
                    }
                  }}
                  className="px-2 py-1 border rounded text-red-600"
                >
                  Delete
                </button>
              </>
            )}

            {/* removed share button; replaced with notify button */}
            <button onClick={handleNotify} className="px-2 py-1 border rounded">
              Notify
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
