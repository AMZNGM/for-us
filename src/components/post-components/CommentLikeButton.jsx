"use client";

import { useEffect, useState } from "react";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import {
  auth,
  db,
  addCommentLikeDoc,
  removeCommentLikeDoc,
} from "@/lib/firebase";
import { createCommentLikeNotification } from "@/lib/notifications";
import { useAlert } from "@/lib/AlertContext";

export default function CommentLikeButton({
  postId,
  commentId,
  commentAuthorId,
}) {
  const alert = useAlert();
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);

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
      const { show } = alert;
      show && show("Please login to like", "info");
      return;
    }
    setLoading(true);
    try {
      if (liked) {
        await removeCommentLikeDoc(postId, commentId, auth.currentUser.uid);
        alert?.show && alert.show("Comment like removed! 💔", "info");
      } else {
        await addCommentLikeDoc(postId, commentId, auth.currentUser);
        alert?.show && alert.show("Comment liked! ❤️", "success");

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
          }
        }
      }
    } catch (err) {
      console.error("toggle comment like failed", err);
      const { show } = alert;
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
      className={`flex justify-center items-center rounded-2xl cursor-pointer transition-colors p-2 ${
        likes.length > 0
          ? "bg-red-500/20 hover:bg-red-500/30 border border-red-500/30"
          : "bg-main/25 hover:bg-main/50"
      }`}
    >
      <span
        className={`me-2 ${likes.length > 0 ? "text-red-500" : "text-red-400"}`}
      >
        {liked ? "♥" : "♡"}
      </span>
      <span className="text-sm text-bg">{label}</span>
    </button>
  );
}
