import { useState, useEffect } from "react";
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

export function useProfile() {
  const alert = useAlert();
  const [userState, setUserState] = useState(null);
  const [profile, setProfile] = useState({ displayName: "", bio: "" });
  const [posts, setPosts] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange((user) => {
      setUserState(user);
    });
    return unsub;
  }, []);

  // Load user profile and posts
  useEffect(() => {
    async function load() {
      if (!userState) return;

      // Load profile
      const ref = doc(db, "users", userState.uid);
      const snap = await getDoc(ref);
      const profileData = snap.exists()
        ? snap.data()
        : { displayName: userState.displayName || userState.email, bio: "" };
      setProfile(profileData);

      // Set avatar preview
      if (snap.exists() && snap.data().avatarUrl) {
        setPreview(snap.data().avatarUrl);
      } else if (userState.photoURL) {
        setPreview(userState.photoURL);
      }

      // Load posts
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

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Update profile field
  const updateProfileField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // Save profile
  const saveProfile = async () => {
    if (!userState) return;
    setLoading(true);
    try {
      await updateUserProfile({
        user: userState,
        displayName: profile.displayName,
        bio: profile.bio,
        avatarFile,
      });
      alert?.show?.("Profile saved successfully!", "success");
    } catch (err) {
      console.error("Save profile error:", err);
      alert?.show?.(`Failed to save profile: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    userState,
    profile,
    posts,
    preview,
    loading,
    handleAvatarChange,
    updateProfileField,
    saveProfile,
  };
}
