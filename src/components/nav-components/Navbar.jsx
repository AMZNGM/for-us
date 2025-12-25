"use client";

import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="site-nav"
      style={{ display: "flex", gap: 12, alignItems: "center" }}
    >
      <Link href="/">Home</Link>
      <Link href="/yassira's-art">Gallery</Link>
      <Link href="/new-post">New Post</Link>
      <Link href="/login">Login</Link>
    </nav>
  );
}
