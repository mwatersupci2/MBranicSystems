import DualMobiusTori from '@/components/DualObjectTwistedTorus'

export default function DualObjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Dual Möbius Tori
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Explore two independent 3D Möbius tori with separate point-energy objects and independent controls
          </p>
        </div>
        
        <DualMobiusTori />
        
        <div className="max-w-4xl mx-auto mt-8 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Global Controls</h3>
              <ul className="space-y-2">
                <li>• <strong>Play/Pause:</strong> Start or stop the animation</li>
                <li>• <strong>Independent Tori:</strong> Each torus has separate controls</li>
                <li>• <strong>Color Coding:</strong> Blue for left torus, Red for right torus</li>
                <li>• <strong>Separate Visualizations:</strong> Toggle probability and vector fields independently</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Per-Torus Controls</h3>
              <ul className="space-y-2">
                <li>• <strong>Twist:</strong> Control Möbius twist amount (0-4)</li>
                <li>• <strong>Direction:</strong> Toggle clockwise/counterclockwise motion</li>
                <li>• <strong>Speed:</strong> Adjust movement speed (0.005-0.05)</li>
                <li>• <strong>Vibration:</strong> Control internal vibration strength (0-2)</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-700 bg-opacity-50 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-300 mb-1">Left Torus (Blue)</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• Starts at φ=0, θ=0</li>
                  <li>• Default twist: 1.0</li>
                  <li>• Default direction: +1 (clockwise)</li>
                  <li>• Default speed: 0.02</li>
                  <li>• Blue-cyan color scheme</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-300 mb-1">Right Torus (Red)</h4>
                <ul className="space-y-1 text-gray-300">
                  <li>• Starts at φ=π, θ=0</li>
                  <li>• Default twist: 1.2</li>
                  <li>• Default direction: -1 (counterclockwise)</li>
                  <li>• Default speed: 0.015</li>
                  <li>• Red-orange color scheme</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-700 bg-opacity-50 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Visual Elements</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• <strong>Independent Probability Fields:</strong> Separate probability visualizations for each torus</li>
              <li>• <strong>Independent Vector Fields:</strong> Separate flow arrows for each torus</li>
              <li>• <strong>Independent Trails:</strong> Each object leaves its own colored trail</li>
              <li>• <strong>Vibration Indicators:</strong> Different patterns for each object</li>
              <li>• <strong>Real-time Info:</strong> Current positions and parameters displayed on canvas</li>
              <li>• <strong>Separate Wireframes:</strong> Each torus has its own wireframe and center ring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
