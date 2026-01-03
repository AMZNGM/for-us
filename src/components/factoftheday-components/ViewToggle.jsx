export default function ViewToggle({ isGridView, onToggle, postCount }) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onToggle}
        className="text-main bg-main/15 rounded-full px-4 py-2 hover:bg-main/25 transition-colors flex items-center gap-2 cursor-pointer max-md:hidden"
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

      <div className="text-main bg-main/15 rounded-full px-4 py-2">
        {postCount} {postCount === 1 ? "Post" : "Posts"}
      </div>
    </div>
  );
}
