export default function PostCommentButton({ onCommentClick }) {
  const handleClick = () => {
    if (!onCommentClick) return;
    onCommentClick();
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="bg-main/50 rounded-2xl cursor-pointer py-2 px-3 hover:bg-main/50 transition-colors"
      >
        💬 Comment
      </button>
    </div>
  );
}
