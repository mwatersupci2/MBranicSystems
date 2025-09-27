import TwistedCenterTorusVectorField from '@/components/TwistedCenterTorusVectorField'

export default function VisualizationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Interactive 3D Möbius Torus
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Explore the fascinating dynamics of point-energy in a twisted 3D torus with real-time controls
          </p>
        </div>
        
        <TwistedCenterTorusVectorField />
        
        <div className="max-w-4xl mx-auto mt-8 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Controls</h3>
              <ul className="space-y-2">
                <li>• <strong>Play/Pause:</strong> Start or stop the animation</li>
                <li>• <strong>Vector Field:</strong> Toggle flow arrows on/off</li>
                <li>• <strong>Probability:</strong> Toggle probability density visualization</li>
                <li>• <strong>Vibration:</strong> Adjust internal vibration strength (0-2)</li>
                <li>• <strong>Center Twist:</strong> Control the Möbius twist amount (0-4)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Visual Elements</h3>
              <ul className="space-y-2">
                <li>• <strong>Rainbow Object:</strong> The main point-energy particle</li>
                <li>• <strong>Purple Line:</strong> The twisted center ring</li>
                <li>• <strong>Colored Trail:</strong> Path history of the particle</li>
                <li>• <strong>Dots:</strong> 3D probability field</li>
                <li>• <strong>Arrows:</strong> Vector field showing flow direction</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

