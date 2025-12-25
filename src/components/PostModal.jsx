"use client";

import React from "react";

export default function PostModal({ post, onClose }) {
  if (!post) return null;

  return (
    <div
      className="post-modal__overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="post-modal"
        style={{
          background: "#fff",
          padding: "1rem",
          maxWidth: 800,
          width: "90%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>{post.title}</h2>
          <button onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>
        {post.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image}
            alt={post.title}
            style={{ width: "100%", height: "auto", marginTop: 8 }}
          />
        )}
        <section style={{ marginTop: 12 }}>
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p>{post.excerpt}</p>
          )}
        </section>
      </div>
    </div>
  );
}
