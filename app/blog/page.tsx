import React from 'react';
import Image from 'next/image';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">MBranic Systems Blog</h1>
        
        {/* First Post */}
        <article className="prose prose-invert max-w-none mb-16">
          <header className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Monopole Branic Vector: A Theoretical Model</h2>
            <p className="text-gray-400 text-sm">Posted on {new Date().toLocaleDateString()}</p>
          </header>

          <div className="mb-8">
            <Image
              src="https://wxgzrhzbhz6yju6a.public.blob.vercel-storage.com/M1"
              alt=" Artistic rendition of the monopole branic vector"
              width={600}
              height={600}
              className="rounded-lg mx-auto"
            />
            <p className="text-center text-sm text-gray-400 mt-2">
              Artistic rendition of the monopole branic vector
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


                <p>
                  When two of these objects are within each other's torus rings of influence then what you get is a probability gradient of collisions which allows for the emergence of "repulsion". So that repulsion need not be a "magical field" but the interaction of the point-energies collisions. In this way, only a 1-dimensional point-energy is required to demonstrate the emergence of a 3 dimensional field effect which can interact in a gradient with others of its kind.
                </p>

                <p>
                  Rules of spin and reverse spin for the ring are preserved, meaning a monopole can have an anti-monopole where their interactions nullify each other through collisions having their spin summations opposite. This would be the basis of a host of exotic effects I have not explored yet.
                </p>

                <p>
                  However in the rudimentary emergent system, if we take the torus and give it a center twist where the vector becomes a Möbius strip instead of a loop then what you end up with is at some points in the Möbius field you have normal interactions (repulsion) and when it flips around and inverts you have anti-normal collisions (attraction).
                </p>

                {/* Left Panel - Möbius Strip Configuration */}
                <div className="float-left mr-6 mb-6 w-64 md:w-80">
                  <Image
                    src="https://wxgzrhzbhz6yju6a.public.blob.vercel-storage.com/Dipole.png"
                    alt="Möbius strip configuration showing twisted geometry"
                    width={320}
                    height={320}
                    className="rounded-lg shadow-lg"
                  />
                  <p className="text-center text-sm text-gray-400 mt-2 italic">
                    Möbius Strip Configuration<br/>
                    <span className="text-xs">Twisted geometry with center twist</span>
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
                    src="https://wxgzrhzbhz6yju6a.public.blob.vercel-storage.com/M2"
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
                      <span><strong>Monopole:</strong> Single point-energy particle with a simple loop vector. With the point energys inharent wobble or vibration the loop gives the vector a probabiltiy density field. gradiant we see as a torus shell a.k.a a donut.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span><strong>Dipole:</strong> Vector has a twist causeing a mobius strip path for the loop </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span><strong>Möbius Twist:</strong> The dipole path creates attraction/repulsion zones however both are the result of collisions. Attraction is simply repulsion that caused a backwards spin causing a nullification effect.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span><strong>Probability Field:</strong> 3D space of possible locations: Torus, Mobius, Knot and any half steps in between that are shown to be stable</span>
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

        {/* Second Post */}
        <article className="prose prose-invert max-w-none">
          <header className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Monist Modal Postulates: Gradient Interactions Without Outside Force</h2>
            <p className="text-gray-400 text-sm">Posted on {new Date(Date.now() + 86400000).toLocaleDateString()}</p>
            <p className="text-sm text-yellow-400 italic">Rough drafts aka not refined modals, aka this is fun to me and I am a Nerd.</p>
          </header>

          <div className="space-y-8 text-lg leading-relaxed">
            
            {/* Core Postulates */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-6 text-green-400">Core Postulates</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold mb-3 text-blue-400">1. Self-Contained Dynamics</h4>
                  <div className="space-y-2 text-gray-300">
                    <p>✅ <strong>Spindles are emitted from internal rotation</strong> — not assumed as separate fields or particles. The spindles are not physical but represent the point-energies vector field paths. These spindles are like common game trails animals use. They just form naturally based on the point-energies inharent factors.</p>
                    <p>✅ <strong>Loop motion is self-orbiting, with an offset center</strong> — this explains the torus geometry and internal center point.</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-3 text-red-400">2. Repulsion Emergence</h4>
                  <div className="space-y-2 text-gray-300">
                    <p>✅ <strong>Repulsion is modeled as collisions between spindles</strong> sweeping through void space.</p>
                    <p>✅ <strong>The frequency of collisions increases ∝ inverse-square</strong> as two loops come closer.</p>
                    <p>✅ <strong>This matches the qualitative form of Coulomb/magnetic repulsion</strong> — but without fields.</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-3 text-purple-400">3. Attraction Emergence</h4>
                  <div className="space-y-2 text-gray-300">
                    <p>✅ <strong>When loops twist through the Möbius vector path</strong>, spindles enter a counter-phase region.</p>
                    <p>✅ <strong>Spindle "collisions" cancel out</strong> — reducing repulsion and creating a "grip" zone where approach is free.</p>
                    <p>✅ <strong>This is a directional, conditional attraction</strong>, rather than passive gravitational pull — which aligns with dipole–monopole dynamics.</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-3 text-orange-400">4. No Forces at a Distance</h4>
                  <div className="space-y-2 text-gray-300">
                    <p>✅ <strong>There are no abstract "forces"</strong> acting between point-energies in the void.</p>
                    <p>✅ <strong>All interactions are local, tactile, and emergent</strong> from topology and motion.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weaknesses Section */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">🔍 Weaknesses or Gaps to Address</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-2 px-3">Area</th>
                      <th className="text-left py-2 px-3">Status</th>
                      <th className="text-left py-2 px-3">Comment</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-gray-700">
                      <td className="py-2 px-3"><strong>Multi-body recursion</strong></td>
                      <td className="py-2 px-3"><span className="text-yellow-400">⚠️ Incomplete</span></td>
                      <td className="py-2 px-3">Two-body systems behave as expected. Multi-body coherence (e.g. stable orbits, mass-chain) not yet tested.</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 px-3"><strong>Energy conservation</strong></td>
                      <td className="py-2 px-3"><span className="text-yellow-400">⚠️ Abstracted</span></td>
                      <td className="py-2 px-3">The model lacks explicit measures of energy, momentum, or entropy — may need formalization.</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 px-3"><strong>Field approximation</strong></td>
                      <td className="py-2 px-3"><span className="text-yellow-400">⚠️ Emergent only</span></td>
                      <td className="py-2 px-3">There is no field; field-like effects must emerge statistically — not yet tested.</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3"><strong>Real-world mapping</strong></td>
                      <td className="py-2 px-3"><span className="text-blue-400">🧪 Theoretical</span></td>
                      <td className="py-2 px-3">It currently mimics charge/mass behavior, but it needs connection to dimensional physics (e.g. quantum numbers, Planck scale).</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Assumed Constraints */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-6 text-indigo-400">🧠 Assumed Constraints</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• <strong>Monist ontology</strong></li>
                <li>• <strong>Void space</strong> (no preexisting geometry or force)</li>
                <li>• <strong>Point-energy as the only substance</strong></li>
                <li>• <strong>Emergent force via local geometry and motion</strong></li>
                <li>• <strong>No hidden variables or magic constants</strong> - initial motion of creation and a single created unit type of energy is all that's required.</li>
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-orange-500">
              <h3 className="text-xl font-bold mb-4 text-orange-400">Disclaimer</h3>
              <p className="text-gray-300 mb-4">
                This is not yet a field theory, its an amateur physics musing which can be the foundational 
                geometric-mechanical framework from which both attraction and repulsion emerge naturally in 
                foundational string theory. I've been working on the general modal since grade 6.
              </p>
            </div>

            {/* Theoretical Physicists */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-cyan-400">*** Theoretical polyist physicists*** you would need to read to understand what I am talking about here:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-gray-300">
                  <p>• Edward Witten</p>
                  <p>• Cumrun Vafa</p>
                  <p>• Lisa Randall</p>
                </div>
                <div className="text-gray-300">
                  <p>• Nima Arkani-Hamed</p>
                  <p>• Shing-Tung Yau</p>
                  <p>• Barton Zwiebach</p>
                </div>
                <div className="text-gray-300">
                  <p>• Antoine Suarez</p>
                  <p className="text-xs text-gray-500">(indirectly relevant)</p>
                </div>
              </div>
            </div>

            {/* Final Note */}
            <div className="bg-red-900 p-6 rounded-lg border-l-4 border-red-500">
              <p className="text-red-200 text-lg font-medium">
                Lastly to the random ignorant who attempts to use my postulets as "if your theory does what you say it does then you would have won the nobel prize"..... 
                yeah that's not how postulets and modals work. Just sit down and go away. Stay off my profile... O_o
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
