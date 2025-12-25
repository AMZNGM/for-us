export default function PostPage({ params }) {
  // In a real app, you would fetch the post data based on the id
  const postId = params.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <article className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Author Name
                </h2>
                <p className="text-sm text-gray-500">
                  Published on {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Post Title - ID: {postId}
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-800 leading-relaxed mb-4">
                This is the content of post #{postId}. In a real application,
                this would be fetched from your database or API based on the
                post ID.
              </p>
              <p className="text-gray-800 leading-relaxed mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-gray-800 leading-relaxed">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                    <span>❤️</span>
                    <span>Like</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                    <span>💬</span>
                    <span>Comment</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                    <span>🔗</span>
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Comments</h3>

          <div className="space-y-4 mb-6">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full shrink-0"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Commenter Name</p>
                <p className="text-gray-800">
                  This is a sample comment on the post.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Add a comment..."
            />
            <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
