"use client";

import { useState } from "react";
import { createPost } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAlert } from "@/lib/AlertContext";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const alertHook = useAlert();

  const submit = async (e) => {
    e && e.preventDefault();

    if (!auth.currentUser) {
      alertHook?.show &&
        alertHook.show("You must be logged in to publish a post.", "info");
      return;
    }

    try {
      await createPost({
        title,
        text,
        imageFile: image,
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || auth.currentUser.email,
      });

      setTitle("");
      setText("");
      setImage(null);
      alertHook?.show && alertHook.show("Post created ❤️", "success");
    } catch (err) {
      console.error("createPost error", err);
      alertHook?.show &&
        alertHook.show(`Failed to create post: ${err.message || err}`, "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Create New Post
          </h1>

          <div className="bg-white shadow rounded-lg p-6">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your post title"
                  onChange={(e) => setTitle(e.target.value)}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) =>
                    setImage(e.target.files && e.target.files[0])
                  }
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={() => {
                    setTitle("");
                    setText("");
                    setImage(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
