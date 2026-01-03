"use client";

import { useFactOfTheDay } from "@/hooks/useFactOfTheDay";
import ProtectedRoute from "@/components/page-components/ProtectedRoute";
import PageWrapper from "@/components/page-components/PageWrapper";
import ViewToggle from "@/components/factoftheday-components/ViewToggle";
import PostsList from "@/components/factoftheday-components/PostsList";

export default function FactOfTheDayPage() {
  const {
    posts,
    expandedPosts,
    isGridView,
    truncateText,
    togglePostExpansion,
    toggleView,
  } = useFactOfTheDay();

  return (
    <ProtectedRoute>
      <PageWrapper>
        <div
          className={`mx-auto py-24 px-4  relative
            ${isGridView ? "max-w-7xl" : "max-w-4xl"}
            `}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl text-main font-sec">Fact of the day</h1>

            <ViewToggle
              isGridView={isGridView}
              onToggle={toggleView}
              postCount={posts.length}
            />
          </div>

          <PostsList
            posts={posts}
            isGridView={isGridView}
            expandedPosts={expandedPosts}
            truncateText={truncateText}
            onToggleExpand={togglePostExpansion}
          />
        </div>
      </PageWrapper>
    </ProtectedRoute>
  );
}
