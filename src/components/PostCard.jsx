"use client";

import React from "react";

export default function PostCard({ post, onOpen }) {
  if (!post) return null;

  return (
    <article
      className="post-card"
      onClick={() => onOpen && onOpen(post)}
      style={{ cursor: "pointer" }}
    >
      {post.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.image}
          alt={post.title || "post image"}
          className="post-card__image"
        />
      )}
      <div className="post-card__body">
        <h3 className="post-card__title">{post.title}</h3>
        {post.excerpt && <p className="post-card__excerpt">{post.excerpt}</p>}
        <div className="post-card__meta">
          {post.author && <span>{post.author}</span>}
        </div>
      </div>
    </article>
  );
}
