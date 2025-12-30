"use client";

import React, { useEffect, useState } from "react";
import { auth, db, updateUserProfile } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useAlert } from "@/lib/AlertContext";

export default function ProfilePopup({ onClose }) {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ displayName: "", bio: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) return setLoading(false);
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (mounted) {
        if (snap.exists()) {
          const data = snap.data();
          setProfile({ ...profile, ...data });
          if (data.avatarUrl) setPreview(data.avatarUrl);
        } else {
          setProfile({ displayName: user.displayName || "", bio: "" });
          if (user.photoURL) setPreview(user.photoURL);
        }
        setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const alertHook = useAlert();

  async function save(e) {
    e && e.preventDefault();
    if (!user)
      return (
        alertHook?.show &&
        alertHook.show("You must be logged in to update profile", "info")
      );
    setLoading(true);
    try {
      await updateUserProfile({
        user: user,
        displayName: profile.displayName,
        bio: profile.bio,
        avatarFile: avatarFile,
      });
      alertHook?.show && alertHook.show("Profile saved", "success");
      onClose && onClose();
    } catch (err) {
      console.error("save profile error:", err);
      console.error("Error details:", err.code, err.message);
      alertHook?.show &&
        alertHook.show(
          `Failed to save profile: ${err.message || err}`,
          "error"
        );
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="profile-popup p-4 bg-white shadow rounded">
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
    <div className="absolute bottom-18 right-0 bg-bg text-text shadow-2xl rounded-2xl w-80 p-4">
      <h3 className="text-lg font-semibold">Edit profile</h3>
      <Link href="/profile">Profile</Link>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <form onSubmit={save} className="space-y-3 mt-3">
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-sm">Avatar</label>
              <div className="mt-2">
                {preview ? (
                  <img
                    src={preview}
                    alt="avatar"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    ?
                  </div>
                )}
              </div>
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files && e.target.files[0];
                  setAvatarFile(f || null);
                  if (f) setPreview(URL.createObjectURL(f));
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm">Display name</label>
            <input
              value={profile.displayName}
              onChange={(e) =>
                setProfile((p) => ({ ...p, displayName: e.target.value }))
              }
              className="w-full px-2 py-1 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) =>
                setProfile((p) => ({ ...p, bio: e.target.value }))
              }
              className="w-full px-2 py-1 border rounded"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1 bg-indigo-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
