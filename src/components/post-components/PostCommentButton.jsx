"use client";

import { useAlert } from "@/lib/AlertContext";

export default function PostCommentButton({ onCommentClick }) {
  const alert = useAlert();

  const handleClick = () => {
    if (!onCommentClick) return;
    onCommentClick();
  };

  return (
    <button
      onClick={handleClick}
      className="bg-main/15 rounded-2xl cursor-pointer py-2 px-3 hover:bg-main/50 transition-colors"
    >
      💬 Comment
    </button>
  );
}
