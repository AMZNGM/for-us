// Firebase client helper (modular SDK)
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

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

// Firestore: create post (uploads image if provided)
export async function createPost({
  title,
  text,
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

export { auth, db, storage };

export default app;
