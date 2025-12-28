"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import NotificationPopup from "./NotificationPopup";

export default function NotificationIcon() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPopup && !event.target.closest(".notification-container")) {
        setShowPopup(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showPopup]);

  return (
    <div className="notification-container relative">
      <button
        onClick={() => setShowPopup(!showPopup)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        title="Notifications"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {showPopup && <NotificationPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
}
