import PostCard from "@/components/factoftheday-components/PostCard";
import EmptyState from "@/components/ui/EmptyState";

export default function PostsList({
  posts,
  isGridView,
  expandedPosts,
  truncateText,
  onToggleExpand,
}) {
  if (posts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div
      className={
        isGridView
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }
    >
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isGridView={isGridView}
          isExpanded={expandedPosts.has(post.id)}
          onToggleExpand={onToggleExpand}
          truncateText={truncateText}
        />
      ))}
    </div>
  );
}
