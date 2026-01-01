"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPosts } from "@/lib/getPosts";
import ProtectedRoute from "@/components/ProtectedRoute";
import GradientCursor from "@/components/ui/cursors/GradientCursor";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import PostLikeButton from "@/components/post-components/PostLikeButton";
import PostCommentButton from "@/components/post-components/PostCommentButton";

export default function FactOfTheDayPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [isGridView, setIsGridView] = useState(true);

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

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <ProtectedRoute>
      <GradientCursor />
      <ScrollIndicator />

      <div className="relative w-screen min-h-screen overflow-hidden bg-bg text-text">
        <Image
          src="/images/yassirita/yassirita-12.webp"
          alt="background"
          fill
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-15 blur-xl z-0"
        />

        <div className="absolute inset-0 w-full h-full border-8 border-gold max-md:border-4 pointer-events-none z-10" />

        <div
          className={`mx-auto py-24 px-4
            ${isGridView ? "max-w-7xl" : "max-w-4xl"}
            `}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl text-gold font-sec">Fact of the day</h1>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsGridView(!isGridView)}
                className="text-gold bg-gold/15 rounded-full px-4 py-2 hover:bg-gold/25 transition-colors flex items-center gap-2 cursor-pointer"
              >
                {isGridView ? (
                  <>
                    <span>☰</span>
                    <span>List</span>
                  </>
                ) : (
                  <>
                    <span>⊞</span>
                    <span>Grid</span>
                  </>
                )}
              </button>
              <div className="text-gold bg-gold/15 rounded-full px-4 py-2">
                {posts.length} {posts.length === 1 ? "Post" : "Posts"}
              </div>
            </div>
          </div>

          <div
            className={
              isGridView
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {posts.length === 0 ? (
              <div className="col-span-full bg-text text-center shadow rounded-2xl p-8">
                <p className="text-bg">No posts yet. Create your first post!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => router.push(`/post/${post.id}`)}
                  className="bg-text flex flex-col justify-between shadow rounded-2xl hover:shadow-xl transition-shadow overflow-hidden cursor-pointer"
                >
                  <div>
                    <div className="border-b border-gold p-4">
                      <div className="flex justify-between items-center space-x-3">
                        <div className="flex justify-center items-center gap-2">
                          <img
                            src={post.authorAvatar}
                            alt="Author avatar"
                            className="w-10 h-10 bg-gold object-cover rounded-full"
                          />

                          <p className="text-bg font-medium">
                            {post.authorName ||
                              post.authorEmail ||
                              "No Name Yet"}
                          </p>
                        </div>

                        {post.date ? (
                          <div className="inline-block text-bg bg-gold/10 text-sm rounded-full px-2 py-1">
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        ) : (
                          <div className="text-xs text-bg/75">No Date</div>
                        )}
                      </div>
                    </div>

                    {post.imageUrl ? (
                      <div
                        className={`overflow-hidden
                      ${isGridView ? "h-72" : "h-120"}
                    `}
                      >
                        <img
                          src={post.imageUrl}
                          alt="Post image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`bg-gold text-bg flex justify-center items-center
                      ${isGridView ? "h-72" : "h-120"}
                    `}
                      >
                        <span className="animate-pulse">No Image Here</span>
                      </div>
                    )}

                    <div className="flex flex-col justify-between text-bg p-4">
                      {post.title && (
                        <h3 className="text-lg font-semibold mb-2">
                          {post.title}
                        </h3>
                      )}

                      <div className="text-bg/85 mb-4">
                        {expandedPosts.has(post.id) ? (
                          <p className="text-sm leading-relaxed">{post.text}</p>
                        ) : (
                          <p className="text-sm leading-relaxed wrap-break-word">
                            {truncateText(post.text)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 border-t border-gold">
                    <div className="flex items-center space-x-3">
                      <div onClick={(e) => e.stopPropagation()}>
                        <PostLikeButton
                          postId={post.id}
                          postAuthorId={post.authorId}
                        />
                      </div>

                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="text-bg"
                      >
                        <PostCommentButton
                          onCommentClick={() => router.push(`/post/${post.id}`)}
                        />
                      </div>
                    </div>
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
