import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

const notificationsCollection = collection(db, "notifications");

export async function createNotification({
  toUserId,
  fromUserId,
  postId,
  message,
}) {
  if (!toUserId || !fromUserId)
    throw new Error("toUserId and fromUserId required");

  // Don't create notification if user is notifying themselves
  if (toUserId === fromUserId) return null;

  const payload = {
    toUserId,
    fromUserId,
    postId: postId || null,
    message: message || "",
    read: false,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(notificationsCollection, payload);
  return ref.id;
}

export async function fetchNotificationsForUser(userId, limitCount = 50) {
  const q = query(
    collection(db, "notifications"),
    where("toUserId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function markNotificationRead(notificationId) {
  const d = doc(db, "notifications", notificationId);
  await updateDoc(d, { read: true });
}

export async function markAllReadForUser(userId) {
  const notes = await fetchNotificationsForUser(userId);
  await Promise.all(
    notes.map((n) => updateDoc(doc(db, "notifications", n.id), { read: true }))
  );
}

// Helper functions for specific notification types
export async function createLikeNotification(postId, postAuthorId, likerUser) {
  return createNotification({
    toUserId: postAuthorId,
    fromUserId: likerUser.uid,
    postId: postId,
    message: `${likerUser.displayName || likerUser.email} liked your post`,
  });
}

export async function createCommentNotification(
  postId,
  postAuthorId,
  commenterUser
) {
  return createNotification({
    toUserId: postAuthorId,
    fromUserId: commenterUser.uid,
    postId: postId,
    message: `${
      commenterUser.displayName || commenterUser.email
    } commented on your post`,
  });
}

export async function createCommentLikeNotification(
  postId,
  commentAuthorId,
  likerUser
) {
  return createNotification({
    toUserId: commentAuthorId,
    fromUserId: likerUser.uid,
    postId: postId,
    message: `${likerUser.displayName || likerUser.email} liked your comment`,
  });
}

export async function createReplyNotification(
  postId,
  parentCommentAuthorId,
  replierUser
) {
  return createNotification({
    toUserId: parentCommentAuthorId,
    fromUserId: replierUser.uid,
    postId: postId,
    message: `${
      replierUser.displayName || replierUser.email
    } replied to your comment`,
  });
}

export async function createPostNotification(postAuthorUser) {
  // This would notify followers when someone creates a post
  // For now, we'll skip this as there's no follow system
  return null;
}

export default {
  createNotification,
  fetchNotificationsForUser,
  markNotificationRead,
  markAllReadForUser,
  createLikeNotification,
  createCommentNotification,
  createPostNotification,
};
