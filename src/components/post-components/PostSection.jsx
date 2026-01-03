import PostLikeButton from "@/components/post-components/PostLikeButton";
import PostCommentButton from "@/components/post-components/PostCommentButton";
import MainBtn from "@/components/ui/buttons/MainBtn";

export default function PostSection({
  post,
  editing,
  setEditing,
  draftTitle,
  setDraftTitle,
  draftText,
  setDraftText,
  draftDate,
  setDraftDate,
  canEdit,
  handleSave,
  handleDelete,
  handleCommentClick,
  setActiveImage,
}) {
  return (
    <article className="bg-text shadow rounded-2xl p-8 max-md:p-4">
      <div className="flex items-center space-x-4 mb-6">
        {post.authorAvatar ? (
          <img
            src={post.authorAvatar}
            alt="Author avatar"
            className="w-12 h-12 bg-main rounded-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
        ) : null}
        <div
          className={`w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center ${
            post.authorAvatar ? "hidden" : ""
          }`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="12" fill="#E5E7EB" />
            <circle cx="12" cy="9" r="4" fill="#9CA3AF" />
            <path
              d="M4 20C4 16.134 7.134 13 11 13H13C16.866 13 20 16.134 20 20"
              fill="#9CA3AF"
            />
          </svg>
        </div>
        <div className="w-full flex justify-between items-center">
          <h2 className="text-lg font-medium text-bg">
            {post.authorName || post.authorEmail || "Anonymous"}
          </h2>

          {post.date ? (
            <div className="font-medium text-bg/75 bg-main/10 px-3 py-1 rounded-full inline-block">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          ) : (
            <div className="text-sm font-medium text-bg/75 bg-main/10 px-3 py-1 rounded-full inline-block">
              No Date
            </div>
          )}
        </div>
      </div>

      {editing ? (
        <input
          onChange={(e) => setDraftTitle(e.target.value)}
          value={draftTitle}
          placeholder="Post title"
          className="w-full bg-main/25 text-bg/75 text-3xl font-bold border border-text/20 underline underline-offset-8 rounded-lg shadow-2xs placeholder-main/50 outline-none mb-4 px-3 py-2"
        />
      ) : (
        <h1 className="text-3xl font-bold text-bg capitalize mb-4">
          {post.title || "Untitled Post"}
        </h1>
      )}

      {editing && (
        <input
          type="date"
          onChange={(e) => setDraftDate(e.target.value)}
          value={draftDate}
          className="w-full bg-main/25 text-bg/75 border border-text/20 rounded-lg shadow-2xs placeholder-main/50 outline-none mb-4 px-3 py-2"
        />
      )}

      {post.imageUrl && (
        <div className="mb-6">
          <img
            onClick={() => setActiveImage(post.imageUrl)}
            src={post.imageUrl}
            alt="Post image"
            className="w-full h-96 object-cover rounded-lg cursor-pointer"
          />
        </div>
      )}

      {editing ? (
        <textarea
          onChange={(e) => setDraftText(e.target.value)}
          value={draftText}
          rows={13}
          placeholder="Post content"
          className="w-full bg-main/25 text-bg/75 font-bold border border-text/20 rounded-lg shadow-2xs placeholder-main/50 outline-none mb-4 px-3 py-2"
        />
      ) : (
        <p className="text-bg leading-relaxed bg-main/15 rounded-2xl p-3 wrap-break-word overflow-wrap-anywhere">
          {post.text}
        </p>
      )}

      <div className="w-full flex justify-between items-center pt-6">
        <div className="flex items-center space-x-4">
          <PostLikeButton postId={post.id} postAuthorId={post.authorId} />
          <PostCommentButton onCommentClick={handleCommentClick} />
        </div>

        {canEdit && (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                if (!editing) {
                  setDraftTitle(post.title || "");
                  setDraftText(post.text || "");
                  setDraftDate(post.date || "");
                }
                setEditing(!editing);
              }}
              className="bg-main/25 text-blue-500 rounded-2xl cursor-pointer py-2 px-3 hover:bg-main/50 transition-colors"
            >
              {editing ? "Cancel" : "Edit"}
            </button>

            <button
              onClick={handleDelete}
              className="bg-main/25 text-red-500 rounded-2xl cursor-pointer py-2 px-3 hover:bg-main/50 transition-colors"
            >
              Delete
            </button>

            {editing && <MainBtn onClick={handleSave}>Save</MainBtn>}
          </div>
        )}
      </div>
    </article>
  );
}
