"use client";

import { useEffect, useState, use } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import ProtectedRoute from "@/components/ProtectedRoute";
import PostLikeButton from "@/components/PostLikeButton";
import CommentItem from "@/components/CommentItem";
import { deletePost } from "@/lib/deletePost";
import { useAlert } from "@/lib/AlertContext";

export default function PostPage({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const resolvedParams = use(params);
  const postId = resolvedParams.id;
  const user = auth.currentUser;
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftText, setDraftText] = useState("");
  const alertHook = useAlert();
  const canEdit = !!(user && post && user.uid === post.authorId);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = doc(db, "posts", postId);
        const postSnapshot = await getDoc(postDoc);

        if (postSnapshot.exists()) {
          const postData = { id: postSnapshot.id, ...postSnapshot.data() };
          setPost(postData);
          setDraftTitle(postData.title || "");
          setDraftText(postData.text || "");
        } else {
          setError("Post not found");
        }
      } catch (err) {
        setError("Failed to load post");
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    const commentsQuery = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    });

    return unsubscribe;
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        text: newComment.trim(),
        authorId: auth.currentUser.uid,
        authorEmail: auth.currentUser.email,
        authorName: auth.currentUser.displayName || auth.currentUser.email,
        createdAt: Timestamp.now(),
      });

      // Create notification for post author (if not commenting on own post)
      if (post && post.authorId && post.authorId !== auth.currentUser.uid) {
        try {
          const { createCommentNotification } = await import(
            "@/lib/notifications"
          );
          await createCommentNotification(
            postId,
            post.authorId,
            auth.currentUser
          );
        } catch (notifError) {
          console.error("Failed to create comment notification:", notifError);
          // Don't fail the comment operation if notification fails
        }
      }

      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
      const { show } = alertHook;
      show && show("Failed to add comment", "error");
    }
  };

  const handleSave = async () => {
    if (!canEdit) {
      const { show } = alertHook;
      show && show("Not authorized to edit this post", "error");
      return;
    }

    try {
      const postDoc = doc(db, "posts", post.id);
      await updateDoc(postDoc, {
        title: draftTitle,
        text: draftText,
        updatedAt: serverTimestamp(),
      });

      setPost((prev) => ({ ...prev, title: draftTitle, text: draftText }));
      setEditing(false);
    } catch (err) {
      console.error("Edit failed", err);
      const { show } = alertHook;
      show && show(`Edit failed: ${err.message || err}`, "error");
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Delete this post?");
    if (!confirm) return;

    await deletePost(post.id);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading post...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !post) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">
              {error || "Post not found"}
            </p>
            <a
              href="/feed"
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              Back to Feed
            </a>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const handleReplyAdded = () => {
    // Comments will automatically refresh due to the onSnapshot listener
    // console.log("Reply added");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <article className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {post.authorName || post.authorEmail || "Anonymous"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Published on{" "}
                    {post.createdAt?.toDate
                      ? post.createdAt.toDate().toLocaleDateString()
                      : "Recently"}
                  </p>
                </div>
              </div>

              {editing ? (
                <input
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="text-3xl font-bold text-gray-900 mb-4 w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none"
                  placeholder="Post title"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {post.title || "Untitled Post"}
                </h1>
              )}

              {post.imageUrl && (
                <div className="mb-6">
                  <img
                    src={post.imageUrl}
                    alt="Post image"
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                {editing ? (
                  <textarea
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    className="w-full text-gray-800 leading-relaxed border-2 border-gray-300 rounded-lg p-3 focus:border-indigo-500 outline-none resize-none"
                    rows={6}
                    placeholder="Post content"
                  />
                ) : (
                  <p className="text-gray-800 leading-relaxed">{post.text}</p>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <PostLikeButton
                      postId={post.id}
                      postAuthorId={post.authorId}
                    />
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                      <span>💬</span>
                      <span>Comment</span>
                    </button>

                    {canEdit && (
                      <>
                        {editing && (
                          <button
                            onClick={handleSave}
                            className="text-sm text-green-500"
                          >
                            Save
                          </button>
                        )}
                        <button
                          onClick={() => setEditing(!editing)}
                          className="text-sm text-blue-500"
                        >
                          {editing ? "Cancel" : "Edit"}
                        </button>
                        <button
                          onClick={handleDelete}
                          className=" text-sm text-red-500"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Comments Section */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Comments
            </h3>

            <div className="space-y-4 mb-6">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    <CommentItem
                      postId={postId}
                      comment={comment}
                      onReplyAdded={handleReplyAdded}
                    />
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-4">
              <form onSubmit={handleAddComment} className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Add a comment..."
                  required
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
