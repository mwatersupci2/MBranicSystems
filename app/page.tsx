import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Twisted Torus
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Explore the fascinating world of 3D Möbius topology through interactive vector field visualization
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/visualization"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
            >
              View Visualization
            </Link>
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🌀</div>
            <h3 className="text-xl font-bold text-white mb-3">3D Möbius Topology</h3>
            <p className="text-gray-300">
              Experience the unique properties of a single-sided surface through mathematical visualization
            </p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-white mb-3">Interactive Controls</h3>
            <p className="text-gray-300">
              Adjust vibration strength, center twist, and toggle vector fields in real-time
            </p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-white mb-3">Beautiful Visualization</h3>
            <p className="text-gray-300">
              Watch as probability fields and vector flows create stunning rainbow patterns
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">About the Visualization</h2>
          <p className="text-lg text-gray-300 mb-6">
            This interactive visualization demonstrates the complex dynamics of a point-energy object 
            moving through a 3D Möbius torus. The center ring is twisted in 3D space, creating a 
            single-sided surface with fascinating mathematical properties.
          </p>
          <p className="text-lg text-gray-300">
            The visualization includes probability fields, vector flows, and real-time physics 
            simulation, all rendered with beautiful color gradients that respond to the 3D topology.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 bg-opacity-50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Twisted Torus Visualization. Built with Next.js and React.
          </p>
        </div>
      </footer>
    </div>
  )
}

