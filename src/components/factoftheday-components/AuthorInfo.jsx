export default function AuthorInfo({
  authorAvatar,
  authorName,
  authorEmail,
  date,
}) {
  return (
    <div className="flex justify-between items-center space-x-3">
      <div className="flex justify-center items-center gap-2">
        {authorAvatar ? (
          <img
            src={authorAvatar}
            alt="Author avatar"
            className="w-10 h-10 object-cover rounded-full"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="w-10 h-10 bg-main rounded-full flex items-center justify-center"
          style={{
            display: authorAvatar ? "none" : "flex",
          }}
        >
          <span className="text-bg text-sm font-bold">
            {(authorName || authorEmail || "A").charAt(0).toUpperCase()}
          </span>
        </div>

        <p className="text-bg font-medium capitalize">
          {authorName || authorEmail || "No Name Yet"}
        </p>
      </div>

      {date ? (
        <div className="inline-block text-bg bg-main/10 text-sm rounded-full px-2 py-1 capitalize">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ) : (
        <div className="text-xs text-bg/75">No Date</div>
      )}
    </div>
  );
}
