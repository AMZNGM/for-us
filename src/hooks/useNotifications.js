import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, onAuthChange } from "@/lib/firebase";
import { markNotificationRead } from "@/lib/notifications";

export function useNotifications() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth state management and notifications setup
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        setupNotificationsListener(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const setupNotificationsListener = (userId) => {
    const notificationsQuery = query(
      collection(db, "notifications"),
      where("toUserId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const notificationsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(notificationsData);
      },
      (error) => {
        console.error("Error listening to notifications:", error);
      }
    );

    return unsubscribe;
  };

  const markNotification = async (id) => {
    await markNotificationRead(id);
  };

  const markAllRead = async () => {
    const unreadNotifications = items.filter((item) => !item.read);
    await Promise.all(
      unreadNotifications.map((item) => markNotificationRead(item.id))
    );
  };

  const handleNotificationClick = async (notification) => {
    await markNotification(notification.id);

    if (notification.postId) {
      router.push(`/post/${notification.postId}`);
    }
  };

  return {
    // State
    items,
    user,
    loading,

    // Actions
    markNotification,
    markAllRead,
    handleNotificationClick,
  };
}
