"use client";

import { useCommentCount } from "@/hooks/useCommentCount";

export default function CommentsCounter({ postId }) {
  const commentCount = useCommentCount(postId);

  if (commentCount === 0) return null;

  return (
    <div className="flex items-center space-x-1 text-sm text-gray-500">
      <span className="text-lg">💬</span>
      <span>{commentCount}</span>
    </div>
  );
}
