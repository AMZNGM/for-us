export default function FeedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Feed</h1>

        <div className="space-y-6">
          {/* Sample post */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">User Name</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <p className="text-gray-800 mb-4">
              This is a sample post in your feed. You can replace this with
              actual post data.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <button className="hover:text-gray-700">Like</button>
              <button className="hover:text-gray-700">Comment</button>
              <button className="hover:text-gray-700">Share</button>
            </div>
          </div>

          {/* Another sample post */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Another User</p>
                <p className="text-sm text-gray-500">5 hours ago</p>
              </div>
            </div>
            <p className="text-gray-800 mb-4">
              Here's another post in your feed. The feed would typically show
              posts from people you follow.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <button className="hover:text-gray-700">Like</button>
              <button className="hover:text-gray-700">Comment</button>
              <button className="hover:text-gray-700">Share</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
