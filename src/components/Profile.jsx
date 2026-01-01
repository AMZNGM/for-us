"use client";

import { useEffect, useState } from "react";
import { db, onAuthChange, updateUserProfile } from "@/lib/firebase";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { useAlert } from "@/lib/AlertContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingScreen from "@/components/LoadingScreen";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ProfilePostCard from "@/components/post-components/ProfilePostCard";
import MainBtn from "@/components/ui/buttons/MainBtn";

export default function Profile() {
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
      const alert = useAlert();
      alert?.show && alert.show("Profile saved successfully!", "success");
    } catch (err) {
      console.error("save profile error:", err);
      const alert = useAlert();
      alert?.show &&
        alert.show(`Failed to save profile: ${err.message || err}`, "error");
    } finally {
      setLoading(false);
    }
  }

  if (!userState) return;
  <ProtectedRoute>
    <LoadingSkeleton />
  </ProtectedRoute>;

  return (
    <ProtectedRoute>
      <div className="relative w-screen min-h-screen max-w-3xl mx-auto bg-bg text-gold py-32 px-4">
        <LoadingScreen />

        <h1 className="text-2xl mb-4">{profile?.displayName || "Profile"}</h1>

        <div className="flex items-center gap-6 mb-6">
          <div className="mt-2">
            {preview ? (
              <img
                src={preview}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-text/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-text/20 flex items-center justify-center">
                <span className="text-2xl">?</span>
              </div>
            )}
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
              className="block text-sm text-text/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-text/20 file:text-text hover:file:bg-gold cursor-pointer"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            value={profile?.displayName || ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, displayName: e.target.value }))
            }
            className="w-full px-3 py-2 bg-text/10 border border-text/20 rounded-lg text-text placeholder-text/50 outline-0"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            value={profile?.bio || ""}
            onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            className="w-full px-3 py-2 bg-text/10 border border-text/20 rounded-lg text-text placeholder-text/50 outline-0"
            rows={3}
          />
        </div>

        <div className="mb-8">
          <MainBtn onClick={saveProfile} disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </MainBtn>
        </div>

        <section className="my-32">
          <h2 className="text-xl font-semibold mb-8">
            Your have ({posts.length}) Posts
          </h2>
          <div className="space-y-12">
            {posts.map((p, index) => (
              <ProfilePostCard key={p.id} post={p} index={index} />
            ))}
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
