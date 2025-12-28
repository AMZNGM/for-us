"use client";

import React, { useEffect, useState } from "react";
import { auth, db, addLikeDoc, removeLikeDoc } from "@/lib/firebase";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  getDoc,
  doc,
} from "firebase/firestore";
import { createLikeNotification } from "@/lib/notifications";
import { useAlert } from "@/lib/AlertContext";

// PostLikeButton stores likes as documents in posts/{postId}/likes/{userId}
// and shows liker names (e.g. "Liked by NGM" or "You and 2 others").
export default function PostLikeButton({ postId, postAuthorId }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const alertHook = useAlert();

  useEffect(() => {
    let mounted = true;
    const likesCol = collection(db, "posts", postId, "likes");
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
      (err) => {
        console.error("likes onSnapshot error", err);
      }
    );

    return () => {
      mounted = false;
      unsub();
    };
  }, [postId]);

  async function toggle() {
    if (!auth.currentUser) {
      const { show } = alertHook;
      show && show("Please login to like", "info");
      return;
    }
    setLoading(true);
    try {
      if (liked) {
        await removeLikeDoc(postId, auth.currentUser.uid);
      } else {
        await addLikeDoc(postId, auth.currentUser);

        // Create notification for post author (if not liking own post)
        if (postAuthorId && postAuthorId !== auth.currentUser.uid) {
          try {
            await createLikeNotification(
              postId,
              postAuthorId,
              auth.currentUser
            );
          } catch (notifError) {
            console.error("Failed to create like notification:", notifError);
            // Don't fail the like operation if notification fails
          }
        }
      }
    } catch (err) {
      console.error("toggle like failed", err);
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
      className="like-button"
      style={{ border: "none", background: "transparent", cursor: "pointer" }}
    >
      <span style={{ marginRight: 8 }}>{liked ? "♥" : "♡"}</span>
      <span className="text-sm text-gray-700">{label}</span>
    </button>
  );
}
