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
import { useLoading } from "@/components/loading-components/LoadingContext";

export function useNotifications() {
  const router = useRouter();
  const { addLoadingTask, removeLoadingTask } = useLoading();
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);

  // Auth state management and notifications setup
  useEffect(() => {
    const taskId = "notifications-auth";
    addLoadingTask(taskId);

    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        setupNotificationsListener(currentUser.uid);
      }

      // Remove the auth task after user state is determined
      removeLoadingTask(taskId);
    });

    return () => unsubscribe();
  }, [addLoadingTask, removeLoadingTask]);

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
    const taskId = `mark-read-${id}`;
    addLoadingTask(taskId);

    try {
      await markNotificationRead(id);
    } finally {
      removeLoadingTask(taskId);
    }
  };

  const markAllRead = async () => {
    const taskId = "mark-all-read";
    addLoadingTask(taskId);

    try {
      const unreadNotifications = items.filter((item) => !item.read);
      await Promise.all(
        unreadNotifications.map((item) => markNotificationRead(item.id))
      );
    } finally {
      removeLoadingTask(taskId);
    }
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

    // Actions
    markNotification,
    markAllRead,
    handleNotificationClick,
  };
}
