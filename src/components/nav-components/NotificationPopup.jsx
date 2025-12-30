"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { markNotificationRead } from "@/lib/notifications";

export default function NotificationPopup({ onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const notificationsQuery = query(
      collection(db, "notifications"),
      where("toUserId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
      // Limit to latest 5 notifications for popup
      // Note: We'll handle limiting in the client for now
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const notificationsData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .slice(0, 5); // Limit to 5 most recent
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

  if (loading) {
    return (
      <div className="absolute bottom-18 right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-18 right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {items.length > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          items.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${
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
                    {notification.createdAt?.toDate
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
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => {
              onClose();
              router.push("/notifications");
            }}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}
