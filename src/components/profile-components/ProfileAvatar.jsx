import { useRef } from "react";

export default function ProfileAvatar({ preview, onAvatarChange }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-6 mb-6">
      <div className="mt-2">
        {preview ? (
          <img
            src={preview}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-text/20 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={handleClick}
          />
        ) : (
          <div
            className="w-24 h-24 rounded-full bg-text/20 flex items-center justify-center cursor-pointer hover:bg-text/30 transition-colors"
            onClick={handleClick}
          >
            <span className="text-2xl">?</span>
          </div>
        )}
      </div>

      <div className="flex-1">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={onAvatarChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleClick}
          className="text-sm py-2 px-4 rounded-full bg-text/20 text-text hover:bg-main transition-colors font-medium cursor-pointer"
        >
          Change Photo
        </button>
      </div>
    </div>
  );
}
