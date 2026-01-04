"use client";

import { useEffect, useState } from "react";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { auth, db, addLikeDoc, removeLikeDoc } from "@/lib/firebase";
import { createLikeNotification } from "@/lib/notifications";
import { useAlert } from "@/lib/AlertContext";
import HeartParticles from "@/components/ui/HeartParticles";

export default function PostLikeButton({ postId, postAuthorId }) {
  const alert = useAlert();
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);

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
      alert?.show && alert.show("Please login to like", "info");
      return;
    }
    setLoading(true);
    try {
      if (liked) {
        await removeLikeDoc(postId, auth.currentUser.uid);
        alert?.show && alert.show("love removed 💔", "info");
      } else {
        await addLikeDoc(postId, auth.currentUser);
        alert?.show && alert.show("love added! ❣️", "success");

        if (postAuthorId && postAuthorId !== auth.currentUser.uid) {
          try {
            await createLikeNotification(
              postId,
              postAuthorId,
              auth.currentUser
            );
          } catch (notifError) {
            console.error("Failed to create like notification:", notifError);
          }
        }
      }
    } catch (err) {
      console.error("toggle like failed", err);
      alert?.show && alert.show("Failed to update like", "error");
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
    <div className="relative">
      <button
        onClick={toggle}
        disabled={loading}
        className={`rounded-2xl cursor-pointer py-2 px-3 transition-colors ${
          likes.length > 0
            ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30"
            : "bg-main/50 text-red-500 hover:bg-main/50"
        }`}
      >
        <span className={`me-2 ${likes.length > 0 ? "text-red-500" : ""}`}>
          {likes.length > 0 ? "❣️" : "💛"}
        </span>
        <span className="text-sm text-bg">{label}</span>
      </button>
      <HeartParticles active={likes.length > 0} />
    </div>
  );
}
