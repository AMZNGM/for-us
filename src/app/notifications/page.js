"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { useLoading } from "@/components/loading-components/LoadingContext";
import ProtectedRoute from "@/components/page-components/ProtectedRoute";
import LoadingFlower from "@/components/loading-components/LoadingFlower";
import PageWrapper from "@/components/page-components/PageWrapper";
import EmptyState from "@/components/ui/EmptyState";
import MainBtn from "@/components/ui/buttons/MainBtn";

export default function NotificationsPage() {
  const { isLoading } = useLoading();
  const { items, user, markAllRead, handleNotificationClick } =
    useNotifications();

  const getNotificationEmoji = (message) => {
    if (message.includes("liked")) return "💖";
    if (message.includes("commented")) return "💬";
    if (message.includes("replied")) return "↩️";
    return "📢";
  };

  if (isLoading || user === null) {
    return (
      <ProtectedRoute>
        <LoadingFlower />
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
      <PageWrapper look="bright">
        <div className="relative max-w-4xl mx-auto py-8 px-4 max-md:py-22">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-shadow-lg">
              🔔 Notifications
            </h1>
            <MainBtn
              onClick={markAllRead}
              variant={"ghost"}
              className="text-blue-500! hover:text-text! font-main transition-colors"
            >
              ✅ Mark All Read
            </MainBtn>
          </div>

          <div className="space-y-3 mt-4">
            {items.length === 0 && <EmptyState />}

            {items.map((it) => (
              <div
                key={it.id}
                onClick={() => handleNotificationClick(it)}
                className={`flex justify-between items-center shadow rounded hover:bg-main transition-colors cursor-pointer p-3 ${
                  it.read ? "bg-text" : "bg-blue-50 border border-blue-200"
                }`}
              >
                <div className="flex-1">
                  <div
                    className={`font-medium ${!it.read ? "text-blue-900" : ""}`}
                  >
                    {getNotificationEmoji(it.message)} {it.message}
                  </div>
                  <div className="text-xs text-gray-500">
                    🕒{" "}
                    {it.createdAt?.toDate
                      ? it.createdAt.toDate().toLocaleString()
                      : ""}
                  </div>
                </div>
                <div className="ml-4">
                  {!it.read ? (
                    <span className="text-lg">🔵</span>
                  ) : (
                    <span className="text-sm text-gray-400">✅ Read</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageWrapper>
    </ProtectedRoute>
  );
}
