"use client";

import React, { useEffect, useState } from "react";
import { auth, db, onAuthChange } from "@/lib/firebase";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import PostCard from "@/components/PostCard";

export default function ProfilePage() {
  const [userState, setUserState] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUserState(u);
    });
    return unsub;
  }, []);

  useEffect(() => {
    async function load() {
      if (!userState) return;
      const ref = doc(db, "users", userState.uid);
      const snap = await getDoc(ref);
      setProfile(
        snap.exists()
          ? snap.data()
          : { displayName: userState.displayName || userState.email, bio: "" }
      );

      // load user posts
      const q = query(
        collection(db, "posts"),
        where("authorId", "==", userState.uid),
        orderBy("createdAt", "desc")
      );
      const snapPosts = await getDocs(q);
      setPosts(snapPosts.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    load();
  }, [userState]);

  if (!userState)
    return (
      <div className="p-8">
        Please <a href="/login">login</a> to view your profile.
      </div>
    );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">
          {profile?.displayName || "Profile"}
        </h1>
        <p className="text-sm text-gray-600">{profile?.bio}</p>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">Your posts</h2>
          <div className="mt-4 space-y-4">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
