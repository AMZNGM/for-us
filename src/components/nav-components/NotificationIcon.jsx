"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Bell } from "lucide-react";

export default function NotificationIcon() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;

    const notificationsQuery = query(
      collection(db, "notifications"),
      where("toUserId", "==", auth.currentUser.uid),
      where("read", "==", false)
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        setUnreadCount(snapshot.docs.length);
      },
      (error) => {
        console.error("Error listening to unread notifications:", error);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <div className="notification-container relative">
      <div
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-white" strokeWidth={1.5} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>
    </div>
  );
}
