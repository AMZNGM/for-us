"use client";

import React, { useEffect, useState } from "react";
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
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  async function mark(id) {
    await markNotificationRead(id);
  }

  async function markAllRead() {
    const unreadNotifications = items.filter((item) => !item.read);
    await Promise.all(
      unreadNotifications.map((item) => markNotificationRead(item.id))
    );
  }

  const handleNotificationClick = async (notification) => {
    await mark(notification.id);

    if (notification.postId) {
      router.push(`/post/${notification.postId}`);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <LoadingSkeleton />
      </ProtectedRoute>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        Please <a href="/login">login</a> to view notifications.
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="relative w-screen min-h-screen overflow-hidden bg-text text-bg">
        <div className="absolute inset-0 w-full h-full border-8 border-gold max-md:border-4 pointer-events-none z-10" />

        <div className="max-w-4xl mx-auto py-8 px-4 max-md:py-22">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Notifications</h1>
            {items.some((item) => !item.read) && (
              <button
                onClick={markAllRead}
                className="bg-gold/15 text-gold rounded-2xl cursor-pointer py-2 px-4 hover:bg-gold/50 transition-colors"
              >
                Mark All Read
              </button>
            )}
          </div>
          <div className="mt-4 space-y-3">
            {items.length === 0 && (
              <div className="text-sm text-gray-600">No notifications</div>
            )}
            {items.map((it) => (
              <div
                key={it.id}
                className={`p-3 shadow rounded flex justify-between items-center cursor-pointer transition-colors ${
                  it.read ? "bg-white" : "bg-blue-50 border border-blue-200"
                } hover:bg-gray-50`}
                onClick={() => handleNotificationClick(it)}
              >
                <div className="flex-1">
                  <div
                    className={`font-medium ${!it.read ? "text-blue-900" : ""}`}
                  >
                    {it.message}
                  </div>
                  <div className="text-xs text-gray-500">
                    {it.createdAt?.toDate
                      ? it.createdAt.toDate().toLocaleString()
                      : ""}
                  </div>
                </div>
                <div className="ml-4">
                  {!it.read ? (
                    <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                  ) : (
                    <span className="text-sm text-gray-400">Read</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
