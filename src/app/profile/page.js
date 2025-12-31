"use client";

import React, { useEffect, useState } from "react";
import { auth, db, onAuthChange, updateUserProfile } from "@/lib/firebase";
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
import { useAlert } from "@/lib/AlertContext";

export default function ProfilePage() {
  const [userState, setUserState] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

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

      if (snap.exists() && snap.data().avatarUrl) {
        setPreview(snap.data().avatarUrl);
      } else if (userState.photoURL) {
        setPreview(userState.photoURL);
      }

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

  async function saveProfile() {
    if (!userState) return;
    setLoading(true);
    try {
      await updateUserProfile({
        user: userState,
        displayName: profile.displayName,
        bio: profile.bio,
        avatarFile: avatarFile,
      });
      const alertHook = useAlert();
      alertHook?.show &&
        alertHook.show("Profile saved successfully!", "success");
    } catch (err) {
      console.error("save profile error:", err);
      const alertHook = useAlert();
      alertHook?.show &&
        alertHook.show(
          `Failed to save profile: ${err.message || err}`,
          "error"
        );
    } finally {
      setLoading(false);
    }
  }

  if (!userState)
    return (
      <div className="p-8">
        Please <a href="/login">login</a> to view your profile.
      </div>
    );

  return (
    <div className="bg-bg text-bg min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">
          {profile?.displayName || "Profile"}
        </h1>
        <div className="mb-6">
          <div className="flex items-center gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Avatar</label>
              <div className="mt-2">
                {preview ? (
                  <img
                    src={preview}
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-2xl">?</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files && e.target.files[0];
                  setAvatarFile(f || null);
                  if (f) setPreview(URL.createObjectURL(f));
                }}
                className="block w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Display name</label>
          <input
            value={profile?.displayName || ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, displayName: e.target.value }))
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            value={profile?.bio || ""}
            onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
            rows={3}
          />
        </div>

        <div className="mb-8">
          <button
            onClick={saveProfile}
            disabled={loading}
            className="px-6 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>

        <p className="text-sm text-gray-300">{profile?.bio}</p>

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
