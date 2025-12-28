"use client";

import React, { useEffect, useState } from "react";
import {
  auth,
  db,
  addCommentLikeDoc,
  removeCommentLikeDoc,
} from "@/lib/firebase";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { createCommentLikeNotification } from "@/lib/notifications";
import { useAlert } from "@/lib/AlertContext";

export default function CommentLikeButton({
  postId,
  commentId,
  commentAuthorId,
}) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const alertHook = useAlert();

  useEffect(() => {
    let mounted = true;
    const likesCol = collection(
      db,
      "posts",
      postId,
      "comments",
      commentId,
      "likes"
    );
    const q = query(likesCol, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!mounted) return;
        const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setLikes(arr);
        const uid = auth.currentUser?.uid;
        setLiked(!!arr.find((a) => a.userId === uid));
      },
      (err) => console.error("comment likes onSnapshot error", err)
    );

    return () => {
      mounted = false;
      unsub();
    };
  }, [postId, commentId]);

  async function toggle() {
    if (!auth.currentUser) {
      const { show } = alertHook;
      show && show("Please login to like", "info");
      return;
    }
    setLoading(true);
    try {
      if (liked) {
        await removeCommentLikeDoc(postId, commentId, auth.currentUser.uid);
      } else {
        await addCommentLikeDoc(postId, commentId, auth.currentUser);

        // Create notification for comment author (if not liking own comment)
        if (commentAuthorId && commentAuthorId !== auth.currentUser.uid) {
          try {
            await createCommentLikeNotification(
              postId,
              commentAuthorId,
              auth.currentUser
            );
          } catch (notifError) {
            console.error(
              "Failed to create comment like notification:",
              notifError
            );
            // Don't fail the like operation if notification fails
          }
        }
      }
    } catch (err) {
      console.error("toggle comment like failed", err);
      const { show } = alertHook;
      show && show("Failed to update like", "error");
    } finally {
      setLoading(false);
    }
  }

  const otherCount = likes.length - (liked ? 1 : 0);
  let label = "Like";
  if (liked && likes.length === 1) label = "Liked by you";
  else if (liked && otherCount > 0)
    label = `You and ${otherCount} other${otherCount > 1 ? "s" : ""}`;
  else if (!liked && likes.length === 1)
    label = `Liked by ${likes[0].name || "Someone"}`;
  else if (!liked && likes.length > 1)
    label = `Liked by ${likes[0].name || "Someone"} and ${
      likes.length - 1
    } others`;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="text-sm text-gray-600 hover:text-gray-900"
    >
      <span style={{ marginRight: 6 }}>{liked ? "♥" : "♡"}</span>
      <span>{label}</span>
    </button>
  );
}
