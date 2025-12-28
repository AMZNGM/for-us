"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProfilePopup from "@/components/ProfilePopup";
import NotificationIcon from "@/components/NotificationIcon";
import { auth, db, onAuthChange } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const [openProfile, setOpenProfile] = useState(false);
  const [userState, setUserState] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsub = onAuthChange((u) => setUserState(u));
    return unsub;
  }, []);

  useEffect(() => {
    async function load() {
      if (!userState) return setProfile(null);
      const ref = doc(db, "users", userState.uid);
      const snap = await getDoc(ref);
      setProfile(snap.exists() ? snap.data() : null);
    }
    load();
  }, [userState]);

  return (
    <nav
      className="site-nav text-white"
      style={{ display: "flex", gap: 12, alignItems: "center" }}
    >
      <Link href="/">Home</Link>
      <Link href="/feed">Feed</Link>
      <Link href="/new-post">New Post</Link>
      <Link href="/yassirasart">yassirasart</Link>
      <Link href="/yassirita">yassirita</Link>

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        {userState ? (
          <>
            <NotificationIcon />
            <button
              onClick={() => setOpenProfile((s) => !s)}
              className="px-2 py-1 border rounded flex items-center gap-2"
            >
              {profile?.avatarUrl || userState.photoURL ? (
                <img
                  src={profile?.avatarUrl || userState.photoURL}
                  alt="avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : null}
              <span>
                {userState.displayName
                  ? userState.displayName
                  : userState.email}
              </span>
            </button>
            {openProfile && (
              <div
                className="text-black"
                style={{ position: "absolute", right: 16, top: 56 }}
              >
                <ProfilePopup onClose={() => setOpenProfile(false)} />
              </div>
            )}
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
