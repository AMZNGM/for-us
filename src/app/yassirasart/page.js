import ProtectedRoute from "@/components/ProtectedRoute";

export default function YassirasArtPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Yassira's Art
          </h1>

          <div className="mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to Yassira's art gallery. This space showcases creative
              works and artistic expressions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample art pieces */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-12 bg-gray-200 h-48 flex items-center justify-center">
                  <span className="text-gray-500">Artwork {item}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Artwork Title {item}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Description of this beautiful artwork piece. This would
                    typically include details about the medium, style, and
                    inspiration.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">2024</span>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About the Artist
            </h2>
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Yassira</h3>
                <p className="text-gray-600">Digital Artist & Creative</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Yassira is a passionate artist who explores various mediums and
              styles to create meaningful and visually striking works. With a
              focus on contemporary themes and innovative techniques, each piece
              tells a unique story and invites viewers to see the world through
              a different lens.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
