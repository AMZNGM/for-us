"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { markNotificationRead } from "@/lib/notifications";

export default function NotificationPopup({
  onClose,
  dockSettings,
  isVisible,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const notificationsQuery = query(
      collection(db, "notifications"),
      where("toUserId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const notificationsData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .slice(0, 5);
        setItems(notificationsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to notifications:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const handleNotificationClick = async (notification) => {
    await markNotificationRead(notification.id);
    onClose();
    if (notification.postId) {
      router.push(`/post/${notification.postId}`);
    }
  };

  const handleMarkAllRead = async () => {
    const unreadNotifications = items.filter((item) => !item.read);
    await Promise.all(
      unreadNotifications.map((item) => markNotificationRead(item.id))
    );
  };

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
      className={`absolute right-1/2 translate-x-18 w-80 bg-text/95 rounded-2xl shadow-2xl border ${
        dockSettings.color === "gold" ? "border-gold/10" : "border-main/10"
      } z-50 p-4 ${
        dockSettings.position === "bottom" ? "bottom-18" : "top-18"
      }`}
    >
      {loading ? (
        <div
          className={`${
            dockSettings.color === "gold" ? "bg-gold" : "bg-main"
          } rounded-2xl shadow-2xl z-50 p-4`}
        >
          <div className="text-center text-gray-500">Loading...</div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-bg font-semibold font-ter">Notifications</h3>
            {items.length > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 rounded-xl overflow-y-auto my-2">
            {items.length === 0 ? (
              <div className="text-bg text-center p-4">No notifications</div>
            ) : (
              items.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-amber-100 transition-colors cursor-pointer p-3 ${
                    notification.read ? "bg-white" : "bg-blue-50"
                  } hover:bg-gray-50`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <p
                        className={`text-sm ${
                          !notification.read
                            ? "font-medium text-blue-900"
                            : "text-gray-900"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.createdAt?.toDate()
                          ? notification.createdAt.toDate().toLocaleString()
                          : ""}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-gray-200 p-2">
              <button
                onClick={() => {
                  onClose();
                  router.push("/notifications");
                }}
                className="w-full text-sm text-center font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
