export default function YassiritaPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Yassirita</h1>
          <p className="text-xl text-gray-600">
            A special place for creativity and inspiration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Creative Space
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to Yassirita, where imagination meets reality. This is a
              dedicated space for exploring creative ideas, artistic
              expressions, and innovative projects.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Art & Design
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Discover unique artworks, design concepts, and creative projects
              that showcase the beauty of artistic expression and thoughtful
              design.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Featured Projects
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Digital Art Collection
              </h3>
              <p className="text-gray-600">
                A curated collection of digital artworks exploring themes of
                identity, culture, and modern life.
              </p>
            </div>
            <div className="border-l-4 border-pink-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Creative Workshops
              </h3>
              <p className="text-gray-600">
                Interactive workshops and tutorials designed to inspire
                creativity and develop artistic skills.
              </p>
            </div>
            <div className="border-l-4 border-indigo-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Community Gallery
              </h3>
              <p className="text-gray-600">
                A collaborative space where artists and creators can share their
                work and connect with others.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-linear-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
