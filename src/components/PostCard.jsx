"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { useAlert } from "@/lib/AlertContext";
import usePost from "@/lib/usePost";
import MainBtn from "@/components/ui/buttons/MainBtn";
import RippleEffect from "@/components/ui/effects/RippleEffect";

export default function PostCard({ post: initialPost, index }) {
  const alert = useAlert();
  const { post, edit, remove, notifyOwner } = usePost(initialPost);
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(post?.title || "");
  const [draftText, setDraftText] = useState(post?.text || "");

  if (!post) return null;

  const handleSave = async () => {
    try {
      await edit({ title: draftTitle, text: draftText });
      setEditing(false);
    } catch (err) {
      console.error("Edit failed", err);
      const { show } = alert;
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
      const { show } = alert;
      show && show("notified him dw sir 🚨", "success");
    } catch (err) {
      console.error("Notify failed", err);
      const { show } = alert;
      show && show("Notify failed", "error");
    }
  };

  return (
    <article>
      {editing ? (
        <div className="space-y-4 mt-12">
          <RippleEffect className="w-full">
            <input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="w-full px-3 py-2 bg-text/10 border border-text/20 rounded-lg text-text placeholder-text/50 outline-0"
            />
          </RippleEffect>

          <RippleEffect className="w-full">
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-text/10 border border-text/20 rounded-lg text-text placeholder-text/50 outline-0"
            />
          </RippleEffect>

          <div className="flex items-center gap-2 mt-2">
            <MainBtn onClick={handleSave}>Save</MainBtn>
            <MainBtn onClick={() => setEditing(false)}>Cancel</MainBtn>
          </div>
        </div>
      ) : (
        <>
          <RippleEffect
            onClick={() => setEditing((s) => !s)}
            className="group relative w-full flex flex-col items-center space-y-4 px-3 py-2 bg-text/10 border border-text/20 rounded-2xl text-text placeholder-text/50 outline-0 cursor-pointer"
          >
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title || "post image"}
                className="w-1/4 rounded-2xl mt-2 -mb-6"
              />
            )}

            <div className="w-full h-full bg-gold/20 rounded-2xl mt-12 py-4 px-5">
              <h3 className="text-2xl">{post.title}</h3>
              {post.text && <p className="text-sm">{post.text}</p>}
            </div>

            <span className="absolute top-4 right-4 bg-gold text-bg text-sm font-bold rounded-2xl py-1 px-3 opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all">
              Click To Edit
            </span>

            <span className="absolute top-4 left-4 bg-gold/50 text-bg text-sm font-bold rounded-2xl py-1 px-3">
              {`${index + 1}`}
            </span>
          </RippleEffect>

          <div className="flex justify-end items-center gap-4">
            <MainBtn onClick={handleNotify} className="font-main! mt-2">
              Notify
            </MainBtn>

            <MainBtn
              onClick={async () => {
                if (confirm("Delete this post?")) {
                  await remove();
                }
              }}
              className="font-main! text-red-600 mt-2"
            >
              Delete
            </MainBtn>
          </div>
        </>
      )}
    </article>
  );
}
