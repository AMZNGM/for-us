import { useRouter } from "next/navigation";
import PostLikeButton from "@/components/post-components/PostLikeButton";
import PostCommentButton from "@/components/post-components/PostCommentButton";
import CommentsCounter from "@/components/post-components/CommentsCounter";
import AuthorInfo from "@/components/factoftheday-components/AuthorInfo";

export default function PostCard({
  post,
  isGridView,
  isExpanded,
  onToggleExpand,
  truncateText,
}) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/post/${post.id}`);
  };

  return (
    <div
      key={post.id}
      onClick={handleCardClick}
      className="bg-text flex flex-col justify-between shadow rounded-2xl hover:shadow-xl transition-shadow overflow-hidden cursor-pointer"
    >
      <div>
        <div className="border-b border-main p-4">
          <AuthorInfo
            authorAvatar={post.authorAvatar}
            authorName={post.authorName}
            authorEmail={post.authorEmail}
            date={post.date}
          />
        </div>

        {post.imageUrl ? (
          <div className={`overflow-hidden ${isGridView ? "h-72" : "h-120"}`}>
            <img
              src={post.imageUrl}
              alt="Post image"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            className={`bg-main text-bg flex justify-center items-center ${
              isGridView ? "h-72" : "h-120"
            }`}
          >
            <span className="animate-pulse">No Image Here</span>
          </div>
        )}

        <div className="flex flex-col justify-between text-bg p-4">
          {post.title && (
            <h3 className="text-lg font-semibold mb-2 capitalize">
              {post.title}
            </h3>
          )}

          <div
            className="text-bg/85 p-4 bg-main/50 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(post.id);
            }}
          >
            {isExpanded ? (
              <p className="text-sm leading-relaxed">{post.text}</p>
            ) : (
              <p className="text-sm leading-relaxed wrap-break-word">
                {truncateText(post.text)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center p-4 border-t border-main">
        <div className="flex items-center space-x-3">
          <div onClick={(e) => e.stopPropagation()}>
            <PostLikeButton postId={post.id} postAuthorId={post.authorId} />
          </div>

          <div onClick={(e) => e.stopPropagation()} className="text-bg">
            <PostCommentButton
              onCommentClick={() => router.push(`/post/${post.id}`)}
            />
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <CommentsCounter postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
