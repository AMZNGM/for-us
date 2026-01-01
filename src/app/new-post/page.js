"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createPost } from "@/lib/firebase";
import { useAlert } from "@/lib/AlertContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainBtn from "@/components/ui/buttons/MainBtn";

export default function NewPostPage() {
  const alert = useAlert();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e && e.preventDefault();

    if (!auth.currentUser) {
      alert.show("You must be logged in to publish a post.", "info");
      return;
    }

    try {
      setLoading(true);
      const postId = await createPost({
        title,
        text,
        date,
        imageFile: image,
        authorId: auth.currentUser.uid,
        authorEmail: auth.currentUser.email,
        authorName: auth.currentUser.displayName || auth.currentUser.email,
        authorAvatar:
          auth.currentUser.photoURL || "/images/abdelrahman-avatar.webp",
      });

      setTitle("");
      setText("");
      setDate("");
      setImage(null);
      alert?.show && alert.show("Post created ❤️", "success");

      router.push(`/post/${postId}`);
    } catch (err) {
      console.error("createPost error", err);
      alert?.show &&
        alert.show(`Failed to create post: ${err.message || err}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="relative w-screen min-h-screen overflow-hidden bg-text text-bg">
        <div className="absolute inset-0 w-full h-full border-8 border-gold max-md:border-4 pointer-events-none z-10" />

        <div className="max-w-4xl mx-auto py-24 px-4 max-md:py-22">
          <h1 className="text-3xl font-bold text-bg text-shadow-lg mb-8">
            Create New Post
          </h1>

          <div className="bg-white shadow-xl rounded-2xl mt-8 p-8 max-md:p-4">
            <form className="space-y-6" onSubmit={submit}>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full bg-gold/15 border border-bg/50 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold transition-colors px-3 py-2"
                  placeholder="Enter your post title"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="w-full bg-gold/15 border border-bg/50 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold transition-colors px-3 py-2"
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={8}
                  className="w-full bg-gold/15 border border-bg/50 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold transition-colors px-3 py-2"
                  placeholder="Write your post content here..."
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Image (optional)
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  className="w-full bg-gold/15 border border-bg/50 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold hover:bg-gold/50 transition-colors px-3 py-2 cursor-pointer"
                  onChange={(e) =>
                    setImage(e.target.files && e.target.files[0])
                  }
                />
              </div>

              <div className="flex justify-end space-x-4">
                <MainBtn
                  onClick={() => {
                    setTitle("");
                    setText("");
                    setDate("");
                    setImage(null);
                  }}
                  className="font-main shadow"
                >
                  Cancel
                </MainBtn>

                <button
                  type="submit"
                  className="bg-gold hover:bg-indigo-500 hover:text-text font-bold rounded-lg shadow transition-colors cursor-pointer py-2 px-4"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Publishing...
                    </span>
                  ) : (
                    "Publish"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
