import DualToriPointEnergySystem from '@/components/DualToriPointEnergySystem';

export default function DualObjectsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Dual Tori Point Energy System
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <p className="text-gray-300 text-lg leading-relaxed">
            This visualization demonstrates two independent 3D Möbius tori with point-energy objects 
            and realistic repulsion physics. Each torus represents a probability field where the 
            point-energy particle can exist. When the particles get close, the systems experience 
            repulsion forces, pushing the tori apart in 3D space.
          </p>
        </div>

        <DualToriPointEnergySystem />
      </div>
    </div>
  );
}
