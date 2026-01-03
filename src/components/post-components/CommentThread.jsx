"use client";

import CommentItem from "@/components/post-components/CommentItem";
import MainBtn from "@/components/ui/buttons/MainBtn";

export default function CommentThread({
  postId,
  comment,
  allComments,
  onReplyAdded,
  onReplyClick,
  replyingTo,
  replyText,
  setReplyText,
  handleReplySubmit,
  setReplyingTo,
  level = 0,
}) {
  const replies = allComments.filter((c) => c.parentCommentId === comment.id);

  return (
    <div className={`${level > 0 ? "ml-8" : ""}`}>
      <CommentItem
        postId={postId}
        comment={comment}
        onReplyAdded={onReplyAdded}
        onReplyClick={onReplyClick}
      />

      {replyingTo === comment.id && (
        <div className="mt-4 bg-main/10 rounded-2xl p-4">
          <form
            onSubmit={(e) => handleReplySubmit(e, comment.id)}
            className="space-y-2"
          >
            <textarea
              onChange={(e) => setReplyText(e.target.value)}
              required
              rows={9}
              value={replyText}
              placeholder="bebbeeebe, Escribe una respuesta..."
              className="w-full bg-main/15 border-3 border-bg/10 rounded-md focus:outline-none focus:border-main transition-colors px-3 py-2"
            />

            <div className="flex gap-2">
              <MainBtn
                type="submit"
                disabled={!replyText.trim()}
                className="font-main"
              >
                {!replyText.trim()
                  ? "Write reply first Hermosa 🫶"
                  : "lesgooooooo 🚀 add this reply"}
              </MainBtn>

              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="flex justify-center items-center bg-main/25 text-red-500 hover:text-blue-700 rounded-2xl cursor-pointer hover:bg-main/50 transition-colors p-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {replies.map((reply) => (
            <CommentThread
              key={reply.id}
              postId={postId}
              comment={reply}
              allComments={allComments}
              onReplyAdded={onReplyAdded}
              onReplyClick={onReplyClick}
              replyingTo={replyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              handleReplySubmit={handleReplySubmit}
              setReplyingTo={setReplyingTo}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
