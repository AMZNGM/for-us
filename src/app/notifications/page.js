"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, onAuthChange } from "@/lib/firebase";
import {
  fetchNotificationsForUser,
  markNotificationRead,
} from "@/lib/notifications";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    // The real-time listener will automatically update the UI
  }

  const handleNotificationClick = async (notification) => {
    // Mark as read
    await mark(notification.id);

    // Navigate to the post if there's a postId
    if (notification.postId) {
      router.push(`/post/${notification.postId}`);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-8">
        Please <a href="/login">login</a> to view notifications.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Notifications</h1>
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
  );
}
