"use client";

import { use } from "react";
import { usePostPage } from "@/hooks/usePostPage";
import ProtectedRoute from "@/components/page-components/ProtectedRoute";
import LoadingFlower from "@/components/loading-components/LoadingFlower";
import PostSection from "@/components/post-components/PostSection";
import CommentsSection from "@/components/post-components/CommentsSection";
import GlobalModal from "@/components/ui/GlobalModal";
import PageWrapper from "@/components/page-components/PageWrapper";

export default function PostPage({ params }) {
  const resolvedParams = use(params);
  const postId = resolvedParams.id;

  const {
    loading,
    error,
    post,
    comments,
    newComment,
    editing,
    draftText,
    draftTitle,
    draftDate,
    activeImage,
    commentInputRef,
    canEdit,
    setNewComment,
    setEditing,
    setDraftText,
    setDraftTitle,
    setDraftDate,
    setActiveImage,
    handleCommentClick,
    handleAddComment,
    handleSave,
    handleDelete,
    handleReplyAdded,
  } = usePostPage(postId);

  if (loading) {
    return (
      <ProtectedRoute>
        <LoadingFlower />
      </ProtectedRoute>
    );
  }

  if (error || !post) {
    return (
      <ProtectedRoute>
        <div className="relative w-screen h-screen overflow-hidden bg-text flex justify-center items-center">
          <div className="absolute inset-0 w-full h-full border-8 border-main max-md:border-4 pointer-events-none z-10" />

          <p className="text-red-600 text-2xl bg-main rounded-2xl p-4 animate-bounce">
            💔 {error || "Post not found"} 💔
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PageWrapper>
        <div className="relative max-w-4xl mx-auto py-8 px-4 max-md:py-22">
          <PostSection
            post={post}
            editing={editing}
            setEditing={setEditing}
            draftTitle={draftTitle}
            setDraftTitle={setDraftTitle}
            draftText={draftText}
            setDraftText={setDraftText}
            draftDate={draftDate}
            setDraftDate={setDraftDate}
            canEdit={canEdit}
            handleSave={handleSave}
            handleDelete={handleDelete}
            handleCommentClick={handleCommentClick}
            setActiveImage={setActiveImage}
          />

          <CommentsSection
            postId={postId}
            comments={comments}
            newComment={newComment}
            setNewComment={setNewComment}
            handleAddComment={handleAddComment}
            handleReplyAdded={handleReplyAdded}
            commentInputRef={commentInputRef}
          />
        </div>

        <GlobalModal
          activeImage={activeImage}
          setActiveImage={setActiveImage}
        />
      </PageWrapper>
    </ProtectedRoute>
  );
}
