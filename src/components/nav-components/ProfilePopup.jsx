"use client";

import { motion } from "motion/react";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import CloseBtn from "@/components/ui/buttons/CloseBtn";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export default function ProfilePopup({ onClose, dockSettings, isVisible }) {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ displayName: "", bio: "" });
  const [postsCount, setPostsCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) return setLoading(false);

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      const q = query(
        collection(db, "posts"),
        where("authorId", "==", user.uid)
      );
      const snapPosts = await getDocs(q);

      if (mounted) {
        if (snap.exists()) {
          const data = snap.data();
          setProfile({
            displayName: data.displayName || "",
            bio: data.bio || "",
          });
          setAvatarUrl(data.avatarUrl || user.photoURL);
        } else {
          setProfile({ displayName: user.displayName || "", bio: "" });
          setAvatarUrl(user.photoURL);
        }
        setPostsCount(snapPosts.size);
        setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [user]);

  if (!user) {
    return (
      <div className="bg-text rounded-2xl shadow-2xl p-4">
        <p>
          Please <a href="/login">login</a> to edit your profile.
        </p>
        <div className="mt-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y:
          dockSettings.position === "bottom"
            ? isVisible
              ? 0
              : 100
            : isVisible
            ? 0
            : -100,
      }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`absolute right-1/2 w-80 bg-bg/95 rounded-2xl shadow-2xl border border-main/10 z-50 ${
        dockSettings.position === "bottom" ? "bottom-18" : "top-18"
      }`}
    >
      {loading ? (
        <div className="bg-main rounded-2xl shadow-2xl z-50 p-4">
          <div className="text-center text-gray-500">Loading...</div>
          <LoadingSkeleton className="w-full! h-full! z-50" />
        </div>
      ) : (
        <>
          <div className="space-y-4 p-4">
            <h3 className="text-xl font-bold text-text">Profile</h3>

            <CloseBtn onClick={onClose} />

            <div className="flex items-center gap-4">
              <div>
                {avatarUrl ? (
                  <Link
                    href="/profile"
                    className="flex justify-center items-center"
                  >
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      className="w-16 h-16 border rounded-full object-cover"
                    />
                  </Link>
                ) : (
                  <div className="w-16 h-16 bg-main rounded-full flex items-center justify-center">
                    <span className="text-bg/75 text-4xl">?</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-text">
                  {profile.displayName}
                </h4>
                <p className="text-sm text-text/50">{postsCount} posts</p>
              </div>
            </div>

            {profile.bio && (
              <div>
                <p className="text-sm text-text/75 line-clamp-3">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
