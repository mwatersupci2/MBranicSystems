import DualMobiusTori3D from '@/components/DualObjectTwistedTorus3D';

export default function DualObjects3DPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Dual Möbius Tori - 3D Rendering
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <p className="text-gray-300 text-lg leading-relaxed">
            This visualization uses Three.js for true 3D rendering of the dual Möbius tori. 
            The tori represent probability fields of point-energy particles, with the yellow and cyan 
            spheres showing the actual particle positions. The wireframe structure shows the 
            Möbius topology, and the colored points represent the probability density field.
          </p>
        </div>

        <DualMobiusTori3D />
      </div>
    </div>
  );
}
