"use client";

import React, { useState } from "react";

export default function LikeButton({
  initialCount = 0,
  initialLiked = false,
  onChange,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  function toggle() {
    const next = !liked;
    setLiked(next);
    setCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
    onChange && onChange(next);
  }

  return (
    <button
      aria-pressed={liked}
      onClick={toggle}
      className="like-button"
      style={{ border: "none", background: "transparent", cursor: "pointer" }}
    >
      <span style={{ color: liked ? "crimson" : "inherit", marginRight: 6 }}>
        {liked ? "♥" : "♡"}
      </span>
      <span>{count}</span>
    </button>
  );
}
