import React from 'react';
import Image from 'next/image';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">MBranic Systems Blog</h1>
        
        <article className="prose prose-invert max-w-none">
          <header className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Monopole Branic Vector: A Theoretical Model</h2>
            <p className="text-gray-400 text-sm">Posted on {new Date().toLocaleDateString()}</p>
          </header>

          <div className="mb-8">
            <Image
              src="/images/monopole-branic-vector.jpg"
              alt="Artistic approximation of a monopole branic vector showing a luminous circular object with radiating filaments"
              width={600}
              height={600}
              className="rounded-lg mx-auto"
            />
            <p className="text-center text-sm text-gray-400 mt-2">
              Artistic approximation of a monopole branic vector
            </p>
          </div>

          <div className="relative">
            {/* Newspaper/Magazine Layout */}
            <div className="grid grid-cols-12 gap-6 text-lg leading-relaxed">
              
              {/* Left Column - Main Text */}
              <div className="col-span-12 md:col-span-7 space-y-6">
                <p>
                  Despite the ridicule of some, this (first image) is an artistic approximation of a monopole branic vector in my model. The center ring is the most probable place you'd find the 1D point-energy particle while the hair-like paths are vectors along which its vibrations allow it to be located if you were to freeze frame at any given point.
                </p>

                <p>
                  This combined vector is not unlike an electron's probability density cloud which (See second Image, uncertainty principle aka the cat, citation Chem.Libretexts.org) is probabilistic where you cannot determine its exact coordinates without observations and measuring it changes the location. As you get to the inner and outer edges the probability of collision diminishes allowing for a type of inverse square law comparable to gravity's mathematics.
                </p>

                {/* Right Panel - M1 Image */}
                <div className="float-right ml-6 mb-6 w-64 md:w-80">
                  <Image
                    src="https://wxgzrhzbhz6yju6a.public.blob.vercel-storage.com/M1"
                    alt="M1 Möbius configuration showing twisted torus geometry"
                    width={320}
                    height={320}
                    className="rounded-lg shadow-lg"
                  />
                  <p className="text-center text-sm text-gray-400 mt-2 italic">
                    M1 Möbius Configuration<br/>
                    <span className="text-xs">Twisted torus geometry</span>
                  </p>
                </div>

                <p>
                  When two of these objects are within each other's torus rings of influence then what you get is a probability gradient of collisions which allows for the emergence of "repulsion". So that repulsion need not be a "magical field" but the interaction of the point-energies collisions. In this way, only a 1-dimensional point-energy is required to demonstrate the emergence of a 3 dimensional field effect which can interact in a gradient with others of its kind.
                </p>

                <p>
                  Rules of spin and reverse spin for the ring are preserved, meaning a monopole can have an anti-monopole where their interactions nullify each other through collisions having their spin summations opposite. This would be the basis of a host of exotic effects I have not explored yet.
                </p>

                <p>
                  However in the rudimentary emergent system, if we take the torus and give it a center twist where the vector becomes a Möbius strip instead of a loop then what you end up with is at some points in the Möbius field you have normal interactions (repulsion) and when it flips around and inverts you have anti-normal collisions (attraction).
                </p>

                {/* Left Panel - M2 Image */}
                <div className="float-left mr-6 mb-6 w-64 md:w-80">
                  <Image
                    src="https://wxgzrhzbhz6yju6a.public.blob.vercel-storage.com/M2"
                    alt="M2 Möbius configuration showing alternative twisted geometry"
                    width={320}
                    height={320}
                    className="rounded-lg shadow-lg"
                  />
                  <p className="text-center text-sm text-gray-400 mt-2 italic">
                    M2 Möbius Configuration<br/>
                    <span className="text-xs">Alternative twisted geometry</span>
                  </p>
                </div>

                <p>
                  The primary assumption is that repulsion is 2/3rds more common than attraction otherwise the universe would become a solid block of point energy. And yet the attraction is what provides the larger systems emergent cohesions by creating nullification zones within the repulsion interactions.
                </p>

                <p className="text-gray-300 italic">
                  I don't know, it's a working postulate. Also kinda looks like a sand dollar. lol O_o The hairs should have more spiral spin to it and trail around a ways before snapping back as there's balancing forces between the centrifugal force and the vibration of the point energy, but I couldn't get the A.I. to paint it exactly how I see it. This of course is all theoretical musings and I can play around with the parameters to see what works.
                </p>

                <p className="text-gray-300 italic">
                  It's like building model trains but instead of trains it's trying... nevermind... lol O_o
                </p>
              </div>

              {/* Right Column - Sidebar */}
              <div className="col-span-12 md:col-span-5 space-y-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h4 className="text-xl font-bold mb-4 text-blue-400">Electron Probability Reference</h4>
                  <Image
                    src="/images/electron-probability-orbitals.jpg"
                    alt="Scientific diagram showing electron probability distributions for 1s, 2s, and 3s atomic orbitals"
                    width={400}
                    height={300}
                    className="rounded-lg mb-4"
                  />
                  <p className="text-sm text-gray-400 text-center mb-4">
                    Electron probability distributions for 1s, 2s, and 3s atomic orbitals<br/>
                    <span className="text-xs">(Chem.Libretexts.org)</span>
                  </p>
                  <p className="text-sm text-gray-300">
                    This reference shows how quantum mechanics describes electron probability clouds, 
                    similar to our branic vector model where the point-energy particle exists in 
                    a probability field rather than a fixed location.
                  </p>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <h4 className="text-xl font-bold mb-4 text-purple-400">Key Concepts</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span><strong>Monopole:</strong> Single point-energy particle</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span><strong>Dipole:</strong> Paired particles with opposite spin</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span><strong>Möbius Twist:</strong> Creates attraction/repulsion zones</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span><strong>Probability Field:</strong> 3D space of possible locations</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <h4 className="text-xl font-bold mb-4 text-orange-400">Theoretical Implications</h4>
                  <p className="text-sm text-gray-300">
                    This model suggests that fundamental forces like gravity and electromagnetism 
                    might emerge from the interaction of these branic vector fields, rather than 
                    being fundamental forces themselves.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Related Visualizations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Single Object Visualization</h4>
                <p className="text-gray-400 mb-4">Explore the basic monopole branic vector with interactive controls.</p>
                <a 
                  href="/visualization" 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                  View Single Object
                </a>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Dual Object Interaction</h4>
                <p className="text-gray-400 mb-4">See how two monopole branic vectors interact within each other's influence.</p>
                <a 
                  href="/dual-objects" 
                  className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                >
                  View Dual Objects
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
