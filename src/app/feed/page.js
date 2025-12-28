"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPosts } from "@/lib/getPosts";
import ProtectedRoute from "@/components/ProtectedRoute";
import PostLikeButton from "@/components/PostLikeButton";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Feed</h1>

          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <p className="text-gray-500">
                  No posts yet. Create your first post!
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/post/${post.id}`)}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {post.authorName || post.authorEmail || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {post.createdAt?.toDate
                          ? post.createdAt.toDate().toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>
                  </div>

                  {post.title && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h3>
                  )}

                  <p className="text-gray-800 mb-4">{post.text}</p>

                  {post.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={post.imageUrl}
                        alt="Post image"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div onClick={(e) => e.stopPropagation()}>
                      <PostLikeButton
                        postId={post.id}
                        postAuthorId={post.authorId}
                      />
                    </div>
                    <button
                      className="hover:text-gray-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
