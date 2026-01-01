"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  fetchNotificationsForUser,
  markNotificationRead,
} from "@/lib/notifications";
import { useAlert } from "@/lib/AlertContext";
import Link from "next/link";

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [previousItems, setPreviousItems] = useState([]);
  const alert = useAlert();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    let mounted = true;
    (async () => {
      const notes = await fetchNotificationsForUser(user.uid);
      if (!mounted) return;
      setItems(notes);
      setCount(notes.filter((n) => !n.read).length);

      // Find new notifications and show alerts for each
      const newNotifications = notes.filter(
        (newNote) => !previousItems.find((oldNote) => oldNote.id === newNote.id)
      );

      // Show alert for each new notification
      newNotifications.forEach((notification) => {
        alert?.show && alert.show(notification.message, "success");
      });

      setPreviousItems(notes);
    })();
    return () => (mounted = false);
  }, [previousItems, alert]);

  async function openAndMark(id) {
    await markNotificationRead(id);
    setItems(items.map((i) => (i.id === id ? { ...i, read: true } : i)));
    setCount(items.filter((i) => !i.read && i.id !== id).length);
    setOpen(true);
  }

  const user = typeof window !== "undefined" ? auth.currentUser : null;
  if (!user) return null;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="px-2 py-1 border rounded"
      >
        🔔 {count > 0 && <span>({count})</span>}
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "110%",
            width: 320,
            background: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            zIndex: 1000,
          }}
        >
          <div style={{ padding: 8 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>Notifications</strong>
              <Link href="/notifications" onClick={() => setOpen(false)}>
                See all
              </Link>
            </div>
            <ul style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
              {items.length === 0 && (
                <li className="text-sm text-gray-600">No notifications</li>
              )}
              {items.slice(0, 10).map((it) => (
                <li
                  key={it.id}
                  style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <div className="text-sm">{it.message}</div>
                      <div className="text-xs text-gray-500">
                        {it.createdAt?.toDate
                          ? it.createdAt.toDate().toLocaleString()
                          : ""}
                      </div>
                    </div>
                    <div>
                      {!it.read ? (
                        <button
                          onClick={() => openAndMark(it.id)}
                          className="px-2 py-1 text-sm border rounded"
                        >
                          Mark
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Read</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
