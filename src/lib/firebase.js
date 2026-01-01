import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  increment,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

const postsCollection = collection(db, "posts");

// Auth helpers
export async function signUpWithEmail(email, password) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

export async function signInWithEmail(email, password) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export function onAuthChange(cb) {
  return onAuthStateChanged(auth, cb);
}

// Storage helper: uploads file and returns download URL
export async function uploadImage(file, path) {
  if (!file) return null;
  const ref = storageRef(storage, path);
  const snap = await uploadBytesResumable(ref, file);
  return getDownloadURL(snap.ref);
}

// Storage helper: uploads file and returns download URL
export async function createPost({
  title,
  text,
  date,
  imageFile,
  authorId,
  authorName,
}) {
  let imageUrl = "";
  if (imageFile) {
    const filename = `${Date.now()}_${imageFile.name}`;
    imageUrl = await uploadImage(imageFile, `posts/${authorId}/${filename}`);
  }

  const docRef = await addDoc(postsCollection, {
    title: title || "",
    text: text || "",
    date: date || null,
    imageUrl: imageUrl || "",
    authorId: authorId || null,
    authorName: authorName || null,
    likes: 0,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getRecentPosts(limitCount = 50) {
  const q = query(
    postsCollection,
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deletePost(postId) {
  const d = doc(db, "posts", postId);
  return deleteDoc(d);
}

export async function likePost(postId, delta = 1) {
  const d = doc(db, "posts", postId);
  return updateDoc(d, { likes: increment(delta) });
}

// Comments helpers
export async function updateComment(postId, commentId, updates) {
  const d = doc(db, "posts", postId, "comments", commentId);
  return updateDoc(d, { ...updates });
}

export async function deleteComment(postId, commentId) {
  const d = doc(db, "posts", postId, "comments", commentId);
  return deleteDoc(d);
}

// Likes under comments: posts/{postId}/comments/{commentId}/likes/{userId}
export async function addCommentLikeDoc(postId, commentId, user) {
  if (!user || !user.uid) throw new Error("Not authenticated");
  const likeRef = doc(
    db,
    "posts",
    postId,
    "comments",
    commentId,
    "likes",
    user.uid
  );
  await setDoc(likeRef, {
    userId: user.uid,
    name: user.displayName || user.email || null,
    createdAt: serverTimestamp(),
  });
}

export async function removeCommentLikeDoc(postId, commentId, userId) {
  const likeRef = doc(
    db,
    "posts",
    postId,
    "comments",
    commentId,
    "likes",
    userId
  );
  return deleteDoc(likeRef);
}

export async function fetchCommentLikes(postId, commentId) {
  const likesCol = collection(
    db,
    "posts",
    postId,
    "comments",
    commentId,
    "likes"
  );
  const snap = await getDocs(likesCol);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Likes subcollection helpers (posts/{postId}/likes/{userId})
export async function addLikeDoc(postId, user) {
  if (!user || !user.uid) throw new Error("Not authenticated");
  const likeRef = doc(db, "posts", postId, "likes", user.uid);
  await setDoc(likeRef, {
    userId: user.uid,
    name: user.displayName || user.email || null,
    createdAt: serverTimestamp(),
  });
}

export async function removeLikeDoc(postId, userId) {
  const likeRef = doc(db, "posts", postId, "likes", userId);
  return deleteDoc(likeRef);
}

export async function fetchLikes(postId) {
  const likesCol = collection(db, "posts", postId, "likes");
  const snap = await getDocs(likesCol);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Upload avatar specifically (convenience wrapper)
export async function uploadAvatar(file, userId) {
  if (!file) return null;
  const filename = `${Date.now()}_${file.name}`;
  return uploadImage(file, `avatars/${userId}/${filename}`);
}

// Update user profile (users collection + optional auth profile)
export async function updateUserProfile({
  user,
  displayName,
  bio,
  avatarFile,
}) {
  if (!user || !user.uid) throw new Error("Not authenticated");
  let avatarUrl = null;
  if (avatarFile) {
    avatarUrl = await uploadAvatar(avatarFile, user.uid);
  }

  const ref = doc(db, "users", user.uid);
  const data = {
    ...(displayName !== undefined ? { displayName } : {}),
    ...(bio !== undefined ? { bio } : {}),
    ...(avatarUrl ? { avatarUrl } : {}),
  };

  await setDoc(ref, data, { merge: true });

  // try update auth profile as well
  try {
    await updateProfile(auth.currentUser, {
      displayName: displayName || auth.currentUser.displayName,
      photoURL: avatarUrl || auth.currentUser.photoURL || null,
    });
  } catch (e) {
    // ignore auth update failures
  }

  return { ...data };
}

export default app;
